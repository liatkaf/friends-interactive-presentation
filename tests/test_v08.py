"""Validate source provenance, generated data and all six quote scoring paths."""
import copy
import hashlib
import json
import sys
import tempfile
import unittest
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
sys.path.insert(0,str(ROOT/'python'))
from research_analytics import generate, validate, SOURCE
from episode_recommender import recommend, QUOTES, clean_profile, score_episode

class Version08Tests(unittest.TestCase):
    def test_pipeline_reproducible(self):
        with tempfile.TemporaryDirectory() as folder:
            a=Path(folder)/'a.json';b=Path(folder)/'b.json'
            result=generate(output=a);generate(output=b)
            self.assertEqual(a.read_bytes(),b.read_bytes())
            self.assertEqual(result,json.loads((ROOT/'data/research_analytics.json').read_text(encoding='utf-8')))
            self.assertEqual(result['source_sha256'],hashlib.sha256(SOURCE.read_bytes()).hexdigest())
    def test_means_and_display_transform(self):
        result=generate()
        self.assertEqual([(r['doing'],r['loneliness']) for r in result['activities']],[(5.81,2.64),(4.86,3.69),(5.82,2.97),(5,3.43)])
        for row in result['activities']:
            for key in ('doing','loneliness'):
                self.assertAlmostEqual(row['display_percent'][key],row[key]/7*100,places=5)
    def test_invalid_research_rejected(self):
        original=json.loads(SOURCE.read_text(encoding='utf-8'))
        for value in (0,8,True,float('nan'),'5.81'):
            bad=copy.deepcopy(original);bad['activities'][0]['doing']=value
            with self.assertRaises(ValueError):validate(bad)
        bad=copy.deepcopy(original);bad['figures'][0]['exact_series_available']=True
        with self.assertRaises(ValueError):validate(bad)
    def test_original_figures_not_estimated(self):
        data=generate();self.assertEqual(len(data['figures']),7)
        for f in data['figures']:
            self.assertFalse(f['exact_series_available'])
            self.assertNotIn('values',f)
            self.assertEqual(f['sha256'],hashlib.sha256((ROOT/'assets/research'/f['file']).read_bytes()).hexdigest())
            self.assertTrue(f['takeaway'])
    def test_all_six_quotes_are_real_inputs(self):
        self.assertEqual(len(QUOTES),6)
        for key,q in QUOTES.items():
            profile={'quote':key}
            self.assertEqual(clean_profile(profile),profile)
            a=recommend(profile);self.assertEqual(a,recommend(profile))
            top=a['recommendations'][0]
            self.assertGreater(top['score'],0)
            f=next(f for f in top['factors'] if f['factor']=='quote')
            self.assertEqual(f['maximum'],18)
            self.assertEqual(f['points'],9 if q['match_mode']=='character' else 18)
            self.assertIn(f['reason'],top['explanation'])
            if q['match_mode']=='character':self.assertIn('no exact scene claimed',f['reason'])
    def test_quote_changes_score(self):
        episodes=json.loads((ROOT/'data/friends_episodes.json').read_text(encoding='utf-8'))['episodes']
        for key in QUOTES:
            points=[score_episode(e,{'quote':key})['points'] for e in episodes]
            self.assertGreater(max(points),min(points))
    def test_labels_preserve_internal_values(self):
        labels=json.loads((ROOT/'data/profile_labels.json').read_text(encoding='utf-8'))
        self.assertEqual(list(labels['familiarity']),['new','some','rewatcher'])
        self.assertEqual(list(labels['nostalgia']),['low','medium','high'])
        self.assertEqual(labels['familiarity']['rewatcher'],'I know it by heart — 7! 7! 7!')
        for familiarity in labels['familiarity']:
            for nostalgia in labels['nostalgia']:
                p={'familiarity':familiarity,'nostalgia':nostalgia}
                result=recommend(p)
                self.assertEqual(result['profile'],p)
                self.assertEqual(result['recommendations'][0]['maximum'],18)

if __name__=='__main__':unittest.main(verbosity=2)
