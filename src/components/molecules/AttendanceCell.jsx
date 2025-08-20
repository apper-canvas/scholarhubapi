import React from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import { formatDate } from "@/utils/dateUtils";

const AttendanceCell = ({ 
  attendance, 
  date, 
  onStatusChange, 
  editable = true 
}) => {
  const statusConfig = {
    present: {
      icon: "Check",
      color: "status-present",
      label: "Present"
    },
    absent: {
      icon: "X",
      color: "status-absent", 
      label: "Absent"
    },
    tardy: {
      icon: "Clock",
      color: "status-tardy",
      label: "Tardy"
    }
  };
  
  const currentStatus = attendance?.status || "absent";
  const config = statusConfig[currentStatus];
  
  const handleClick = () => {
    if (!editable) return;
    
    // Cycle through statuses: absent -> present -> tardy -> absent
    const statusCycle = ["absent", "present", "tardy"];
    const currentIndex = statusCycle.indexOf(currentStatus);
    const nextStatus = statusCycle[(currentIndex + 1) % statusCycle.length];
    
    onStatusChange?.({
      ...attendance,
      status: nextStatus,
      date: typeof date === 'string' ? date : date.toISOString().split('T')[0]
    });
  };
  
  return (
    <div className="flex flex-col items-center">
      <button
        onClick={handleClick}
        disabled={!editable}
        className={cn(
          "w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200",
          config.color,
          editable && "hover:scale-110 cursor-pointer",
          !editable && "cursor-default"
        )}
        title={`${config.label} - ${formatDate(date, 'MMM d')}`}
      >
        <ApperIcon 
          name={config.icon} 
          className="w-4 h-4" 
        />
      </button>
      <span className="text-xs text-gray-500 mt-1">
        {formatDate(date, 'd')}
      </span>
    </div>
  );
};

export default AttendanceCell;