import { useEffect, useState } from "react";
import "../App.css";

function RailwayMap() {
  const stations = [
    { name: "Delhi", x: 8, y: 58 },
    { name: "New Delhi", x: 28, y: 45 },
    { name: "Ghaziabad", x: 50, y: 62 },
    { name: "Panipat", x: 72, y: 32 },
    { name: "Mathura", x: 42, y: 78 },
    { name: "Agra", x: 65, y: 82 }
  ];

  const trainsData = [
    {
      id: "12951",
      name: "Mumbai Rajdhani",
      from: "Delhi",
      to: "Mathura",
      position: 36,
      status: "Running",
      speed: "108 km/h",
      nextStation: "Mathura",
      eta: "18 min"
    },
    {
      id: "12002",
      name: "Shatabdi Express",
      from: "Delhi",
      to: "Ghaziabad",
      position: 58,
      status: "Running",
      speed: "92 km/h",
      nextStation: "Ghaziabad",
      eta: "9 min"
    },
    {
      id: "12401",
      name: "Kota Express",
      from: "Delhi",
      to: "Agra",
      position: 76,
      status: "Delayed",
      speed: "64 km/h",
      nextStation: "Agra",
      eta: "27 min"
    }
  ];

  const [trains, setTrains] = useState(trainsData);
  const [selectedTrain, setSelectedTrain] = useState(trainsData[0]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTrains((currentTrains) =>
        currentTrains.map((train) => ({
          ...train,
          position:
            train.position >= 92
              ? 8
              : train.position + 1
        }))
      );
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  const getTrainPosition = (train) => {
    if (train.id === "12951") {
      return {
        left: `${train.position}%`,
        top: "57%"
      };
    }

    if (train.id === "12002") {
      return {
        left: `${train.position - 5}%`,
        top: "48%"
      };
    }

    return {
      left: `${train.position - 8}%`,
      top: "74%"
    };
  };

  return (
    <div className="page railway-page">

      <div className="page-heading">

        <div>
          <h1>Railway Network</h1>
          <p>
            Live train movement and maintenance monitoring
          </p>
        </div>

        <div className="live-indicator">
          <span></span>
          Live Tracking
        </div>

      </div>

      <div className="map-stats">

        <div className="map-stat-card">
          <span>Active Trains</span>
          <strong>{trains.length}</strong>
          <small>Currently running</small>
        </div>

        <div className="map-stat-card">
          <span>Operational Corridors</span>
          <strong>2</strong>
          <small>Under normal operation</small>
        </div>

        <div className="map-stat-card">
          <span>Maintenance Blocks</span>
          <strong>1</strong>
          <small>Currently active</small>
        </div>

        <div className="map-stat-card">
          <span>Train Delays</span>
          <strong>1</strong>
          <small>Requires monitoring</small>
        </div>

      </div>

      <div className="map-layout">

        <div className="railway-map">

          <div className="map-header">

            <div>
              <h2>Delhi Railway Division</h2>
              <p>Live network overview</p>
            </div>

            <span className="map-live">
              ● LIVE
            </span>

          </div>

          <div className="map-area">

            <div className="map-grid"></div>

            <div className="route route-main"></div>

            <div className="route route-secondary"></div>

            <div className="route route-agra"></div>

            <div className="maintenance-zone">
              <span>🚧</span>
              <small>Maintenance Block</small>
            </div>

            {stations.map((station) => (
              <div
                key={station.name}
                className="map-station"
                style={{
                  left: `${station.x}%`,
                  top: `${station.y}%`
                }}
              >
                <div className="station-dot"></div>
                <span>{station.name}</span>
              </div>
            ))}

            {trains.map((train) => (
              <button
                key={train.id}
                className={`map-train ${
                  train.status === "Delayed"
                    ? "delayed-train"
                    : ""
                }`}
                style={getTrainPosition(train)}
                onClick={() => setSelectedTrain(train)}
              >
                🚆
                <span>{train.id}</span>
              </button>
            ))}

          </div>

          <div className="map-legend">

            <div>
              <span className="legend-dot train-dot"></span>
              Running Train
            </div>

            <div>
              <span className="legend-dot delay-dot"></span>
              Delayed Train
            </div>

            <div>
              <span className="legend-dot station-legend"></span>
              Station
            </div>

            <div>
              <span className="legend-dot maintenance-legend"></span>
              Maintenance
            </div>

          </div>

        </div>

        <div className="train-panel">

          <div className="panel-header">

            <div>
              <h2>Active Trains</h2>
              <p>Current train movement</p>
            </div>

          </div>

          <div className="train-list">

            {trains.map((train) => (

              <button
                key={train.id}
                className={`train-card ${
                  selectedTrain.id === train.id
                    ? "selected-train"
                    : ""
                }`}
                onClick={() => setSelectedTrain(train)}
              >

                <div className="train-card-top">

                  <div className="train-icon">
                    🚆
                  </div>

                  <div>
                    <strong>{train.id}</strong>
                    <span>{train.name}</span>
                  </div>

                  <span
                    className={`train-status ${
                      train.status === "Delayed"
                        ? "status-delayed"
                        : "status-running"
                    }`}
                  >
                    {train.status}
                  </span>

                </div>

                <div className="train-route">

                  <span>{train.from}</span>

                  <div className="route-line">
                    <div></div>
                  </div>

                  <span>{train.to}</span>

                </div>

                <div className="train-mini-info">

                  <span>
                    Speed
                    <strong>{train.speed}</strong>
                  </span>

                  <span>
                    Next
                    <strong>{train.nextStation}</strong>
                  </span>

                  <span>
                    ETA
                    <strong>{train.eta}</strong>
                  </span>

                </div>

              </button>

            ))}

          </div>

          <div className="selected-train-panel">

            <div className="selected-title">
              <span>Selected Train</span>
              <strong>{selectedTrain.id}</strong>
            </div>

            <h3>{selectedTrain.name}</h3>

            <p>
              {selectedTrain.from} → {selectedTrain.to}
            </p>

            <div className="detail-grid">

              <div>
                <span>Status</span>
                <strong>{selectedTrain.status}</strong>
              </div>

              <div>
                <span>Speed</span>
                <strong>{selectedTrain.speed}</strong>
              </div>

              <div>
                <span>Next Station</span>
                <strong>{selectedTrain.nextStation}</strong>
              </div>

              <div>
                <span>ETA</span>
                <strong>{selectedTrain.eta}</strong>
              </div>

            </div>

            <div className="last-updated">
              ● Last updated just now
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default RailwayMap;