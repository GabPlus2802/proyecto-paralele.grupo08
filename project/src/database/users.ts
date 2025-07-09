import { User } from '../types';

// Base de datos de usuarios del sistema
export const users: User[] = [
  // Usuarios por defecto del sistema
  {
    id: '1',
    email: 'estudiante@unmsm.edu.pe',
    name: 'María González',
    role: 'student',
  },
  {
    id: '2',
    email: 'docente@unmsm.edu.pe',
    name: 'Dr. Carlos Mendoza',
    role: 'teacher',
  },
  {
    id: '3',
    email: 'admin@unmsm.edu.pe',
    name: 'Ana Rodríguez',
    role: 'admin',
  },
  // Estudiantes adicionales
  {
    id: '4',
    email: 'maria.gonzalez@gmail.com',
    name: 'María González Pérez',
    role: 'student',
  },
  {
    id: '5',
    email: 'carlos.mendoza@gmail.com',
    name: 'Carlos Mendoza Silva',
    role: 'student',
  },
  {
    id: '6',
    email: 'ana.rodriguez@gmail.com',
    name: 'Ana Rodríguez López',
    role: 'student',
  },
  {
    id: '7',
    email: 'luis.castro@gmail.com',
    name: 'Luis Castro Vargas',
    role: 'student',
  },
  {
    id: '8',
    email: 'patricia.flores@gmail.com',
    name: 'Patricia Flores Ruiz',
    role: 'student',
  },
  {
    id: '9',
    email: 'roberto.sanchez@gmail.com',
    name: 'Roberto Sánchez Torres',
    role: 'student',
  },
  {
    id: '10',
    email: 'carmen.vasquez@gmail.com',
    name: 'Carmen Vásquez Morales',
    role: 'student',
  },
  {
    id: '11',
    email: 'diego.herrera@gmail.com',
    name: 'Diego Herrera Campos',
    role: 'student',
  },
  {
    id: '12',
    email: 'sofia.ramirez@gmail.com',
    name: 'Sofía Ramírez Delgado',
    role: 'student',
  },
  {
    id: '13',
    email: 'andres.paredes@gmail.com',
    name: 'Andrés Paredes Quispe',
    role: 'student',
  },
  {
    id: '14',
    email: 'valeria.nunez@gmail.com',
    name: 'Valeria Núñez Espinoza',
    role: 'student',
  },
  {
    id: '15',
    email: 'javier.moreno@gmail.com',
    name: 'Javier Moreno Castillo',
    role: 'student',
  },
  {
    id: '16',
    email: 'isabella.torres@gmail.com',
    name: 'Isabella Torres Mendoza',
    role: 'student',
  },
  {
    id: '17',
    email: 'sebastian.aguilar@gmail.com',
    name: 'Sebastián Aguilar Ramos',
    role: 'student',
  },
  {
    id: '18',
    email: 'camila.jimenez@gmail.com',
    name: 'Camila Jiménez Vargas',
    role: 'student',
  },
  {
    id: '19',
    email: 'mateo.silva@gmail.com',
    name: 'Mateo Silva Herrera',
    role: 'student',
  },
];

// Funciones para gestionar usuarios
export const getUserById = (id: string): User | undefined => {
  return users.find(user => user.id === id);
};

export const getUserByEmail = (email: string): User | undefined => {
  return users.find(user => user.email === email);
};

export const addUser = (user: User): void => {
  users.push(user);
};

export const updateUser = (id: string, updates: Partial<User>): boolean => {
  const index = users.findIndex(user => user.id === id);
  if (index !== -1) {
    users[index] = { ...users[index], ...updates };
    return true;
  }
  return false;
};

export const deleteUser = (id: string): boolean => {
  const index = users.findIndex(user => user.id === id);
  if (index !== -1) {
    users.splice(index, 1);
    return true;
  }
  return false;
};

export const getAllUsers = (): User[] => {
  return [...users];
};

export const getUsersByRole = (role: User['role']): User[] => {
  return users.filter(user => user.role === role);
};