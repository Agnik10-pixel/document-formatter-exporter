import React from "react";
import { TEMPLATES } from "../utils/templates";

/**
 * TemplateSelector
 * ----------------
 * Displays the available templates as selectable cards.
 */
export default function TemplateSelector({ selected, onSelect }) {
  return (
    <div className="card">
      <div className="card-header">
        <h2>2. Choose a Template</h2>
      </div>
      <div className="template-grid">
        {TEMPLATES.map((t) => (
          <button
            type="button"
            key={t.id}
            className={`template-card ${selected === t.id ? "active" : ""}`}
            onClick={() => onSelect(t.id)}
          >
            <span className="template-icon">{t.icon}</span>
            <span className="template-name">{t.name}</span>
            <span className="template-desc">{t.description}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
