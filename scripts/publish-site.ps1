param(
    [Parameter(Mandatory)][string]$Bundle,
    [Parameter(Mandatory)][string]$ExpectedCurrent,
    [string]$GcloudSdk = $env:GB_GCLOUD_SDK,
    [switch]$ValidateOnly
)

$ErrorActionPreference = 'Stop'
if (-not $GcloudSdk) {
    $sdkCache = Join-Path $env:USERPROFILE '.cache/gb-films-tools'
    $sdkCandidate = Get-ChildItem -LiteralPath $sdkCache -Directory -ErrorAction SilentlyContinue |
        Where-Object Name -Like 'gcloud-*' | Sort-Object LastWriteTime -Descending | Select-Object -First 1
    if ($sdkCandidate) { $GcloudSdk = Join-Path $sdkCandidate.FullName 'google-cloud-sdk' }
}
if (-not $GcloudSdk) { throw 'Indicar GB_GCLOUD_SDK con la carpeta de Google Cloud SDK.' }
$sdkPython = Join-Path $GcloudSdk 'platform/bundledpython/python.exe'
$sdkEntry = Join-Path $GcloudSdk 'lib/gcloud.py'
if (-not (Test-Path -LiteralPath $sdkPython) -or -not (Test-Path -LiteralPath $sdkEntry)) {
    throw 'Google Cloud SDK con Python incluido no está disponible.'
}

$bundlePath = (Resolve-Path -LiteralPath $Bundle).Path
$bundleName = Split-Path -Leaf $bundlePath
if ($bundleName -notmatch '^(\d{8}T\d{6}Z-[0-9a-f]{7,40}-production)\.tar\.gz$') {
    throw 'Se requiere un paquete nuevo de producción generado por release:production.'
}
$releaseId = $Matches[1]
if ($ExpectedCurrent -notmatch '^releases/\d{8}T\d{6}Z-[0-9a-f]{7,40}-production/site$') {
    throw 'ExpectedCurrent debe identificar la release pública comprobada previamente.'
}
$manifestPath = Join-Path (Join-Path (Split-Path -Parent $bundlePath) $releaseId) 'manifest.json'
$manifest = Get-Content -LiteralPath $manifestPath -Raw | ConvertFrom-Json
if ($manifest.id -ne $releaseId -or $manifest.channel -ne 'production' -or $manifest.dirty) {
    throw 'El manifiesto debe corresponder a una release de producción con un commit limpio.'
}
$bundleHash = (Get-FileHash -LiteralPath $bundlePath -Algorithm SHA256).Hash.ToLowerInvariant()
& $sdkPython (Join-Path $PSScriptRoot 'deploy-release.py') $bundlePath --sha256 $bundleHash --channel production --check-only
if ($LASTEXITCODE -ne 0) { throw 'Falló la validación local del paquete.' }
if ($ValidateOnly) {
    [pscustomobject]@{ release = $releaseId; sha256 = $bundleHash; expectedCurrent = $ExpectedCurrent; valid = $true } | ConvertTo-Json
    return
}

function Invoke-Cloud {
    param([string[]]$GcloudArguments)
    $cloudOutput = & $sdkPython $sdkEntry @GcloudArguments
    if ($LASTEXITCODE -ne 0) { throw "Google Cloud terminó con código $LASTEXITCODE." }
    return ($cloudOutput -join "`n")
}

