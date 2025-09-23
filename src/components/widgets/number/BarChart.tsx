import React, { useMemo } from "react";
import ReactECharts from "echarts-for-react";
import WidgetContainer from "../common/BaseWidget";
import type { BaseWidgetProps } from "../common/BaseWidget";

const BarChart: React.FC<BaseWidgetProps> = ({ tag, className, style }) => {
  const value = tag.value as number;
  const maxValue = Math.max(1000, Math.ceil(value * 1.2));

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
        data: ["Текущее значение"],
        axisLine: {
          lineStyle: {
            color: "#374151",
          },
        },
        axisLabel: {
          color: "#9ca3af",
          fontSize: 10,
        },
        axisTick: {
          show: false,
        },
      },
      yAxis: {
        type: "value",
        max: maxValue,
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
            if (value >= 1000) return (value / 1000).toFixed(0) + "k";
            return value.toString();
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
          type: "bar",
          data: [
            {
              value: value,
              itemStyle: {
                color: {
                  type: "linear",
                  x: 0,
                  y: 1,
                  x2: 0,
                  y2: 0,
                  colorStops: [
                    { offset: 0, color: "#059669" },
                    { offset: 0.5, color: "#10b981" },
                    { offset: 1, color: "#34d399" },
                  ],
                },
                shadowBlur: 10,
                shadowColor: "rgba(16, 185, 129, 0.4)",
                borderRadius: [4, 4, 0, 0],
              },
            },
          ],
          barWidth: "60%",
          label: {
            show: true,
            position: "top",
            formatter: (params: any) =>
              `${params.value.toFixed(1)} ${tag.unit || "ед."}`,
            color: "#ffffff",
            fontSize: 12,
            fontWeight: "bold",
          },
          animationDuration: 1000,
          animationEasing: "elasticOut",
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
          return `${data.name}<br/>${data.value.toFixed(2)} ${
            tag.unit || "ед."
          }`;
        },
      },
    }),
    [value, maxValue, tag.unit]
  );

  return (
    <WidgetContainer
      tag={tag}
      className={`bar-chart-widget ${className}`}
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

export default BarChart;
