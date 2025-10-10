import React from "react";
import type { Tag, HistoryApiResponse } from "../../../types";
import { WidgetType } from "../../../types/widgets";
import type { TagCustomization } from "../../../types/customization";
import {
  getTagWidgetInfoWithCustomization,
  getTagWidgetInfoByKey,
  getImageUrlFromCustomization,
} from "../../../utils/widgetUtils";

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
  ProgressBar,
  DigitalDisplay,
  Counter,
  Histogram,
  RadarChart,
} from "../index";
import type { BaseWidgetProps } from "./BaseWidget";
import ImageWidget from "./ImageWidget";

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
  [WidgetType.PROGRESS_BAR]: ProgressBar,

  // DINT виджеты
  [WidgetType.DIGITAL_DISPLAY]: DigitalDisplay,
  [WidgetType.COUNTER]: Counter,
  [WidgetType.HISTOGRAM]: Histogram,
  [WidgetType.RADAR_CHART]: RadarChart,
};

interface WidgetFactoryProps {
  tag: Tag;
  customizations?: TagCustomization[];
  widgetKey?: string; // Если указан, используется конкретный виджет
  historyData?: HistoryApiResponse; // История для графиков
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Фабрика виджетов - динамически создает подходящий виджет для тега
 * Если указан widgetKey, создаёт виджет для конкретного ключа
 * Иначе использует первый найденный виджет
 */
const WidgetFactory: React.FC<WidgetFactoryProps> = ({
  tag,
  customizations,
  widgetKey,
  historyData,
  className,
  style,
}) => {
  // Если указан конкретный ключ виджета - используем его
  const widgetInfo = widgetKey && customizations
    ? getTagWidgetInfoByKey(tag, widgetKey, customizations)
    : getTagWidgetInfoWithCustomization(tag, customizations);

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

  // Если это картинка
  if (widgetInfo.isImage) {
    // Пытаемся получить imageUrl из widgetInfo или из customizations
    const imageUrlFromInfo = 
      ("imageUrl" in widgetInfo && typeof widgetInfo.imageUrl === "string") 
        ? widgetInfo.imageUrl 
        : null;
    const imageUrlFromCustomizations = customizations 
      ? getImageUrlFromCustomization(tag.id, customizations) 
      : null;
    const imageUrl = imageUrlFromInfo || imageUrlFromCustomizations;

    if (typeof imageUrl === "string") {
      return (
        <ImageWidget
          tag={tag}
          imageUrl={imageUrl}
          params={widgetInfo.params || undefined}
          className={className}
          style={style}
        />
      );
    }

    // Если URL не найден
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
          <h4>URL изображения не найден</h4>
          <p>Для тега "{tag.name}" указан виджет-картинка, но URL не найден</p>
        </div>
      </div>
    );
  }

  const WidgetComponent = WIDGET_COMPONENTS[widgetInfo.widgetType as WidgetType];

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

  return (
    <WidgetComponent
      tag={tag}
      params={widgetInfo.params || undefined}
      historyData={historyData}
      className={className}
      style={style}
    />
  );
};

export default WidgetFactory;
