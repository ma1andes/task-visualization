import React, { useMemo } from "react";
import ReactECharts from "echarts-for-react";
import WidgetContainer from "../common/BaseWidget";
import type { BaseWidgetProps } from "../common/BaseWidget";

const Gauge: React.FC<BaseWidgetProps> = ({ tag, className, style }) => {
  const value = tag.value as number;
  // Динамически определяем максимальное значение на основе текущего значения
  const maxValue = Math.max(1000, Math.ceil(value * 1.2)); // Минимум 1000, или на 20% больше текущего значения
  // const normalizedValue = Math.max(value, 0); // Убираем ограничение сверху

  const option = useMemo(
    () => ({
      backgroundColor: "transparent",
      series: [
        {
          type: "gauge",
          center: ["50%", "60%"],
          radius: "90%",
          min: 0,
          max: maxValue,
          splitNumber: 10,
          data: [
            {
              value: value, // Используем реальное значение
              name: tag.unit || "ед.",
            },
          ],
          detail: {
            valueAnimation: true,
            formatter: (value: number) =>
              `{value|${value.toFixed(1)}}\n{unit|${tag.unit || "ед."}}`,
            rich: {
              value: {
                fontSize: 20,
                fontWeight: "bold",
                color: "#ffffff",
              },
              unit: {
                fontSize: 12,
                color: "#9ca3af",
                padding: [5, 0, 0, 0],
              },
            },
            offsetCenter: [0, "70%"],
          },
          axisLine: {
            lineStyle: {
              width: 15,
              color: [
                [0.3, "#22c55e"],
                [0.7, "#f59e0b"],
                [1, "#ef4444"],
              ],
            },
          },
          pointer: {
            itemStyle: {
              color: "#ffffff",
              shadowColor: "rgba(255, 255, 255, 0.5)",
              shadowBlur: 10,
            },
            length: "75%",
            width: 4,
          },
          axisTick: {
            distance: -15,
            length: 8,
            lineStyle: {
              color: "#ffffff",
              width: 2,
            },
          },
          splitLine: {
            distance: -20,
            length: 15,
            lineStyle: {
              color: "#ffffff",
              width: 3,
            },
          },
          axisLabel: {
            color: "#ffffff",
            distance: -35,
            fontSize: 10,
            formatter: (value: number) => {
              if (value === 0) return "0";
              if (value >= 1000) return (value / 1000).toFixed(0) + "k";
              return value.toString();
            },
          },
          title: {
            show: false,
          },
          itemStyle: {
            shadowColor: "rgba(59, 130, 246, 0.4)",
            shadowBlur: 10,
          },
        },
      ],
    }),
    [value, maxValue, tag.unit]
  );

  return (
    <WidgetContainer
      tag={tag}
      className={`gauge-widget ${className}`}
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

export default Gauge;
