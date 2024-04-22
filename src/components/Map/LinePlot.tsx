import { FC, useEffect, useState } from 'react';
import MapMarker from './Marker';
import { Polyline, useMapEvents } from 'react-leaflet';
import { MarkerData } from '@/services/marker';
import { LatLngExpression, LatLngLiteral } from 'leaflet';
import haversine from 'haversine-distance';

interface LinePlotProps {
  endCoordinates: MarkerData | null;
}

const calculateDistanceBetween = (
  startLat: number,
  startLng: number,
  endLat: number,
  endLng: number,
): number => {
  const point1 = { latitude: startLat, longitude: startLng };
  const point2 = { latitude: endLat, longitude: endLng };
  const distance = haversine(point1, point2);
  return distance;
};

const LinePlot: FC<LinePlotProps> = ({ endCoordinates }) => {
  const [startCoordinates, setStartCoordinates] = useState<MarkerData>();
  const [positions, setPositions] = useState<LatLngExpression[]>([]);

  useEffect(() => {
    if (!startCoordinates?.coordinates || !endCoordinates?.coordinates) {
      setPositions([]);
      return;
    }
    const startExp: LatLngLiteral = {
      lat: startCoordinates?.coordinates[0] || 0,
      lng: startCoordinates?.coordinates[1] || 0,
    };
    const endExp: LatLngLiteral = {
      lat: endCoordinates?.coordinates[0] || 0,
      lng: endCoordinates?.coordinates[1] || 0,
    };
    setPositions([startExp, endExp]);
  }, [startCoordinates, endCoordinates]);

  useMapEvents({
    click(e) {
      const coordinates = e.latlng;

      const data: MarkerData = !endCoordinates
        ? {
            coordinates: [coordinates.lat, coordinates.lng],
          }
        : {
            coordinates: [coordinates.lat, coordinates.lng],
            title: `Your guess was ${calculateDistanceBetween(coordinates.lat, coordinates.lng, endCoordinates.coordinates[0], endCoordinates.coordinates[1])} meters away!`,
          };
      setStartCoordinates(data);
    },
  });

  return (
    <>
      {/* <MapMarker markerData={startCoordinates || null} />
      <Polyline positions={positions} color="red" /> */}
      <MapMarker markerData={endCoordinates || null} />
    </>
  );
};

export default LinePlot;
