import React, { useState } from 'react';
import { Zap, AlertCircle, CheckCircle, Clock, Settings } from 'lucide-react';
import { TrackSegment } from '../types';

const TrackControl: React.FC = () => {
  const [selectedSegment, setSelectedSegment] = useState<string | null>(null);
  const [trackSegments, setTrackSegments] = useState<TrackSegment[]>([
    {
      id: '1',
      name: 'CSMT-DR-01',
      from: 'CSMT',
      to: 'DR',
      status: 'occupied',
      occupyingTrain: '12345',
      predictedClearTime: new Date(Date.now() + 8 * 60000),
      signalState: 'red'
    },
    {
      id: '2',
      name: 'CSMT-DR-02',
      from: 'CSMT',
      to: 'DR',
      status: 'free',
      signalState: 'green'
    },
    {
      id: '3',
      name: 'DR-LTT-01',
      from: 'DR',
      to: 'LTT',
      status: 'reserved',
      predictedClearTime: new Date(Date.now() + 15 * 60000),
      signalState: 'yellow'
    },
    {
      id: '4',
      name: 'DR-LTT-02',
      from: 'DR',
      to: 'LTT',
      status: 'free',
      signalState: 'green'
    },
    {
      id: '5',
      name: 'LTT-TNA-01',
      from: 'LTT',
      to: 'TNA',
      status: 'occupied',
      occupyingTrain: '12347',
      predictedClearTime: new Date(Date.now() + 12 * 60000),
      signalState: 'red'
    },
    {
      id: '6',
      name: 'TNA-KYN-01',
      from: 'TNA',
      to: 'KYN',
      status: 'blocked',
      signalState: 'red'
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'free': return 'bg-green-100 border-green-500 text-green-800';
      case 'occupied': return 'bg-red-100 border-red-500 text-red-800';
      case 'reserved': return 'bg-yellow-100 border-yellow-500 text-yellow-800';
      case 'blocked': return 'bg-gray-100 border-gray-500 text-gray-800';
      default: return 'bg-gray-100 border-gray-300 text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'free': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'occupied': return <AlertCircle className="w-4 h-4 text-red-600" />;
      case 'reserved': return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'blocked': return <AlertCircle className="w-4 h-4 text-gray-600" />;
      default: return <AlertCircle className="w-4 h-4 text-gray-400" />;
    }
  };

  const getSignalColor = (state: string) => {
    switch (state) {
      case 'green': return 'bg-green-500';
      case 'yellow': return 'bg-yellow-500';
      case 'red': return 'bg-red-500';
      default: return 'bg-gray-400';
    }
  };

  const handleToggleSignal = (segmentId: string) => {
    setTrackSegments(prev => prev.map(segment => {
      if (segment.id === segmentId) {
        let newState: 'green' | 'yellow' | 'red';
        switch (segment.signalState) {
          case 'green': newState = 'yellow'; break;
          case 'yellow': newState = 'red'; break;
          case 'red': newState = 'green'; break;
          default: newState = 'green';
        }
        return { ...segment, signalState: newState };
      }
      return segment;
    }));
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-IN', { hour12: false, hour: '2-digit', minute: '2-digit' });
  };

  const selectedSegmentData = trackSegments.find(s => s.id === selectedSegment);

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="bg-navy-800 text-white p-4 border-b border-navy-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Zap className="w-5 h-5" />
            <h3 className="text-lg font-semibold">Track Section Control</h3>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-xs">Free</span>
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span className="text-xs">Reserved</span>
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-xs">Occupied</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Track Segments List */}
        <div className="w-1/2 border-r border-gray-200 overflow-y-auto">
          <div className="p-4">
            <h4 className="font-medium text-navy-900 mb-4">Track Segments</h4>
            <div className="space-y-3">
              {trackSegments.map((segment) => (
                <div
                  key={segment.id}
                  onClick={() => setSelectedSegment(segment.id)}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${getStatusColor(segment.status)} ${
                    selectedSegment === segment.id ? 'ring-2 ring-saffron-500' : ''
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(segment.status)}
                      <span className="font-semibold">{segment.name}</span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleSignal(segment.id);
                      }}
                      className={`w-6 h-6 rounded-full border-2 border-white shadow-sm ${getSignalColor(segment.signalState)}`}
                      title={`Signal: ${segment.signalState.toUpperCase()}`}
                    />
                  </div>
                  
                  <div className="text-sm">
                    <div className="flex justify-between mb-1">
                      <span className="text-gray-600">Route:</span>
                      <span className="font-medium">{segment.from} → {segment.to}</span>
                    </div>
                    
                    {segment.occupyingTrain && (
                      <div className="flex justify-between mb-1">
                        <span className="text-gray-600">Occupying:</span>
                        <span className="font-medium text-red-700">{segment.occupyingTrain}</span>
                      </div>
                    )}
                    
                    {segment.predictedClearTime && (
                      <div className="flex justify-between mb-1">
                        <span className="text-gray-600">Clear by:</span>
                        <span className="font-medium">{formatTime(segment.predictedClearTime)}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Control Panel */}
        <div className="w-1/2 overflow-y-auto">
          <div className="p-4">
            {selectedSegmentData ? (
              <div>
                <h4 className="font-medium text-navy-900 mb-4">
                  Control Panel - {selectedSegmentData.name}
                </h4>

                {/* Segment Details */}
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <h5 className="font-medium text-navy-800 mb-3">Segment Details</h5>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Status:</span>
                      <div className="flex items-center space-x-2 mt-1">
                        {getStatusIcon(selectedSegmentData.status)}
                        <span className="font-medium capitalize">{selectedSegmentData.status}</span>
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-600">Signal State:</span>
                      <div className="flex items-center space-x-2 mt-1">
                        <div className={`w-3 h-3 rounded-full ${getSignalColor(selectedSegmentData.signalState)}`} />
                        <span className="font-medium capitalize">{selectedSegmentData.signalState}</span>
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-600">From:</span>
                      <div className="font-medium mt-1">{selectedSegmentData.from}</div>
                    </div>
                    <div>
                      <span className="text-gray-600">To:</span>
                      <div className="font-medium mt-1">{selectedSegmentData.to}</div>
                    </div>
                    {selectedSegmentData.occupyingTrain && (
                      <>
                        <div>
                          <span className="text-gray-600">Occupying Train:</span>
                          <div className="font-medium mt-1 text-red-700">{selectedSegmentData.occupyingTrain}</div>
                        </div>
                        <div>
                          <span className="text-gray-600">Predicted Clear:</span>
                          <div className="font-medium mt-1">{selectedSegmentData.predictedClearTime ? formatTime(selectedSegmentData.predictedClearTime) : 'Unknown'}</div>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Control Actions */}
                <div className="space-y-4">
                  <div>
                    <h5 className="font-medium text-navy-800 mb-3">Signal Control</h5>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        onClick={() => handleToggleSignal(selectedSegmentData.id)}
                        className="p-3 bg-green-100 hover:bg-green-200 text-green-800 rounded-lg transition-colors flex flex-col items-center"
                      >
                        <div className="w-4 h-4 bg-green-500 rounded-full mb-1" />
                        <span className="text-xs font-medium">Green</span>
                      </button>
                      <button
                        onClick={() => handleToggleSignal(selectedSegmentData.id)}
                        className="p-3 bg-yellow-100 hover:bg-yellow-200 text-yellow-800 rounded-lg transition-colors flex flex-col items-center"
                      >
                        <div className="w-4 h-4 bg-yellow-500 rounded-full mb-1" />
                        <span className="text-xs font-medium">Yellow</span>
                      </button>
                      <button
                        onClick={() => handleToggleSignal(selectedSegmentData.id)}
                        className="p-3 bg-red-100 hover:bg-red-200 text-red-800 rounded-lg transition-colors flex flex-col items-center"
                      >
                        <div className="w-4 h-4 bg-red-500 rounded-full mb-1" />
                        <span className="text-xs font-medium">Red</span>
                      </button>
                    </div>
                  </div>

                  <div>
                    <h5 className="font-medium text-navy-800 mb-3">Quick Actions</h5>
                    <div className="space-y-2">
                      <button className="w-full p-3 bg-saffron-100 hover:bg-saffron-200 text-saffron-800 rounded-lg transition-colors text-sm font-medium">
                        Reserve Segment
                      </button>
                      <button className="w-full p-3 bg-blue-100 hover:bg-blue-200 text-blue-800 rounded-lg transition-colors text-sm font-medium">
                        Release Segment
                      </button>
                      <button className="w-full p-3 bg-purple-100 hover:bg-purple-200 text-purple-800 rounded-lg transition-colors text-sm font-medium">
                        Force Clear
                      </button>
                      <button className="w-full p-3 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg transition-colors text-sm font-medium">
                        Block for Maintenance
                      </button>
                    </div>
                  </div>

                  <div>
                    <h5 className="font-medium text-navy-800 mb-3">Advanced Settings</h5>
                    <button className="w-full p-3 bg-navy-100 hover:bg-navy-200 text-navy-800 rounded-lg transition-colors text-sm font-medium flex items-center justify-center space-x-2">
                      <Settings className="w-4 h-4" />
                      <span>Configure Interlock</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-500 mt-8">
                <Settings className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Select a track segment to view controls</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackControl;