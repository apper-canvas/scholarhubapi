import React, { useState, useEffect } from "react";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import Card from "@/components/atoms/Card";

const StudentForm = ({ 
  student, 
  onSubmit, 
  onCancel, 
  isLoading = false 
}) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    id: "",
    gradeLevel: "",
    classIds: []
  });
  
  const [errors, setErrors] = useState({});
  
  useEffect(() => {
    if (student) {
      setFormData({
        firstName: student.firstName || "",
        lastName: student.lastName || "",
        email: student.email || "",
        id: student.id || "",
        gradeLevel: student.gradeLevel || "",
        classIds: student.classIds || []
      });
    }
  }, [student]);
  
  const gradeLevelOptions = [
    { value: "9", label: "9th Grade" },
    { value: "10", label: "10th Grade" },
    { value: "11", label: "11th Grade" },
    { value: "12", label: "12th Grade" }
  ];
  
  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ""
      }));
    }
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }
    
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }
    
    if (!formData.id.trim()) {
      newErrors.id = "Student ID is required";
    }
    
    if (!formData.gradeLevel) {
      newErrors.gradeLevel = "Grade level is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit({
        ...formData,
        gradeLevel: parseInt(formData.gradeLevel),
        currentGrade: student?.currentGrade || 0,
        attendanceRate: student?.attendanceRate || 100
      });
    }
  };
  
  return (
    <Card className="p-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-6">
        {student ? "Edit Student" : "Add New Student"}
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="First Name"
            value={formData.firstName}
            onChange={(e) => handleChange("firstName", e.target.value)}
            error={errors.firstName}
            required
            placeholder="Enter first name"
          />
          
          <Input
            label="Last Name"
            value={formData.lastName}
            onChange={(e) => handleChange("lastName", e.target.value)}
            error={errors.lastName}
            required
            placeholder="Enter last name"
          />
        </div>
        
        <Input
          label="Email"
          type="email"
          value={formData.email}
          onChange={(e) => handleChange("email", e.target.value)}
          error={errors.email}
          required
          placeholder="Enter email address"
          icon="Mail"
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Student ID"
            value={formData.id}
            onChange={(e) => handleChange("id", e.target.value)}
            error={errors.id}
            required
            placeholder="Enter student ID"
            icon="Hash"
          />
          
          <Select
            label="Grade Level"
            value={formData.gradeLevel}
            onChange={(e) => handleChange("gradeLevel", e.target.value)}
            options={gradeLevelOptions}
            error={errors.gradeLevel}
            required
            placeholder="Select grade level"
          />
        </div>
        
        <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancel
          </Button>
          
          <Button
            type="submit"
            loading={isLoading}
            disabled={isLoading}
          >
            {student ? "Update Student" : "Add Student"}
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default StudentForm;