import React, { useMemo } from "react";
import ReactECharts from "echarts-for-react";
import WidgetContainer from "../common/BaseWidget";
import type { BaseWidgetProps } from "../common/BaseWidget";

const Thermometer: React.FC<BaseWidgetProps> = ({ tag, className, style }) => {
  const value = tag.value as number;
  const maxValue = Math.max(1000, Math.ceil(value * 1.2));
  const normalizedValue = Math.max(value, 0);
  const percentage = (normalizedValue / maxValue) * 100;

  const option = useMemo(
    () => ({
      backgroundColor: "transparent",
      grid: {
        left: "15%",
        right: "15%",
        top: "10%",
        bottom: "15%",
      },
      xAxis: {
        type: "value",
        show: false,
        min: 0,
        max: 100,
      },
      yAxis: {
        type: "value",
        show: false,
        min: 0,
        max: 100,
      },
      series: [
        // Фон термометра
        {
          type: "bar",
          data: [100],
          barWidth: "60%",
          itemStyle: {
            color: "#1f2937",
            borderColor: "#374151",
            borderWidth: 2,
          },
          z: 1,
          coordinateSystem: "cartesian2d",
          xAxisIndex: 0,
          yAxisIndex: 0,
        },
        // Заполнение термометра
        {
          type: "bar",
          data: [percentage],
          barWidth: "60%",
          itemStyle: {
            color: {
              type: "linear",
              x: 0,
              y: 1,
              x2: 0,
              y2: 0,
              colorStops: [
                { offset: 0, color: "#1e40af" },
                { offset: 0.3, color: "#3b82f6" },
                { offset: 0.7, color: "#60a5fa" },
                { offset: 1, color: "#93c5fd" },
              ],
            },
            shadowBlur: 10,
            shadowColor: "rgba(59, 130, 246, 0.4)",
          },
          z: 2,
          coordinateSystem: "cartesian2d",
          xAxisIndex: 0,
          yAxisIndex: 0,
        },
      ],
      graphic: [
        // Значение в центре
        {
          type: "text",
          left: "center",
          top: "middle",
          style: {
            text: `${value.toFixed(1)}\n${tag.unit || "ед."}`,
            fontSize: 16,
            fontWeight: "bold",
            fill: "#ffffff",
            textAlign: "center",
          },
          z: 10,
        },
        // Шкала справа
        ...Array.from({ length: 11 }, (_, i) => {
          const scaleValue = Math.round((maxValue / 10) * (10 - i));
          return {
            type: "text",
            right: "5%",
            top: `${10 + (i / 10) * 70}%`,
            style: {
              text: scaleValue.toString(),
              fontSize: 10,
              fill: "#9ca3af",
              textAlign: "left",
            },
          };
        }),
      ],
    }),
    [value, percentage, maxValue, tag.unit]
  );

  return (
    <WidgetContainer
      tag={tag}
      className={`thermometer-widget ${className}`}
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

export default Thermometer;
