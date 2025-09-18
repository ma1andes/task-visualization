import React, { useState } from "react";
import { useEdges, useEdgeDetails } from "../api/edges";
import EdgeList from "../components/EdgeList";
import EdgeDetails from "../components/EdgeDetails";
import "./EdgesPage.css";

const EdgesPage: React.FC = () => {
  const [selectedEdgeId, setSelectedEdgeId] = useState<string | null>(null);

  // Загружаем список всех edges
  const {
    data: edgesData,
    isLoading: edgesLoading,
    error: edgesError,
    isFetching: edgesFetching,
  } = useEdges();

  // Загружаем детали выбранного edge
  const {
    data: edgeDetails,
    isLoading: edgeLoading,
    isFetching: edgeFetching,
  } = useEdgeDetails(selectedEdgeId || "");

  const handleEdgeSelect = (edgeId: string) => {
    setSelectedEdgeId(edgeId);
  };

  if (edgesError) {
    return (
      <div className="edges-page">
        <div className="error-message">
          <h2>Ошибка загрузки данных</h2>
          <p>Не удалось загрузить список космических объектов.</p>
          <p>
            Проверьте подключение к интернету и попробуйте обновить страницу.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="edges-page">
      {/* Индикатор обновления данных */}
      {(edgesFetching || edgeFetching) && (
        <div className="update-indicator">
          <div className="spinner"></div>
          <span>Обновление данных...</span>
        </div>
      )}

      <div className="edges-layout">
        {/* Левая панель - список edges */}
        <div className="left-panel">
          <EdgeList
            edges={edgesData && "edges" in edgesData ? edgesData.edges : []}
            selectedEdgeId={selectedEdgeId}
            onEdgeSelect={handleEdgeSelect}
            isLoading={edgesLoading}
          />
        </div>

        {/* Правая панель - детали выбранного edge */}
        <div className="right-panel">
          <EdgeDetails
            edge={edgeDetails?.edge || null}
            tags={edgeDetails?.tags || []}
            isLoading={edgeLoading}
          />
        </div>
      </div>
    </div>
  );
};

export default EdgesPage;
