import { FC } from 'react';
import { MarkerData } from '@/services/marker';
import { Marker, Popup } from 'react-leaflet';

interface MarkerProps {
  markerData: MarkerData | null;
}

const MapMarker: FC<MarkerProps> = ({ markerData }) => {
  if (!markerData || !markerData.coordinates) {
    return <></>;
  }
  return (
    <Marker position={markerData.coordinates}>
      {(markerData.title || markerData.description) && (
        <Popup>
          {markerData.title && (
            <h1 className="font-bold">{markerData.title}</h1>
          )}
          {markerData.description && <p>{markerData.description}</p>}
        </Popup>
      )}
    </Marker>
  );
};

export default MapMarker;
