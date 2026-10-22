# Residential takeoff checklist

Work top-down in this order. Skip any section not shown on the drawings and list it under "Not measured".
Defaults below are starting assumptions — replace with values from the drawings/specs when present, and always state which was used.

## Default assumptions (override from drawings)
| Item | Default |
|---|---|
| Ceiling height | 2.4 m (2.55–2.7 m common in newer builds — check sections) |
| Floor tile / flooring waste | 10% (15% for diagonal or large-format tile) |
| Timber / hybrid flooring waste | 8–10% |
| Carpet waste | 10% (use roll-goods setup if seams matter) |
| Plasterboard waste | 10% |
| Skirting / cornice waste | 10% |
| Wet-area wall tile height | Shower 2.0 m, elsewhere per plans |

## 1. Site and slab (site plan / slab plan)
- Slab area (m²) — `measure_polygon` on building outline incl. garage/alfresco
- Slab edge / perimeter (m) — `measure_line`
- Slab volume (m³) — DERIVED: area × thickness from slab/engineering note
- Driveway, paths, paving (m²)

## 2. Floor areas (floor plan)
- Gross floor area by zone: living, garage, alfresco/porch (m²)
- Each room (m²) — `one_click` / `detect_rooms`; name rooms from room tags
- Floor finish by type (tile, timber/hybrid, carpet, polished concrete) — one condition each

## 3. Walls
- External wall length (m), internal wall length (m) — `measure_line`, separate conditions
- External cladding/brick area (m²) — from elevations with `measure_surface`, deduct openings with `cut_out`
- Internal plasterboard walls (m²) — `measure_surface`, ceiling height, deduct openings >1 m²

## 4. Ceilings and linings
- Ceiling area (m²) — equals room areas unless raked/bulkhead; flag variations
- Cornice (m) — room perimeters (`derive_base` pattern)
- Wet-area ceiling (m²) if separate board type

## 5. Openings (door and window schedules)
- Doors by type and size (each) — `sweep_schedule_row` / `symbol_sweep`
- Windows by mark and size (each), plus total glazing area (m²)
- Garage door(s), sliding/stacker doors (each)

## 6. Wet areas
- Waterproofing: floor (m²) + shower walls to height + upturns (m²)
- Wall tiles (m²) per room and height
- Floor tiles (m²)

## 7. Trims and finishes
- Skirting (m) — `derive_base` from rooms; deduct door openings
- Architraves (each door/window opening, or m)
- Painting: walls (m²), ceilings (m²), doors (each)

## 8. Roof (roof plan + elevations)
- Roof plan area (m²) — `measure_polygon`
- Roof surface area (m²) — DERIVED: plan area × pitch factor (pitch from roof plan/elevations)
- Gutters, fascia (m), valleys, hips, ridges (m) — `measure_line`
- Downpipes (each) — `place_count` / `symbol_sweep`

## 9. Services (electrical and plumbing plans)
- Electrical: GPOs single/double, downlights, pendants, switches, data, smoke alarms, exhaust fans (each) — `symbol_sweep` per symbol from the legend
- Plumbing fixtures: toilets, basins, showers, baths, sinks, laundry tubs, taps, HWS (each)

## 10. Joinery
- Kitchen base and overhead cabinets (m), benchtop (m²)
- Vanities, laundry, robes (m or each)

## Sanity checks specific to residential
- Rooms + wall footprint ≈ gross floor area
- Internal plasterboard m² is typically ~2.5–3.5 × floor area for single storey at 2.4 m — flag if far outside
- GPO count is usually 2–4 per bedroom, more in kitchen/living — flag rooms with zero
