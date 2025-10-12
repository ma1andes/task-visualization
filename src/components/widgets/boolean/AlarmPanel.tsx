import React from "react";
import WidgetContainer from "../common/BaseWidget";
import type { BaseWidgetProps } from "../common/BaseWidget";
import "./AlarmPanel.css";

const AlarmPanel: React.FC<BaseWidgetProps> = ({ tag, className, style }) => {
  const value = tag.value as boolean;

  return (
    <WidgetContainer
      tag={tag}
      className={`alarm-panel-widget ${className}`}
      style={style}
    >
      <div className="alarm-container">
        <div
          className={`alarm-panel ${value ? "alarm-active" : "alarm-inactive"}`}
        >
          <div className="alarm-icon">
            <div className="warning-triangle">
              <span className="exclamation">!</span>
            </div>
          </div>
          <div className="alarm-stripes"></div>
        </div>
        <div className="alarm-info">
          <div
            className={`alarm-status ${
              value ? "status-alarm" : "status-normal"
            }`}
          >
            {value ? "ТРЕВОГА" : "НОРМА"}
          </div>
          <div className="alarm-level">
            <span className="level-label">Уровень:</span>
            <span
              className={`level-value ${
                value ? "level-critical" : "level-safe"
              }`}
            >
              {value ? "КРИТИЧЕСКИЙ" : "БЕЗОПАСНО"}
            </span>
          </div>
        </div>
      </div>
    </WidgetContainer>
  );
};

export default AlarmPanel;
