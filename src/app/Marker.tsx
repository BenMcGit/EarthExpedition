import { FC } from 'react'
import { MarkerData } from '@/services/marker'
import { Marker as LeafletMarker, Popup } from 'react-leaflet'

interface MarkerProps {
  markerData: MarkerData | null
}

const MapMarker: FC<MarkerProps> = ({ markerData }) => {
  if (!markerData || !markerData.coordinates) {
    return <></>
  }
  return (
    <LeafletMarker position={markerData.coordinates}>
      <Popup>
        <h1 className="font-bold">{markerData.title}</h1>
        <p>{markerData.description}</p>
      </Popup>
    </LeafletMarker>
  )
}

export default MapMarker
