// Tests the deployed edge router (lib/api-router.ts) exactly as Cloudflare/Vercel call it.
import { handleRequest } from "../lib/api-router";

const env = {}; // No API keys, no D1 — exercises graceful fallbacks.

async function hit(method: string, path: string, body?: any) {
  const req = new Request(`http://localhost/api/${path}`, {
    method,
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
  const res = await handleRequest(req, env, path.split("/"));
  const text = await res.text();
  let parsed: any;
  try { parsed = JSON.parse(text); } catch { parsed = text.slice(0, 120); }
  const ok = res.status < 500;
  console.log(`${ok ? "PASS" : "FAIL"} ${method} /api/${path} -> ${res.status} :: ${JSON.stringify(parsed).slice(0, 110)}`);
  return res.status;
}

async function main() {
  let fails = 0;
  const expect = async (m: string, p: string, status: number, body?: any) => {
    const s = await hit(m, p, body);
    if (s !== status) { fails++; console.log(`   ^^ expected ${status}, got ${s}`); }
  };
  await expect("GET", "health", 200);
  await expect("GET", "ai-status", 200);
  await expect("GET", "hf-status", 200);
  await expect("GET", "motivational", 200);
  await expect("POST", "chat", 200, { message: "سلام" });
  await expect("POST", "chat", 400, {});
  await expect("POST", "goal-insight", 200, { student: { name: "مریم" }, currentTraz: 6000 });
  await expect("POST", "goal-insight", 200, {}); // fully empty body must not 500
  await expect("POST", "analyze-exam", 200, { lessons: [{ lessonName: "زیست‌شناسی", percentage: 30, correct: 10, wrong: 15, empty: 5 }], field: "tajrobi" });
  await expect("POST", "psychology-analysis", 200, { student: { name: "مریم" }, qAnxiety: 7, qFocus: 5, qPerfectionism: 8, qSleep: 4, qStamina: 6 });
  // THE FIX: audit-module must not 404 anymore
  await expect("POST", "audit-module", 200, { moduleName: "DashboardView", type: "module", logs: [{ timestamp: "t", action: "a", detail: "d" }] });
  await expect("POST", "generate-quiz-question", 200, { subject: "زیست‌شناسی", difficulty: "سخت" });
  await expect("POST", "payment/request", 200, { amount: 10000, description: "test" });
  await expect("POST", "test-ai-connection", 200, { section: "chat" });
  await expect("POST", "sandbox", 400, { prompt: "hi" }); // no key configured -> 400 graceful
  await expect("GET", "auth/count", 503); // no D1 bound -> graceful 503
  await expect("GET", "nonexistent", 404);
  await expect("GET", "chat", 405); // wrong method
  console.log(fails === 0 ? "\nALL ROUTER TESTS PASSED" : `\n${fails} MISMATCH(ES)`);
  process.exit(fails === 0 ? 0 : 1);
}
main().catch((e) => { console.error("HARNESS ERROR", e); process.exit(1); });
