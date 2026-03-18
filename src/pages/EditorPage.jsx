import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ProfileEditor from "../components/ProfileEditor.jsx";
import ThemePicker from "../components/ThemePicker.jsx";
import LinkForm from "../components/LinkForm.jsx";
import LinkItem from "../components/LinkItem.jsx";

export default function EditorPage() {
  const [links, setLinks] = useState([]);
  const [profile, setProfile] = useState(null);

  const fetchLinks = async () => {
    const res = await fetch("/api/links");
    const json = await res.json();
    if (json.success) setLinks(json.data);
  };

  const fetchProfile = async () => {
    const res = await fetch("/api/profile");
    const json = await res.json();
    if (json.success) setProfile(json.data);
  };

  useEffect(() => {
    fetchLinks();
    fetchProfile();
  }, []);

  const addLink = async (title, url) => {
    const res = await fetch("/api/links", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, url }),
    });
    const json = await res.json();
    if (json.success) fetchLinks();
    return json;
  };

  const updateLink = async (id, title, url) => {
    const res = await fetch(`/api/links/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, url }),
    });
    const json = await res.json();
    if (json.success) fetchLinks();
    return json;
  };

  const deleteLink = async (id) => {
    await fetch(`/api/links/${id}`, { method: "DELETE" });
    fetchLinks();
  };

  const moveLink = async (index, direction) => {
    const ids = links.map((l) => l.id);
    const target = index + direction;
    if (target < 0 || target >= ids.length) return;
    [ids[index], ids[target]] = [ids[target], ids[index]];
    const res = await fetch("/api/links/reorder", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids }),
    });
    const json = await res.json();
    if (json.success) setLinks(json.data);
  };

  const updateProfile = async (data) => {
    const res = await fetch("/api/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (json.success) setProfile(json.data);
    return json;
  };

  if (!profile) return <div className="loading">Loading...</div>;

  return (
    <div className="editor-page">
      <header className="editor-header">
        <h1>LinkBio Editor</h1>
      </header>

      <main className="editor-main">
        <section className="editor-section">
          <h2>Profile</h2>
          <ProfileEditor profile={profile} onSave={updateProfile} />
        </section>

        <section className="editor-section">
          <h2>Theme</h2>
          <ThemePicker
            current={profile.theme}
            onChange={(theme) => updateProfile({ theme })}
          />
        </section>

        <section className="editor-section">
          <h2>Add Link</h2>
          <LinkForm onAdd={addLink} />
        </section>

        <section className="editor-section">
          <h2>Links</h2>
          <div className="link-list">
            {links.map((link, index) => (
              <LinkItem
                key={link.id}
                link={link}
                index={index}
                total={links.length}
                onUpdate={updateLink}
                onDelete={deleteLink}
                onMove={moveLink}
              />
            ))}
            {links.length === 0 && (
              <p className="empty-state">No links yet. Add one above.</p>
            )}
          </div>
        </section>
      </main>

      <footer className="editor-footer">
        <Link to="/p" className="btn btn-primary">
          View My Page
        </Link>
        <span className="link-count">
          {links.length} {links.length === 1 ? "link" : "links"}
        </span>
      </footer>
    </div>
  );
}
