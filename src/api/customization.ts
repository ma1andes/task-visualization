import { useQuery } from "@tanstack/react-query";
import type {
  BaseCustomization,
  TagCustomization,
} from "../types/customization";

const API_BASE_URL = "/api";

/**
 * Получить все кастомизации для edges
 */
export const fetchEdgeCustomizations = async (): Promise<
  BaseCustomization[]
> => {
  try {
    const response = await fetch(`${API_BASE_URL}/edge-customization`, {
      method: "GET",
      mode: "cors",
      headers: {
        Accept: "application/json",
      },
      credentials: "omit",
    });

    if (!response.ok) {
      throw new Error(
        `Ошибка загрузки edge customization: ${response.status} ${response.statusText}`
      );
    }

    const data: BaseCustomization[] = await response.json();
    return data;
  } catch (error) {
    console.error("Ошибка в fetchEdgeCustomizations:", error);
    return [];
  }
};

/**
 * Получить кастомизации для конкретного edge
 */
export const fetchEdgeCustomizationById = async (
  edgeId: string
): Promise<BaseCustomization[]> => {
  const allCustomizations = await fetchEdgeCustomizations();
  return allCustomizations.filter((c) => c.edge_id === edgeId);
};

/**
 * Получить все кастомизации тегов
 */
export const fetchTagCustomizations = async (): Promise<
  TagCustomization[]
> => {
  try {
    const response = await fetch(`${API_BASE_URL}/tag-customization`, {
      method: "GET",
      mode: "cors",
      headers: {
        Accept: "application/json",
      },
      credentials: "omit",
    });

    if (!response.ok) {
      throw new Error(
        `Ошибка загрузки tag customization: ${response.status} ${response.statusText}`
      );
    }

    const data: TagCustomization[] = await response.json();
    return data;
  } catch (error) {
    console.error("Ошибка в fetchTagCustomizations:", error);
    // Возвращаем пустой массив вместо throw для fallback логики
    return [];
  }
};


/**
 * Получить кастомизации для конкретного тега
 */
export const fetchTagCustomizationByIds = async (
  edgeId: string,
  tagId: string
): Promise<TagCustomization[]> => {
  const allCustomizations = await fetchTagCustomizations();
  return allCustomizations.filter(
    (c) => c.edge_id === edgeId && c.tag_id === tagId
  );
};

/**
 * Получить все кастомизации тегов для конкретного edge
 */
export const fetchTagCustomizationsByEdge = async (
  edgeId: string
): Promise<TagCustomization[]> => {
  const allCustomizations = await fetchTagCustomizations();
  return allCustomizations.filter((c) => c.edge_id === edgeId);
};

/**
 * Получить block кастомизации
 */
export const fetchBlockCustomizations = async (): Promise<
  BaseCustomization[]
> => {
  try {
    const response = await fetch(`${API_BASE_URL}/block-customization`, {
      method: "GET",
      mode: "cors",
      headers: {
        Accept: "application/json",
      },
      credentials: "omit",
    });

    if (!response.ok) {
      throw new Error(
        `Ошибка загрузки block customization: ${response.status} ${response.statusText}`
      );
    }

    const data: BaseCustomization[] = await response.json();
    return data;
  } catch (error) {
    console.error("Ошибка в fetchBlockCustomizations:", error);
    return [];
  }
};

// =============================================
// React Query Hooks
// =============================================

/**
 * Hook для получения всех edge customizations
 */
export const useEdgeCustomizations = () => {
  return useQuery({
    queryKey: ["edge-customizations"],
    queryFn: fetchEdgeCustomizations,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 1,
  });
};

/**
 * Hook для получения edge customization по ID
 */
export const useEdgeCustomizationById = (edgeId: string) => {
  return useQuery({
    queryKey: ["edge-customization", edgeId],
    queryFn: () => fetchEdgeCustomizationById(edgeId),
    enabled: !!edgeId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 1,
  });
};

/**
 * Hook для получения всех tag customizations
 */
export const useTagCustomizations = () => {
  return useQuery({
    queryKey: ["tag-customizations"],
    queryFn: fetchTagCustomizations,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 1,
  });
};

/**
 * Hook для получения tag customizations для конкретного edge
 */
export const useTagCustomizationsByEdge = (edgeId: string) => {
  return useQuery({
    queryKey: ["tag-customizations", edgeId],
    queryFn: () => fetchTagCustomizationsByEdge(edgeId),
    enabled: !!edgeId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 1,
  });
};

/**
 * Hook для получения tag customization для конкретного тега
 */
export const useTagCustomizationByIds = (edgeId: string, tagId: string) => {
  return useQuery({
    queryKey: ["tag-customization", edgeId, tagId],
    queryFn: () => fetchTagCustomizationByIds(edgeId, tagId),
    enabled: !!edgeId && !!tagId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 1,
  });
};

/**
 * Hook для получения block customizations
 */
export const useBlockCustomizations = () => {
  return useQuery({
    queryKey: ["block-customizations"],
    queryFn: fetchBlockCustomizations,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 1,
  });
};

