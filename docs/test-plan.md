# Test Plan R02 K10

## Objective

Detect unintended visual changes in important Mealie user journeys by comparing approved reference screenshots with screenshots obtained from a repeatable local test environment.

## Risks and controls

| Risk | Control |
| --- | --- |
| Flaky snapshots from live dates, loading or animation | Freeze viewport, locale, timezone and data; disable animation; wait for network idle |
| False approval of a UI defect | Require review of each diff and link intentional changes to a requirement or issue |
| Different data changes layout | Use a dedicated seeded test account and version the seed data |
| Browser rendering difference | Use only Playwright Chromium in CI and locally for baseline generation |

## Eight scenarios

| ID | Precondition | Action | Expected invariant |
| --- | --- | --- | --- |
| VR01 | Authenticated user; recipes seeded | Open recipe finder | Search, filters, recipe cards and navigation retain approved layout |
| VR02 | Timeline has seeded recipes | Open timeline | Timeline controls and recipe tiles retain approved layout |
| VR03 | Categories seeded | Open categories | Category grid/list and action controls retain approved layout |
| VR04 | Meal plan seeded | Open planner | Week grid, entries and planner controls retain approved layout |
| VR05 | Shopping list seeded | Open shopping lists | List cards, navigation and empty/non-empty indicators retain approved layout |
| VR06 | Authenticated user | Open profile | Summary cards and account navigation retain approved layout |
| VR07 | Foods seeded | Open food data | Table/list controls and rows retain approved layout |
| VR08 | Authenticated household user | Open meal plan settings | Setting controls and headings retain approved layout |

## Defect template

| Field | Required information |
| --- | --- |
| Defect ID | Example: VR-001 |
| Scenario and build | Scenario ID, Mealie tag/SHA, snapshot SHA |
| Evidence | Expected, actual and diff image paths; Playwright report link |
| Result | Regression or accepted intentional change |
| Severity | Critical, major, minor or cosmetic |
| Root cause | Component, CSS/layout rule or data cause, with corrective action |
