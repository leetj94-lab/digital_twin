# Factory Twin

**Live GitHub Pages:** https://leetj94-lab.github.io/digital_twin/

Interactive WebGL facility concept with repository-local factory models, equipment
selection, synthetic quality trends, alarms, work requests and technical documents.
All data and geometry are fictional or appropriately licensed; no employer assets.

## Main-branch deployment

Pages settings: **Deploy from a branch → main → /(root)**.
The root index.html and generated assets/, models/, licenses/ and integration/ folders
are committed ready to serve. .nojekyll prevents Jekyll processing. No ChatGPT hosting
is needed. The Pages workflow in .github validates source and generated output only;
GitHub's branch-based publishing handles the actual deployment.

```sh
npm ci
npm test
npm run build
```

Edit **index.source.html** and src/ (root index.html is generated). Run npm run build
and commit both source and generated root output to main. Source dependencies are
pinned in package-lock.json. npm run dev serves the checked-in root publication;
for source development use /index.source.html and rebuild before publishing.

## Features

- Orbit/zoom, overview/interior/plan views, selectable equipment meshes and name tags.
- Equipment list can be minimized, closed and reopened.
- Equipment quality/alarms/work/documents are contextual; data is synthetic.
- Acknowledgement does not clear the physical warning. Linked requests persist locally.
- Platform → Master data opens the same canonical asset at the public Pages site.
- Master-data lifecycle, specifications and maintenance standards are owned by the
  separate master_data demo. Cross-app edits are not automatically synchronized.
- Platform also opens drawing management and document handover by the same asset ID.
- ETL monitoring is available for real in-browser processing of synthetic record batches.
- All five demos retain separate browser-local state; no automatic cross-app synchronization.

## Models and architecture

Three.js WebGLRenderer, OrbitControls and GLTFLoader. Repository-local CC0 Kenney
factory model plus original utility scene/pumps/pipes. See THIRD_PARTY_NOTICES.md
for provenance, exact hashes and licenses. SVG compatibility rendering is available
when WebGL cannot initialize. GPU rendering was not directly verified in the managed
browser, which has WebGL disabled.

Application/domain modules are in src/. Utility geometry is authored in src/scene.js;
public/models/utility-hall.glb is its exported glTF snapshot (node extras retain IDs).
Re-export with node scripts/export-model.mjs after geometry edits, then rebuild.

Browser-local state only: no shared backend, login system or real industrial connection.
Local data from earlier ChatGPT hosting is not migrated to the new origin.

Shared fixture, URL and export contracts are described in docs/INTEGRATION.md.
Versioned master snapshots use v2 lifecycle vocabulary set-up/active/inactive/expired;
this twin does not import those snapshots or infer current master status from warnings.

MIT for original code. Third-party model/software licenses remain separate.
