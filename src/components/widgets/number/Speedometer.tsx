import React, { useMemo } from "react";
import ReactECharts from "echarts-for-react";
import WidgetContainer from "../common/BaseWidget";
import type { BaseWidgetProps } from "../common/BaseWidget";

const Speedometer: React.FC<BaseWidgetProps> = ({ tag, className, style }) => {
  const value = tag.value as number;
  const maxValue = Math.max(1000, Math.ceil(value * 1.2));
  // const normalizedValue = Math.max(value, 0);

  const option = useMemo(
    () => ({
      backgroundColor: "transparent",
      series: [
        {
          type: "gauge",
          center: ["50%", "75%"],
          radius: "90%",
          min: 0,
          max: maxValue,
          startAngle: 200,
          endAngle: -20,
          splitNumber: 8,
          data: [
            {
              value: value,
              name: "Скорость",
            },
          ],
          detail: {
            valueAnimation: true,
            formatter: (value: number) =>
              `{value|${value.toFixed(0)}}\n{unit|${tag.unit || "об/мин"}}`,
            rich: {
              value: {
                fontSize: 24,
                fontWeight: "bold",
                color: "#ffffff",
              },
              unit: {
                fontSize: 12,
                color: "#9ca3af",
                padding: [5, 0, 0, 0],
              },
            },
            offsetCenter: [0, "40%"],
          },
          axisLine: {
            lineStyle: {
              width: 20,
              color: [
                [0.2, "#22c55e"],
                [0.5, "#3b82f6"],
                [0.8, "#f59e0b"],
                [1, "#ef4444"],
              ],
            },
          },
          pointer: {
            itemStyle: {
              color: "#ffffff",
              shadowColor: "rgba(255, 255, 255, 0.8)",
              shadowBlur: 15,
            },
            length: "70%",
            width: 6,
          },
          axisTick: {
            distance: -20,
            length: 10,
            lineStyle: {
              color: "#ffffff",
              width: 2,
            },
          },
          splitLine: {
            distance: -25,
            length: 20,
            lineStyle: {
              color: "#ffffff",
              width: 4,
            },
          },
          axisLabel: {
            color: "#ffffff",
            distance: -40,
            fontSize: 12,
            formatter: (value: number) => {
              if (value === 0) return "0";
              if (value >= 1000) return (value / 1000).toFixed(0) + "k";
              return value.toString();
            },
          },
          title: {
            offsetCenter: [0, "20%"],
            fontSize: 14,
            color: "#9ca3af",
          },
          itemStyle: {
            shadowColor: "rgba(59, 130, 246, 0.6)",
            shadowBlur: 15,
          },
        },
        // Дополнительный внутренний круг для эффекта
        {
          type: "gauge",
          center: ["50%", "75%"],
          radius: "60%",
          min: 0,
          max: maxValue,
          startAngle: 200,
          endAngle: -20,
          splitNumber: 0,
          axisLine: {
            lineStyle: {
              width: 5,
              color: [[1, "#1f2937"]],
            },
          },
          axisTick: { show: false },
          splitLine: { show: false },
          axisLabel: { show: false },
          pointer: { show: false },
          detail: { show: false },
          data: [],
        },
      ],
    }),
    [value, maxValue, tag.unit]
  );

  return (
    <WidgetContainer
      tag={tag}
      className={`speedometer-widget ${className}`}
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

export default Speedometer;
