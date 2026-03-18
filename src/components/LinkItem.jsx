import React, { useState } from "react";

export default function LinkItem({ link, index, total, onUpdate, onDelete, onMove }) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(link.title);
  const [url, setUrl] = useState(link.url);

  const handleSave = async () => {
    const result = await onUpdate(link.id, title, url);
    if (result.success) setEditing(false);
  };

  const handleCancel = () => {
    setTitle(link.title);
    setUrl(link.url);
    setEditing(false);
  };

  const truncatedUrl = link.url.length > 40 ? link.url.slice(0, 40) + "..." : link.url;

  if (editing) {
    return (
      <div className="link-item editing">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="form-input"
        />
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="form-input"
        />
        <div className="link-item-actions">
          <button className="btn btn-primary" onClick={handleSave}>Save</button>
          <button className="btn btn-secondary" onClick={handleCancel}>Cancel</button>
        </div>
      </div>
    );
  }

  return (
    <div className="link-item">
      <div className="link-item-info">
        <span className="link-item-title">{link.title}</span>
        <span className="link-item-url">{truncatedUrl}</span>
      </div>
      <div className="link-item-actions">
        <button className="btn btn-secondary" onClick={() => setEditing(true)}>Edit</button>
        <button className="btn btn-danger" onClick={() => onDelete(link.id)}>Delete</button>
        <button
          className="btn btn-secondary"
          onClick={() => onMove(index, -1)}
          disabled={index === 0}
        >
          Move Up
        </button>
        <button
          className="btn btn-secondary"
          onClick={() => onMove(index, 1)}
          disabled={index === total - 1}
        >
          Move Down
        </button>
      </div>
    </div>
  );
}
