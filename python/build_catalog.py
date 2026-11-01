"""Maintain the curated catalog and offline data bundle. Tags are editorial."""
import json
from pathlib import Path
from research_analytics import generate

ROOT = Path(__file__).resolve().parents[1]
# Season episode listings and plot associations checked against TV Guide, 2026-11-01.
# Quotes are only attached to identified episodes, not every character appearance.
ROWS = [
 (1,1,'The One Where Monica Gets a Roommate','Rachel starts over with help from an old friend.','Rachel Monica','A new arrival at Central Perk',3,5,5,True,'lonely sad','predictable'),
 (1,3,'The One with the Thumb','Phoebe discovers an unusual problem with a soda.','Phoebe Chandler','An unexpected soda discovery',4,3,4,True,'bored happy','surprising'),
 (1,7,'The One with the Blackout','A power outage brings the friends together.','Chandler Ross Rachel','A citywide blackout',4,5,5,True,'lonely stressed','predictable'),
 (1,9,'The One Where Underdog Gets Away','Thanksgiving plans take an unexpected turn.','Monica Rachel Joey','An escaped parade balloon',4,5,5,True,'lonely sad','surprising'),
 (1,10,'The One with the Monkey','New Year plans come with unexpected company.','Ross Phoebe Joey','Marcel arrives',4,4,4,True,'bored happy','surprising'),
 (1,12,'The One with the Dozen Lasagnas','Monica has more food than she knows what to do with.','Monica Rachel Ross','A surplus of lasagnas',3,4,4,True,'stressed overwhelmed','predictable'),
 (1,18,'The One with All the Poker','The friends bring their competitive sides to a card game.','Rachel Ross Monica','A group poker game',5,4,5,True,'bored happy','predictable'),
 (1,23,'The One with the Birth','The group gathers at the hospital for a big day.','Ross Phoebe Joey','Waiting at the hospital',3,5,4,False,'lonely sad','predictable'),
 (2,6,'The One with the Baby on the Bus','Babysitting becomes an adventure while Phoebe faces a cafe change.','Joey Chandler Phoebe','A bus mishap; Smelly Cat',5,4,5,True,'bored happy','surprising'),
 (2,7,'The One Where Ross Finds Out','An unexpected message complicates an old friendship.','Rachel Ross Monica','A revealing voicemail',4,4,5,False,'sad happy','surprising'),
 (2,14,'The One with the Prom Video','An old home video gives the group a new perspective.','Rachel Ross Monica','The prom home video',3,5,5,False,'sad lonely','predictable'),
 (2,17,'The One Where Eddie Moves In','New living arrangements unsettle the familiar routine.','Joey Chandler Phoebe','Smelly Cat recording',4,4,5,False,'sad bored','surprising'),
 (3,2,"The One Where No One's Ready",'Getting everyone ready for a formal event proves difficult.','Ross Joey Chandler','A battle over a chair',5,3,5,True,'bored happy','predictable'),
 (3,9,'The One with the Football','A friendly Thanksgiving game becomes a sibling rivalry.','Monica Ross Rachel','The Geller Cup',5,4,5,True,'bored happy','predictable'),
 (4,8,'The One with Chandler in a Box','Thanksgiving includes an unusual attempt at making amends.','Chandler Joey Monica','A box at Thanksgiving',4,5,4,False,'sad lonely','surprising'),
 (4,12,'The One with the Embryos','A trivia challenge tests how well the friends know each other.','Monica Rachel Joey Chandler Ross Phoebe','The apartment trivia contest',5,5,5,True,'bored happy lonely','surprising'),
 (4,13,"The One with Rachel's Crush",'Rachel explores a crush as the apartments feel different.','Rachel Joey Chandler','Joey offers his signature greeting',4,3,4,False,'bored happy','predictable'),
 (5,8,'The One with All the Thanksgivings','The friends look back on memorable holiday mishaps.','Monica Chandler Ross Rachel','Thanksgiving flashbacks',5,5,5,False,'sad lonely happy','surprising'),
 (5,14,'The One Where Everybody Finds Out','A secret inspires a playful contest of bluffing.','Phoebe Chandler Monica Rachel','They know that we know',5,5,5,False,'bored happy','surprising'),
 (5,16,'The One with the Cop','Moving a sofa turns into a very vocal group effort.','Ross Rachel Chandler Phoebe','PIVOT! on the staircase',5,3,5,True,'bored happy','predictable'),
 (6,9,'The One Where Ross Got High','Thanksgiving secrets emerge while Rachel tries a recipe.','Monica Ross Rachel Chandler','The trifle',5,4,5,True,'bored happy','surprising'),
 (6,17,'The One with Unagi','Ross tests a theory while his friends challenge his confidence.','Ross Rachel Phoebe','Unagi and self-defense',5,3,5,True,'bored happy','surprising'),
]

def build():
    episodes = []
    for s,n,title,description,characters,moment,comedy,warmth,nostalgia,beginner,moods,stories in ROWS:
        quotes = ['PIVOT!'] if (s,n)==(5,16) else ['Smelly Cat'] if (s,n) in [(2,6),(2,17)] else ["How you doin'?"] if (s,n)==(4,13) else []
        episodes.append(dict(id='s%02de%02d'%(s,n),season=s,episode=n,title=title,
            description=description,characters=characters.split(),moments=[moment],quotes=quotes,
            comedy=comedy,warmth=warmth,nostalgia=nostalgia,beginner_friendly=beginner,
            mood_tags=moods.split()+(['overwhelmed','stressed'] if warmth>=4 and comedy<=4 else []),
            story_tags=stories.split(),familiarity_tags=['standalone' if beginner else 'continuity'],
            source='https://www.tvguide.com/tvshows/friends/episodes-season-%d/1030937287/'%s))
    catalog=dict(verified_on='2026-11-01',provenance='Episode titles, numbers and plot associations checked against TV Guide season listings. PIVOT: S5E16; greeting: S4E13; Smelly Cat performance/recording: S2E6/S2E17. Ratings 1–5 and all comfort tags are editorial, not measured research.',episodes=episodes)
    (ROOT/'data/friends_episodes.json').write_text(json.dumps(catalog,indent=2)+'\n',encoding='utf-8')
    bundle=dict(catalog=catalog,research=generate())
    (ROOT/'data/v05-data.js').write_text('window.FRIENDS_V05 = '+json.dumps(bundle)+';\n',encoding='utf-8')
    print('Built %d curated episodes and offline browser bundle.'%len(episodes))

if __name__=='__main__':
    build()
