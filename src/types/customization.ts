/**
 * Типы для системы кастомизации виджетов
 */

/**
 * Базовый интерфейс для кастомизации (Edge и Block)
 */
export interface BaseCustomization {
  edge_id?: string;
  block_id?: string;
  key: string;
  value: string;
}

/**
 * Кастомизация для конкретного тега
 */
export interface TagCustomization {
  edge_id: string;
  tag_id: string;
  key: string;
  value: string;
}

/**
 * Объединённый тип для любой кастомизации
 */
export type Customization = BaseCustomization | TagCustomization;

/**
 * Параметры виджета, распарсенные из value
 */
export interface WidgetParams {
  // Общие параметры
  min?: number;
  max?: number;
  width?: number;
  height?: number;
  
  // Координаты
  x?: number;
  y?: number;
  
  // URL для картинок
  url?: string;
  
  // Цвета
  color?: string;
  color_text?: string;
  backgroundColor?: string;
  
  // Флаги
  isStatus?: boolean;
  
  // Любые другие параметры
  [key: string]: string | number | boolean | undefined;
}

/**
 * Результат распарсенной кастомизации тега
 */
export interface ParsedTagCustomization {
  edgeId: string;
  tagId: string;
  key: string;
  value: string;
  params?: WidgetParams;
  widgetType?: string;
  isImage?: boolean;
}

/**
 * Кеш кастомизаций для edge
 */
export interface CustomizationCache {
  edgeCustomization: Map<string, string>;
  tagCustomization: Map<string, Map<string, string>>;
  blockCustomization: Map<string, string>;
}
