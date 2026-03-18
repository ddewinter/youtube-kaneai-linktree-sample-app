import React, { useState } from "react";

export default function ProfileEditor({ profile, onSave }) {
  const [name, setName] = useState(profile.name);
  const [tagline, setTagline] = useState(profile.tagline);
  const [status, setStatus] = useState("");

  const handleSave = async () => {
    const result = await onSave({ name, tagline });
    if (result.success) {
      setStatus("Saved!");
      setTimeout(() => setStatus(""), 2000);
    } else {
      setStatus(result.error);
    }
  };

  return (
    <div className="profile-editor">
      <div className="form-group">
        <label htmlFor="profile-name">Name</label>
        <input
          id="profile-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          maxLength={50}
        />
      </div>
      <div className="form-group">
        <label htmlFor="profile-tagline">Tagline</label>
        <input
          id="profile-tagline"
          type="text"
          value={tagline}
          onChange={(e) => setTagline(e.target.value)}
          placeholder="A short description"
          maxLength={200}
        />
      </div>
      <div className="form-actions">
        <button className="btn btn-primary" onClick={handleSave}>
          Save Profile
        </button>
        {status && <span className="status-msg">{status}</span>}
      </div>
    </div>
  );
}
