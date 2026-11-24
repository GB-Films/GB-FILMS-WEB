param(
    [Parameter(Mandatory)][string]$Bundle,
    [Parameter(Mandatory)][string]$ExpectedCurrent,
    [string]$GcloudSdk = $env:GB_GCLOUD_SDK,
    [switch]$ValidateOnly
)

$ErrorActionPreference = 'Stop'
$projectRoot = Split-Path -Parent $PSScriptRoot
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
if ($activeAccount.Trim() -ne 'info@granbertafilms.com') {
    throw 'Iniciar sesión de Google Cloud SDK con info@granbertafilms.com antes de publicar.'
}
$taskKeyDirectory = Join-Path ([IO.Path]::GetTempPath()) ('gbfilms-publish-ssh-' + [guid]::NewGuid().ToString('N'))
New-Item -ItemType Directory -Path $taskKeyDirectory | Out-Null
$taskKeyFile = Join-Path $taskKeyDirectory 'id_rsa'
$common = @('--project=gran-berta-films', '--zone=northamerica-northeast1-a', '--quiet', "--ssh-key-file=$taskKeyFile", '--ssh-key-expire-after=15m')
$instance = 'info@wordpress-1-vm'
$remoteBundle = "/home/info/$bundleName"
try {
    $current = Invoke-Cloud -GcloudArguments (@('compute', 'ssh', $instance, '--command=readlink /var/www/granberta-nueva/current') + $common)
    if ($current.Trim() -ne $ExpectedCurrent) { throw "Cambió la versión pública: $current. Revisar antes de publicar." }
    Invoke-Cloud -GcloudArguments (@('compute', 'scp', $bundlePath, "${instance}:$remoteBundle") + $common) | Write-Output
    $checkCommand = "/usr/local/sbin/granberta-deploy $remoteBundle --sha256 $bundleHash --channel production --check-only"
    Invoke-Cloud -GcloudArguments (@('compute', 'ssh', $instance, "--command=$checkCommand") + $common) | Write-Output
    $current = Invoke-Cloud -GcloudArguments (@('compute', 'ssh', $instance, '--command=readlink /var/www/granberta-nueva/current') + $common)
    if ($current.Trim() -ne $ExpectedCurrent) { throw 'Otra publicación cambió la versión activa durante la transferencia.' }
    $deployCommand = "sudo /usr/local/sbin/granberta-deploy $remoteBundle --sha256 $bundleHash --channel production"
    Invoke-Cloud -GcloudArguments (@('compute', 'ssh', $instance, "--command=$deployCommand") + $common) | Write-Output
    $response = Invoke-WebRequest -Uri 'https://granbertafilms.com/' -UseBasicParsing
    $publicBytes = $response.RawContentStream.ToArray()
    $publicHash = [BitConverter]::ToString([Security.Cryptography.SHA256]::Create().ComputeHash($publicBytes)).Replace('-', '').ToLowerInvariant()
    if ($response.StatusCode -ne 200 -or $publicHash -ne $manifest.files.'index.html') {
        throw 'La respuesta pública todavía no coincide con la release. Revisar el servidor antes de darla por publicada.'
    }
    [pscustomobject]@{ published = $true; release = $releaseId; url = 'https://granbertafilms.com/'; sha256 = $bundleHash } | ConvertTo-Json
}
finally {
    $resolvedKeyDirectory = [IO.Path]::GetFullPath($taskKeyDirectory)
    $resolvedTempDirectory = [IO.Path]::GetFullPath([IO.Path]::GetTempPath())
    if (-not $resolvedKeyDirectory.StartsWith($resolvedTempDirectory, [StringComparison]::OrdinalIgnoreCase) -or
        -not ([IO.Path]::GetFileName($resolvedKeyDirectory)).StartsWith('gbfilms-publish-ssh-')) {
        throw 'La carpeta temporal de claves quedó fuera del destino esperado; no se eliminó.'
    }
    Remove-Item -LiteralPath $resolvedKeyDirectory -Recurse -Force
}
