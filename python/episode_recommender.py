"""Deterministic editorial episode matching. No clinical interpretation."""
import json
import math
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
QUOTES = {q['id']:q for q in json.loads((ROOT/'data/quotes.json').read_text(encoding='utf-8'))}
WEIGHTS = dict(mood=18, stress=10, character=18, quote=18, nostalgia=10,
               familiarity=8, predictability=8, experience=10)
OPTIONS = dict(mood=['stressed', 'sad', 'lonely', 'bored', 'happy', 'overwhelmed'],
               character=['Monica', 'Rachel', 'Phoebe', 'Joey', 'Chandler', 'Ross'],
               quote=list(QUOTES),
               nostalgia=['low', 'medium', 'high'],
               familiarity=['new', 'some', 'rewatcher'],
               predictability=['predictable', 'surprising'],
               experience=['laughter', 'warmth', 'friendship', 'nostalgia', 'lighthearted entertainment'])

def clean_profile(profile):
    if not isinstance(profile, dict):
        return {}
    result = {k: v for k, v in profile.items() if k in OPTIONS and v in OPTIONS[k]}
    n = profile.get('stress')
    if isinstance(n, (int, float)) and not isinstance(n, bool) and math.isfinite(n) and 0 <= n <= 10:
        result['stress'] = n
    return result

def score_episode(episode, profile):
    p = clean_profile(profile)
    factors = []
    def add(key, ratio, detail):
        if key in p:
            factors.append(dict(factor=key, points=round(WEIGHTS[key]*ratio, 4),
                                maximum=WEIGHTS[key], reason=detail))
    e = episode
    add('mood', 1 if p.get('mood') in e['mood_tags'] else 0,
        'Mood tag: ' + str(p.get('mood')) + (' matches.' if p.get('mood') in e['mood_tags'] else ' does not match.'))
    target = (p.get('stress', 5)/10)
    fit = (target*e['warmth'] + (1-target)*e['comedy'])/5
    add('stress', fit, 'Editorial warmth/comedy blend weighted by your self-reported stress; no predicted health effect.')
    add('character', int(p.get('character') in e['characters']), 'Featured character match: ' + str(p.get('character')) + '.')
    quote = QUOTES.get(p.get('quote'))
    if quote and quote['match_mode'] == 'character':
        add('quote', 0.5 if quote['character'] in e['characters'] else 0,
            'Editorial quote-to-character match: '+quote['label']+' → '+quote['character']+'. Half credit when featured; no exact scene claimed.')
    else:
        add('quote', int(p.get('quote') in e['quotes']), 'Exact selected quote association: ' + str(p.get('quote')) + '.')
    target_n = {'low': 1, 'medium': 3, 'high': 5}.get(p.get('nostalgia'), 3)
    add('nostalgia', 1-abs(e['nostalgia']-target_n)/4, 'Closeness to your nostalgia preference (editorial 1–5 rating).')
    familiarity = p.get('familiarity')
    ratio = (int(e['beginner_friendly']) if familiarity == 'new' else
             e['nostalgia']/5 if familiarity == 'rewatcher' else 0.75)
    add('familiarity', ratio, 'New viewers favor standalone stories; rewatchers favor editorial nostalgia; some familiarity receives 0.75 credit.')
    add('predictability', int(p.get('predictability') in e['story_tags']), 'Story preference: ' + str(p.get('predictability')) + '.')
    experience = p.get('experience')
    ratio = {'laughter': e['comedy']/5, 'warmth': e['warmth']/5,
             'friendship': e['warmth']/5, 'nostalgia': e['nostalgia']/5,
             'lighthearted entertainment': e['comedy']/5}.get(experience, 0)
    add('experience', ratio, 'Desired experience: ' + str(experience) + ' matched to editorial rating.')
    total = sum(f['points'] for f in factors)
    maximum = sum(f['maximum'] for f in factors)
    return dict(episode=e, score=round(100*total/maximum, 2) if maximum else 0,
                points=round(total, 4), maximum=maximum, factors=factors,
                explanation=('; '.join(f['reason'] for f in factors if f['points'] > 0)
                             or 'No matching preferences yet. Browse this real episode or add choices.'))

def recommend(profile, episodes=None):
    episodes = episodes if episodes is not None else json.loads((ROOT/'data/friends_episodes.json').read_text(encoding='utf-8'))['episodes']
    ranked = sorted((score_episode(e, profile) for e in episodes),
                    key=lambda r: (-r['score'], r['episode']['season'], r['episode']['episode']))
    return dict(engine='Python 3 local backend', label='Algorithmic match — not a scientific score',
                profile=clean_profile(profile), recommendations=ranked[:3])

def simulate(payload):
    def number(key, default, low, high):
        try:
            n = float(payload.get(key, default))
            return min(high, max(low, n)) if math.isfinite(n) else default
        except (ValueError, TypeError):
            return default
    stress = number('stress', 5, 0, 10)
    familiarity = number('familiarity', 5, 0, 10)
    nostalgia = number('nostalgia', 5, 0, 10)
    duration = number('duration', 20, 5, 60)
    minutes = [round(duration*i/4, 1) for i in range(5)]
    values = [round(min(100, 50-stress*3+(familiarity+nostalgia)*2*(1-math.exp(-t/20))), 1) for t in minutes]
    return dict(engine='Python 3 local backend', minutes=minutes, values=values)

if __name__ == '__main__':
    if '--worker' in sys.argv:
        for line in sys.stdin:
            try:
                message = json.loads(line)
                result = simulate(message['payload']) if message['operation']=='simulate' else recommend(message['payload'])
                print(json.dumps(dict(id=message['id'], result=result)), flush=True)
            except (ValueError, KeyError, TypeError):
                print(json.dumps(dict(id=message.get('id'), error='Invalid input')), flush=True)
    else:
        payload = json.load(sys.stdin) if not sys.stdin.isatty() else {}
        print(json.dumps(simulate(payload) if '--simulate' in sys.argv else recommend(payload)))
