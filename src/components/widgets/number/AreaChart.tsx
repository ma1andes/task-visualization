import React, { useMemo } from "react";
import ReactECharts from "echarts-for-react";
import WidgetContainer from "../common/BaseWidget";
import type { BaseWidgetProps } from "../common/BaseWidget";

const AreaChart: React.FC<BaseWidgetProps> = ({ tag, className, style }) => {
  const value = tag.value as number;

  // Генерируем историю значений для демонстрации
  const generateHistoryData = (currentValue: number) => {
    const points = 20;
    const data = [];
    const baseValue = currentValue;

    for (let i = 0; i < points; i++) {
      const variation =
        (Math.sin(i * 0.3) + Math.random() * 0.4 - 0.2) * baseValue * 0.3;
      const pointValue = Math.max(0, baseValue + variation);
      data.push(pointValue);
    }

    // Последняя точка - текущее значение
    data[points - 1] = currentValue;
    return data;
  };

  const historyData = useMemo(() => generateHistoryData(value), [value]);
  const xAxisData = Array.from({ length: 20 }, (_, i) => `-${19 - i}s`);

  const option = useMemo(
    () => ({
      backgroundColor: "transparent",
      grid: {
        left: "10%",
        right: "10%",
        top: "15%",
        bottom: "20%",
      },
      xAxis: {
        type: "category",
        data: xAxisData,
        axisLine: {
          lineStyle: {
            color: "#374151",
          },
        },
        axisLabel: {
          color: "#9ca3af",
          fontSize: 9,
          interval: 4,
        },
        axisTick: {
          show: false,
        },
      },
      yAxis: {
        type: "value",
        axisLine: {
          show: false,
        },
        axisTick: {
          show: false,
        },
        axisLabel: {
          color: "#9ca3af",
          fontSize: 10,
          formatter: (value: number) => {
            if (value >= 1000) return (value / 1000).toFixed(1) + "k";
            return value.toFixed(0);
          },
        },
        splitLine: {
          lineStyle: {
            color: "#374151",
            type: "dashed",
          },
        },
      },
      series: [
        {
          type: "line",
          data: historyData,
          smooth: true,
          symbol: "none",
          lineStyle: {
            width: 3,
            color: "#f97316",
          },
          areaStyle: {
            color: {
              type: "linear",
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                { offset: 0, color: "rgba(249, 115, 22, 0.6)" },
                { offset: 0.5, color: "rgba(249, 115, 22, 0.3)" },
                { offset: 1, color: "rgba(249, 115, 22, 0.1)" },
              ],
            },
          },
          emphasis: {
            focus: "series",
          },
          markPoint: {
            data: [
              {
                type: "max",
                name: "Макс",
                itemStyle: {
                  color: "#ef4444",
                },
                label: {
                  color: "#ffffff",
                  fontSize: 10,
                },
              },
            ],
          },
        },
      ],
      tooltip: {
        trigger: "axis",
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        borderColor: "#374151",
        textStyle: {
          color: "#ffffff",
        },
        formatter: (params: any) => {
          const data = params[0];
          return `Время: ${data.name}<br/>Значение: ${data.value.toFixed(2)} ${
            tag.unit || "ед."
          }`;
        },
      },
      graphic: [
        // Текущее значение
        {
          type: "text",
          right: "10%",
          top: "10%",
          style: {
            text: `${value.toFixed(1)} ${tag.unit || "ед."}`,
            fontSize: 14,
            fontWeight: "bold",
            fill: "#f97316",
            textAlign: "right",
          },
        },
      ],
    }),
    [historyData, xAxisData, value, tag.unit]
  );

  return (
    <WidgetContainer
      tag={tag}
      className={`area-chart-widget ${className}`}
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

export default AreaChart;
