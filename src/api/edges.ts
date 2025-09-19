import { useQuery } from "@tanstack/react-query";
import type {
  EdgesApiResponse,
  Edge,
  EdgesSimpleResponse,
  Tag,
  CurrentApiResponse,
} from "../types";

const API_BASE_URL = "/api";

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

export const useEdges = () => {
  return useQuery({
    queryKey: ["edges"],
    queryFn: fetchEdges,
    staleTime: 0,
    refetchInterval: 10 * 1000,
    retry: 3,
  });
};

export const fetchEdgeDetails = async (
  id: string
): Promise<{ edge: Edge; tags: Tag[] }> => {
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

  const currentResponse = await fetch(
    `${API_BASE_URL}/current?edge=${encodeURIComponent(id)}`,
    {
      headers: {
        Accept: "application/json",
      },
      credentials: "omit",
    }
  );

  if (!currentResponse.ok) {
    throw new Error(
      `Ошибка загрузки currents для edge ${id}: ${currentResponse.status}`
    );
  }

  const currentData: CurrentApiResponse = await currentResponse.json();

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

  const tags: Tag[] = [...apiTags, ...mockBooleanTags];

  return { edge, tags };
};

export const useEdgeDetails = (id: string) => {
  return useQuery({
    queryKey: ["edgeDetails", id],
    queryFn: () => fetchEdgeDetails(id),
    enabled: !!id,
    staleTime: 0,
    refetchInterval: 10 * 1000,
    retry: 3,
  });
};
