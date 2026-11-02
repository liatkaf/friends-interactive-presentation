"""Qualitative evidence must remain source-based and reproducible, never estimated means."""
import copy
import json
import sys
import tempfile
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT/'python'))
from research_analytics import SOURCE, generate, validate

class Version09Tests(unittest.TestCase):
    def test_seven_sourced_maps(self):
        data = generate()
        self.assertEqual(len(data['figures']), 7)
        self.assertEqual(sum(len(f['evidence']['contrasts']) for f in data['figures']), 15)
        for figure in data['figures']:
            evidence = figure['evidence']
            self.assertEqual(evidence['kind'], 'qualitative')
            self.assertTrue(evidence['original_unit'])
            self.assertTrue(evidence['source_locator'])
            self.assertTrue(evidence['verification_url'].startswith('https://'))
            self.assertFalse(figure['exact_series_available'])
            self.assertNotIn('values', evidence)
            for row in evidence['contrasts']:
                self.assertEqual(evidence['categories'][row['display_column']-1], row['status'])

    def test_reported_distinctions(self):
        figures = generate()['figures']
        rejection = figures[3]['evidence']['contrasts'][0]
        self.assertEqual((rejection['status'], rejection['reported_p']), ('marginal', 'p = .09'))
        self.assertEqual(figures[1]['evidence']['contrasts'][1]['reported_p'], 'p = .42')
        self.assertEqual(figures[6]['evidence']['contrasts'][2]['reported_p'], 'p = .261')
        self.assertIn('not a randomized', figures[6]['takeaway'])

    def test_rejects_invented_measurements(self):
        original = json.loads(SOURCE.read_text(encoding='utf-8'))
        bad = copy.deepcopy(original)
        bad['figures'][0]['evidence']['contrasts'][0]['estimated_mean'] = 400
        with self.assertRaises(ValueError):
            validate(bad)
        bad = copy.deepcopy(original)
        bad['figures'][0]['evidence']['contrasts'][0]['status'] = 'proven'
        with self.assertRaises(ValueError):
            validate(bad)

    def test_pipeline_matches_static_bundle(self):
        with tempfile.TemporaryDirectory() as folder:
            target = Path(folder)/'research.json'
            data = generate(output=target)
            self.assertEqual(target.read_bytes(), (ROOT/'data/research_analytics.json').read_bytes())
            bundle = (ROOT/'data/v05-data.js').read_text(encoding='utf-8')
            parsed = json.loads(bundle.split(' = ', 1)[1].strip().rstrip(';'))
            self.assertEqual(data, parsed['research'])

if __name__ == '__main__':
    unittest.main(verbosity=2)
