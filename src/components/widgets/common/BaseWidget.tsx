import React from "react";
import type { Tag, HistoryApiResponse } from "../../../types";
import type { WidgetParams } from "../../../types/customization";
import "./BaseWidget.css";

export interface BaseWidgetProps {
  tag: Tag;
  params?: WidgetParams; // Параметры виджета из кастомизации
  historyData?: HistoryApiResponse; // История для графиков
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
  // Защита от undefined tag
  if (!tag) {
    return (
      <div className={`widget-container ${className}`} style={style}>
        <div className="widget-header">
          <h3 className="widget-title" style={{ color: '#ef4444' }}>Ошибка: тег не найден</h3>
        </div>
      </div>
    );
  }

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
