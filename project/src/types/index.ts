export interface User {
  id: string;
  email: string;
  name: string;
  role: 'student' | 'teacher' | 'admin';
  avatar?: string;
}

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
  subject: string;
  difficulty: 'easy' | 'medium' | 'hard';
  points: number;
}

export interface Exam {
  id: string;
  title: string;
  description: string;
  questions: Question[];
  duration: number; // in minutes
  totalPoints: number;
  createdBy: string;
  createdAt: Date;
  isActive: boolean;
  allowedAttempts: number;
  correctAnswers: string; // Cadena de respuestas correctas ej: "ABCDA"
  area: 'A' | 'B' | 'C' | 'D' | 'E'; // Nueva propiedad para área
}

export interface ExamAttempt {
  id: string;
  examId: string;
  studentId: string;
  studentName: string;
  answers: Record<string, number>;
  answerString: string; // Cadena de respuestas del estudiante ej: "ACDBA" o "AXDBA"
  score: number;
  startTime: Date;
  endTime?: Date;
  status: 'in-progress' | 'completed' | 'submitted' | 'evaluating' | 'evaluated' | 'pending';
  processingThread?: number; // Número del hilo OpenMP que procesa este examen
}

export interface ExamResult {
  id: string;
  examId: string;
  studentId: string;
  studentName: string;
  answerString: string;
  correctAnswers: string;
  score: number;
  totalPoints: number;
  percentage: number;
  completedAt: Date;
  timeSpent: number; // in minutes
  correctCount: number;
  incorrectCount: number;
  blankCount: number;
  totalQuestions: number;
  processingTime: number; // tiempo de procesamiento en ms
  status: 'pending' | 'evaluated'; // Estado de evaluación
}

export interface Student {
  id: string;
  name: string;
  email: string;
  dni: string;
  phone: string;
  address: string;
  birthDate: Date;
  school: string;
  career: string;
  area: 'A' | 'B' | 'C' | 'D' | 'E'; // Área de postulación
  registrationDate: Date;
  examResults: ExamResult[];
  totalScore: number;
  isAdmitted: boolean;
  admissionRank?: number;
}

export interface OpenMPConfig {
  numThreads: number;
  schedulingStrategy: 'static' | 'dynamic' | 'guided';
  chunkSize: number;
}

export interface ProcessingStats {
  totalExams: number;
  processedExams: number;
  currentlyProcessing: number;
  averageProcessingTime: number;
  threadsUtilization: ThreadUtilization[];
}

export interface ThreadUtilization {
  threadId: number;
  isActive: boolean;
  currentExam?: string;
  utilization: number; // porcentaje de uso
  examsProcessed: number;
}

export interface ExamSession {
  id: string;
  examId: string;
  studentId: string;
  currentQuestionIndex: number;
  answers: Record<string, string>;
  startTime: Date;
  timeRemaining: number;
  isActive: boolean;
}

// Definición de las 5 áreas de la UNMSM
export interface ExamArea {
  code: 'A' | 'B' | 'C' | 'D' | 'E';
  name: string;
  description: string;
  careers: string[];
}

export const EXAM_AREAS: ExamArea[] = [
  {
    code: 'A',
    name: 'Ciencias de la Salud',
    description: 'Medicina, Enfermería, Odontología, Farmacia, Veterinaria',
    careers: ['Medicina Humana', 'Enfermería', 'Odontología', 'Farmacia y Bioquímica', 'Veterinaria']
  },
  {
    code: 'B',
    name: 'Ciencias Básicas',
    description: 'Matemáticas, Física, Química, Biología',
    careers: ['Matemáticas', 'Física', 'Química', 'Biología', 'Estadística']
  },
  {
    code: 'C',
    name: 'Ingeniería',
    description: 'Todas las ingenierías y Arquitectura',
    careers: ['Ingeniería de Sistemas', 'Ingeniería Civil', 'Ingeniería Industrial', 'Ingeniería Electrónica', 'Arquitectura', 'Ingeniería Mecánica']
  },
  {
    code: 'D',
    name: 'Ciencias Económicas y de Gestión',
    description: 'Economía, Contabilidad, Administración',
    careers: ['Economía', 'Contabilidad', 'Administración']
  },
  {
    code: 'E',
    name: 'Humanidades, Ciencias Jurídicas y Sociales',
    description: 'Derecho, Psicología, Historia, Literatura, Comunicación',
    careers: ['Derecho', 'Psicología', 'Historia', 'Literatura', 'Comunicación Social', 'Filosofía', 'Sociología']
  }
];