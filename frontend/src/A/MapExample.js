// src/MapExample.js
import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Create a custom red marker icon
const redMarkerIcon = new L.Icon({
  iconUrl: 'https://upload.wikimedia.org/wikipedia/commons/f/f6/Red_Marker.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const MapExample = () => {
  // Hardcoded crime locations
  const crimeLocations = [
    {
      position: [51.505, -0.09],
      crime: 'Theft',
      description: 'Description of theft incident.',
    },
    {
      position: [51.515, -0.1],
      crime: 'Assault',
      description: 'Description of assault incident.',
    },
    {
      position: [51.525, -0.08],
      crime: 'Vandalism',
      description: 'Description of vandalism incident.',
    },
  ];

  return (
    <div style={{ height: '100vh', width: '100%' }}>
      <MapContainer center={[51.51, -0.09]} zoom={13} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {crimeLocations.map((location, index) => (
          <Marker key={index} position={location.position} icon={redMarkerIcon}>
            <Popup>{location.crime}</Popup>
            <Tooltip>{location.description}</Tooltip>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapExample;