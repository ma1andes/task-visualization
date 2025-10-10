/**
 * Утилиты для работы с цветами в виджетах
 */

/**
 * Маппинг названий цветов на HEX коды
 */
const COLOR_NAMES: Record<string, string> = {
  // Основные цвета
  red: "#ef4444",
  green: "#22c55e",
  blue: "#3b82f6",
  yellow: "#eab308",
  orange: "#f97316",
  purple: "#a855f7",
  pink: "#ec4899",
  cyan: "#06b6d4",
  
  // Русские названия
  красный: "#ef4444",
  зеленый: "#22c55e",
  синий: "#3b82f6",
  желтый: "#eab308",
  оранжевый: "#f97316",
  фиолетовый: "#a855f7",
  розовый: "#ec4899",
  голубой: "#06b6d4",
  
  // Оттенки
  "light-red": "#fca5a5",
  "dark-red": "#b91c1c",
  "light-green": "#86efac",
  "dark-green": "#15803d",
  "light-blue": "#93c5fd",
  "dark-blue": "#1e40af",
  "light-orange": "#fdba74",
  "dark-orange": "#c2410c",
  
  // Технические состояния
  success: "#22c55e",
  warning: "#f59e0b",
  danger: "#ef4444",
  error: "#dc2626",
  info: "#3b82f6",
  
  // Grayscale
  gray: "#6b7280",
  white: "#ffffff",
  black: "#000000",
};

/**
 * Преобразует название цвета или HEX в валидный HEX
 * @param color - название цвета или HEX код
 * @param defaultColor - цвет по умолчанию если не распознан
 * @returns HEX код цвета
 */
export const normalizeColor = (
  color: string | undefined,
  defaultColor: string = "#f97316"
): string => {
  if (!color) return defaultColor;

  const trimmed = color.trim().toLowerCase();

  // Если уже HEX - возвращаем как есть
  if (trimmed.startsWith("#")) {
    return trimmed;
  }

  // Если RGB/RGBA - возвращаем как есть
  if (trimmed.startsWith("rgb")) {
    return trimmed;
  }

  // Ищем в маппинге названий
  if (COLOR_NAMES[trimmed]) {
    return COLOR_NAMES[trimmed];
  }

  // Если не распознан - возвращаем дефолтный
  console.warn(`[colorUtils] Unknown color: "${color}", using default: ${defaultColor}`);
  return defaultColor;
};

/**
 * Создает градиент для области графика на основе цвета
 * @param baseColor - базовый цвет (HEX)
 * @returns объект градиента для ECharts
 */
export const createAreaGradient = (baseColor: string) => {
  // Извлекаем RGB из HEX
  const hex = baseColor.replace("#", "");
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  return {
    type: "linear" as const,
    x: 0,
    y: 0,
    x2: 0,
    y2: 1,
    colorStops: [
      { offset: 0, color: `rgba(${r}, ${g}, ${b}, 0.6)` },
      { offset: 0.5, color: `rgba(${r}, ${g}, ${b}, 0.3)` },
      { offset: 1, color: `rgba(${r}, ${g}, ${b}, 0.1)` },
    ],
  };
};

/**
 * Создает цветовые зоны для спидометра на основе цвета
 * @param baseColor - базовый цвет (HEX)
 * @returns массив цветовых зон для ECharts gauge
 */
export const createSpeedometerColors = (baseColor: string) => {
  const normalized = normalizeColor(baseColor);
  
  // Если зеленый - используем стандартную схему от зеленого к красному
  if (normalized === COLOR_NAMES.green || normalized === COLOR_NAMES["зеленый"]) {
    return [
      [0.2, "#22c55e"], // Зеленый
      [0.5, "#3b82f6"], // Синий
      [0.8, "#f59e0b"], // Желтый
      [1, "#ef4444"],   // Красный
    ];
  }
  
  // Если красный - делаем обратную схему
  if (normalized === COLOR_NAMES.red || normalized === COLOR_NAMES["красный"]) {
    return [
      [0.2, "#ef4444"], // Красный
      [0.5, "#f59e0b"], // Желтый
      [0.8, "#3b82f6"], // Синий
      [1, "#22c55e"],   // Зеленый
    ];
  }
  
  // Для остальных цветов - градиент от темного к светлому
  return [
    [0.25, normalized],
    [0.5, normalized],
    [0.75, normalized],
    [1, normalized],
  ];
};

/**
 * Создает градиент для столбца BarChart
 * @param baseColor - базовый цвет (HEX)
 * @returns объект градиента для ECharts
 */
export const createBarGradient = (baseColor: string) => {
  const hex = baseColor.replace("#", "");
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  return {
    type: "linear" as const,
    x: 0,
    y: 1,
    x2: 0,
    y2: 0,
    colorStops: [
      { offset: 0, color: `rgba(${r}, ${g}, ${b}, 0.3)` },
      { offset: 0.5, color: `rgba(${r}, ${g}, ${b}, 0.7)` },
      { offset: 1, color: `rgba(${r}, ${g}, ${b}, 1)` },
    ],
  };
};

