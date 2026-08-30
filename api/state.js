// Serverless API-Route für die geteilten Mau-Mau-Manager-Daten.
// GET  -> aktuellen Stand aus data.json (im GitHub-Repo) zurückgeben
// POST -> übergebenen Stand nach data.json schreiben (mit Konflikt-Erkennung)
//
// Das GitHub-Token liegt ausschließlich serverseitig als Vercel-Umgebungs-
// variable (GITHUB_TOKEN) und wird nie an den Client ausgeliefert.

const OWNER = "huk-bem";
const REPO = "MauMauManager";
const BRANCH = "main";
const PATH = "data.json";
const TOKEN = process.env.GITHUB_TOKEN;

function ghHeaders(extra) {
  const h = Object.assign({ "Accept": "application/vnd.github+json" }, extra || {});
  if (TOKEN) h["Authorization"] = "Bearer " + TOKEN;
  return h;
}

function contentsUrl() {
  return "https://api.github.com/repos/" + OWNER + "/" + REPO + "/contents/" + PATH;
}

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.status(204).end();
    return;
  }

  if (req.method === "GET") {
    try {
      const r = await fetch(contentsUrl() + "?ref=" + BRANCH, { headers: ghHeaders() });
      if (r.status === 404) {
        res.status(200).json({ players: [], matchdays: [], rules: null });
        return;
      }
      if (!r.ok) {
        res.status(502).json({ error: "github_get_failed", status: r.status });
        return;
      }
      const j = await r.json();
      const decoded = Buffer.from(j.content, "base64").toString("utf-8");
      res.status(200).json(JSON.parse(decoded));
    } catch (e) {
      res.status(500).json({ error: "server_error", message: String(e && e.message || e) });
    }
    return;
  }

  if (req.method === "POST") {
    if (!TOKEN) {
      res.status(500).json({ error: "no_token_configured" });
      return;
    }
    try {
      let body = req.body;
      if (typeof body === "string") body = JSON.parse(body || "{}");
      if (!body || typeof body !== "object") {
        res.status(400).json({ error: "invalid_body" });
        return;
      }

      // Aktuellen sha holen, damit die Datei korrekt aktualisiert (nicht überschrieben) wird.
      let sha;
      const shaRes = await fetch(contentsUrl() + "?ref=" + BRANCH, { headers: ghHeaders() });
      if (shaRes.status === 200) {
        sha = (await shaRes.json()).sha;
      } else if (shaRes.status !== 404) {
        res.status(502).json({ error: "github_get_failed", status: shaRes.status });
        return;
      }

      const payload = {
        players: Array.isArray(body.players) ? body.players : [],
        matchdays: Array.isArray(body.matchdays) ? body.matchdays : [],
        rules: body.rules || null
      };
      const content = Buffer.from(JSON.stringify(payload, null, 2), "utf-8").toString("base64");
      const putBody = {
        message: "Mau-Mau-Daten aktualisiert – " + new Date().toISOString(),
        content,
        branch: BRANCH
      };
      if (sha) putBody.sha = sha;

      const putRes = await fetch(contentsUrl(), {
        method: "PUT",
        headers: ghHeaders({ "Content-Type": "application/json" }),
        body: JSON.stringify(putBody)
      });
      if (putRes.status === 409) {
        res.status(409).json({ error: "conflict" });
        return;
      }
      if (!putRes.ok) {
        const detail = await putRes.text();
        res.status(502).json({ error: "github_put_failed", status: putRes.status, detail: detail.slice(0, 500) });
        return;
      }
      res.status(200).json({ ok: true });
    } catch (e) {
      res.status(500).json({ error: "server_error", message: String(e && e.message || e) });
    }
    return;
  }

  res.status(405).json({ error: "method_not_allowed" });
};
