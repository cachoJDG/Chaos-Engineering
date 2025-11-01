// app.js (ESM)
import express from "express";

const app = express();
const PORT = process.env.PORT || 3000;
const NAME = process.env.SVC_NAME || "svc-unknown";
const DOWNSTREAM_URL = process.env.DOWNSTREAM_URL || "";

app.get("/healthz", (_req, res) => res.status(200).send("ok"));

app.get("/whoami", (_req, res) => {
  res.json({ name: NAME, downstream: DOWNSTREAM_URL || null, time: new Date().toISOString() });
});

app.get("/chain", async (_req, res) => {
  const start = Date.now();
  let chain = [{ service: NAME, t: new Date().toISOString() }];

  if (DOWNSTREAM_URL) {
    try {
      const r = await fetch(`${DOWNSTREAM_URL}/chain`);
      const body = await r.json();
      chain = chain.concat(body.chain || []);
    } catch (err) {
      return res.status(502).json({
        error: "downstream_failed",
        at: NAME,
        message: String(err),
        chain
      });
    }
  }

  res.json({ chain, total_ms: Date.now() - start });
});

app.listen(PORT, () => console.log(`${NAME} listening on ${PORT} -> ${DOWNSTREAM_URL || "end"}`));
