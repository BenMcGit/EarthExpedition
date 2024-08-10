'use client';

import React, { useState, FC, useEffect } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import { LatLngExpression } from 'leaflet';
import Loader from './Loader';
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

const Map: FC = () => {
  const [state, formAction] = useFormState(determineCoordinates, {
    locations: [],
    error: null,
  });
  const { pending } = useFormStatus();
  const [isloading, setIsLoading] = useState<boolean>(pending);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(
    null,
  );

  console.log(state);
  useEffect(() => {
    if (state.locations.length > 0) {
      setSelectedLocation(state.locations[0]);
    } else {
      setSelectedLocation(null);
    }
  }, [state]);

  const handleLocationUpdate = (location: Location) => {
    setSelectedLocation(location);
  };

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
        <ZoomHandler
          markerData={selectedLocation}
          onZoomEnd={() => setIsLoading(false)}
        />
        <LinePlot endCoordinates={selectedLocation} />
      </MapContainer>
      <div className="absolute top-2 items-center w-full z-[10000] p-2">
        <div className="flex flex-col items-end space-x-2">
          {/* {selectedLocation && (
            <div className="card bg-base-100 w-96 shadow-xl max-h-screen overflow-auto">
              <figure>
                <img
                  src={selectedLocation.image}
                  alt={selectedLocation.title}
                />
              </figure>
              <div className="card-body">
                <h2 className="card-title">{selectedLocation.title}</h2>
                <p>{selectedLocation.description}</p>
              </div>
            </div>
          )} */}
          {state.locations &&
            state.locations.length > 0 &&
            state.locations.map((location) => (
              <div
                tabIndex={0}
                className="collapse collapse-plus w-96 bg-base-100 border-base-300 border"
                onClick={() => handleLocationUpdate(location)}
              >
                <div className="collapse-title text-xl font-medium">
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
