# Factory Twin

An interactive WebGL digital twin concept for an industrial utility facility. Select equipment in the model and follow its quality trends, alarms, technical documents and work requests without leaving the workspace.

**Portfolio concept · Synthetic data · Simulated processing.** This is a functional frontend demo, not a production monitoring or maintenance system and not a reproduction of employer software.

## Try the workflow

1. Orbit/zoom the 3D model or choose **Overview**, **Interior** or **Plan**.
2. Click the warning pump `EQ-UT-00142`, its label, or its equipment-list entry. Search supports IDs, equipment names and areas.
3. Open **Quality** to inspect a synthetic trend and threshold.
4. Open **Alarms** and acknowledge the warning. Acknowledgement does not falsely clear the physical quality condition.
5. Open **Work**, enter a summary and submit a work request. The selected equipment and source alarm are linked automatically.
6. Open **Documents** to download a synthetic specification, guide or CSV. Inspect the inline linked schematic.
7. Refresh the browser: requests and acknowledgements persist in local storage. **About → Reset demo data** clears only this demo's state.

## Run locally

Requires Node.js 20.19+ (Node.js 22 recommended).

```bash
npm ci
npm run dev
```

```bash
npm test
npm run build
```

The production build is `dist/`. Serve it through HTTP; opening `index.html` with `file://` does not support normal module/model loading.

## Architecture

- **Rendering:** Three.js WebGLRenderer, OrbitControls, raycasting, asset-label projection, animated camera presets, model visibility controls, responsive resize and capped device pixel ratio.
- **Models:** repository-local CC0 Kenney factory GLB plus texture, combined with an original procedural utility hall and equipment. Assets are not hotlinked. See `THIRD_PARTY_NOTICES.md` for exact provenance, hash and licenses.
- **Application:** JavaScript modules and Vite. `src/data.js` owns fixtures and immutable alarm/work transitions; `src/viewer.js` owns the scene; `src/main.js` owns interaction and UI.
- **State:** browser-local persistence with malformed-state recovery and safe output escaping. This demo deliberately has no live industrial connection, authentication, telemetry backend or shared work-order database.
- **Documents:** downloadable synthetic HTML/CSV and inline SVG schematic; no real engineering documents.
- **Verification:** state-transition tests cover equipment/alarm linking, input validation, idempotent acknowledgement, persistence recovery and synthetic warning consistency. Browser workflow verification is recorded in `QA.md`.

## GitHub Pages

The included `.github/workflows/pages.yml` validates and builds the project, then deploys `dist/`. In the repository settings, enable **Pages → Source: GitHub Actions**. Relative production asset paths support repository subpaths. A pull request only validates/builds and does not deploy.

## Model scope and attribution

The adjacent campus factory is Kenney's **City Kit (Industrial)**, CC0. The selectable pumps, chillers, air handlers, utility structure and piping are original sample geometry. The scene is an illustrative facility, not an engineering-accurate construction model. No company data, screenshots, code or facility layouts are included.

MIT for original application code; third-party licenses remain separate.

## Export the original scene

`public/models/utility-hall.glb` contains an exported copy of the original utility scene, including equipment IDs in glTF node extras. Rebuild it after changing procedural geometry with:

```bash
node scripts/export-model.mjs
```

The application builds that same original scene from `src/scene.js` for asset interactions and loads the separate Kenney factory GLB at runtime. Keeping both the source geometry and an interchange-format snapshot makes it straightforward to replace the original scene with a real approved BIM/glTF model later.

WebGL-unavailable browsers use Three.js SVGRenderer compatibility rendering of the same geometry, with simplified materials. The application reports the active renderer in the footer.
