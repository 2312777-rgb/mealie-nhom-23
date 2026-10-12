import { spawnSync } from "node:child_process";
import { mkdirSync, writeFileSync, readFileSync } from "node:fs";
import path from "node:path";
for (const mode of ["regression", "intentional"]) {
  const output = `evidence/demo-${mode}`;
  mkdirSync(output, { recursive: true });
  const json = path.resolve(output, "results.json");
  const run = spawnSync(process.execPath, ["node_modules/@playwright/test/cli.js", "test", "--project=chromium", "--grep=VR01", `--output=${output}/artifacts`], {
    encoding: "utf8", env: { ...process.env, MEALIE_DEMO_MODE: mode, PLAYWRIGHT_JSON_OUTPUT_FILE: json, PLAYWRIGHT_HTML_OUTPUT_DIR: `${output}/html` },
  });
  writeFileSync(`${output}/run.log`, (run.stdout ?? "") + (run.stderr ?? ""));
  if (run.status !== 1) throw new Error(`Demo ${mode} must produce exactly an expected test failure; got ${run.status}`);
  const report = readFileSync(json, "utf8");
  if (!report.includes("toHaveScreenshot") || !report.includes("pixels")) throw new Error(`Demo ${mode} did not fail on a pixel difference. Inspect ${output}.`);
  writeFileSync(`${output}/classification.json`, JSON.stringify({
    mode, synthetic: true, scenario: "VR01", expectedOutcome: "screenshot mismatch", classification: mode === "regression" ? "regression" : "intentional demonstration",
    requirement: mode === "intentional" ? "REQ-DEMO-01: demonstrate an explicitly requested page background color" : null,
    rootCause: mode === "regression" ? "Injected CSS translates main content 48 pixels" : "Injected CSS changes main background to #1e40af",
    baselineChanged: false,
    note: "Controlled browser-only demonstration; not a defect discovered in upstream Mealie. A real intentional change still requires human approval before baseline update.",
  }, null, 2));
  console.log(`${mode}: expected screenshot mismatch confirmed; ${output}`);
}
