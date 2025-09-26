import React, { useState, useRef } from 'react';
import { Clock, Brain as Train, MapPin } from 'lucide-react';

interface TimelineEvent {
  id: string;
  trainNumber: string;
  trainName: string;
  station: string;
  stationCode: string;
  eventType: 'arrival' | 'departure';
  scheduledTime: Date;
  actualTime?: Date;
  status: 'scheduled' | 'arrived' | 'departed' | 'delayed';
  platform?: string;
  delay: number;
}

const Timeline: React.FC = () => {
  const [selectedTrain, setSelectedTrain] = useState<string | null>(null);
  const [timelineStart, setTimelineStart] = useState(new Date());
  const timelineRef = useRef<HTMLDivElement>(null);

  // Mock timeline data
  const events: TimelineEvent[] = [
    {
      id: '1',
      trainNumber: '12345',
      trainName: 'Deccan Express',
      station: 'Chhatrapati Shivaji Maharaj Terminus',
      stationCode: 'CSMT',
      eventType: 'departure',
      scheduledTime: new Date(Date.now() + 10 * 60000),
      status: 'scheduled',
      platform: '1',
      delay: 0,
    },
    {
      id: '2',
      trainNumber: '12345',
      trainName: 'Deccan Express',
      station: 'Dadar',
      stationCode: 'DR',
      eventType: 'arrival',
      scheduledTime: new Date(Date.now() + 25 * 60000),
      status: 'scheduled',
      platform: '3',
      delay: 0,
    },
    {
      id: '3',
      trainNumber: '12346',
      trainName: 'Mumbai Local',
      station: 'Dadar',
      stationCode: 'DR',
      eventType: 'departure',
      scheduledTime: new Date(Date.now() + 15 * 60000),
      actualTime: new Date(Date.now() + 30 * 60000),
      status: 'delayed',
      platform: '2',
      delay: 15,
    },
    {
      id: '4',
      trainNumber: '12347',
      trainName: 'Konkan Express',
      station: 'Kurla',
      stationCode: 'LTT',
      eventType: 'arrival',
      scheduledTime: new Date(Date.now() + 35 * 60000),
      status: 'scheduled',
      platform: '4',
      delay: 0,
    },
    {
      id: '5',
      trainNumber: '12346',
      trainName: 'Mumbai Local',
      station: 'Kurla',
      stationCode: 'LTT',
      eventType: 'arrival',
      scheduledTime: new Date(Date.now() + 45 * 60000),
      status: 'scheduled',
      platform: '1',
      delay: 15,
    },
  ];

  const getStatusColor = (status: string, delay: number) => {
    if (delay > 0) return 'text-red-600 bg-red-50 border-red-200';
    switch (status) {
      case 'arrived':
      case 'departed':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'delayed':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-blue-600 bg-blue-50 border-blue-200';
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-IN', { hour12: false, hour: '2-digit', minute: '2-digit' });
  };

  const getTimePosition = (time: Date) => {
    const now = Date.now();
    const timeMs = time.getTime();
    const hourInMs = 60 * 60 * 1000;
    const positionHours = (timeMs - now) / hourInMs;
    return Math.max(0, positionHours * 120); // 120px per hour
  };

  const trains = [...new Set(events.map(e => e.trainNumber))];

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Timeline Header */}
      <div className="bg-navy-800 text-white p-4 border-b border-navy-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Clock className="w-5 h-5" />
            <h3 className="text-lg font-semibold">Train Movement Timeline</h3>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-sm">
              <span className="text-blue-200">Current Time: </span>
              <span className="font-medium">{formatTime(new Date())}</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-xs">On Time</span>
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-xs">Delayed</span>
            </div>
          </div>
        </div>
      </div>

      {/* Timeline Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Train List */}
        <div className="w-64 bg-gray-50 border-r border-gray-200 overflow-y-auto">
          <div className="p-4">
            <h4 className="font-medium text-navy-900 mb-3">Active Trains</h4>
            <div className="space-y-2">
              {trains.map((trainNumber) => {
                const train = events.find(e => e.trainNumber === trainNumber);
                const isSelected = selectedTrain === trainNumber;
                const hasDelays = events.some(e => e.trainNumber === trainNumber && e.delay > 0);
                
                return (
                  <button
                    key={trainNumber}
                    onClick={() => setSelectedTrain(isSelected ? null : trainNumber)}
                    className={`w-full text-left p-3 rounded-lg border transition-colors ${
                      isSelected ? 'bg-saffron-100 border-saffron-300' : 'bg-white border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Train className="w-4 h-4 text-navy-600" />
                        <div>
                          <div className="font-medium text-navy-900">{trainNumber}</div>
                          <div className="text-xs text-gray-600 truncate">{train?.trainName}</div>
                        </div>
                      </div>
                      {hasDelays && (
                        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Timeline Chart */}
        <div className="flex-1 overflow-auto" ref={timelineRef}>
          <div className="relative h-full min-w-full" style={{ width: '800px' }}>
            {/* Time Grid */}
            <div className="absolute top-0 left-0 right-0 h-12 bg-gray-100 border-b border-gray-200">
              <div className="relative h-full">
                {[...Array(8)].map((_, i) => {
                  const time = new Date(Date.now() + i * 15 * 60000); // 15-minute intervals
                  return (
                    <div
                      key={i}
                      className="absolute top-0 bottom-0 border-l border-gray-300"
                      style={{ left: `${i * 100}px` }}
                    >
                      <div className="p-2 text-xs text-gray-600 font-medium">
                        {formatTime(time)}
                      </div>
                    </div>
                  );
                })}
                {/* Current Time Indicator */}
                <div className="absolute top-0 bottom-0 w-0.5 bg-red-500 z-10">
                  <div className="absolute -top-1 -left-1 w-3 h-3 bg-red-500 rounded-full"></div>
                </div>
              </div>
            </div>

            {/* Timeline Events */}
            <div className="mt-12 p-4">
              {trains.map((trainNumber, trainIndex) => {
                const trainEvents = events.filter(e => e.trainNumber === trainNumber);
                const isHighlighted = !selectedTrain || selectedTrain === trainNumber;
                
                return (
                  <div
                    key={trainNumber}
                    className={`mb-6 transition-opacity ${isHighlighted ? 'opacity-100' : 'opacity-30'}`}
                  >
                    <div className="flex items-center mb-2">
                      <Train className="w-4 h-4 text-navy-600 mr-2" />
                      <span className="font-medium text-navy-900">{trainNumber}</span>
                      <span className="text-sm text-gray-600 ml-2">{trainEvents[0]?.trainName}</span>
                    </div>
                    
                    <div className="relative">
                      {/* Train Path Line */}
                      <div className="absolute top-4 left-0 right-0 h-0.5 bg-gray-300"></div>
                      
                      {/* Events */}
                      {trainEvents.map((event, eventIndex) => {
                        const position = getTimePosition(event.scheduledTime);
                        const actualPosition = event.actualTime ? getTimePosition(event.actualTime) : position;
                        
                        return (
                          <div key={event.id} className="relative">
                            {/* Scheduled Event */}
                            <div
                              className="absolute top-0"
                              style={{ left: `${position}px` }}
                            >
                              <div className={`w-8 h-8 rounded-full border-2 bg-white flex items-center justify-center ${getStatusColor(event.status, event.delay)}`}>
                                {event.eventType === 'arrival' ? (
                                  <MapPin className="w-3 h-3" />
                                ) : (
                                  <Train className="w-3 h-3" />
                                )}
                              </div>
                              <div className="absolute top-10 left-1/2 transform -translate-x-1/2 text-center min-w-max">
                                <div className="text-xs font-medium text-navy-900">{event.stationCode}</div>
                                <div className="text-xs text-gray-600">{formatTime(event.scheduledTime)}</div>
                                {event.delay > 0 && (
                                  <div className="text-xs text-red-600 font-medium">+{event.delay}m</div>
                                )}
                              </div>
                            </div>
                            
                            {/* Actual Event (if different) */}
                            {event.actualTime && actualPosition !== position && (
                              <div
                                className="absolute top-0"
                                style={{ left: `${actualPosition}px` }}
                              >
                                <div className="w-6 h-6 rounded-full bg-red-500 border-2 border-white flex items-center justify-center">
                                  <div className="w-2 h-2 bg-white rounded-full"></div>
                                </div>
                              </div>
                            )}
                            
                            {/* Connection Line to Next Event */}
                            {eventIndex < trainEvents.length - 1 && (
                              <div
                                className="absolute top-4 h-0.5 bg-navy-400"
                                style={{
                                  left: `${position + 16}px`,
                                  width: `${getTimePosition(trainEvents[eventIndex + 1].scheduledTime) - position - 32}px`
                                }}
                              ></div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Timeline;