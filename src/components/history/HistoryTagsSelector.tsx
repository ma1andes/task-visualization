import React from "react";
import type { Tag } from "../../types";
import "../common/TagSelector.css";

interface HistoryTagsSelectorProps {
  tags: Tag[];
  selectedTags: string[];
  colorMap: Record<string, string>;
  onTagToggle: (tagId: string) => void;
  onSelectAll: () => void;
  onDeselectAll: () => void;
}

const HistoryTagsSelector: React.FC<HistoryTagsSelectorProps> = ({
  tags,
  selectedTags,
  colorMap,
  onTagToggle,
  onSelectAll,
  onDeselectAll,
}) => {
  const selectedCount = selectedTags.length;
  const totalCount = tags.length;

  return (
    <div className="tag-selector">
      <div className="tag-selector-header">
        <h2 className="tag-selector-title">Теги для графиков</h2>
        <div className="tag-selector-stats">
          {selectedCount} из {totalCount} выбрано
        </div>
      </div>

      <div className="tag-selector-controls">
        <button
          className="control-button select-all"
          onClick={onSelectAll}
          disabled={selectedCount === totalCount}
        >
          Выбрать все
        </button>
        <button
          className="control-button deselect-all"
          onClick={onDeselectAll}
          disabled={selectedCount === 0}
        >
          Снять все
        </button>
      </div>

      <div className="tag-list">
        {tags.map((tag) => {
          const isSelected = selectedTags.includes(tag.id);
          return (
            <div
              key={tag.id}
              className={`tag-item ${isSelected ? "selected" : ""}`}
              onClick={() => onTagToggle(tag.id)}
            >
              <div className="tag-checkbox">
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={(e) => {
                    e.stopPropagation();
                    onTagToggle(tag.id);
                  }}
                  className="checkbox-input"
                />
                <div className="checkbox-custom">
                  {isSelected && <div className="checkbox-checkmark">✓</div>}
                </div>
              </div>

              <div className="tag-info">
                <div className="tag-name">
                  <span
                    style={{
                      display: "inline-block",
                      width: 10,
                      height: 10,
                      borderRadius: 2,
                      background: colorMap[tag.id] || "#8884d8",
                      marginRight: 8,
                    }}
                  />
                  {tag.name}
                </div>
                <div className="tag-meta">
                  <span className="tag-type">{tag.type}</span>
                  {tag.unit && <span className="tag-unit">{tag.unit}</span>}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HistoryTagsSelector;
