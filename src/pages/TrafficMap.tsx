import React, { useState, useRef, useEffect } from 'react';
import { ZoomIn, ZoomOut, RotateCcw, MapPin, Brain, AlertTriangle, Settings, Navigation, Play, Square, RotateCw } from 'lucide-react';

interface TrafficMapProps {
  currentRole: string;
}

interface Train {
  id: string;
  name: string;
  pos: number;
  speed: number;
  priority: number;
  delay: number;
  line: 'up' | 'down';
  color: string;
  status: 'RUNNING' | 'HALTED' | 'COMPLETED' | 'BREAKDOWN';
  route: 'main' | 'loop';
}

interface Signal {
  aspect: 'GREEN' | 'RED';
}

const TrafficMap: React.FC<TrafficMapProps> = ({ currentRole }) => {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [selectedZone, setSelectedZone] = useState('all');
  const [isSimulationRunning, setIsSimulationRunning] = useState(false);
  const [tick, setTick] = useState(0);
  const [optimizerStatus, setOptimizerStatus] = useState('IDLE');
  const [eventLog, setEventLog] = useState<Array<{ message: string, type: string, tick: number }>>([]);
  const [alerts, setAlerts] = useState<string[]>([]);
  const mapRef = useRef(null);
  const simulationInterval = useRef<NodeJS.Timeout | null>(null);

  const [trains, setTrains] = useState<Record<string, Train>>({});
  const [signals, setSignals] = useState<Record<string, Signal>>({
    'up_uri_entry': { aspect: 'GREEN' },
    'up_uri_exit': { aspect: 'GREEN' },
    'down_uri_entry': { aspect: 'GREEN' },
    'down_uri_exit': { aspect: 'GREEN' },
  });
  const [network, setNetwork] = useState({ tracks: { 'URI_LOOP': 'EMPTY' } });

  const trainTemplates: Record<string, Omit<Train, 'status' | 'route'>> = {
    '12129': { id: '12129', name: 'Azad Hind Exp', pos: 5, speed: 2.0, priority: 8, delay: 5, line: 'up', color: 'bg-sky-500' },
    '01555': { id: '01555', name: 'Goods UP', pos: 15, speed: 1.2, priority: 1, delay: 0, line: 'up', color: 'bg-amber-600' },
    '12025': { id: '12025', name: 'Deccan Queen', pos: 25, speed: 2.5, priority: 10, delay: 0, line: 'up', color: 'bg-rose-600' },
    '11078': { id: '11078', name: 'Jhelum Exp', pos: 95, speed: -2.2, priority: 8, delay: 0, line: 'down', color: 'bg-teal-500' },
    '01488': { id: '01488', name: 'PUNE-DD MEMU', pos: 80, speed: -1.8, priority: 5, delay: 0, line: 'down', color: 'bg-lime-600' },
    '01560': { id: '01560', name: 'Goods DOWN', pos: 65, speed: -1.2, priority: 1, delay: 0, line: 'down', color: 'bg-amber-600' },
    '22159': { id: '22159', name: 'CSMT-MAS Exp', pos: 1, speed: 2.1, priority: 7, delay: 10, line: 'up', color: 'bg-fuchsia-500' },
  };

  const zones = [
    { id: 'all', name: 'All India' },
    { id: 'northern', name: 'Northern Railway' },
    { id: 'western', name: 'Western Railway' },
    { id: 'central', name: 'Central Railway' },
    { id: 'eastern', name: 'Eastern Railway' },
    { id: 'southern', name: 'Southern Railway' },
  ];

  const logEvent = (message: string, type: string = 'info') => {
    setEventLog(prev => [...prev, { message, type, tick }]);
  };

  const logAlert = (message: string) => {
    setAlerts(prev => [message, ...prev.slice(0, 4)]);
  };

  const scenario = [
    { time: 1, func: () => logEvent('High-density feed started.') },
    {
      time: 3,
      func: () => {
        logEvent('Conflict: 11078 Jhelum Exp catching up to 01560 Goods.', 'conflict');
        logEvent('Conflict: 12025 Deccan Queen catching up to slower traffic.', 'conflict');
        logAlert('Multiple conflicts detected.');
      }
    },
    {
      time: 4,
      func: () => {
        setOptimizerStatus('OPTIMIZING...');
        logEvent('Triggering CP-SAT solver...');
      }
    },
    {
      time: 6,
      func: () => {
        setOptimizerStatus('EXECUTING PLAN');
        logEvent('AI DECISION 1: Route 01560 Goods (DOWN) to URI loop for overtake.', 'decision');
        setTrains(prev => ({
          ...prev,
          '01560': { ...prev['01560'], route: 'loop' }
        }));
      }
    },
    {
      time: 9,
      func: () => {
        setTrains(prev => ({
          ...prev,
          '01560': { ...prev['01560'], status: 'HALTED', delay: prev['01560'].delay + 5 }
        }));
        setNetwork(prev => ({ ...prev, tracks: { URI_LOOP: 'OCCUPIED_BY_01560' } }));
        logEvent('01560 Goods secured on loop. Passing 11078 Jhelum on main DOWN line.', 'info');
      }
    },
    {
      time: 12,
      func: () => {
        logEvent('AI DECISION 2: Route 01555 Goods (UP) to URI loop for overtake.', 'decision');
        setTrains(prev => ({
          ...prev,
          '01555': { ...prev['01555'], route: 'loop' }
        }));
      }
    },
    {
      time: 15,
      func: () => {
        setTrains(prev => ({
          ...prev,
          '01555': { ...prev['01555'], status: 'HALTED', delay: prev['01555'].delay + 5 }
        }));
        logEvent('01555 Goods secured on loop. Passing express trains.', 'info');
      }
    },
    {
      time: 22,
      func: () => {
        logEvent('High-priority traffic cleared. Resuming halted trains.', 'info');
        logEvent('AI DECISION 3: Dispatch 01560 Goods from loop to main DOWN.', 'decision');
        setTrains(prev => ({
          ...prev,
          '01560': { ...prev['01560'], status: 'RUNNING', route: 'main' }
        }));
      }
    },
    {
      time: 23,
      func: () => {
        logEvent('AI DECISION 4: Dispatch 01555 Goods from loop to main UP.', 'decision');
        setTrains(prev => ({
          ...prev,
          '01555': { ...prev['01555'], status: 'RUNNING', route: 'main' }
        }));
        setNetwork(prev => ({ ...prev, tracks: { URI_LOOP: 'EMPTY' } }));
      }
    },
    {
      time: 28,
      func: () => {
        logEvent('All conflicts resolved. Network stable.', 'info');
        setOptimizerStatus('STABLE');
      }
    }
  ];

  const setupSimulation = () => {
    const newTrains: Record<string, Train> = {};
    Object.entries(trainTemplates).forEach(([id, template]) => {
      newTrains[id] = { ...template, status: 'RUNNING', route: 'main' };
    });
    setTrains(newTrains);
    setSignals({
      'up_uri_entry': { aspect: 'GREEN' },
      'up_uri_exit': { aspect: 'GREEN' },
      'down_uri_entry': { aspect: 'GREEN' },
      'down_uri_exit': { aspect: 'GREEN' },
    });
    setNetwork({ tracks: { 'URI_LOOP': 'EMPTY' } });
  };

  const simulationLoop = () => {
    setTick(prevTick => {
      const newTick = prevTick + 1;

      setTrains(prevTrains => {
        const updatedTrains = { ...prevTrains };

        Object.entries(updatedTrains).forEach(([id, train]) => {
          if (train.status === 'COMPLETED') return;

          const canMove = train.status === 'RUNNING';
          if (canMove) {
            updatedTrains[id] = {
              ...train,
              pos: train.pos + train.speed
            };
          }

          // Boundary checks
          const updatedTrain = updatedTrains[id];
          if ((updatedTrain.line === 'up' && updatedTrain.pos >= 100) ||
            (updatedTrain.line === 'down' && updatedTrain.pos <= 0)) {
            updatedTrains[id] = { ...updatedTrain, status: 'COMPLETED' };
            logEvent(`${updatedTrain.name} (${id}) has exited the section.`);
          }
        });

        return updatedTrains;
      });

      // Execute scenario events
      scenario.forEach(event => {
        if (event.time === newTick) {
          event.func();
        }
      });

      return newTick;
    });
  };

  const startSimulation = () => {
    if (simulationInterval.current) return;
    setupSimulation();
    setIsSimulationRunning(true);
    setTick(0);
    setEventLog([]);
    setAlerts([]);
    setOptimizerStatus('MONITORING');
    simulationInterval.current = setInterval(simulationLoop, 1000);
  };

  const stopSimulation = () => {
    if (simulationInterval.current) {
      clearInterval(simulationInterval.current);
      simulationInterval.current = null;
    }
    setIsSimulationRunning(false);
    setOptimizerStatus('IDLE');
  };

  const resetSimulation = () => {
    stopSimulation();
    setTick(0);
    setEventLog([]);
    setAlerts(['No alerts.']);
    setupSimulation();
  };

  const handleDisruption = () => {
    const targetTrain = '12025';
    if (!trains[targetTrain] || trains[targetTrain].status === 'COMPLETED') {
      logEvent('Target train for disruption has already completed its run.', 'warning');
      return;
    }
    logEvent(`EXTERNAL EVENT: Breakdown on ${targetTrain}!`, 'conflict');
    logAlert(`CRITICAL: ${targetTrain} BREAKDOWN`);
    setTrains(prev => ({
      ...prev,
      [targetTrain]: { ...prev[targetTrain], status: 'BREAKDOWN', delay: 45 }
    }));
    setTimeout(() => {
      setOptimizerStatus('RE-OPTIMIZING...');
      logEvent('Disruption! Re-running optimization for all trains...');
    }, 1000);
  };

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
      case 'MONITORING': return 'bg-blue-500';
      case 'OPTIMIZING...': case 'RE-OPTIMIZING...': return 'bg-yellow-500';
      case 'EXECUTING PLAN': return 'bg-orange-500';
      case 'STABLE': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case 'decision': return 'text-indigo-700 font-bold';
      case 'conflict': return 'text-red-700 font-bold';
      case 'warning': return 'text-amber-700';
      default: return 'text-gray-600';
    }
  };

  useEffect(() => {
    return () => {
      if (simulationInterval.current) {
        clearInterval(simulationInterval.current);
      }
    };
  }, []);

  // Initialize simulation on mount
  useEffect(() => {
    setupSimulation();
    setAlerts(['No alerts.']);
  }, []);

  const activeTrains = Object.values(trains).filter(t => t.status !== 'COMPLETED');
  const delayedTrains = activeTrains.filter(t => t.delay > 0);
  const punctualityPercent = activeTrains.length > 0 ? ((activeTrains.length - delayedTrains.length) / activeTrains.length) * 100 : 100;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-indigo-600 mb-2">🚂 AI-Powered Traffic Optimization</h1>
        <p className="text-lg text-gray-600">Interactive network visualization and intelligent control system</p>
      </div>

      {/* Challenge Section */}
      <div className="mb-8 bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">The Challenge: High-Density Traffic</h2>
        <p className="text-gray-600">
          Manually managing dozens of trains with varying priorities across limited tracks and signals is a massive
          combinatorial challenge, leading to cascading delays and underutilization of infrastructure.
        </p>
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
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                {zones.map(zone => (
                  <option key={zone.id} value={zone.id}>{zone.name}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={isSimulationRunning ? stopSimulation : startSimulation}
                className={`px-4 py-2 text-white font-semibold rounded-lg transition-colors ${isSimulationRunning ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'
                  }`}
              >
                {isSimulationRunning ? <Square className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                {isSimulationRunning ? 'Stop' : 'Start'} Simulation
              </button>
              <button
                onClick={handleDisruption}
                disabled={!isSimulationRunning}
                className="px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ⚡ Disruption
              </button>
              <button
                onClick={resetSimulation}
                className="px-4 py-2 bg-gray-500 text-white font-semibold rounded-lg hover:bg-gray-600 transition-colors"
              >
                <RotateCw className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className={`px-4 py-2 text-white font-semibold rounded-lg min-w-[150px] text-center ${getStatusColor(optimizerStatus)}`}>
              STATUS: {optimizerStatus}
            </div>
            <button
              onClick={() => handleZoom('in')}
              className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleZoom('out')}
              className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              onClick={resetView}
              className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* AI Control Center Map */}
        <div className="lg:col-span-3 bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-gray-800 text-white p-4">
            <h3 className="text-lg font-semibold">AI Control Center: PUNE - DD High-Density Section</h3>
            <p className="text-blue-200 text-sm">
              Tick: {tick}s | Zoom: {(zoom * 100).toFixed(0)}% | Active Trains: {activeTrains.length}
            </p>
          </div>

          <div
            ref={mapRef}
            className="h-96 lg:h-[600px] overflow-hidden cursor-grab active:cursor-grabbing select-none relative bg-gray-100"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            <div
              style={{
                transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
                transformOrigin: 'center',
                width: '100%',
                height: '100%',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                padding: '2rem'
              }}
            >
              {/* Track System */}
              <div className="space-y-8 h-full flex flex-col justify-center">
                {/* UP Line */}
                <div className="relative">
                  <div className="w-full h-2 bg-gray-600 rounded relative">
                    {/* Stations */}
                    <div className="absolute -top-6 left-[5%] text-white font-bold text-sm transform -translate-x-1/2">PUNE</div>
                    <div className="absolute -top-6 left-[50%] text-white font-bold text-sm transform -translate-x-1/2">URI</div>
                    <div className="absolute -top-6 left-[95%] text-white font-bold text-sm transform -translate-x-1/2">DD</div>

                    {/* Signals */}
                    <div
                      className="absolute top-1/2 transform -translate-y-1/2 w-3 h-3 rounded-full border-2 border-gray-400"
                      style={{ left: '48%', backgroundColor: signals.up_uri_entry.aspect === 'GREEN' ? '#22c55e' : '#ef4444' }}
                    />
                    <div
                      className="absolute top-1/2 transform -translate-y-1/2 w-3 h-3 rounded-full border-2 border-gray-400"
                      style={{ left: '52%', backgroundColor: signals.up_uri_exit.aspect === 'GREEN' ? '#22c55e' : '#ef4444' }}
                    />

                    {/* UP Trains */}
                    {Object.values(trains).filter(t => t.line === 'up' && t.status !== 'COMPLETED').map(train => (
                      <div
                        key={train.id}
                        className={`absolute top-1/2 transform -translate-y-1/2 px-2 py-1 rounded text-white text-xs font-bold ${train.color} transition-all duration-1000 ${train.status === 'BREAKDOWN' ? 'animate-pulse border-2 border-red-500' : ''
                          }`}
                        style={{
                          left: `${train.pos}%`,
                          transform: train.route === 'loop' ? 'translateY(-200%)' : 'translateY(-50%)',
                          opacity: train.status === 'COMPLETED' ? 0 : 1
                        }}
                      >
                        {train.id} {train.name.split(' ')[0]}
                        <span className={`ml-1 text-xs px-1 rounded ${train.delay > 0 ? 'bg-red-500' : 'bg-green-500'}`}>
                          {train.delay > 0 ? `+${train.delay}m` : 'RT'}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="absolute -bottom-4 left-0 text-white text-xs">UP LINE</div>
                </div>

                {/* Loop Line */}
                <div className="flex justify-center">
                  <div className="w-1/2 h-2 bg-gray-500 rounded relative">
                    <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 text-white text-xs">LOOP</div>
                  </div>
                </div>

                {/* DOWN Line */}
                <div className="relative">
                  <div className="w-full h-2 bg-gray-600 rounded relative">
                    {/* Signals */}
                    <div
                      className="absolute top-1/2 transform -translate-y-1/2 w-3 h-3 rounded-full border-2 border-gray-400"
                      style={{ left: '52%', backgroundColor: signals.down_uri_entry.aspect === 'GREEN' ? '#22c55e' : '#ef4444' }}
                    />
                    <div
                      className="absolute top-1/2 transform -translate-y-1/2 w-3 h-3 rounded-full border-2 border-gray-400"
                      style={{ left: '48%', backgroundColor: signals.down_uri_exit.aspect === 'GREEN' ? '#22c55e' : '#ef4444' }}
                    />

                    {/* DOWN Trains */}
                    {Object.values(trains).filter(t => t.line === 'down' && t.status !== 'COMPLETED').map(train => (
                      <div
                        key={train.id}
                        className={`absolute top-1/2 transform -translate-y-1/2 px-2 py-1 rounded text-white text-xs font-bold ${train.color} transition-all duration-1000 ${train.status === 'BREAKDOWN' ? 'animate-pulse border-2 border-red-500' : ''
                          }`}
                        style={{
                          left: `${train.pos}%`,
                          transform: train.route === 'loop' ? 'translateY(200%)' : 'translateY(-50%)',
                          opacity: train.status === 'COMPLETED' ? 0 : 1
                        }}
                      >
                        {train.id} {train.name.split(' ')[0]}
                        <span className={`ml-1 text-xs px-1 rounded ${train.delay > 0 ? 'bg-red-500' : 'bg-green-500'}`}>
                          {train.delay > 0 ? `+${train.delay}m` : 'RT'}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="absolute -bottom-4 left-0 text-white text-xs">DOWN LINE</div>
                </div>
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="p-4 bg-gray-50 border-t">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
              <div className="space-y-2">
                <h4 className="font-medium text-gray-900">Trains</h4>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-2 bg-green-600 rounded"></div>
                  <span>Running</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-2 bg-red-600 rounded animate-pulse"></div>
                  <span>Breakdown</span>
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium text-gray-900">Signals</h4>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span>Clear</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span>Stop</span>
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium text-gray-900">Status</h4>
                <div className="flex items-center space-x-2">
                  <span className="text-xs bg-green-500 text-white px-1 rounded">RT</span>
                  <span>On Time</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs bg-red-500 text-white px-1 rounded">+5m</span>
                  <span>Delayed</span>
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium text-gray-900">AI Actions</h4>
                <div className="flex items-center space-x-2">
                  <Brain className="w-3 h-3 text-indigo-600" />
                  <span>Optimization</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Information Panels */}
        <div className="space-y-6">
          {/* Live Data Feed & AI Decisions */}
          <div className="bg-white rounded-lg shadow-lg p-4">
            <h4 className="font-bold text-lg mb-2 text-center border-b pb-2">Live Data Feed & AI Decisions</h4>
            <div className="h-64 overflow-y-auto space-y-1 text-sm">
              {eventLog.length === 0 ? (
                <p className="text-gray-500 text-center mt-8">Simulation has not started.</p>
              ) : (
                eventLog.slice(-20).map((event, index) => (
                  <p key={index} className={getEventColor(event.type)}>
                    <span className="font-mono">{event.tick.toString().padStart(2, '0')}s:</span> {event.message}
                  </p>
                ))
              )}
            </div>
          </div>

          {/* Network State */}
          <div className="bg-gray-900 text-white rounded-lg shadow-lg p-4">
            <h4 className="font-bold text-lg mb-2 text-center border-b border-gray-600 pb-2">Live Network State</h4>
            <pre className="h-32 overflow-y-auto text-xs font-mono">
              {JSON.stringify({
                active_trains: activeTrains.length,
                signals: {
                  up_uri_entry: signals.up_uri_entry.aspect,
                  up_uri_exit: signals.up_uri_exit.aspect,
                  down_uri_entry: signals.down_uri_entry.aspect,
                  down_uri_exit: signals.down_uri_exit.aspect
                },
                tracks: {
                  URI_LOOP: network.tracks.URI_LOOP
                },
                train_details: activeTrains.map(t => ({
                  id: t.id,
                  pos: parseFloat(t.pos.toFixed(1)),
                  status: t.status,
                  delay: t.delay
                }))
              }, null, 2)}
            </pre>
          </div>
          {/* Alerts Panel */}
          <div className="bg-white rounded-lg shadow-lg p-4">
            <h4 className="font-bold text-lg mb-2 text-center border-b pb-2">Alerts</h4>
            <div className="h-24 overflow-y-auto space-y-1 text-sm">
              {alerts.length === 0 ? (
                <p className="text-gray-500 text-center mt-4">No alerts.</p>
              ) : (
                alerts.map((alert, idx) => (
                  <p key={idx} className="text-red-600 font-semibold">{alert}</p>
                ))
              )}
            </div>
          </div>
          {/* Punctuality Panel */}
          <div className="bg-white rounded-lg shadow-lg p-4">
            <h4 className="font-bold text-lg mb-2 text-center border-b pb-2">Punctuality</h4>
            <div className="flex flex-col items-center">
              <span className="text-3xl font-bold text-green-600">{punctualityPercent.toFixed(1)}%</span>
              <span className="text-xs text-gray-500">Trains On Time</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrafficMap;