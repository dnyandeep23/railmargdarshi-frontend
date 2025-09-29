import React, { useEffect, useState } from 'react';
import StatsCard from '../components/StatsCard';
import AlertsPanel from '../components/AlertsPanel';
import { TrendingUp, Clock, AlertTriangle, CheckCircle, Brain as Train, MapPin } from 'lucide-react';
import { fetchUpcomingConflicts } from '../api';

interface DashboardProps {
  currentRole: string;
}

const Dashboard: React.FC<DashboardProps> = ({ currentRole }) => {
  const stats = [
    {
      title: 'On-Time Performance',
      value: '87.5%',
      change: '+2.3%',
      trend: 'up' as 'up',
      icon: CheckCircle,
      color: 'green' as 'green'
    },
    {
      title: 'Active Trains',
      value: '1,247',
      change: '+45',
      trend: 'up' as 'up',
      icon: Train,
      color: 'blue' as 'blue'
    },
    {
      title: 'Average Delay',
      value: '12.3 min',
      change: '-1.8 min',
      trend: 'down' as 'down',
      icon: Clock,
      color: 'yellow' as 'yellow'
    },
    {
      title: 'Active Conflicts',
      value: '7',
      change: '-2',
      trend: 'down' as 'down',
      icon: AlertTriangle,
      color: 'red' as 'red'
    }
  ];

  const recentActivities = [
    { time: '14:25', action: 'Train 12345 rerouted via alternate track', zone: 'Western Railway' },
    { time: '14:20', action: 'Signal failure resolved at New Delhi Junction', zone: 'Northern Railway' },
    { time: '14:15', action: 'Conflict alert acknowledged for Chennai-Bangalore route', zone: 'Southern Railway' },
    { time: '14:10', action: 'Maintenance block scheduled for Mumbai-Pune section', zone: 'Central Railway' },
    { time: '14:05', action: 'Priority given to Rajdhani Express at Kanpur', zone: 'North Central Railway' },
  ];

  const [upcomingConflicts, setUpcomingConflicts] = useState<any[]>([]);
  const [upcomingLoading, setUpcomingLoading] = useState(true);
  const [upcomingError, setUpcomingError] = useState('');

  useEffect(() => {
    setUpcomingLoading(true);
    fetchUpcomingConflicts()
      .then(data => {
        setUpcomingConflicts(data);
        setUpcomingLoading(false);
      })
      .catch(() => {
        setUpcomingError('Failed to load upcoming conflicts');
        setUpcomingLoading(false);
      });
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-navy-900">Traffic Control Dashboard</h1>
        <p className="text-gray-600 mt-2">Real-time overview of Indian Railways network operations</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* AI Recommendations & Alerts */}
        <div className="lg:col-span-2">
          <AlertsPanel currentRole={currentRole} />
        </div>

        {/* Quick Actions & Recent Activity */}
        <div className="space-y-6">
          {/* Upcoming Conflicts */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-navy-900">Upcoming Conflicts</h3>
              <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium">
                {upcomingConflicts.length} Pending
              </span>
            </div>
            <div className="space-y-4">
              {upcomingLoading ? (
                <div className="flex items-center justify-center h-16">
                  <div className="animate-spin rounded-full h-6 w-6 border-t-4 border-b-4 border-red-500"></div>
                  <span className="ml-2 text-red-700">Loading...</span>
                </div>
              ) : upcomingError ? (
                <div className="text-red-600">{upcomingError}</div>
              ) : upcomingConflicts.length === 0 ? (
                <div className="text-gray-500">No upcoming conflicts.</div>
              ) : (
                upcomingConflicts.map((conflict) => (
                  <div key={conflict._id || conflict.id} className="border-l-4 border-red-500 pl-4 py-2">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-navy-900">{conflict.location}</span>
                      <span className="text-xs text-gray-500">
                        ETA: {conflict.expectedAt ? new Date(conflict.expectedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--'}
                      </span>
                    </div>
                    <div className="text-xs text-gray-600 mb-2">
                      {conflict.trainIds?.join(' vs ')}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${conflict.severity === 'high' ? 'bg-red-100 text-red-800' :
                        conflict.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                        {conflict.severity?.toUpperCase()}
                      </span>
                      <span className="text-xs text-gray-500">
                        {conflict.estimatedDelay ? `${conflict.estimatedDelay} min` : ''}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Recent Activities */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold text-navy-900 mb-4">Recent Activities</h3>
            <div className="space-y-3">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="w-12 text-xs text-gray-500 mt-0.5">{activity.time}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-navy-900 mb-1">{activity.action}</p>
                    <p className="text-xs text-gray-600">{activity.zone}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold text-navy-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full bg-saffron-500 hover:bg-saffron-600 text-white px-4 py-3 rounded-lg transition-colors text-sm font-medium">
                Emergency Stop All Trains
              </button>
              <button className="w-full bg-navy-600 hover:bg-navy-700 text-white px-4 py-3 rounded-lg transition-colors text-sm font-medium">
                Generate Network Report
              </button>
              <button className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg transition-colors text-sm font-medium">
                Clear All Resolved Alerts
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;