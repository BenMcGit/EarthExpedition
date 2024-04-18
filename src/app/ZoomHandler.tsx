import { FC, useEffect } from 'react'
import { useMap, useMapEvents } from 'react-leaflet'
import { MarkerData } from '@/services/marker'

interface ZoomHandlerProps {
  markerData: MarkerData | null
  onZoomEnd: () => void
}

const ZoomHandler: FC<ZoomHandlerProps> = ({ markerData, onZoomEnd }) => {
  const map = useMap()

  const flyToMarker = (coordinates: [number, number], zoom: number) => {
    if (coordinates && typeof coordinates[0] !== 'undefined') {
      map.flyTo(coordinates, zoom, {
        animate: true,
        duration: 3,
      })
    }
  }
  useMapEvents({
    zoomend: onZoomEnd,
  })

  useEffect(() => {
    if (markerData) {
      if (
        markerData.coordinates &&
        typeof markerData.coordinates[0] !== 'undefined'
      ) {
        flyToMarker(markerData.coordinates, 11)
      }
    }
  }, [markerData])

  return null
}

export default ZoomHandler
