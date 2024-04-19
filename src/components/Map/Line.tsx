import useLocationMarker from '@/hooks/useLocationMarker'
import { LatLngExpression } from 'leaflet'
import { FC, useEffect, useState } from 'react'
import { Polyline, useMapEvents } from 'react-leaflet'
interface LineProps {}

const test = [37.7749, -122.4194]
const test2 = [37.7749, -122.4194 + 300]

const Line: FC<LineProps> = () => {
  const [coordinates, setCoordinates] = useLocationMarker()
  const [positions, setPositions] = useState<LatLngExpression[]>([])

  useEffect(() => {
    console.log('Polyline useEffect triggered', coordinates)
    const lat = coordinates?.lat
    const lng = coordinates?.lng
    if (lat !== undefined && lng !== undefined) {
      console.log('Calculating positions')
      const latlng = [lat, lng] as LatLngExpression
      const latlngEx = [lat, lng + 300] as LatLngExpression
      setPositions([latlng, latlngEx])
    } else {
      console.log('Coordinates are null or undefined')
    }
  }, [coordinates])

  useMapEvents({
    click(e) {
      console.log(coordinates)
      //   setCoordinates(e.latlng)
    },
  })

  return (
    <Polyline
      positions={[test as LatLngExpression, test2 as LatLngExpression]}
      color="red"
    />
  )
}

export default Line
