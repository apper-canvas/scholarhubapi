import React from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Header = ({ onMenuClick, title = "Dashboard" }) => {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="sm"
            icon="Menu"
            onClick={onMenuClick}
            className="lg:hidden mr-3"
          />
          <h1 className="text-2xl font-display font-bold text-gray-900">
            {title}
          </h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="hidden sm:flex items-center bg-surface px-4 py-2 rounded-lg">
            <ApperIcon name="Calendar" className="w-4 h-4 text-primary mr-2" />
            <span className="text-sm text-gray-600">
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </span>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            icon="Bell"
            className="relative"
          >
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-error rounded-full"></span>
          </Button>
          
          <div className="flex items-center">
            <div className="w-8 h-8 bg-gradient-to-r from-primary to-primary-dark rounded-full flex items-center justify-center">
              <ApperIcon name="User" className="w-4 h-4 text-white" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;