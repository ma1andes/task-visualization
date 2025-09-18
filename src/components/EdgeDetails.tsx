import React from "react";
import { Link } from "react-router-dom";
import type { Edge, Tag } from "../types";
import "./EdgeDetails.css";

interface EdgeDetailsProps {
  edge: Edge | null;
  tags: Tag[];
  isLoading?: boolean;
}

const EdgeDetails: React.FC<EdgeDetailsProps> = ({
  edge,
  tags,
  isLoading = false,
}) => {
  const getEdgeTypeIcon = (type: Edge["type"]) => {
    switch (type) {
      case "star":
        return "⭐";
      case "supernova":
        return "💥";
      case "neutron_star":
        return "⚡";
      case "black_hole":
        return "🕳️";
      default:
        return "🌟";
    }
  };

  const getEdgeTypeName = (type: Edge["type"]) => {
    switch (type) {
      case "star":
        return "Звезда";
      case "supernova":
        return "Сверхновая";
      case "neutron_star":
        return "Нейтронная звезда";
      case "black_hole":
        return "Чёрная дыра";
      default:
        return "Неизвестно";
    }
  };

  const getBooleanIndicator = (value: boolean) => {
    return (
      <div className={`boolean-indicator ${value ? "true" : "false"}`}>
        <div className="indicator-dot"></div>
        <span className="indicator-text">{value ? "ON" : "OFF"}</span>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="edge-details">
        <div className="loading">Загрузка деталей...</div>
      </div>
    );
  }

  if (!edge) {
    return (
      <div className="edge-details">
        <div className="no-selection">
          <h3>Выберите космический объект</h3>
          <p>
            Выберите объект из списка слева, чтобы просмотреть его детали и
            характеристики.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="edge-details">
      <div className="edge-header">
        <div className="edge-title">
          <span className="edge-icon">{getEdgeTypeIcon(edge.type)}</span>
          <div>
            <h2>{edge.name}</h2>
            <span className="edge-type">{getEdgeTypeName(edge.type)}</span>
          </div>
        </div>
      </div>

      <div className="edge-info">
        <div className="info-section">
          <h3>Информация</h3>
          <p>
            Космический объект типа "{getEdgeTypeName(edge.type)}" с ID:{" "}
            {edge.id}
          </p>
        </div>

        {tags.length > 0 && (
          <>
            {/* Boolean теги */}
            {tags.filter((tag) => tag.type === "boolean").length > 0 && (
              <div className="info-section">
                <h3>Boolean характеристики</h3>
                <div className="tags-container">
                  {tags
                    .filter((tag) => tag.type === "boolean")
                    .map((tag) => (
                      <div key={tag.id} className="tag-item">
                        <div className="tag-info">
                          <span className="tag-name">{tag.name}</span>
                          {tag.description && (
                            <span className="tag-description">
                              {tag.description}
                            </span>
                          )}
                        </div>
                        <div className="tag-value">
                          {getBooleanIndicator(tag.value as boolean)}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Числовые теги */}
            {tags.filter((tag) => tag.type === "number").length > 0 && (
              <div className="info-section">
                <h3>Числовые характеристики</h3>
                <div className="tags-container">
                  {tags
                    .filter((tag) => tag.type === "number")
                    .map((tag) => (
                      <div key={tag.id} className="tag-item">
                        <div className="tag-info">
                          <span className="tag-name">{tag.name}</span>
                          <span className="tag-type">({tag.type})</span>
                        </div>
                        <div className="tag-value">
                          <span className="numeric-value">{tag.value}</span>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </>
        )}

        <div className="navigation-section">
          <h3>Навигация</h3>
          <div className="nav-links">
            <Link
              to={`/currents/${edge.id}`}
              className="nav-link currents-link"
            >
              📊 Текущие значения
            </Link>
            <Link
              to={`/histories/${edge.id}`}
              className="nav-link histories-link"
            >
              📈 История изменений
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EdgeDetails;
