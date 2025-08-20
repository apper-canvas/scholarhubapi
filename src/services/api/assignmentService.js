import assignmentsData from "@/services/mockData/assignments.json";
import { toast } from "react-toastify";

let assignments = [...assignmentsData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const assignmentService = {
  async getAll() {
    await delay(250);
    return [...assignments];
  },

  async getById(id) {
    await delay(200);
    const assignment = assignments.find(a => a.Id === parseInt(id));
    if (!assignment) {
      throw new Error("Assignment not found");
    }
    return { ...assignment };
  },

  async getByClassId(classId) {
    await delay(200);
    return assignments.filter(a => a.classId === classId);
  },

  async create(assignmentData) {
    await delay(400);
    
    const newAssignment = {
      ...assignmentData,
      Id: Math.max(...assignments.map(a => a.Id)) + 1,
      dueDate: assignmentData.dueDate || new Date().toISOString().split('T')[0],
      weight: assignmentData.weight || 0.2
    };
    
    assignments.push(newAssignment);
    toast.success(`${newAssignment.name} assignment has been created successfully!`);
    return { ...newAssignment };
  },

  async update(id, assignmentData) {
    await delay(400);
    const index = assignments.findIndex(a => a.Id === parseInt(id));
    
    if (index === -1) {
      throw new Error("Assignment not found");
    }
    
    const updatedAssignment = {
      ...assignments[index],
      ...assignmentData,
      Id: parseInt(id)
    };
    
    assignments[index] = updatedAssignment;
    toast.success(`${updatedAssignment.name} has been updated successfully!`);
    return { ...updatedAssignment };
  },

  async delete(id) {
    await delay(300);
    const index = assignments.findIndex(a => a.Id === parseInt(id));
    
    if (index === -1) {
      throw new Error("Assignment not found");
    }
    
    const deletedAssignment = assignments[index];
    assignments.splice(index, 1);
    toast.success(`${deletedAssignment.name} assignment has been deleted.`);
    return deletedAssignment;
  },

  async getAssignmentStats() {
    await delay(200);
    const categoryStats = assignments.reduce((acc, a) => {
      acc[a.category] = (acc[a.category] || 0) + 1;
      return acc;
    }, {});
    
    return {
      totalAssignments: assignments.length,
      categoryDistribution: categoryStats,
      averagePoints: assignments.length > 0
        ? Math.round(assignments.reduce((sum, a) => sum + a.points, 0) / assignments.length)
        : 0,
      upcomingAssignments: assignments.filter(a => new Date(a.dueDate) > new Date()).length
    };
  }
};