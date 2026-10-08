# R02 K10 Mealie Visual Regression Testing

This repository contains the final-course test harness for **R02 Mealie + K10 Visual Regression Testing**. It is intentionally separate from the upstream Mealie codebase: this lets the group pin a Mealie version, keep test data and screenshots under review, and run the test suite repeatedly without modifying upstream source.

## Scope

The suite protects eight stable, authenticated screens at a fixed 1440 x 900 Chromium viewport:

| ID | Screen | Route |
| --- | --- | --- |
| VR01 | Recipe finder | `/g/{group}/recipes/finder` |
| VR02 | Recipe timeline | `/g/{group}/recipes/timeline` |
| VR03 | Recipe categories | `/g/{group}/recipes/categories` |
| VR04 | Meal planner | `/household/mealplan/planner/view` |
| VR05 | Shopping lists | `/shopping-lists` |
| VR06 | Profile dashboard | `/user/profile` |
| VR07 | Group food data | `/group/data/foods` |
| VR08 | Meal plan settings | `/household/mealplan/settings` |

## Prerequisites

1. Run a local Mealie instance only. Do not run the suite against a public deployment.
2. Create a dedicated test user, group, and household.
3. Seed deterministic data: at least 10 recipes, 3 categories, 10 foods, 1 shopping list, and one week of meal-plan entries. Use stable English labels and avoid date-sensitive content.
4. Install Node.js 22 or later.

## Setup

```bash
cp .env.example .env
npm install
npx playwright install chromium
```

Update `.env` with the local URL, test-user credentials, and group slug. Credentials remain local and are never committed.

## Baseline workflow

Create trusted baseline screenshots after checking the local Mealie version and seed data:

```bash
npm run test:visual:update
git add tests/__screenshots__
git commit -m "test: add approved visual baselines"
```

Review every changed image in the HTML report or pull-request artifact before accepting it. A changed snapshot is not automatically correct: label it **intentional** only if the UI change has a corresponding requirement or accepted issue; otherwise record it as a **regression**.

## Run and inspect

```bash
npm run test:visual
npm run test:visual:report
```

On failure, Playwright writes actual, expected, and diff images to `test-results/`, along with a trace. The HTML report is written to `playwright-report/`.

## Test model and pass fail criteria

| Item | Decision |
| --- | --- |
| Browser | Chromium only, pinned by Playwright |
| Viewport | 1440 x 900, device scale factor 1 |
| Locale and timezone | `en-US`, UTC |
| Dynamic UI | Animation and transitions disabled; loading widgets hidden |
| Pass | Screenshot matches its approved baseline within `maxDiffPixelRatio: 0.01` |
| Fail | Navigation, console/network failure, or unapproved visual difference |

## Team workflow

Use one branch and pull request per task. The reviewer checks: Mealie version/commit, seed-data version, screenshot diff, and the intentional-versus-regression decision. Keep a defect record with ID, route, expected image, actual image, severity, status, evidence, and root cause.

## Reproducibility

Before the final defense, record the upstream Mealie tag and commit SHA, Docker image tags, Node and Playwright versions, `.env.example`, seed-data script/export, and approved snapshot commit SHA in the report. This repository must contain no credentials or production data.
