import React from "react";
import type { Tag } from "../../../types";
import "./BaseWidget.css";

export interface BaseWidgetProps {
  tag: Tag;
  className?: string;
  style?: React.CSSProperties;
}

interface WidgetContainerProps {
  tag: Tag;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

const WidgetContainer: React.FC<WidgetContainerProps> = ({
  tag,
  children,
  className = "",
  style,
}) => {
  return (
    <div className={`widget-container ${className}`} style={style}>
      <div className="widget-header">
        <h3 className="widget-title">{tag.name}</h3>
        {tag.description && (
          <p className="widget-description">{tag.description}</p>
        )}
      </div>
      <div className="widget-content">{children}</div>
    </div>
  );
};

export default WidgetContainer;
