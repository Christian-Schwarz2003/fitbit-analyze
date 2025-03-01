"use client";
import {useState} from "react";
import FileParser from "./components/FileParser";
import DataDisplay from "./components/DataDisplay";
import Explainer from "./components/Explainer";

export type PointInfo = {
  time: Date;
  distance: number;
  speed: number;
  altitude?: number;
  heartRate?: number;
};
export type RoutePoint = {lat: number; lng: number; info: PointInfo};

export default function Home() {
  const [routeData, setRouteData] = useState<RoutePoint[]>([]);
  const [metric, setMetric] = useState(true);
  return (
    <>
      <h1 style={{textAlign: "center", marginBottom: "2rem"}}>Route Map</h1>
      <Explainer />
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "10px",
          marginBottom: "2rem",
        }}
      >
        <FileParser setRouteData={setRouteData} />
        <select
          defaultValue={"metric"}
          onChange={(e) => setMetric(e.target.value === "metric")}
        >
          <option value="metric">Metric</option>
          <option value="imperial">Imperial</option>
        </select>
      </div>
      {routeData.length > 0 && (
        <DataDisplay routeData={routeData} metric={metric} />
      )}
    </>
  );
}
