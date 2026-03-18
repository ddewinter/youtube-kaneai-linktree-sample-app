import React, { useState } from "react";

export default function LinkForm({ onAdd }) {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const result = await onAdd(title, url);
    if (result.success) {
      setTitle("");
      setUrl("");
    } else {
      setError(result.error);
    }
  };

  return (
    <form className="link-form" onSubmit={handleSubmit}>
      <div className="form-row">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Link title"
          className="form-input"
        />
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://..."
          className="form-input"
        />
        <button type="submit" className="btn btn-primary">
          Add Link
        </button>
      </div>
      {error && <p className="form-error">{error}</p>}
    </form>
  );
}
