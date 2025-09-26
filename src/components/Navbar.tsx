import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Brain as Train, Bell, User, ChevronDown, Menu, X } from 'lucide-react';

interface NavbarProps {
  currentRole: string;
  onRoleChange: (role: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentRole, onRoleChange }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const location = useLocation();

  const roles = [
    { id: 'station-master', name: 'Station Master' },
    { id: 'signal-controller', name: 'Signal Controller' },
    { id: 'traffic-manager', name: 'Traffic Manager' },
  ];

  const navItems = [
    { path: '/', label: 'Dashboard' },
    { path: '/trains', label: 'Train Details' },
    { path: '/map', label: 'Traffic Map' },
    { path: '/reports', label: 'Reports' },
    { path: '/roles', label: 'Role Access' },
  ];

  const currentRoleData = roles.find(r => r.id === currentRole);

  return (
    <nav className="fixed top-0 left-0 right-0 bg-navy-900 text-white shadow-lg z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-saffron-500 rounded-lg flex items-center justify-center">
              <Train className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold">RailMargdarshi</h1>
              <p className="text-xs text-blue-200">Indian Railways Traffic Control</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  location.pathname === item.path
                    ? 'bg-saffron-500 text-white'
                    : 'text-gray-300 hover:bg-navy-700 hover:text-white'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Right Side */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Notifications */}
            <button className="relative p-2 text-gray-300 hover:text-white transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                3
              </span>
            </button>

            {/* Role Selector */}
            <div className="relative">
              <button
                onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
                className="flex items-center space-x-2 bg-navy-800 hover:bg-navy-700 px-4 py-2 rounded-lg transition-colors"
              >
                <User className="w-4 h-4" />
                <span className="text-sm font-medium">{currentRoleData?.name}</span>
                <ChevronDown className="w-4 h-4" />
              </button>

              {isRoleDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg">
                  {roles.map((role) => (
                    <button
                      key={role.id}
                      onClick={() => {
                        onRoleChange(role.id);
                        setIsRoleDropdownOpen(false);
                      }}
                      className={`w-full text-left px-4 py-3 text-sm hover:bg-gray-50 transition-colors first:rounded-t-lg last:rounded-b-lg ${
                        currentRole === role.id ? 'bg-saffron-50 text-saffron-700' : 'text-gray-700'
                      }`}
                    >
                      {role.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-gray-300 hover:text-white transition-colors"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-navy-800 border-t border-navy-700">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMenuOpen(false)}
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                  location.pathname === item.path
                    ? 'bg-saffron-500 text-white'
                    : 'text-gray-300 hover:bg-navy-700 hover:text-white'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
          <div className="pt-4 pb-3 border-t border-navy-700">
            <div className="px-2">
              <div className="text-sm text-gray-300 mb-2">Current Role:</div>
              {roles.map((role) => (
                <button
                  key={role.id}
                  onClick={() => {
                    onRoleChange(role.id);
                    setIsMenuOpen(false);
                  }}
                  className={`block w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    currentRole === role.id
                      ? 'bg-saffron-500 text-white'
                      : 'text-gray-300 hover:bg-navy-700 hover:text-white'
                  }`}
                >
                  {role.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;