import React from "react";
import { useState, useEffect } from "react";
import { VictoryPie, VictoryTooltip } from "victory";

interface ListProps {
  label: string;
  value: any[];
}

interface ChartData {
  x: string;
  y: number;
}

const customTheme = {
  pie: {
    style: {
      data: {
        fillOpacity: 0.9,
      },
      labels: {
        fill: "red",
        fontSize: 20,
        // padding: 12,
        outerWidth: 5,
      },
    },
    colorScale: ["#0D0DFC", "#B4CDFF", "#0B0C5B", "#B4CDFF", "#12179D"],
  },
};

const Donut: React.FC<ListProps> = ({ label, value }) => {
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
    <div className="min-w-150 max-w-180 justify-center items-center">
      <p className="gellix-semibold mb-3 text-xl">{label}</p>
      <div className="flex flex-col gap-5 justify-center">
        {/* <span className=" bg-red-500"> */}
        <VictoryPie
          data={data}
          theme={customTheme}
          innerRadius={60}
          padAngle={5}
          labelComponent={
            <VictoryTooltip
              className="gellix"
              style={{ fontSize: "9px", fill: "#0D0DFC", padding: 2 }}
              flyoutStyle={{
                fill: "transparent",
                stroke: "none",
              }}
              cornerRadius={20}
              pointerLength={0}
            />
          }
          labels={({ datum }) => {
            const maxLength = 20;
            const label = `${datum.x}:  ${datum.y}`;
            return label.length > maxLength
              ? label.slice(0, maxLength - 5) + `...:  ${datum.y} `
              : label;
          }}
          height={250}
        />
        {/* </span> */}
        <div>
          {Array.isArray(value) &&
            value.map((item: any, index: number) => (
              <div
                key={`${label}-${index}`}
                className="flex flex-row justify-between text-lg hover:bg-gray-200 p-3 hover:rounded"
              >
                <p className="gellix">{item.item}</p>
                <p className="gellix-semibold main">{item.totalQuantity}</p>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Donut;
