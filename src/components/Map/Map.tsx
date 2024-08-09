'use client';

import React, { useState, FC } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import { LatLngExpression } from 'leaflet';
import {
  useMarkerData,
  useRequestMarkerData,
  useClearMarkerData,
} from '@/services/marker';
import Loader from './Loader';
import ZoomHandler from './ZoomHandler';
import LinePlot from './LinePlot';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css';
import 'leaflet-defaulticon-compatibility';
import { useSetShowBoard } from '@/components/Board';
import { useFormState, useFormStatus } from 'react-dom';
import determineCoordinates from '@/actions';

const initialCoordinates = [37.7749, -122.4194];

interface SubmitForm {
  inputPrompts: string;
}

const Map: FC = () => {
  const markerData = useMarkerData();
  const [state, formAction] = useFormState(determineCoordinates, {});
  const { pending } = useFormStatus();
  const requestMarkerData = useRequestMarkerData();
  const clearMarkerData = useClearMarkerData();
  const setShowBoard = useSetShowBoard();
  const [isloading, setIsLoading] = useState<boolean>(pending);
  const [question, setQuestion] = useState<string>('');

  return (
    <>
      {pending && <Loader />}
      <MapContainer
        center={initialCoordinates as LatLngExpression}
        zoom={11}
        style={{ height: '100vh', width: '100vw' }}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        />
        <ZoomHandler markerData={state} onZoomEnd={() => setIsLoading(false)} />
        <LinePlot endCoordinates={state} />
      </MapContainer>
      <div className="absolute top-2 items-center w-full z-[10000] p-2">
      <div className="flex flex-col items-end space-x-2">
          <div className="card bg-base-100 w-96 shadow-xl max-h-screen overflow-auto">
            <figure>
              <img
                src={state.image}
                alt={state.title}
              />
            </figure>
            <div className="card-body">
              <h2 className="card-title">{state.title}</h2>
              <p>{state.description}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute bottom-2 w-full z-[10000] p-2">
        <form
          action={formAction}
          className="flex items-center justify-center space-x-2"
        >
          <input
            name="prompt"
            type="text"
            placeholder="Travel ideas..."
            className="input input-bordered w-full max-w-xs"
          />
          <button type="submit" className="btn" disabled={pending}>
            Search
          </button>
        </form>
      </div>
    </>
  );
};

export default Map;
