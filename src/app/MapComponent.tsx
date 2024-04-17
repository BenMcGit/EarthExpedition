'use client'
import React, { useState, useRef, FC } from 'react'
import cx from 'clsx'
import { MapContainer, TileLayer, FeatureGroup } from 'react-leaflet'
import { EditControl } from 'react-leaflet-draw'
import 'leaflet/dist/leaflet.css'
import 'leaflet-draw/dist/leaflet.draw.css'
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css'
import 'leaflet-defaulticon-compatibility'
import { LatLngExpression } from 'leaflet'
import { useForm, SubmitHandler } from 'react-hook-form'
import {
  MarkerData,
  useMarkerData,
  useRequestMarkerData,
} from '@/services/marker'
import useInTransaction from '@/hooks/useIntransaction'
import Loader from './Loader'
import ZoomHandler from './ZoomHandler'
import MapMarker from './Marker'

const initialCoordinates = [37.7749, -122.4194]

interface SubmitForm {
  inputPrompts: string
}

const MapComponent: FC = () => {
  const [inputValue, setInputValue] = useState<string>('')
  const markerData = useMarkerData()
  const requestMarkerData = useRequestMarkerData()
  const [isloading, setIsLoading] = useState<boolean>(false)
  const [submittedQuestion, setSubmittedQuestion] = useState<string | null>(
    null,
  )
  const {
    register,
    handleSubmit: withSubmit,
    formState: { errors },
  } = useForm<SubmitForm>()

  // const mapRef = useRef<any | null>(null)

  const handleGeneration = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/location', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      const data = await response.json()
      setInputValue(data.location)
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (data: SubmitForm) => {
    try {
      const { inputPrompts } = data
      await requestMarkerData(inputPrompts)
    } catch (error) {
      console.error(error)
    }
  }

  const { handleExecAction, loading, error } = useInTransaction(handleSubmit)

  return (
    <>
      {(loading || isloading) && <Loader />}
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
          onZoomEnd={() => setIsLoading(false)}
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
          <form onSubmit={withSubmit(handleExecAction)}>
            <input
              {...register('inputPrompts', { required: true })}
              type="text"
              // value={inputValue}
              className="flex-grow p-2 border rounded-md"
            />
            <input
              type="submit"
              className={cx(
                'p-2 ml-2 bg-blue-500 text-white rounded-md',
                loading ? 'cursor-not-allowed' : 'cursor-pointer',
              )}
              value="submit"
            />
          </form>
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
