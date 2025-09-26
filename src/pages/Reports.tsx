import React, { useState } from 'react';
import { Download, Filter, Calendar, Search, FileText, BarChart3 } from 'lucide-react';
import ReportsTable from '../components/ReportsTable';

interface ReportsProps {
  currentRole: string;
}

const Reports: React.FC<ReportsProps> = ({ currentRole }) => {
  const [activeTab, setActiveTab] = useState('actions');
  const [dateRange, setDateRange] = useState('today');
  const [selectedZone, setSelectedZone] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const zones = [
    { id: 'all', name: 'All Zones' },
    { id: 'northern', name: 'Northern Railway' },
    { id: 'western', name: 'Western Railway' },
    { id: 'central', name: 'Central Railway' },
    { id: 'eastern', name: 'Eastern Railway' },
    { id: 'southern', name: 'Southern Railway' },
  ];

  const tabs = [
    { id: 'actions', name: 'Actions Log', icon: FileText },
    { id: 'analytics', name: 'Analytics', icon: BarChart3 },
  ];

  const actionLogs = [
    {
      id: '1',
      timestamp: '2024-01-15 14:25:30',
      action: 'Train Rerouted',
      details: 'Train 12345 rerouted from Platform 2 to Platform 4',
      user: 'Traffic Manager - Rajesh Kumar',
      zone: 'Northern Railway',
      trainId: '12345',
      status: 'completed',
      impact: 'Reduced delay by 8 minutes'
    },
    {
      id: '2',
      timestamp: '2024-01-15 14:20:15',
      action: 'Signal Override',
      details: 'Manual signal override at New Delhi Junction - Platform 3',
      user: 'Signal Controller - Priya Sharma',
      zone: 'Northern Railway',
      trainId: '12346',
      status: 'completed',
      impact: 'Prevented potential conflict'
    },
    {
      id: '3',
      timestamp: '2024-01-15 14:15:45',
      action: 'Conflict Resolved',
      details: 'Platform conflict between trains 12347 and 12348 resolved',
      user: 'Station Master - Amit Singh',
      zone: 'Western Railway',
      trainId: '12347,12348',
      status: 'completed',
      impact: 'Avoided 15-minute delay'
    },
    {
      id: '4',
      timestamp: '2024-01-15 14:10:20',
      action: 'Maintenance Scheduled',
      details: 'Track maintenance scheduled for Mumbai-Pune section',
      user: 'Traffic Manager - Sunita Patel',
      zone: 'Central Railway',
      trainId: 'N/A',
      status: 'scheduled',
      impact: 'Preventive maintenance'
    },
    {
      id: '5',
      timestamp: '2024-01-15 14:05:10',
      action: 'Priority Signal',
      details: 'Priority signal granted to Rajdhani Express at Kanpur',
      user: 'Signal Controller - Vikram Gupta',
      zone: 'North Central Railway',
      trainId: '12309',
      status: 'completed',
      impact: 'Maintained schedule'
    },
  ];

  const analyticsData = {
    totalActions: 156,
    successRate: 94.2,
    avgResponseTime: '2.3 minutes',
    conflictsResolved: 23,
    delaysReduced: '4.2 hours',
    maintenanceScheduled: 8,
  };

  const filteredLogs = actionLogs.filter(log => {
    const matchesSearch = log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.trainId.includes(searchTerm);
    const matchesZone = selectedZone === 'all' || log.zone.toLowerCase().includes(selectedZone);
    return matchesSearch && matchesZone;
  });

  const handleExport = (format) => {
    // Simulate export functionality
    const data = filteredLogs.map(log => ({
      Timestamp: log.timestamp,
      Action: log.action,
      Details: log.details,
      User: log.user,
      Zone: log.zone,
      'Train ID': log.trainId,
      Status: log.status,
      Impact: log.impact,
    }));
    
    console.log(`Exporting ${data.length} records as ${format.toUpperCase()}`);
    alert(`Export initiated: ${data.length} records will be downloaded as ${format.toUpperCase()}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-navy-900">Reports & Analytics</h1>
        <p className="text-gray-600 mt-2">Comprehensive logs and performance analytics</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search actions, trains, or details..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full md:w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saffron-500 focus:border-transparent"
              />
            </div>

            {/* Zone Filter */}
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-gray-400" />
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

            {/* Date Range */}
            <div className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-gray-400" />
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-saffron-500 focus:border-transparent"
              >
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="quarter">This Quarter</option>
              </select>
            </div>
          </div>

          {/* Export Buttons */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleExport('csv')}
              className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>CSV</span>
            </button>
            <button
              onClick={() => handleExport('pdf')}
              className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>PDF</span>
            </button>
            <button
              onClick={() => handleExport('excel')}
              className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Excel</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-saffron-500 text-saffron-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'actions' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-navy-900">
                  Action Logs ({filteredLogs.length} records)
                </h3>
                <div className="text-sm text-gray-600">
                  Showing results for: {zones.find(z => z.id === selectedZone)?.name} • {dateRange}
                </div>
              </div>
              <ReportsTable data={filteredLogs} currentRole={currentRole} />
            </div>
          )}

          {activeTab === 'analytics' && (
            <div>
              <h3 className="text-lg font-semibold text-navy-900 mb-6">Performance Analytics</h3>
              
              {/* Analytics Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <div className="bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-lg border border-green-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-600 text-sm font-medium">Total Actions</p>
                      <p className="text-3xl font-bold text-green-800">{analyticsData.totalActions}</p>
                    </div>
                    <FileText className="w-8 h-8 text-green-600" />
                  </div>
                  <p className="text-xs text-green-600 mt-2">↑ 12% from last period</p>
                </div>

                <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-lg border border-blue-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-600 text-sm font-medium">Success Rate</p>
                      <p className="text-3xl font-bold text-blue-800">{analyticsData.successRate}%</p>
                    </div>
                    <BarChart3 className="w-8 h-8 text-blue-600" />
                  </div>
                  <p className="text-xs text-blue-600 mt-2">↑ 2.1% from last period</p>
                </div>

                <div className="bg-gradient-to-r from-saffron-50 to-orange-100 p-6 rounded-lg border border-saffron-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-saffron-700 text-sm font-medium">Avg Response Time</p>
                      <p className="text-3xl font-bold text-saffron-800">{analyticsData.avgResponseTime}</p>
                    </div>
                    <Calendar className="w-8 h-8 text-saffron-600" />
                  </div>
                  <p className="text-xs text-saffron-600 mt-2">↓ 0.5 min from last period</p>
                </div>

                <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-6 rounded-lg border border-purple-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-600 text-sm font-medium">Conflicts Resolved</p>
                      <p className="text-3xl font-bold text-purple-800">{analyticsData.conflictsResolved}</p>
                    </div>
                    <FileText className="w-8 h-8 text-purple-600" />
                  </div>
                  <p className="text-xs text-purple-600 mt-2">↓ 3 from last period</p>
                </div>

                <div className="bg-gradient-to-r from-indigo-50 to-indigo-100 p-6 rounded-lg border border-indigo-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-indigo-600 text-sm font-medium">Delays Reduced</p>
                      <p className="text-3xl font-bold text-indigo-800">{analyticsData.delaysReduced}</p>
                    </div>
                    <BarChart3 className="w-8 h-8 text-indigo-600" />
                  </div>
                  <p className="text-xs text-indigo-600 mt-2">↑ 1.2 hrs from last period</p>
                </div>

                <div className="bg-gradient-to-r from-teal-50 to-teal-100 p-6 rounded-lg border border-teal-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-teal-600 text-sm font-medium">Maintenance Scheduled</p>
                      <p className="text-3xl font-bold text-teal-800">{analyticsData.maintenanceScheduled}</p>
                    </div>
                    <Calendar className="w-8 h-8 text-teal-600" />
                  </div>
                  <p className="text-xs text-teal-600 mt-2">↑ 2 from last period</p>
                </div>
              </div>

              {/* Charts Placeholder */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-gray-50 rounded-lg p-6 border-2 border-dashed border-gray-300">
                  <h4 className="text-lg font-semibold text-navy-900 mb-4">Actions Over Time</h4>
                  <div className="h-64 flex items-center justify-center text-gray-500">
                    <div className="text-center">
                      <BarChart3 className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p>Chart visualization would be implemented here</p>
                      <p className="text-sm">Showing action trends over selected period</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-6 border-2 border-dashed border-gray-300">
                  <h4 className="text-lg font-semibold text-navy-900 mb-4">Zone-wise Performance</h4>
                  <div className="h-64 flex items-center justify-center text-gray-500">
                    <div className="text-center">
                      <BarChart3 className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p>Chart visualization would be implemented here</p>
                      <p className="text-sm">Comparing performance across railway zones</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Reports;