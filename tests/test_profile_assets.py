"""Verify optimized portrait exports and pre-redesign recommendation equivalence."""
import hashlib
import json
import sys
import unittest
from pathlib import Path
from PIL import Image
ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT/'python'))
from episode_recommender import recommend

class ProfileAssets(unittest.TestCase):
    def test_six_optimized_portraits(self):
        manifest=json.loads((ROOT/'assets/portraits/provenance.json').read_text(encoding='utf-8'))
        self.assertEqual([p['character'] for p in manifest['portraits']],['monica','rachel','phoebe','joey','chandler','ross'])
        self.assertLess(sum(p['bytes'] for p in manifest['portraits']),300000)
        hashes=[]
        for p in manifest['portraits']:
            path=ROOT/'assets/portraits'/(p['character']+'.webp')
            with Image.open(path) as image:
                self.assertEqual(image.size,(400,500));self.assertEqual(image.format,'WEBP')
            digest=hashlib.sha256(path.read_bytes()).hexdigest();self.assertEqual(digest,p['optimized_sha256']);hashes.append(digest)
        self.assertEqual(len(set(hashes)),6)
    def test_generation_limitation_is_honest(self):
        data=json.loads((ROOT/'assets/portraits/provenance.json').read_text(encoding='utf-8'))
        self.assertIn('Python only resizes',data['origin']);self.assertIn('not an actor likeness',data['limitation'])
    def test_pre_upgrade_python_rankings(self):
        baseline=json.loads((ROOT/'tests/fixtures/pre-profile-recommendations.json').read_text(encoding='utf-8'))
        self.assertEqual(len(baseline['cases']),20)
        for case in baseline['cases']:
            self.assertEqual(recommend(case['profile'])['recommendations'],case['recommendations'])

if __name__=='__main__':unittest.main()
