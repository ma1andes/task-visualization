import { useQuery } from "@tanstack/react-query";
import type { CurrentApiResponse, Tag } from "../types";
import { convertTagValue, getTagTypeInfo } from "../utils/tagTypeUtils";

const API_BASE_URL = "/api";
export const fetchCurrents = async (edgeId: string): Promise<Tag[]> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/current?edge=${encodeURIComponent(edgeId)}`,
      {
        method: "GET",
        mode: "cors",
        headers: {
          Accept: "application/json",
        },
        credentials: "omit",
      }
    );

    if (!response.ok) {
      throw new Error(
        `Ошибка загрузки currents для edge ${edgeId}: ${response.status} ${response.statusText}`
      );
    }

    const currentData: CurrentApiResponse = await response.json();

    const allTags: Tag[] = Object.entries(currentData).map(
      ([tagName, value]) => {
        const tagTypeInfo = getTagTypeInfo(tagName);
        const convertedValue = convertTagValue(value, tagName);

        return {
          id: tagName,
          name: tagName,
          type: tagTypeInfo.type,
          value: convertedValue,
          unit: tagTypeInfo.type === "number" ? "ед." : undefined,
          description: tagTypeInfo.description,
        };
      }
    );

    return allTags;
  } catch (error) {
    console.error("Ошибка в fetchCurrents:", error);
    throw error;
  }
};

export const useCurrents = (edgeId: string) => {
  return useQuery({
    queryKey: ["currents", edgeId],
    queryFn: () => fetchCurrents(edgeId),
    enabled: !!edgeId,
    staleTime: 0,
    refetchInterval: 10 * 1000,
    retry: 3,
  });
};
