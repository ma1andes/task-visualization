import { useQuery } from "@tanstack/react-query";
import type {
  EdgesApiResponse,
  Edge,
  EdgesSimpleResponse,
  Tag,
  CurrentApiResponse,
} from "../types";
import { createEdgeFromId } from "../utils/edgeUtils";
import { convertTagValue, getTagTypeInfo } from "../utils/tagTypeUtils";

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

    const edges: Edge[] = simpleResponse
      .map((edgeId) => createEdgeFromId(edgeId))
      .sort((a, b) => a.id.localeCompare(b.id));

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
  const edges: Edge[] = simpleResponse.map((edgeId) =>
    createEdgeFromId(edgeId)
  );

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

  const apiTags: Tag[] = Object.entries(currentData).map(([tagName, value]) => {
    const tagTypeInfo = getTagTypeInfo(tagName);
    const convertedValue = convertTagValue(value, tagName);

    return {
      id: tagName,
      name: tagName,
      type: tagTypeInfo.type,
      value: convertedValue,
      description: tagTypeInfo.description,
    };
  });

  const tags: Tag[] = apiTags;

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
