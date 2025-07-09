// Archivo principal de la base de datos - Exporta todas las funciones y datos

// Usuarios
export * from './users';

// Estudiantes
export * from './students';

// Exámenes
export * from './exams';

// Intentos de examen
export * from './examAttempts';

// Resultados de exámenes
export * from './examResults';

// Preguntas
export * from './questions';

// Configuración de la base de datos
export const DATABASE_CONFIG = {
  version: '1.0.0',
  lastUpdated: new Date(),
  tables: [
    'users',
    'students', 
    'exams',
    'examAttempts',
    'examResults',
    'questions'
  ],
};

// Función para inicializar la base de datos
export const initializeDatabase = () => {
  console.log('🗄️ Base de datos UNMSM inicializada');
  console.log('📊 Tablas disponibles:', DATABASE_CONFIG.tables);
  console.log('🔄 Versión:', DATABASE_CONFIG.version);
};

// Función para obtener estadísticas generales
export const getDatabaseStats = () => {
  const { getAllUsers } = require('./users');
  const { getAllStudents } = require('./students');
  const { getAllExams } = require('./exams');
  const { getAllExamAttempts } = require('./examAttempts');
  const { getAllExamResults } = require('./examResults');
  const { getAllQuestions } = require('./questions');

  return {
    users: getAllUsers().length,
    students: getAllStudents().length,
    exams: getAllExams().length,
    examAttempts: getAllExamAttempts().length,
    examResults: getAllExamResults().length,
    questions: getAllQuestions().length,
    lastUpdated: DATABASE_CONFIG.lastUpdated,
  };
};

// Función para limpiar datos de prueba (útil para desarrollo)
export const clearTestData = () => {
  console.log('🧹 Limpiando datos de prueba...');
  // Implementar lógica de limpieza si es necesario
};

// Función para hacer backup de los datos
export const backupDatabase = () => {
  const data = {
    users: require('./users').getAllUsers(),
    students: require('./students').getAllStudents(),
    exams: require('./exams').getAllExams(),
    examAttempts: require('./examAttempts').getAllExamAttempts(),
    examResults: require('./examResults').getAllExamResults(),
    questions: require('./questions').getAllQuestions(),
    timestamp: new Date(),
  };
  
  return JSON.stringify(data, null, 2);
};