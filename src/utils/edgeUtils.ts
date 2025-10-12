import type { Edge } from "../types";

/**
 * Единая утилита для управления всеми свойствами edges
 */

// Цвета для каждого типа edge (используются для графиков и визуализации)
const EDGE_TYPE_COLORS: Record<Edge["type"], string> = {
  star: "#f59e0b", // Желтый - звезда
  supernova: "#ef4444", // Красный - сверхновая
  neutron_star: "#8b5cf6", // Фиолетовый - нейтронная звезда
  black_hole: "#1f2937", // Темный - черная дыра
};

// Иконки для каждого типа edge
const EDGE_TYPE_ICONS: Record<Edge["type"], string> = {
  star: "⭐",
  supernova: "💥",
  neutron_star: "⚡",
  black_hole: "🕳️",
};

// Русские названия для каждого типа edge
const EDGE_TYPE_NAMES: Record<Edge["type"], string> = {
  star: "Звезда",
  supernova: "Сверхновая",
  neutron_star: "Нейтронная звезда",
  black_hole: "Чёрная дыра",
};

// Дополнительная палитра цветов для графиков (когда нужно больше цветов)
const ADDITIONAL_COLORS = [
  "#3b82f6", // Синий
  "#10b981", // Зеленый
  "#ec4899", // Розовый
  "#14b8a6", // Бирюзовый
  "#f97316", // Оранжевый
  "#22c55e", // Лайм
  "#eab308", // Желто-зеленый
];

/**
 * Получить иконку для типа edge
 */
export const getEdgeTypeIcon = (type: Edge["type"]): string => {
  return EDGE_TYPE_ICONS[type] || "🌟";
};

/**
 * Получить русское название для типа edge
 */
export const getEdgeTypeName = (type: Edge["type"]): string => {
  return EDGE_TYPE_NAMES[type] || "Неизвестно";
};

/**
 * Получить цвет для типа edge
 */
export const getEdgeTypeColor = (type: Edge["type"]): string => {
  return EDGE_TYPE_COLORS[type] || "#8884d8";
};

/**
 * Определить тип edge по ID (стабильный тип для каждого edge)
 */
export const getEdgeTypeById = (edgeId: string): Edge["type"] => {
  const types: Edge["type"][] = [
    "star",
    "supernova",
    "neutron_star",
    "black_hole",
  ];

  // Создаем стабильный хеш из ID для определения типа
  let hash = 0;
  for (let i = 0; i < edgeId.length; i++) {
    const char = edgeId.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Конвертируем в 32-битное целое
  }

  return types[Math.abs(hash) % 4];
};


/**
 * Создать edge объект из ID
 */
export const createEdgeFromId = (edgeId: string): Edge => {
  return {
    id: edgeId,
    name: `Объект ${edgeId}`,
    type: getEdgeTypeById(edgeId),
  };
};

/**
 * Получить цвет для графика по индексу (для тегов и других элементов)
 */
export const getColorByIndex = (index: number): string => {
  // Сначала используем цвета типов edges, потом дополнительную палитру
  const allColors = [...Object.values(EDGE_TYPE_COLORS), ...ADDITIONAL_COLORS];
  return allColors[index % allColors.length];
};

/**
 * Получить цвет для edge по его ID (стабильный цвет для каждого edge)
 */
export const getEdgeColorById = (edgeId: string): string => {
  // Простой хеш для получения стабильного индекса из ID
  let hash = 0;
  for (let i = 0; i < edgeId.length; i++) {
    const char = edgeId.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Конвертируем в 32-битное целое
  }
  return getColorByIndex(Math.abs(hash));
};

/**
 * Получить все доступные типы edges
 */
export const getAllEdgeTypes = (): Edge["type"][] => {
  return Object.keys(EDGE_TYPE_ICONS) as Edge["type"][];
};

/**
 * Получить полную информацию об edge типе
 */
export const getEdgeTypeInfo = (type: Edge["type"]) => {
  return {
    type,
    icon: getEdgeTypeIcon(type),
    name: getEdgeTypeName(type),
    color: getEdgeTypeColor(type),
  };
};

/**
 * Создать colorMap для графиков на основе списка тегов
 */
export const createColorMapForTags = (
  tagIds: string[]
): Record<string, string> => {
  const colorMap: Record<string, string> = {};
  tagIds.forEach((tagId, index) => {
    colorMap[tagId] = getColorByIndex(index);
  });
  return colorMap;
};
