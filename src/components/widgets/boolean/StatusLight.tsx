import React from "react";
import WidgetContainer from "../common/BaseWidget";
import type { BaseWidgetProps } from "../common/BaseWidget";
import "./StatusLight.css";

const StatusLight: React.FC<BaseWidgetProps> = ({ tag, className, style }) => {
  const value = tag.value as boolean;

  return (
    <WidgetContainer
      tag={tag}
      className={`status-light-widget ${className}`}
      style={style}
    >
      <div className="status-light-container">
        <div className="traffic-light">
          <div
            className={`light red-light ${!value ? "light-active" : ""}`}
          ></div>
          <div
            className={`light yellow-light ${false ? "light-active" : ""}`}
          ></div>
          <div
            className={`light green-light ${value ? "light-active" : ""}`}
          ></div>
        </div>
        <div className="status-info">
          <div
            className={`status-badge ${
              value ? "badge-success" : "badge-danger"
            }`}
          >
            <span className="badge-icon">{value ? "✓" : "✗"}</span>
            <span className="badge-text">{value ? "НОРМА" : "ОШИБКА"}</span>
          </div>
          <div className="status-description">
            {value ? "Система работает нормально" : "Обнаружена неисправность"}
          </div>
        </div>
      </div>
    </WidgetContainer>
  );
};

export default StatusLight;
