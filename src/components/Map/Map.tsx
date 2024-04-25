'use client';

import React, { useState, FC, useCallback } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import { LatLngExpression } from 'leaflet';
import { useForm, useWatch } from 'react-hook-form';
import {
  useMarkerData,
  useRequestMarkerData,
  useClearMarkerData,
} from '@/services/marker';
import { requestGenerateLocation } from '@/services/location';
import { valueToLabel } from '@/utils/option';
import useInTransaction from '@/hooks/useIntransaction';
import Loader from './Loader';
import ZoomHandler from './ZoomHandler';
import { ResetIcon, SearchIcon, SparkleIcon } from '../Icons';
import ToolTip from '../Tooltip';
import LinePlot from './LinePlot';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css';
import 'leaflet-defaulticon-compatibility';
import { useSetShowBoard } from '@/components/Board';
import TravelBoard from '@/modules/travelBoard';
import Select from '@/components/Select';

const initialCoordinates = [37.7749, -122.4194];
const selectOptions = [
  { label: 'Famous Places', value: 'attractions' },
  { label: 'Famous Food', value: 'food' },
  { label: 'Famous Football Stadiums', value: 'football stadiums' },
];

interface SubmitForm {
  inputPrompts: string;
}

//TODO: too many responsibilities
const Map: FC = () => {
  const markerData = useMarkerData();
  const requestMarkerData = useRequestMarkerData();
  const clearMarkerData = useClearMarkerData();
  const setShowBoard = useSetShowBoard();
  const [isloading, setIsLoading] = useState<boolean>(false);
  const {
    register,
    control,
    handleSubmit: withSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm<SubmitForm>();

  const inputPrompts = useWatch({ control, name: 'inputPrompts' });

  const ƒ = useCallback(async () => {
    if (inputPrompts) {
      try {
        setIsLoading(true);
        const data = await requestGenerateLocation(inputPrompts);
        setValue('inputPrompts', data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }
  }, [inputPrompts]);

  const handleReset = () => {
    setShowBoard(false);
    reset();
  };

  const handleSubmit = useCallback(
    async (data: SubmitForm) => {
      try {
        const { inputPrompts } = data;
        clearMarkerData();
        setShowBoard(false);
        await requestMarkerData(inputPrompts);
        reset();
      } catch (error) {
        console.error(error);
      }
    },
    [clearMarkerData],
  );

  const { handleExecAction, loading } = useInTransaction(handleSubmit);

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
        <ZoomHandler
          markerData={markerData}
          onZoomEnd={() => setIsLoading(false)}
        />
        <LinePlot endCoordinates={markerData} />
      </MapContainer>
      <TravelBoard />
      <div className="absolute top-3 left-0 w-full z-[10000] p-3">
        <div className="flex items-center justify-end space-x-2">
          {/* TODO: Bad data flow design */}
          <form className="flex flex-row items-center space-x-2">
            <input
              {...register('inputPrompts', { required: true })}
              type="text"
              className="w-2/3 p-2 text-black rounded-lg"
              placeholder="Enter topic of the wanted location"
            />
            <span className="text-[#facc14]">or</span>
            <Select
              {...register('inputPrompts', { required: true })}
              options={selectOptions}
              value={inputPrompts}
              className="p-2 w-2/3 h-[32px] bg-[#3B81F6] rounded-l-lg"
              placeholder="Choose a topic"
            />
          </form>
          {/* TODO: ToolTip should fix the overflowing problem automatically */}
          <ToolTip
            options={{ placement: 'bottom-end' }}
            className="rounded-xl"
            text="Generate a question with AI!"
          >
            <button
              className="btn bg-blue-500 p-2 rounded-lg hover:ring-2"
              onClick={ƒ}
            >
              <SparkleIcon className="h-4 w-4 bg-blue-500 text-yellow-400 fill-yellow-400 hover:animate-pulse" />
            </button>
          </ToolTip>
          <ToolTip
            options={{ placement: 'bottom-end' }}
            className="rounded-xl"
            text="Reset"
          >
            <button
              className="btn bg-blue-500 p-2 rounded-lg hover:ring-2"
              onClick={handleReset}
            >
              <ResetIcon className="h-4 w-4 bg-blue-500 text-yellow-400" />
            </button>
          </ToolTip>
        </div>
      </div>
      <div className="absolute bottom-5 left-0 w-full z-[10000] p-3">
        <div className="flex flex-row items-center justify-end">
          {inputPrompts && (
            <div className="flex items-center justify-center min-w-[60%]">
              <h1 className="w-full text-xl font-bold text-black p-2 bg-white ring-4 rounded-md ring-slate-500">
                {valueToLabel(inputPrompts, selectOptions) ?? inputPrompts}
              </h1>
            </div>
          )}
          <ToolTip text="Reveal the answer" options={{ placement: 'top' }}>
            <button
              type="submit"
              className={`p-2 ml-2 bg-blue-500 text-white rounded-lg hover:ring-2 
                ${loading ? 'cursor-not-allowed' : 'cursor-pointer'}`}
              disabled={loading}
              value="Submit"
              onClick={withSubmit(handleExecAction)}
            >
              <SearchIcon className="h-4 w-8 bg-blue-500 text-yellow-400" />
            </button>
          </ToolTip>
        </div>
      </div>
    </>
  );
};

export default Map;
