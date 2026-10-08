const JSON_HEADERS = {
  "content-type": "application/json; charset=utf-8",
  "cache-control": "no-store",
  "x-content-type-options": "nosniff"
};

const PUBLIC_LIMITS = {
  guestbook: { max: 4, windowMinutes: 30 },
  submissions: { max: 3, windowMinutes: 60 }
};

function json(data, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: JSON_HEADERS });
}

function cleanText(value, maxLength) {
  return String(value ?? "").replace(/\r\n/g, "\n").trim().slice(0, maxLength);
}

function normalizeUrl(value) {
  const raw = cleanText(value, 500);
  if (!raw) return "";
  try {
    const url = new URL(raw);
    return ["http:", "https:"].includes(url.protocol) ? url.toString() : "";
  } catch {
    return "";
  }
}

function isAuthorized(request, env) {
  const expected = env.ADMIN_TOKEN;
  const provided = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ?? "";
  if (!expected || expected.length !== provided.length) return false;
  let difference = 0;
  for (let index = 0; index < expected.length; index += 1) {
    difference |= expected.charCodeAt(index) ^ provided.charCodeAt(index);
  }
  return difference === 0;
}

async function parseBody(request) {
  const type = request.headers.get("content-type") ?? "";
  if (!type.includes("application/json")) throw new Error("请使用 JSON 提交。 ");
  return request.json();
}

