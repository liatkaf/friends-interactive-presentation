# The One With The Interactive Presentation

Version **0.3** adds a real, offline Three.js coffee mug to the immersive twelve-chapter Friends presentation. The purple door, yellow frame, Polaroid cards, Central Perk environment, English content, and existing navigation are preserved.

## Run locally

The 3D feature uses JavaScript ES modules, so serve the folder over local HTTP rather than opening the HTML with `file://`.

With Node.js installed, open a terminal in this directory and run:

```powershell
node serve.cjs
```

Visit **http://127.0.0.1:8000**. Stop the server with Ctrl+C. The included server has no package dependencies, binds only to your computer's loopback interface, and does not require internet access.

Alternatively, with Python 3 installed:

```powershell
python -m http.server 8000 --bind 127.0.0.1
```

Open the same address. A modern WebGL 2-capable browser is required for 3D. Opening `index.html` directly still provides all twelve slides and navigation, with a static coffee illustration and instructions to start the server.

## The 3D coffee experience

- A hollow orange ceramic shell made with `LatheGeometry`, a rounded tubular handle, a glazed lip, and a raised foot.
- An original curved Central Perk-inspired badge generated as a canvas texture; no external image or logo asset is loaded.
- A reflective dark coffee surface, meniscus, and a small crescent of crema bubbles.
- Physical ceramic materials with clearcoat, a generated studio reflection environment, warm key/fill/rim lighting, a saucer, and real soft shadow maps.
- Fifteen translucent steam sprites with procedural textures, rising and drifting above the coffee.
- One smooth, eased 360-degree turn on a **5,000 ms timeline**. It starts once the model is prepared and the mug becomes visible on Slide 1. The final pose is clamped, so the mug never keeps spinning after the timeline ends.
- **Replay Animation** starts another five-second turn. The button is disabled while a turn is running.
- After the turn, drag horizontally with the mouse to rotate; drag vertically to tilt. Pointer capture keeps a drag stable when the pointer leaves the canvas. Touch input also supports horizontal rotation; vertical gestures remain available for scrolling the chapter.
- With the mug canvas focused, Left/Right turn it, Up/Down tilt it, and Home resets its pose. These keys control the focused mug; Tab back to navigation to resume slide keyboard controls.

The timeline uses `performance.now()` rather than counting frames. It is exactly 5,000 ms in animation time; the displayed end frame and button update happen on the next browser render/event-loop opportunity, which can be later on a busy or backgrounded browser. Steam continues after the mug's automatic rotation stops.

Leaving Slide 1 or scrolling the mug out of view suspends rendering. An already-started spin keeps its original wall-clock deadline and is finished when revisited; it does not restart on every slide visit. The renderer caps device pixel ratio at 2 and steam rendering at 30 fps, reuses shadow maps when the mug is stationary, and disposes GPU resources on page unload.

## Accessibility and fallbacks

With reduced motion enabled, the 3D mug is static, steam is hidden, autoplay is skipped, and Replay resets the static pose instead of starting motion. Direct manual exploration remains available. Changes to the preference are applied immediately. Existing cinematic CSS effects and pointer parallax also respect reduced motion.

If WebGL is unavailable, a module cannot load, or the graphics context is lost, the original CSS coffee illustration and a clear status message take its place. Replay is unavailable in fallback mode. All twelve slides and their navigation continue working independently of the 3D module. The mug has a keyboard-focus outline, accessible instructions, and a live status message.

## Presentation controls

- Next / Previous, or Right / Left arrows outside the mug canvas.
- Twelve clickable chapter indicators.
- Home / End jump to the first / last slide outside the mug canvas.
- Opening button starts the story; closing button restarts it.
- URLs such as `http://127.0.0.1:8000/#slide-8` open a chapter directly; refresh retains it.
- Previous is disabled on Slide 1; Next is disabled on Slide 12.
- Mobile and shorter windows scroll within each chapter while navigation stays visible.

## Twelve chapters

1. Welcome to Friends
2. The One Where It All Began
3. Meet the Six Friends
4. Welcome to Central Perk
5. Monica's Apartment
6. The Relationships
7. Iconic Moments
8. Who Said That?
9. Which Friend Are You?
10. Friends by the Numbers
11. Behind the Scenes
12. The Last One

## Testing

Start `node serve.cjs`, then in another terminal run:

```powershell
node tests/browser-test.cjs
```

The dependency-free test uses Microsoft Edge in headless mode on Windows and its local DevTools protocol. Set `BROWSER_PATH` to another Chromium executable if needed. It uses a temporary isolated browser profile, enables Chromium's software WebGL renderer for headless testing, and writes ignored screenshots to `test-results/`. The presentation itself uses normal browser graphics settings.

Checks cover the exact timeline boundaries (4,999 ms versus 5,000 ms), genuine Three.js r170 exports, real WebGL drawing, rotation and its stable endpoint, Replay, real mouse drag, keyboard exploration, navigation during rotation, all twelve slides, hash reloads, hidden-slide autoplay, widths of 320/390/768/1024/1440px, reduced motion, local-only assets, and file/WebGL fallback navigation. Manually check the steam, glossy glaze, coffee reflections, door composition, and drag behavior in your regular browser as well.

Version 0.3 verification: **195 checks passed**, with no unexpected JavaScript/WebGL errors and no external runtime requests. The deliberately disabled-WebGL test emits Three.js's expected context-creation error before confirming that the illustration and slide navigation work. Desktop, mobile, and reduced-motion renders were visually reviewed.

## Files

- `index.html`, `style.css`, `script.js`: presentation shell, art direction, content, and navigation.
- `mug.js`: isolated Three.js scene, controls, steam, rendering lifecycle, and accessibility behavior.
- `animation-timeline.mjs`: pure 5,000 ms rotation timeline.
- `vendor/three.module.js`: locally stored Three.js r170 with an ES-module adapter.
- `vendor/THREE-LICENSE.txt`, `vendor/README.md`: MIT license and exact dependency provenance.
- `serve.cjs`: dependency-free local HTTP server.
- `tests/browser-test.cjs`: repeatable browser and timeline regression checks.
- `PRD.md`: full product scope, including later features.

## Scope, attribution, and Git

Quizzes, scoring, live text editing/reset, Python processing, real charts, clickable timeline/café objects, a functional relationship map, and sourced production fact reveals remain previews. The chart bars are decorative shapes without data. None of those advanced features were added in 0.3.

This is an unofficial educational project inspired by Friends. Artwork, scene descriptions, textures, and character studies are original CSS, SVG, or canvas work. Three.js r170 is MIT-licensed (copyright 2010–2024 Three.js authors); its source and license are included locally. See `vendor/README.md` for the bundled module's provenance. No CDN, external font, model, texture, or other network service is used at runtime. Three.js rendering follows the [official WebGLRenderer documentation](https://threejs.org/docs/pages/WebGLRenderer.html).

Requested local milestone: `feat: add interactive 3D Central Perk coffee mug`. No GitHub push is part of this version. This workspace may restrict writes to `.git`; check the actual Git log before assuming a commit was created. Screenshots, full team credits, sourced datasets, and the remaining PRD deliverables belong to later milestones.
