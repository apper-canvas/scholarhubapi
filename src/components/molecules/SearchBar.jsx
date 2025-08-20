import React, { useState, useCallback } from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";

const SearchBar = ({ 
  onSearch, 
  onFilterChange, 
  filters = [], 
  placeholder = "Search...",
  className 
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilters, setActiveFilters] = useState({});
  
  const handleSearchChange = useCallback((e) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch?.(value);
  }, [onSearch]);
  
  const handleFilterChange = useCallback((filterKey, value) => {
    const newFilters = { ...activeFilters, [filterKey]: value };
    setActiveFilters(newFilters);
    onFilterChange?.(newFilters);
  }, [activeFilters, onFilterChange]);
  
  return (
    <div className={cn("flex flex-col sm:flex-row gap-4", className)}>
      <div className="flex-1">
        <Input
          icon="Search"
          placeholder={placeholder}
          value={searchTerm}
          onChange={handleSearchChange}
          className="w-full"
        />
      </div>
      
      {filters.length > 0 && (
        <div className="flex flex-wrap gap-3">
          {filters.map((filter, index) => (
            <div key={index} className="min-w-[150px]">
              <Select
                placeholder={filter.placeholder}
                options={filter.options}
                onChange={(e) => handleFilterChange(filter.key, e.target.value)}
                value={activeFilters[filter.key] || ""}
              />
            </div>
          ))}
        </div>
      )}
      
      {(searchTerm || Object.keys(activeFilters).some(key => activeFilters[key])) && (
        <button
          onClick={() => {
            setSearchTerm("");
            setActiveFilters({});
            onSearch?.("");
            onFilterChange?.({});
          }}
          className="flex items-center px-3 py-2 text-gray-500 hover:text-gray-700 transition-colors"
        >
          <ApperIcon name="X" className="w-4 h-4 mr-1" />
          Clear
        </button>
      )}
    </div>
  );
};

export default SearchBar;