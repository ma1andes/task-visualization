import React, { useMemo } from "react";
import ReactECharts from "echarts-for-react";
import WidgetContainer from "../common/BaseWidget";
import type { BaseWidgetProps } from "../common/BaseWidget";
import { normalizeColor, createAreaGradient } from "../../../utils/colorUtils";

interface HistoryPoint {
  timestamp?: number | string;
  time?: number | string;
  t?: number | string;
  ts?: number | string;
  value?: number;
  v?: number;
}

const AreaChart: React.FC<BaseWidgetProps> = ({
  tag,
  params,
  historyData,
  className,
  style,
}) => {
  const value = tag.value as number;
  
  // Используем параметры из кастомизации для настройки диапазона
  const minValue = params?.min !== undefined ? Number(params.min) : undefined;
  const maxValue = params?.max !== undefined ? Number(params.max) : undefined;
  
  // Используем цвет из кастомизации или дефолтный оранжевый
  const chartColor = normalizeColor(params?.color as string | undefined, "#f97316");

  // Извлекаем историю для этого тега из API
  const { chartData, xAxisData } = useMemo(() => {
    if (!historyData || !historyData[tag.id]) {
      // Если нет истории - показываем только текущее значение
      return {
        chartData: [value],
        xAxisData: ["Сейчас"],
      };
    }

    const tagHistory = historyData[tag.id];
    if (!Array.isArray(tagHistory) || tagHistory.length === 0) {
      return {
        chartData: [value],
        xAxisData: ["Сейчас"],
      };
    }

    // Берём последние 20 точек
    const points = tagHistory.slice(-20) as HistoryPoint[];
    const values = points.map((p: HistoryPoint) => {
      const val = p?.value ?? p?.v ?? null;
      return typeof val === "number" ? val : 0;
    });

    // Форматируем временные метки
    const timestamps = points.map((p: HistoryPoint, idx: number) => {
      const rawTs = p?.timestamp ?? p?.time ?? p?.t ?? p?.ts;
      if (!rawTs) return `t${idx}`;
      
      const ts = typeof rawTs === "number" ? rawTs : Date.parse(String(rawTs));
      if (!Number.isFinite(ts)) return `t${idx}`;
      
      const date = new Date(ts);
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");
      const seconds = String(date.getSeconds()).padStart(2, "0");
      return `${hours}:${minutes}:${seconds}`;
    });

    return {
      chartData: values,
      xAxisData: timestamps,
    };
  }, [historyData, tag.id, value]);

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
        ...(minValue !== undefined && { min: minValue }),
        ...(maxValue !== undefined && { max: maxValue }),
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
          data: chartData,
          smooth: true,
          symbol: "none",
          lineStyle: {
            width: 3,
            color: chartColor,
          },
          areaStyle: {
            color: createAreaGradient(chartColor),
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
        formatter: (params: unknown) => {
          const paramsArray = params as Array<{ name: string; value: number }>;
          const data = paramsArray[0];
          const val = typeof data.value === "number" ? data.value : 0;
          return `Время: ${data.name}<br/>Значение: ${val.toFixed(2)} ${
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
    [chartData, xAxisData, value, minValue, maxValue, tag.unit, chartColor]
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
