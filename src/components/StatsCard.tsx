import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  icon: React.ComponentType<any>;
  color: 'green' | 'blue' | 'yellow' | 'red' | 'purple';
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, change, trend, icon: Icon, color }) => {
  const getColorClasses = (color: string) => {
    switch (color) {
      case 'green':
        return 'from-green-50 to-green-100 border-green-200 text-green-800';
      case 'blue':
        return 'from-blue-50 to-blue-100 border-blue-200 text-blue-800';
      case 'yellow':
        return 'from-yellow-50 to-yellow-100 border-yellow-200 text-yellow-800';
      case 'red':
        return 'from-red-50 to-red-100 border-red-200 text-red-800';
      case 'purple':
        return 'from-purple-50 to-purple-100 border-purple-200 text-purple-800';
      default:
        return 'from-gray-50 to-gray-100 border-gray-200 text-gray-800';
    }
  };

  const getIconColor = (color: string) => {
    switch (color) {
      case 'green': return 'text-green-600';
      case 'blue': return 'text-blue-600';
      case 'yellow': return 'text-yellow-600';
      case 'red': return 'text-red-600';
      case 'purple': return 'text-purple-600';
      default: return 'text-gray-600';
    }
  };

  const getTrendColor = (trend: string) => {
    return trend === 'up' ? 'text-green-600' : 'text-red-600';
  };

  return (
    <div className={`bg-gradient-to-r ${getColorClasses(color)} p-6 rounded-lg border shadow-sm hover:shadow-md transition-shadow`}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium opacity-80">{title}</p>
          <p className="text-3xl font-bold mt-2">{value}</p>
        </div>
        <div className={`w-12 h-12 rounded-lg bg-white bg-opacity-50 flex items-center justify-center ${getIconColor(color)}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
      <div className={`flex items-center mt-4 text-sm ${getTrendColor(trend)}`}>
        {trend === 'up' ? (
          <TrendingUp className="w-4 h-4 mr-1" />
        ) : (
          <TrendingDown className="w-4 h-4 mr-1" />
        )}
        <span className="font-medium">{change}</span>
        <span className="text-gray-600 ml-1">from last period</span>
      </div>
    </div>
  );
};

export default StatsCard;