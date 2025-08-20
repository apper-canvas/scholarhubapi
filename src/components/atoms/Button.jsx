import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const Button = forwardRef(({ 
  children, 
  className, 
  variant = "primary", 
  size = "md", 
  icon, 
  iconPosition = "left",
  disabled = false,
  loading = false,
  ...props 
}, ref) => {
  const baseStyles = "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-gradient-to-r from-primary to-primary-dark text-white hover:shadow-md hover:scale-105 active:scale-95",
    secondary: "bg-white text-primary border border-primary/20 hover:bg-surface hover:border-primary hover:shadow-sm",
    outline: "border-2 border-primary text-primary bg-transparent hover:bg-primary hover:text-white",
    ghost: "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
    danger: "bg-error text-white hover:bg-red-600 hover:shadow-md",
    success: "bg-success text-white hover:bg-green-600 hover:shadow-md"
  };
  
  const sizes = {
    sm: "px-3 py-2 text-sm",
    md: "px-4 py-3 text-base",
    lg: "px-6 py-4 text-lg"
  };
  
  const classes = cn(
    baseStyles,
    variants[variant],
    sizes[size],
    className
  );
  
  return (
    <button
      ref={ref}
      className={classes}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <ApperIcon 
          name="Loader2" 
          className="w-4 h-4 animate-spin mr-2" 
        />
      )}
      {icon && iconPosition === "left" && !loading && (
        <ApperIcon 
          name={icon} 
          className="w-4 h-4 mr-2" 
        />
      )}
      {children}
      {icon && iconPosition === "right" && !loading && (
        <ApperIcon 
          name={icon} 
          className="w-4 h-4 ml-2" 
        />
      )}
    </button>
  );
});

Button.displayName = "Button";

export default Button;