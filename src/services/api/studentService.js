import studentsData from "@/services/mockData/students.json";
import { toast } from "react-toastify";

let students = [...studentsData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const studentService = {
  async getAll() {
    await delay(300);
    return [...students];
  },

  async getById(id) {
    await delay(200);
    const student = students.find(s => s.Id === parseInt(id));
    if (!student) {
      throw new Error("Student not found");
    }
    return { ...student };
  },

  async create(studentData) {
    await delay(400);
    
    // Check for duplicate student ID
    if (students.some(s => s.id === studentData.id)) {
      throw new Error("Student ID already exists");
    }
    
    const newStudent = {
      ...studentData,
      Id: Math.max(...students.map(s => s.Id)) + 1,
      currentGrade: 0,
      attendanceRate: 100
    };
    
    students.push(newStudent);
    toast.success(`${newStudent.firstName} ${newStudent.lastName} has been added successfully!`);
    return { ...newStudent };
  },

  async update(id, studentData) {
    await delay(400);
    const index = students.findIndex(s => s.Id === parseInt(id));
    
    if (index === -1) {
      throw new Error("Student not found");
    }
    
    // Check for duplicate student ID (excluding current student)
    if (students.some(s => s.Id !== parseInt(id) && s.id === studentData.id)) {
      throw new Error("Student ID already exists");
    }
    
    const updatedStudent = {
      ...students[index],
      ...studentData,
      Id: parseInt(id)
    };
    
    students[index] = updatedStudent;
    toast.success(`${updatedStudent.firstName} ${updatedStudent.lastName} has been updated successfully!`);
    return { ...updatedStudent };
  },

  async delete(id) {
    await delay(300);
    const index = students.findIndex(s => s.Id === parseInt(id));
    
    if (index === -1) {
      throw new Error("Student not found");
    }
    
    const deletedStudent = students[index];
    students.splice(index, 1);
    toast.success(`${deletedStudent.firstName} ${deletedStudent.lastName} has been removed from the system.`);
    return deletedStudent;
  },

  async getByClassId(classId) {
    await delay(250);
    return students.filter(s => s.classIds.includes(classId));
  },

  async searchStudents(query) {
    await delay(200);
    const lowercaseQuery = query.toLowerCase();
    return students.filter(student => 
      student.firstName.toLowerCase().includes(lowercaseQuery) ||
      student.lastName.toLowerCase().includes(lowercaseQuery) ||
      student.email.toLowerCase().includes(lowercaseQuery) ||
      student.id.toLowerCase().includes(lowercaseQuery)
    );
  },

  async getStudentStats() {
    await delay(200);
    const totalStudents = students.length;
    const averageGrade = students.length > 0 
      ? Math.round(students.reduce((sum, s) => sum + s.currentGrade, 0) / students.length)
      : 0;
    const averageAttendance = students.length > 0
      ? Math.round(students.reduce((sum, s) => sum + s.attendanceRate, 0) / students.length)
      : 0;
    
    return {
      totalStudents,
      averageGrade,
      averageAttendance,
      gradeDistribution: {
        A: students.filter(s => s.currentGrade >= 90).length,
        B: students.filter(s => s.currentGrade >= 80 && s.currentGrade < 90).length,
        C: students.filter(s => s.currentGrade >= 70 && s.currentGrade < 80).length,
        D: students.filter(s => s.currentGrade >= 60 && s.currentGrade < 70).length,
        F: students.filter(s => s.currentGrade < 60).length
      }
    };
  }
};