import "dotenv/config";
import { writeFile } from "node:fs/promises";
const base = new URL(process.env.MEALIE_API_URL ?? "http://localhost:19000");
if (!["localhost", "127.0.0.1", "[::1]"].includes(base.hostname)) throw new Error("Localhost only");
if (process.env.MEALIE_ALLOW_SEED !== "true") throw new Error("Opt in with MEALIE_ALLOW_SEED=true");
const email = process.env.MEALIE_TEST_EMAIL;
const password = process.env.MEALIE_TEST_PASSWORD;
if (!email || !password) throw new Error("Configure QA credentials first");
let response = await fetch(new URL("/api/users/register", base), {
  method: "POST", headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ email, password, passwordConfirm: password, username: "visualqa", fullName: "Visual QA Team", group: "R02 K10 QA", household: "QA Household", locale: "en-US", seedData: false }),
});
if (![200, 201, 400, 409].includes(response.status)) throw new Error(`Register: HTTP ${response.status}`);
response = await fetch(new URL("/api/auth/token", base), { method: "POST", body: new URLSearchParams({ username: email, password }) });
if (!response.ok) throw new Error(`QA login failed: HTTP ${response.status}`);
const { access_token: token } = await response.json();
response = await fetch(new URL("/api/users/self", base), { headers: { Authorization: `Bearer ${token}` } });
if (!response.ok) throw new Error(`QA account: HTTP ${response.status}`);
const user = await response.json();
await writeFile(".env", [
  `MEALIE_BASE_URL=${process.env.MEALIE_BASE_URL ?? "http://localhost:3000"}`,
  `MEALIE_API_URL=${base.origin}`, `MEALIE_TEST_EMAIL=${email}`, `MEALIE_TEST_PASSWORD=${password}`,
  `MEALIE_TEST_GROUP_SLUG=${user.groupSlug}`, `MEALIE_FIXED_DATE=${process.env.MEALIE_FIXED_DATE ?? "2026-10-12T12:00:00Z"}`, "MEALIE_ALLOW_SEED=true", "",
].join("\n"));
console.log(`QA account ready; group slug: ${user.groupSlug}. Credentials remain in .env.`);
