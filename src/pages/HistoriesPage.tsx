import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useHistories } from "../api/histories";
import type { Tag } from "../types";
import HistoryTagsSelector from "../components/HistoryTagsSelector";
import HistoryGraph from "../components/HistoryGraph";
import "./CurrentsPage.css";

// Генератор стабильной палитры
const DEFAULT_COLORS = [
  "#ef4444",
  "#3b82f6",
  "#10b981",
  "#f59e0b",
  "#8b5cf6",
  "#ec4899",
  "#14b8a6",
  "#f97316",
  "#22c55e",
  "#eab308",
];

const pickColor = (index: number) =>
  DEFAULT_COLORS[index % DEFAULT_COLORS.length];

const HistoriesPage: React.FC = () => {
  const { edgeId } = useParams<{ edgeId: string }>();
  const { data, isLoading, error, isFetching } = useHistories(edgeId || "");

  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [initializedEdgeId, setInitializedEdgeId] = useState<string | null>(
    null
  );

  // Выходной формат для графика: [{ timestamp: msNumber, tagA: number, tagB: number, ... }, ...]
  const { rows, tags } = useMemo(() => {
    if (!data)
      return {
        rows: [] as Array<Record<string, number | string | null>>,
        tags: [] as Tag[],
      };

    if (typeof data === "object" && !Array.isArray(data)) {
      const entries = Object.entries(data).filter(([, v]) => Array.isArray(v));
      const timestampToRow = new Map<
        number,
        Record<string, number | string | null>
      >();

      for (const [tagName, points] of entries as [string, any[]][]) {
        for (const p of points) {
          const rawTs = (p?.timestamp ?? p?.time ?? p?.t ?? p?.ts) as
            | string
            | number
            | undefined;
          const tsMs =
            typeof rawTs === "number" ? rawTs : Date.parse(String(rawTs));
          if (!Number.isFinite(tsMs)) continue;
          const value =
            typeof p?.value === "number" ? (p.value as number) : null;

          let row = timestampToRow.get(tsMs);
          if (!row) {
            row = { timestamp: tsMs } as Record<string, number | string | null>;
            timestampToRow.set(tsMs, row);
          }
          if (value !== null) {
            row[tagName] = value;
          }
        }
      }
      // сортировка
      const normalized = Array.from(timestampToRow.entries())
        .sort((a, b) => a[0] - b[0])
        .map(([, r]) => r);

      const tagIds = entries.map(([k]) => k).sort();
      const tags: Tag[] = tagIds.map((id) => ({
        id,
        name: id,
        type: "number",
        value: 0,
      }));

      return { rows: normalized, tags };
    }

    const possibleArray = Array.isArray(data)
      ? data
      : (data as any).rows || (data as any).data || [];
    const normalized: Array<Record<string, number | string | null>> = [];

    if (Array.isArray(possibleArray)) {
      for (const item of possibleArray) {
        if (item && typeof item === "object") {
          const row: Record<string, number | string | null> = {};
          const rawTs =
            (item as any).timestamp ??
            (item as any).time ??
            (item as any).t ??
            (item as any).ts;
          row.timestamp =
            typeof rawTs === "number" ? rawTs : Date.parse(String(rawTs));
          for (const [k, v] of Object.entries(item)) {
            if (k === "timestamp" || k === "time" || k === "t" || k === "ts")
              continue;
            if (typeof v === "number") row[k] = v;
          }
          normalized.push(row);
        }
      }
    }

    const numericKeys = new Set<string>();
    for (const r of normalized) {
      for (const [k, v] of Object.entries(r)) {
        if (k === "timestamp") continue;
        if (typeof v === "number") numericKeys.add(k);
      }
    }
    const tags: Tag[] = Array.from(numericKeys)
      .sort()
      .map((id) => ({ id, name: id, type: "number", value: 0 }));
    return { rows: normalized, tags };
  }, [data]);

  // Автовыбор всех тегов только при первом открытии конкретного edgeId
  useEffect(() => {
    if (edgeId && initializedEdgeId !== edgeId && tags.length > 0) {
      setSelectedTags(tags.map((t) => t.id));
      setInitializedEdgeId(edgeId);
    }
  }, [edgeId, tags, initializedEdgeId]);

  const handleTagToggle = (tagId: string) => {
    setSelectedTags((prev) =>
      prev.includes(tagId)
        ? prev.filter((id) => id !== tagId)
        : [...prev, tagId]
    );
  };

  const handleSelectAll = () => setSelectedTags(tags.map((t) => t.id));
  const handleDeselectAll = () => setSelectedTags([]);

  const colorMap = useMemo(() => {
    const map: Record<string, string> = {};
    tags.forEach((t, i) => (map[t.id] = pickColor(i)));
    return map;
  }, [tags]);

  if (error) {
    return (
      <div className="currents-page">
        <div className="error-message">
          <h2>Ошибка загрузки истории</h2>
          <p>Не удалось загрузить историю параметров для объекта {edgeId}.</p>
          <Link to={`/currents/${edgeId}`} className="back-link">
            ← Вернуться к текущим значениям
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="currents-page">
      {isFetching && (
        <div className="update-indicator">
          <div className="spinner"></div>
          <span>Обновление данных...</span>
        </div>
      )}

      <div className="page-header">
        <div className="page-title">
          <h1>История параметров</h1>
          <p className="page-subtitle">Объект: {edgeId}</p>
        </div>
        <div className="page-navigation">
          <Link to={`/currents/${edgeId}`} className="nav-link">
            ← Текущие значения
          </Link>
          <Link to="/" className="nav-link">
            К списку объектов →
          </Link>
        </div>
      </div>

      <div className="currents-layout">
        <div className="left-sidebar">
          {isLoading ? (
            <div className="loading-sidebar">
              <div className="spinner"></div>
              <span>Загрузка тегов...</span>
            </div>
          ) : (
            <HistoryTagsSelector
              tags={tags}
              selectedTags={selectedTags}
              colorMap={colorMap}
              onTagToggle={handleTagToggle}
              onSelectAll={handleSelectAll}
              onDeselectAll={handleDeselectAll}
            />
          )}
        </div>

        <div className="main-content">
          {isLoading ? (
            <div className="loading-content">
              <div className="spinner"></div>
              <span>Загрузка истории...</span>
            </div>
          ) : rows.length === 0 || selectedTags.length === 0 ? (
            <div className="empty-state">
              <h3>Нет данных для отображения</h3>
              <p>Выберите один или несколько тегов в левой панели.</p>
            </div>
          ) : (
            <HistoryGraph
              data={rows}
              selectedTags={selectedTags}
              colorMap={colorMap}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default HistoriesPage;
