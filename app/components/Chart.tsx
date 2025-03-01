"use client";
import React, {JSX, useCallback, useState} from "react";
import {RoutePoint} from "../page";
import ChartBase from "./ChartBase";

const Chart = ({
  data,
  metric,
  setSelectedTime,
}: {
  data: RoutePoint[];
  metric: boolean;
  setSelectedTime: React.Dispatch<React.SetStateAction<Date | null>>;
}): JSX.Element => {
  const [unit, setUnit] = useState<string>(metric ? "km/h" : "mph");

  const convert = useCallback(
    (value: number) => {
      switch (unit) {
        case "m/s":
          return value;
        case "km/h":
          return value * 3.6;
        case "mph":
          return value * 2.23694;
        case "ft/s":
          return value * 3.28084;
        default:
          return value;
      }
    },
    [unit]
  );
  const rounded = useCallback(
    (value: number) => Math.round(value * 100) / 100,
    []
  );

  return (
    <div>
      <select
        onChange={(e) => setUnit(e.target.value)}
        style={{margin: "auto", display: "block"}}
        defaultValue={metric ? "km/h" : "mph"}
      >
        <option value="m/s">m/s</option>
        <option value="km/h">km/h</option>
        <option value="ft/s">ft/s</option>
        <option value="mph">mph</option>
      </select>
      <ChartBase
        data={data.map((point) => ({
          x: point.info.time,
          speed: rounded(convert(point.info.speed)),
          altitude: rounded(
            metric
              ? point.info.altitude || 0
              : (point.info.altitude || 0) * 3.28084
          ),
          heartRate: rounded(point.info.heartRate || 0),
        }))}
        speedUnit={unit}
        altUnit={metric ? "m" : "ft"}
        setHoveredTime={setSelectedTime}
        hasHeartRate={data[1].info.heartRate !== undefined}
        hasAltitude={data[1].info.altitude !== undefined}
      />
    </div>
  );
};

export default Chart;
