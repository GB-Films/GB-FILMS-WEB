"""Prepare a smaller transfer from a locally validated production bundle."""
import json
from pathlib import Path
import sys
import tarfile


def pack_changes(bundle, previous_manifest, output):
    previous = {}
    if previous_manifest.is_file():
        previous = json.loads(previous_manifest.read_bytes())["files"]

    reused = []
    with tarfile.open(bundle, "r:gz") as source, tarfile.open(output / "changes.tar.gz", "x:gz", compresslevel=1) as changes:
        manifest = json.load(source.extractfile("manifest.json"))
        if manifest["dirty"] or manifest["id"] + ".tar.gz" != bundle.name:
            raise ValueError("El paquete debe corresponder a un commit limpio.")
        # Read in archive order to avoid repeatedly decompressing large videos.
        with tarfile.open(bundle, "r|gz") as stream:
            for member in stream:
                if not member.isfile():
                    continue
                path = member.name.removeprefix("site/")
                if member.name != "manifest.json" and previous.get(path) == manifest["files"][path]:
                    reused.append(member.name)
                else:
                    changes.addfile(member, stream.extractfile(member))

    # GNU tar on the VM appends these exact paths from the previous release.
    (output / "reuse.list").write_bytes(b"".join(name.encode("utf-8") + b"\0" for name in reused))
    print(json.dumps({"transferred": len(manifest["files"]) - len(reused), "reused": len(reused),
                      "bytes": (output / "changes.tar.gz").stat().st_size}))


if __name__ == "__main__":
    pack_changes(*(Path(arg) for arg in sys.argv[1:]))
