# The One With The Interactive Presentation

Version **0.4** is an English, Classic Friends presentation about comfort viewing, with **exactly 12 fully interactive slides**. Purple door, yellow frame, original character portraits, coffee artwork, responsive navigation, and the existing Three.js mug are preserved.

## Run locally

Run `node serve.cjs`, then open http://127.0.0.1:8000. No npm install, CDN, external font, or runtime internet access is needed. Stop the server with Ctrl+C. Opening `index.html` directly supports the slides, charts, and controls with illustrated 3D fallbacks; use local HTTP for actual WebGL scenes.

## The 12-slide structure

1. **Welcome to Central Perk** — preserved Three.js coffee mug with a five-second, one-turn animation, Replay, drag and keyboard controls.
2. **Modern Anxiety & Mental Overload** — interactive imagined stress meter with descriptive feedback.
3. **Why Do We Rewatch Friends?** — comfort viewing, Python-generated illustrative chart, and clickable explanations.
4. **The Science of Predictability** — mechanism 1, with interactive explanation and limitations reveals.
5. **PIVOT! The 3D Experience** — original Three.js couch; drag, keyboard, rotation slider, and reset.
6. **Friends Who Feel Like Family** — mechanism 2, parasocial relationships, with six illustrated character reveal cards.
7. **Giving Your Brain a Break** — mechanism 3, low cognitive load, with two reading tasks and answer reveals.
8. **The Nostalgia Effect** — mechanism 4, interactive three-point timeline and optional temporary reflection.
9. **Iconic Quotes & Emotional Triggers** — three quote cards with reveals and playful slide mood changes.
10. **The Anxiety Simulator** — Python-generated synthetic curves visualized in JavaScript with starting-level and scenario controls, SVG and accessible data table.
11. **Customize Your Comfort Zone** — working accent palette, font, visual mood, and reset, applied throughout the presentation.
12. **I'll Be There for You** — conclusions, limitations, descriptive accessible reference links, and restart.

## Controls and accessibility

Next/Previous, 12 chapter indicators, Left/Right, Home/End, and deep links such as `#slide-8` navigate the deck. Inputs retain their own keyboard controls. Focused 3D canvases consume their scene-control keys. Navigation remains fixed while each slide scrolls on smaller screens.

The original mug animation uses a clamped **5,000 ms** timeline. Replay is disabled while spinning; after it finishes, drag or keyboard controls explore the model. Rendering pauses when hidden. Reduced motion skips autoplay and steam; replay resets the static pose. The couch renders on demand without automatic motion. Missing WebGL, failed module loading, or direct file access preserves navigation and provides illustrations. Custom settings and reflection text are session-only and are not stored or transmitted.

## Illustrative data and scientific limits

**All chart numbers are invented educational examples.** There are no participants, surveys, stress measurements, cortisol measurements, diagnostic scores, or estimated treatment effects. The comfort weights are arbitrary, not percentages or population preferences. The simulator multiplies fixed, invented trajectories by an imagined starting value; even the relative ordering of scenarios is invented. Its arbitrary units have no clinical meaning.

Regenerate the JSON, browser data bundle, and exported SVG with standard-library Python:

```powershell
py -3 python/generate_data.py
```

On systems with a normal Python command, use `python python/generate_data.py`. Python generates `data/illustrations.json`, `data/illustrations.js`, and `data/comfort.svg`. The JavaScript bundle uses the same generated values and also works with direct file access. Regeneration is deterministic.

Familiar fictional worlds and nostalgia have been studied in broader settings. The presentation does not establish that Friends reduces anxiety. Predictability and low-load examples illustrate possible explanations, not validated experiments. Individual responses differ and nostalgia can be bittersweet. Comfort viewing does not replace reciprocal relationships or professional care.

References appear on Slide 12: [University at Buffalo on reruns research](https://www.buffalo.edu/news/ub-in-the-news/2012/09/13652.html), [APA definition of parasocial relationship](https://dictionary.apa.org/parasocial-relationship), and [research on nostalgia, connectedness, and self-continuity](https://eprints.soton.ac.uk/383274/).

## Validation

With the local server running, run `node tests/browser-test.cjs`. It launches isolated headless Microsoft Edge using its local DevTools interface; `BROWSER_PATH` can select another Chromium executable. Screenshots go into ignored `test-results/`.

The suite checks the exact 4,999/5,000 ms mug boundaries, genuine Three.js drawing, replay, drag and keyboard controls, all 12 titles and navigation destinations, counter and progress, each new interaction, couch rendering and rotation/reset, Python data use, customization/reset, references, five viewport widths, reduced motion, and no-WebGL/file fallbacks. Intentionally disabling WebGL produces expected Three.js context errors in the fallback test.

## Files and attribution

`index.html`, `style.css`, and `script.js` provide the deck. `mug.js` and `animation-timeline.mjs` preserve the coffee experience; `couch.js` provides the original couch model. `python/generate_data.py` and `data/` contain the synthetic examples. `serve.cjs` is a loopback-only static server. `PRD.md` defines v0.4 acceptance criteria.

Unofficial educational Friends-inspired project. Illustrations, models, and textures are original; brief character quotes are attributed in the slide. Three.js r170 is bundled under MIT; see `vendor/README.md` and `vendor/THREE-LICENSE.txt`. No claim of affiliation with the series or its creators is made.

The v0.4 milestone is a **local Git commit after tests pass**. Do not push to GitHub as part of this milestone.
