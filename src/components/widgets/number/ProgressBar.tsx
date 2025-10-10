import React from "react";
import WidgetContainer from "../common/BaseWidget";
import type { BaseWidgetProps } from "../common/BaseWidget";
import { normalizeColor } from "../../../utils/colorUtils";
import "./ProgressBar.css";

/**
 * Виджет прогресс-бара
 * Показывает значение в виде горизонтальной полоски заполнения
 */
const ProgressBar: React.FC<BaseWidgetProps> = ({ tag, params, className, style }) => {
  const value = typeof tag.value === "number" ? tag.value : 0;
  
  // Получаем min и max из params с дефолтными значениями
  const minValue = params?.min ?? 0;
  const maxValue = params?.max ?? 100;
  
  // Получаем цвет из params или используем дефолтный синий
  const barColor = params?.color 
    ? normalizeColor(params.color, "#3b82f6") 
    : "#3b82f6";

  // Вычисляем процент заполнения
  const range = maxValue - minValue;
  const normalizedValue = Math.max(minValue, Math.min(value, maxValue));
  const percentage = range > 0 ? ((normalizedValue - minValue) / range) * 100 : 0;

  // Создаём градиент для прогресс-бара
  const progressGradient = `linear-gradient(90deg, ${barColor}, ${barColor}dd)`;

  return (
    <WidgetContainer
      tag={tag}
      className={`progress-bar-widget ${className || ""}`}
      style={style}
    >
      <div className="progress-widget-container">
        <div className="progress-widget-header">
          <span className="progress-widget-value">
            {value.toFixed(2)}
            {tag.unit && <span className="progress-widget-unit"> {tag.unit}</span>}
          </span>
          <span className="progress-widget-percentage">
            {percentage.toFixed(1)}%
          </span>
        </div>
        <div className="progress-widget-bar">
          <div
            className="progress-widget-fill"
            style={{
              width: `${percentage}%`,
              background: progressGradient,
            }}
          >
            <div className="progress-widget-shimmer"></div>
          </div>
        </div>
        <div className="progress-widget-footer">
          <span className="progress-widget-min">{minValue}</span>
          <span className="progress-widget-max">{maxValue}</span>
        </div>
      </div>
    </WidgetContainer>
  );
};

export default ProgressBar;

