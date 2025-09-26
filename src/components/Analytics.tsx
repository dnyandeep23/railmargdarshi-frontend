import React, { useState } from 'react';
import { BarChart3, TrendingUp, Clock, Download, Filter } from 'lucide-react';

const Analytics: React.FC = () => {
  const [selectedMetric, setSelectedMetric] = useState<'delays' | 'throughput' | 'conflicts'>('delays');
  const [timeRange, setTimeRange] = useState<'today' | 'week' | 'month'>('today');

  // Mock analytics data
  const delayData = [
    { time: '06:00', delays: 2, avgDelay: 5 },
    { time: '07:00', delays: 8, avgDelay: 12 },
    { time: '08:00', delays: 15, avgDelay: 18 },
    { time: '09:00', delays: 12, avgDelay: 15 },
    { time: '10:00', delays: 6, avgDelay: 8 },
    { time: '11:00', delays: 4, avgDelay: 6 },
    { time: '12:00', delays: 7, avgDelay: 10 },
  ];

  const throughputData = [
    { station: 'CSMT', trains: 145, capacity: 180 },
    { station: 'DR', trains: 132, capacity: 150 },
    { station: 'LTT', trains: 98, capacity: 120 },
    { station: 'TNA', trains: 76, capacity: 100 },
    { station: 'KYN', trains: 54, capacity: 80 },
  ];

  const conflictData = [
    { type: 'Signal Failure', count: 3, resolved: 2 },
    { type: 'Track Conflict', count: 5, resolved: 4 },
    { type: 'Maintenance', count: 2, resolved: 1 },
    { type: 'Weather', count: 1, resolved: 1 },
  ];

  const recentActions = [
    { time: '14:25', action: 'Signal cleared at DR Platform 3', user: 'Station Master DR' },
    { time: '14:20', action: 'Train 12345 rerouted via alternate track', user: 'Traffic Manager' },
    { time: '14:15', action: 'Alert acknowledged: Track conflict CSMT-DR', user: 'Signal Controller' },
    { time: '14:10', action: 'Maintenance block scheduled LTT-TNA', user: 'Traffic Manager' },
  ];

  const getUtilizationColor = (trains: number, capacity: number) => {
    const utilization = (trains / capacity) * 100;
    if (utilization >= 90) return 'bg-red-500';
    if (utilization >= 75) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="bg-navy-800 text-white p-4 border-b border-navy-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <BarChart3 className="w-5 h-5" />
            <h3 className="text-lg font-semibold">Analytics & Reports</h3>
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex bg-navy-700 rounded-lg p-1">
              <button
                onClick={() => setTimeRange('today')}
                className={`px-3 py-1 text-xs rounded transition-colors ${
                  timeRange === 'today' ? 'bg-saffron-500 text-white' : 'text-gray-300 hover:text-white'
                }`}
              >
                Today
              </button>
              <button
                onClick={() => setTimeRange('week')}
                className={`px-3 py-1 text-xs rounded transition-colors ${
                  timeRange === 'week' ? 'bg-saffron-500 text-white' : 'text-gray-300 hover:text-white'
                }`}
              >
                Week
              </button>
              <button
                onClick={() => setTimeRange('month')}
                className={`px-3 py-1 text-xs rounded transition-colors ${
                  timeRange === 'month' ? 'bg-saffron-500 text-white' : 'text-gray-300 hover:text-white'
                }`}
              >
                Month
              </button>
            </div>
            <button className="p-2 bg-navy-700 hover:bg-navy-600 rounded-lg transition-colors">
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {/* Key Metrics */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-600 text-sm font-medium">On-Time Performance</p>
                <p className="text-2xl font-bold text-green-800">87.5%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-600" />
            </div>
            <p className="text-xs text-green-600 mt-2">↑ 2.3% from yesterday</p>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 text-sm font-medium">Average Delay</p>
                <p className="text-2xl font-bold text-blue-800">12.3 min</p>
              </div>
              <Clock className="w-8 h-8 text-blue-600" />
            </div>
            <p className="text-xs text-blue-600 mt-2">↓ 1.8 min from yesterday</p>
          </div>

          <div className="bg-gradient-to-r from-saffron-50 to-orange-100 p-4 rounded-lg border border-saffron-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-saffron-700 text-sm font-medium">Active Conflicts</p>
                <p className="text-2xl font-bold text-saffron-800">3</p>
              </div>
              <BarChart3 className="w-8 h-8 text-saffron-600" />
            </div>
            <p className="text-xs text-saffron-600 mt-2">2 critical, 1 medium</p>
          </div>

          <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-600 text-sm font-medium">Throughput</p>
                <p className="text-2xl font-bold text-purple-800">505</p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-600" />
            </div>
            <p className="text-xs text-purple-600 mt-2">trains processed today</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          {/* Chart Section */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold text-navy-900">Performance Trends</h4>
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setSelectedMetric('delays')}
                  className={`px-3 py-1 text-xs rounded transition-colors ${
                    selectedMetric === 'delays' ? 'bg-white shadow-sm' : 'text-gray-600'
                  }`}
                >
                  Delays
                </button>
                <button
                  onClick={() => setSelectedMetric('throughput')}
                  className={`px-3 py-1 text-xs rounded transition-colors ${
                    selectedMetric === 'throughput' ? 'bg-white shadow-sm' : 'text-gray-600'
                  }`}
                >
                  Throughput
                </button>
                <button
                  onClick={() => setSelectedMetric('conflicts')}
                  className={`px-3 py-1 text-xs rounded transition-colors ${
                    selectedMetric === 'conflicts' ? 'bg-white shadow-sm' : 'text-gray-600'
                  }`}
                >
                  Conflicts
                </button>
              </div>
            </div>

            {/* Simple Bar Chart */}
            {selectedMetric === 'delays' && (
              <div className="space-y-3">
                {delayData.map((item, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="w-12 text-xs text-gray-600">{item.time}</div>
                    <div className="flex-1 bg-gray-200 rounded-full h-6 relative">
                      <div
                        className="bg-red-500 h-6 rounded-full flex items-center justify-end pr-2"
                        style={{ width: `${(item.delays / 20) * 100}%` }}
                      >
                        <span className="text-white text-xs font-medium">{item.delays}</span>
                      </div>
                    </div>
                    <div className="w-16 text-xs text-gray-600">{item.avgDelay}min avg</div>
                  </div>
                ))}
              </div>
            )}

            {selectedMetric === 'throughput' && (
              <div className="space-y-3">
                {throughputData.map((item, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="w-12 text-xs text-gray-600">{item.station}</div>
                    <div className="flex-1 bg-gray-200 rounded-full h-6 relative">
                      <div
                        className={`h-6 rounded-full flex items-center justify-end pr-2 ${getUtilizationColor(item.trains, item.capacity)}`}
                        style={{ width: `${(item.trains / item.capacity) * 100}%` }}
                      >
                        <span className="text-white text-xs font-medium">{item.trains}</span>
                      </div>
                    </div>
                    <div className="w-16 text-xs text-gray-600">/{item.capacity}</div>
                  </div>
                ))}
              </div>
            )}

            {selectedMetric === 'conflicts' && (
              <div className="space-y-3">
                {conflictData.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium text-sm">{item.type}</div>
                      <div className="text-xs text-gray-600">{item.resolved}/{item.count} resolved</div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="text-sm font-medium">{item.count}</div>
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-500 h-2 rounded-full"
                          style={{ width: `${(item.resolved / item.count) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Activity Log */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold text-navy-900">Recent Actions</h4>
              <button className="p-1 text-gray-600 hover:text-gray-800">
                <Filter className="w-4 h-4" />
              </button>
            </div>
            
            <div className="space-y-3">
              {recentActions.map((action, index) => (
                <div key={index} className="flex items-start space-x-3 pb-3 border-b border-gray-100 last:border-b-0">
                  <div className="w-12 text-xs text-gray-500 mt-0.5">{action.time}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-navy-900 mb-1">{action.action}</p>
                    <p className="text-xs text-gray-600">by {action.user}</p>
                  </div>
                </div>
              ))}
            </div>

            <button className="w-full mt-4 py-2 text-sm text-saffron-600 hover:bg-saffron-50 rounded-lg transition-colors">
              View Full Log
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;