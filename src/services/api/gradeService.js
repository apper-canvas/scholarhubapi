import gradesData from "@/services/mockData/grades.json";
import { toast } from "react-toastify";

let grades = [...gradesData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const gradeService = {
  async getAll() {
    await delay(250);
    return [...grades];
  },

  async getById(id) {
    await delay(200);
    const grade = grades.find(g => g.Id === parseInt(id));
    if (!grade) {
      throw new Error("Grade not found");
    }
    return { ...grade };
  },

  async getByStudentId(studentId) {
    await delay(200);
    return grades.filter(g => g.studentId === studentId);
  },

  async getByAssignmentId(assignmentId) {
    await delay(200);
    return grades.filter(g => g.assignmentId === assignmentId);
  },

  async create(gradeData) {
    await delay(400);
    
    // Check if grade already exists for this student-assignment combination
    const existingGrade = grades.find(g => 
      g.studentId === gradeData.studentId && g.assignmentId === gradeData.assignmentId
    );
    
    if (existingGrade) {
      return this.update(existingGrade.Id, gradeData);
    }
    
    const newGrade = {
      ...gradeData,
      Id: Math.max(...grades.map(g => g.Id)) + 1,
      submitted: true
    };
    
    grades.push(newGrade);
    toast.success("Grade has been recorded successfully!");
    return { ...newGrade };
  },

  async update(id, gradeData) {
    await delay(400);
    let index;
    
    if (typeof id === 'object' && id.studentId && id.assignmentId) {
      // Update by student-assignment combination
      index = grades.findIndex(g => 
        g.studentId === id.studentId && g.assignmentId === id.assignmentId
      );
    } else {
      // Update by ID
      index = grades.findIndex(g => g.Id === parseInt(id));
    }
    
    if (index === -1) {
      // Create new grade if not found
      return this.create(gradeData);
    }
    
    const updatedGrade = {
      ...grades[index],
      ...gradeData,
      submitted: true
    };
    
    grades[index] = updatedGrade;
    toast.success("Grade has been updated successfully!");
    return { ...updatedGrade };
  },

  async delete(id) {
    await delay(300);
    const index = grades.findIndex(g => g.Id === parseInt(id));
    
    if (index === -1) {
      throw new Error("Grade not found");
    }
    
    const deletedGrade = grades[index];
    grades.splice(index, 1);
    toast.success("Grade has been deleted.");
    return deletedGrade;
  },

  async getGradeStats() {
    await delay(200);
    const submittedGrades = grades.filter(g => g.submitted);
    
    return {
      totalGrades: grades.length,
      submittedGrades: submittedGrades.length,
      pendingGrades: grades.length - submittedGrades.length,
      averageScore: submittedGrades.length > 0
        ? Math.round(submittedGrades.reduce((sum, g) => sum + g.score, 0) / submittedGrades.length)
        : 0
    };
  }
};