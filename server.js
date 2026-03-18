import express from "express";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import db from "./db.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(join(__dirname, "dist")));

// --- Links API ---

app.get("/api/links", (req, res) => {
  const links = db.prepare("SELECT * FROM links ORDER BY position ASC").all();
  res.json({ success: true, data: links });
});

app.post("/api/links", (req, res) => {
  const { title, url } = req.body;

  if (!title || typeof title !== "string" || title.length < 1 || title.length > 100) {
    return res.status(400).json({ success: false, error: "Title is required and must be 1-100 characters" });
  }
  if (!url || typeof url !== "string" || !/^https?:\/\//.test(url)) {
    return res.status(400).json({ success: false, error: "URL is required and must start with http:// or https://" });
  }

  const maxPos = db.prepare("SELECT MAX(position) as max FROM links").get();
  const position = (maxPos.max || 0) + 1;

  const result = db.prepare("INSERT INTO links (title, url, position) VALUES (?, ?, ?)").run(title, url, position);
  const link = db.prepare("SELECT * FROM links WHERE id = ?").get(result.lastInsertRowid);
  res.status(201).json({ success: true, data: link });
});

app.get("/api/links/:id", (req, res) => {
  const link = db.prepare("SELECT * FROM links WHERE id = ?").get(req.params.id);
  if (!link) {
    return res.status(404).json({ success: false, error: "Link not found" });
  }
  res.json({ success: true, data: link });
});

app.put("/api/links/reorder", (req, res) => {
  const { ids } = req.body;
  if (!Array.isArray(ids)) {
    return res.status(400).json({ success: false, error: "ids must be an array of link IDs" });
  }

  const update = db.prepare("UPDATE links SET position = ? WHERE id = ?");
  const reorder = db.transaction((ids) => {
    ids.forEach((id, index) => {
      update.run(index + 1, id);
    });
  });
  reorder(ids);

  const links = db.prepare("SELECT * FROM links ORDER BY position ASC").all();
  res.json({ success: true, data: links });
});

app.put("/api/links/:id", (req, res) => {
  const link = db.prepare("SELECT * FROM links WHERE id = ?").get(req.params.id);
  if (!link) {
    return res.status(404).json({ success: false, error: "Link not found" });
  }

  const title = req.body.title !== undefined ? req.body.title : link.title;
  const url = req.body.url !== undefined ? req.body.url : link.url;

  if (typeof title !== "string" || title.length < 1 || title.length > 100) {
    return res.status(400).json({ success: false, error: "Title must be 1-100 characters" });
  }
  if (typeof url !== "string" || !/^https?:\/\//.test(url)) {
    return res.status(400).json({ success: false, error: "URL must start with http:// or https://" });
  }

  db.prepare("UPDATE links SET title = ?, url = ? WHERE id = ?").run(title, url, req.params.id);
  const updated = db.prepare("SELECT * FROM links WHERE id = ?").get(req.params.id);
  res.json({ success: true, data: updated });
});

app.delete("/api/links/:id", (req, res) => {
  const link = db.prepare("SELECT * FROM links WHERE id = ?").get(req.params.id);
  if (!link) {
    return res.status(404).json({ success: false, error: "Link not found" });
  }
  db.prepare("DELETE FROM links WHERE id = ?").run(req.params.id);
  res.json({ success: true, data: { deleted: true } });
});

// --- Profile API ---

app.get("/api/profile", (req, res) => {
  const profile = db.prepare("SELECT * FROM profile WHERE id = 1").get();
  res.json({ success: true, data: profile });
});

app.put("/api/profile", (req, res) => {
  const profile = db.prepare("SELECT * FROM profile WHERE id = 1").get();

  const name = req.body.name !== undefined ? req.body.name : profile.name;
  const tagline = req.body.tagline !== undefined ? req.body.tagline : profile.tagline;
  const theme = req.body.theme !== undefined ? req.body.theme : profile.theme;

  if (typeof name !== "string" || name.length < 1 || name.length > 50) {
    return res.status(400).json({ success: false, error: "Name is required and must be 1-50 characters" });
  }
  if (typeof tagline !== "string" || tagline.length > 200) {
    return res.status(400).json({ success: false, error: "Tagline must be 0-200 characters" });
  }
  if (!["light", "dark", "colorful"].includes(theme)) {
    return res.status(400).json({ success: false, error: "Theme must be one of: light, dark, colorful" });
  }

  db.prepare("UPDATE profile SET name = ?, tagline = ?, theme = ? WHERE id = 1").run(name, tagline, theme);
  const updated = db.prepare("SELECT * FROM profile WHERE id = 1").get();
  res.json({ success: true, data: updated });
});

// --- SPA fallback ---

app.get("*", (req, res) => {
  res.sendFile(join(__dirname, "dist", "index.html"));
});

app.listen(PORT, () => {
  console.log(`LinkBio running at http://localhost:${PORT}`);
});
