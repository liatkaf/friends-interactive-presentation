"""Two quote replacements: explicit editorial affinity without new episode claims."""
import json
import sys
import unittest
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
sys.path.insert(0,str(ROOT/'python'))
from episode_recommender import QUOTES, WEIGHTS, clean_profile, recommend, score_episode

class FinalQuoteUpdate(unittest.TestCase):
    def test_six_characters_and_fixed_order(self):
        self.assertEqual([q['character'] for q in QUOTES.values()],['Rachel','Joey','Ross','Chandler','Phoebe','Monica'])
        self.assertEqual(len(QUOTES),6)
        self.assertEqual(list(QUOTES)[2],'We were on a break!')

    def test_new_themes_and_preferred_episodes(self):
        for quote,episode,theme in [("I'm gonna go get one of those job things.",'s01e01','independence and personal growth'),("I make jokes when I'm uncomfortable.",'s04e08','humor and emotional comfort')]:
            result=recommend({'quote':quote})
            self.assertEqual(result['profile'],{'quote':quote})
            self.assertEqual(result['recommendations'][0]['episode']['id'],episode)
            factor=result['recommendations'][0]['factors'][0]
            self.assertEqual(factor['points'],18)
            self.assertIn(theme,factor['reason'])
            self.assertIn('no exact scene or health effect claimed',factor['reason'])
            self.assertNotIn(quote,result['recommendations'][0]['episode']['quotes'])

    def test_affinity_is_scoped_to_new_quotes(self):
        episodes=json.loads((ROOT/'data/friends_episodes.json').read_text())['episodes']
        for quote in QUOTES.values():
            if quote['match_mode']!='editorial':continue
            for episode in episodes:
                expected=18 if episode['id'] in quote['episode_affinities'] else 9 if quote['character'] in episode['characters'] else 0
                result=score_episode(episode,{'quote':quote['id']})
                self.assertEqual(result['points'],expected)
                self.assertEqual(result['maximum'],18)
        self.assertEqual(WEIGHTS,dict(mood=18,stress=10,character=18,quote=18,nostalgia=10,familiarity=8,predictability=8,experience=10))

    def test_retired_quotes_do_not_become_another_character_answer(self):
        for old in ['PIVOT!','Could I BE any more...?']:
            self.assertEqual(clean_profile({'quote':old,'mood':'happy','character':'Ross','stress':4}),{'mood':'happy','character':'Ross','stress':4})

if __name__=='__main__':unittest.main()
