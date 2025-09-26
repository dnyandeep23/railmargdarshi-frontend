import React, { useState } from 'react';
import { AlertTriangle, Clock, CheckCircle, X, Brain, TrendingUp } from 'lucide-react';

interface AlertsPanelProps {
  currentRole: string;
}

const AlertsPanel: React.FC<AlertsPanelProps> = ({ currentRole }) => {
  const [alerts, setAlerts] = useState([
    {
      id: '1',
      type: 'conflict',
      severity: 'critical',
      title: 'Platform Conflict - New Delhi Junction',
      description: 'Trains 12345 and 12346 scheduled for same platform',
      location: 'New Delhi Junction',
      trainIds: ['12345', '12346'],
      timestamp: new Date(Date.now() - 5 * 60000),
      status: 'active',
      aiSuggestions: [
        { action: 'Reroute 12346 to Platform 4', benefit: '8 min saved', confidence: 92 },
        { action: 'Delay 12345 by 5 minutes', benefit: '5 min saved', confidence: 85 }
      ]
    },
    {
      id: '2',
      type: 'delay',
      severity: 'high',
      title: 'Signal Failure - Mumbai Central',
      description: 'Platform 3 signal not responding, causing delays',
      location: 'Mumbai Central',
      trainIds: ['12347', '12348'],
      timestamp: new Date(Date.now() - 15 * 60000),
      status: 'acknowledged',
      aiSuggestions: [
        { action: 'Switch to manual control', benefit: '10 min saved', confidence: 88 },
        { action: 'Reroute via Platform 5', benefit: '12 min saved', confidence: 78 }
      ]
    },
    {
      id: '3',
      type: 'maintenance',
      severity: 'medium',
      title: 'Scheduled Track Maintenance',
      description: 'Track cleaning between Chennai and Bangalore',
      location: 'Chennai-Bangalore Section',
      trainIds: [],
      timestamp: new Date(Date.now() - 30 * 60000),
      status: 'active',
      aiSuggestions: [
        { action: 'Optimize maintenance window', benefit: '15 min saved', confidence: 90 }
      ]
    }
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
        return <AlertTriangle className="w-5 h-5" />;
      case 'medium':
        return <Clock className="w-5 h-5" />;
      case 'low':
        return <CheckCircle className="w-5 h-5" />;
      default:
        return <AlertTriangle className="w-5 h-5" />;
    }
  };

  const handleAcknowledge = (id: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === id ? { ...alert, status: 'acknowledged' } : alert
    ));
  };

  const handleResolve = (id: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
  };

  const handleApplySuggestion = (alertId: string, suggestion: any) => {
    console.log(`Applying suggestion: ${suggestion.action} for alert ${alertId}`);
    // Simulate applying the suggestion
    handleResolve(alertId);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-IN', { hour12: false, hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="bg-white rounded-lg shadow-lg">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-navy-900">AI Alerts & Recommendations</h2>
          <div className="flex items-center space-x-2">
            <div className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
              {alerts.filter(a => a.status === 'active').length} Active
            </div>
            <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
              AI Powered
            </div>
          </div>
        </div>
      </div>

      <div className="max-h-96 overflow-y-auto">
        <div className="p-6 space-y-4">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className={`border-l-4 rounded-lg p-4 transition-all ${getSeverityColor(alert.severity)} ${
                alert.status === 'resolved' ? 'opacity-60' : ''
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3 flex-1">
                  <div className="mt-0.5">
                    {getSeverityIcon(alert.severity)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="font-semibold text-navy-900">{alert.title}</h3>
                      <span className="text-xs text-gray-500">{formatTime(alert.timestamp)}</span>
                    </div>
                    <p className="text-sm text-gray-700 mb-2">{alert.description}</p>
                    
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

                    {/* AI Suggestions */}
                    {alert.aiSuggestions.length > 0 && (
                      <div className="bg-white bg-opacity-70 rounded-lg p-3 mb-3">
                        <div className="flex items-center space-x-2 mb-2">
                          <Brain className="w-4 h-4 text-purple-600" />
                          <span className="text-sm font-medium text-purple-800">AI Recommendations</span>
                        </div>
                        <div className="space-y-2">
                          {alert.aiSuggestions.map((suggestion, index) => (
                            <div key={index} className="flex items-center justify-between bg-white p-2 rounded border">
                              <div className="flex-1">
                                <div className="text-sm font-medium text-navy-900">{suggestion.action}</div>
                                <div className="flex items-center space-x-3 text-xs text-gray-600">
                                  <span className="flex items-center space-x-1">
                                    <TrendingUp className="w-3 h-3" />
                                    <span>{suggestion.benefit}</span>
                                  </span>
                                  <span className="flex items-center space-x-1">
                                    <Brain className="w-3 h-3" />
                                    <span>{suggestion.confidence}% confidence</span>
                                  </span>
                                </div>
                              </div>
                              <button
                                onClick={() => handleApplySuggestion(alert.id, suggestion)}
                                className="ml-3 bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded text-xs transition-colors"
                              >
                                Apply
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      alert.status === 'active' ? 'bg-red-100 text-red-800' :
                      alert.status === 'acknowledged' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {alert.status.charAt(0).toUpperCase() + alert.status.slice(1)}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col space-y-1 ml-2">
                  {alert.status === 'active' && (
                    <button
                      onClick={() => handleAcknowledge(alert.id)}
                      className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                      title="Acknowledge"
                    >
                      <CheckCircle className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={() => handleResolve(alert.id)}
                    className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                    title="Dismiss"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {alert.status === 'active' && currentRole !== 'station-master' && (
                <div className="flex space-x-2 mt-4 pt-3 border-t border-gray-200">
                  <button className="flex-1 bg-navy-600 text-white px-3 py-2 rounded text-sm font-medium hover:bg-navy-700 transition-colors">
                    View Details
                  </button>
                  <button className="flex-1 bg-saffron-500 text-white px-3 py-2 rounded text-sm font-medium hover:bg-saffron-600 transition-colors">
                    Take Action
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {alerts.length === 0 && (
        <div className="p-8 text-center text-gray-500">
          <CheckCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>No active alerts</p>
          <p className="text-sm">All systems operating normally</p>
        </div>
      )}
    </div>
  );
};

export default AlertsPanel;