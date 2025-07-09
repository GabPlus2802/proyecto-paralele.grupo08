import { Question } from '../types';

// Base de datos de preguntas por materia
export const questionBank: Record<string, Question[]> = {
  'Matemáticas': [
    {
      id: 'math_001',
      text: '¿Cuál es el resultado de la ecuación 2x + 5 = 13?',
      options: ['x = 3', 'x = 4', 'x = 5', 'x = 6', 'x = 7'],
      correctAnswer: 1,
      subject: 'Matemáticas',
      difficulty: 'easy',
      points: 20,
    },
    {
      id: 'math_002',
      text: 'Si f(x) = x² + 3x - 2, ¿cuál es f(2)?',
      options: ['6', '8', '10', '12', '14'],
      correctAnswer: 1,
      subject: 'Matemáticas',
      difficulty: 'medium',
      points: 20,
    },
  ],
  'Comunicación': [
    {
      id: 'comm_001',
      text: '¿Cuál es el sujeto en la oración "Los estudiantes estudian para el examen"?',
      options: ['estudian', 'Los estudiantes', 'para el examen', 'el examen', 'estudian para'],
      correctAnswer: 1,
      subject: 'Comunicación',
      difficulty: 'easy',
      points: 20,
    },
  ],
  'Historia': [
    {
      id: 'hist_001',
      text: '¿En qué año se fundó la Universidad Nacional Mayor de San Marcos?',
      options: ['1551', '1553', '1555', '1557', '1559'],
      correctAnswer: 0,
      subject: 'Historia',
      difficulty: 'medium',
      points: 20,
    },
  ],
  'Física': [
    {
      id: 'phys_001',
      text: '¿Cuál es la unidad de medida de la fuerza en el Sistema Internacional?',
      options: ['Joule', 'Newton', 'Pascal', 'Watt', 'Volt'],
      correctAnswer: 1,
      subject: 'Física',
      difficulty: 'easy',
      points: 20,
    },
  ],
  'Química': [
    {
      id: 'chem_001',
      text: '¿Cuál es el símbolo químico del oro?',
      options: ['Go', 'Au', 'Ag', 'Or', 'Gd'],
      correctAnswer: 1,
      subject: 'Química',
      difficulty: 'easy',
      points: 20,
    },
  ],
  'Biología': [
    {
      id: 'bio_001',
      text: '¿Cuál es la unidad básica de la vida?',
      options: ['Átomo', 'Molécula', 'Célula', 'Tejido', 'Órgano'],
      correctAnswer: 2,
      subject: 'Biología',
      difficulty: 'easy',
      points: 20,
    },
  ],
};

// Materias por área de examen
export const subjectsByArea: Record<string, string[]> = {
  'A': ['Matemáticas', 'Física', 'Química', 'Biología', 'Comunicación'],
  'B': ['Matemáticas', 'Física', 'Química', 'Biología', 'Comunicación'],
  'C': ['Matemáticas', 'Física', 'Química', 'Comunicación', 'Historia'],
  'D': ['Matemáticas', 'Historia', 'Geografía', 'Economía', 'Comunicación'],
  'E': ['Historia', 'Literatura', 'Filosofía', 'Geografía', 'Comunicación'],
};

// Funciones para gestionar preguntas
export const getQuestionById = (id: string): Question | undefined => {
  for (const subject in questionBank) {
    const question = questionBank[subject].find(q => q.id === id);
    if (question) return question;
  }
  return undefined;
};

export const getQuestionsBySubject = (subject: string): Question[] => {
  return questionBank[subject] || [];
};

export const getQuestionsByArea = (area: 'A' | 'B' | 'C' | 'D' | 'E'): Question[] => {
  const subjects = subjectsByArea[area] || [];
  const questions: Question[] = [];
  
  subjects.forEach(subject => {
    questions.push(...getQuestionsBySubject(subject));
  });
  
  return questions;
};

export const getQuestionsByDifficulty = (difficulty: 'easy' | 'medium' | 'hard'): Question[] => {
  const allQuestions: Question[] = [];
  
  for (const subject in questionBank) {
    allQuestions.push(...questionBank[subject]);
  }
  
  return allQuestions.filter(q => q.difficulty === difficulty);
};

export const addQuestion = (question: Question): void => {
  if (!questionBank[question.subject]) {
    questionBank[question.subject] = [];
  }
  questionBank[question.subject].push(question);
};

export const updateQuestion = (id: string, updates: Partial<Question>): boolean => {
  for (const subject in questionBank) {
    const index = questionBank[subject].findIndex(q => q.id === id);
    if (index !== -1) {
      questionBank[subject][index] = { ...questionBank[subject][index], ...updates };
      return true;
    }
  }
  return false;
};

export const deleteQuestion = (id: string): boolean => {
  for (const subject in questionBank) {
    const index = questionBank[subject].findIndex(q => q.id === id);
    if (index !== -1) {
      questionBank[subject].splice(index, 1);
      return true;
    }
  }
  return false;
};

export const getAllQuestions = (): Question[] => {
  const allQuestions: Question[] = [];
  
  for (const subject in questionBank) {
    allQuestions.push(...questionBank[subject]);
  }
  
  return allQuestions;
};

export const getRandomQuestionsByArea = (area: 'A' | 'B' | 'C' | 'D' | 'E', count: number = 100): Question[] => {
  const areaQuestions = getQuestionsByArea(area);
  const shuffled = [...areaQuestions].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

export const generateExamQuestions = (area: 'A' | 'B' | 'C' | 'D' | 'E'): Question[] => {
  // Generar 100 preguntas mock para el área especificada
  const subjects = subjectsByArea[area] || ['Matemáticas'];
  const questions: Question[] = [];
  
  for (let i = 0; i < 100; i++) {
    const subject = subjects[i % subjects.length];
    questions.push({
      id: `${area.toLowerCase()}_q${i + 1}`,
      text: `Pregunta ${i + 1}: ¿Cuál es la respuesta correcta para esta pregunta de ${subject} del área ${area}?`,
      options: [
        'Opción A - Primera alternativa de respuesta',
        'Opción B - Segunda alternativa de respuesta',
        'Opción C - Tercera alternativa de respuesta',
        'Opción D - Cuarta alternativa de respuesta',
        'Opción E - Quinta alternativa de respuesta'
      ],
      correctAnswer: Math.floor(Math.random() * 5),
      subject,
      difficulty: 'medium',
      points: 20,
    });
  }
  
  return questions;
};