import React, { useState, useEffect } from "react";
import StatCard from "@/components/molecules/StatCard";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import ApperIcon from "@/components/ApperIcon";
import { studentService } from "@/services/api/studentService";
import { classService } from "@/services/api/classService";
import { gradeService } from "@/services/api/gradeService";
import { attendanceService } from "@/services/api/attendanceService";
import { formatDate } from "@/utils/dateUtils";
import { getLetterGrade, getGradeColor } from "@/utils/gradeUtils";

const Dashboard = () => {
  const [stats, setStats] = useState({});
  const [recentStudents, setRecentStudents] = useState([]);
  const [todayAttendance, setTodayAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboardData = async () => {
    try {
      setError("");
      setLoading(true);
      
      const [
        studentStats,
        classStats,
        gradeStats,
        attendanceStats,
        students,
        attendance
      ] = await Promise.all([
        studentService.getStudentStats(),
        classService.getClassStats(),
        gradeService.getGradeStats(),
        attendanceService.getAttendanceStats(),
        studentService.getAll(),
        attendanceService.getByDate(new Date())
      ]);
      
      setStats({
        ...studentStats,
        ...classStats,
        ...gradeStats,
        ...attendanceStats
      });
      
      setRecentStudents(students.slice(0, 5));
      setTodayAttendance(attendance);
      
    } catch (err) {
      setError(err.message || "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  if (loading) return <Loading text="Loading dashboard..." />;
  if (error) return <Error message={error} onRetry={loadDashboardData} />;

  const todayStats = {
    present: todayAttendance.filter(a => a.status === 'present').length,
    absent: todayAttendance.filter(a => a.status === 'absent').length,
    tardy: todayAttendance.filter(a => a.status === 'tardy').length
  };

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary to-primary-dark rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-display font-bold mb-2">
              Welcome back, Teacher! 👋
            </h1>
            <p className="text-primary-light text-lg">
              {formatDate(new Date(), 'EEEE, MMMM d, yyyy')}
            </p>
            <p className="text-white/90 mt-2">
              You have {stats.totalStudents || 0} students across {stats.totalClasses || 0} classes
            </p>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
              <ApperIcon name="GraduationCap" className="w-8 h-8" />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Students"
          value={stats.totalStudents || 0}
          icon="Users"
          gradient
        />
        <StatCard
          title="Classes"
          value={stats.totalClasses || 0}
          icon="School"
          gradient
        />
        <StatCard
          title="Average Grade"
          value={`${stats.averageGrade || 0}%`}
          change={`${getLetterGrade(stats.averageGrade || 0)} Average`}
          changeType="neutral"
          icon="BookOpen"
          gradient
        />
        <StatCard
          title="Attendance Rate"
          value={`${stats.averageAttendance || 0}%`}
          change={stats.averageAttendance >= 90 ? "Excellent" : "Needs Improvement"}
          changeType={stats.averageAttendance >= 90 ? "positive" : "negative"}
          icon="Calendar"
          gradient
        />
      </div>

      {/* Today's Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Today's Attendance */}
        <Card variant="elevated" className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900">Today's Attendance</h3>
            <Button variant="ghost" size="sm" icon="Calendar">
              View All
            </Button>
          </div>
          
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-success/10 rounded-lg">
                <div className="text-2xl font-bold text-success">{todayStats.present}</div>
                <div className="text-sm text-gray-600">Present</div>
              </div>
              <div className="text-center p-4 bg-error/10 rounded-lg">
                <div className="text-2xl font-bold text-error">{todayStats.absent}</div>
                <div className="text-sm text-gray-600">Absent</div>
              </div>
              <div className="text-center p-4 bg-warning/10 rounded-lg">
                <div className="text-2xl font-bold text-warning">{todayStats.tardy}</div>
                <div className="text-sm text-gray-600">Tardy</div>
              </div>
            </div>
            
            {todayAttendance.length === 0 && (
              <div className="text-center py-8">
                <ApperIcon name="Calendar" className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No attendance records for today</p>
                <Button variant="secondary" size="sm" className="mt-3">
                  Take Attendance
                </Button>
              </div>
            )}
          </div>
        </Card>

        {/* Grade Distribution */}
        <Card variant="elevated" className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900">Grade Distribution</h3>
            <Button variant="ghost" size="sm" icon="BarChart3">
              View Details
            </Button>
          </div>
          
          <div className="space-y-3">
            {stats.gradeDistribution && Object.entries(stats.gradeDistribution).map(([grade, count]) => (
              <div key={grade} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-semibold mr-3 ${getGradeColor(grade === 'A' ? 95 : grade === 'B' ? 85 : grade === 'C' ? 75 : grade === 'D' ? 65 : 55)}`}>
                    {grade}
                  </div>
                  <span className="text-gray-700">Grade {grade}</span>
                </div>
                <span className="text-lg font-semibold text-gray-900">{count}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Recent Students & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Students */}
        <Card variant="elevated" className="p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900">Recent Students</h3>
            <Button variant="ghost" size="sm" icon="ArrowRight">
              View All
            </Button>
          </div>
          
          <div className="space-y-4">
            {recentStudents.map((student) => (
              <div key={student.Id} className="flex items-center justify-between p-4 bg-surface/30 rounded-lg hover:bg-surface/50 transition-colors">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-primary to-primary-dark rounded-full flex items-center justify-center mr-4">
                    <span className="text-white font-medium">
                      {student.firstName.charAt(0)}{student.lastName.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">
                      {student.firstName} {student.lastName}
                    </div>
                    <div className="text-sm text-gray-500">
                      Grade {student.gradeLevel} • {student.id}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getGradeColor(student.currentGrade)}`}>
                    {getLetterGrade(student.currentGrade)}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {student.attendanceRate}% attendance
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Quick Actions */}
        <Card variant="gradient" className="p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h3>
          
          <div className="space-y-4">
            <Button className="w-full justify-start" icon="UserPlus">
              Add New Student
            </Button>
            <Button className="w-full justify-start" variant="secondary" icon="Calendar">
              Take Attendance
            </Button>
            <Button className="w-full justify-start" variant="secondary" icon="BookOpen">
              Enter Grades
            </Button>
            <Button className="w-full justify-start" variant="secondary" icon="FileText">
              Generate Report
            </Button>
          </div>
          
          <div className="mt-8 p-4 bg-primary/5 rounded-lg border border-primary/10">
            <div className="flex items-start">
              <ApperIcon name="Lightbulb" className="w-5 h-5 text-primary mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-gray-900 text-sm">Pro Tip</h4>
                <p className="text-xs text-gray-600 mt-1">
                  Use the grade grid to quickly enter scores for multiple students at once.
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;