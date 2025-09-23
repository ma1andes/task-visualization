const WidgetType = {
  // Виджеты для Boolean данных
  LED_INDICATOR: "led_indicator",
  SWITCH_TOGGLE: "switch_toggle",
  STATUS_LIGHT: "status_light",
  ALARM_PANEL: "alarm_panel",

  // Виджеты для Number данных
  THERMOMETER: "thermometer",
  GAUGE: "gauge",
  SPEEDOMETER: "speedometer",
  LIQUID_FILL: "liquid_fill",
  BAR_CHART: "bar_chart",
  AREA_CHART: "area_chart",

  // Виджеты для DINT данных (большие числа)
  DIGITAL_DISPLAY: "digital_display",
  COUNTER: "counter",
  HISTOGRAM: "histogram",
  RADAR_CHART: "radar_chart",
} as const;

export type WidgetType = (typeof WidgetType)[keyof typeof WidgetType];
export { WidgetType };

export interface WidgetConfig {
  type: WidgetType;
  name: string;
  description: string;
  dataTypes: ("boolean" | "number")[];
  icon: string;
  color: string;
}

export interface TagWidgetAssignment {
  tagId: string;
  widgetType: WidgetType;
  config?: Record<string, any>;
}
