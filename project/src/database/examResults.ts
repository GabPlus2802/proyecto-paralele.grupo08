import { ExamResult } from '../types';

// Base de datos de resultados de exámenes evaluados
export const examResults: ExamResult[] = [];

// Funciones para gestionar resultados de exámenes
export const getExamResultById = (id: string): ExamResult | undefined => {
  return examResults.find(result => result.id === id);
};

export const getExamResultsByStudent = (studentId: string): ExamResult[] => {
  return examResults.filter(result => result.studentId === studentId);
};

export const getExamResultsByExam = (examId: string): ExamResult[] => {
  return examResults.filter(result => result.examId === examId);
};

export const getEvaluatedResults = (): ExamResult[] => {
  return examResults.filter(result => result.status === 'evaluated');
};

export const getPendingResults = (): ExamResult[] => {
  return examResults.filter(result => result.status === 'pending');
};

export const addExamResult = (result: ExamResult): void => {
  examResults.push(result);
};

export const addExamResults = (results: ExamResult[]): void => {
  examResults.push(...results);
};

export const updateExamResult = (id: string, updates: Partial<ExamResult>): boolean => {
  const index = examResults.findIndex(result => result.id === id);
  if (index !== -1) {
    examResults[index] = { ...examResults[index], ...updates };
    return true;
  }
  return false;
};

export const deleteExamResult = (id: string): boolean => {
  const index = examResults.findIndex(result => result.id === id);
  if (index !== -1) {
    examResults.splice(index, 1);
    return true;
  }
  return false;
};

export const getAllExamResults = (): ExamResult[] => {
  return [...examResults];
};

export const getResultsByArea = (area: 'A' | 'B' | 'C' | 'D' | 'E'): ExamResult[] => {
  return examResults.filter(result => result.examId.includes(`exam_${area}`));
};

export const getTopResultsByArea = (area: 'A' | 'B' | 'C' | 'D' | 'E', limit: number = 10): ExamResult[] => {
  return getResultsByArea(area)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
};

export const calculateAreaStatistics = (area: 'A' | 'B' | 'C' | 'D' | 'E') => {
  const areaResults = getResultsByArea(area);
  
  if (areaResults.length === 0) {
    return {
      totalExams: 0,
      averageScore: 0,
      highestScore: 0,
      lowestScore: 0,
      passRate: 0,
    };
  }

  const scores = areaResults.map(r => r.score);
  const averageScore = scores.reduce((sum, score) => sum + score, 0) / scores.length;
  const highestScore = Math.max(...scores);
  const lowestScore = Math.min(...scores);
  const passRate = (areaResults.filter(r => r.percentage >= 60).length / areaResults.length) * 100;

  return {
    totalExams: areaResults.length,
    averageScore: Math.round(averageScore * 100) / 100,
    highestScore,
    lowestScore,
    passRate: Math.round(passRate * 100) / 100,
  };
};