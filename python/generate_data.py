"""Generate deliberately invented teaching examples. No participants or measurements.
Standard library only. Outputs bundled JS for both HTTP and file:// use and JSON.
"""
import json
from pathlib import Path
root = Path(__file__).resolve().parents[1]
data = {
    'provenance': 'Synthetic teaching examples; arbitrary units; nonclinical; no survey or cortisol data.',
    'reasons': [
        {'label': 'Familiarity', 'value': 85, 'detail': 'Recognizing the setting may reduce the need to learn a new world.'},
        {'label': 'Company', 'value': 75, 'detail': 'Familiar characters can evoke a sense of imagined company.'},
        {'label': 'Nostalgia', 'value': 65, 'detail': 'A remembered episode may connect with a personal memory.'},
        {'label': 'Light attention', 'value': 55, 'detail': 'Known stories can be followed without tracking every detail.'}
    ],
    'minutes': [0, 5, 10, 15, 20],
    'curves': {'familiar': [1, .9, .78, .7, .65], 'new': [1, 1.04, .98, .94, .9], 'pause': [1, .93, .85, .8, .75]}
}
(root / 'data' / 'illustrations.json').write_text(json.dumps(data, indent=2) + '\n', encoding='utf-8')
(root / 'data' / 'illustrations.js').write_text('window.COMFORT_DATA = ' + json.dumps(data, indent=2) + ';\n', encoding='utf-8')
# An exported SVG is also Python-generated; the browser uses the same values interactively.
bars = ''.join(f'<text x="10" y="{35+i*55}" font-size="16">{r["label"]}</text><rect x="150" y="{15+i*55}" width="{r["value"]*3}" height="28" fill="#674a83"/><text x="420" y="{35+i*55}">{r["value"]}</text>' for i,r in enumerate(data['reasons']))
(root / 'data' / 'comfort.svg').write_text('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 290" role="img"><title>Invented comfort weights, arbitrary units, not survey results</title><rect width="520" height="290" fill="#fff4de"/>' + bars + '<text x="10" y="265" font-size="14">Illustrative only. Nonclinical, synthetic data.</text></svg>\n', encoding='utf-8')
print('Generated synthetic JSON, browser data, and SVG.')