async function clientHash(request) {
  const ip = request.headers.get("cf-connecting-ip") ?? "local";
  const bytes = new TextEncoder().encode(ip);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

async function enforceRateLimit(request, env, scope) {
  const rule = PUBLIC_LIMITS[scope];
  const hash = await clientHash(request);
  const since = new Date(Date.now() - rule.windowMinutes * 60_000).toISOString();
  const cleanupBefore = new Date(Date.now() - 24 * 60 * 60_000).toISOString();
  await env.DB.prepare("DELETE FROM request_log WHERE created_at < ?").bind(cleanupBefore).run();
  const row = await env.DB.prepare(
    "SELECT COUNT(*) AS total FROM request_log WHERE scope = ? AND client_hash = ? AND created_at >= ?"
  ).bind(scope, hash, since).first();

  if (Number(row?.total ?? 0) >= rule.max) {
    return json({ ok: false, error: `提交太频繁，请在 ${rule.windowMinutes} 分钟后再试。` }, 429);
  }

  await env.DB.prepare(
    "INSERT INTO request_log (scope, client_hash, created_at) VALUES (?, ?, ?)"
  ).bind(scope, hash, new Date().toISOString()).run();
  return null;
}

function validateHumanSubmission(body) {
  if (cleanText(body.company, 100)) return false;
  const startedAt = Number(body.startedAt ?? 0);
  const age = Date.now() - startedAt;
  return Number.isFinite(startedAt) && age >= 2500 && age <= 2 * 60 * 60_000;
}

async function listGuestbook(env) {
  const result = await env.DB.prepare(
    `SELECT id, name, content, website, created_at AS createdAt
     FROM guestbook_messages
     WHERE status = 'approved'
     ORDER BY COALESCE(reviewed_at, created_at) DESC
     LIMIT 100`
  ).all();
  return json({ ok: true, messages: result.results ?? [] });
}

async function createGuestbook(request, env) {
  const body = await parseBody(request);
  if (!validateHumanSubmission(body)) return json({ ok: false, error: "提交校验失败，请刷新页面后重试。" }, 400);
  const limited = await enforceRateLimit(request, env, "guestbook");
  if (limited) return limited;

  const name = cleanText(body.name, 40);
  const content = cleanText(body.content, 800);
  const website = normalizeUrl(body.website);
  if (name.length < 1 || content.length < 2) return json({ ok: false, error: "请填写称呼和留言内容。" }, 400);

  const id = crypto.randomUUID();
  await env.DB.prepare(
    `INSERT INTO guestbook_messages (id, name, content, website, status, created_at)
     VALUES (?, ?, ?, ?, 'pending', ?)`
  ).bind(id, name, content, website || null, new Date().toISOString()).run();
  return json({ ok: true, id, message: "留言已提交，审核通过后会显示在这里。" }, 201);
}

async function createSubmission(request, env) {
  const body = await parseBody(request);
  if (!validateHumanSubmission(body)) return json({ ok: false, error: "提交校验失败，请刷新页面后重试。" }, 400);
  const limited = await enforceRateLimit(request, env, "submissions");
  if (limited) return limited;

  const allowedSections = new Set(["research", "blog", "essays", "resources", "bookmarks", "downloads"]);
  const section = cleanText(body.section, 30);
  const author = cleanText(body.author, 60);
  const contact = cleanText(body.contact, 120);
  const title = cleanText(body.title, 120);
  const description = cleanText(body.description, 300);
  const language = body.language === "en" ? "en" : "zh";
  const tags = cleanText(body.tags, 200);
  const url = normalizeUrl(body.url);
  const attachments = cleanText(body.attachments, 2000);
  const content = cleanText(body.body, 30_000);

  if (!allowedSections.has(section) || !author || !title || description.length < 4 || content.length < 10) {
    return json({ ok: false, error: "请完整填写作者、标题、摘要和正文。" }, 400);
  }

  const id = crypto.randomUUID();
  await env.DB.prepare(
    `INSERT INTO submissions
      (id, section, author, contact, title, description, language, tags, source_url, attachments, content, status, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', ?)`
  ).bind(
    id, section, author, contact || null, title, description, language, tags || null,
    url || null, attachments || null, content, new Date().toISOString()
  ).run();
  return json({ ok: true, id, message: "投稿已进入审核队列，审核结果不会自动公开联系方式。" }, 201);
}

async function listQueue(request, env) {
  if (!isAuthorized(request, env)) return json({ ok: false, error: "管理员验证失败。" }, 401);
  const url = new URL(request.url);
  const type = url.searchParams.get("type") === "guestbook" ? "guestbook" : "submissions";
  const status = ["pending", "approved", "rejected"].includes(url.searchParams.get("status"))
    ? url.searchParams.get("status")
    : "pending";

  const query = type === "guestbook"
    ? `SELECT id, name, content, website, status, created_at AS createdAt, reviewed_at AS reviewedAt
       FROM guestbook_messages WHERE status = ? ORDER BY created_at DESC LIMIT 200`
    : `SELECT id, section, author, contact, title, description, language, tags,
              source_url AS sourceUrl, attachments, content, status,
              created_at AS createdAt, reviewed_at AS reviewedAt
       FROM submissions WHERE status = ? ORDER BY created_at DESC LIMIT 200`;
  const result = await env.DB.prepare(query).bind(status).all();
  return json({ ok: true, type, status, items: result.results ?? [] });
}

async function reviewItem(request, env, type, id) {
  if (!isAuthorized(request, env)) return json({ ok: false, error: "管理员验证失败。" }, 401);
  const body = await parseBody(request);
  if (!["approved", "rejected", "pending"].includes(body.status)) {
    return json({ ok: false, error: "审核状态无效。" }, 400);
  }
  const table = type === "guestbook" ? "guestbook_messages" : type === "submissions" ? "submissions" : null;
  if (!table) return json({ ok: false, error: "记录类型无效。" }, 404);
  const result = await env.DB.prepare(
    `UPDATE ${table} SET status = ?, reviewed_at = ? WHERE id = ?`
  ).bind(body.status, new Date().toISOString(), id).run();
  if (!result.meta?.changes) return json({ ok: false, error: "没有找到这条记录。" }, 404);
  return json({ ok: true });
}

async function handleApi(request, env, url) {
  if (!env.DB) return json({ ok: false, error: "留言与投稿数据库尚未配置。" }, 503);
  if (url.pathname === "/api/guestbook" && request.method === "GET") return listGuestbook(env);
  if (url.pathname === "/api/guestbook" && request.method === "POST") return createGuestbook(request, env);
  if (url.pathname === "/api/submissions" && request.method === "POST") return createSubmission(request, env);
  if (url.pathname === "/api/admin/queue" && request.method === "GET") return listQueue(request, env);

  const match = url.pathname.match(/^\/api\/admin\/(guestbook|submissions)\/([a-f0-9-]+)$/i);
  if (match && request.method === "PATCH") return reviewItem(request, env, match[1], match[2]);
  return json({ ok: false, error: "接口不存在。" }, 404);
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    try {
      if (url.pathname.startsWith("/api/")) return await handleApi(request, env, url);
      return env.ASSETS.fetch(request);
    } catch (error) {
      console.error(error);
      return json({ ok: false, error: "服务暂时不可用，请稍后再试。" }, 500);
    }
  }
};
