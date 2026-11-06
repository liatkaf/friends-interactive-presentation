"""Author original social artwork and qualitative research animations with Pillow.

JSON inputs -> validated evidence -> sixteen fully rendered frames -> PNG atlas,
static poster, GIF preview and hashed browser manifest. JavaScript only plays frames.
No group means, error bars or effect magnitudes are reconstructed.
"""
import argparse
import hashlib
import json
import math
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont
from research_analytics import validate

ROOT = Path(__file__).resolve().parents[1]
WIDTH, HEIGHT, FRAMES, DURATION = 960, 400, 16, 2400
COLORS = dict(cream='#fbf2df', plum='#513759', purple='#76538b', yellow='#f4c542',
              orange='#cf7c43', ink='#342b30', muted='#75626b', green='#4e7465',
              line='#d4c3a9', pale='#eee2ce', skin='#e5b18a', hair='#42313d')


def font(size=20):
    # Pillow's bundled scalable font makes output independent of OS fonts.
    return ImageFont.load_default(size=size)


def text(draw, xy, value, size=20, color='ink', max_width=None):
    words, lines, line = str(value).split(), [], ''
    for word in words:
        candidate = (line+' '+word).strip()
        if max_width and draw.textlength(candidate, font=font(size)) > max_width and line:
            lines.append(line)
            line = word
        else:
            line = candidate
    lines.append(line)
    for i, content in enumerate(lines):
        draw.text((xy[0], xy[1]+i*(size+6)), content, font=font(size), fill=COLORS.get(color, color))


def box(draw, rect, fill='pale', radius=16, outline=None):
    draw.rounded_rectangle(rect, radius, fill=COLORS.get(fill, fill),
                           outline=COLORS.get(outline, outline), width=2)


def arrow(draw, start, end, fill='purple', dashed=False):
    color = COLORS[fill]
    if dashed:
        for i in range(0, 10, 2):
            a, b = i/10, (i+1)/10
            draw.line((start[0]+(end[0]-start[0])*a, start[1]+(end[1]-start[1])*a,
                       start[0]+(end[0]-start[0])*b, start[1]+(end[1]-start[1])*b), fill=color, width=4)
    else:
        draw.line((*start, *end), fill=color, width=4)
    angle = math.atan2(end[1]-start[1], end[0]-start[0])
    draw.polygon([end, (end[0]-12*math.cos(angle-.45), end[1]-12*math.sin(angle-.45)),
                  (end[0]-12*math.cos(angle+.45), end[1]-12*math.sin(angle+.45))], fill=color)


def person(draw, x, y, outfit, tilt=0, wave=False):
    box(draw, (x-27, y+25, x+27, y+108), outfit, 20)
    draw.ellipse((x-22, y-26+tilt, x+22, y+26+tilt), fill=COLORS['skin'])
    draw.pieslice((x-24, y-31+tilt, x+24, y+9+tilt), 180, 360, fill=COLORS['hair'])
    draw.ellipse((x-9, y-4+tilt, x-5, y+tilt), fill=COLORS['ink'])
    draw.ellipse((x+5, y-4+tilt, x+9, y+tilt), fill=COLORS['ink'])
    draw.arc((x-7, y+3+tilt, x+7, y+16+tilt), 15, 165, fill=COLORS['ink'], width=2)
    if wave:
        draw.line((x+20, y+45, x+53, y+15+tilt), fill=COLORS['skin'], width=10)
    draw.line((x-14, y+105, x-15, y+137), fill=COLORS['ink'], width=10)
    draw.line((x+14, y+105, x+15, y+137), fill=COLORS['ink'], width=10)


def canvas(title, subtitle):
    image = Image.new('RGB', (WIDTH, HEIGHT), COLORS['cream'])
    draw = ImageDraw.Draw(image)
    text(draw, (28, 16), title, 25, 'plum')
    text(draw, (28, 52), subtitle, 16, 'muted')
    return image, draw


