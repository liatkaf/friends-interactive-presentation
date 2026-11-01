"""Transcribe four published descriptive means; never estimate figure values."""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
def generate():
    data = dict(source='Derrick, Gabriel, & Hugenberg (2009), Study 1, Table 1, p. 355',
        doi='https://doi.org/10.1016/j.jesp.2008.12.003',
        note='Undergraduate self-reports, not Friends-specific. Doing: 1 (definitely would not do) to 7 (definitely would do). Loneliness: reverse-scored 1–7; lower means less likely to feel lonely. Not clinical anxiety scores. Descriptive means, not causal effects.',
        activities=[dict(activity=name, doing=doing, loneliness=lonely) for name, doing, lonely in [
            ('Favorite TV program',5.81,2.64), ('Whatever is on television',4.86,3.69),
            ('Favorite music',5.82,2.97), ('Favorite movie',5.00,3.43)]])
    (ROOT/'data/research_analytics.json').write_text(json.dumps(data, indent=2)+'\n', encoding='utf-8')
    return data
if __name__ == '__main__':
    generate()
    print('Generated data/research_analytics.json from published descriptive means.')
