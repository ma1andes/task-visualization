import { useQuery } from "@tanstack/react-query";
import type { HistoryApiResponse } from "../types";

const API_BASE_URL = import.meta.env.DEV
  ? "/api"
  : "https://drill.greact.ru/api";

// Функция для получения истории значений тегов
export const fetchHistories = async (
  edgeId: string
): Promise<HistoryApiResponse> => {
  const response = await fetch(`${API_BASE_URL}/history?edge=${edgeId}`, {
    headers: {
      Accept: "application/json",
    },
    credentials: "omit",
  });

  if (!response.ok) {
    throw new Error(
      `Ошибка загрузки histories для edge ${edgeId}: ${response.status}`
    );
  }

  const data = await response.json();
  return data;
};

// React Query hook для получения histories
export const useHistories = (edgeId: string) => {
  return useQuery({
    queryKey: ["histories", edgeId],
    queryFn: () => fetchHistories(edgeId),
    enabled: !!edgeId,
    staleTime: 0, // Данные всегда считаются устаревшими
    refetchInterval: 10 * 1000, // Обновляем каждые 10 секунд
    retry: 3,
  });
};
