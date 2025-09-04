import React, { useContext } from "react";
import { useSelector } from "react-redux";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import { AuthContext } from "../../App";
const Header = ({ onMenuClick, title = "Dashboard" }) => {
  const { user } = useSelector((state) => state.user);
  const { logout } = useContext(AuthContext);

  const handleLogout = async () => {
    if (confirm("Are you sure you want to log out?")) {
      await logout();
    }
  };

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
          
<div className="flex items-center space-x-3">
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-sm font-medium text-gray-900">
                {user?.firstName || 'User'}
              </span>
              <span className="text-xs text-gray-500">
                {user?.emailAddress || 'user@scholarhub.com'}
              </span>
            </div>
            <div className="w-8 h-8 bg-gradient-to-r from-primary to-primary-dark rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">
                {user?.firstName?.charAt(0) || 'U'}
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              icon="LogOut"
              onClick={handleLogout}
              className="text-gray-600 hover:text-error"
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;