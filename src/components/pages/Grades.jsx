import React, { useState, useEffect } from "react";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import GradeGrid from "@/components/organisms/GradeGrid";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { studentService } from "@/services/api/studentService";
import { assignmentService } from "@/services/api/assignmentService";
import { gradeService } from "@/services/api/gradeService";
import { classService } from "@/services/api/classService";
import { toast } from "react-toastify";

const Grades = () => {
  const [students, setStudents] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [grades, setGrades] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [stats, setStats] = useState({});

  const loadGradesData = async () => {
    try {
      setError("");
      setLoading(true);
      
      const [
        studentsData,
        assignmentsData,
        gradesData,
        classesData,
        gradeStats
      ] = await Promise.all([
        studentService.getAll(),
        assignmentService.getAll(),
        gradeService.getAll(),
        classService.getAll(),
        gradeService.getGradeStats()
      ]);
      
      setStudents(studentsData);
      setAssignments(assignmentsData);
      setGrades(gradesData);
      setClasses(classesData);
      setStats(gradeStats);
      
    } catch (err) {
      setError(err.message || "Failed to load grades data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGradesData();
  }, []);

  const handleGradeChange = async (gradeData) => {
    try {
      await gradeService.update(
        { studentId: gradeData.studentId, assignmentId: gradeData.assignmentId },
        gradeData
      );
      
      // Update local state
      setGrades(prevGrades => {
        const existingIndex = prevGrades.findIndex(g => 
          g.studentId === gradeData.studentId && g.assignmentId === gradeData.assignmentId
        );
        
        if (existingIndex >= 0) {
          const updatedGrades = [...prevGrades];
          updatedGrades[existingIndex] = { ...updatedGrades[existingIndex], ...gradeData };
          return updatedGrades;
        } else {
          return [...prevGrades, { ...gradeData, Id: Date.now() }];
        }
      });
      
    } catch (err) {
      toast.error(err.message || "Failed to update grade");
    }
  };

const handleAddAssignment = async () => {
    try {
      // Simple prompt-based assignment creation
      const name = prompt("Enter assignment name:");
      if (!name || name.trim() === "") {
        toast.error("Assignment name is required");
        return;
      }

      const pointsInput = prompt("Enter points (e.g., 100):");
      const points = parseInt(pointsInput);
      if (!pointsInput || isNaN(points) || points <= 0) {
        toast.error("Please enter a valid points value");
        return;
      }

      const dueDateInput = prompt("Enter due date (YYYY-MM-DD) or leave empty for today:");
      let dueDate = new Date().toISOString().split('T')[0]; // Default to today
      if (dueDateInput && dueDateInput.trim() !== "") {
        // Basic date validation
        const inputDate = new Date(dueDateInput);
        if (isNaN(inputDate.getTime())) {
          toast.error("Please enter a valid date in YYYY-MM-DD format");
          return;
        }
        dueDate = dueDateInput;
      }

      // Create the assignment
      const newAssignment = await assignmentService.create({
        name: name.trim(),
        points: points,
        dueDate: dueDate,
        category: "Homework", // Default category
        classId: "class1", // Default class - could be enhanced with class selection
        description: ""
      });

      // Refresh assignments to show the new one immediately
      await loadGradesData();

    } catch (error) {
      console.error("Error creating assignment:", error);
      toast.error("Failed to create assignment. Please try again.");
    }
  };

  if (loading) return <Loading text="Loading grades..." />;
  if (error) return <Error message={error} onRetry={loadGradesData} />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-gray-900">Grades</h1>
          <p className="text-gray-600 mt-1">
            Manage assignments and track student performance
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button variant="secondary" icon="Download">
            Export Grades
          </Button>
          <Button icon="Plus" onClick={handleAddAssignment}>
            Add Assignment
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card variant="gradient" className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Total Assignments</p>
              <p className="text-3xl font-bold text-gray-900">{assignments.length}</p>
            </div>
            <div className="p-3 bg-primary/10 rounded-lg">
              <ApperIcon name="FileText" className="w-6 h-6 text-primary" />
            </div>
          </div>
        </Card>

        <Card variant="gradient" className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Graded</p>
              <p className="text-3xl font-bold text-gray-900">{stats.submittedGrades || 0}</p>
            </div>
            <div className="p-3 bg-success/10 rounded-lg">
              <ApperIcon name="CheckCircle" className="w-6 h-6 text-success" />
            </div>
          </div>
        </Card>

        <Card variant="gradient" className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Pending</p>
              <p className="text-3xl font-bold text-gray-900">{stats.pendingGrades || 0}</p>
            </div>
            <div className="p-3 bg-warning/10 rounded-lg">
              <ApperIcon name="Clock" className="w-6 h-6 text-warning" />
            </div>
          </div>
        </Card>

        <Card variant="gradient" className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Class Average</p>
              <p className="text-3xl font-bold text-gray-900">{stats.averageScore || 0}%</p>
            </div>
            <div className="p-3 bg-info/10 rounded-lg">
              <ApperIcon name="TrendingUp" className="w-6 h-6 text-info" />
            </div>
          </div>
        </Card>
      </div>

      {/* Grade Grid */}
      <Card variant="elevated" className="p-6">
        {assignments.length === 0 ? (
          <Empty
            title="No assignments found"
            description="Create your first assignment to start tracking student grades and performance."
            icon="BookOpen"
            actionLabel="Add Assignment"
            onAction={handleAddAssignment}
          />
        ) : (
          <GradeGrid
            students={students}
            assignments={assignments}
            grades={grades}
            onGradeChange={handleGradeChange}
            onAddAssignment={handleAddAssignment}
          />
        )}
      </Card>

      {/* Tips Card */}
      <Card variant="gradient" className="p-6">
        <div className="flex items-start">
          <ApperIcon name="Lightbulb" className="w-6 h-6 text-primary mt-1 mr-4 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Grading Tips</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
              <div>
                <p className="mb-2">• Click on any grade cell to edit scores quickly</p>
                <p className="mb-2">• Press Enter to save, Escape to cancel</p>
              </div>
              <div>
                <p className="mb-2">• Grades are automatically saved when entered</p>
                <p className="mb-2">• Use the class filter to focus on specific periods</p>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Grades;