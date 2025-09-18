// Типы для космических объектов (Edges)
export interface Edge {
  id: string;
  name: string;
  type: "star" | "supernova" | "neutron_star" | "black_hole";
}

// Типы для параметров объектов (Tags)
export interface Tag {
  id: string;
  name: string;
  type: "boolean" | "number" | "string";
  unit?: string;
  description?: string;
  value: boolean | number | string;
}

// API ответы
export interface EdgesApiResponse {
  edges: Edge[];
  total: number;
  page: number;
  limit: number;
}

// Простой ответ API (массив строк)
export type EdgesSimpleResponse = string[];

// Реальный ответ API для currents - объект с ключами-тегами и значениями
export interface CurrentApiResponse {
  [tagName: string]: number;
}

// Реальный ответ API для histories - пустой объект или объект с данными
export interface HistoryApiResponse {
  [key: string]: any;
}

// Типы для навигации
export interface NavigationProps {
  edgeId: string;
}
