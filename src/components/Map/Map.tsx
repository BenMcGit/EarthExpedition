'use client'
import React, { useState, useRef, FC, useCallback, useEffect } from 'react'
import cx from 'clsx'
import {
  MapContainer,
  TileLayer,
  FeatureGroup,
  Polyline,
  useMapEvents,
  Marker,
  Popup,
} from 'react-leaflet'
import { EditControl } from 'react-leaflet-draw'
import 'leaflet/dist/leaflet.css'
import 'leaflet-draw/dist/leaflet.draw.css'
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css'
import 'leaflet-defaulticon-compatibility'
import { LatLng, LatLngExpression } from 'leaflet'
import { useForm, useWatch } from 'react-hook-form'
import { useMarkerData, useRequestMarkerData } from '@/services/marker'
import { requestGenerateLocation } from '@/services/location'
import useInTransaction from '@/hooks/useIntransaction'
import Loader from './Loader'
import ZoomHandler from './ZoomHandler'
import MapMarker from './Marker'
import { SparkleIcon } from '../Icons'
import ToolTip from '../Tooltip'
import TravelBoard from '@/modules/travelBoard'
import LocationMarker from './LocationMarker'
import useLocationMarker from '@/hooks/useLocationMarker'
import Line from './Line'

const initialCoordinates = [37.7749, -122.4194]

interface SubmitForm {
  inputPrompts: string
}

const Map: FC = () => {
  const markerData = useMarkerData()
  const requestMarkerData = useRequestMarkerData()
  const [isloading, setIsLoading] = useState<boolean>(false)
  const {
    register,
    control,
    handleSubmit: withSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm<SubmitForm>()

  const inputPrompts = useWatch({ control, name: 'inputPrompts' })

  const handleGeneration = useCallback(async () => {
    try {
      setIsLoading(true)
      const data = await requestGenerateLocation()
      setValue('inputPrompts', data)
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const handleSubmit = useCallback(async (data: SubmitForm) => {
    try {
      const { inputPrompts } = data
      await requestMarkerData(inputPrompts)
      reset({
        inputPrompts: '',
      })
    } catch (error) {
      console.error(error)
    }
  }, [])

  const { handleExecAction, loading } = useInTransaction(handleSubmit)

  return (
    <>
      {(loading || isloading) && <Loader />}
      <MapContainer
        center={initialCoordinates as LatLngExpression}
        zoom={11}
        style={{ height: '100vh', width: '100vw' }}
      >
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
      <TravelBoard />
      <div className="absolute bottom-5 left-0 w-full z-[10000] p-3">
        <div className="flex justify-center">
          {inputPrompts && (
            <div className="flex items-center justify-center bottom-20 absolute w-full z-[100000]">
              <h1 className="text-xl font-bold text-black p-2 bg-white ring-4 rounded-md ring-slate-500">
                {inputPrompts}
              </h1>
            </div>
          )}
          <div className="w-full">
            <form
              className="flex justify-center"
              onSubmit={withSubmit(handleExecAction)}
            >
              <input
                {...register('inputPrompts', { required: true })}
                type="text"
                className="w-2/3 p-2 text-black rounded-l-lg"
                placeholder="Describe anything that's got specific coordinates – like a spot on a map or an event in time."
              />
              <ToolTip
                className="rounded-xl"
                text="Have an AI craft a description for you."
              >
                <button
                  className="btn bg-blue-500 p-2 rounded-r-lg hover:ring-2"
                  onClick={handleGeneration}
                >
                  <SparkleIcon className="h-8 w-8 bg-blue-500 text-yellow-400 fill-yellow-400 hover:animate-pulse" />
                </button>
              </ToolTip>
              <button
                type="submit"
                className={`p-2 ml-2 bg-blue-500 text-white rounded-lg hover:ring-2 
                ${loading ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                disabled={loading}
                value="Submit"
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}

export default Map
