"""Export browser-friendly copies from verified local final deliveries.

Set GB_FINALS_DIR to the studio's 00_Finales folder. Requires ffmpeg on PATH.
The public page never links to an Instagram embed.
"""

import os
import subprocess
from pathlib import Path

source_root = Path(os.environ['GB_FINALS_DIR'])
ffmpeg = os.environ.get('FFMPEG_PATH', 'ffmpeg')
output_root = Path(__file__).resolve().parents[1] / 'public' / 'portfolio' / 'videos'
output_root.mkdir(parents=True, exist_ok=True)
rebuild = os.environ.get('GB_PREVIEW_REBUILD') == '1'

# Instagram post ID -> exact studio delivery. Do not guess: unmatched pieces use a still.
sources = {
    'C8XQ3xsuMa3': 'We Are Catch/24-05-12_WC-0006_Axe-Rulero/ar_offline_v04.mp4',
    'DSp6FnfAFvt': 'CheNetflix/25-12-03_NE-0006_ST5-Rural/str_online_v12.mp4',
    'DSIXPVvAib2': 'CheNetflix/25-12-03_NE-0004_ST5-Comic-Con/st-cc_online_v08.mp4',
    'DRxSYgujkkG': 'CheNetflix/25-11-13_NE-0003_ST-Cinema/st-c_online_v05_version-corta.mp4',
    'DZVvhd4ODQP': 'We Are Catch/26-04-29_WC-0024_Spider-Noir/sn_online_v21.mp4',
    'DXKIOdQk15C': 'Samsung/26-03-17_SG-0009_Samsung-Mundial/sm_online_v17_9-16.mp4',
    'DMLqEvtvv7k': 'Roll/25-06-16_RL-0002_Minecraft-Casa/Minecraft-Casa_Finales_v02/m-casa_offline_v07_9-16.mp4',
    'DMdpWQ4PVp0': 'Minecraft-Lentes/m-lentes_online_v08_9-16.mp4',
    'DYPsUV-yh19': 'Xbox/26-04-01_XB-0003_FH6-Tren/fh6_tren_online_v10.mp4',
    'DYScISPkpR0': 'Xbox/26-04-03_XB-0004_FH6-Trajineras/fh6_trajineras_online_v08.mp4',
    'DYVA6U6DsTh': 'Xbox/26-04-01_XB-0002_FH6-Globo/fh6_globo_online_v09.mp4',
    'DCSRGsSP_1E': 'ICBC/24-09-09_IC-0001_Edificio-Ivan/ei_ONLINE_v02.mp4',
    'DZzqHtzOk6S': 'Be influencers/26-06-04_BE-0001_Jorgito-Fans/jf_online_v10_9-16_logo.mp4',
    'DQIJh4-jWD9': 'Publico Press Group/25-09-25_PR-0001_Autitos-Shell/as_online_v12.mp4',
    'C_bkKcFvaPv': '00_Gran-Berta/05. La Gran Berta/2024/24-07-02_QM-0001_Ideas-Andes/ia_ONLINE_v01_A.mp4',
    'DZK0cjyh9j3': 'Baldo/26-04-15_BL-0001_Secreto-Campeones/sc_online_v31_9-16.mp4',
    'DNDliYaA_KH': 'Grupo Quinto Andar/25-06-11_QA-0001_Zonaprop-Cartel/zp-cartel_ONLINE_v09_ver.mp4',
}

for post_id, relative in sources.items():
    source = source_root / relative
    target = output_root / f'{post_id}.mp4'
    poster = output_root / f'{post_id}.webp'
    if rebuild or not target.exists():
        if not source.is_file():
            raise FileNotFoundError(source)
        print(f'Exporting {post_id}...', flush=True)
        subprocess.run([
            ffmpeg, '-hide_banner', '-loglevel', 'error', '-y', '-i', str(source),
            '-vf', 'scale=540:-2', '-c:v', 'libx264', '-preset', 'veryfast',
            '-crf', '29', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '80k',
            '-movflags', '+faststart', str(target),
        ], check=True)
    if rebuild or not poster.exists():
        subprocess.run([
            ffmpeg, '-hide_banner', '-loglevel', 'error', '-y', '-ss', '5', '-i', str(target),
            '-frames:v', '1', '-c:v', 'libwebp', '-quality', '78', str(poster),
        ], check=True)
