"""Optimize generated portrait artwork; does not author portraits or call an image API."""
import argparse
import hashlib
import json
from pathlib import Path
from PIL import Image, ImageOps

NAMES = ['monica', 'rachel', 'phoebe', 'joey', 'chandler', 'ross']

def prepare(source, output):
    source, output = Path(source), Path(output)
    for name in NAMES:
        if not (source / (name + '.png')).is_file():
            raise ValueError('Missing generated source: ' + name + '.png')
    output.mkdir(parents=True, exist_ok=True)
    records = []
    for name in NAMES:
        original = source / (name + '.png')
        with Image.open(original) as image:
            image = ImageOps.exif_transpose(image).convert('RGB')
            width, height = image.size
            image = ImageOps.fit(image, (400, 500), method=Image.Resampling.LANCZOS, centering=(.5, .35))
            target = output / (name + '.webp')
            image.save(target, 'WEBP', quality=86, method=6)
        records.append(dict(character=name, width=400, height=500, bytes=target.stat().st_size,
                            source_dimensions=[width, height], source_sha256=hashlib.sha256(original.read_bytes()).hexdigest(),
                            optimized_sha256=hashlib.sha256(target.read_bytes()).hexdigest()))
    manifest = dict(origin='Built-in image-generation tool; Python only resizes/encodes the artwork.',
                    reference='assets/joey/restaurant-storyboard.png',
                    limitation='Rachel is an original fashion-character interpretation after tool rejection, not an actor likeness. Phoebe uses an original fictional-character interpretation.',
                    export='Pillow 10.4.0 / 400x500 WebP / quality 86 / method 6', portraits=records)
    (output / 'provenance.json').write_text(json.dumps(manifest, indent=2) + '\n', encoding='utf-8')
    return manifest

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--input-dir', required=True, help='Six generated PNGs named monica.png through ross.png')
    parser.add_argument('--output-dir', default='assets/portraits')
    args = parser.parse_args()
    manifest = prepare(args.input_dir, args.output_dir)
    print('Optimized six portraits: %d bytes total.' % sum(p['bytes'] for p in manifest['portraits']))
