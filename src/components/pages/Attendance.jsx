import React, { useState, useEffect } from "react";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import AttendanceGrid from "@/components/organisms/AttendanceGrid";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { studentService } from "@/services/api/studentService";
import { attendanceService } from "@/services/api/attendanceService";
import { classService } from "@/services/api/classService";
import { formatDate } from "@/utils/dateUtils";
import { toast } from "react-toastify";

const Attendance = () => {
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [stats, setStats] = useState({});

  const loadAttendanceData = async () => {
    try {
      setError("");
      setLoading(true);
      
      const [
        studentsData,
        attendanceData,
        classesData,
        attendanceStats
      ] = await Promise.all([
        studentService.getAll(),
        attendanceService.getAll(),
        classService.getAll(),
        attendanceService.getAttendanceStats()
      ]);
      
      setStudents(studentsData);
      setAttendance(attendanceData);
      setClasses(classesData);
      setStats(attendanceStats);
      
    } catch (err) {
      setError(err.message || "Failed to load attendance data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAttendanceData();
  }, []);

  const handleAttendanceChange = async (attendanceData) => {
    try {
      await attendanceService.create(attendanceData);
      
      // Update local state
      setAttendance(prevAttendance => {
        const existingIndex = prevAttendance.findIndex(a => 
          a.studentId === attendanceData.studentId && 
          a.classId === attendanceData.classId && 
          a.date === attendanceData.date
        );
        
        if (existingIndex >= 0) {
          const updatedAttendance = [...prevAttendance];
          updatedAttendance[existingIndex] = { ...updatedAttendance[existingIndex], ...attendanceData };
          return updatedAttendance;
        } else {
          return [...prevAttendance, { ...attendanceData, Id: Date.now() }];
        }
      });
      
    } catch (err) {
      console.error("Failed to update attendance:", err);
    }
  };

  const handleMarkAllPresent = async () => {
    const today = new Date().toISOString().split('T')[0];
    const studentIds = students.map(s => s.Id.toString());
    
    try {
      await attendanceService.markAllPresent(studentIds, 'default', today);
      await loadAttendanceData();
    } catch (err) {
      toast.error(err.message || "Failed to mark all present");
    }
  };

  if (loading) return <Loading text="Loading attendance..." />;
  if (error) return <Error message={error} onRetry={loadAttendanceData} />;

  const todayAttendance = attendance.filter(a => a.date === new Date().toISOString().split('T')[0]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-gray-900">Attendance</h1>
          <p className="text-gray-600 mt-1">
            Track daily attendance and monitor student participation
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button variant="secondary" icon="Download">
            Export Report
          </Button>
          <Button icon="Users" onClick={handleMarkAllPresent}>
            Mark All Present
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card variant="gradient" className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Overall Rate</p>
              <p className="text-3xl font-bold text-gray-900">{stats.attendanceRate || 0}%</p>
            </div>
            <div className="p-3 bg-primary/10 rounded-lg">
              <ApperIcon name="Calendar" className="w-6 h-6 text-primary" />
            </div>
          </div>
        </Card>

        <Card variant="gradient" className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Present Today</p>
              <p className="text-3xl font-bold text-success">
                {todayAttendance.filter(a => a.status === 'present').length}
              </p>
            </div>
            <div className="p-3 bg-success/10 rounded-lg">
              <ApperIcon name="Check" className="w-6 h-6 text-success" />
            </div>
          </div>
        </Card>

        <Card variant="gradient" className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Absent Today</p>
              <p className="text-3xl font-bold text-error">
                {todayAttendance.filter(a => a.status === 'absent').length}
              </p>
            </div>
            <div className="p-3 bg-error/10 rounded-lg">
              <ApperIcon name="X" className="w-6 h-6 text-error" />
            </div>
          </div>
        </Card>

        <Card variant="gradient" className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Tardy Today</p>
              <p className="text-3xl font-bold text-warning">
                {todayAttendance.filter(a => a.status === 'tardy').length}
              </p>
            </div>
            <div className="p-3 bg-warning/10 rounded-lg">
              <ApperIcon name="Clock" className="w-6 h-6 text-warning" />
            </div>
          </div>
        </Card>
      </div>

      {/* Today's Summary */}
      <Card variant="elevated" className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Today's Summary - {formatDate(new Date(), 'EEEE, MMMM d, yyyy')}
          </h3>
          <div className="text-sm text-gray-500">
            {todayAttendance.length} of {students.length} students marked
          </div>
        </div>
        
        {todayAttendance.length === 0 ? (
          <div className="text-center py-8">
            <ApperIcon name="Calendar" className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">No attendance taken today</p>
            <Button onClick={handleMarkAllPresent} icon="Users">
              Mark All Present
            </Button>
          </div>
        ) : (
          <div className="flex justify-center">
            <div className="w-full max-w-md">
              <div className="flex-1 bg-gray-200 rounded-full h-4 mb-2">
                <div 
                  className="bg-gradient-to-r from-success to-primary h-4 rounded-full transition-all duration-300"
                  style={{ width: `${Math.round((todayAttendance.length / students.length) * 100)}%` }}
                ></div>
              </div>
              <div className="text-center text-sm text-gray-600">
                {Math.round((todayAttendance.length / students.length) * 100)}% attendance recorded
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* Attendance Grid */}
      <Card variant="elevated" className="p-6">
        {students.length === 0 ? (
          <Empty
            title="No students found"
            description="Add students to your roster to start tracking attendance."
            icon="Users"
            actionLabel="Add Students"
          />
        ) : (
          <AttendanceGrid
            students={students}
            attendance={attendance}
            onAttendanceChange={handleAttendanceChange}
          />
        )}
      </Card>

      {/* Attendance Tips */}
      <Card variant="gradient" className="p-6">
        <div className="flex items-start">
          <ApperIcon name="Info" className="w-6 h-6 text-primary mt-1 mr-4 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Attendance Tracking</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
              <div>
                <p className="mb-2">• Click attendance markers to cycle between Present, Absent, and Tardy</p>
                <p className="mb-2">• Use "Mark All" buttons to quickly set attendance for entire columns</p>
              </div>
              <div>
                <p className="mb-2">• Switch between Week and Month views to see different time ranges</p>
                <p className="mb-2">• Export reports to analyze attendance patterns over time</p>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Attendance;