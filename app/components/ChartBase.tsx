"use client"; // Required in Next.js App Router (if using React Server Components)

import dayjs from "dayjs";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export type ChartDataPoint = {
  x: Date;
  speed: number;
  altitude?: number;
  heartRate?: number;
};

const ChartBase = ({
  data,
  speedUnit,
  setHoveredTime: setSelectedTime,
  altUnit,
  hasAltitude,
  hasHeartRate,
}: {
  data: ChartDataPoint[];
  speedUnit: string;
  setHoveredTime: React.Dispatch<React.SetStateAction<Date | null>>;
  altUnit: string;
  hasAltitude: boolean;
  hasHeartRate: boolean;
}) => {
  const maxSpeed = Math.ceil(Math.max(...data.map((point) => point.speed)));
  const minAlt = Math.floor(
    Math.min(...data.map((point) => point.altitude || 0))
  );
  const maxAlt = Math.ceil(
    Math.max(...data.map((point) => point.altitude || 0))
  );
  const minHR = Math.floor(
    Math.min(...data.map((point) => point.heartRate || 0))
  );
  const maxHR = Math.ceil(
    Math.max(...data.map((point) => point.heartRate || 0))
  );

  return (
    <ResponsiveContainer width="100%" height={500}>
      <LineChart
        data={data}
        margin={{top: 30, right: 30, left: 30, bottom: 30}}
        onMouseDown={(props) => {
          setSelectedTime(props.activeLabel as unknown as Date);
        }}
      >
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis
          dataKey="x"
          tickFormatter={(tick, index) =>
            index % 10 === 0 ? dayjs(tick).format("DD.MM.YYYY - HH:mm:ss") : ""
          }
          textAnchor="end"
          height={150}
          angle={-45}
        />

        <YAxis
          yAxisId={"speed"}
          unit={speedUnit}
          domain={[0, maxSpeed]}
          width={150}
          orientation="left"
          color="#0000aa"
          label={{
            value: "Speed",
            angle: -90,
            position: "outsideLeft",
            color: "#0000aa",
          }}
        />
        {hasAltitude && (
          <YAxis
            yAxisId={"altitude"}
            unit={altUnit}
            domain={[minAlt, maxAlt]}
            width={150}
            orientation="right"
            color="#00aa00"
            label={{
              value: "Altitude",
              angle: -90,
              position: "outsideRight",
              color: "#00aa00",
            }}
          />
        )}
        {hasHeartRate && (
          <YAxis
            yAxisId={"heartRate"}
            unit={"bpm"}
            domain={[minHR, maxHR]}
            width={hasAltitude ? 0 : 150}
            orientation="right"
            display={hasAltitude ? "none" : "auto"}
            label={{
              value: "Heart Rate",
              angle: -90,
              position: "outsideRight",
              color: "#aa0000",
            }}
          />
        )}
        <Tooltip
          labelFormatter={(label) => new Date(label).toLocaleString()}
          labelStyle={{color: "#333"}}
        />

        <Legend />
        <Line
          type="monotone"
          dataKey="speed"
          yAxisId={"speed"}
          stroke="#0000aa"
          dot={false}
          name={"Speed"}
          unit={speedUnit}
        />
        {hasAltitude && (
          <Line
            type="monotone"
            dataKey="altitude"
            yAxisId={"altitude"}
            stroke="#00aa00"
            dot={false}
            name={"Altitude"}
            unit={altUnit}
          />
        )}
        {hasHeartRate && (
          <Line
            type="monotone"
            dataKey="heartRate"
            yAxisId={"heartRate"}
            stroke="#aa0000"
            dot={false}
            name={"Heart Rate"}
            unit={"bpm"}
          />
        )}
      </LineChart>
    </ResponsiveContainer>
  );
};

export default ChartBase;
