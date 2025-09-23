import React, { useState, useEffect } from "react";
import WidgetContainer from "../common/BaseWidget";
import type { BaseWidgetProps } from "../common/BaseWidget";
import "./Counter.css";

const Counter: React.FC<BaseWidgetProps> = ({ tag, className, style }) => {
  const targetValue = tag.value as number;
  const [displayValue, setDisplayValue] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    setIsAnimating(true);
    const startValue = displayValue;
    const difference = targetValue - startValue;
    const duration = 2000; // 2 секунды
    const steps = 60; // 60 FPS
    // const stepValue = difference / steps;

    let currentStep = 0;
    const timer = setInterval(() => {
      currentStep++;
      if (currentStep >= steps) {
        setDisplayValue(targetValue);
        setIsAnimating(false);
        clearInterval(timer);
      } else {
        const easeOutQuart = 1 - Math.pow(1 - currentStep / steps, 4);
        setDisplayValue(Math.round(startValue + difference * easeOutQuart));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [targetValue]);

  const formatNumber = (num: number) => {
    return num.toLocaleString("ru-RU");
  };

  const getDigitSeparation = (num: number) => {
    const str = num.toString();
    return str.split("").map((digit, index) => ({
      digit,
      key: `${index}-${digit}`,
    }));
  };

  return (
    <WidgetContainer
      tag={tag}
      className={`counter-widget ${className}`}
      style={style}
    >
      <div className="counter-container">
        <div className="counter-display">
          <div className="counter-background">
            <div className="counter-segments">
              {getDigitSeparation(displayValue).map((item) => (
                <div key={item.key} className="digit-segment">
                  <div className={`digit ${isAnimating ? "digit-flip" : ""}`}>
                    {item.digit}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="counter-glow"></div>
        </div>

        <div className="counter-info">
          <div className="counter-label">
            <span className="label-text">СЧЕТЧИК</span>
            <span className="label-unit">{tag.unit || "ед."}</span>
          </div>
          <div className="counter-stats">
            <div className="stat-item">
              <span className="stat-label">Цель:</span>
              <span className="stat-value">{formatNumber(targetValue)}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Статус:</span>
              <span
                className={`stat-status ${
                  isAnimating ? "status-counting" : "status-ready"
                }`}
              >
                {isAnimating ? "ПОДСЧЕТ" : "ГОТОВ"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </WidgetContainer>
  );
};

export default Counter;
