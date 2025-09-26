import React, { useState } from 'react';
import { AlertTriangle, Clock, CheckCircle, X, Eye, Wrench } from 'lucide-react';
import { Alert } from '../types';

const AlertPanel: React.FC = () => {
  const [alerts, setAlerts] = useState<Alert[]>([
    {
      id: '1',
      type: 'conflict',
      severity: 'critical',
      title: 'Track Conflict - CSMT Junction',
      description: 'Trains 12345 and 12346 approaching same track segment',
      station: 'CSMT',
      trainIds: ['12345', '12346'],
      timestamp: new Date(Date.now() - 5 * 60000),
      status: 'active',
      estimatedResolution: new Date(Date.now() + 10 * 60000),
    },
    {
      id: '2',
      type: 'delay',
      severity: 'high',
      title: 'Signal Failure - Dadar Station',
      description: 'Platform 3 signal not responding, causing delays',
      station: 'DR',
      trainIds: ['12347', '12348'],
      timestamp: new Date(Date.now() - 15 * 60000),
      status: 'acknowledged',
      estimatedResolution: new Date(Date.now() + 25 * 60000),
    },
    {
      id: '3',
      type: 'maintenance',
      severity: 'medium',
      title: 'Scheduled Track Maintenance',
      description: 'Track cleaning between Kurla and Thane',
      station: 'LTT',
      trainIds: [],
      timestamp: new Date(Date.now() - 30 * 60000),
      status: 'active',
      estimatedResolution: new Date(Date.now() + 60 * 60000),
    },
  ]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 border-red-500 text-red-800';
      case 'high': return 'bg-orange-100 border-orange-500 text-orange-800';
      case 'medium': return 'bg-yellow-100 border-yellow-500 text-yellow-800';
      case 'low': return 'bg-blue-100 border-blue-500 text-blue-800';
      default: return 'bg-gray-100 border-gray-500 text-gray-800';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
      case 'high':
        return <AlertTriangle className="w-4 h-4" />;
      case 'medium':
        return <Clock className="w-4 h-4" />;
      case 'low':
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <AlertTriangle className="w-4 h-4" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'conflict': return <AlertTriangle className="w-5 h-5 text-red-600" />;
      case 'delay': return <Clock className="w-5 h-5 text-orange-600" />;
      case 'maintenance': return <Wrench className="w-5 h-5 text-blue-600" />;
      default: return <AlertTriangle className="w-5 h-5 text-gray-600" />;
    }
  };

  const handleAcknowledge = (id: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === id ? { ...alert, status: 'acknowledged' as const } : alert
    ));
  };

  const handleResolve = (id: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === id ? { ...alert, status: 'resolved' as const } : alert
    ));
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-IN', { hour12: false, hour: '2-digit', minute: '2-digit' });
  };

  const getTimeUntilResolution = (date: Date) => {
    const minutes = Math.round((date.getTime() - Date.now()) / 60000);
    return minutes > 0 ? `${minutes} min` : 'Overdue';
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="bg-navy-800 text-white p-4 border-b border-navy-700">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Active Alerts & Conflicts</h3>
          <div className="flex items-center space-x-2">
            <div className="bg-red-500 text-white px-2 py-1 rounded text-xs font-medium">
              {alerts.filter(a => a.status === 'active').length} Active
            </div>
          </div>
        </div>
      </div>

      {/* Alerts List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className={`border-l-4 rounded-lg p-4 transition-all ${getSeverityColor(alert.severity)} ${
              alert.status === 'resolved' ? 'opacity-60' : ''
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3">
                {getTypeIcon(alert.type)}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <h4 className="font-semibold text-navy-900 truncate">{alert.title}</h4>
                    {alert.station && (
                      <span className="bg-navy-100 text-navy-700 px-2 py-1 rounded text-xs font-medium">
                        {alert.station}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-700 mb-2">{alert.description}</p>
                  
                  {/* Timeline */}
                  <div className="bg-white bg-opacity-50 rounded p-2 mb-3">
                    <div className="flex items-center justify-between text-xs">
                      <span>Started: {formatTime(alert.timestamp)}</span>
                      <span>ETA: {getTimeUntilResolution(alert.estimatedResolution)}</span>
                    </div>
                    <div className="mt-1 bg-gray-200 rounded-full h-1">
                      <div 
                        className="bg-saffron-500 h-1 rounded-full transition-all duration-300"
                        style={{ 
                          width: `${Math.min(100, ((Date.now() - alert.timestamp.getTime()) / (alert.estimatedResolution.getTime() - alert.timestamp.getTime())) * 100)}%` 
                        }}
                      />
                    </div>
                  </div>

                  {/* Affected Trains */}
                  {alert.trainIds.length > 0 && (
                    <div className="mb-3">
                      <span className="text-xs font-medium text-gray-600">Affected Trains:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {alert.trainIds.map((trainId) => (
                          <span
                            key={trainId}
                            className="bg-gray-200 text-gray-700 px-2 py-1 rounded text-xs"
                          >
                            {trainId}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Status Badge */}
                  <div className="flex items-center space-x-2">
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                      alert.status === 'active' ? 'bg-red-100 text-red-800' :
                      alert.status === 'acknowledged' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {alert.status.charAt(0).toUpperCase() + alert.status.slice(1)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col space-y-1">
                {alert.status === 'active' && (
                  <button
                    onClick={() => handleAcknowledge(alert.id)}
                    className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                    title="Acknowledge"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                )}
                {alert.status !== 'resolved' && (
                  <button
                    onClick={() => handleResolve(alert.id)}
                    className="p-1 text-green-600 hover:bg-green-50 rounded transition-colors"
                    title="Mark Resolved"
                  >
                    <CheckCircle className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            {alert.status === 'active' && (
              <div className="flex space-x-2 mt-3 pt-3 border-t border-gray-200">
                <button className="flex-1 bg-navy-600 text-white px-3 py-2 rounded text-sm font-medium hover:bg-navy-700 transition-colors">
                  Simulate Fix
                </button>
                <button className="flex-1 bg-saffron-500 text-white px-3 py-2 rounded text-sm font-medium hover:bg-saffron-600 transition-colors">
                  View Details
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Quick Stats */}
      <div className="border-t border-gray-200 p-4 bg-gray-50">
        <div className="grid grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-lg font-bold text-red-600">{alerts.filter(a => a.severity === 'critical').length}</div>
            <div className="text-xs text-gray-600">Critical</div>
          </div>
          <div>
            <div className="text-lg font-bold text-orange-600">{alerts.filter(a => a.severity === 'high').length}</div>
            <div className="text-xs text-gray-600">High</div>
          </div>
          <div>
            <div className="text-lg font-bold text-yellow-600">{alerts.filter(a => a.severity === 'medium').length}</div>
            <div className="text-xs text-gray-600">Medium</div>
          </div>
          <div>
            <div className="text-lg font-bold text-green-600">{alerts.filter(a => a.status === 'resolved').length}</div>
            <div className="text-xs text-gray-600">Resolved</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlertPanel;