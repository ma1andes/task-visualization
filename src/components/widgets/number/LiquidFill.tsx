import React, { useMemo } from "react";
import ReactECharts from "echarts-for-react";
import WidgetContainer from "../common/BaseWidget";
import type { BaseWidgetProps } from "../common/BaseWidget";

const LiquidFill: React.FC<BaseWidgetProps> = ({ tag, className, style }) => {
  const value = tag.value as number;
  const maxValue = Math.max(1000, Math.ceil(value * 1.2));
  const normalizedValue = Math.max(value, 0);
  const percentage = (normalizedValue / maxValue) * 100;

  const option = useMemo(
    () => ({
      backgroundColor: "transparent",
      series: [
        {
          type: "pie",
          radius: ["60%", "90%"],
          center: ["50%", "50%"],
          startAngle: 90,
          data: [
            {
              value: percentage,
              name: "Заполнено",
              itemStyle: {
                color: {
                  type: "linear",
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [
                    { offset: 0, color: "#06b6d4" },
                    { offset: 0.5, color: "#0891b2" },
                    { offset: 1, color: "#0e7490" },
                  ],
                },
                shadowBlur: 10,
                shadowColor: "rgba(6, 182, 212, 0.4)",
              },
            },
            {
              value: 100 - percentage,
              name: "Пусто",
              itemStyle: {
                color: "#1f2937",
                borderColor: "#374151",
                borderWidth: 1,
              },
            },
          ],
          label: {
            show: false,
          },
          labelLine: {
            show: false,
          },
          animation: true,
          animationType: "scale",
          animationEasing: "elasticOut",
          animationDelay: 0,
        },
        // Внутренний круг с волновым эффектом
        {
          type: "pie",
          radius: ["0%", "55%"],
          center: ["50%", "50%"],
          data: [
            {
              value: 1,
              itemStyle: {
                color: {
                  type: "radial",
                  x: 0.5,
                  y: 0.5,
                  r: 0.5,
                  colorStops: [
                    { offset: 0, color: "rgba(6, 182, 212, 0.3)" },
                    { offset: 0.8, color: "rgba(6, 182, 212, 0.1)" },
                    { offset: 1, color: "transparent" },
                  ],
                },
              },
            },
          ],
          label: {
            show: false,
          },
          labelLine: {
            show: false,
          },
        },
      ],
      graphic: [
        // Центральный текст
        {
          type: "text",
          left: "center",
          top: "center",
          style: {
            text: `${value.toFixed(1)}`,
            fontSize: 20,
            fontWeight: "bold",
            fill: "#ffffff",
            textAlign: "center",
          },
          z: 10,
        },
        // Единицы измерения
        {
          type: "text",
          left: "center",
          top: "60%",
          style: {
            text: tag.unit || "ед.",
            fontSize: 12,
            fill: "#9ca3af",
            textAlign: "center",
          },
          z: 10,
        },
        // Процент заполнения
        {
          type: "text",
          left: "center",
          top: "70%",
          style: {
            text: `${percentage.toFixed(1)}%`,
            fontSize: 14,
            fill: "#06b6d4",
            textAlign: "center",
          },
          z: 10,
        },
        // Декоративные волны
        {
          type: "circle",
          shape: {
            cx: "50%",
            cy: "50%",
            r: "45%",
          },
          style: {
            stroke: "rgba(6, 182, 212, 0.3)",
            fill: "transparent",
            lineWidth: 2,
          },
          z: 5,
        },
      ],
    }),
    [value, percentage, maxValue, tag.unit]
  );

  return (
    <WidgetContainer
      tag={tag}
      className={`liquid-fill-widget ${className}`}
      style={style}
    >
      <ReactECharts
        option={option}
        style={{ width: "100%", height: "200px" }}
        notMerge={true}
      />
    </WidgetContainer>
  );
};

export default LiquidFill;
