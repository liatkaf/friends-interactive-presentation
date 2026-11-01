# Three.js r170 (0.170.0)

`three.module.js` contains genuine Three.js r170, with an isolated ES-module adapter exposing its namespace as the default export. It has no runtime network or webpack dependency.

The source was recovered from the existing locally installed Microsoft Office offline web previewer asset, `three.js.c95329303ae479ea2645_05831ec167509d401202f01cdb2bc36a.js`, because network downloads were unavailable during development. The original Three.js factory and its copyright header are retained. A private chunk array and two export-definition helpers load the factory without installing a webpack runtime or global THREE namespace. Three.js retains its own revision marker. The application verifies `THREE.REVISION` during testing.

Upstream: https://github.com/mrdoob/three.js/tree/r170

License: MIT; full text in `THREE-LICENSE.txt`, verified against https://github.com/mrdoob/three.js/blob/r170/LICENSE.

This is a pinned dependency, not a claim to use the latest release. When updating it, use an official upstream module, retain the MIT license, and rerun the browser tests.

Version 0.7 adapter fix: the private `self` shim forwards `requestAnimationFrame` and `cancelAnimationFrame` to the browser. Three.js uses these callbacks during renderer cleanup even when the application renders on demand. This fixes disposal during real WebGL context loss without changing the upstream Three.js factory or namespace. The live context-loss smoke test exercises this path.
