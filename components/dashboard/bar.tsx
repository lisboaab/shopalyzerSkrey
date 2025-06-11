import React from "react";
import { useState, useEffect } from "react";
import {
  VictoryChart,
  VictoryTooltip,
  VictoryBar,
  VictoryVoronoiContainer,
  VictoryTheme,
} from "victory";

interface ListProps {
  label: string;
  value: any[];
}

interface ChartData {
  x: string;
  y: number;
}

const customTheme = {
  bar: {
    style: {
      data: {
        fillOpacity: 3,
        fill: "#007aff",
        width: 1,
        padding: 10,
      },
      labels: {
        fill: "#222",
        fontSize: 16,
        padding: 1,
        outerWidth: 1,
      },
    },
    axis: {
      style: {
        grid: { stroke: "none" },
        axis: {
          stroke: "#333",
          strokeWidth: 2,
          paddingLeft: 10,
        },
        ticks: {
          stroke: "#555",
          size: 5,
        },
        tickLabels: {
          fill: "#222",
          fontSize: 12,
          padding: 5,
        },
      },
    },
  },
};

const colors = ["#0D0DFC", "#B4CDFF", "#0B0C5B", "#B4CDFF", "#12179D"];


const Bar: React.FC<ListProps> = ({ label, value }) => {
  const [data, setData] = useState<ChartData[]>([]);

  useEffect(() => {
    if (!Array.isArray(value)) return;

    const chartData = value.map((item) => ({
      x: item.item || "Unknown",
      y: parseInt(item.totalQuantity) || 0,
    }));

    setData(chartData);
  }, [value]);
  // console.log(data);
  if (!data.length) {
    return (
      <div>
        <p className="gellix-semibold mb-3 text-xl">{label}</p>
        <p>No data available</p>
      </div>
    );
  }

  return (
    <div className="min-w-200">
      <p className="gellix-semibold mb-3 text-xl">{label}</p>
      <div className="flex flex-col gap-5">
        {/* h-120 w-full */}
        <VictoryChart
          theme={customTheme.bar}
          domainPadding={{ x: 40, y: 0 }}
          height={300}
          width={1000}
          containerComponent={
            <VictoryVoronoiContainer
              voronoiDimension="x"
              labels={({ datum }) => `${datum.y}`}
              labelComponent={<VictoryTooltip />}
            />
          }
        >
          <VictoryBar
            width={100}
            height={10}
            data={value}
            cornerRadius={{ top: 8 }}
            style={{
              data: {
                fill: ({ index }) => colors[(typeof index === "number" ? index : 0) % colors.length],
              },
              labels: {
                fill: "white",
                fontSize: 12,
                padding: 6,
              },
            }}
          />
        </VictoryChart>
      </div>
    </div>
  );
};

export default Bar;
