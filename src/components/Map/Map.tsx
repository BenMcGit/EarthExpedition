'use client';

import React, { useState, FC, useCallback } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import { LatLngExpression } from 'leaflet';
import { useForm, useWatch } from 'react-hook-form';
import { useMarkerData, useRequestMarkerData } from '@/services/marker';
import { requestGenerateLocation } from '@/services/location';
import useInTransaction from '@/hooks/useIntransaction';
import { useSetShowBoard } from '../Board';
import Loader from './Loader';
import ZoomHandler from './ZoomHandler';
import { ResetIcon, SearchIcon, SparkleIcon } from '../Icons';
import ToolTip from '../Tooltip';
import LinePlot from './LinePlot';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css';
import 'leaflet-defaulticon-compatibility';
import TravelBoard from '@/modules/travelBoard';
import Select from '../Select';

const initialCoordinates = [37.7749, -122.4194];

interface SubmitForm {
  inputPrompts: string;
}

const Map: FC = () => {
  const markerData = useMarkerData();
  const requestMarkerData = useRequestMarkerData();
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

  const handleGeneration = useCallback(async () => {
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
    reset({
      inputPrompts: '',
    });
  };

  const handleSubmit = useCallback(async (data: SubmitForm) => {
    try {
      const { inputPrompts } = data;
      await requestMarkerData(inputPrompts);
      reset({
        inputPrompts: '',
      });
      setShowBoard(true);
    } catch (error) {
      console.error(error);
    }
  }, []);

  const { handleExecAction, loading } = useInTransaction(handleSubmit);

  const selectOptions = [
    { label: 'Select a category', value: '' },
    { label: 'Famous Places', value: 'Famous Places' },
    { label: 'Famous Food', value: 'Famous Food' },
    { label: 'Famous Football Stadiums', value: 'Famous Football Stadiums' },
  ];

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
        <div className="flex justify-end space-x-2">
          <ToolTip
            options={{ placement: 'bottom-end' }}
            className="rounded-xl"
            text="Learn something new!"
          >
            <button
              className="btn bg-blue-500 p-2 rounded-lg hover:ring-2"
              onClick={handleGeneration}
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
                className="w-2/3 p-2 text-black rounded-lg"
                placeholder="Search anything with coordinates..."
              />
              <Select
                {...register('inputPrompts', { required: true })}
                options={selectOptions}
                className="w-2/3 p-2 text-black rounded-l-lg"
              />
              <button
                type="submit"
                className={`p-2 ml-2 bg-blue-500 text-white rounded-lg hover:ring-2 
                ${loading ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                disabled={loading}
                value="Submit"
              >
                <SearchIcon className="h-4 w-8 bg-blue-500 text-yellow-400" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Map;
