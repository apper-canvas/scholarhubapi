import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Card = forwardRef(({ 
  children, 
  className, 
  variant = "default",
  hover = false,
  ...props 
}, ref) => {
  const baseStyles = "bg-white rounded-xl border transition-all duration-200";
  
  const variants = {
    default: "border-gray-200 shadow-soft",
    gradient: "card-gradient border-primary/10 shadow-card",
    glass: "glass-effect shadow-medium",
    elevated: "border-gray-100 shadow-medium"
  };
  
  const hoverStyles = hover ? "hover:shadow-medium hover:scale-102 cursor-pointer" : "";
  
  const classes = cn(
    baseStyles,
    variants[variant],
    hoverStyles,
    className
  );
  
  return (
    <div
      ref={ref}
      className={classes}
      {...props}
    >
      {children}
    </div>
  );
});

Card.displayName = "Card";

export default Card;