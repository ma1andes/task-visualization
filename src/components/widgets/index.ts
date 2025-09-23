// Экспорт всех виджетов через категории
export * from "./boolean";
export * from "./number";
export * from "./dint";
export * from "./common";

// Прямые экспорты для обратной совместимости
export { WidgetContainer, WidgetFactory } from "./common";
export type { BaseWidgetProps } from "./common";
