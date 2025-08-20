import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const Select = forwardRef(({ 
  className, 
  label,
  error,
  options = [],
  placeholder = "Select an option",
  required = false,
  ...props 
}, ref) => {
  const selectClasses = cn(
    "w-full px-4 py-3 rounded-lg border transition-colors duration-200 outline-none",
    "focus:ring-2 focus:ring-primary/20 bg-white",
    "appearance-none pr-10",
    error 
      ? "border-error focus:border-error" 
      : "border-gray-200 focus:border-primary",
    className
  );
  
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-error ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        <select
          ref={ref}
          className={selectClasses}
          {...props}
        >
          <option value="">{placeholder}</option>
          {options.map((option, index) => (
            <option key={index} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
          <ApperIcon name="ChevronDown" className="w-5 h-5 text-gray-400" />
        </div>
      </div>
      {error && (
        <p className="text-sm text-error flex items-center">
          <ApperIcon name="AlertCircle" className="w-4 h-4 mr-1" />
          {error}
        </p>
      )}
    </div>
  );
});

Select.displayName = "Select";

export default Select;