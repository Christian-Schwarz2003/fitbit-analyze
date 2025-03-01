import React from "react";
import {RoutePoint} from "../page";
import RouteMap from "./RouteMap";
import Chart from "./Chart";

const DataDisplay = ({
  routeData,
  metric = true,
}: {
  routeData: RoutePoint[];
  metric?: boolean;
}) => {
  const [selectedTime, setSelectedTime] = React.useState<Date | null>(null);
  return (
    <>
      <RouteMap
        routeData={routeData}
        metric={metric}
        hoveredTime={selectedTime}
      />
      <Chart
        data={routeData}
        metric={metric}
        setSelectedTime={setSelectedTime}
      />
    </>
  );
};

export default DataDisplay;
