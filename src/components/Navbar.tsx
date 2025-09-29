import React, { useState } from 'react';
import { logout } from '../api';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { Link, useLocation } from 'react-router-dom';
import { Brain as Train, Bell, User, Menu, X } from 'lucide-react';

interface NavbarProps {
  currentRole: string;
}

const Navbar: React.FC<NavbarProps> = ({ currentRole }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const { setUser } = useUser();
  const handleLogout = async () => {
    try {
      await logout();
      setUser(null);
      navigate('/logout');
    } catch {
      alert('Logout failed');
    }
  };

  const roles = [
    { id: 'admin', name: 'Admin' },
    { id: 'stationmaster', name: 'Station Master' },
    { id: 'signalcontroller', name: 'Signal Controller' },
    { id: 'user', name: 'User' },
  ];

  const navItems = [
    { path: '/', label: 'Dashboard' },
    { path: '/trains', label: 'Train Details' },
    { path: '/map', label: 'Traffic Map' },
    // Reports only for admin
    ...(currentRole === 'admin' ? [{ path: '/reports', label: 'Reports' }] : []),
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
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${location.pathname === item.path
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

            {/* Show current user role only */}
            <div className="flex items-center space-x-2 bg-navy-800 px-4 py-2 rounded-lg">
              <User className="w-4 h-4" />
              <span className="text-sm font-medium">{currentRoleData?.name || currentRole}</span>
            </div>

            {/* Logout button */}
            <button
              onClick={handleLogout}
              className="ml-2 px-4 py-2 bg-saffron-500 hover:bg-saffron-600 text-white rounded-lg text-sm font-medium transition-colors"
            >
              Logout
            </button>
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
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${location.pathname === item.path
                  ? 'bg-saffron-500 text-white'
                  : 'text-gray-300 hover:bg-navy-700 hover:text-white'
                  }`}
              >
                {item.label}
              </Link>
            ))}
            {/* Logout button for mobile */}
            <button
              onClick={() => { setIsMenuOpen(false); handleLogout(); }}
              className="w-full mt-2 px-3 py-2 rounded-md text-base font-medium bg-saffron-500 text-white"
            >
              Logout
            </button>
          </div>
          <div className="pt-4 pb-3 border-t border-navy-700">
            <div className="px-2">
              <div className="text-sm text-gray-300 mb-2">Current Role:</div>
              <div className="block w-full text-left px-3 py-2 rounded-md text-sm font-medium bg-saffron-500 text-white">
                {currentRoleData?.name || currentRole}
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;