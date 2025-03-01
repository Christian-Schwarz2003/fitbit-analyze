"use client"; // Ensure this runs only on the client-side

import {useCallback, useEffect, useMemo, useRef, useState} from "react";
import {GoogleMap, LoadScript, Marker, Polyline} from "@react-google-maps/api";
import {PointInfo, RoutePoint} from "../page";
import dayjs from "dayjs";

const mapContainerStyle = {
  width: "75svw",
  height: "75svh",
  margin: "2rem auto",
};

const RouteMap = ({
  routeData,
  metric = true,
  hoveredTime,
}: {
  routeData: RoutePoint[];
  metric?: boolean;
  hoveredTime: Date | null;
}) => {
  const [hoverInfo, setHoverInfo] = useState<PointInfo | null>(null);
  const infoBoxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (infoBoxRef.current && hoverInfo) {
        infoBoxRef.current.style.left = `${event.clientX + 15}px`;
        infoBoxRef.current.style.top = `${event.clientY + 15}px`;
        infoBoxRef.current.style.visibility = "visible";
      }
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [hoverInfo]);

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  const linesWithData = useMemo(
    () =>
      routeData
        .map((point, index) => {
          if (index === 0) {
            return null;
          }
          const prevPoint = routeData[index - 1];
          if (prevPoint) {
            return (
              <Polyline
                key={index}
                path={[prevPoint, point]}
                options={{
                  strokeOpacity: 0,
                  strokeWeight: 20,
                  clickable: true,
                }}
                onMouseOver={() => setHoverInfo(point.info)}
                onMouseOut={() => setHoverInfo(null)}
              />
            );
          }
          return null;
        })
        .filter(Boolean),
    [routeData]
  );

  const getDetails = useCallback(
    (info: PointInfo) => {
      return (
        <>
          <p>Time: {dayjs(info.time).format("DD.MM.YYYY - HH:mm:ss")}</p>
          {info.heartRate && <p>HR: {info.heartRate} bpm</p>}

          {metric ? (
            <>
              <div>Total Distance: {info.distance.toFixed(1)} m</div>
              {info.altitude && <p>Altitude: {info.altitude.toFixed(1)} m</p>}
              <div>
                Speed/Pace:
                <div style={{marginLeft: "1rem"}}>
                  {info.speed.toFixed(2)} m/s
                </div>
                <div style={{marginLeft: "1rem"}}>
                  {(info.speed * 3.6).toFixed(2)} km/h
                </div>
                <div style={{marginLeft: "1rem"}}>
                  {(60 / (info.speed * 3.6)).toFixed(2)} min/km
                </div>
              </div>
            </>
          ) : (
            <>
              <div>
                Total Distance: {(info.distance * 0.000621371).toFixed(4)} mi
              </div>
              {info.altitude && (
                <div>Altitude: {(info.altitude * 3.28084).toFixed(1)} ft</div>
              )}
              <div>
                Speed/Pace:
                <div style={{marginLeft: "1rem"}}>
                  {(info.speed * 3.28084).toFixed(2)} ft/s
                </div>
                <div style={{marginLeft: "1rem"}}>
                  {(info.speed * 2.23694).toFixed(2)} mph
                </div>
                <div style={{marginLeft: "1rem"}}>
                  {(60 / (info.speed * 2.23694)).toFixed(2)} min/mi
                </div>
              </div>
            </>
          )}
        </>
      );
    },
    [metric]
  );
  if (!apiKey) {
    return <div>API key not found</div>;
  }

  return (
    <div style={{position: "relative"}}>
      {/* Metadata Hover Box */}
      {hoverInfo && (
        <div
          ref={infoBoxRef}
          style={{
            position: "fixed",
            background: "white",
            color: "black",
            padding: "8px",
            border: "1px solid black",
            borderRadius: "5px",
            visibility: "hidden",
            zIndex: 100,
            pointerEvents: "none",
          }}
        >
          {getDetails(hoverInfo)}
        </div>
      )}

      {/* Google Maps */}
      <LoadScript googleMapsApiKey={apiKey}>
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={routeData[0]}
          zoom={15}
          options={{fullscreenControl: false}}
        >
          {/* Route Line */}
          <Polyline
            path={routeData}
            options={{
              strokeColor: "#FF0000",
              strokeOpacity: 1.0,
              strokeWeight: 4,
            }}
          />

          {linesWithData}

          {hoveredTime && (
            <Marker
              position={
                routeData.find((point) => point.info.time === hoveredTime) ||
                routeData[0]
              }
              icon={{
                url: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
              }}
            />
          )}

          {/* Start Marker */}
          <Marker
            position={routeData[0]}
            icon={{
              url: "https://maps.google.com/mapfiles/ms/icons/green-dot.png",
            }}
          />
          {/* End Marker */}
          <Marker
            position={routeData[routeData.length - 1]}
            icon={{
              url: "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
            }}
          />
        </GoogleMap>
      </LoadScript>
    </div>
  );
};

export default RouteMap;
