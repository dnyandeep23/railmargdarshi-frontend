import React from 'react';
import MapView from './MapView';
import AlertPanel from './AlertPanel';
import Timeline from './Timeline';
import TrackControl from './TrackControl';
import Analytics from './Analytics';
import AIRecommendations from './AIRecommendations';
import { Role } from '../types';

interface DashboardProps {
  currentRole: Role;
}

const Dashboard: React.FC<DashboardProps> = ({ currentRole }) => {
  const getModulesForRole = (role: Role) => {
    switch (role) {
      case 'station-master':
        return ['map', 'alerts', 'timeline', 'track'];
      case 'signal-controller':
        return ['map', 'alerts', 'track', 'ai'];
      case 'traffic-manager':
        return ['map', 'alerts', 'timeline', 'analytics', 'ai'];
      default:
        return ['map', 'alerts'];
    }
  };

  const modules = getModulesForRole(currentRole);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 grid grid-cols-12 gap-4 p-4 overflow-hidden">
          {/* Map View - Always visible */}
          <div className="col-span-12 lg:col-span-8 bg-white rounded-lg shadow-lg overflow-hidden">
            <MapView />
          </div>

          {/* Side Panel */}
          <div className="col-span-12 lg:col-span-4 space-y-4 overflow-y-auto">
            {modules.includes('alerts') && (
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <AlertPanel />
              </div>
            )}
            {modules.includes('ai') && (
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <AIRecommendations />
              </div>
            )}
          </div>

          {/* Bottom Panel */}
          {(modules.includes('timeline') || modules.includes('track') || modules.includes('analytics')) && (
            <div className="col-span-12 bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="flex border-b border-gray-200">
                {modules.includes('timeline') && (
                  <button className="px-4 py-2 text-sm font-medium text-navy-600 border-b-2 border-saffron-500">
                    Timeline
                  </button>
                )}
                {modules.includes('track') && (
                  <button className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-navy-600">
                    Track Control
                  </button>
                )}
                {modules.includes('analytics') && (
                  <button className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-navy-600">
                    Analytics
                  </button>
                )}
              </div>
              <div className="h-80 overflow-hidden">
                {modules.includes('timeline') && <Timeline />}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;