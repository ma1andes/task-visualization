import React from "react";
import WidgetContainer from "../common/BaseWidget";
import type { BaseWidgetProps } from "../common/BaseWidget";
import "./LEDIndicator.css";

const LEDIndicator: React.FC<BaseWidgetProps> = ({ tag, className, style }) => {
  const value = tag.value as boolean;

  return (
    <WidgetContainer
      tag={tag}
      className={`led-indicator-widget ${className}`}
      style={style}
    >
      <div className="led-container">
        <div className={`led ${value ? "led-active" : "led-inactive"}`}>
          <div className="led-core"></div>
          <div className="led-glow"></div>
        </div>
        <div className="led-status">
          <span
            className={`status-text ${
              value ? "status-active" : "status-inactive"
            }`}
          >
            {value ? "ВКЛЮЧЕНО" : "ВЫКЛЮЧЕНО"}
          </span>
        </div>
      </div>
    </WidgetContainer>
  );
};

export default LEDIndicator;
