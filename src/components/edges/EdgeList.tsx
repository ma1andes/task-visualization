import React from "react";
import type { Edge } from "../../types";
import { getEdgeTypeIcon, getEdgeTypeName } from "../../utils/edgeUtils";
import "./EdgeList.css";

interface EdgeListProps {
  edges: Edge[];
  selectedEdgeId: string | null;
  onEdgeSelect: (edgeId: string) => void;
  isLoading?: boolean;
}

const EdgeList: React.FC<EdgeListProps> = ({
  edges,
  selectedEdgeId,
  onEdgeSelect,
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <div className="edge-list">
        <h2>Космические объекты</h2>
        <div className="loading">Загрузка...</div>
      </div>
    );
  }

  return (
    <div className="edge-list">
      <h2>Космические объекты</h2>
      <div className="edge-list-content">
        {edges.length === 0 ? (
          <div className="no-edges">Объекты не найдены</div>
        ) : (
          edges.map((edge) => (
            <div
              key={edge.id}
              className={`edge-item ${
                selectedEdgeId === edge.id ? "selected" : ""
              }`}
              onClick={() => onEdgeSelect(edge.id)}
            >
              <div className="edge-header">
                <span className="edge-icon">{getEdgeTypeIcon(edge.type)}</span>
                <div className="edge-info">
                  <h3 className="edge-name">{edge.name}</h3>
                  <span className="edge-type">
                    {getEdgeTypeName(edge.type)}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default EdgeList;