$activeAccount = Invoke-Cloud -GcloudArguments @('auth', 'list', '--filter=status:ACTIVE', '--format=value(account)')
if (([string]$activeAccount).Trim() -ne 'info@granbertafilms.com') {
    throw 'Iniciar sesión de Google Cloud SDK con info@granbertafilms.com antes de publicar.'
}
$taskKeyDirectory = Join-Path ([IO.Path]::GetTempPath()) ('gbfilms-publish-ssh-' + [guid]::NewGuid().ToString('N'))
New-Item -ItemType Directory -Path $taskKeyDirectory | Out-Null
$taskKeyFile = Join-Path $taskKeyDirectory 'id_rsa'
$keyExpiration = [DateTime]::UtcNow.AddMinutes(15).ToString("yyyy-MM-ddTHH:mm:ssZ")
$common = @('--project=gran-berta-films', '--zone=northamerica-northeast1-a', '--quiet', "--ssh-key-file=$taskKeyFile", "--ssh-key-expiration=$keyExpiration")
$instance = 'info@wordpress-1-vm'
$remoteStage = $null
try {
    $current = Invoke-Cloud -GcloudArguments (@('compute', 'ssh', $instance, '--command=readlink /var/www/granberta-nueva/current') + $common)
    if ($current.Trim() -ne $ExpectedCurrent) { throw "Cambió la versión pública: $current. Revisar antes de publicar." }
    $previousId = $ExpectedCurrent.Split('/')[1]
    $previousManifest = Join-Path (Split-Path -Parent $bundlePath) "$previousId/manifest.json"
    & $sdkPython (Join-Path $PSScriptRoot 'pack-changes.py') $bundlePath $previousManifest $taskKeyDirectory
    if ($LASTEXITCODE -ne 0) { throw 'Falló la preparación de los archivos modificados.' }
    $changes = Join-Path $taskKeyDirectory 'changes.tar.gz'
    $reuseList = Join-Path $taskKeyDirectory 'reuse.list'
    $changesHash = (Get-FileHash -LiteralPath $changes).Hash.ToLowerInvariant()
    $listHash = (Get-FileHash -LiteralPath $reuseList).Hash.ToLowerInvariant()
    $remoteStage = (Invoke-Cloud -GcloudArguments (@('compute', 'ssh', $instance, '--command=mktemp -d /tmp/gbfilms-publish.XXXXXXXXXX') + $common)).Trim()
    if ($remoteStage -cnotmatch '^/tmp/gbfilms-publish\.[A-Za-z0-9]{10}$') { throw 'Carpeta de transferencia inesperada.' }
    $remoteBundle = "$remoteStage/site.tar.gz"
    Invoke-Cloud -GcloudArguments (@('compute', 'scp', $changes, $reuseList, "${instance}:$remoteStage/") + $common) | Write-Output
    $prepare = "cd $remoteStage && echo '$changesHash  changes.tar.gz' | sha256sum -c --status && echo '$listHash  reuse.list' | sha256sum -c --status && gzip -dc changes.tar.gz > site.tar && tar --append --file=$remoteStage/site.tar --directory=/var/www/granberta-nueva/releases/$previousId --null --files-from=$remoteStage/reuse.list && gzip -1 site.tar && sha256sum site.tar.gz"
    $digestLine = Invoke-Cloud -GcloudArguments (@('compute', 'ssh', $instance, "--command=$prepare") + $common)
    if ($digestLine.Trim() -cnotmatch '^([0-9a-f]{64})  site\.tar\.gz$') { throw 'La VM no confirmó el paquete reconstruido.' }
    $installedHash = $Matches[1]
    $checkCommand = "/usr/local/sbin/granberta-deploy $remoteBundle --sha256 $installedHash --channel production --check-only"
    Invoke-Cloud -GcloudArguments (@('compute', 'ssh', $instance, "--command=$checkCommand") + $common) | Write-Output
    $deployCommand = "sudo flock /var/www/granberta-nueva/.publish.lock sh -c 'test `"`$(readlink /var/www/granberta-nueva/current)`" = $ExpectedCurrent && /usr/local/sbin/granberta-deploy $remoteBundle --sha256 $installedHash --channel production'"
    Invoke-Cloud -GcloudArguments (@('compute', 'ssh', $instance, "--command=$deployCommand") + $common) | Write-Output
    $response = Invoke-WebRequest -Uri 'https://granbertafilms.com/' -UseBasicParsing
    $publicBytes = $response.RawContentStream.ToArray()
    $publicHash = [BitConverter]::ToString([Security.Cryptography.SHA256]::Create().ComputeHash($publicBytes)).Replace('-', '').ToLowerInvariant()
    if ($response.StatusCode -ne 200 -or $publicHash -ne $manifest.files.'index.html') {
        throw 'La respuesta pública todavía no coincide con la release. Revisar el servidor antes de darla por publicada.'
    }
    [pscustomobject]@{ published = $true; release = $releaseId; url = 'https://granbertafilms.com/'; sourceSha256 = $bundleHash; installedSha256 = $installedHash } | ConvertTo-Json
}
finally {
    if ($remoteStage -cmatch '^/tmp/gbfilms-publish\.[A-Za-z0-9]{10}$') {
        $cleanup = "cd $remoteStage && rm -f -- changes.tar.gz reuse.list site.tar site.tar.gz && rmdir -- $remoteStage"
        try { Invoke-Cloud -GcloudArguments (@('compute', 'ssh', $instance, "--command=$cleanup") + $common) | Out-Null }
        catch { Write-Warning "Revisar la limpieza de $remoteStage en la VM." }
    }
    $resolvedKeyDirectory = [IO.Path]::GetFullPath($taskKeyDirectory)
    $resolvedTempDirectory = [IO.Path]::GetFullPath([IO.Path]::GetTempPath())
    if (-not $resolvedKeyDirectory.StartsWith($resolvedTempDirectory, [StringComparison]::OrdinalIgnoreCase) -or
        -not ([IO.Path]::GetFileName($resolvedKeyDirectory)).StartsWith('gbfilms-publish-ssh-')) {
        throw 'La carpeta temporal de claves quedó fuera del destino esperado; no se eliminó.'
    }
    Remove-Item -LiteralPath $resolvedKeyDirectory -Recurse -Force
}
