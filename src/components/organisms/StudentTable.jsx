import React, { useState } from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import { getLetterGrade, getGradeColor } from "@/utils/gradeUtils";

const StudentTable = ({ 
  students = [], 
  onEdit, 
  onDelete, 
  onViewDetails 
}) => {
  const [sortField, setSortField] = useState("lastName");
  const [sortDirection, setSortDirection] = useState("asc");
  
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };
  
  const sortedStudents = [...students].sort((a, b) => {
    let aValue = a[sortField];
    let bValue = b[sortField];
    
    if (typeof aValue === "string") {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }
    
    if (sortDirection === "asc") {
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
    } else {
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
    }
  });
  
  const SortIcon = ({ field }) => {
    if (sortField !== field) {
      return <ApperIcon name="ArrowUpDown" className="w-4 h-4 text-gray-400" />;
    }
    return (
      <ApperIcon 
        name={sortDirection === "asc" ? "ArrowUp" : "ArrowDown"} 
        className="w-4 h-4 text-primary" 
      />
    );
  };
  
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="table-header">
          <tr>
            <th 
              className="text-left py-4 px-6 font-semibold text-gray-700 cursor-pointer hover:bg-primary/10 transition-colors"
              onClick={() => handleSort("lastName")}
            >
              <div className="flex items-center">
                Name
                <SortIcon field="lastName" />
              </div>
            </th>
            <th 
              className="text-left py-4 px-6 font-semibold text-gray-700 cursor-pointer hover:bg-primary/10 transition-colors"
              onClick={() => handleSort("id")}
            >
              <div className="flex items-center">
                Student ID
                <SortIcon field="id" />
              </div>
            </th>
            <th 
              className="text-left py-4 px-6 font-semibold text-gray-700 cursor-pointer hover:bg-primary/10 transition-colors"
              onClick={() => handleSort("gradeLevel")}
            >
              <div className="flex items-center">
                Grade Level
                <SortIcon field="gradeLevel" />
              </div>
            </th>
            <th 
              className="text-left py-4 px-6 font-semibold text-gray-700 cursor-pointer hover:bg-primary/10 transition-colors"
              onClick={() => handleSort("currentGrade")}
            >
              <div className="flex items-center">
                Current Grade
                <SortIcon field="currentGrade" />
              </div>
            </th>
            <th 
              className="text-left py-4 px-6 font-semibold text-gray-700 cursor-pointer hover:bg-primary/10 transition-colors"
              onClick={() => handleSort("attendanceRate")}
            >
              <div className="flex items-center">
                Attendance
                <SortIcon field="attendanceRate" />
              </div>
            </th>
            <th className="text-right py-4 px-6 font-semibold text-gray-700">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedStudents.map((student, index) => (
            <tr 
              key={student.Id}
              className={cn(
                "border-b border-gray-100 hover:bg-surface/30 transition-colors",
                index % 2 === 0 && "bg-gray-50/50"
              )}
            >
              <td className="py-4 px-6">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-r from-primary to-primary-dark rounded-full flex items-center justify-center mr-3">
                    <span className="text-white font-medium">
                      {student.firstName.charAt(0)}{student.lastName.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">
                      {student.firstName} {student.lastName}
                    </div>
                    <div className="text-sm text-gray-500">
                      {student.email}
                    </div>
                  </div>
                </div>
              </td>
              <td className="py-4 px-6 text-gray-900 font-mono">
                {student.id}
              </td>
              <td className="py-4 px-6">
                <Badge variant="primary">
                  Grade {student.gradeLevel}
                </Badge>
              </td>
              <td className="py-4 px-6">
                <Badge 
                  variant="grade"
                  className={getGradeColor(student.currentGrade)}
                >
                  {getLetterGrade(student.currentGrade)} ({student.currentGrade}%)
                </Badge>
              </td>
              <td className="py-4 px-6">
                <div className="flex items-center">
                  <div className="flex-1 bg-gray-200 rounded-full h-2 mr-3">
                    <div 
                      className="bg-gradient-to-r from-primary to-primary-dark h-2 rounded-full transition-all duration-300"
                      style={{ width: `${student.attendanceRate}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    {student.attendanceRate}%
                  </span>
                </div>
              </td>
              <td className="py-4 px-6 text-right">
                <div className="flex items-center justify-end space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    icon="Eye"
                    onClick={() => onViewDetails?.(student)}
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    icon="Edit"
                    onClick={() => onEdit?.(student)}
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    icon="Trash2"
                    onClick={() => onDelete?.(student.Id)}
                    className="text-error hover:text-error hover:bg-error/10"
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {sortedStudents.length === 0 && (
        <div className="text-center py-12">
          <ApperIcon name="Users" className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 mb-2">No students found</p>
          <p className="text-sm text-gray-400">Add your first student to get started</p>
        </div>
      )}
    </div>
  );
};

export default StudentTable;