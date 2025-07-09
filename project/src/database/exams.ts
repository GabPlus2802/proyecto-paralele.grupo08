import { Exam, EXAM_AREAS } from '../types';

// Base de datos de exámenes por área
export const exams: Exam[] = EXAM_AREAS.map(area => ({
  id: `exam_${area.code}`,
  title: `Examen de Admisión - Área ${area.code}: ${area.name}`,
  description: area.description,
  questions: [], // Las preguntas se generan dinámicamente
  duration: 180, // 3 horas
  totalPoints: 2000, // 100 preguntas x 20 puntos
  createdBy: '2', // ID del docente por defecto
  createdAt: new Date(Date.now() - 86400000 * 2), // Hace 2 días
  isActive: true,
  allowedAttempts: 1,
  area: area.code,
  correctAnswers: area.code.repeat(100), // 100 respuestas correctas del área
}));

// Funciones para gestionar exámenes
export const getExamById = (id: string): Exam | undefined => {
  return exams.find(exam => exam.id === id);
};

export const getExamsByArea = (area: 'A' | 'B' | 'C' | 'D' | 'E'): Exam[] => {
  return exams.filter(exam => exam.area === area);
};

export const getActiveExams = (): Exam[] => {
  return exams.filter(exam => exam.isActive);
};

export const addExam = (exam: Exam): void => {
  exams.push(exam);
};

export const updateExam = (id: string, updates: Partial<Exam>): boolean => {
  const index = exams.findIndex(exam => exam.id === id);
  if (index !== -1) {
    exams[index] = { ...exams[index], ...updates };
    return true;
  }
  return false;
};

export const deleteExam = (id: string): boolean => {
  const index = exams.findIndex(exam => exam.id === id);
  if (index !== -1) {
    exams.splice(index, 1);
    return true;
  }
  return false;
};

export const toggleExamStatus = (id: string): boolean => {
  const exam = getExamById(id);
  if (exam) {
    exam.isActive = !exam.isActive;
    return true;
  }
  return false;
};

export const getAllExams = (): Exam[] => {
  return [...exams];
};

export const getExamsByCreator = (creatorId: string): Exam[] => {
  return exams.filter(exam => exam.createdBy === creatorId);
};