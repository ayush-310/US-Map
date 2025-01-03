import React, { useState } from 'react';
import 'leaflet/dist/leaflet.css';
import { statesData } from './data'; // Ensure this file contains GeoJSON data with state-specific scores
import { MapContainer, Polygon, TileLayer, useMap } from 'react-leaflet';
import './index.css';

function App() {
  const center = [37.8, -96]; // Center of the US
  const [selectedState, setSelectedState] = useState(null);

  // Default scores for states (initialize with statesData)
  const [stateScores, setStateScores] = useState(() => {
    const scores = {};
    statesData.features.forEach(
      (state) => (scores[state.properties.name] = state.properties.score || 0)
    );
    return scores;
  });

  // Update score for a state
  const updateScore = (stateName, change) => {
    setStateScores((prevScores) => ({
      ...prevScores,
      [stateName]: prevScores[stateName] + change,
    }));
  };

  // Utility function for color based on score
  const getColor = (score) => {
    return score > 20
      ? '#006400'
      : score > 10
      ? '#228B22'
      : score > 0
      ? '#7FFF00'
      : '#FF6347';
  };

  // Info Panel Component
  const InfoPanel = () => (
    <div className="info-panel">
      {selectedState ? (
        <>
          <h2>{selectedState}</h2>
          <p>Score: {stateScores[selectedState]}</p>
          <button onClick={() => updateScore(selectedState, 1)}>Vote Up</button>
          <button onClick={() => updateScore(selectedState, -1)}>Vote Down</button>
        </>
      ) : (
        <p>Click on a state to see details</p>
      )}
    </div>
  );

  return (
    <div className="app">
      <MapContainer
        center={center}
        zoom={4}
        style={{ height: '100vh', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {statesData.features.map((state, index) => {
          const coordinates = state.geometry.coordinates[0].map((point) => [
            point[1],
            point[0],
          ]);

          return (
            <Polygon
              key={index}
              pathOptions={{
                fillColor: getColor(stateScores[state.properties.name]),
                fillOpacity: 0.7,
                color: 'white',
                weight: 2,
              }}
              positions={coordinates}
              eventHandlers={{
                click: () => setSelectedState(state.properties.name),
              }}
            />
          );
        })}
      </MapContainer>

      <InfoPanel />
    </div>
  );
}

export default App;
