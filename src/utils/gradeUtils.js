export const calculateGradePercentage = (score, totalPoints) => {
  if (!totalPoints || totalPoints === 0) return 0;
  return Math.round((score / totalPoints) * 100);
};

export const getLetterGrade = (percentage) => {
  if (percentage >= 90) return 'A';
  if (percentage >= 80) return 'B';
  if (percentage >= 70) return 'C';
  if (percentage >= 60) return 'D';
  return 'F';
};

export const getGradeColor = (percentage) => {
  if (percentage >= 90) return 'grade-a';
  if (percentage >= 80) return 'grade-b';
  if (percentage >= 70) return 'grade-c';
  if (percentage >= 60) return 'grade-d';
  return 'grade-f';
};

export const calculateClassAverage = (grades) => {
  if (!grades || grades.length === 0) return 0;
  const total = grades.reduce((sum, grade) => sum + grade, 0);
  return Math.round(total / grades.length);
};

export const calculateWeightedGrade = (assignments, grades, weights) => {
  const categories = {};
  
  assignments.forEach(assignment => {
    if (!categories[assignment.category]) {
      categories[assignment.category] = {
        totalPoints: 0,
        earnedPoints: 0,
        weight: weights[assignment.category] || 1
      };
    }
    
    categories[assignment.category].totalPoints += assignment.points;
    
    const grade = grades.find(g => g.assignmentId === assignment.Id);
    if (grade && grade.submitted) {
      categories[assignment.category].earnedPoints += grade.score;
    }
  });
  
  let totalWeightedScore = 0;
  let totalWeights = 0;
  
  Object.values(categories).forEach(category => {
    if (category.totalPoints > 0) {
      const categoryPercentage = (category.earnedPoints / category.totalPoints) * 100;
      totalWeightedScore += categoryPercentage * category.weight;
      totalWeights += category.weight;
    }
  });
  
  return totalWeights > 0 ? Math.round(totalWeightedScore / totalWeights) : 0;
};