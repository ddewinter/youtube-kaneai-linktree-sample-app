import React, { useState, useEffect } from "react";

export default function PublicPage() {
  const [links, setLinks] = useState([]);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    Promise.all([
      fetch("/api/links").then((r) => r.json()),
      fetch("/api/profile").then((r) => r.json()),
    ]).then(([linksRes, profileRes]) => {
      if (linksRes.success) setLinks(linksRes.data);
      if (profileRes.success) setProfile(profileRes.data);
    });
  }, []);

  if (!profile) return <div className="loading">Loading...</div>;

  const initials = profile.name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className={`public-page theme-${profile.theme}`}>
      <div className="public-container">
        <div className="public-profile">
          <div className="avatar">{initials}</div>
          <h1 className="public-name">{profile.name}</h1>
          <p className="public-tagline">{profile.tagline}</p>
        </div>

        <div className="public-links">
          {links.map((link) => (
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="public-link-card"
            >
              {link.title}
            </a>
          ))}
        </div>

        <footer className="public-footer">Built with LinkBio</footer>
      </div>
    </div>
  );
}
