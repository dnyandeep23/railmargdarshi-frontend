import React, { useState, useRef } from 'react';
import { ZoomIn, ZoomOut, RotateCcw, MapPin, Brain as Train, AlertTriangle, Settings, Navigation } from 'lucide-react';

interface TrafficMapProps {
  currentRole: string;
}

const TrafficMap: React.FC<TrafficMapProps> = ({ currentRole }) => {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [selectedZone, setSelectedZone] = useState('all');
  const [selectedElement, setSelectedElement] = useState<
    | { type: 'station'; data: typeof stations[number] }
    | { type: 'train'; data: typeof trains[number] }
    | { type: 'conflict'; data: typeof conflicts[number] }
    | null
  >(null);
  const mapRef = useRef(null);

  const zones = [
    { id: 'all', name: 'All India' },
    { id: 'northern', name: 'Northern Railway' },
    { id: 'western', name: 'Western Railway' },
    { id: 'central', name: 'Central Railway' },
    { id: 'eastern', name: 'Eastern Railway' },
    { id: 'southern', name: 'Southern Railway' },
  ];

  const stations = [
    { id: '1', name: 'New Delhi', code: 'NDLS', coordinates: { x: 400, y: 200 }, zone: 'northern', status: 'operational', trains: 15 },
    { id: '2', name: 'Mumbai Central', code: 'BCT', coordinates: { x: 200, y: 400 }, zone: 'western', status: 'operational', trains: 12 },
    { id: '3', name: 'Chennai Central', code: 'MAS', coordinates: { x: 500, y: 600 }, zone: 'southern', status: 'operational', trains: 8 },
    { id: '4', name: 'Kolkata', code: 'KOAA', coordinates: { x: 600, y: 300 }, zone: 'eastern', status: 'operational', trains: 10 },
    { id: '5', name: 'Bangalore', code: 'SBC', coordinates: { x: 450, y: 550 }, zone: 'southern', status: 'maintenance', trains: 6 },
    { id: '6', name: 'Pune', code: 'PUNE', coordinates: { x: 250, y: 450 }, zone: 'central', status: 'operational', trains: 7 },
    { id: '7', name: 'Ahmedabad', code: 'ADI', coordinates: { x: 150, y: 350 }, zone: 'western', status: 'operational', trains: 9 },
    { id: '8', name: 'Hyderabad', code: 'HYB', coordinates: { x: 480, y: 500 }, zone: 'southern', status: 'operational', trains: 11 },
  ];

  const trains = [
    { id: '12345', name: 'Shatabdi Express', coordinates: { x: 350, y: 250 }, status: 'on-time', speed: 95, route: 'NDLS-CDG' },
    { id: '12346', name: 'Rajdhani Express', coordinates: { x: 300, y: 350 }, status: 'delayed', speed: 110, route: 'BCT-NDLS' },
    { id: '12347', name: 'Duronto Express', coordinates: { x: 480, y: 450 }, status: 'early', speed: 105, route: 'MAS-NDLS' },
    { id: '12348', name: 'Garib Rath', coordinates: { x: 550, y: 350 }, status: 'on-time', speed: 85, route: 'KOAA-NDLS' },
  ];

  const trackSegments = [
    { id: '1', from: 'NDLS', to: 'BCT', status: 'free', occupancy: 0 },
    { id: '2', from: 'NDLS', to: 'MAS', status: 'occupied', occupancy: 75 },
    { id: '3', from: 'NDLS', to: 'KOAA', status: 'congested', occupancy: 90 },
    { id: '4', from: 'BCT', to: 'PUNE', status: 'free', occupancy: 25 },
    { id: '5', from: 'MAS', to: 'SBC', status: 'maintenance', occupancy: 0 },
  ];

  const conflicts = [
    { id: '1', location: { x: 380, y: 280 }, severity: 'high', trains: ['12345', '12349'] },
    { id: '2', location: { x: 280, y: 380 }, severity: 'medium', trains: ['12346', '12350'] },
  ];

  const handleMouseDown = (e: { clientX: number; clientY: number; }) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: { clientX: number; clientY: number; }) => {
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

  interface ZoomDirection {
    direction: 'in' | 'out';
  }

  const handleZoom = (direction: ZoomDirection['direction']) => {
    setZoom((prev: number) => {
      const newZoom = direction === 'in' ? prev * 1.2 : prev / 1.2;
      return Math.max(0.5, Math.min(3, newZoom));
    });
  };

  const resetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  interface StationStatus {
    status: 'operational' | 'maintenance' | 'blocked' | string;
  }

  const getStationColor = (status: StationStatus['status']): string => {
    switch (status) {
      case 'operational': return 'fill-green-500 stroke-green-700';
      case 'maintenance': return 'fill-yellow-500 stroke-yellow-700';
      case 'blocked': return 'fill-red-500 stroke-red-700';
      default: return 'fill-gray-500 stroke-gray-700';
    }
  };

  const getTrainColor = (status: string) => {
    switch (status) {
      case 'on-time': return 'fill-green-600';
      case 'delayed': return 'fill-red-600';
      case 'early': return 'fill-blue-600';
      default: return 'fill-gray-600';
    }
  };

  const getTrackColor = (status: string) => {
    switch (status) {
      case 'free': return 'stroke-green-500';
      case 'occupied': return 'stroke-yellow-500';
      case 'congested': return 'stroke-red-500';
      case 'maintenance': return 'stroke-gray-500';
      default: return 'stroke-gray-400';
    }
  };

  const filteredStations = selectedZone === 'all' ? stations : stations.filter(s => s.zone === selectedZone);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-navy-900">Traffic Control Map</h1>
        <p className="text-gray-600 mt-2">Interactive network visualization and control</p>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Navigation className="w-5 h-5 text-gray-400" />
              <select
                value={selectedZone}
                onChange={(e) => setSelectedZone(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-saffron-500 focus:border-transparent"
              >
                {zones.map(zone => (
                  <option key={zone.id} value={zone.id}>{zone.name}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleZoom('in')}
              className="p-2 bg-navy-600 text-white rounded-lg hover:bg-navy-700 transition-colors"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleZoom('out')}
              className="p-2 bg-navy-600 text-white rounded-lg hover:bg-navy-700 transition-colors"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              onClick={resetView}
              className="p-2 bg-navy-600 text-white rounded-lg hover:bg-navy-700 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Map */}
        <div className="lg:col-span-3 bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-navy-800 text-white p-4">
            <h3 className="text-lg font-semibold">Network Overview</h3>
            <p className="text-blue-200 text-sm">Zoom: {(zoom * 100).toFixed(0)}% | Active Trains: {trains.length}</p>
          </div>

          <div
            ref={mapRef}
            className="h-96 lg:h-[600px] overflow-hidden cursor-grab active:cursor-grabbing select-none relative bg-gray-100"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            <svg
              width="100%"
              height="100%"
              viewBox="0 0 800 700"
              style={{
                transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
                transformOrigin: 'center',
              }}
              className="bg-blue-50"
            >
              {/* Grid */}
              <defs>
                <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
                  <path d="M 50 0 L 0 0 0 50" fill="none" stroke="rgb(200, 200, 200)" strokeWidth="1" opacity="0.3" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />

              {/* Track Lines */}
              <g className="tracks">
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
                      className={`${getTrackColor(segment.status)} stroke-4`}
                      strokeDasharray={segment.status === 'maintenance' ? '10,5' : 'none'}
                    />
                  );
                })}
              </g>

              {/* Stations */}
              <g className="stations">
                {filteredStations.map((station) => (
                  <g key={station.id}>
                    <circle
                      cx={station.coordinates.x}
                      cy={station.coordinates.y}
                      r="12"
                      className={`${getStationColor(station.status)} cursor-pointer hover:opacity-80 stroke-2`}
                      onClick={() => setSelectedElement({ type: 'station', data: station })}
                    />
                    <text
                      x={station.coordinates.x}
                      y={station.coordinates.y - 18}
                      className="fill-navy-900 text-xs font-medium text-center"
                      textAnchor="middle"
                    >
                      {station.code}
                    </text>
                    <text
                      x={station.coordinates.x}
                      y={station.coordinates.y + 25}
                      className="fill-gray-600 text-xs text-center"
                      textAnchor="middle"
                    >
                      {station.trains} trains
                    </text>
                  </g>
                ))}
              </g>

              {/* Trains */}
              <g className="trains">
                {trains.map((train) => (
                  <g key={train.id}>
                    <rect
                      x={train.coordinates.x - 8}
                      y={train.coordinates.y - 6}
                      width="16"
                      height="12"
                      rx="3"
                      className={`${getTrainColor(train.status)} cursor-pointer hover:opacity-80`}
                      onClick={() => setSelectedElement({ type: 'train', data: train })}
                    />
                    <text
                      x={train.coordinates.x}
                      y={train.coordinates.y + 20}
                      className="fill-navy-900 text-xs font-medium text-center"
                      textAnchor="middle"
                    >
                      {train.id}
                    </text>
                  </g>
                ))}
              </g>

              {/* Conflicts */}
              <g className="conflicts">
                {conflicts.map((conflict) => (
                  <g key={conflict.id}>
                    <circle
                      cx={conflict.location.x}
                      cy={conflict.location.y}
                      r="15"
                      className="fill-red-500 fill-opacity-30 stroke-red-600 stroke-2 animate-pulse cursor-pointer"
                      onClick={() => setSelectedElement({ type: 'conflict', data: conflict })}
                    />
                    <AlertTriangle
                      x={conflict.location.x - 6}
                      y={conflict.location.y - 6}
                      className="w-3 h-3 fill-red-600"
                    />
                  </g>
                ))}
              </g>
            </svg>
          </div>

          {/* Legend */}
          <div className="p-4 bg-gray-50 border-t">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
              <div className="space-y-2">
                <h4 className="font-medium text-navy-900">Stations</h4>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span>Operational</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span>Maintenance</span>
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium text-navy-900">Trains</h4>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-2 bg-green-600 rounded"></div>
                  <span>On Time</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-2 bg-red-600 rounded"></div>
                  <span>Delayed</span>
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium text-navy-900">Tracks</h4>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-1 bg-green-500"></div>
                  <span>Free</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-1 bg-red-500"></div>
                  <span>Congested</span>
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium text-navy-900">Conflicts</h4>
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="w-3 h-3 text-red-600" />
                  <span>Active Alert</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Details Panel */}
        <div className="space-y-6">
          {/* Selected Element Details */}
          {selectedElement && (
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-navy-900 mb-4">
                {selectedElement.type === 'station' ? 'Station Details' :
                  selectedElement.type === 'train' ? 'Train Details' : 'Conflict Details'}
              </h3>

              {selectedElement.type === 'station' && (
                <div className="space-y-3">
                  <div>
                    <span className="text-gray-600">Name:</span>
                    <span className="ml-2 font-medium">{selectedElement.data.name}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Code:</span>
                    <span className="ml-2 font-medium">{selectedElement.data.code}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Zone:</span>
                    <span className="ml-2 font-medium capitalize">{selectedElement.data.zone} Railway</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Status:</span>
                    <span className={`ml-2 font-medium capitalize ${selectedElement.data.status === 'operational' ? 'text-green-600' : 'text-yellow-600'
                      }`}>
                      {selectedElement.data.status}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Active Trains:</span>
                    <span className="ml-2 font-medium">{selectedElement.data.trains}</span>
                  </div>
                  {currentRole === 'traffic-manager' && (
                    <div className="pt-4 space-y-2">
                      <button className="w-full bg-saffron-500 hover:bg-saffron-600 text-white px-4 py-2 rounded-lg transition-colors text-sm">
                        Schedule Maintenance
                      </button>
                      <button className="w-full bg-navy-600 hover:bg-navy-700 text-white px-4 py-2 rounded-lg transition-colors text-sm">
                        View Platform Status
                      </button>
                    </div>
                  )}
                </div>
              )}

              {selectedElement.type === 'train' && (
                <div className="space-y-3">
                  <div>
                    <span className="text-gray-600">Name:</span>
                    <span className="ml-2 font-medium">{selectedElement.data.name}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Number:</span>
                    <span className="ml-2 font-medium">{selectedElement.data.id}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Route:</span>
                    <span className="ml-2 font-medium">{selectedElement.data.route}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Status:</span>
                    <span className={`ml-2 font-medium capitalize ${selectedElement.data.status === 'on-time' ? 'text-green-600' :
                        selectedElement.data.status === 'delayed' ? 'text-red-600' : 'text-blue-600'
                      }`}>
                      {selectedElement.data.status}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Speed:</span>
                    <span className="ml-2 font-medium">{selectedElement.data.speed} km/h</span>
                  </div>
                  {currentRole !== 'station-master' && (
                    <div className="pt-4 space-y-2">
                      <button className="w-full bg-saffron-500 hover:bg-saffron-600 text-white px-4 py-2 rounded-lg transition-colors text-sm">
                        Reroute Train
                      </button>
                      <button className="w-full bg-navy-600 hover:bg-navy-700 text-white px-4 py-2 rounded-lg transition-colors text-sm">
                        Priority Signal
                      </button>
                    </div>
                  )}
                </div>
              )}

              {selectedElement.type === 'conflict' && (
                <div className="space-y-3">
                  <div>
                    <span className="text-gray-600">Severity:</span>
                    <span className={`ml-2 font-medium capitalize ${selectedElement.data.severity === 'high' ? 'text-red-600' : 'text-yellow-600'
                      }`}>
                      {selectedElement.data.severity}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Affected Trains:</span>
                    <span className="ml-2 font-medium">{selectedElement.data.trains.join(', ')}</span>
                  </div>
                  <div className="pt-4 space-y-2">
                    <button className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors text-sm">
                      Resolve Conflict
                    </button>
                    <button className="w-full bg-saffron-500 hover:bg-saffron-600 text-white px-4 py-2 rounded-lg transition-colors text-sm">
                      View Suggestions
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Quick Stats */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold text-navy-900 mb-4">Network Status</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Active Trains</span>
                <span className="font-bold text-navy-900">{trains.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Operational Stations</span>
                <span className="font-bold text-green-600">
                  {stations.filter(s => s.status === 'operational').length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Active Conflicts</span>
                <span className="font-bold text-red-600">{conflicts.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Maintenance</span>
                <span className="font-bold text-yellow-600">
                  {stations.filter(s => s.status === 'maintenance').length}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          {currentRole === 'traffic-manager' && (
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-navy-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors text-sm">
                  Emergency Stop All
                </button>
                <button className="w-full bg-saffron-500 hover:bg-saffron-600 text-white px-4 py-2 rounded-lg transition-colors text-sm">
                  Generate Report
                </button>
                <button className="w-full bg-navy-600 hover:bg-navy-700 text-white px-4 py-2 rounded-lg transition-colors text-sm">
                  Broadcast Alert
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrafficMap;