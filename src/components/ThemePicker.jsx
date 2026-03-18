import React from "react";

const THEMES = [
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
  { value: "colorful", label: "Colorful" },
];

export default function ThemePicker({ current, onChange }) {
  return (
    <div className="theme-picker">
      {THEMES.map((t) => (
        <button
          key={t.value}
          className={`theme-option ${current === t.value ? "active" : ""}`}
          onClick={() => onChange(t.value)}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}
