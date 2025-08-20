import React, { useState, useEffect } from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import AttendanceCell from "@/components/molecules/AttendanceCell";
import { formatDate, getWeekDays, getMonthName } from "@/utils/dateUtils";

const AttendanceGrid = ({ 
  students = [], 
  attendance = [], 
  onAttendanceChange 
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState("week"); // week or month
  const [selectedClass, setSelectedClass] = useState("");
  const [filteredStudents, setFilteredStudents] = useState([]);
  
  useEffect(() => {
    if (selectedClass) {
      setFilteredStudents(students.filter(s => s.classIds.includes(selectedClass)));
    } else {
      setFilteredStudents(students);
    }
  }, [selectedClass, students]);
  
  const weekDays = getWeekDays(currentDate);
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  
  const getAttendanceForDate = (studentId, date) => {
    const dateString = typeof date === 'string' ? date : date.toISOString().split('T')[0];
    return attendance.find(a => a.studentId === studentId && a.date === dateString);
  };
  
  const getStudentAttendanceRate = (studentId) => {
    const studentAttendance = attendance.filter(a => a.studentId === studentId);
    if (studentAttendance.length === 0) return 100;
    
    const presentCount = studentAttendance.filter(a => a.status === 'present').length;
    return Math.round((presentCount / studentAttendance.length) * 100);
  };
  
  const navigateWeek = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + (direction * 7));
    setCurrentDate(newDate);
  };
  
  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + direction);
    setCurrentDate(newDate);
  };
  
  const markAllPresent = (date) => {
    filteredStudents.forEach(student => {
      const existing = getAttendanceForDate(student.Id, date);
      if (!existing) {
        onAttendanceChange?.({
          studentId: student.Id,
          classId: selectedClass || 'default',
          date: typeof date === 'string' ? date : date.toISOString().split('T')[0],
          status: 'present'
        });
      }
    });
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <h3 className="text-lg font-semibold text-gray-900">Attendance</h3>
          
          <div className="flex items-center bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode("week")}
              className={cn(
                "px-3 py-1 rounded-md text-sm font-medium transition-colors",
                viewMode === "week" 
                  ? "bg-white text-primary shadow-sm" 
                  : "text-gray-600 hover:text-gray-900"
              )}
            >
              Week
            </button>
            <button
              onClick={() => setViewMode("month")}
              className={cn(
                "px-3 py-1 rounded-md text-sm font-medium transition-colors",
                viewMode === "month" 
                  ? "bg-white text-primary shadow-sm" 
                  : "text-gray-600 hover:text-gray-900"
              )}
            >
              Month
            </button>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
          >
            <option value="">All Classes</option>
            <option value="class1">Mathematics - Period 1</option>
            <option value="class2">English - Period 2</option>
            <option value="class3">Science - Period 3</option>
          </select>
          
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setCurrentDate(new Date())}
          >
            Today
          </Button>
        </div>
      </div>
      
      {viewMode === "week" && (
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            icon="ChevronLeft"
            onClick={() => navigateWeek(-1)}
          />
          <h4 className="font-medium text-gray-900">
            Week of {formatDate(weekDays[0], 'MMM d')} - {formatDate(weekDays[6], 'MMM d, yyyy')}
          </h4>
          <Button
            variant="ghost"
            size="sm"
            icon="ChevronRight"
            onClick={() => navigateWeek(1)}
          />
        </div>
      )}
      
      {viewMode === "month" && (
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            icon="ChevronLeft"
            onClick={() => navigateMonth(-1)}
          />
          <h4 className="font-medium text-gray-900">
            {getMonthName(currentMonth)} {currentYear}
          </h4>
          <Button
            variant="ghost"
            size="sm"
            icon="ChevronRight"
            onClick={() => navigateMonth(1)}
          />
        </div>
      )}
      
      {filteredStudents.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-xl">
          <ApperIcon name="Calendar" className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 mb-2">No students found</p>
          <p className="text-sm text-gray-400">Select a class to view attendance</p>
        </div>
      ) : (
        <div className="overflow-x-auto border rounded-xl bg-white">
          <table className="w-full">
            <thead className="table-header">
              <tr>
                <th className="sticky left-0 bg-surface z-10 px-6 py-4 text-left font-semibold text-gray-700 border-r">
                  Student
                </th>
                {viewMode === "week" && weekDays.map((date, index) => (
                  <th key={index} className="px-4 py-4 text-center font-semibold text-gray-700 min-w-[80px]">
                    <div className="space-y-1">
                      <div className="text-sm font-medium">
                        {formatDate(date, 'EEE')}
                      </div>
                      <div className="text-xs text-gray-500">
                        {formatDate(date, 'MMM d')}
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => markAllPresent(date)}
                        className="text-xs text-primary hover:bg-primary/10"
                      >
                        Mark All
                      </Button>
                    </div>
                  </th>
                ))}
                <th className="px-4 py-4 text-center font-semibold text-gray-700 min-w-[80px] border-l">
                  Rate
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student, index) => (
                <tr 
                  key={student.Id}
                  className={cn(
                    "border-b border-gray-100 hover:bg-surface/30 transition-colors",
                    index % 2 === 0 && "bg-gray-50/50"
                  )}
                >
                  <td className="sticky left-0 bg-white z-10 px-6 py-4 border-r">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-gradient-to-r from-primary to-primary-dark rounded-full flex items-center justify-center mr-3">
                        <span className="text-white text-sm font-medium">
                          {student.firstName.charAt(0)}{student.lastName.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">
                          {student.firstName} {student.lastName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {student.id}
                        </div>
                      </div>
                    </div>
                  </td>
                  {viewMode === "week" && weekDays.map((date, dateIndex) => (
                    <td key={dateIndex} className="px-4 py-4 text-center">
                      <div className="flex justify-center">
                        <AttendanceCell
                          attendance={getAttendanceForDate(student.Id, date)}
                          date={date}
                          onStatusChange={(updatedAttendance) => 
                            onAttendanceChange?.(updatedAttendance)
                          }
                        />
                      </div>
                    </td>
                  ))}
                  <td className="px-4 py-4 text-center border-l">
                    <div className="flex items-center justify-center">
                      <div className="text-lg font-bold text-primary mr-2">
                        {getStudentAttendanceRate(student.Id)}%
                      </div>
                      <div className="w-8 h-2 bg-gray-200 rounded-full">
                        <div 
                          className="h-2 bg-gradient-to-r from-primary to-primary-dark rounded-full transition-all duration-300"
                          style={{ width: `${getStudentAttendanceRate(student.Id)}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      <div className="flex items-center justify-between text-sm text-gray-500 bg-surface p-4 rounded-lg">
        <div className="flex items-center space-x-6">
          <div className="flex items-center">
            <div className="w-4 h-4 rounded-full status-present mr-2"></div>
            Present
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 rounded-full status-absent mr-2"></div>
            Absent
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 rounded-full status-tardy mr-2"></div>
            Tardy
          </div>
        </div>
        <div className="text-gray-600">
          Click on attendance markers to change status
        </div>
      </div>
    </div>
  );
};

export default AttendanceGrid;