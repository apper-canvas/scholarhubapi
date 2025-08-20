import attendanceData from "@/services/mockData/attendance.json";
import { toast } from "react-toastify";

let attendance = [...attendanceData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const attendanceService = {
  async getAll() {
    await delay(250);
    return [...attendance];
  },

  async getById(id) {
    await delay(200);
    const record = attendance.find(a => a.Id === parseInt(id));
    if (!record) {
      throw new Error("Attendance record not found");
    }
    return { ...record };
  },

  async getByStudentId(studentId) {
    await delay(200);
    return attendance.filter(a => a.studentId === studentId);
  },

  async getByDate(date) {
    await delay(200);
    const dateString = typeof date === 'string' ? date : date.toISOString().split('T')[0];
    return attendance.filter(a => a.date === dateString);
  },

  async getByClassId(classId) {
    await delay(200);
    return attendance.filter(a => a.classId === classId);
  },

  async create(attendanceData) {
    await delay(300);
    
    // Check if attendance already exists for this student-class-date combination
    const existingRecord = attendance.find(a => 
      a.studentId === attendanceData.studentId && 
      a.classId === attendanceData.classId && 
      a.date === attendanceData.date
    );
    
    if (existingRecord) {
      return this.update(existingRecord.Id, attendanceData);
    }
    
    const newRecord = {
      ...attendanceData,
      Id: Math.max(...attendance.map(a => a.Id)) + 1
    };
    
    attendance.push(newRecord);
    toast.success("Attendance has been recorded successfully!");
    return { ...newRecord };
  },

  async update(id, attendanceData) {
    await delay(300);
    let index;
    
    if (typeof id === 'object') {
      // Update by student-class-date combination
      index = attendance.findIndex(a => 
        a.studentId === id.studentId && 
        a.classId === id.classId && 
        a.date === id.date
      );
    } else {
      // Update by ID
      index = attendance.findIndex(a => a.Id === parseInt(id));
    }
    
    if (index === -1) {
      // Create new record if not found
      return this.create(attendanceData);
    }
    
    const updatedRecord = {
      ...attendance[index],
      ...attendanceData
    };
    
    attendance[index] = updatedRecord;
    return { ...updatedRecord };
  },

  async delete(id) {
    await delay(250);
    const index = attendance.findIndex(a => a.Id === parseInt(id));
    
    if (index === -1) {
      throw new Error("Attendance record not found");
    }
    
    const deletedRecord = attendance[index];
    attendance.splice(index, 1);
    toast.success("Attendance record has been deleted.");
    return deletedRecord;
  },

  async getAttendanceStats() {
    await delay(200);
    const totalRecords = attendance.length;
    const presentCount = attendance.filter(a => a.status === 'present').length;
    const absentCount = attendance.filter(a => a.status === 'absent').length;
    const tardyCount = attendance.filter(a => a.status === 'tardy').length;
    
    return {
      totalRecords,
      presentCount,
      absentCount,
      tardyCount,
      attendanceRate: totalRecords > 0 ? Math.round((presentCount / totalRecords) * 100) : 0,
      statusDistribution: {
        present: presentCount,
        absent: absentCount,
        tardy: tardyCount
      }
    };
  },

  async markAllPresent(studentIds, classId, date) {
    await delay(400);
    const dateString = typeof date === 'string' ? date : date.toISOString().split('T')[0];
    
    const promises = studentIds.map(studentId => 
      this.create({
        studentId,
        classId,
        date: dateString,
        status: 'present'
      })
    );
    
    const results = await Promise.all(promises);
    toast.success(`Attendance marked for ${studentIds.length} students.`);
    return results;
  }
};