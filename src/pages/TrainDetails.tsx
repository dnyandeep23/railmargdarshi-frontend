import React, { useState, useEffect } from 'react';
import { fetchAllTrains, fetchConflicts, applyConflictSuggestion } from '../api';
import { Search, Filter, Clock, MapPin, AlertTriangle, CheckCircle, Brain as Train } from 'lucide-react';

interface TrainDetailsProps {
  currentRole: string;
}

const TrainDetails: React.FC<TrainDetailsProps> = ({ currentRole }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  interface TrainStop {
    station: string;
    arrival: string;
    departure: string;
    status: 'current' | 'departed' | 'upcoming';
  }

  interface TrainType {
    id: string;
    name: string;
    route: string;
    zone: string;
    currentStation: string;
    nextStation: string;
    speed: number;
    status: string;
    delay: number;
    schedule: TrainStop[];
  }

  const [selectedTrain, setSelectedTrain] = useState<TrainType | null>(null);
  const [trains, setTrains] = useState<TrainType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    fetchAllTrains()
      .then(data => {
        setTrains(data);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to load train data');
        setLoading(false);
      });
    setConflictsLoading(true);
    fetchConflicts()
      .then(data => {
        setConflicts(data);
        setConflictsLoading(false);
      })
      .catch(err => {
        setConflictsError('Failed to load conflicts');
        setConflictsLoading(false);
      });
  }, []);

  const [conflicts, setConflicts] = useState<any[]>([]);
  const [conflictsLoading, setConflictsLoading] = useState(true);
  const [conflictsError, setConflictsError] = useState('');

  const filteredTrains = trains.filter(train => {
    const matchesSearch = train.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      train.id.includes(searchTerm) ||
      train.route.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || train.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'on-time': return 'text-green-600 bg-green-50';
      case 'delayed': return 'text-red-600 bg-red-50';
      case 'early': return 'text-blue-600 bg-blue-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'on-time': return <CheckCircle className="w-4 h-4" />;
      case 'delayed': return <AlertTriangle className="w-4 h-4" />;
      case 'early': return <Clock className="w-4 h-4" />;
      default: return <Train className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
        <span className="ml-4 text-lg text-blue-700">Loading train data...</span>
      </div>
    );
  }
  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <span className="text-lg text-red-600">{error}</span>
      </div>
    );
  }

  const handleApplySuggestion = async (conflictId: string, suggestion: any) => {
    try {
      await applyConflictSuggestion(conflictId, suggestion);
      // Refetch conflicts to update UI
      setConflictsLoading(true);
      const updated = await fetchConflicts();
      setConflicts(updated);
      setConflictsLoading(false);
    } catch (err) {
      setConflictsError('Failed to apply suggestion');
      setConflictsLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-navy-900">Train Details & Monitoring</h1>
        <p className="text-gray-600 mt-2">Real-time train tracking and conflict management</p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search trains by number, name, or route..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saffron-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-saffron-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="on-time">On Time</option>
                <option value="delayed">Delayed</option>
                <option value="early">Early</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Trains List */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg shadow-lg">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-navy-900">Active Trains ({filteredTrains.length})</h2>
            </div>
            <div className="divide-y divide-gray-200">
              {filteredTrains.map((train) => (
                <div
                  key={train.id}
                  className="p-6 hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => setSelectedTrain(train)}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-navy-100 rounded-lg flex items-center justify-center">
                        <Train className="w-5 h-5 text-navy-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-navy-900">{train.name}</h3>
                        <p className="text-sm text-gray-600">Train #{train.id}</p>
                      </div>
                    </div>
                    <div className={`flex items-center space-x-2 px-3 py-1 rounded-full ${getStatusColor(train.status)}`}>
                      {getStatusIcon(train.status)}
                      <span className="text-sm font-medium capitalize">{train.status}</span>
                      {train.delay !== 0 && (
                        <span className="text-xs">
                          ({train.delay > 0 ? '+' : ''}{train.delay} min)
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Route:</span>
                      <span className="ml-2 font-medium">{train.route}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Zone:</span>
                      <span className="ml-2 font-medium">{train.zone}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Current:</span>
                      <span className="ml-2 font-medium">{train.currentStation}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Next:</span>
                      <span className="ml-2 font-medium">{train.nextStation}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Speed:</span>
                      <span className="ml-2 font-medium">{train.speed} km/h</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Conflicts & Details Panel */}
        <div className="space-y-6">
          {/* Active Conflicts (Dynamic) */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold text-navy-900 mb-4">Active Conflicts</h3>
            {conflictsLoading ? (
              <div className="flex items-center justify-center h-24">
                <div className="animate-spin rounded-full h-8 w-8 border-t-4 border-b-4 border-red-500"></div>
                <span className="ml-2 text-red-700">Loading conflicts...</span>
              </div>
            ) : conflictsError ? (
              <div className="text-red-600">{conflictsError}</div>
            ) : conflicts.length === 0 ? (
              <div className="text-gray-500">No active conflicts found.</div>
            ) : (
              <div className="space-y-4">
                {conflicts.map((conflict) => (
                  <div
                    key={conflict._id || conflict.id}
                    className={`border-l-4 pl-4 py-3 rounded-r-lg ${conflict.resolved ? 'border-green-500 bg-green-50 opacity-80' : 'border-red-500 bg-red-50'}`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-navy-900">{conflict.location}</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${conflict.severity === 'high' ? 'bg-red-100 text-red-800' :
                        conflict.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                        {conflict.severity?.toUpperCase()}
                      </span>
                      {conflict.resolved && (
                        <span className="ml-2 px-2 py-1 rounded-full bg-green-200 text-green-800 text-xs font-semibold">Resolved</span>
                      )}
                    </div>
                    <div className="text-sm text-gray-600 mb-2">
                      Trains: {conflict.trainIds?.join(', ')}
                    </div>
                    <div className="text-sm text-gray-600 mb-3">
                      Est. Delay: {conflict.estimatedDelay} minutes
                    </div>
                    <div className="space-y-2">
                      {conflict.resolved && conflict.suggestions?.length === 1 ? (
                        <div className="bg-green-50 border border-green-400 p-2 rounded">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-green-800">{conflict.suggestions[0].action}</span>
                            <span className="px-2 py-1 rounded bg-green-500 text-white text-xs">Resolved</span>
                          </div>
                          <div className="text-xs text-green-700 mt-1">
                            {conflict.suggestions[0].benefit} • {conflict.suggestions[0].risk} risk
                          </div>
                        </div>
                      ) : (
                        conflict.suggestions?.map((suggestion: any, index: number) => (
                          <div key={index} className="bg-white p-2 rounded border">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium">{suggestion.action}</span>
                              <button
                                className="bg-saffron-500 hover:bg-saffron-600 text-white px-2 py-1 rounded text-xs transition-colors"
                                onClick={() => handleApplySuggestion(conflict._id || conflict.id, suggestion)}
                              >
                                Apply
                              </button>
                            </div>
                            <div className="text-xs text-gray-600 mt-1">
                              {suggestion.benefit} • {suggestion.risk} risk
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Train Schedule Detail */}
          {selectedTrain && (
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-navy-900 mb-4">
                Schedule - {selectedTrain.name}
              </h3>
              <div className="space-y-3">
                {selectedTrain.schedule.map((stop, index) => (
                  <div key={index} className={`flex items-center justify-between p-3 rounded-lg ${stop.status === 'current' ? 'bg-saffron-50 border border-saffron-200' :
                    stop.status === 'departed' ? 'bg-green-50' : 'bg-gray-50'
                    }`}>
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${stop.status === 'current' ? 'bg-saffron-500' :
                        stop.status === 'departed' ? 'bg-green-500' : 'bg-gray-400'
                        }`} />
                      <div>
                        <div className="font-medium text-navy-900">{stop.station}</div>
                        <div className="text-sm text-gray-600">
                          Arr: {stop.arrival} | Dep: {stop.departure}
                        </div>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${stop.status === 'current' ? 'bg-saffron-100 text-saffron-800' :
                      stop.status === 'departed' ? 'bg-green-100 text-green-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                      {stop.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrainDetails;