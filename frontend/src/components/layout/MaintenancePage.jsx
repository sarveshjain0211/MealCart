import React from 'react';
import { Hammer, Wrench, Clock, RefreshCcw } from 'lucide-react';

const MaintenancePage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center bg-gray-50 dark:bg-gray-900">
      <div className="max-w-md p-8 bg-white shadow-2xl dark:bg-gray-800 rounded-2xl animate-in fade-in zoom-in duration-500">
        
        {/* Animated Icon Container */}
        <div className="relative flex items-center justify-center w-24 h-24 mx-auto mb-6 bg-blue-50 rounded-full dark:bg-blue-900/30">
          <Wrench className="w-10 h-10 text-blue-500 animate-pulse" />
          <Hammer className="absolute w-8 h-8 text-indigo-500 -right-2 -bottom-2 animate-bounce" />
        </div>

        <h1 className="mb-3 text-3xl font-bold text-gray-900 dark:text-white">
          Under Maintenance
        </h1>
        
        <p className="mb-6 text-gray-600 dark:text-gray-300">
          We're currently performing some scheduled updates to improve your experience. We'll be back online shortly!
        </p>

        <div className="flex items-center justify-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
            <Clock className="w-4 h-4" />
            <span>Estimated downtime: ~1 hour</span>
        </div>

        <div className="pt-6 mt-6 border-t border-gray-100 dark:border-gray-700">
            <button 
                onClick={() => window.location.reload()} 
                className="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-white transition-all bg-blue-600 rounded-xl hover:bg-blue-700 hover:shadow-lg focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900"
            >
                <RefreshCcw className="w-4 h-4 mr-2" />
                Refresh Page
            </button>
        </div>
      </div>
      
      <p className="mt-8 text-xs text-gray-400 dark:text-gray-600">
        &copy; {new Date().getFullYear()} MealCart. All rights reserved.
      </p>
    </div>
  );
};

export default MaintenancePage;
