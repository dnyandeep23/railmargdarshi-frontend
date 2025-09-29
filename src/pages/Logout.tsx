import React from 'react';

const Logout: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
            <div className="bg-white p-8 rounded-lg shadow-lg flex flex-col items-center">
                <h1 className="text-2xl font-bold text-navy-900 mb-4">You have been logged out</h1>
                <p className="text-gray-600 mb-6">Thank you for using RailMargdarshi. Please login again to continue.</p>
                <a href="/login" className="bg-saffron-500 hover:bg-saffron-600 text-white px-6 py-2 rounded-lg font-medium transition-colors">Go to Login</a>
            </div>
        </div>
    );
};

export default Logout;
