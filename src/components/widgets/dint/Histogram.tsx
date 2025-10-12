import React, { useMemo } from "react";
import ReactECharts from "echarts-for-react";
import WidgetContainer from "../common/BaseWidget";
import type { BaseWidgetProps } from "../common/BaseWidget";

const Histogram: React.FC<BaseWidgetProps> = ({ tag, className, style }) => {
  const value = tag.value as number;

  // Генерируем данные гистограммы на основе текущего значения
  const generateHistogramData = (currentValue: number) => {
    const bins = 8;
    const data = [];
    const baseValue = currentValue / bins;

    for (let i = 0; i < bins; i++) {
      // Создаем распределение с пиком около текущего значения
      const binCenter = (i + 0.5) / bins;
      const currentCenter = Math.min(currentValue / 1000, 1);
      const distance = Math.abs(binCenter - currentCenter);
      const height = Math.max(
        1,
        Math.round(
          baseValue * Math.exp(-distance * 8) + Math.random() * baseValue * 0.3
        )
      );

      data.push({
        value: height,
        itemStyle: {
          color: distance < 0.2 ? "#84cc16" : "#374151",
        },
      });
    }

    return data;
  };

  const histogramData = useMemo(() => generateHistogramData(value), [value]);
  const xAxisData = Array.from({ length: 8 }, (_, i) => `Бин ${i + 1}`);

  const option = useMemo(
    () => ({
      backgroundColor: "transparent",
      grid: {
        left: "12%",
        right: "10%",
        top: "15%",
        bottom: "25%",
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
          rotate: 45,
        },
        axisTick: {
          show: false,
        },
      },
      yAxis: {
        type: "value",
        name: "Частота",
        nameTextStyle: {
          color: "#9ca3af",
          fontSize: 10,
        },
        axisLine: {
          show: false,
        },
        axisTick: {
          show: false,
        },
        axisLabel: {
          color: "#9ca3af",
          fontSize: 10,
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
          data: histogramData,
          barWidth: "70%",
          itemStyle: {
            borderRadius: [2, 2, 0, 0],
            shadowBlur: 5,
            shadowColor: "rgba(132, 204, 22, 0.3)",
          },
          emphasis: {
            itemStyle: {
              color: "#84cc16",
              shadowBlur: 10,
              shadowColor: "rgba(132, 204, 22, 0.6)",
            },
          },
          animationDuration: 1500,
          animationEasing: "elasticOut",
          animationDelay: (idx: number) => idx * 100,
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
          return `${data.name}<br/>Частота: ${
            data.value
          }<br/>Текущее значение: ${value.toFixed(1)} ${tag.unit || "ед."}`;
        },
      },
      graphic: [
        // Статистика
        {
          type: "text",
          right: "10%",
          top: "10%",
          style: {
            text: `Значение: ${value.toFixed(1)}`,
            fontSize: 12,
            fontWeight: "bold",
            fill: "#84cc16",
            textAlign: "right",
          },
        },
        {
          type: "text",
          right: "10%",
          top: "15%",
          style: {
            text: `Тип: DINT`,
            fontSize: 10,
            fill: "#9ca3af",
            textAlign: "right",
          },
        },
      ],
    }),
    [histogramData, xAxisData, value, tag.unit]
  );

  return (
    <WidgetContainer
      tag={tag}
      className={`histogram-widget ${className}`}
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

export default Histogram;
