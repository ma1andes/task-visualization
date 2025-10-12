import React, { useMemo } from "react";
import ReactECharts from "echarts-for-react";
import WidgetContainer from "../common/BaseWidget";
import type { BaseWidgetProps } from "../common/BaseWidget";

const RadarChart: React.FC<BaseWidgetProps> = ({ tag, className, style }) => {
  const value = tag.value as number;

  // Генерируем многомерные данные на основе текущего значения
  const generateRadarData = (currentValue: number) => {
    const maxVal = 1000;
    const normalizedValue = Math.min(currentValue, maxVal);

    // Создаем 6 измерений с вариациями от основного значения
    const baseRatio = normalizedValue / maxVal;

    return [
      Math.round(baseRatio * maxVal * (0.8 + Math.random() * 0.4)), // Производительность
      Math.round(baseRatio * maxVal * (0.9 + Math.random() * 0.2)), // Эффективность
      Math.round(baseRatio * maxVal * (0.7 + Math.random() * 0.6)), // Надежность
      Math.round(baseRatio * maxVal * (0.85 + Math.random() * 0.3)), // Качество
      Math.round(baseRatio * maxVal * (0.75 + Math.random() * 0.5)), // Скорость
      Math.round(baseRatio * maxVal * (0.95 + Math.random() * 0.1)), // Стабильность
    ];
  };

  const radarData = useMemo(() => generateRadarData(value), [value]);

  const option = useMemo(
    () => ({
      backgroundColor: "transparent",
      radar: {
        center: ["50%", "55%"],
        radius: "70%",
        indicator: [
          { name: "Производительность", max: 1000, color: "#9ca3af" },
          { name: "Эффективность", max: 1000, color: "#9ca3af" },
          { name: "Надежность", max: 1000, color: "#9ca3af" },
          { name: "Качество", max: 1000, color: "#9ca3af" },
          { name: "Скорость", max: 1000, color: "#9ca3af" },
          { name: "Стабильность", max: 1000, color: "#9ca3af" },
        ],
        shape: "polygon",
        splitNumber: 4,
        name: {
          textStyle: {
            color: "#9ca3af",
            fontSize: 10,
          },
        },
        splitLine: {
          lineStyle: {
            color: "#374151",
            width: 1,
          },
        },
        splitArea: {
          show: true,
          areaStyle: {
            color: [
              "rgba(248, 113, 113, 0.05)",
              "rgba(251, 191, 36, 0.05)",
              "rgba(34, 197, 94, 0.05)",
              "rgba(59, 130, 246, 0.05)",
            ],
          },
        },
        axisLine: {
          lineStyle: {
            color: "#374151",
          },
        },
      },
      series: [
        {
          type: "radar",
          data: [
            {
              value: radarData,
              name: "Текущие показатели",
              itemStyle: {
                color: "#f43f5e",
              },
              lineStyle: {
                color: "#f43f5e",
                width: 3,
              },
              areaStyle: {
                color: "rgba(244, 63, 94, 0.3)",
              },
              symbol: "circle",
              symbolSize: 6,
              emphasis: {
                lineStyle: {
                  width: 4,
                },
                itemStyle: {
                  color: "#ffffff",
                  borderColor: "#f43f5e",
                  borderWidth: 2,
                },
              },
            },
          ],
          animationDuration: 2000,
          animationEasing: "elasticOut",
        },
      ],
      tooltip: {
        trigger: "item",
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        borderColor: "#374151",
        textStyle: {
          color: "#ffffff",
        },
        formatter: (params: any) => {
          const indicators = [
            "Производительность",
            "Эффективность",
            "Надежность",
            "Качество",
            "Скорость",
            "Стабильность",
          ];

          let result = `${params.name}<br/>`;
          params.value.forEach((val: number, idx: number) => {
            result += `${indicators[idx]}: ${val}<br/>`;
          });
          result += `Базовое значение: ${value.toFixed(1)} ${
            tag.unit || "ед."
          }`;

          return result;
        },
      },
      graphic: [
        // Центральное значение
        {
          type: "text",
          left: "center",
          top: "center",
          style: {
            text: value.toFixed(0),
            fontSize: 18,
            fontWeight: "bold",
            fill: "#f43f5e",
            textAlign: "center",
          },
          z: 10,
        },
        // Единицы измерения
        {
          type: "text",
          left: "center",
          top: "58%",
          style: {
            text: tag.unit || "ед.",
            fontSize: 10,
            fill: "#9ca3af",
            textAlign: "center",
          },
          z: 10,
        },
      ],
    }),
    [radarData, value, tag.unit]
  );

  return (
    <WidgetContainer
      tag={tag}
      className={`radar-chart-widget ${className}`}
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

export default RadarChart;
