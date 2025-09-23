export interface Edge {
  id: string;
  name: string;
  type: "star" | "supernova" | "neutron_star" | "black_hole";
}

export interface Tag {
  id: string;
  name: string;
  type: "boolean" | "number" | "string";
  unit?: string;
  description?: string;
  value: boolean | number | string;
}

export interface EdgesApiResponse {
  edges: Edge[];
  total: number;
  page: number;
  limit: number;
}

export type EdgesSimpleResponse = string[];

export interface CurrentApiResponse {
  [tagName: string]: number;
}

export interface HistoryApiResponse {
  [key: string]: any;
}

export interface NavigationProps {
  edgeId: string;
}

// Экспорт типов виджетов
export * from "./types/widgets";
