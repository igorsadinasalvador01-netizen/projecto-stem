# Commercial takeoff checklist (starter — expand when commercial work begins)

Commercial sets differ from residential: more sheets, strict schedules, finish codes, multiple levels, and match lines.

## Additional setup
- Use `sheet_graph` early — room tags, finish codes, and schedules are usually spread across sheets.
- Stitch sheets split across match lines before measuring (do this in the canvas if no agent tool covers it; list as an open item otherwise).
- Group quantities by level and by building/zone.
- Build conditions from the finish schedule (floor, base, wall, ceiling codes) rather than by material name.

## Checklist
1. Floor finishes by finish code (m²) per room and per level; carpet as roll goods where seams matter
2. Base / skirting by code (m) — `derive_base`
3. Transitions (m) — `derive_transitions`; doorway thresholds between rooms are withheld: list them
4. Wall finishes by code (m²) — `measure_surface`
5. Ceilings by type (m²) — acoustic tile, plasterboard, exposed; bulkheads separately
6. Partitions by wall type (m)
7. Doors and hardware sets by schedule (each)
8. Fixtures and equipment by symbol (each)
9. Services counts per legend (each)

## Sanity checks
- Room areas per level ≈ net lettable / usable area on the area schedule, if provided
- Every room tag on plan resolves to a finish schedule row — list unresolved tags
