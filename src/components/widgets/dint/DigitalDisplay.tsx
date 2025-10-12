import React from "react";
import WidgetContainer from "../common/BaseWidget";
import type { BaseWidgetProps } from "../common/BaseWidget";
import "./DigitalDisplay.css";

const DigitalDisplay: React.FC<BaseWidgetProps> = ({
  tag,
  className,
  style,
}) => {
  const value = tag.value as number;
  const formattedValue = value.toLocaleString("ru-RU");

  return (
    <WidgetContainer
      tag={tag}
      className={`digital-display-widget ${className}`}
      style={style}
    >
      <div className="digital-display-container">
        <div className="display-screen">
          <div className="display-grid">
            {/* Сетка для имитации LCD экрана */}
            {Array.from({ length: 100 }, (_, i) => (
              <div key={i} className="grid-dot"></div>
            ))}
          </div>
          <div className="display-content">
            <div className="display-value">{formattedValue}</div>
            <div className="display-unit">{tag.unit || "ед."}</div>
          </div>
          <div className="display-reflection"></div>
        </div>
        <div className="display-info">
          <div className="info-row">
            <span className="info-label">Тип:</span>
            <span className="info-value">DINT</span>
          </div>
          <div className="info-row">
            <span className="info-label">Разряд:</span>
            <span className="info-value">{value.toString().length}</span>
          </div>
        </div>
      </div>
    </WidgetContainer>
  );
};

export default DigitalDisplay;
