# Verification — 30 October 2026

## Automated

- `npm test`: six state-transition/validation/persistence tests passed.
- `npm run build`: Vite production build passed.
- Both repository-local GLBs are valid glTF 2.0 containers; imported factory external texture is bundled.

## Browser workflow

Verified in the managed Chrome preview:

- 3D facility and imported factory model load. Footer confirms local glTF loaded.
- Selecting pump A opens its contextual overview, specifications and warning.
- Alarm acknowledgement changes from Unacknowledged to Acknowledged without clearing the physical quality warning.
- Work request creation automatically attaches the correct asset and source alarm; request appears in linked requests.
- Reloading preserves acknowledgement and work request.
- Interior and plan camera preset controls change the model camera.
- Documents tab exposes specification, guide, synthetic readings and linked schematic.

## Verification boundary

The managed browser reports its WebGL context as disabled. Therefore visual browser testing used the Three.js SVG compatibility renderer of the same geometry. The normal WebGL renderer path compiles but GPU rendering has not been directly verified in this environment. Compatibility rendering intentionally omits PBR textures and detailed lighting. Mobile CSS is included; physical-device touch/GPU testing has not been performed.

This frontend demo has no backend, authentication or live industrial telemetry. Work/acknowledgement state is local to the browser. The included Pages workflow requires GitHub Pages to be enabled with GitHub Actions as source.

## Platform and equipment UI update

- State and integration tests: 10 passed. Integration tests verify per-asset bundle
  scoping, reference integrity, version rejection and deployment-subpath deep links.
- Browser: Equipment minimize, close and reopen verified.
- Browser: clicking pump B's name tag selects pump B and displays 2.1 mm/s, with
  the selection box and `assetId=EQ-UT-00143` in the URL. Keyboard activation works.
- Root cause: global button:active transform displaced the absolutely positioned tag
  on mouse-down. A tag-specific active transform now preserves its anchor.
- Browser: Platform tab shows the four planned apps and scoped record counts; JSON
  export produces a successful download action and confirmation. Reload restores
  the selected equipment and Platform tab from the URL.
- GPU verification boundary described above still applies.

- Master data now has a verified deployed URL in the platform registry. Its link
  carries the selected canonical asset ID; other applications remain Planned.
