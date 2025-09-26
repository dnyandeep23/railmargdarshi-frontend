import React, { useState, useRef, useEffect } from 'react';
import { ZoomIn, ZoomOut, RotateCcw, Info } from 'lucide-react';
import { Station, Train, TrackSegment } from '../types';

const MapView: React.FC = () => {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);

  // Mock data for Mumbai railway network
  const stations: Station[] = [
    { id: '1', name: 'Chhatrapati Shivaji Maharaj Terminus', code: 'CSMT', coordinates: { x: 400, y: 300 }, platforms: 18, status: 'operational' },
    { id: '2', name: 'Dadar', code: 'DR', coordinates: { x: 300, y: 200 }, platforms: 6, status: 'operational' },
    { id: '3', name: 'Kurla', code: 'LTT', coordinates: { x: 500, y: 150 }, platforms: 8, status: 'operational' },
    { id: '4', name: 'Thane', code: 'TNA', coordinates: { x: 600, y: 100 }, platforms: 8, status: 'operational' },
    { id: '5', name: 'Kalyan', code: 'KYN', coordinates: { x: 700, y: 50 }, platforms: 10, status: 'operational' },
    { id: '6', name: 'Bandra', code: 'BA', coordinates: { x: 200, y: 250 }, platforms: 6, status: 'operational' },
    { id: '7', name: 'Andheri', code: 'AD', coordinates: { x: 100, y: 200 }, platforms: 4, status: 'operational' },
  ];

  const trains: Train[] = [
    { id: '1', number: '12345', name: 'Deccan Express', currentStation: 'CSMT', nextStation: 'DR', coordinates: { x: 350, y: 250 }, status: 'on-time', delay: 0, speed: 45, direction: 'up' },
    { id: '2', number: '12346', name: 'Mumbai Local', currentStation: 'DR', nextStation: 'KYN', coordinates: { x: 400, y: 175 }, status: 'delayed', delay: 15, speed: 60, direction: 'down' },
    { id: '3', number: '12347', name: 'Konkan Express', currentStation: 'TNA', nextStation: 'CSMT', coordinates: { x: 550, y: 125 }, status: 'early', delay: -5, speed: 55, direction: 'up' },
  ];

  const trackSegments: TrackSegment[] = [
    { id: '1', name: 'CSMT-DR', from: 'CSMT', to: 'DR', status: 'occupied', occupyingTrain: '12345', signalState: 'yellow' },
    { id: '2', name: 'DR-LTT', from: 'DR', to: 'LTT', status: 'free', signalState: 'green' },
    { id: '3', name: 'LTT-TNA', from: 'LTT', to: 'TNA', status: 'reserved', signalState: 'yellow' },
    { id: '4', name: 'TNA-KYN', from: 'TNA', to: 'KYN', status: 'occupied', occupyingTrain: '12347', signalState: 'red' },
  ];

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleZoom = (direction: 'in' | 'out') => {
    setZoom(prev => {
      const newZoom = direction === 'in' ? prev * 1.2 : prev / 1.2;
      return Math.max(0.5, Math.min(3, newZoom));
    });
  };

  const resetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'free': return 'stroke-green-500';
      case 'occupied': return 'stroke-red-500';
      case 'reserved': return 'stroke-yellow-500';
      case 'blocked': return 'stroke-red-700';
      default: return 'stroke-gray-400';
    }
  };

  const getTrainStatusColor = (status: string) => {
    switch (status) {
      case 'on-time': return 'fill-green-500';
      case 'delayed': return 'fill-red-500';
      case 'early': return 'fill-blue-500';
      default: return 'fill-gray-500';
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-900 relative">
      {/* Map Controls */}
      <div className="absolute top-4 right-4 z-20 flex flex-col space-y-2">
        <button
          onClick={() => handleZoom('in')}
          className="p-2 bg-white rounded-lg shadow-lg hover:bg-gray-50 transition-colors"
        >
          <ZoomIn className="w-4 h-4 text-navy-600" />
        </button>
        <button
          onClick={() => handleZoom('out')}
          className="p-2 bg-white rounded-lg shadow-lg hover:bg-gray-50 transition-colors"
        >
          <ZoomOut className="w-4 h-4 text-navy-600" />
        </button>
        <button
          onClick={resetView}
          className="p-2 bg-white rounded-lg shadow-lg hover:bg-gray-50 transition-colors"
        >
          <RotateCcw className="w-4 h-4 text-navy-600" />
        </button>
      </div>

      {/* Map Header */}
      <div className="bg-navy-800 text-white p-4 border-b border-navy-700">
        <h3 className="text-lg font-semibold">Mumbai Railway Network - Live View</h3>
        <p className="text-blue-200 text-sm">Zoom: {(zoom * 100).toFixed(0)}% | Active Trains: {trains.length}</p>
      </div>

      {/* Map Canvas */}
      <div
        ref={mapRef}
        className="flex-1 overflow-hidden cursor-grab active:cursor-grabbing select-none relative"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 800 400"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: 'center',
          }}
          className="bg-gray-800"
        >
          {/* Grid */}
          <defs>
            <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
              <path d="M 50 0 L 0 0 0 50" fill="none" stroke="rgb(55, 65, 81)" strokeWidth="1" opacity="0.3"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />

          {/* Track Lines */}
          <g className="tracks">
            <line x1="400" y1="300" x2="300" y2="200" className="stroke-gray-400 stroke-2" />
            <line x1="300" y1="200" x2="500" y2="150" className="stroke-gray-400 stroke-2" />
            <line x1="500" y1="150" x2="600" y2="100" className="stroke-gray-400 stroke-2" />
            <line x1="600" y1="100" x2="700" y2="50" className="stroke-gray-400 stroke-2" />
            <line x1="300" y1="200" x2="200" y2="250" className="stroke-gray-400 stroke-2" />
            <line x1="200" y1="250" x2="100" y2="200" className="stroke-gray-400 stroke-2" />
          </g>

          {/* Track Segments with Status */}
          <g className="track-segments">
            {trackSegments.map((segment) => {
              const fromStation = stations.find(s => s.code === segment.from);
              const toStation = stations.find(s => s.code === segment.to);
              if (!fromStation || !toStation) return null;
              
              return (
                <line
                  key={segment.id}
                  x1={fromStation.coordinates.x}
                  y1={fromStation.coordinates.y}
                  x2={toStation.coordinates.x}
                  y2={toStation.coordinates.y}
                  className={`${getStatusColor(segment.status)} stroke-4`}
                  strokeDasharray={segment.status === 'reserved' ? '10,5' : 'none'}
                />
              );
            })}
          </g>

          {/* Stations */}
          <g className="stations">
            {stations.map((station) => (
              <g key={station.id}>
                <circle
                  cx={station.coordinates.x}
                  cy={station.coordinates.y}
                  r="8"
                  className="fill-white stroke-navy-600 stroke-2 cursor-pointer hover:fill-saffron-100"
                  onClick={() => setSelectedStation(station)}
                />
                <text
                  x={station.coordinates.x}
                  y={station.coordinates.y - 12}
                  className="fill-white text-xs font-medium text-center"
                  textAnchor="middle"
                >
                  {station.code}
                </text>
              </g>
            ))}
          </g>

          {/* Trains */}
          <g className="trains">
            {trains.map((train) => (
              <g key={train.id}>
                <rect
                  x={train.coordinates.x - 6}
                  y={train.coordinates.y - 4}
                  width="12"
                  height="8"
                  rx="2"
                  className={`${getTrainStatusColor(train.status)} cursor-pointer hover:opacity-80`}
                />
                <text
                  x={train.coordinates.x}
                  y={train.coordinates.y + 12}
                  className="fill-white text-xs font-medium text-center"
                  textAnchor="middle"
                >
                  {train.number}
                </text>
              </g>
            ))}
          </g>

          {/* Signal Indicators */}
          <g className="signals">
            {trackSegments.map((segment, index) => {
              const fromStation = stations.find(s => s.code === segment.from);
              if (!fromStation) return null;
              
              const signalColor = segment.signalState === 'green' ? 'fill-green-400' : 
                                segment.signalState === 'yellow' ? 'fill-yellow-400' : 'fill-red-400';
              
              return (
                <circle
                  key={`signal-${index}`}
                  cx={fromStation.coordinates.x + 12}
                  cy={fromStation.coordinates.y - 12}
                  r="3"
                  className={signalColor}
                />
              );
            })}
          </g>
        </svg>
      </div>

      {/* Station Detail Modal */}
      {selectedStation && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-30">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-navy-900">{selectedStation.name}</h3>
              <button
                onClick={() => setSelectedStation(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Station Code:</span>
                <span className="font-medium">{selectedStation.code}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Platforms:</span>
                <span className="font-medium">{selectedStation.platforms}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <span className={`font-medium capitalize ${selectedStation.status === 'operational' ? 'text-green-600' : 'text-red-600'}`}>
                  {selectedStation.status}
                </span>
              </div>
              <div className="pt-4 border-t">
                <h4 className="font-medium text-navy-900 mb-2">Current Activity</h4>
                <div className="text-sm text-gray-600">
                  <p>• 2 trains approaching</p>
                  <p>• Platform 3 occupied</p>
                  <p>• Average delay: 5 minutes</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-white rounded-lg p-3 shadow-lg">
        <h4 className="text-sm font-semibold text-navy-900 mb-2">Track Status</h4>
        <div className="space-y-1 text-xs">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-1 bg-green-500"></div>
            <span>Free</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-1 bg-yellow-500"></div>
            <span>Reserved</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-1 bg-red-500"></div>
            <span>Occupied</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapView;