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
