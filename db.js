import Database from "better-sqlite3";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const db = new Database(join(__dirname, "linkbio.db"));

db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

db.exec(`
  CREATE TABLE IF NOT EXISTS profile (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    tagline TEXT NOT NULL DEFAULT '',
    theme TEXT NOT NULL DEFAULT 'light'
  );

  CREATE TABLE IF NOT EXISTS links (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    url TEXT NOT NULL,
    position INTEGER NOT NULL DEFAULT 0
  );
`);

// Seed data if tables are empty
const profileCount = db.prepare("SELECT COUNT(*) as count FROM profile").get();
if (profileCount.count === 0) {
  db.prepare(
    "INSERT INTO profile (id, name, tagline, theme) VALUES (1, ?, ?, ?)"
  ).run("Kevin Stratvert", "Tech tutorials for everyone", "light");
}

const linkCount = db.prepare("SELECT COUNT(*) as count FROM links").get();
if (linkCount.count === 0) {
  const insert = db.prepare(
    "INSERT INTO links (title, url, position) VALUES (?, ?, ?)"
  );
  insert.run("YouTube Channel", "https://www.youtube.com/@kevinstratvert", 1);
  insert.run("My Website", "https://kevinstratvert.com", 2);
  insert.run("Twitter/X", "https://x.com/kevinstratvert", 3);
}

export default db;
