import React from "react";
import type { Tag } from "../../../types";
import type { WidgetParams } from "../../../types/customization";
import BaseWidget from "./BaseWidget";

interface ImageWidgetProps {
  tag: Tag;
  imageUrl: string;
  params?: WidgetParams;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Виджет для отображения картинок из кастомизации
 */
const ImageWidget: React.FC<ImageWidgetProps> = ({
  tag,
  imageUrl,
  params,
  className,
  style,
}) => {
  // Извлекаем размеры из параметров если есть
  const width = params?.width;
  const height = params?.height;

  const imageStyle: React.CSSProperties = {
    maxWidth: "100%",
    maxHeight: "100%",
    objectFit: "contain",
    ...(width && { width: `${width}px` }),
    ...(height && { height: `${height}px` }),
  };

  return (
    <BaseWidget
      tag={tag}
      className={className}
      style={style}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          height: "100%",
          padding: "10px",
        }}
      >
        <img
          src={imageUrl}
          alt={tag.name}
          style={imageStyle}
          onError={(e) => {
            // Обработка ошибки загрузки картинки
            const target = e.target as HTMLImageElement;
            target.style.display = "none";
            const errorText = document.createElement("div");
            errorText.textContent = "Не удалось загрузить изображение";
            errorText.style.color = "#ef4444";
            errorText.style.textAlign = "center";
            target.parentElement?.appendChild(errorText);
          }}
        />
      </div>
    </BaseWidget>
  );
};

export default ImageWidget;
