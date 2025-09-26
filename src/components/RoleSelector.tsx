import React from 'react';
import { Role } from '../types';
import { ChevronDown, User, Settings, BarChart3 } from 'lucide-react';

interface RoleSelectorProps {
  currentRole: Role;
  onRoleChange: (role: Role) => void;
}

const RoleSelector: React.FC<RoleSelectorProps> = ({ currentRole, onRoleChange }) => {
  const roles = [
    { id: 'station-master', name: 'Station Master', icon: User },
    { id: 'signal-controller', name: 'Signal Controller', icon: Settings },
    { id: 'traffic-manager', name: 'Traffic Manager', icon: BarChart3 },
  ];

  const currentRoleData = roles.find(r => r.id === currentRole);
  const Icon = currentRoleData?.icon || User;

  return (
    <div className="relative group">
      <button className="flex items-center space-x-2 bg-navy-800 hover:bg-navy-700 px-4 py-2 rounded-lg transition-colors">
        <Icon className="w-4 h-4" />
        <span className="font-medium">{currentRoleData?.name}</span>
        <ChevronDown className="w-4 h-4" />
      </button>
      
      <div className="absolute right-0 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
        {roles.map((role) => {
          const RoleIcon = role.icon;
          return (
            <button
              key={role.id}
              onClick={() => onRoleChange(role.id as Role)}
              className={`w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors first:rounded-t-lg last:rounded-b-lg ${
                currentRole === role.id ? 'bg-saffron-50 text-saffron-700' : 'text-gray-700'
              }`}
            >
              <RoleIcon className="w-4 h-4" />
              <span className="font-medium">{role.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default RoleSelector;