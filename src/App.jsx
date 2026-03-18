import React from "react";
import { Routes, Route } from "react-router-dom";
import EditorPage from "./pages/EditorPage.jsx";
import PublicPage from "./pages/PublicPage.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<EditorPage />} />
      <Route path="/p" element={<PublicPage />} />
    </Routes>
  );
}
