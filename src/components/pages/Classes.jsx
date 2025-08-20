import React, { useState, useEffect } from "react";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { classService } from "@/services/api/classService";
import { studentService } from "@/services/api/studentService";
import { toast } from "react-toastify";

const Classes = () => {
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [stats, setStats] = useState({});

  const loadClassesData = async () => {
    try {
      setError("");
      setLoading(true);
      
      const [classesData, studentsData, classStats] = await Promise.all([
        classService.getAll(),
        studentService.getAll(),
        classService.getClassStats()
      ]);
      
      setClasses(classesData);
      setStudents(studentsData);
      setStats(classStats);
      
    } catch (err) {
      setError(err.message || "Failed to load classes data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadClassesData();
  }, []);

  const getStudentsInClass = (classId) => {
    const classData = classes.find(c => c.id === classId);
    if (!classData) return [];
    
    return students.filter(s => s.classIds.includes(classId));
  };

  const getSubjectColor = (subject) => {
    const colors = {
      Mathematics: "bg-blue-100 text-blue-800",
      English: "bg-green-100 text-green-800",
      Science: "bg-purple-100 text-purple-800",
      History: "bg-yellow-100 text-yellow-800",
      Art: "bg-pink-100 text-pink-800",
      default: "bg-gray-100 text-gray-800"
    };
    return colors[subject] || colors.default;
  };

  const handleViewClass = (classData) => {
    toast.info(`Viewing ${classData.name} class details`);
  };

  const handleEditClass = (classData) => {
    toast.info(`Editing ${classData.name} class`);
  };

  const handleDeleteClass = async (classId) => {
    if (!confirm("Are you sure you want to delete this class? This action cannot be undone.")) {
      return;
    }
    
    try {
      await classService.delete(classId);
      await loadClassesData();
    } catch (err) {
      toast.error(err.message || "Failed to delete class");
    }
  };

  const handleAddClass = () => {
    toast.info("Class creation feature coming soon!");
  };

  if (loading) return <Loading text="Loading classes..." />;
  if (error) return <Error message={error} onRetry={loadClassesData} />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-gray-900">Classes</h1>
          <p className="text-gray-600 mt-1">
            Manage your class sections and student enrollments
          </p>
        </div>
        
        <Button icon="Plus" onClick={handleAddClass}>
          Add Class
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card variant="gradient" className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Total Classes</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalClasses || 0}</p>
            </div>
            <div className="p-3 bg-primary/10 rounded-lg">
              <ApperIcon name="School" className="w-6 h-6 text-primary" />
            </div>
          </div>
        </Card>

        <Card variant="gradient" className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Total Enrollments</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalEnrollments || 0}</p>
            </div>
            <div className="p-3 bg-success/10 rounded-lg">
              <ApperIcon name="Users" className="w-6 h-6 text-success" />
            </div>
          </div>
        </Card>

        <Card variant="gradient" className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Avg Class Size</p>
              <p className="text-3xl font-bold text-gray-900">{stats.averageClassSize || 0}</p>
            </div>
            <div className="p-3 bg-info/10 rounded-lg">
              <ApperIcon name="BarChart" className="w-6 h-6 text-info" />
            </div>
          </div>
        </Card>

        <Card variant="gradient" className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Subjects</p>
              <p className="text-3xl font-bold text-gray-900">
                {Object.keys(stats.subjectDistribution || {}).length}
              </p>
            </div>
            <div className="p-3 bg-warning/10 rounded-lg">
              <ApperIcon name="BookOpen" className="w-6 h-6 text-warning" />
            </div>
          </div>
        </Card>
      </div>

      {/* Classes Grid */}
      <Card variant="elevated" className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Your Classes</h3>
          <div className="flex items-center space-x-3">
            <Button variant="secondary" size="sm" icon="Download">
              Export List
            </Button>
            <Button variant="secondary" size="sm" icon="Filter">
              Filter
            </Button>
          </div>
        </div>

        {classes.length === 0 ? (
          <Empty
            title="No classes found"
            description="Create your first class to start organizing your students and curriculum."
            icon="School"
            actionLabel="Add Class"
            onAction={handleAddClass}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {classes.map((classData) => {
              const studentsInClass = getStudentsInClass(classData.id);
              
              return (
                <Card 
                  key={classData.Id} 
                  variant="gradient" 
                  hover 
                  className="p-6 cursor-pointer transition-all duration-200"
                  onClick={() => handleViewClass(classData)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-2">
                        {classData.name}
                      </h4>
                      <Badge className={getSubjectColor(classData.subject)}>
                        {classData.subject}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        icon="Edit"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditClass(classData);
                        }}
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        icon="Trash2"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteClass(classData.Id);
                        }}
                        className="text-error hover:text-error hover:bg-error/10"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center text-sm text-gray-600">
                      <ApperIcon name="Clock" className="w-4 h-4 mr-2" />
                      {classData.period}
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-600">
                      <ApperIcon name="Users" className="w-4 h-4 mr-2" />
                      {studentsInClass.length} student{studentsInClass.length !== 1 ? 's' : ''}
                    </div>

                    {studentsInClass.length > 0 && (
                      <div className="pt-3 border-t border-gray-200">
                        <div className="flex -space-x-2">
                          {studentsInClass.slice(0, 4).map((student) => (
                            <div
                              key={student.Id}
                              className="w-8 h-8 bg-gradient-to-r from-primary to-primary-dark rounded-full flex items-center justify-center border-2 border-white text-xs text-white font-medium"
                              title={`${student.firstName} ${student.lastName}`}
                            >
                              {student.firstName.charAt(0)}{student.lastName.charAt(0)}
                            </div>
                          ))}
                          {studentsInClass.length > 4 && (
                            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center border-2 border-white text-xs text-gray-600 font-medium">
                              +{studentsInClass.length - 4}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Quick Actions</span>
                      <div className="flex items-center space-x-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-xs"
                          onClick={(e) => {
                            e.stopPropagation();
                            toast.info("Taking attendance...");
                          }}
                        >
                          Attendance
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-xs"
                          onClick={(e) => {
                            e.stopPropagation();
                            toast.info("Opening gradebook...");
                          }}
                        >
                          Grades
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </Card>

      {/* Subject Distribution */}
      {stats.subjectDistribution && Object.keys(stats.subjectDistribution).length > 0 && (
        <Card variant="gradient" className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Subject Distribution</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(stats.subjectDistribution).map(([subject, count]) => (
              <div key={subject} className="text-center p-4 bg-white/50 rounded-lg">
                <div className="text-2xl font-bold text-gray-900">{count}</div>
                <div className="text-sm text-gray-600">{subject}</div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Class Management Tips */}
      <Card variant="gradient" className="p-6">
        <div className="flex items-start">
          <ApperIcon name="Lightbulb" className="w-6 h-6 text-primary mt-1 mr-4 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Class Management Tips</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
              <div>
                <p className="mb-2">• Click on class cards to view detailed information and student rosters</p>
                <p className="mb-2">• Use quick actions to jump directly to attendance or gradebook</p>
              </div>
              <div>
                <p className="mb-2">• Monitor class sizes to ensure balanced learning environments</p>
                <p className="mb-2">• Export class lists for administrative reporting and planning</p>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Classes;