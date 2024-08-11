'use client';

import React, { useState, FC, useEffect, useActionState } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import { LatLngExpression } from 'leaflet';
import ZoomHandler from './ZoomHandler';
import LinePlot from './LinePlot';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css';
import 'leaflet-defaulticon-compatibility';
import { useFormState, useFormStatus } from 'react-dom';
import determineCoordinates from '@/actions';

const initialCoordinates = [37.7749, -122.4194];

export type Location = {
  coordinates: [number, number];
  title: string;
  description: string;
  image: string;
};

export type FormState = {
  prompt: string;
  locations: Location[];
  error: any;
};

const Map: FC = () => {
  // const [state, formAction] = useActionState(determineCoordinates, {
  //   prompt: '',
  //   locations: [],
  //   error: null,
  // });
  const [state, formAction] = useFormState(determineCoordinates, {
    prompt: '',
    locations: [],
    error: null,
  });
  // const { pending } = useFormStatus();
  const [loading, setLoading] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(
    null,
  );

  console.log('pending', loading);

  useEffect(() => {
    if (state.locations.length > 0) {
      setLoading(false);
      setSelectedLocation(state.locations[0]);
    } else {
      setSelectedLocation(null);
    }
  }, [state]);

  const handleLocationUpdate = (location: Location) => {
    setSelectedLocation(location);
  };

  const handleSubmit = () => {
    setLoading(true);
  };

  return (
    <>
      {loading && (
        <div className="absolute left-1/2 top-1/2 z-[10000]">
          <span className="loading loading-infinity loading-lg"></span>
        </div>
      )}
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
          markerData={selectedLocation}
          onZoomEnd={() => setLoading(false)} // TODO not needed?
        />
        <LinePlot endCoordinates={selectedLocation} />
      </MapContainer>
      <div className="absolute top-5 right-5 w-1/4 max-h-screen bg-transparent p-4 z-[10000]">
        <div className="flex flex-col items-end space-x-2">
          {state.locations &&
            state.locations.length > 0 &&
            state.locations.map((location, idx) => (
              <div
                tabIndex={0}
                key={idx}
                className="collapse collapse-plus bg-base-100 border-base-300 border"
                onClick={() => handleLocationUpdate(location)}
              >
                <div className="collapse-title text-lg font-medium">
                  {location.title}
                </div>
                <div className="collapse-content">
                  <p>{location.description}</p>
                </div>
              </div>
            ))}
        </div>
      </div>
      <div className="absolute bottom-2 w-full z-[10000] p-2">
        <form
          action={formAction}
          className="flex items-center justify-center space-x-2"
          onSubmit={handleSubmit}
        >
          <input
            name="prompt"
            type="text"
            placeholder="Search for anything..."
            className="input input-bordered w-full max-w-lg"
          />
          <button type="submit" className="btn" disabled={loading}>
            {loading ? 'Searching...' : 'Search'}
          </button>
        </form>
      </div>
    </>
  );
};

export default Map;
