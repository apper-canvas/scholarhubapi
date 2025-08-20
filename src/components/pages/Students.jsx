import React, { useState, useEffect } from "react";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import SearchBar from "@/components/molecules/SearchBar";
import StudentTable from "@/components/organisms/StudentTable";
import StudentForm from "@/components/organisms/StudentForm";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { studentService } from "@/services/api/studentService";
import { toast } from "react-toastify";

const Students = () => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  const loadStudents = async () => {
    try {
      setError("");
      setLoading(true);
      const data = await studentService.getAll();
      setStudents(data);
      setFilteredStudents(data);
    } catch (err) {
      setError(err.message || "Failed to load students");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStudents();
  }, []);

  const handleSearch = (query) => {
    if (!query.trim()) {
      setFilteredStudents(students);
      return;
    }
    
    const filtered = students.filter(student =>
      student.firstName.toLowerCase().includes(query.toLowerCase()) ||
      student.lastName.toLowerCase().includes(query.toLowerCase()) ||
      student.email.toLowerCase().includes(query.toLowerCase()) ||
      student.id.toLowerCase().includes(query.toLowerCase())
    );
    
    setFilteredStudents(filtered);
  };

  const handleFilterChange = (filters) => {
    let filtered = [...students];
    
    if (filters.gradeLevel) {
      filtered = filtered.filter(s => s.gradeLevel.toString() === filters.gradeLevel);
    }
    
    if (filters.gradeRange) {
      const [min, max] = filters.gradeRange.split('-').map(Number);
      filtered = filtered.filter(s => s.currentGrade >= min && s.currentGrade <= max);
    }
    
    setFilteredStudents(filtered);
  };

  const handleAddStudent = () => {
    setEditingStudent(null);
    setShowForm(true);
  };

  const handleEditStudent = (student) => {
    setEditingStudent(student);
    setShowForm(true);
  };

  const handleDeleteStudent = async (studentId) => {
    if (!confirm("Are you sure you want to delete this student? This action cannot be undone.")) {
      return;
    }
    
    try {
      await studentService.delete(studentId);
      await loadStudents();
    } catch (err) {
      toast.error(err.message || "Failed to delete student");
    }
  };

  const handleFormSubmit = async (studentData) => {
    try {
      setFormLoading(true);
      
      if (editingStudent) {
        await studentService.update(editingStudent.Id, studentData);
      } else {
        await studentService.create(studentData);
      }
      
      setShowForm(false);
      setEditingStudent(null);
      await loadStudents();
    } catch (err) {
      toast.error(err.message || "Failed to save student");
    } finally {
      setFormLoading(false);
    }
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingStudent(null);
  };

  const handleViewDetails = (student) => {
    toast.info(`Viewing details for ${student.firstName} ${student.lastName}`);
  };

  const searchFilters = [
    {
      key: "gradeLevel",
      placeholder: "Grade Level",
      options: [
        { value: "9", label: "9th Grade" },
        { value: "10", label: "10th Grade" },
        { value: "11", label: "11th Grade" },
        { value: "12", label: "12th Grade" }
      ]
    },
    {
      key: "gradeRange",
      placeholder: "Grade Range",
      options: [
        { value: "90-100", label: "A (90-100)" },
        { value: "80-89", label: "B (80-89)" },
        { value: "70-79", label: "C (70-79)" },
        { value: "60-69", label: "D (60-69)" },
        { value: "0-59", label: "F (0-59)" }
      ]
    }
  ];

  if (loading) return <Loading text="Loading students..." />;
  if (error) return <Error message={error} onRetry={loadStudents} />;

  if (showForm) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-6">
          <Button
            variant="ghost"
            size="sm"
            icon="ArrowLeft"
            onClick={handleFormCancel}
            className="mr-4"
          >
            Back to Students
          </Button>
          <h1 className="text-2xl font-display font-bold text-gray-900">
            {editingStudent ? "Edit Student" : "Add New Student"}
          </h1>
        </div>
        
        <StudentForm
          student={editingStudent}
          onSubmit={handleFormSubmit}
          onCancel={handleFormCancel}
          isLoading={formLoading}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-gray-900">Students</h1>
          <p className="text-gray-600 mt-1">
            Manage your student roster and track their progress
          </p>
        </div>
        
        <Button icon="UserPlus" onClick={handleAddStudent}>
          Add Student
        </Button>
      </div>

      <Card variant="elevated" className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <ApperIcon name="Users" className="w-6 h-6 text-primary" />
            <div>
              <h3 className="font-semibold text-gray-900">
                {filteredStudents.length} Student{filteredStudents.length !== 1 ? 's' : ''}
              </h3>
              <p className="text-sm text-gray-500">
                {students.length > filteredStudents.length 
                  ? `Filtered from ${students.length} total students`
                  : "All students shown"
                }
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button variant="secondary" size="sm" icon="Download">
              Export
            </Button>
            <Button variant="secondary" size="sm" icon="Upload">
              Import
            </Button>
          </div>
        </div>

        <div className="mb-6">
          <SearchBar
            onSearch={handleSearch}
            onFilterChange={handleFilterChange}
            filters={searchFilters}
            placeholder="Search students by name, email, or ID..."
          />
        </div>

        {filteredStudents.length === 0 ? (
          <Empty
            title="No students found"
            description={students.length === 0 
              ? "Get started by adding your first student to the system."
              : "No students match your current search criteria."
            }
            icon="Users"
            actionLabel="Add Student"
            onAction={students.length === 0 ? handleAddStudent : undefined}
          />
        ) : (
          <StudentTable
            students={filteredStudents}
            onEdit={handleEditStudent}
            onDelete={handleDeleteStudent}
            onViewDetails={handleViewDetails}
          />
        )}
      </Card>
    </div>
  );
};

export default Students;