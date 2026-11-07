"""Behavior tests for catalog, research provenance, scoring and simulation."""
import json
import math
import sys
import unittest
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
sys.path.insert(0,str(ROOT/'python'))
from episode_recommender import recommend, score_episode, simulate, clean_profile, WEIGHTS
from research_analytics import generate

class Version05Tests(unittest.TestCase):
    def test_published_means(self):
        data=generate()
        self.assertEqual([(a['doing'],a['loneliness']) for a in data['activities']],[(5.81,2.64),(4.86,3.69),(5.82,2.97),(5,3.43)])
        self.assertEqual(data,json.loads((ROOT/'data/research_analytics.json').read_text(encoding='utf-8')))
    def test_catalog(self):
        data=json.loads((ROOT/'data/friends_episodes.json').read_text(encoding='utf-8'))['episodes']
        self.assertGreaterEqual(len(data),20)
        self.assertEqual(len({e['id'] for e in data}),len(data))
        for e in data:
            self.assertTrue(e['source'].startswith('https://www.tvguide.com/'))
            self.assertTrue(1<=e['comedy']<=5 and 1<=e['warmth']<=5)
        self.assertEqual(next(e for e in data if 'PIVOT!' in e['quotes'])['id'],'s05e16')
        self.assertEqual(next(e for e in data if "How you doin'?" in e['quotes'])['id'],'s04e13')
    def test_quote_drives_matching(self):
        r=recommend({'quote':"I'm gonna go get one of those job things."})['recommendations'][0]
        self.assertEqual(r['episode']['id'],'s01e01')
        self.assertEqual(r['score'],100)
        self.assertEqual(r['factors'][0]['points'],18)
    def test_incomplete_and_deterministic(self):
        for p in [{},{'character':'Phoebe'},{'stress':0},{'mood':'overwhelmed','stress':10,'nostalgia':'high'}]:
            a=recommend(p)
            self.assertEqual(a,recommend(p))
            self.assertEqual(len(a['recommendations']),3)
            for r in a['recommendations']:
                self.assertAlmostEqual(r['points'],sum(f['points'] for f in r['factors']))
                self.assertEqual(r['maximum'],sum(f['maximum'] for f in r['factors']))
                self.assertTrue(0<=r['score']<=100)
                for f in r['factors']:
                    self.assertEqual(f['maximum'],WEIGHTS[f['factor']])
                    if f['points']>0:self.assertIn(f['reason'],r['explanation'])
        self.assertEqual(recommend({})['recommendations'][0]['score'],0)
    def test_all_factors_and_validation(self):
        p=dict(mood='happy',stress=6,character='Ross',quote="I'm gonna go get one of those job things.",nostalgia='high',familiarity='rewatcher',predictability='predictable',experience='laughter')
        self.assertEqual(len(recommend(p)['recommendations'][0]['factors']),8)
        self.assertEqual(clean_profile({'stress':float('nan'),'quote':'fake','mood':'happy'}),{'mood':'happy'})
        self.assertEqual(clean_profile({'stress':True}),{})
    def test_simulation(self):
        a=simulate({})
        self.assertEqual(a,simulate({}))
        self.assertEqual(len(a['values']),5)
        self.assertTrue(all(0<=v<=100 for v in a['values']))
        self.assertNotEqual(a['values'],simulate({'nostalgia':0,'familiarity':0})['values'])
        self.assertNotEqual(a['minutes'],simulate({'duration':60})['minutes'])
    def test_supplied_assets(self):
        for f in ['central-perk-original.png','friends-couch-original.png']:
            self.assertEqual((ROOT/'assets'/f).read_bytes()[:8],b'\x89PNG\r\n\x1a\n')
        figures=list((ROOT/'assets/research').glob('*.png'))
        self.assertEqual(len(figures),7)
        for f in figures:self.assertEqual(f.read_bytes()[:8],b'\x89PNG\r\n\x1a\n')

if __name__=='__main__':unittest.main(verbosity=2)
