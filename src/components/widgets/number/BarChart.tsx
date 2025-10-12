import React, { useMemo } from "react";
import ReactECharts from "echarts-for-react";
import WidgetContainer from "../common/BaseWidget";
import type { BaseWidgetProps } from "../common/BaseWidget";
import { normalizeColor, createBarGradient } from "../../../utils/colorUtils";

const BarChart: React.FC<BaseWidgetProps> = ({
  tag,
  params,
  className,
  style,
}) => {
  // Безопасное преобразование значения в число
  const rawValue = tag.value;
  const value = typeof rawValue === "number" ? rawValue : parseFloat(String(rawValue)) || 0;
  
  // Используем параметры из кастомизации или дефолтные значения
  const minValue = params?.min !== undefined ? Number(params.min) : 0;
  const maxValue = params?.max !== undefined 
    ? Number(params.max) 
    : Math.max(1000, Math.ceil(value * 1.2));
  
  // Используем цвет из кастомизации или дефолтный зеленый
  const chartColor = normalizeColor(params?.color as string | undefined, "#10b981");

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
        min: minValue,
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
                color: createBarGradient(chartColor),
                shadowBlur: 10,
                shadowColor: `${chartColor}66`, // 40% opacity
                borderRadius: [4, 4, 0, 0],
              },
            },
          ],
          barWidth: "60%",
          label: {
            show: true,
            position: "top",
            formatter: (params: { value: number | string }) => {
              const val = typeof params.value === "number" ? params.value : parseFloat(params.value) || 0;
              return `${val.toFixed(1)} ${tag.unit || "ед."}`;
            },
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
        formatter: (params: Array<{ name: string; value: number | string }>) => {
          const data = params[0];
          const val = typeof data.value === "number" ? data.value : parseFloat(data.value) || 0;
          return `${data.name}<br/>${val.toFixed(2)} ${tag.unit || "ед."}`;
        },
      },
    }),
    [value, minValue, maxValue, tag.unit, chartColor]
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
