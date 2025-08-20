import React, { useState } from "react";
import { cn } from "@/utils/cn";
import { getLetterGrade, getGradeColor, calculateGradePercentage } from "@/utils/gradeUtils";
import ApperIcon from "@/components/ApperIcon";

const GradeCell = ({ 
  grade, 
  assignment, 
  onGradeChange, 
  editable = true 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempScore, setTempScore] = useState(grade?.score || "");
  
  const percentage = grade?.submitted 
    ? calculateGradePercentage(grade.score, assignment.points)
    : 0;
  
  const letterGrade = grade?.submitted ? getLetterGrade(percentage) : "-";
  const colorClass = grade?.submitted ? getGradeColor(percentage) : "";
  
  const handleEdit = () => {
    if (!editable) return;
    setIsEditing(true);
    setTempScore(grade?.score || "");
  };
  
  const handleSave = () => {
    const score = parseFloat(tempScore) || 0;
    if (score > assignment.points) {
      setTempScore(assignment.points);
      return;
    }
    
    onGradeChange?.({
      ...grade,
      score: score,
      submitted: true
    });
    setIsEditing(false);
  };
  
  const handleCancel = () => {
    setTempScore(grade?.score || "");
    setIsEditing(false);
  };
  
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSave();
    } else if (e.key === "Escape") {
      handleCancel();
    }
  };
  
  if (isEditing) {
    return (
      <div className="w-20 h-16 flex flex-col items-center justify-center border rounded-lg bg-white">
        <input
          type="number"
          value={tempScore}
          onChange={(e) => setTempScore(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleSave}
          className="w-12 text-center text-sm border-none outline-none"
          min="0"
          max={assignment.points}
          autoFocus
        />
        <span className="text-xs text-gray-500">/{assignment.points}</span>
      </div>
    );
  }
  
  return (
    <div
      onClick={handleEdit}
      className={cn(
        "w-20 h-16 flex flex-col items-center justify-center border rounded-lg transition-all duration-200",
        colorClass,
        editable && "cursor-pointer hover:shadow-sm hover:scale-105",
        !grade?.submitted && "bg-gray-50 hover:bg-gray-100"
      )}
    >
      <div className="text-lg font-bold">
        {grade?.submitted ? letterGrade : "-"}
      </div>
      <div className="text-xs opacity-75">
        {grade?.submitted ? `${grade.score}/${assignment.points}` : `0/${assignment.points}`}
      </div>
      {editable && (
        <ApperIcon 
          name="Edit3" 
          className="w-3 h-3 mt-1 opacity-50" 
        />
      )}
    </div>
  );
};

export default GradeCell;