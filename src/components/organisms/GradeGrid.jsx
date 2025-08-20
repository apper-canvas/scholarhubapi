import React, { useState, useEffect } from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import GradeCell from "@/components/molecules/GradeCell";
import { formatDate } from "@/utils/dateUtils";

const GradeGrid = ({ 
  students = [], 
  assignments = [], 
  grades = [], 
  onGradeChange,
  onAddAssignment 
}) => {
  const [selectedClass, setSelectedClass] = useState("");
  const [filteredAssignments, setFilteredAssignments] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  
  useEffect(() => {
    if (selectedClass) {
      setFilteredAssignments(assignments.filter(a => a.classId === selectedClass));
      setFilteredStudents(students.filter(s => s.classIds.includes(selectedClass)));
    } else {
      setFilteredAssignments(assignments);
      setFilteredStudents(students);
    }
  }, [selectedClass, assignments, students]);
  
  const getGradeForStudent = (studentId, assignmentId) => {
    return grades.find(g => g.studentId === studentId && g.assignmentId === assignmentId);
  };
  
  const getStudentAverage = (studentId) => {
    const studentGrades = grades.filter(g => g.studentId === studentId && g.submitted);
    if (studentGrades.length === 0) return 0;
    
    const total = studentGrades.reduce((sum, grade) => {
      const assignment = assignments.find(a => a.Id === grade.assignmentId);
      return sum + (grade.score / assignment.points * 100);
    }, 0);
    
    return Math.round(total / studentGrades.length);
  };
  
  const getAssignmentAverage = (assignmentId) => {
    const assignmentGrades = grades.filter(g => g.assignmentId === assignmentId && g.submitted);
    if (assignmentGrades.length === 0) return 0;
    
    const assignment = assignments.find(a => a.Id === assignmentId);
    const total = assignmentGrades.reduce((sum, grade) => sum + (grade.score / assignment.points * 100), 0);
    
    return Math.round(total / assignmentGrades.length);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h3 className="text-lg font-semibold text-gray-900">Grade Grid</h3>
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
          >
            <option value="">All Classes</option>
            {/* Classes would be populated from service */}
            <option value="class1">Mathematics - Period 1</option>
            <option value="class2">English - Period 2</option>
            <option value="class3">Science - Period 3</option>
          </select>
        </div>
        
        <Button
          icon="Plus"
          onClick={onAddAssignment}
        >
          Add Assignment
        </Button>
      </div>
      
      {filteredAssignments.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-xl">
          <ApperIcon name="BookOpen" className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 mb-2">No assignments found</p>
          <p className="text-sm text-gray-400">Create your first assignment to start grading</p>
        </div>
      ) : (
        <div className="overflow-x-auto border rounded-xl bg-white">
          <table className="w-full">
            <thead className="table-header">
              <tr>
                <th className="sticky left-0 bg-surface z-10 px-6 py-4 text-left font-semibold text-gray-700 border-r">
                  Student
                </th>
                {filteredAssignments.map((assignment) => (
                  <th key={assignment.Id} className="px-4 py-4 text-center font-semibold text-gray-700 min-w-[100px]">
                    <div className="space-y-1">
                      <div className="font-medium">{assignment.name}</div>
                      <div className="text-xs text-gray-500">
                        {assignment.points} pts • {formatDate(assignment.dueDate)}
                      </div>
                      <div className="text-xs text-primary font-medium">
                        Avg: {getAssignmentAverage(assignment.Id)}%
                      </div>
                    </div>
                  </th>
                ))}
                <th className="px-4 py-4 text-center font-semibold text-gray-700 min-w-[80px] border-l">
                  Average
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
                  {filteredAssignments.map((assignment) => (
                    <td key={assignment.Id} className="px-4 py-4 text-center">
                      <div className="flex justify-center">
                        <GradeCell
                          grade={getGradeForStudent(student.Id, assignment.Id)}
                          assignment={assignment}
                          onGradeChange={(updatedGrade) => 
                            onGradeChange?.({
                              ...updatedGrade,
                              studentId: student.Id,
                              assignmentId: assignment.Id
                            })
                          }
                        />
                      </div>
                    </td>
                  ))}
                  <td className="px-4 py-4 text-center border-l">
                    <div className="text-lg font-bold text-primary">
                      {getStudentAverage(student.Id)}%
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default GradeGrid;