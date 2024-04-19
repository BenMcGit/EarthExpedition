import useLocationMarker from '@/hooks/useLocationMarker'
import { FC, useEffect } from 'react'
import { useMapEvents, Marker, Popup } from 'react-leaflet'

interface LocationMarkerProps {}

const LocationMarker: FC<LocationMarkerProps> = () => {
  const [coordinates, setCoordinates] = useLocationMarker()

  useEffect(() => {
    console.log('LocationMarker', coordinates)
  }, [coordinates])

  useMapEvents({
    click(e) {
      setCoordinates(e.latlng)
    },
  })

  return coordinates === null ? null : <Marker position={coordinates}></Marker>
}

export default LocationMarker
