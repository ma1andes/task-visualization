import React from "react";
import type { Tag } from "../../types";
import "./TagSelector.css";

interface TagSelectorProps {
  tags: Tag[];
  selectedTags: string[];
  onTagToggle: (tagId: string) => void;
  onSelectAll: () => void;
  onDeselectAll: () => void;
}

const TagSelector: React.FC<TagSelectorProps> = ({
  tags,
  selectedTags,
  onTagToggle,
  onSelectAll,
  onDeselectAll,
}) => {
  const selectedCount = selectedTags.length;
  const totalCount = tags.length;

  return (
    <div className="tag-selector">
      <div className="tag-selector-header">
        <h2 className="tag-selector-title">Параметры</h2>
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
          const tagTypeClass = `tag-type-${tag.type}`;

          return (
            <div
              key={tag.id}
              className={`tag-item ${tagTypeClass} ${
                isSelected ? "selected" : ""
              }`}
              onClick={() => onTagToggle(tag.id)}
            >
              <div className="tag-checkbox">
                <input
                  type="checkbox"
                  checked={isSelected}
                  readOnly
                  className="checkbox-input"
                />
                <div className="checkbox-custom">
                  {isSelected && <div className="checkbox-checkmark">✓</div>}
                </div>
              </div>

              <div className="tag-info">
                <div className="tag-name">{tag.name}</div>
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

export default TagSelector;
