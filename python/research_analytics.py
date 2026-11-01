"""Validate a documented transcription and export chart/figure data, not new findings."""
import hashlib
import json
import math
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT/'data/research_source.json'

def validate(data):
    if data.get('scale') != dict(min=1, max=7):
        raise ValueError('Published response scales must remain 1–7.')
    rows = data.get('activities', [])
    if len(rows) != 4 or len({r['activity'] for r in rows}) != 4:
        raise ValueError('Expected four distinct documented activities.')
    for row in rows:
        for measure in ('doing', 'loneliness'):
            n = row[measure]
            if isinstance(n, bool) or not isinstance(n, (float, int)) or not math.isfinite(n) or not 1 <= n <= 7:
                raise ValueError('Invalid descriptive rating: '+measure)
    figures = data.get('figures', [])
    if len(figures) != 7 or len({f['file'] for f in figures}) != 7:
        raise ValueError('Expected seven distinct original figures.')
    for f in figures:
        path = ROOT/'assets/research'/f['file']
        if Path(f['file']).name != f['file'] or path.read_bytes()[:8] != b'\x89PNG\r\n\x1a\n':
            raise ValueError('Invalid original figure.')
        if f['paper'] not in data['papers'] or f['exact_series_available'] is not False:
            raise ValueError('Do not invent numerical series for original figures.')
    return data

def generate(source=SOURCE, output=None):
    data = validate(json.loads(Path(source).read_text(encoding='utf-8')))
    data['generated_by'] = 'Python 3 build-time research_analytics.py; not a live browser Python session'
    data['transform_note'] = 'Bar widths are mean / 7 × 100 for display only. No figure values are estimated.'
    data['source_sha256'] = hashlib.sha256(Path(source).read_bytes()).hexdigest()
    for row in data['activities']:
        row['display_percent'] = {key: round(row[key]/7*100, 6) for key in ('doing','loneliness')}
    for f in data['figures']:
        f['sha256'] = hashlib.sha256((ROOT/'assets/research'/f['file']).read_bytes()).hexdigest()
    target = Path(output) if output else ROOT/'data/research_analytics.json'
    target.write_text(json.dumps(data, indent=2, ensure_ascii=True)+'\n', encoding='utf-8')
    return data

if __name__ == '__main__':
    generate()
    print('Validated documented means and seven original figures; exported data/research_analytics.json.')
