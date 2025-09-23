// Экспорт всех компонентов через категории
export * from "./edges";
export * from "./history";
export * from "./common";
export * from "./widgets";

// Прямые экспорты для обратной совместимости
export { EdgeDetails, EdgeList } from "./edges";
export { HistoryGraph, HistoryTagsSelector } from "./history";
export { TagSelector, TagVisualization } from "./common";
export { WidgetFactory } from "./widgets";
