import type { WidgetParams } from "../types/customization";

/**
 * Парсер для строк кастомизации из БД
 * Поддерживает форматы:
 * - {key=value;key=value} - параметры виджета
 * - {url://picture} - URL картинки
 * - true/false - булевы значения
 * - простые строки
 */

/**
 * Проверяет, является ли строка параметрами в фигурных скобках
 */
const isParamsString = (value: string): boolean => {
  return value.trim().startsWith("{") && value.trim().endsWith("}");
};

/**
 * Проверяет, является ли строка URL картинки
 */
const isImageUrl = (value: string): boolean => {
  const trimmed = value.trim();
  
  // Формат {url:...} или {http://...}
  if (isParamsString(trimmed)) {
    const inner = trimmed.slice(1, -1).trim();
    return inner.startsWith("url:") || inner.includes("://");
  }
  
  // Формат без скобок: http://... или https://...
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return true;
  }
  
  return false;
};

/**
 * Извлекает URL из строки формата {url://picture}, {url:http://...}, или http://...
 */
const extractImageUrl = (value: string): string | null => {
  if (!isImageUrl(value)) {
    return null;
  }

  const trimmed = value.trim();
  
  // Формат без скобок: прямой URL
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }
  
  // Формат в скобках
  if (isParamsString(trimmed)) {
    const inner = trimmed.slice(1, -1).trim();

    // Формат: url://picture или url:http://...
    if (inner.startsWith("url:")) {
      return inner.substring(4);
    }

    // Просто URL внутри скобок
    if (inner.includes("://")) {
      return inner;
    }
  }

  return null;
};

/**
 * Парсит строку формата {key=value;key=value} в объект параметров
 * Примеры:
 * - "{min=0;max=180}" -> { min: 0, max: 180 }
 * - "{height=100; width=10; min=0; max=100}" -> { height: 100, width: 10, min: 0, max: 100 }
 * - "{X=0;Y=0}" -> { x: 0, y: 0 }
 */
const parseParams = (value: string): WidgetParams => {
  const params: WidgetParams = {};

  if (!isParamsString(value)) {
    return params;
  }

  const trimmed = value.trim();
  const inner = trimmed.slice(1, -1).trim();

  // Разбиваем по точке с запятой
  const pairs = inner.split(";").map((s) => s.trim()).filter(Boolean);

  for (const pair of pairs) {
    const equalIndex = pair.indexOf("=");
    if (equalIndex === -1) continue;

    const key = pair.substring(0, equalIndex).trim();
    const val = pair.substring(equalIndex + 1).trim();

    if (!key) continue;

    // Нормализуем ключ (X -> x, Y -> y)
    const normalizedKey = key.toLowerCase();

    // Пытаемся распарсить как число
    const numValue = parseFloat(val);
    if (!isNaN(numValue)) {
      params[normalizedKey] = numValue;
      continue;
    }

    // Пытаемся распарсить как boolean
    if (val.toLowerCase() === "true") {
      params[normalizedKey] = true;
      continue;
    }
    if (val.toLowerCase() === "false") {
      params[normalizedKey] = false;
      continue;
    }

    // Сохраняем как строку
    params[normalizedKey] = val;
  }

  return params;
};

/**
 * Парсит значение value из БД в зависимости от его формата
 */
export const parseCustomizationValue = (
  value: string
): {
  rawValue: string;
  params?: WidgetParams;
  imageUrl?: string;
  isImage: boolean;
} => {
  const trimmed = value.trim();

  // Проверяем на URL картинки
  if (isImageUrl(trimmed)) {
    const imageUrl = extractImageUrl(trimmed);
    return {
      rawValue: trimmed,
      imageUrl: imageUrl || undefined,
      isImage: true,
    };
  }

  // Проверяем на параметры
  if (isParamsString(trimmed)) {
    const params = parseParams(trimmed);
    return {
      rawValue: trimmed,
      params,
      isImage: false,
    };
  }

  // Простое значение
  return {
    rawValue: trimmed,
    isImage: false,
  };
};

