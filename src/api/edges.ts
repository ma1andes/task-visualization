import { useQuery } from "@tanstack/react-query";
import type {
  EdgesApiResponse,
  Edge,
  EdgesSimpleResponse,
  Tag,
  CurrentApiResponse,
} from "../types";

// Используем локальный прокси для обхода проблем с SSL
// В продакшене можно переключить на прямые запросы
const API_BASE_URL = import.meta.env.DEV
  ? "/api"
  : "https://drill.greact.ru/api";

// Функция для получения списка edges
export const fetchEdges = async (): Promise<EdgesApiResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/edges`, {
      method: "GET",
      mode: "cors",
      headers: {
        Accept: "application/json",
      },
      credentials: "omit",
    });

    if (!response.ok) {
      throw new Error(
        `Ошибка загрузки edges: ${response.status} ${response.statusText}`
      );
    }

    const simpleResponse: EdgesSimpleResponse = await response.json();

    // Преобразуем простой массив строк в объекты Edge
    const edges: Edge[] = simpleResponse.map((edgeId, index) => ({
      id: edgeId,
      name: `Объект ${edgeId}`,
      type:
        index % 4 === 0
          ? "star"
          : index % 4 === 1
          ? "supernova"
          : index % 4 === 2
          ? "neutron_star"
          : "black_hole",
    }));

    return {
      edges,
      total: edges.length,
      page: 1,
      limit: edges.length,
    };
  } catch (error) {
    console.error("Ошибка в fetchEdges:", error);
    throw error;
  }
};

// React Query hook для получения edges
export const useEdges = () => {
  return useQuery({
    queryKey: ["edges"],
    queryFn: fetchEdges,
    staleTime: 0, // Данные всегда считаются устаревшими
    refetchInterval: 10 * 1000, // Обновляем каждые 10 секунд
    retry: 3,
  });
};

// Функция для получения данных о конкретном edge через API /current
export const fetchEdgeDetails = async (
  id: string
): Promise<{ edge: Edge; tags: Tag[] }> => {
  // Получаем список всех edges для базовой информации
  const edgesResponse = await fetch(`${API_BASE_URL}/edges`, {
    headers: {
      Accept: "application/json",
    },
    credentials: "omit",
  });

  if (!edgesResponse.ok) {
    throw new Error(`Ошибка загрузки edges: ${edgesResponse.status}`);
  }

  const simpleResponse: EdgesSimpleResponse = await edgesResponse.json();
  const edges: Edge[] = simpleResponse.map((edgeId, index) => ({
    id: edgeId,
    name: `Объект ${edgeId}`,
    type:
      index % 4 === 0
        ? "star"
        : index % 4 === 1
        ? "supernova"
        : index % 4 === 2
        ? "neutron_star"
        : "black_hole",
  }));

  const edge = edges.find((e) => e.id === id);
  if (!edge) {
    throw new Error(`Edge с ID ${id} не найден`);
  }

  // Получаем текущие значения тегов через API /current
  const currentResponse = await fetch(`${API_BASE_URL}/current?edge=${id}`, {
    headers: {
      Accept: "application/json",
    },
    credentials: "omit",
  });

  if (!currentResponse.ok) {
    throw new Error(
      `Ошибка загрузки currents для edge ${id}: ${currentResponse.status}`
    );
  }

  const currentData: CurrentApiResponse = await currentResponse.json();

  // Преобразуем данные API в теги
  const apiTags: Tag[] = Object.entries(currentData).map(
    ([tagName, value]) => ({
      id: tagName,
      name: tagName,
      type:
        typeof value === "boolean"
          ? "boolean"
          : typeof value === "number"
          ? "number"
          : "string",
      value: value,
    })
  );

  // Добавляем mock boolean теги для демонстрации согласно ТЗ
  const mockBooleanTags: Tag[] = [
    {
      id: "relativistic_jet",
      name: "MOCK: Выброс релятивистского джета",
      type: "boolean",
      description: "Активность релятивистского джета",
      value: Math.random() > 0.5,
    },
    {
      id: "accretion_disk_active",
      name: "MOCK:Аккреционный диск активен",
      type: "boolean",
      description: "Состояние аккреционного диска",
      value: Math.random() > 0.3,
    },
    {
      id: "magnetic_field_stable",
      name: "MOCK: Магнитное поле стабильно",
      type: "boolean",
      description: "Стабильность магнитного поля",
      value: Math.random() > 0.7,
    },
  ];

  // Объединяем API теги и mock boolean теги
  const tags: Tag[] = [...apiTags, ...mockBooleanTags];

  return { edge, tags };
};

// React Query hook для получения данных о edge
export const useEdgeDetails = (id: string) => {
  return useQuery({
    queryKey: ["edgeDetails", id],
    queryFn: () => fetchEdgeDetails(id),
    enabled: !!id,
    staleTime: 0, // Данные всегда считаются устаревшими
    refetchInterval: 10 * 1000, // Обновляем каждые 10 секунд
    retry: 3,
  });
};
