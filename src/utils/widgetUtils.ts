import { WidgetType } from "../types/widgets";
import type { WidgetConfig, TagWidgetAssignment } from "../types/widgets";
import type { Tag } from "../types";

/**
 * Конфигурация всех доступных виджетов
 */
const WIDGET_CONFIGS: Record<WidgetType, WidgetConfig> = {
  // Boolean виджеты
  [WidgetType.LED_INDICATOR]: {
    type: WidgetType.LED_INDICATOR,
    name: "LED Индикатор",
    description: "Светодиодный индикатор включено/выключено",
    dataTypes: ["boolean"],
    icon: "💡",
    color: "#22c55e",
  },
  [WidgetType.SWITCH_TOGGLE]: {
    type: WidgetType.SWITCH_TOGGLE,
    name: "Переключатель",
    description: "Визуальный переключатель вкл/выкл",
    dataTypes: ["boolean"],
    icon: "🔘",
    color: "#3b82f6",
  },
  [WidgetType.STATUS_LIGHT]: {
    type: WidgetType.STATUS_LIGHT,
    name: "Статусная лампа",
    description: "Цветовой индикатор состояния",
    dataTypes: ["boolean"],
    icon: "🚦",
    color: "#f59e0b",
  },
  [WidgetType.ALARM_PANEL]: {
    type: WidgetType.ALARM_PANEL,
    name: "Панель аварий",
    description: "Панель сигнализации с мигающим эффектом",
    dataTypes: ["boolean"],
    icon: "🚨",
    color: "#ef4444",
  },

  // Number виджеты
  [WidgetType.THERMOMETER]: {
    type: WidgetType.THERMOMETER,
    name: "Термометр",
    description: "Вертикальный термометр с заполнением",
    dataTypes: ["number"],
    icon: "🌡️",
    color: "#ec4899",
  },
  [WidgetType.GAUGE]: {
    type: WidgetType.GAUGE,
    name: "Стрелочный индикатор",
    description: "Круговой измерительный прибор со стрелкой",
    dataTypes: ["number"],
    icon: "⚡",
    color: "#8b5cf6",
  },
  [WidgetType.SPEEDOMETER]: {
    type: WidgetType.SPEEDOMETER,
    name: "Спидометр",
    description: "Полукруговой спидометр с цветными зонами",
    dataTypes: ["number"],
    icon: "📊",
    color: "#14b8a6",
  },
  [WidgetType.LIQUID_FILL]: {
    type: WidgetType.LIQUID_FILL,
    name: "Заполнение жидкостью",
    description: "Анимированное заполнение емкости",
    dataTypes: ["number"],
    icon: "🌊",
    color: "#06b6d4",
  },
  [WidgetType.BAR_CHART]: {
    type: WidgetType.BAR_CHART,
    name: "Столбчатая диаграмма",
    description: "Вертикальные столбцы для отображения значений",
    dataTypes: ["number"],
    icon: "📊",
    color: "#10b981",
  },
  [WidgetType.AREA_CHART]: {
    type: WidgetType.AREA_CHART,
    name: "Площадная диаграмма",
    description: "График с заполненной областью",
    dataTypes: ["number"],
    icon: "📈",
    color: "#f97316",
  },

  // DINT виджеты (большие числа)
  [WidgetType.DIGITAL_DISPLAY]: {
    type: WidgetType.DIGITAL_DISPLAY,
    name: "Цифровое табло",
    description: "Цифровой дисплей с большими числами",
    dataTypes: ["number"],
    icon: "🔢",
    color: "#eab308",
  },
  [WidgetType.COUNTER]: {
    type: WidgetType.COUNTER,
    name: "Счетчик",
    description: "Анимированный счетчик с эффектами",
    dataTypes: ["number"],
    icon: "🔢",
    color: "#a855f7",
  },
  [WidgetType.HISTOGRAM]: {
    type: WidgetType.HISTOGRAM,
    name: "Гистограмма",
    description: "Распределение значений в виде гистограммы",
    dataTypes: ["number"],
    icon: "📊",
    color: "#84cc16",
  },
  [WidgetType.RADAR_CHART]: {
    type: WidgetType.RADAR_CHART,
    name: "Радарная диаграмма",
    description: "Многомерная визуализация в виде радара",
    dataTypes: ["number"],
    icon: "🎯",
    color: "#f43f5e",
  },
};

