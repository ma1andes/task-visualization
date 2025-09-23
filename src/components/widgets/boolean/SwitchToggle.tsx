import React from "react";
import WidgetContainer from "../common/BaseWidget";
import type { BaseWidgetProps } from "../common/BaseWidget";
import "./SwitchToggle.css";

const SwitchToggle: React.FC<BaseWidgetProps> = ({ tag, className, style }) => {
  const value = tag.value as boolean;

  return (
    <WidgetContainer
      tag={tag}
      className={`switch-toggle-widget ${className}`}
      style={style}
    >
      <div className="switch-container">
        <div className={`switch ${value ? "switch-on" : "switch-off"}`}>
          <div className="switch-track">
            <div className="switch-thumb"></div>
          </div>
        </div>
        <div className="switch-labels">
          <span className={`label-off ${!value ? "label-active" : ""}`}>
            ВЫКЛ
          </span>
          <span className={`label-on ${value ? "label-active" : ""}`}>ВКЛ</span>
        </div>
        <div className="switch-status">
          <div
            className={`status-indicator ${value ? "status-on" : "status-off"}`}
          >
            {value ? "●" : "○"}
          </div>
          <span className="status-value">
            {value ? "АКТИВНО" : "НЕАКТИВНО"}
          </span>
        </div>
      </div>
    </WidgetContainer>
  );
};

export default SwitchToggle;
