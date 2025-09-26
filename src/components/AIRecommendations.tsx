import React, { useState } from 'react';
import { Brain, TrendingUp, Clock, AlertCircle, CheckCircle, X } from 'lucide-react';
import { AIRecommendation } from '../types';

const AIRecommendations: React.FC = () => {
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([
    {
      id: '1',
      type: 'reroute',
      title: 'Reroute Train 12345',
      description: 'Redirect via alternate track DR-LTT-02 to avoid congestion',
      affectedTrains: ['12345'],
      estimatedBenefit: 8,
      riskLevel: 'low',
      confidence: 92
    },
    {
      id: '2',
      type: 'delay',
      title: 'Hold Train 12346 at Dadar',
      description: 'Delay departure by 5 minutes to clear track conflict',
      affectedTrains: ['12346', '12347'],
      estimatedBenefit: 12,
      riskLevel: 'low',
      confidence: 88
    },
    {
      id: '3',
      type: 'priority',
      title: 'Priority Signal for Express',
      description: 'Grant priority to Konkan Express at TNA junction',
      affectedTrains: ['12347'],
      estimatedBenefit: 15,
      riskLevel: 'medium',
      confidence: 85
    }
  ]);

  const [selectedRec, setSelectedRec] = useState<string | null>(null);

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'reroute': return 'bg-blue-100 text-blue-800';
      case 'delay': return 'bg-yellow-100 text-yellow-800';
      case 'priority': return 'bg-purple-100 text-purple-800';
      case 'hold': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'text-green-600 bg-green-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'high': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'reroute': return '🔄';
      case 'delay': return '⏸️';
      case 'priority': return '⚡';
      case 'hold': return '⏹️';
      default: return '🤖';
    }
  };

  const handleApply = (id: string) => {
    setRecommendations(prev => prev.filter(rec => rec.id !== id));
    // Here you would implement the actual action
  };

  const handleReject = (id: string) => {
    setRecommendations(prev => prev.filter(rec => rec.id !== id));
  };

  const selectedRecommendation = recommendations.find(r => r.id === selectedRec);

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-800 to-indigo-800 text-white p-4 border-b border-purple-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Brain className="w-5 h-5" />
            <h3 className="text-lg font-semibold">AI Recommendations</h3>
          </div>
          <div className="bg-purple-700 px-2 py-1 rounded text-xs font-medium">
            {recommendations.length} Active
          </div>
        </div>
      </div>

      {/* Recommendations List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {recommendations.length === 0 ? (
          <div className="text-center text-gray-500 mt-8">
            <Brain className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No recommendations at this time</p>
            <p className="text-sm">AI is monitoring for optimization opportunities</p>
          </div>
        ) : (
          recommendations.map((rec) => (
            <div
              key={rec.id}
              className={`border rounded-lg p-4 transition-all cursor-pointer hover:shadow-md ${
                selectedRec === rec.id ? 'ring-2 ring-purple-500 bg-purple-50' : 'bg-white border-gray-200'
              }`}
              onClick={() => setSelectedRec(selectedRec === rec.id ? null : rec.id)}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3 flex-1">
                  <div className="text-xl">{getTypeIcon(rec.type)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="font-semibold text-navy-900">{rec.title}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(rec.type)}`}>
                        {rec.type}
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-700 mb-2">{rec.description}</p>
                    
                    <div className="flex items-center space-x-4 text-xs text-gray-600 mb-2">
                      <div className="flex items-center space-x-1">
                        <TrendingUp className="w-3 h-3" />
                        <span>+{rec.estimatedBenefit} min saved</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <div className={`w-2 h-2 rounded-full ${getRiskColor(rec.riskLevel).includes('green') ? 'bg-green-500' : getRiskColor(rec.riskLevel).includes('yellow') ? 'bg-yellow-500' : 'bg-red-500'}`} />
                        <span>{rec.riskLevel} risk</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Brain className="w-3 h-3" />
                        <span>{rec.confidence}% confidence</span>
                      </div>
                    </div>

                    {/* Affected Trains */}
                    <div className="flex flex-wrap gap-1 mb-3">
                      {rec.affectedTrains.map((trainId) => (
                        <span
                          key={trainId}
                          className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs"
                        >
                          {trainId}
                        </span>
                      ))}
                    </div>

                    {/* Confidence Bar */}
                    <div className="mb-3">
                      <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                        <span>AI Confidence</span>
                        <span>{rec.confidence}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div
                          className={`h-1.5 rounded-full transition-all ${
                            rec.confidence >= 80 ? 'bg-green-500' :
                            rec.confidence >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${rec.confidence}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col space-y-1 ml-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleApply(rec.id);
                    }}
                    className="p-1.5 text-green-600 hover:bg-green-50 rounded transition-colors"
                    title="Apply Recommendation"
                  >
                    <CheckCircle className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleReject(rec.id);
                    }}
                    className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                    title="Reject Recommendation"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Expanded Details */}
              {selectedRec === rec.id && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <h5 className="font-medium text-navy-800 text-sm mb-2">Impact Analysis</h5>
                      <div className="space-y-1 text-xs text-gray-600">
                        <div className="flex justify-between">
                          <span>Time Saved:</span>
                          <span className="font-medium text-green-600">+{rec.estimatedBenefit} minutes</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Affected Trains:</span>
                          <span className="font-medium">{rec.affectedTrains.length}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Risk Level:</span>
                          <span className={`font-medium capitalize ${getRiskColor(rec.riskLevel)}`}>
                            {rec.riskLevel}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h5 className="font-medium text-navy-800 text-sm mb-2">Implementation</h5>
                      <div className="space-y-1 text-xs text-gray-600">
                        <div>• Estimated time: 2-3 minutes</div>
                        <div>• Requires signal coordination</div>
                        <div>• No passenger impact expected</div>
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleApply(rec.id);
                      }}
                      className="flex-1 bg-green-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-green-700 transition-colors"
                    >
                      Apply Now
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        // Simulate recommendation
                      }}
                      className="flex-1 bg-blue-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-blue-700 transition-colors"
                    >
                      Simulate First
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* AI Status */}
      <div className="border-t border-gray-200 p-4 bg-gradient-to-r from-purple-50 to-indigo-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-sm text-gray-700">AI Engine Active</span>
          </div>
          <div className="text-xs text-gray-600">
            Last updated: {new Date().toLocaleTimeString('en-IN', { hour12: false })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIRecommendations;