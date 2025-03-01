"use client";

import {useCallback, useEffect, useState} from "react";
import {XMLParser} from "fast-xml-parser";
import {RoutePoint} from "../page";

type Trackpoint = {
  Time: string;
  Position: {
    LatitudeDegrees: number;
    LongitudeDegrees: number;
  };
  AltitudeMeters?: number;
  DistanceMeters: number;
  HeartRateBpm?: {
    Value: number;
  };
};

type TcsFormat = {
  TrainingCenterDatabase?: {
    Activities?: {
      Activity?: {
        Lap?: {
          Track?: {
            Trackpoint?: Trackpoint[];
          };
        };
      };
    };
  };
};

const FileParser = ({
  setRouteData,
}: {
  setRouteData: React.Dispatch<React.SetStateAction<RoutePoint[]>>;
}) => {
  const [xmlContent, setXmlContent] = useState<TcsFormat | null>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      setRouteData([]);
      return;
    }
    if (file.type !== "application/xml" && !file.name.endsWith(".tcx")) {
      alert("Please upload a valid .tcx file.");
      setRouteData([]);
      return;
    }

    const reader = new FileReader();

    reader.onload = (e: ProgressEvent<FileReader>) => {
      const xmlString = e.target?.result as string;

      // Use fast-xml-parser to convert XML to JSON
      const parser = new XMLParser();
      const json = parser.parse(xmlString);

      setXmlContent(json);
    };

    reader.readAsText(file);
  };

  const processXml = useCallback((xmlContent: TcsFormat): RoutePoint[] => {
    const trackPoints: Trackpoint[] =
      xmlContent?.TrainingCenterDatabase?.Activities?.Activity?.Lap?.Track
        ?.Trackpoint || [];

    return trackPoints.map((point, index) => {
      let speed: number = 0;

      if (index > 0) {
        const prevPoint = trackPoints[index - 1];
        const timeElapsed =
          (new Date(point.Time).getTime() -
            new Date(prevPoint.Time).getTime()) /
          1000;
        const diffDist = point.DistanceMeters - prevPoint.DistanceMeters;
        if (timeElapsed > 0 && diffDist > 0) {
          speed = diffDist / timeElapsed;
        }
      }

      return {
        lat: point.Position.LatitudeDegrees,
        lng: point.Position.LongitudeDegrees,
        info: {
          time: new Date(point.Time),
          altitude: point.AltitudeMeters,
          distance: point.DistanceMeters,
          heartRate: point.HeartRateBpm?.Value,
          speed: speed,
        },
      };
    });
  }, []);
  useEffect(() => {
    if (xmlContent) {
      setRouteData(processXml(xmlContent));
    } else {
      setRouteData([]);
    }
  }, [processXml, setRouteData, xmlContent]);

  return (
    <input
      type="file"
      accept=".tcx,application/xml"
      onChange={handleFileUpload}
    />
  );
};

export default FileParser;
