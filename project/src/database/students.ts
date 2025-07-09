import { Student } from '../types';

// Base de datos de estudiantes registrados
export const students: Student[] = [];

// Perfiles de estudiantes por email (para compatibilidad con usuarios existentes)
export const studentProfiles: Record<string, Omit<Student, 'id' | 'examResults' | 'totalScore' | 'isAdmitted'>> = {
  'maria.gonzalez@gmail.com': {
    name: 'María González Pérez',
    email: 'maria.gonzalez@gmail.com',
    dni: '12345678',
    career: 'Medicina Humana',
    area: 'A',
    school: 'I.E. José María Eguren',
    phone: '+51 987 654 321',
    address: 'Av. Universitaria 1801, Lima',
    birthDate: new Date('2000-05-15'),
    registrationDate: new Date('2024-01-15'),
    admissionRank: undefined,
  },
  'carlos.mendoza@gmail.com': {
    name: 'Carlos Mendoza Silva',
    email: 'carlos.mendoza@gmail.com',
    dni: '23456789',
    career: 'Ingeniería de Sistemas',
    area: 'C',
    school: 'I.E. Alfonso Ugarte',
    phone: '+51 987 654 322',
    address: 'Jr. Lampa 545, Lima',
    birthDate: new Date('1999-08-22'),
    registrationDate: new Date('2024-01-16'),
    admissionRank: undefined,
  },
  'ana.rodriguez@gmail.com': {
    name: 'Ana Rodríguez López',
    email: 'ana.rodriguez@gmail.com',
    dni: '34567890',
    career: 'Derecho',
    area: 'E',
    school: 'I.E. Mercedes Cabello',
    phone: '+51 987 654 323',
    address: 'Av. Brasil 2950, Lima',
    birthDate: new Date('2001-03-10'),
    registrationDate: new Date('2024-01-17'),
    admissionRank: undefined,
  },
  'luis.castro@gmail.com': {
    name: 'Luis Castro Vargas',
    email: 'luis.castro@gmail.com',
    dni: '45678901',
    career: 'Medicina Humana',
    area: 'A',
    school: 'I.E. Ricardo Palma',
    phone: '+51 987 654 324',
    address: 'Av. Arequipa 1234, Lima',
    birthDate: new Date('2000-11-05'),
    registrationDate: new Date('2024-01-18'),
    admissionRank: undefined,
  },
  'patricia.flores@gmail.com': {
    name: 'Patricia Flores Ruiz',
    email: 'patricia.flores@gmail.com',
    dni: '56789012',
    career: 'Psicología',
    area: 'E',
    school: 'I.E. María Parado de Bellido',
    phone: '+51 987 654 325',
    address: 'Jr. Cusco 890, Lima',
    birthDate: new Date('1999-12-18'),
    registrationDate: new Date('2024-01-19'),
    admissionRank: undefined,
  },
  'roberto.sanchez@gmail.com': {
    name: 'Roberto Sánchez Torres',
    email: 'roberto.sanchez@gmail.com',
    dni: '67890123',
    career: 'Ingeniería Industrial',
    area: 'C',
    school: 'I.E. Bartolomé Herrera',
    phone: '+51 987 654 326',
    address: 'Av. Colonial 2100, Lima',
    birthDate: new Date('2000-07-30'),
    registrationDate: new Date('2024-01-20'),
    admissionRank: undefined,
  },
  'carmen.vasquez@gmail.com': {
    name: 'Carmen Vásquez Morales',
    email: 'carmen.vasquez@gmail.com',
    dni: '78901234',
    career: 'Enfermería',
    area: 'A',
    school: 'I.E. Santa Rosa',
    phone: '+51 987 654 327',
    address: 'Av. Javier Prado 1500, Lima',
    birthDate: new Date('2000-02-14'),
    registrationDate: new Date('2024-01-21'),
    admissionRank: undefined,
  },
  'diego.herrera@gmail.com': {
    name: 'Diego Herrera Campos',
    email: 'diego.herrera@gmail.com',
    dni: '89012345',
    career: 'Arquitectura',
    area: 'C',
    school: 'I.E. Melitón Carbajal',
    phone: '+51 987 654 328',
    address: 'Jr. Huancavelica 750, Lima',
    birthDate: new Date('1999-09-03'),
    registrationDate: new Date('2024-01-22'),
    admissionRank: undefined,
  },
  'sofia.ramirez@gmail.com': {
    name: 'Sofía Ramírez Delgado',
    email: 'sofia.ramirez@gmail.com',
    dni: '90123456',
    career: 'Odontología',
    area: 'A',
    school: 'I.E. Teresa González de Fanning',
    phone: '+51 987 654 329',
    address: 'Av. Petit Thouars 2800, Lima',
    birthDate: new Date('2001-01-25'),
    registrationDate: new Date('2024-01-23'),
    admissionRank: undefined,
  },
  'andres.paredes@gmail.com': {
    name: 'Andrés Paredes Quispe',
    email: 'andres.paredes@gmail.com',
    dni: '01234567',
    career: 'Ingeniería Civil',
    area: 'C',
    school: 'I.E. Guadalupe',
    phone: '+51 987 654 330',
    address: 'Av. Venezuela 1200, Lima',
    birthDate: new Date('2000-06-12'),
    registrationDate: new Date('2024-01-24'),
    admissionRank: undefined,
  },
  'valeria.nunez@gmail.com': {
    name: 'Valeria Núñez Espinoza',
    email: 'valeria.nunez@gmail.com',
    dni: '11234567',
    career: 'Farmacia y Bioquímica',
    area: 'A',
    school: 'I.E. Rosa de Santa María',
    phone: '+51 987 654 331',
    address: 'Jr. Azángaro 456, Lima',
    birthDate: new Date('1999-11-08'),
    registrationDate: new Date('2024-01-25'),
    admissionRank: undefined,
  },
  'javier.moreno@gmail.com': {
    name: 'Javier Moreno Castillo',
    email: 'javier.moreno@gmail.com',
    dni: '22345678',
    career: 'Contabilidad',
    area: 'D',
    school: 'I.E. San Martín de Porres',
    phone: '+51 987 654 332',
    address: 'Av. Tacna 890, Lima',
    birthDate: new Date('2000-04-17'),
    registrationDate: new Date('2024-01-26'),
    admissionRank: undefined,
  },
  'isabella.torres@gmail.com': {
    name: 'Isabella Torres Mendoza',
    email: 'isabella.torres@gmail.com',
    dni: '33456789',
    career: 'Veterinaria',
    area: 'A',
    school: 'I.E. Elvira García y García',
    phone: '+51 987 654 333',
    address: 'Av. Grau 1650, Lima',
    birthDate: new Date('2001-07-22'),
    registrationDate: new Date('2024-01-27'),
    admissionRank: undefined,
  },
  'sebastian.aguilar@gmail.com': {
    name: 'Sebastián Aguilar Ramos',
    email: 'sebastian.aguilar@gmail.com',
    dni: '44567890',
    career: 'Ingeniería Electrónica',
    area: 'C',
    school: 'I.E. Mariano Melgar',
    phone: '+51 987 654 334',
    address: 'Jr. Carabaya 320, Lima',
    birthDate: new Date('1999-10-11'),
    registrationDate: new Date('2024-01-28'),
    admissionRank: undefined,
  },
  'camila.jimenez@gmail.com': {
    name: 'Camila Jiménez Vargas',
    email: 'camila.jimenez@gmail.com',
    dni: '55678901',
    career: 'Comunicación Social',
    area: 'E',
    school: 'I.E. Nuestra Señora de Guadalupe',
    phone: '+51 987 654 335',
    address: 'Av. Salaverry 2400, Lima',
    birthDate: new Date('2000-12-05'),
    registrationDate: new Date('2024-01-29'),
    admissionRank: undefined,
  },
  'mateo.silva@gmail.com': {
    name: 'Mateo Silva Herrera',
    email: 'mateo.silva@gmail.com',
    dni: '66789012',
    career: 'Economía',
    area: 'D',
    school: 'I.E. La Salle',
    phone: '+51 987 654 336',
    address: 'Jr. Ica 780, Lima',
    birthDate: new Date('2001-03-28'),
    registrationDate: new Date('2024-01-30'),
    admissionRank: undefined,
  },
};

