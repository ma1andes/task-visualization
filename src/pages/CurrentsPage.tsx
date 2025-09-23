import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useCurrents } from "../api/currents";
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

  useEffect(() => {
    setSelectedTags([]);
    setHasInitialized(false);
  }, [edgeId]);

  useEffect(() => {
    if (tags && !hasInitialized) {
      setSelectedTags(tags.map((tag) => tag.id));
      setHasInitialized(true);
    }
  }, [tags, hasInitialized]);

  const handleTagToggle = (tagId: string) => {
    setSelectedTags((prev) =>
      prev.includes(tagId)
        ? prev.filter((id) => id !== tagId)
        : [...prev, tagId]
    );
  };

  const handleSelectAll = () => {
    if (tags) {
      setSelectedTags(tags.map((tag) => tag.id));
    }
  };

  const handleDeselectAll = () => {
    setSelectedTags([]);
  };

  const selectedTagsData =
    tags?.filter((tag) => selectedTags.includes(tag.id)) || [];

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
          ) : (
            <TagSelector
              tags={tags || []}
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
          ) : selectedTagsData.length === 0 ? (
            <div className="empty-state">
              <h3>Нет выбранных параметров</h3>
              <p>Выберите параметры в левой панели для их отображения.</p>
            </div>
          ) : (
            <div className="visualization-grid">
              {selectedTagsData.map((tag) => (
                <WidgetFactory key={tag.id} tag={tag} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CurrentsPage;
