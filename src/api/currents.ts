import { useQuery } from "@tanstack/react-query";
import type { CurrentApiResponse } from "../types";

const API_BASE_URL = import.meta.env.DEV
  ? "/api"
  : "https://drill.greact.ru/api";

// Функция для получения текущих значений тегов
export const fetchCurrents = async (
  edgeId: string
): Promise<CurrentApiResponse> => {
  const response = await fetch(`${API_BASE_URL}/current?edge=${edgeId}`, {
    headers: {
      Accept: "application/json",
    },
    credentials: "omit",
  });

  if (!response.ok) {
    throw new Error(
      `Ошибка загрузки currents для edge ${edgeId}: ${response.status}`
    );
  }

  const data = await response.json();
  return data;
};

// React Query hook для получения currents
export const useCurrents = (edgeId: string) => {
  return useQuery({
    queryKey: ["currents", edgeId],
    queryFn: () => fetchCurrents(edgeId),
    enabled: !!edgeId,
    staleTime: 0, // Данные всегда считаются устаревшими
    refetchInterval: 10 * 1000, // Обновляем каждые 10 секунд
    retry: 3,
  });
};
