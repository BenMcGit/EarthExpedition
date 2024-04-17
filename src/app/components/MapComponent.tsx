import React, { useState, useRef, FC } from 'react'
import { MapContainer, TileLayer, FeatureGroup } from 'react-leaflet'
import { EditControl } from 'react-leaflet-draw'
import 'leaflet/dist/leaflet.css'
import 'leaflet-draw/dist/leaflet.draw.css'
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css'
import 'leaflet-defaulticon-compatibility'
import { LatLngExpression } from 'leaflet'
import Loader from './Loader'
import ZoomHandler from './ZoomHandler'
import MapMarker from './Marker'

export interface MarkerData {
  coordinates: [number, number]
  title: string
  description: string
}

const MapComponent: FC = () => {
  const initialCoordinates = [37.7749, -122.4194]
  const [inputValue, setInputValue] = useState<string>('')
  const [markerData, setMarkerData] = useState<MarkerData | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [submittedQuestion, setSubmittedQuestion] = useState<string | null>(
    null,
  )

  const mapRef = useRef<any | null>(null)

  const handleGeneration = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/location', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      const data = await response.json()
      setInputValue(data.location)
      setLoading(false)
    } catch (error) {
      console.error(error)
      setLoading(false)
    }
  }

  const handleSubmit = async () => {
    setLoading(true)
    try {
      setSubmittedQuestion(inputValue)
      setInputValue('')
      const response = await fetch('/api/coordinates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ value: inputValue }),
      })
      const data = await response.json()
      setMarkerData(data)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <>
      {loading && <Loader />}
      {/* {markerData && markerData.coordinates && (
        <div className="flex flex-col text-center items-center absolute top-3 right-3 z-[100000] max-w-screen-md">
          <h1 className="">{markerData.title}</h1>
          <p>{markerData.description}</p>
        </div>
      )} */}
      <MapContainer
        center={initialCoordinates as LatLngExpression}
        zoom={11}
        style={{ height: '100vh', width: '100vw' }}
      >
        <FeatureGroup>
          <EditControl
            position="topright"
            // onEdited={this._onEditPath}
            // onCreated={this._onCreate}
            // onDeleted={this._onDeleted}
            draw={{
              rectangle: false,
              circlemarker: false,
              polygon: false,
              polyline: false,
              marker: false,
            }}
          />
        </FeatureGroup>
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        />
        <MapMarker markerData={markerData} />
        <ZoomHandler
          markerData={markerData}
          onZoomEnd={() => setLoading(false)}
        />
      </MapContainer>
      <div className="absolute bottom-5 left-0 w-full z-[10000] p-3">
        <div className="flex justify-center">
          {submittedQuestion && (
            <div className="flex items-center justify-center bottom-16 absolute w-full z-[100000]">
              <h1 className="text-3xl font-bold text-black p-2 bg-white rounded-md">
                {submittedQuestion}
              </h1>
            </div>
          )}
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="flex-grow p-2 border rounded-md"
            onKeyPress={(e) => {
              if (e.key === 'Enter') handleSubmit()
            }}
          />
          <button
            onClick={handleSubmit}
            className="p-2 ml-2 bg-blue-500 text-white rounded-md"
          >
            Submit
          </button>
          <button
            onClick={handleGeneration}
            className="p-2 ml-2 bg-blue-500 text-white rounded-md"
          >
            Generate Location
          </button>
        </div>
      </div>
    </>
  )
}

export default MapComponent
