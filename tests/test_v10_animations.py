"""Verify actual rendered exports, provenance, numerical integrity and reproducibility."""
import hashlib
import json
import sys
import tempfile
import unittest
from pathlib import Path
from PIL import Image, ImageChops

ROOT=Path(__file__).resolve().parents[1]
sys.path.insert(0,str(ROOT/'python'))
from generate_animations import generate, WIDTH, HEIGHT, FRAMES, social_frame


class FinalAnimations(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.manifest=json.loads((ROOT/'data/python_animations.json').read_text(encoding='utf-8'))

    def test_eight_real_frame_sequences(self):
        self.assertEqual(len(self.manifest['animations']),8)
        for name,item in self.manifest['animations'].items():
            with Image.open(ROOT/item['paths']['atlas']) as atlas:
                self.assertEqual(atlas.size,(WIDTH,HEIGHT*FRAMES))
                a=atlas.crop((0,0,WIDTH,HEIGHT))
                b=atlas.crop((0,HEIGHT*(FRAMES-1),WIDTH,HEIGHT*FRAMES))
                self.assertIsNotNone(ImageChops.difference(a,b).getbbox(),name)
            with Image.open(ROOT/item['paths']['poster']) as poster:
                self.assertEqual(poster.size,(WIDTH,HEIGHT))
            with Image.open(ROOT/item['paths']['preview']) as preview:
                self.assertTrue(preview.is_animated,name)

    def test_python_authors_the_social_pixels(self):
        item=self.manifest['animations']['social-scene']
        with Image.open(ROOT/item['paths']['atlas']) as atlas:
            self.assertEqual(atlas.crop((0,0,WIDTH,HEIGHT)).tobytes(),social_frame(0).tobytes())
            self.assertEqual(atlas.crop((0,HEIGHT*(FRAMES-1),WIDTH,HEIGHT*FRAMES)).tobytes(),social_frame(1).tobytes())

    def test_manifest_and_hashes(self):
        self.assertEqual(self.manifest['code_sha256'],hashlib.sha256((ROOT/'python/generate_animations.py').read_bytes()).hexdigest())
        self.assertEqual(self.manifest['source_sha256'],hashlib.sha256((ROOT/'data/research_source.json').read_bytes()).hexdigest())
        total=0
        for item in self.manifest['animations'].values():
            for kind,path in item['paths'].items():
                asset=ROOT/path
                self.assertEqual(asset.parent.resolve(),(ROOT/'assets/generated').resolve())
                content=asset.read_bytes();total+=len(content)
                self.assertEqual(item['sha256'][kind],hashlib.sha256(content).hexdigest())
        self.assertLess(total,5_000_000,'Keep committed animation exports practical for static hosting.')

    def test_research_identity_and_no_invented_measurements(self):
        self.assertEqual([self.manifest['animations']['evidence-%d'%i]['figure_index'] for i in range(7)],list(range(7)))
        source=json.loads((ROOT/'data/research_source.json').read_text(encoding='utf-8'))
        self.assertEqual([(r['doing'],r['loneliness']) for r in source['activities']],[(5.81,2.64),(4.86,3.69),(5.82,2.97),(5,3.43)])
        self.assertEqual(source['figures'][3]['evidence']['contrasts'][0]['status'],'marginal')
        for f in source['figures']:
            self.assertFalse(f['exact_series_available'])
            self.assertEqual(f['evidence']['kind'],'qualitative')
            self.assertNotIn('means',f['evidence'])

    def test_reproducible_exports(self):
        with tempfile.TemporaryDirectory() as directory:
            generated=generate(Path(directory))
            self.assertEqual(generated,self.manifest)
            for item in generated['animations'].values():
                for kind,path in item['paths'].items():
                    self.assertEqual((Path(directory)/Path(path).name).read_bytes(),(ROOT/path).read_bytes())


if __name__=='__main__':
    unittest.main(verbosity=2)
