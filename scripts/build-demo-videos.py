"""Render silent, explicitly labelled demo slideshows from existing fanpage photos."""
from pathlib import Path
import subprocess

assets = Path(__file__).resolve().parent.parent / 'assets'
sequences = {
    'community-demo': ['adc8d1977f6d574e.png', '55d1223a1ac3ed1d.png', '9f782df485306de5.jpg'],
    'facilities-demo': ['4c135fdb1e0c0e75.png', 'b89bed8cfcf32aa1.png', '98e18acf2b0b12e7.png'],
}
for name, photos in sequences.items():
    args = ['ffmpeg', '-y', '-hide_banner', '-loglevel', 'error']
    for photo in photos:
        args += ['-loop', '1', '-t', '4', '-i', str(assets / photo)]
    filters = ';'.join(f'[{i}:v]scale=960:540:force_original_aspect_ratio=decrease,pad=960:540:(ow-iw)/2:(oh-ih)/2:color=0x203e70,setsar=1,fps=25[v{i}]' for i in range(3))
    filters += ';[v0][v1][v2]concat=n=3:v=1:a=0[out]'
    subprocess.run(args + ['-filter_complex', filters, '-map', '[out]', '-c:v', 'libx264', '-preset', 'fast', '-crf', '25', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', '-an', str(assets / f'{name}.mp4')], check=True)
