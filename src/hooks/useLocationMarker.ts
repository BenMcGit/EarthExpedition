import { LatLng } from 'leaflet'
import { useState } from 'react'

function useLocationMarker(
  latlng: LatLng | null = new LatLng(0, 0),
): [LatLng | null, (coordinates: LatLng | null) => void] {
  const [coordinates, setCoordinates] = useState<LatLng | null>(latlng)
  return [coordinates, setCoordinates]
}

export default useLocationMarker