/**
 * Назначение виджетов для конкретных тегов
 * Каждый тег получает уникальный виджет
 */
const TAG_WIDGET_ASSIGNMENTS: TagWidgetAssignment[] = [
  // Boolean теги
  { tagId: "PC_IO_2.30", widgetType: WidgetType.LED_INDICATOR },
  { tagId: "PC_IO_2.12", widgetType: WidgetType.SWITCH_TOGGLE },
  { tagId: "pump1_bits1.27", widgetType: WidgetType.STATUS_LIGHT },
  { tagId: "pump2_bits1.27", widgetType: WidgetType.ALARM_PANEL },
  { tagId: "PC_IO_2.31", widgetType: WidgetType.LED_INDICATOR },
  { tagId: "PC_IO_2.13", widgetType: WidgetType.SWITCH_TOGGLE },
  { tagId: "A[2].31", widgetType: WidgetType.STATUS_LIGHT },
  { tagId: "PC_IO_2.25", widgetType: WidgetType.ALARM_PANEL },
  { tagId: "PC_IO_2.26", widgetType: WidgetType.LED_INDICATOR },

  // Boolean теги с точками (используем оставшиеся boolean виджеты циклично)
  { tagId: "DC_out_100ms[140].8", widgetType: WidgetType.SWITCH_TOGGLE },
  { tagId: "DC_out_100ms[140].10", widgetType: WidgetType.STATUS_LIGHT },
  { tagId: "DC_in_100ms[3].24", widgetType: WidgetType.ALARM_PANEL },
  { tagId: "DC_in_100ms[3].25", widgetType: WidgetType.LED_INDICATOR },
  { tagId: "DC_out_100ms[140].9", widgetType: WidgetType.SWITCH_TOGGLE },
  { tagId: "DC_out_100ms[141].10", widgetType: WidgetType.STATUS_LIGHT },
  { tagId: "DC_in_100ms[3].16", widgetType: WidgetType.ALARM_PANEL },
  { tagId: "DC_out_100ms[141].8", widgetType: WidgetType.LED_INDICATOR },
  { tagId: "DC_in_100ms[3].17", widgetType: WidgetType.SWITCH_TOGGLE },
  { tagId: "DC_out_100ms[141].9", widgetType: WidgetType.STATUS_LIGHT },
  { tagId: "DC_in_100ms[3].15", widgetType: WidgetType.ALARM_PANEL },
  { tagId: "DC_out_100ms[140].13", widgetType: WidgetType.LED_INDICATOR },
  { tagId: "DC_in_100ms[3].22", widgetType: WidgetType.SWITCH_TOGGLE },
  { tagId: "DC_out_100ms[140].14", widgetType: WidgetType.STATUS_LIGHT },
  { tagId: "DC_in_100ms[3].21", widgetType: WidgetType.ALARM_PANEL },
  { tagId: "DC_out_100ms[141].13", widgetType: WidgetType.LED_INDICATOR },
  { tagId: "DC_in_100ms[3].26", widgetType: WidgetType.SWITCH_TOGGLE },
  { tagId: "DC_in_100ms[3].18", widgetType: WidgetType.STATUS_LIGHT },
  { tagId: "DC_in_100ms[3].4", widgetType: WidgetType.ALARM_PANEL },
  { tagId: "DC_in_100ms[3].5", widgetType: WidgetType.LED_INDICATOR },

  // Number теги (int)
  { tagId: "Pump1_Wref_spm", widgetType: WidgetType.THERMOMETER },
  { tagId: "Pump1_Wfbk_spm", widgetType: WidgetType.GAUGE },
  { tagId: "DC_out_100ms[70]", widgetType: WidgetType.SPEEDOMETER },
  { tagId: "DC_out_100ms[72]", widgetType: WidgetType.LIQUID_FILL },
  { tagId: "P1_feed", widgetType: WidgetType.BAR_CHART },
  { tagId: "Pump2_Wfbk_spm", widgetType: WidgetType.AREA_CHART },
  { tagId: "Pump2_Wref_spm", widgetType: WidgetType.THERMOMETER },
  { tagId: "DC_out_100ms[74]", widgetType: WidgetType.GAUGE },
  { tagId: "DC_out_100ms[76]", widgetType: WidgetType.SPEEDOMETER },
  { tagId: "P2_feed", widgetType: WidgetType.LIQUID_FILL },
  { tagId: "DC_out_100ms[144]", widgetType: WidgetType.BAR_CHART },
  { tagId: "DC_out_100ms[146]", widgetType: WidgetType.AREA_CHART },
  { tagId: "DC_out_100ms[148]", widgetType: WidgetType.THERMOMETER },
  { tagId: "DC_out_100ms[164]", widgetType: WidgetType.GAUGE },
  { tagId: "DC_out_100ms[165]", widgetType: WidgetType.SPEEDOMETER },

  // DINT теги (большие числа)
  { tagId: "DC_in_100ms[84]", widgetType: WidgetType.DIGITAL_DISPLAY },
  { tagId: "DC_in_100ms[85]", widgetType: WidgetType.COUNTER },
  { tagId: "DC_in_100ms[86]", widgetType: WidgetType.HISTOGRAM },
  { tagId: "DC_in_100ms[87]", widgetType: WidgetType.RADAR_CHART },
  { tagId: "DC_in_100ms[88]", widgetType: WidgetType.DIGITAL_DISPLAY },

  // Недостающий тег с амперами
  { tagId: "Base_pumps_Ia_Amps", widgetType: WidgetType.GAUGE },
];

