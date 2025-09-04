import React from "react";
import { NavLink } from "react-router-dom";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const Sidebar = ({ isOpen, onClose }) => {
  const navigation = [
    { name: "Dashboard", href: "/", icon: "LayoutDashboard" },
    { name: "Students", href: "/students", icon: "Users" },
    { name: "Grades", href: "/grades", icon: "BookOpen" },
    { name: "Attendance", href: "/attendance", icon: "Calendar" },
    { name: "Classes", href: "/classes", icon: "School" },
  ];
  
  return (
    <>
      {/* Mobile overlay */}
      <div 
        className={cn(
          "fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />
      
      {/* Mobile sidebar */}
      <aside className={cn(
        "fixed top-0 left-0 w-64 h-full bg-gradient-to-b from-primary to-primary-dark z-50 lg:hidden transition-transform duration-300 ease-out",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center">
              <ApperIcon name="GraduationCap" className="w-8 h-8 text-white mr-3" />
              <h1 className="text-xl font-display font-bold text-white">ScholarHub</h1>
            </div>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white transition-colors"
            >
              <ApperIcon name="X" className="w-6 h-6" />
            </button>
          </div>
          
          <nav className="space-y-2">
            {navigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                onClick={onClose}
                className={({ isActive }) =>
                  cn(
                    "flex items-center px-4 py-3 rounded-lg text-white/90 hover:text-white hover:bg-white/10 transition-all duration-200",
                    isActive && "bg-white/20 text-white border-l-4 border-primary-light"
                  )
                }
              >
                <ApperIcon name={item.icon} className="w-5 h-5 mr-3" />
                {item.name}
              </NavLink>
            ))}
          </nav>
        </div>
      </aside>
      
      {/* Desktop sidebar */}
<aside className="hidden lg:block fixed top-0 left-0 w-64 h-full bg-gradient-to-b from-primary to-primary-dark z-30">
        <div className="p-6">
          <div className="flex items-center mb-8">
            <ApperIcon name="GraduationCap" className="w-8 h-8 text-white mr-3" />
            <h1 className="text-xl font-display font-bold text-white">ScholarHub</h1>
          </div>
          
          <nav className="space-y-2">
            {navigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                className={({ isActive }) =>
                  cn(
                    "flex items-center px-4 py-3 rounded-lg text-white/90 hover:text-white hover:bg-white/10 transition-all duration-200",
                    isActive && "bg-white/20 text-white border-l-4 border-primary-light"
                  )
                }
              >
                <ApperIcon name={item.icon} className="w-5 h-5 mr-3" />
                {item.name}
              </NavLink>
            ))}
          </nav>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;