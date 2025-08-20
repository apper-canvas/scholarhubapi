import React from "react";
import { cn } from "@/utils/cn";
import Card from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";

const StatCard = ({ 
  title, 
  value, 
  change, 
  changeType = "neutral", 
  icon, 
  gradient = false,
  className 
}) => {
  const changeColors = {
    positive: "text-success",
    negative: "text-error",
    neutral: "text-gray-500"
  };
  
  const changeIcons = {
    positive: "TrendingUp",
    negative: "TrendingDown",
    neutral: "Minus"
  };
  
  return (
    <Card 
      variant={gradient ? "gradient" : "elevated"} 
      className={cn("p-6", className)}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mb-2">{value}</p>
          {change && (
            <div className={cn("flex items-center text-sm", changeColors[changeType])}>
              <ApperIcon 
                name={changeIcons[changeType]} 
                className="w-4 h-4 mr-1" 
              />
              {change}
            </div>
          )}
        </div>
        {icon && (
          <div className="p-3 bg-primary/10 rounded-lg">
            <ApperIcon 
              name={icon} 
              className="w-6 h-6 text-primary" 
            />
          </div>
        )}
      </div>
    </Card>
  );
};

export default StatCard;