/**
 * Получить конфигурацию виджета по типу
 */
export const getWidgetConfig = (type: WidgetType): WidgetConfig => {
  return WIDGET_CONFIGS[type];
};

/**
 * Получить все доступные виджеты
 */
export const getAllWidgetConfigs = (): WidgetConfig[] => {
  return Object.values(WIDGET_CONFIGS);
};

/**
 * Получить виджеты по типу данных
 */
export const getWidgetsByDataType = (
  dataType: "boolean" | "number"
): WidgetConfig[] => {
  return Object.values(WIDGET_CONFIGS).filter((config) =>
    config.dataTypes.includes(dataType)
  );
};

/**
 * Получить назначенный виджет для тега
 */
export const getWidgetForTag = (tagId: string): WidgetType | null => {
  const assignment = TAG_WIDGET_ASSIGNMENTS.find(
    (assignment) => assignment.tagId === tagId
  );
  return assignment?.widgetType || null;
};

/**
 * Получить полную информацию о виджете для тега
 */
export const getTagWidgetInfo = (tag: Tag) => {
  const widgetType = getWidgetForTag(tag.id);
  if (!widgetType) {
    return null;
  }

  const config = getWidgetConfig(widgetType);
  return {
    widgetType,
    config,
    tag,
    isCompatible: config.dataTypes.includes(tag.type as "boolean" | "number"),
  };
};

/**
 * Получить все назначения виджетов
 */
export const getAllTagWidgetAssignments = (): TagWidgetAssignment[] => {
  return TAG_WIDGET_ASSIGNMENTS;
};

/**
 * Получить цвет виджета по типу
 */
export const getWidgetColor = (type: WidgetType): string => {
  return WIDGET_CONFIGS[type]?.color || "#8884d8";
};

/**
 * Получить иконку виджета по типу
 */
export const getWidgetIcon = (type: WidgetType): string => {
  return WIDGET_CONFIGS[type]?.icon || "📊";
};

/**
 * Проверить совместимость виджета с типом данных
 */
export const isWidgetCompatible = (
  widgetType: WidgetType,
  dataType: string
): boolean => {
  const config = getWidgetConfig(widgetType);
  return config.dataTypes.includes(dataType as "boolean" | "number");
};