def social_frame(t):
    image, d = canvas('A moment at the coffee shop', 'Original fictional scene. Not an experiment or an assessment.')
    box(d, (22, 86, 938, 377), '#e6d8e8', 20)
    box(d, (50, 106, 218, 248), 'green', 12)
    text(d, (72, 130), 'COFFEE', 24, 'cream')
    text(d, (72, 165), '& COMPANY', 18, 'cream')
    d.rectangle((22, 290, 938, 377), fill='#d7b48d')
    box(d, (291, 225, 700, 329), 'orange', 25)
    for x in (310, 438, 566):
        box(d, (x, 242, x+116, 316), '#e69a5d', 13)
    # Neutral seated characters converse while another gently approaches.
    for i, x in enumerate((366, 491, 616)):
        person(d, x, 182, ('purple', 'green', 'orange')[i], tilt=int(math.sin(t*math.pi*2+i)*2))
    x = 840-int(72*(1-math.cos(t*math.pi))/2)
    person(d, x, 210, 'purple', wave=t>.3, tilt=int(math.sin(t*math.pi)*4))
    box(d, (335, 91, 590, 143), 'cream', 18)
    text(d, (358, 105), '...and then the coffee!', 19, 'plum')
    if t>.35:
        box(d, (725, 106, 900, 165), 'cream', 20)
        text(d, (752, 123), 'Can I join?', 21, 'plum')
    return image


def evidence_frame(figure, t):
    e = figure['evidence']
    image, d = canvas(e['outcome'], 'Qualitative summary of reported tests - no estimated group means')
    text(d, (30, 86), 'REPORTED COMPARISON', 14, 'muted')
    for x, label in ((470, 'Significant'), (652, 'Marginal'), (808, 'Not significant')):
        text(d, (x, 86), label, 15, 'muted')
    for i, row in enumerate(e['contrasts']):
        y = 118+i*67
        d.line((28, y+61, 932, y+61), fill=COLORS['line'], width=1)
        if t >= (i+1)/(len(e['contrasts'])+1):
            text(d, (30, y+1), row['comparison'], 17, max_width=390)
            x = {'significant': 520, 'marginal': 689, 'nonsignificant': 863}[row['status']]
            color = COLORS['orange' if row['status']=='marginal' else 'purple']
            d.ellipse((x-8, y+17, x+8, y+33), fill=None if row['status']=='nonsignificant' else color, outline=color, width=3)
            text(d, (440, y+42), row['reported_p'], 14, 'muted', 480)
    text(d, (30, 337), 'Paper %s / Study %s / Figure %s' % (figure['paper'], figure['study'], figure['figure']), 17, 'plum')
    text(d, (30, 367), 'Statistical category is not effect size. Non-significance is not equivalence.', 15, 'muted')
    return image


def lab_frame(figure, t):
    if figure['figure']==3:
        return diary_frame(figure, t)
    puzzle = figure['figure']==1
    image, d = canvas('Puzzle performance' if puzzle else 'Negative mood',
                      'Study 1: writing regulation x recall task; qualitative findings')
    labels = ('Writing task', 'Recall task', 'RAT items' if puzzle else 'Mood ratings')
    details = ('Free / regulated', 'Room / favorite TV', 'Correct answers' if puzzle else 'Self-report')
    for i in range(3):
        x = 35+i*310
        box(d, (x, 93, x+265, 192), 'pale', 18)
        text(d, (x+20, 108), labels[i], 22, 'plum')
        text(d, (x+20, 146), details[i], 18, 'muted')
        if i<2 and t>(i+1)*.18:
            arrow(d, (x+271, 141), (x+300, 141))
    if puzzle:
        for i in range(3):
            box(d, (53+i*61, 218, 102+i*61, 266), 'purple' if t>(i+1)*.14 else 'pale', 7)
            text(d, (67+i*61, 230), ('?', '+', '?')[i], 21, 'cream' if t>(i+1)*.14 else 'plum')
        text(d, (275, 222), 'Room recall: regulated writers solved fewer items.', 18, max_width=645)
    else:
        box(d, (35, 215, 276, 277), '#f1ddc9', 28)
        text(d, (56, 233), 'Compare reported mood', 17, 'plum')
        text(d, (300, 222), 'Room recall: regulated writers reported more negative mood.', 18, max_width=610)
    if t>.55:
        box(d, (35, 295, 925, 350), '#e5e8dc', 12)
        text(d, (55, 310), 'Favorite-TV recall: the regulated/free contrast was not significant.', 20, 'plum')
    if t>.8:
        text(d, (35, 366), 'Interaction: '+figure['evidence']['contrasts'][0]['reported_p']+' / Not a clinical treatment test', 16, 'muted')
    return image


