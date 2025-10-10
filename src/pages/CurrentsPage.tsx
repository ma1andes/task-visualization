import React, { useState, useEffect, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { useCurrents } from "../api/currents";
import { useHistories } from "../api/histories";
import { useTagCustomizationsByEdge } from "../api/customization";
import { hasCustomization, getAllWidgetKeysForTag } from "../utils/widgetUtils";
import TagSelector from "../components/common/TagSelector";
import { WidgetFactory } from "../components/widgets";
import "./CurrentsPage.css";

const CurrentsPage: React.FC = () => {
  const { edgeId } = useParams<{ edgeId: string }>();
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [hasInitialized, setHasInitialized] = useState(false);

  const {
    data: tags,
    isLoading,
    error,
    isFetching,
  } = useCurrents(edgeId || "");

  // Загружаем кастомизацию для этого edge
  const { data: customizations } = useTagCustomizationsByEdge(edgeId || "");
  
  // Загружаем историю для графиков
  const { data: historyData } = useHistories(edgeId || "");

  // Фильтруем теги - показываем только те, для которых есть кастомизация
  const filteredTags = useMemo(() => {
    if (!tags || !customizations) return [];
    return tags.filter((tag) => hasCustomization(tag.id, customizations));
  }, [tags, customizations]);

  useEffect(() => {
    setSelectedTags([]);
    setHasInitialized(false);
  }, [edgeId]);

  useEffect(() => {
    if (filteredTags.length > 0 && !hasInitialized) {
      setSelectedTags(filteredTags.map((tag) => tag.id));
      setHasInitialized(true);
    }
  }, [filteredTags, hasInitialized]);

  const handleTagToggle = (tagId: string) => {
    setSelectedTags((prev) =>
      prev.includes(tagId)
        ? prev.filter((id) => id !== tagId)
        : [...prev, tagId]
    );
  };

  const handleSelectAll = () => {
    setSelectedTags(filteredTags.map((tag) => tag.id));
  };

  const handleDeselectAll = () => {
    setSelectedTags([]);
  };

  const selectedTagsData = filteredTags.filter((tag) =>
    selectedTags.includes(tag.id)
  );

  if (error) {
    return (
      <div className="currents-page">
        <div className="error-message">
          <h2>Ошибка загрузки данных</h2>
          <p>
            Не удалось загрузить текущие значения параметров для объекта{" "}
            {edgeId}.
          </p>
          <p>
            Проверьте подключение к интернету и попробуйте обновить страницу.
          </p>
          <Link to="/" className="back-link">
            ← Вернуться к списку объектов
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="currents-page">
      {/* Индикатор обновления данных */}
      {isFetching && (
        <div className="update-indicator">
          <div className="spinner"></div>
          <span>Обновление данных...</span>
        </div>
      )}

      {/* Заголовок страницы */}
      <div className="page-header">
        <div className="page-title">
          <h1>Текущие значения параметров</h1>
          <p className="page-subtitle">Объект: {edgeId}</p>
        </div>
        <div className="page-navigation">
          <Link to="/" className="nav-link">
            ← К списку объектов
          </Link>
          <Link to={`/histories/${edgeId}`} className="nav-link">
            История →
          </Link>
        </div>
      </div>

      <div className="currents-layout">
        {/* Левый сайдбар - выбор тегов */}
        <div className="left-sidebar">
          {isLoading ? (
            <div className="loading-sidebar">
              <div className="spinner"></div>
              <span>Загрузка параметров...</span>
            </div>
          ) : filteredTags.length === 0 ? (
            <div className="empty-sidebar">
              <p>Нет тегов с кастомизацией для объекта {edgeId}</p>
            </div>
          ) : (
            <TagSelector
              tags={filteredTags}
              selectedTags={selectedTags}
              onTagToggle={handleTagToggle}
              onSelectAll={handleSelectAll}
              onDeselectAll={handleDeselectAll}
            />
          )}
        </div>

        {/* Основная область - визуализация */}
        <div className="main-content">
          {isLoading ? (
            <div className="loading-content">
              <div className="spinner"></div>
              <span>Загрузка данных...</span>
            </div>
          ) : filteredTags.length === 0 ? (
            <div className="empty-state">
              <h3>Нет тегов с кастомизацией</h3>
              <p>
                Для объекта {edgeId} не настроены кастомизации виджетов в базе
                данных.
              </p>
              <p>Отображаются только теги с настроенными виджетами.</p>
            </div>
          ) : selectedTagsData.length === 0 ? (
            <div className="empty-state">
              <h3>Нет выбранных параметров</h3>
              <p>Выберите параметры в левой панели для их отображения.</p>
            </div>
          ) : (
            <div className="visualization-grid">
              {selectedTagsData.map((tag) => {
                // Получаем все виджеты для этого тега
                const widgetKeys = getAllWidgetKeysForTag(tag.id, customizations || []);
                
                // Создаём отдельный виджет для каждого ключа
                return widgetKeys.map((widgetKey) => (
                  <WidgetFactory
                    key={`${tag.id}-${widgetKey}`}
                    tag={tag}
                    customizations={customizations}
                    widgetKey={widgetKey}
                    historyData={historyData}
                  />
                ));
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CurrentsPage;
