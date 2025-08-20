import classesData from "@/services/mockData/classes.json";
import { toast } from "react-toastify";

let classes = [...classesData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const classService = {
  async getAll() {
    await delay(250);
    return [...classes];
  },

  async getById(id) {
    await delay(200);
    const classItem = classes.find(c => c.Id === parseInt(id));
    if (!classItem) {
      throw new Error("Class not found");
    }
    return { ...classItem };
  },

  async create(classData) {
    await delay(400);
    
    const newClass = {
      ...classData,
      Id: Math.max(...classes.map(c => c.Id)) + 1,
      id: `class${Math.max(...classes.map(c => c.Id)) + 1}`,
      studentIds: classData.studentIds || []
    };
    
    classes.push(newClass);
    toast.success(`${newClass.name} class has been created successfully!`);
    return { ...newClass };
  },

  async update(id, classData) {
    await delay(400);
    const index = classes.findIndex(c => c.Id === parseInt(id));
    
    if (index === -1) {
      throw new Error("Class not found");
    }
    
    const updatedClass = {
      ...classes[index],
      ...classData,
      Id: parseInt(id)
    };
    
    classes[index] = updatedClass;
    toast.success(`${updatedClass.name} has been updated successfully!`);
    return { ...updatedClass };
  },

  async delete(id) {
    await delay(300);
    const index = classes.findIndex(c => c.Id === parseInt(id));
    
    if (index === -1) {
      throw new Error("Class not found");
    }
    
    const deletedClass = classes[index];
    classes.splice(index, 1);
    toast.success(`${deletedClass.name} class has been deleted.`);
    return deletedClass;
  },

  async getClassStats() {
    await delay(200);
    return {
      totalClasses: classes.length,
      totalEnrollments: classes.reduce((sum, c) => sum + c.studentIds.length, 0),
      averageClassSize: classes.length > 0 
        ? Math.round(classes.reduce((sum, c) => sum + c.studentIds.length, 0) / classes.length)
        : 0,
      subjectDistribution: classes.reduce((acc, c) => {
        acc[c.subject] = (acc[c.subject] || 0) + 1;
        return acc;
      }, {})
    };
  }
};