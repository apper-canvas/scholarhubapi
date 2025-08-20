import React from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";

const Error = ({ 
  message = "Something went wrong", 
  onRetry, 
  className = "" 
}) => {
  return (
    <div className={`flex items-center justify-center py-12 ${className}`}>
      <Card className="p-8 text-center max-w-md mx-auto">
        <div className="w-16 h-16 bg-gradient-to-r from-error/10 to-error/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <ApperIcon 
            name="AlertTriangle" 
            className="w-8 h-8 text-error" 
          />
        </div>
        
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Oops! Something went wrong
        </h3>
        
        <p className="text-gray-600 mb-6">
          {message}
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-4">
          {onRetry && (
            <Button
              onClick={onRetry}
              icon="RefreshCw"
              variant="primary"
            >
              Try Again
            </Button>
          )}
          
          <Button
            onClick={() => window.location.reload()}
            variant="secondary"
            icon="RotateCcw"
          >
            Reload Page
          </Button>
        </div>
        
        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            If the problem persists, please contact support or try refreshing the page.
          </p>
        </div>
      </Card>
    </div>
  );
};

export default Error;