def diary_frame(figure, t):
    image, d = canvas('Daily diary: following days, not assigning viewing',
                      'Study 2: observational associations, not a randomized intervention')
    items = [('DAY 1', 'Effortful self-control'), ('DAY 2', 'Familiar-world use?'), ('DAY 3', 'Negative mood')]
    for i, (day, label) in enumerate(items):
        x = 35+i*310
        box(d, (x, 105, x+265, 207), 'pale', 15)
        d.rectangle((x, 105, x+265, 138), fill=COLORS['purple'])
        text(d, (x+20, 111), day, 19, 'cream')
        text(d, (x+18, 156), label, 20, 'plum', 235)
        if i<2 and t>(i+1)*.17:
            arrow(d, (x+269, 156), (x+300, 156), dashed=True)
    if t>.4:
        text(d, (38, 237), 'No familiar-world use: association reported ('+figure['evidence']['contrasts'][1]['reported_p']+').', 21, 'purple')
    if t>.65:
        text(d, (38, 279), 'Familiar-world use: association not significant ('+figure['evidence']['contrasts'][2]['reported_p']+').', 21, 'green')
    if t>.85:
        text(d, (38, 329), 'Interaction '+figure['evidence']['contrasts'][0]['reported_p']+'. These annotations are not effect magnitudes.', 17, 'muted')
    text(d, (38, 368), 'Arrows show chronology, not causation. Mood is not physical cognitive energy.', 16, 'muted')
    return image


def digest(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def generate(output=None):
    source = ROOT/'data/research_source.json'
    data = validate(json.loads(source.read_text(encoding='utf-8')))
    destination = Path(output) if output else ROOT/'assets/generated'
    destination.mkdir(parents=True, exist_ok=True)
    manifest = dict(version='1.0 FINAL', renderer='Python / Pillow 10.4.0', width=WIDTH,
                    height=HEIGHT, frames=FRAMES, duration_ms=DURATION,
                    author_source='python/generate_animations.py', source_sha256=digest(source),
                    code_sha256=digest(Path(__file__)), animations={})
    jobs = [('social-scene', None)] + [('evidence-%d'%i, f) for i, f in enumerate(data['figures'])]
    for name, figure in jobs:
        frames = [social_frame(i/(FRAMES-1)) if figure is None else
                  (evidence_frame(figure, i/(FRAMES-1)) if figure['paper']=='A' else lab_frame(figure, i/(FRAMES-1)))
                  for i in range(FRAMES)]
        atlas = Image.new('RGB', (WIDTH, HEIGHT*FRAMES))
        for i, frame in enumerate(frames):
            atlas.paste(frame, (0, i*HEIGHT))
        paths = {kind: destination/(name+suffix) for kind, suffix in
                 [('atlas', '-atlas.png'), ('poster', '-poster.png'), ('preview', '-preview.gif')]}
        atlas.save(paths['atlas'], optimize=True)
        frames[-1].save(paths['poster'], optimize=True)
        frames[0].save(paths['preview'], save_all=True, append_images=frames[1:],
                       duration=DURATION//FRAMES, disposal=2, optimize=True)
        manifest['animations'][name] = dict(
            kind='fictional illustration' if figure is None else 'qualitative research summary',
            figure_index=None if figure is None else data['figures'].index(figure),
            paths={k: 'assets/generated/'+p.name for k, p in paths.items()},
            sha256={k: digest(p) for k, p in paths.items()})
    # Manifest can be tested in a temporary directory without changing committed outputs.
    text_json = json.dumps(manifest, indent=2, ensure_ascii=True)+'\n'
    target = destination/'manifest.json' if output else ROOT/'data/python_animations.json'
    target.write_text(text_json, encoding='utf-8')
    if not output:
        (ROOT/'data/python_animations.js').write_text('window.FRIENDS_ANIMATIONS = '+json.dumps(manifest)+';\n', encoding='utf-8')
    return manifest


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--output', type=Path, help='Optional isolated output directory for reproducibility QA')
    args = parser.parse_args()
    result = generate(args.output)
    print('Authored %d animations x %d Python-rendered frames, PNG atlases, posters and GIF previews.' % (len(result['animations']), FRAMES))