// Funciones para gestionar estudiantes
export const getStudentById = (id: string): Student | undefined => {
  return students.find(student => student.id === id);
};

export const getStudentByEmail = (email: string): Student | undefined => {
  return students.find(student => student.email === email);
};

export const getStudentProfileByEmail = (email: string) => {
  const dynamicStudent = students.find(s => s.email === email);
  if (dynamicStudent) {
    return {
      name: dynamicStudent.name,
      dni: dynamicStudent.dni,
      career: dynamicStudent.career,
      area: dynamicStudent.area,
      school: dynamicStudent.school,
      phone: dynamicStudent.phone,
      address: dynamicStudent.address,
      birthDate: dynamicStudent.birthDate,
    };
  }

  const staticProfile = studentProfiles[email];
  if (staticProfile) {
    return staticProfile;
  }

  // Perfil por defecto
  return {
    name: 'Estudiante',
    dni: '00000000',
    career: 'Medicina Humana',
    area: 'A' as const,
    school: 'I.E. General',
    phone: '+51 000 000 000',
    address: 'Dirección no especificada',
    birthDate: new Date('2000-01-01'),
  };
};

export const addStudent = (student: Student): void => {
  students.push(student);
};

export const updateStudent = (id: string, updates: Partial<Student>): boolean => {
  const index = students.findIndex(student => student.id === id);
  if (index !== -1) {
    students[index] = { ...students[index], ...updates };
    return true;
  }
  return false;
};

export const deleteStudent = (id: string): boolean => {
  const index = students.findIndex(student => student.id === id);
  if (index !== -1) {
    students.splice(index, 1);
    return true;
  }
  return false;
};

export const getAllStudents = (): Student[] => {
  return [...students];
};

export const getStudentsByArea = (area: 'A' | 'B' | 'C' | 'D' | 'E'): Student[] => {
  return students.filter(student => student.area === area);
};