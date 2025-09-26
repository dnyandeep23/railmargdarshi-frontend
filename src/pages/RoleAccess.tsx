import React, { useState } from 'react';
import { User, Shield, Settings, Eye, EyeOff, CheckCircle, XCircle } from 'lucide-react';

interface RoleAccessProps {
  currentRole: string;
}

const RoleAccess: React.FC<RoleAccessProps> = ({ currentRole }) => {
  const [selectedRole, setSelectedRole] = useState('station-master');

  const roles = [
    {
      id: 'station-master',
      name: 'Station Master',
      description: 'Manages individual station operations and platform assignments',
      icon: User,
      color: 'blue',
      permissions: {
        dashboard: { view: true, edit: false },
        trainDetails: { view: true, edit: true },
        trafficMap: { view: true, edit: false },
        reports: { view: true, edit: false },
        conflicts: { view: true, resolve: true },
        signals: { view: true, control: false },
        maintenance: { view: true, schedule: false },
        emergency: { view: true, trigger: false },
        analytics: { view: false, export: false },
        userManagement: { view: false, edit: false }
      },
      features: [
        'Platform assignment and management',
        'Local train scheduling',
        'Passenger announcements',
        'Station-specific conflict resolution',
        'Platform occupancy monitoring',
        'Local maintenance coordination'
      ],
      restrictions: [
        'Cannot control signals outside station',
        'Cannot schedule network-wide maintenance',
        'Limited to station-specific reports',
        'Cannot trigger emergency stops',
        'No access to system analytics'
      ]
    },
    {
      id: 'signal-controller',
      name: 'Signal Controller',
      description: 'Controls railway signals and track switching operations',
      icon: Settings,
      color: 'green',
      permissions: {
        dashboard: { view: true, edit: false },
        trainDetails: { view: true, edit: true },
        trafficMap: { view: true, edit: true },
        reports: { view: true, edit: false },
        conflicts: { view: true, resolve: true },
        signals: { view: true, control: true },
        maintenance: { view: true, schedule: false },
        emergency: { view: true, trigger: true },
        analytics: { view: true, export: false },
        userManagement: { view: false, edit: false }
      },
      features: [
        'Signal control and automation',
        'Track switching operations',
        'Interlocking system management',
        'Route setting and clearing',
        'Signal failure diagnostics',
        'Emergency signal override'
      ],
      restrictions: [
        'Cannot schedule maintenance',
        'Limited user management access',
        'Cannot export detailed analytics',
        'Requires approval for major route changes'
      ]
    },
    {
      id: 'traffic-manager',
      name: 'Traffic Manager',
      description: 'Oversees entire network operations and strategic decisions',
      icon: Shield,
      color: 'purple',
      permissions: {
        dashboard: { view: true, edit: true },
        trainDetails: { view: true, edit: true },
        trafficMap: { view: true, edit: true },
        reports: { view: true, edit: true },
        conflicts: { view: true, resolve: true },
        signals: { view: true, control: true },
        maintenance: { view: true, schedule: true },
        emergency: { view: true, trigger: true },
        analytics: { view: true, export: true },
        userManagement: { view: true, edit: true }
      },
      features: [
        'Network-wide traffic optimization',
        'Strategic route planning',
        'Resource allocation',
        'Performance analytics',
        'Maintenance scheduling',
        'Emergency response coordination',
        'User access management',
        'System configuration'
      ],
      restrictions: [
        'All features available',
        'Full system access',
        'Administrative privileges'
      ]
    }
  ];

  const currentRoleData = roles.find(r => r.id === currentRole);
  const selectedRoleData = roles.find(r => r.id === selectedRole);

  const getPermissionIcon = (hasPermission) => {
    return hasPermission ? (
      <CheckCircle className="w-4 h-4 text-green-600" />
    ) : (
      <XCircle className="w-4 h-4 text-red-600" />
    );
  };

  const getRoleColor = (color) => {
    const colors = {
      blue: 'bg-blue-100 text-blue-800 border-blue-200',
      green: 'bg-green-100 text-green-800 border-green-200',
      purple: 'bg-purple-100 text-purple-800 border-purple-200'
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-navy-900">Role Management & Access Control</h1>
        <p className="text-gray-600 mt-2">Manage user roles and permissions across the system</p>
      </div>

      {/* Current Role Status */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getRoleColor(currentRoleData?.color)}`}>
              {currentRoleData && <currentRoleData.icon className="w-6 h-6" />}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-navy-900">Current Role</h3>
              <p className="text-gray-600">{currentRoleData?.name}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-600">Session Active</div>
            <div className="flex items-center space-x-2 text-green-600">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium">Connected</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Role Selection */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold text-navy-900 mb-4">Available Roles</h3>
            <div className="space-y-3">
              {roles.map((role) => {
                const Icon = role.icon;
                return (
                  <button
                    key={role.id}
                    onClick={() => setSelectedRole(role.id)}
                    className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                      selectedRole === role.id
                        ? 'border-saffron-300 bg-saffron-50'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getRoleColor(role.color)}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-navy-900">{role.name}</h4>
                        <p className="text-sm text-gray-600 truncate">{role.description}</p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Role Details */}
        <div className="lg:col-span-2 space-y-6">
          {selectedRoleData && (
            <>
              {/* Role Overview */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex items-center space-x-4 mb-6">
                  <div className={`w-16 h-16 rounded-lg flex items-center justify-center ${getRoleColor(selectedRoleData.color)}`}>
                    <selectedRoleData.icon className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-navy-900">{selectedRoleData.name}</h3>
                    <p className="text-gray-600">{selectedRoleData.description}</p>
                  </div>
                </div>

                {/* Features */}
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-navy-900 mb-3">Key Features & Capabilities</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {selectedRoleData.features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Restrictions */}
                <div>
                  <h4 className="text-lg font-semibold text-navy-900 mb-3">Restrictions & Limitations</h4>
                  <div className="space-y-2">
                    {selectedRoleData.restrictions.map((restriction, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <XCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{restriction}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Permissions Matrix */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h4 className="text-lg font-semibold text-navy-900 mb-4">Detailed Permissions</h4>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-medium text-navy-900">Module</th>
                        <th className="text-center py-3 px-4 font-medium text-navy-900">View</th>
                        <th className="text-center py-3 px-4 font-medium text-navy-900">Edit</th>
                        <th className="text-center py-3 px-4 font-medium text-navy-900">Control</th>
                        <th className="text-center py-3 px-4 font-medium text-navy-900">Advanced</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      <tr>
                        <td className="py-3 px-4 font-medium">Dashboard</td>
                        <td className="py-3 px-4 text-center">{getPermissionIcon(selectedRoleData.permissions.dashboard.view)}</td>
                        <td className="py-3 px-4 text-center">{getPermissionIcon(selectedRoleData.permissions.dashboard.edit)}</td>
                        <td className="py-3 px-4 text-center">-</td>
                        <td className="py-3 px-4 text-center">-</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4 font-medium">Train Details</td>
                        <td className="py-3 px-4 text-center">{getPermissionIcon(selectedRoleData.permissions.trainDetails.view)}</td>
                        <td className="py-3 px-4 text-center">{getPermissionIcon(selectedRoleData.permissions.trainDetails.edit)}</td>
                        <td className="py-3 px-4 text-center">-</td>
                        <td className="py-3 px-4 text-center">-</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4 font-medium">Traffic Map</td>
                        <td className="py-3 px-4 text-center">{getPermissionIcon(selectedRoleData.permissions.trafficMap.view)}</td>
                        <td className="py-3 px-4 text-center">{getPermissionIcon(selectedRoleData.permissions.trafficMap.edit)}</td>
                        <td className="py-3 px-4 text-center">-</td>
                        <td className="py-3 px-4 text-center">-</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4 font-medium">Signal Control</td>
                        <td className="py-3 px-4 text-center">{getPermissionIcon(selectedRoleData.permissions.signals.view)}</td>
                        <td className="py-3 px-4 text-center">-</td>
                        <td className="py-3 px-4 text-center">{getPermissionIcon(selectedRoleData.permissions.signals.control)}</td>
                        <td className="py-3 px-4 text-center">-</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4 font-medium">Maintenance</td>
                        <td className="py-3 px-4 text-center">{getPermissionIcon(selectedRoleData.permissions.maintenance.view)}</td>
                        <td className="py-3 px-4 text-center">-</td>
                        <td className="py-3 px-4 text-center">-</td>
                        <td className="py-3 px-4 text-center">{getPermissionIcon(selectedRoleData.permissions.maintenance.schedule)}</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4 font-medium">Emergency Controls</td>
                        <td className="py-3 px-4 text-center">{getPermissionIcon(selectedRoleData.permissions.emergency.view)}</td>
                        <td className="py-3 px-4 text-center">-</td>
                        <td className="py-3 px-4 text-center">-</td>
                        <td className="py-3 px-4 text-center">{getPermissionIcon(selectedRoleData.permissions.emergency.trigger)}</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4 font-medium">Analytics</td>
                        <td className="py-3 px-4 text-center">{getPermissionIcon(selectedRoleData.permissions.analytics.view)}</td>
                        <td className="py-3 px-4 text-center">-</td>
                        <td className="py-3 px-4 text-center">-</td>
                        <td className="py-3 px-4 text-center">{getPermissionIcon(selectedRoleData.permissions.analytics.export)}</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4 font-medium">User Management</td>
                        <td className="py-3 px-4 text-center">{getPermissionIcon(selectedRoleData.permissions.userManagement.view)}</td>
                        <td className="py-3 px-4 text-center">{getPermissionIcon(selectedRoleData.permissions.userManagement.edit)}</td>
                        <td className="py-3 px-4 text-center">-</td>
                        <td className="py-3 px-4 text-center">-</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Role Comparison */}
              {currentRole !== selectedRole && (
                <div className="bg-gradient-to-r from-saffron-50 to-orange-50 rounded-lg border border-saffron-200 p-6">
                  <h4 className="text-lg font-semibold text-navy-900 mb-4">Role Comparison</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h5 className="font-medium text-navy-800 mb-2">Your Current Role ({currentRoleData?.name})</h5>
                      <div className="space-y-1 text-sm">
                        {currentRoleData?.features.slice(0, 3).map((feature, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <CheckCircle className="w-3 h-3 text-green-600" />
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h5 className="font-medium text-navy-800 mb-2">Selected Role ({selectedRoleData.name})</h5>
                      <div className="space-y-1 text-sm">
                        {selectedRoleData.features.slice(0, 3).map((feature, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <CheckCircle className="w-3 h-3 text-blue-600" />
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default RoleAccess;