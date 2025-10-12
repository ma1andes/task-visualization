import React from "react";
import type { Tag } from "../../types";
import "./TagVisualization.css";

interface TagVisualizationProps {
  tag: Tag;
}

const TagVisualization: React.FC<TagVisualizationProps> = ({ tag }) => {
  const renderBooleanIndicator = (value: boolean) => (
    <div className="boolean-indicator">
      <div className={`indicator ${value ? "active" : "inactive"}`}>
        <div className="indicator-dot"></div>
        <span className="indicator-text">{value ? "ON" : "OFF"}</span>
      </div>
    </div>
  );

  const renderNumberProgressBar = (value: number, unit?: string) => {
    const normalizedValue = Math.min(Math.max((value / 100) * 100, 0), 100);

    return (
      <div className="progress-container">
        <div className="progress-header">
          <span className="progress-value">
            {value.toFixed(2)} {unit && <span className="unit">{unit}</span>}
          </span>
          <span className="progress-percentage">
            {normalizedValue.toFixed(1)}%
          </span>
        </div>
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${normalizedValue}%` }}
          ></div>
        </div>
      </div>
    );
  };

  const renderStringValue = (value: string) => (
    <div className="string-value">
      <span className="string-content">{value}</span>
    </div>
  );

  return (
    <div className="tag-visualization">
      <div className="tag-header">
        <h3 className="tag-name">{tag.name}</h3>
        {tag.description && (
          <p className="tag-description">{tag.description}</p>
        )}
      </div>

      <div className="tag-content">
        {tag.type === "boolean" && renderBooleanIndicator(tag.value as boolean)}
        {tag.type === "number" &&
          renderNumberProgressBar(tag.value as number, tag.unit)}
        {tag.type === "string" && renderStringValue(tag.value as string)}
      </div>
    </div>
  );
};

export default TagVisualization;
