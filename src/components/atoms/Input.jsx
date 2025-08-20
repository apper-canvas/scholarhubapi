import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const Input = forwardRef(({ 
  className, 
  type = "text", 
  label,
  error,
  icon,
  iconPosition = "left",
  placeholder,
  required = false,
  ...props 
}, ref) => {
  const inputClasses = cn(
    "w-full px-4 py-3 rounded-lg border transition-colors duration-200 outline-none",
    "focus:ring-2 focus:ring-primary/20",
    error 
      ? "border-error focus:border-error" 
      : "border-gray-200 focus:border-primary",
    icon && iconPosition === "left" && "pl-11",
    icon && iconPosition === "right" && "pr-11",
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
        {icon && iconPosition === "left" && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2">
            <ApperIcon name={icon} className="w-5 h-5 text-gray-400" />
          </div>
        )}
        <input
          ref={ref}
          type={type}
          className={inputClasses}
          placeholder={placeholder}
          {...props}
        />
        {icon && iconPosition === "right" && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <ApperIcon name={icon} className="w-5 h-5 text-gray-400" />
          </div>
        )}
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

Input.displayName = "Input";

export default Input;