# Shared demo platform — contract v1

Master data is available as an independent standards/lifecycle demo. The other three related repositories are planned applications. This release changes only
`digital_twin`; it does not claim those apps are deployed or synchronized.

## Ownership and compatibility

| Repository | Owns | Relationship |
| --- | --- | --- |
| `master_data` | Stable asset identity, specs, location, lifecycle | `assets[].id` is the canonical `assetId` |
| `engineering_drawing` | Drawing revisions and equipment links | `drawings[].assetIds` |
| `document_delivery` | Submissions, validation, released documents | `deliveries[].documentIds` and `assetIds` |
| `etl_monitoring` | Runs, lineage, retries, ingestion status | `pipelines[].assetIds`; preserve canonical IDs |
| `digital_twin` | Model-node mapping and contextual workspace | glTF node extras / scene groups use canonical IDs |

Never infer identity from names, mesh indexes or screen positions. A rename must
preserve the ID. Use a retired lifecycle state instead of deleting identities
referenced by historical documents or runs. A master-data update is authoritative;
the viewer consumes a projection and does not overwrite master records.

## Files ready for reuse

- `public/integration/seed.v1.json`: shared synthetic fixtures (8 equipment records,
  linked drawing/document/delivery records, 2 pipelines and 2 alarms).
- `public/integration/bundle.v1.schema.json`: structural JSON Schema for portable exports.
- `shared/platform.js`: dependency-free context, URL and export adapters plus semantic
  reference validation. `createBundle` intentionally scopes relations to one asset.
- `tests/platform.test.js`: compatibility and referential-integrity checks.

Future repos should consume the same pinned seed and adapter version. Initially
copy these files with the source commit recorded. Once at least two apps consume
them, extract a shared versioned package; avoid five independently edited fixtures.
Breaking field/meaning changes require a new major contract and migration adapter.

## Navigation contract

All apps should accept `?siteId=DEMO-PLANT-01&assetId=EQ-UT-00142`.
The twin additionally supports `tab=Overview|Quality|Alarms|Work|Documents|Platform`.
Its URLs preserve the deployment subpath. A direct URL reopens the matching equipment
and section. Invalid equipment IDs do not select an unrelated asset.

`modules` contains the four exact repositories. Master data has a verified deployed base URL; other applications have `baseUrl:null`. Set each base URL
only after the actual deployment exists; `moduleLink` then constructs asset context
and `returnTo`. Unimplemented applications explicitly say Planned and link to source only. Master data opens its equipment context.
Future receivers must allowlist return origins/paths and never redirect blindly to
an arbitrary `returnTo` URL. Do not put tokens, document bodies or private data in URLs.

## Stage 1: static interoperable demos

Use shared fixtures plus deep links. **Platform → Export linked sample JSON** exports
selected equipment, linked records, work requests and alarm acknowledgements. A future
importer must run JSON Schema validation **and** `validateBundle` before applying state.
The twin currently exports; it does not import files or promise shared state.

Separate domains cannot share localStorage. Even GitHub Pages apps on the same origin
should keep app-specific namespaces. URL navigation only passes identity, not changes.
Do not claim that acknowledging an alarm here updates another independently hosted app.

## Stage 2: shared service (future work)

Place one API/data store behind adapters; keep view components separate from data
providers. Suggested resource boundaries, not endpoints implemented in this release:

| Resource | Writer | Readers |
| --- | --- | --- |
| `/v1/assets/{assetId}` | Master data | All apps |
| `/v1/drawings?assetId=...` | Drawing service | Twin, delivery |
| `/v1/documents?assetId=...` | Delivery service | Twin, drawing |
| `/v1/pipeline-runs?assetId=...` | ETL service | Twin, ETL UI |
| `/v1/work-requests`, `/v1/alarms` | Authorized operation service | Twin |

Events such as `asset.updated`, `drawing.released`, `delivery.accepted` and
`pipeline.run.failed` should carry `eventId`, `schemaVersion`, `siteId`, `assetId`,
`occurredAt` (ISO 8601 UTC), `source`, `correlationId`, `recordVersion` and `payload`.
Consumers deduplicate on eventId, reject older recordVersion values and track retries.
Acknowledge events never imply the underlying quality condition has cleared.
Only accepted releases become drawing/document references; preserve revision history.
Add authentication, least-privilege write authorization, CORS allowlists and server-side
validation when the common backend is actually introduced.

## First cross-app scenario

1. Register equipment in master data; keep its ID when renaming.
2. Submit its specification in delivery and release an accepted revision.
3. Link the released document/drawing revision to the same asset in drawing management.
4. ETL ingests quality samples using that ID and reports a failed or successful run.
5. Twin opens the equipment, shows the applicable released records and quality context,
   and creates a work request linked to the warning.

This is the implementation plan for the future apps, not functionality claimed for
the current frontend demo.

## Main branch publication

Both demos use GitHub Pages main / (root). Build and commit generated root files.
Twin entry source is index.source.html; root index.html is generated. Master snapshots
now use version 2.0.0 for set-up / active / inactive / expired lifecycle semantics.
The twin still uses context navigation, not automatic master snapshot import.
