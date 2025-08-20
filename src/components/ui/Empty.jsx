import React from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";

const Empty = ({ 
  title = "No data found", 
  description = "Get started by adding your first item.",
  icon = "FileX",
  actionLabel = "Add Item",
  onAction,
  className = "" 
}) => {
  return (
    <div className={`flex items-center justify-center py-12 ${className}`}>
      <Card variant="gradient" className="p-8 text-center max-w-md mx-auto">
        <div className="w-16 h-16 bg-gradient-to-r from-primary/10 to-primary-dark/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <ApperIcon 
            name={icon} 
            className="w-8 h-8 text-primary" 
          />
        </div>
        
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {title}
        </h3>
        
        <p className="text-gray-600 mb-6">
          {description}
        </p>
        
        {onAction && (
          <Button
            onClick={onAction}
            icon="Plus"
            variant="primary"
            className="mb-4"
          >
            {actionLabel}
          </Button>
        )}
        
        <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-primary/10">
          <div className="text-center">
            <ApperIcon name="Users" className="w-6 h-6 text-primary/60 mx-auto mb-1" />
            <p className="text-xs text-gray-500">Students</p>
          </div>
          <div className="text-center">
            <ApperIcon name="BookOpen" className="w-6 h-6 text-primary/60 mx-auto mb-1" />
            <p className="text-xs text-gray-500">Grades</p>
          </div>
          <div className="text-center">
            <ApperIcon name="Calendar" className="w-6 h-6 text-primary/60 mx-auto mb-1" />
            <p className="text-xs text-gray-500">Attendance</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Empty;