/**
 * Проверяет, является ли ключ ключом виджета
 * Виджетом считается любой ключ, кроме служебных (начинающихся с "is")
 */
export const isWidgetKey = (key: string): boolean => {
  const normalized = key.toLowerCase().trim();
  
  // Служебные ключи (флаги) - не виджеты
  if (normalized.startsWith("is")) {
    return false;
  }
  
  // Цветовые настройки - не виджеты
  if (normalized.startsWith("color")) {
    return false;
  }
  
  // Все остальные ключи считаем виджетами
  return true;
};

/**
 * Маппинг имён виджетов из БД на типы виджетов в системе
 */
const WIDGET_NAME_MAPPING: Record<string, string> = {
  "vertical_bar": "bar_chart",
  "chart": "area_chart", // Площадная диаграмма с координатами
  "half_circle": "speedometer",
  "halfcircle": "speedometer",
  "progress_bar": "progress_bar",
  "led": "led_indicator",
  "switch": "switch_toggle",
  "status": "status_light",
  "alarm": "alarm_panel",
  "temp": "thermometer",
  "temperature": "thermometer",
  "liquid": "liquid_fill",
  "area": "area_chart",
  "digital": "digital_display",
  "count": "counter",
  "histogram": "histogram",
  "radar": "radar_chart",
};

/**
 * Нормализует имя виджета из значения
 * Примеры:
 * - "led_indicator" -> "led_indicator"
 * - "LED Indicator" -> "led_indicator"
 * - "Vertical bar" -> "bar_chart"
 * - "half-circle" -> "speedometer"
 */
export const normalizeWidgetName = (value: string): string => {
  const normalized = value
    .toLowerCase()
    .replace(/\s+/g, "_")
    .replace(/-/g, "_");
  
  // Проверяем маппинг
  return WIDGET_NAME_MAPPING[normalized] || normalized;
};

/**
 * Объединяет несколько наборов параметров в один
 * Приоритет имеют параметры справа
 */
export const mergeParams = (...paramSets: Array<WidgetParams | undefined>): WidgetParams => {
  return paramSets.filter((params): params is WidgetParams => params !== undefined)
    .reduce((acc, params) => ({ ...acc, ...params }), {} as WidgetParams);
};

/**
 * Валидирует параметры виджета
 * Проверяет логическую корректность (например, min < max)
 */
export const validateParams = (params: WidgetParams): WidgetParams => {
  const validated = { ...params };
  
  // Проверка min/max
  if (typeof validated.min === 'number' && typeof validated.max === 'number') {
    if (validated.min > validated.max) {
      console.warn(`[customizationParser] Invalid params: min (${validated.min}) > max (${validated.max}). Swapping values.`);
      [validated.min, validated.max] = [validated.max, validated.min];
    }
  }
  
  // Проверка width/height (должны быть положительными)
  if (typeof validated.width === 'number' && validated.width <= 0) {
    console.warn(`[customizationParser] Invalid width: ${validated.width}. Ignoring.`);
    delete validated.width;
  }
  if (typeof validated.height === 'number' && validated.height <= 0) {
    console.warn(`[customizationParser] Invalid height: ${validated.height}. Ignoring.`);
    delete validated.height;
  }
  
  return validated;
};

/**
 * Проверяет безопасность URL
 * Блокирует опасные протоколы (javascript:, data:, file:)
 */
export const isSafeUrl = (url: string): boolean => {
  const trimmed = url.trim().toLowerCase();
  
  // Разрешённые протоколы
  const safeProtocols = ['http://', 'https://', '//'];
  
  // Проверка на разрешённые протоколы
  const isSafe = safeProtocols.some(protocol => trimmed.startsWith(protocol));
  
  if (!isSafe) {
    console.warn(`[customizationParser] Unsafe URL blocked: ${url}`);
  }
  
  return isSafe;
};
