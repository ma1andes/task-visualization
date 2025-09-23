import React from "react";
import type { Tag } from "../../../types";
import { WidgetType } from "../../../types/widgets";
import { getTagWidgetInfo } from "../../../utils/widgetUtils";

// Импорт всех виджетов
import {
  LEDIndicator,
  SwitchToggle,
  StatusLight,
  AlarmPanel,
  Thermometer,
  Gauge,
  Speedometer,
  LiquidFill,
  BarChart,
  AreaChart,
  DigitalDisplay,
  Counter,
  Histogram,
  RadarChart,
} from "../index";
import type { BaseWidgetProps } from "./BaseWidget";

// Маппинг типов виджетов к компонентам
const WIDGET_COMPONENTS: Record<
  WidgetType,
  React.ComponentType<BaseWidgetProps>
> = {
  // Boolean виджеты
  [WidgetType.LED_INDICATOR]: LEDIndicator,
  [WidgetType.SWITCH_TOGGLE]: SwitchToggle,
  [WidgetType.STATUS_LIGHT]: StatusLight,
  [WidgetType.ALARM_PANEL]: AlarmPanel,

  // Number виджеты
  [WidgetType.THERMOMETER]: Thermometer,
  [WidgetType.GAUGE]: Gauge,
  [WidgetType.SPEEDOMETER]: Speedometer,
  [WidgetType.LIQUID_FILL]: LiquidFill,
  [WidgetType.BAR_CHART]: BarChart,
  [WidgetType.AREA_CHART]: AreaChart,

  // DINT виджеты
  [WidgetType.DIGITAL_DISPLAY]: DigitalDisplay,
  [WidgetType.COUNTER]: Counter,
  [WidgetType.HISTOGRAM]: Histogram,
  [WidgetType.RADAR_CHART]: RadarChart,
};

interface WidgetFactoryProps {
  tag: Tag;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Фабрика виджетов - динамически создает подходящий виджет для тега
 */
const WidgetFactory: React.FC<WidgetFactoryProps> = ({
  tag,
  className,
  style,
}) => {
  const widgetInfo = getTagWidgetInfo(tag);

  if (!widgetInfo) {
    return (
      <div className={`widget-error ${className}`} style={style}>
        <div
          style={{
            padding: "20px",
            textAlign: "center",
            color: "#ef4444",
            backgroundColor: "rgba(239, 68, 68, 0.1)",
            border: "1px solid rgba(239, 68, 68, 0.3)",
            borderRadius: "8px",
          }}
        >
          <h4>Виджет не найден</h4>
          <p>Для тега "{tag.name}" не назначен виджет</p>
          <small>Тип данных: {tag.type}</small>
        </div>
      </div>
    );
  }

  if (!widgetInfo.isCompatible) {
    return (
      <div className={`widget-error ${className}`} style={style}>
        <div
          style={{
            padding: "20px",
            textAlign: "center",
            color: "#f59e0b",
            backgroundColor: "rgba(245, 158, 11, 0.1)",
            border: "1px solid rgba(245, 158, 11, 0.3)",
            borderRadius: "8px",
          }}
        >
          <h4>Несовместимый виджет</h4>
          <p>
            Виджет "{widgetInfo.config.name}" не совместим с типом данных "
            {tag.type}"
          </p>
          <small>
            Ожидаемые типы: {widgetInfo.config.dataTypes.join(", ")}
          </small>
        </div>
      </div>
    );
  }

  const WidgetComponent = WIDGET_COMPONENTS[widgetInfo.widgetType];

  if (!WidgetComponent) {
    return (
      <div className={`widget-error ${className}`} style={style}>
        <div
          style={{
            padding: "20px",
            textAlign: "center",
            color: "#ef4444",
            backgroundColor: "rgba(239, 68, 68, 0.1)",
            border: "1px solid rgba(239, 68, 68, 0.3)",
            borderRadius: "8px",
          }}
        >
          <h4>Компонент виджета не найден</h4>
          <p>Компонент для типа "{widgetInfo.widgetType}" не реализован</p>
        </div>
      </div>
    );
  }

  return <WidgetComponent tag={tag} className={className} style={style} />;
};

export default WidgetFactory;
