import React from "react";
import ApperIcon from "@/components/ApperIcon";

const Loading = ({ text = "Loading...", className = "" }) => {
  return (
    <div className={`flex flex-col items-center justify-center py-12 ${className}`}>
      <div className="relative">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
        <ApperIcon 
          name="BookOpen" 
          className="w-6 h-6 text-primary absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" 
        />
      </div>
      <p className="text-gray-600 mt-4 font-medium">{text}</p>
      
      {/* Skeleton placeholders */}
      <div className="w-full max-w-4xl mt-8 space-y-4">
        <div className="animate-pulse">
          <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg mb-3"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-gradient-to-br from-surface/50 to-white border border-primary/10 rounded-xl p-6">
                <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded mb-2"></div>
                <div className="h-8 bg-gradient-to-r from-primary/20 to-primary-dark/20 rounded-lg mb-2"></div>
                <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-2/3"></div>
              </div>
            ))}
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded mb-4"></div>
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center space-x-4 mb-3">
                <div className="w-10 h-10 bg-gradient-to-r from-primary/20 to-primary-dark/20 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded mb-1"></div>
                  <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-1/2"></div>
                </div>
                <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-16"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loading;