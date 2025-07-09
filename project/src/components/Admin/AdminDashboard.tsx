import React, { useState } from 'react';
import { Users, BookOpen, Server, Activity, Settings, UserCheck, Search, Filter, Download, UserPlus, Edit, Trash2, Eye, Cpu } from 'lucide-react';
import { Student, EXAM_AREAS, User } from '../../types';
import UserManagementModal from './UserManagementModal';
import StudentRegistrationModal from './StudentRegistrationModal';

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'students' | 'system' | 'monitoring'>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCareer, setFilterCareer] = useState('');
  const [filterAdmitted, setFilterAdmitted] = useState('');
  const [filterArea, setFilterArea] = useState('');
  const [showUserModal, setShowUserModal] = useState(false);
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | undefined>();
  const [editingStudent, setEditingStudent] = useState<Student | undefined>();
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [users, setUsers] = useState<User[]>([
    { id: '1', email: 'estudiante@unmsm.edu.pe', name: 'María González', role: 'student' },
    { id: '2', email: 'docente@unmsm.edu.pe', name: 'Dr. Carlos Mendoza', role: 'teacher' },
    { id: '3', email: 'admin@unmsm.edu.pe', name: 'Ana Rodríguez', role: 'admin' },
  ]);

  // Configuración OpenMP simulada
  const [openmpConfig, setOpenmpConfig] = useState({
    numThreads: 4,
    schedulingStrategy: 'dynamic' as const,
  });

  // Mock data de estudiantes expandido con áreas
  const [students, setStudents] = useState<Student[]>([
    {
      id: '1',
      name: 'María González Pérez',
      email: 'maria.gonzalez@gmail.com',
      dni: '12345678',
      phone: '+51 987 654 321',
      address: 'Av. Universitaria 1801, Lima',
      birthDate: new Date('2000-05-15'),
      school: 'I.E. José María Eguren',
      career: 'Medicina Humana',
      area: 'A',
      registrationDate: new Date('2024-01-15'),
      examResults: [],
      totalScore: 1485.75,
      isAdmitted: true,
      admissionRank: 1,
    },
    {
      id: '2',
      name: 'Carlos Mendoza Silva',
      email: 'carlos.mendoza@gmail.com',
      dni: '23456789',
      phone: '+51 987 654 322',
      address: 'Jr. Lampa 545, Lima',
      birthDate: new Date('1999-08-22'),
      school: 'I.E. Alfonso Ugarte',
      career: 'Ingeniería de Sistemas',
      area: 'C',
      registrationDate: new Date('2024-01-16'),
      examResults: [],
      totalScore: 1362.25,
      isAdmitted: true,
      admissionRank: 5,
    },
    {
      id: '3',
      name: 'Ana Rodríguez López',
      email: 'ana.rodriguez@gmail.com',
      dni: '34567890',
      phone: '+51 987 654 323',
      address: 'Av. Brasil 2950, Lima',
      birthDate: new Date('2001-03-10'),
      school: 'I.E. Mercedes Cabello',
      career: 'Derecho',
      area: 'E',
      registrationDate: new Date('2024-01-17'),
      examResults: [],
      totalScore: 1245.50,
      isAdmitted: true,
      admissionRank: 12,
    },
    {
      id: '4',
      name: 'Luis Castro Vargas',
      email: 'luis.castro@gmail.com',
      dni: '45678901',
      phone: '+51 987 654 324',
      address: 'Av. Arequipa 1234, Lima',
      birthDate: new Date('2000-11-05'),
      school: 'I.E. Ricardo Palma',
      career: 'Medicina Humana',
      area: 'A',
      registrationDate: new Date('2024-01-18'),
      examResults: [],
      totalScore: 1098.75,
      isAdmitted: false,
    },
    {
      id: '5',
      name: 'Patricia Flores Ruiz',
      email: 'patricia.flores@gmail.com',
      dni: '56789012',
      phone: '+51 987 654 325',
      address: 'Jr. Cusco 890, Lima',
      birthDate: new Date('1999-12-18'),
      school: 'I.E. María Parado de Bellido',
      career: 'Psicología',
      area: 'E',
      registrationDate: new Date('2024-01-19'),
      examResults: [],
      totalScore: 1325.25,
      isAdmitted: true,
      admissionRank: 8,
    },
    {
      id: '6',
      name: 'Roberto Sánchez Torres',
      email: 'roberto.sanchez@gmail.com',
      dni: '67890123',
      phone: '+51 987 654 326',
      address: 'Av. Colonial 2100, Lima',
      birthDate: new Date('2000-07-30'),
      school: 'I.E. Bartolomé Herrera',
      career: 'Ingeniería Industrial',
      area: 'C',
      registrationDate: new Date('2024-01-20'),
      examResults: [],
      totalScore: 975.50,
      isAdmitted: false,
    },
    {
      id: '7',
      name: 'Carmen Vásquez Morales',
      email: 'carmen.vasquez@gmail.com',
      dni: '78901234',
      phone: '+51 987 654 327',
      address: 'Av. Javier Prado 1500, Lima',
      birthDate: new Date('2000-02-14'),
      school: 'I.E. Santa Rosa',
      career: 'Enfermería',
      area: 'A',
      registrationDate: new Date('2024-01-21'),
      examResults: [],
      totalScore: 1356.80,
      isAdmitted: true,
      admissionRank: 6,
    },
    {
      id: '8',
      name: 'Diego Herrera Campos',
      email: 'diego.herrera@gmail.com',
      dni: '89012345',
      phone: '+51 987 654 328',
      address: 'Jr. Huancavelica 750, Lima',
      birthDate: new Date('1999-09-03'),
      school: 'I.E. Melitón Carbajal',
      career: 'Arquitectura',
      area: 'C',
      registrationDate: new Date('2024-01-22'),
      examResults: [],
      totalScore: 1212.30,
      isAdmitted: true,
      admissionRank: 15,
    },
    {
      id: '9',
      name: 'Sofía Ramírez Delgado',
      email: 'sofia.ramirez@gmail.com',
      dni: '90123456',
      phone: '+51 987 654 329',
      address: 'Av. Petit Thouars 2800, Lima',
      birthDate: new Date('2001-01-25'),
      school: 'I.E. Teresa González de Fanning',
      career: 'Odontología',
      area: 'A',
      registrationDate: new Date('2024-01-23'),
      examResults: [],
      totalScore: 1467.90,
      isAdmitted: true,
      admissionRank: 4,
    },
    {
      id: '10',
      name: 'Andrés Paredes Quispe',
      email: 'andres.paredes@gmail.com',
      dni: '01234567',
      phone: '+51 987 654 330',
      address: 'Av. Venezuela 1200, Lima',
      birthDate: new Date('2000-06-12'),
      school: 'I.E. Guadalupe',
      career: 'Ingeniería Civil',
      area: 'C',
      registrationDate: new Date('2024-01-24'),
      examResults: [],
      totalScore: 1089.45,
      isAdmitted: false,
    },
    {
      id: '11',
      name: 'Valeria Núñez Espinoza',
      email: 'valeria.nunez@gmail.com',
      dni: '11234567',
      phone: '+51 987 654 331',
      address: 'Jr. Azángaro 456, Lima',
      birthDate: new Date('1999-11-08'),
      school: 'I.E. Rosa de Santa María',
      career: 'Farmacia y Bioquímica',
      area: 'A',
      registrationDate: new Date('2024-01-25'),
      examResults: [],
      totalScore: 1578.65,
      isAdmitted: true,
      admissionRank: 2,
    },
    {
      id: '12',
      name: 'Javier Moreno Castillo',
      email: 'javier.moreno@gmail.com',
      dni: '22345678',
      phone: '+51 987 654 332',
      address: 'Av. Tacna 890, Lima',
      birthDate: new Date('2000-04-17'),
      school: 'I.E. San Martín de Porres',
      career: 'Contabilidad',
      area: 'D',
      registrationDate: new Date('2024-01-26'),
      examResults: [],
      totalScore: 1223.15,
      isAdmitted: true,
      admissionRank: 9,
    },
    {
      id: '13',
      name: 'Isabella Torres Mendoza',
      email: 'isabella.torres@gmail.com',
      dni: '33456789',
      phone: '+51 987 654 333',
      address: 'Av. Grau 1650, Lima',
      birthDate: new Date('2001-07-22'),
      school: 'I.E. Elvira García y García',
      career: 'Veterinaria',
      area: 'A',
      registrationDate: new Date('2024-01-27'),
      examResults: [],
      totalScore: 1341.80,
      isAdmitted: true,
      admissionRank: 13,
    },
    {
      id: '14',
      name: 'Sebastián Aguilar Ramos',
      email: 'sebastian.aguilar@gmail.com',
      dni: '44567890',
      phone: '+51 987 654 334',
      address: 'Jr. Carabaya 320, Lima',
      birthDate: new Date('1999-10-11'),
      school: 'I.E. Mariano Melgar',
      career: 'Ingeniería Electrónica',
      area: 'C',
      registrationDate: new Date('2024-01-28'),
      examResults: [],
      totalScore: 1095.20,
      isAdmitted: false,
    },
    {
      id: '15',
      name: 'Camila Jiménez Vargas',
      email: 'camila.jimenez@gmail.com',
      dni: '55678901',
      phone: '+51 987 654 335',
      address: 'Av. Salaverry 2400, Lima',
      birthDate: new Date('2000-12-05'),
      school: 'I.E. Nuestra Señora de Guadalupe',
      career: 'Comunicación Social',
      area: 'E',
      registrationDate: new Date('2024-01-29'),
      examResults: [],
      totalScore: 1358.35,
      isAdmitted: true,
      admissionRank: 7,
    },
    {
      id: '16',
      name: 'Mateo Silva Herrera',
      email: 'mateo.silva@gmail.com',
      dni: '66789012',
      phone: '+51 987 654 336',
      address: 'Jr. Ica 780, Lima',
      birthDate: new Date('2001-03-28'),
      school: 'I.E. La Salle',
      career: 'Economía',
      area: 'D',
      registrationDate: new Date('2024-01-30'),
      examResults: [],
      totalScore: 1072.90,
      isAdmitted: false,
    },
  ]);

  // Generar métricas de CPU basadas en la configuración de hilos
  const generateCpuMetrics = () => {
    return Array.from({ length: openmpConfig.numThreads }, (_, i) => ({
      name: `CPU Core ${i + 1}`,
      usage: Math.floor(Math.random() * 40) + 45, // 45-85% de uso
      status: Math.random() > 0.8 ? 'high' : 'normal',
    }));
  };

  const [systemMetrics, setSystemMetrics] = useState(generateCpuMetrics());

  // Actualizar métricas cuando cambie la configuración de hilos
  React.useEffect(() => {
    setSystemMetrics(generateCpuMetrics());
  }, [openmpConfig.numThreads]);

  const recentUsers = [
    { name: 'María González', role: 'student', status: 'active', lastLogin: '2 min ago' },
    { name: 'Dr. Carlos Mendoza', role: 'teacher', status: 'active', lastLogin: '5 min ago' },
    { name: 'Ana Rodríguez', role: 'student', status: 'active', lastLogin: '10 min ago' },
    { name: 'Prof. Luis Castro', role: 'teacher', status: 'inactive', lastLogin: '2 hours ago' },
  ];

  const stats = [
    {
      name: 'Total Postulantes',
      value: students.length,
      icon: Users,
      color: 'bg-blue-500',
      change: '+12%',
    },
    {
      name: 'Ingresantes',
      value: students.filter(s => s.isAdmitted).length,
      icon: UserCheck,
      color: 'bg-green-500',
      change: '+8%',
    },
    {
      name: 'Exámenes Activos',
      value: 5, // Una por cada área
      icon: BookOpen,
      color: 'bg-purple-500',
      change: '+5%',
    },
    {
      name: 'Carga del Sistema',
      value: '67%',
      icon: Server,
      color: 'bg-yellow-500',
      change: '-3%',
    },
  ];

  const careers = [...new Set(students.map(s => s.career))];

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.dni.includes(searchTerm) ||
                         student.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCareer = !filterCareer || student.career === filterCareer;
    const matchesAdmitted = !filterAdmitted || 
                           (filterAdmitted === 'admitted' && student.isAdmitted) ||
                           (filterAdmitted === 'not-admitted' && !student.isAdmitted);
    const matchesArea = !filterArea || student.area === filterArea;
    
    return matchesSearch && matchesCareer && matchesAdmitted && matchesArea;
  });

  const handleExportData = () => {
    // Generar contenido PDF estructurado como tabla
    const generatePDF = () => {
      // Crear contenido del PDF con formato de tabla
      const pdfContent = {
        title: 'RESULTADOS DE EXAMEN',
        subtitle: 'Universidad Nacional Mayor de San Marcos',
        date: new Date().toLocaleDateString('es-PE', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }),
        totalStudents: filteredStudents.length,
        admittedStudents: filteredStudents.filter(s => s.isAdmitted).length,
        table: {
          headers: [
            'N°',
            'Nombre Completo',
            'DNI',
            'Email',
            'Área',
            'Carrera',
            'Puntaje',
            'Ranking',
            'Ingresante'
          ],
          rows: filteredStudents.map((student, index) => [
            (index + 1).toString(),
            student.name,
            student.dni,
            student.email,
            `${student.area} - ${EXAM_AREAS.find(a => a.code === student.area)?.name}`,
            student.career,
            student.totalScore.toFixed(2),
            student.admissionRank?.toString() || 'N/A',
            student.isAdmitted ? 'SÍ' : 'NO'
          ])
        },
        summary: {
          totalByArea: EXAM_AREAS.map(area => ({
            area: `${area.code} - ${area.name}`,
            total: filteredStudents.filter(s => s.area === area.code).length,
            admitted: filteredStudents.filter(s => s.area === area.code && s.isAdmitted).length
          }))
        }
      };

      // Crear contenido HTML para el PDF
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>Resultados de Examen - UNMSM</title>
          <style>
            body { 
              font-family: Arial, sans-serif; 
              margin: 20px; 
              font-size: 12px;
            }
            .header { 
              text-align: center; 
              margin-bottom: 30px; 
              border-bottom: 2px solid #1e40af;
              padding-bottom: 20px;
            }
            .title { 
              font-size: 24px; 
              font-weight: bold; 
              color: #1e40af; 
              margin-bottom: 10px;
            }
            .subtitle { 
              font-size: 16px; 
              color: #374151; 
              margin-bottom: 5px;
            }
            .date { 
              font-size: 12px; 
              color: #6b7280; 
            }
            .summary {
              background-color: #f3f4f6;
              padding: 15px;
              border-radius: 8px;
              margin-bottom: 20px;
            }
            .summary-title {
              font-weight: bold;
              margin-bottom: 10px;
              color: #1f2937;
            }
            .summary-stats {
              display: flex;
              justify-content: space-around;
              margin-bottom: 15px;
            }
            .stat {
              text-align: center;
            }
            .stat-number {
              font-size: 18px;
              font-weight: bold;
              color: #1e40af;
            }
            .stat-label {
              font-size: 10px;
              color: #6b7280;
            }
            table { 
              width: 100%; 
              border-collapse: collapse; 
              margin-top: 20px;
              font-size: 10px;
            }
            th, td { 
              border: 1px solid #d1d5db; 
              padding: 8px; 
              text-align: left; 
            }
            th { 
              background-color: #1e40af; 
              color: white; 
              font-weight: bold;
              text-align: center;
            }
            tr:nth-child(even) { 
              background-color: #f9fafb; 
            }
            .admitted { 
              background-color: #dcfce7; 
              color: #166534; 
              font-weight: bold;
            }
            .not-admitted { 
              background-color: #fef2f2; 
              color: #dc2626; 
            }
            .area-summary {
              margin-top: 20px;
              border-top: 1px solid #d1d5db;
              padding-top: 15px;
            }
            .area-item {
              display: flex;
              justify-content: space-between;
              padding: 5px 0;
              border-bottom: 1px solid #e5e7eb;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="title">${pdfContent.title}</div>
            <div class="subtitle">${pdfContent.subtitle}</div>
            <div class="date">Fecha de generación: ${pdfContent.date}</div>
          </div>
          
          <div class="summary">
            <div class="summary-title">Resumen General</div>
            <div class="summary-stats">
              <div class="stat">
                <div class="stat-number">${pdfContent.totalStudents}</div>
                <div class="stat-label">Total Postulantes</div>
              </div>
              <div class="stat">
                <div class="stat-number">${pdfContent.admittedStudents}</div>
                <div class="stat-label">Ingresantes</div>
              </div>
              <div class="stat">
                <div class="stat-number">${((pdfContent.admittedStudents / pdfContent.totalStudents) * 100).toFixed(1)}%</div>
                <div class="stat-label">Tasa de Ingreso</div>
              </div>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                ${pdfContent.table.headers.map(header => `<th>${header}</th>`).join('')}
              </tr>
            </thead>
            <tbody>
              ${pdfContent.table.rows.map(row => `
                <tr>
                  ${row.map((cell, index) => {
                    if (index === 8) { // Columna "Ingresante"
                      const className = cell === 'SÍ' ? 'admitted' : 'not-admitted';
                      return `<td class="${className}">${cell}</td>`;
                    }
                    return `<td>${cell}</td>`;
                  }).join('')}
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div class="area-summary">
            <div class="summary-title">Resumen por Área</div>
            ${pdfContent.summary.totalByArea.map(area => `
              <div class="area-item">
                <span>${area.area}</span>
                <span>${area.admitted}/${area.total} ingresantes</span>
              </div>
            `).join('')}
          </div>
        </body>
        </html>
      `;

      // Simular generación de PDF
      const pdfBlob = new Blob([htmlContent], { 
        type: 'text/html' 
      });
      
      const url = window.URL.createObjectURL(pdfBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `resultados_examen_unmsm_${new Date().toISOString().split('T')[0]}.html`;
      a.click();
      window.URL.revokeObjectURL(url);

      // Mostrar mensaje de confirmación
      alert('Reporte PDF generado exitosamente. Se ha descargado como archivo HTML que puede convertir a PDF.');
    };

    generatePDF();
  };

  const getAreaName = (areaCode: string) => {
    const area = EXAM_AREAS.find(a => a.code === areaCode);
    return area ? `${area.code} - ${area.name}` : areaCode;
  };

  const handleCreateUser = () => {
    setEditingUser(undefined);
    setModalMode('create');
    setShowUserModal(true);
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setModalMode('edit');
    setShowUserModal(true);
  };

  const handleDeleteUser = (userId: string) => {
    if (confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
      setUsers(prev => prev.filter(user => user.id !== userId));
    }
  };

  const handleSaveUser = (userData: Partial<User>) => {
    if (modalMode === 'create') {
      const newUser: User = {
        id: `user_${Date.now()}`,
        ...userData as User,
      };
      setUsers(prev => [...prev, newUser]);
    } else if (editingUser) {
      setUsers(prev => prev.map(user => 
        user.id === editingUser.id 
          ? { ...user, ...userData }
          : user
      ));
    }
  };

  const handleCreateStudent = () => {
    setEditingStudent(undefined);
    setModalMode('create');
    setShowStudentModal(true);
  };

  const handleEditStudent = (student: Student) => {
    setEditingStudent(student);
    setModalMode('edit');
    setShowStudentModal(true);
  };

  const handleDeleteStudent = (studentId: string) => {
    if (confirm('¿Estás seguro de que deseas eliminar este postulante?')) {
      setStudents(prev => prev.filter(student => student.id !== studentId));
    }
  };

  const handleSaveStudent = (studentData: Partial<Student>) => {
    if (modalMode === 'create') {
      const newStudent: Student = {
        id: `student_${Date.now()}`,
        ...studentData as Student,
      };
      setStudents(prev => [...prev, newStudent]);

      // También crear el usuario correspondiente
      const newUser: User = {
        id: `user_${Date.now()}`,
        email: studentData.email!,
        name: studentData.name!,
        role: 'student',
      };
      setUsers(prev => [...prev, newUser]);

      alert('Postulante registrado exitosamente. Se ha creado su cuenta de acceso con la contraseña "123456".');
    } else if (editingStudent) {
      setStudents(prev => prev.map(student => 
        student.id === editingStudent.id 
          ? { ...student, ...studentData }
          : student
      ));

      // Actualizar también el usuario correspondiente
      setUsers(prev => prev.map(user => 
        user.email === editingStudent.email
          ? { ...user, email: studentData.email!, name: studentData.name! }
          : user
      ));
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Panel de Administración</h1>
          <p className="mt-2 text-gray-600">Sistema de Evaluación Paralela UNMSM</p>
        </div>
        <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center">
          <Settings className="h-4 w-4 mr-2" />
          Configuración
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => {
          const IconComponent = stat.icon;
          return (
            <div key={stat.name} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`p-3 rounded-lg ${stat.color} text-white`}>
                    <IconComponent className="h-6 w-6" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                </div>
                <div className={`text-sm font-medium ${stat.change.startsWith('+') ? 'text-green-600' : stat.change.startsWith('-') ? 'text-red-600' : 'text-gray-500'}`}>
                  {stat.change}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-4 px-6 border-b-2 font-medium text-sm ${
                activeTab === 'overview'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Vista General
            </button>
            <button
              onClick={() => setActiveTab('students')}
              className={`py-4 px-6 border-b-2 font-medium text-sm ${
                activeTab === 'students'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Postulantes ({students.length})
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`py-4 px-6 border-b-2 font-medium text-sm ${
                activeTab === 'users'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Usuarios ({users.length})
            </button>
            <button
              onClick={() => setActiveTab('system')}
              className={`py-4 px-6 border-b-2 font-medium text-sm ${
                activeTab === 'system'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Sistema
            </button>
            <button
              onClick={() => setActiveTab('monitoring')}
              className={`py-4 px-6 border-b-2 font-medium text-sm ${
                activeTab === 'monitoring'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Monitoreo
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Cpu className="h-5 w-5 mr-2" />
                    Procesamiento Paralelo OpenMP ({openmpConfig.numThreads} Hilos)
                  </h3>
                  <div className="space-y-3">
                    {systemMetrics.map((metric, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">{metric.name}</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${
                                metric.status === 'high' ? 'bg-red-500' : 'bg-green-500'
                              }`}
                              style={{ width: `${metric.usage}%` }}
                            ></div>
                          </div>
                          <span className={`text-sm font-medium ${
                            metric.status === 'high' ? 'text-red-600' : 'text-green-600'
                          }`}>
                            {metric.usage}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 pt-4 border-t border-purple-200">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">Configuración:</span>
                      <span className="text-purple-800 font-medium">
                        {openmpConfig.numThreads} hilos • {openmpConfig.schedulingStrategy}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h4 className="font-semibold text-gray-900 mb-4">Usuarios Activos Recientes</h4>
                  <div className="space-y-3">
                    {recentUsers.map((user, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                            <UserCheck className="h-4 w-4 text-gray-500" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{user.name}</p>
                            <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className={`inline-block w-2 h-2 rounded-full mr-2 ${
                            user.status === 'active' ? 'bg-green-400' : 'bg-gray-400'
                          }`}></span>
                          <span className="text-xs text-gray-500">{user.lastLogin}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Resumen por Áreas */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-4">Postulantes por Área</h4>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  {EXAM_AREAS.map((area) => {
                    const areaStudents = students.filter(s => s.area === area.code);
                    const admitted = areaStudents.filter(s => s.isAdmitted).length;
                    
                    return (
                      <div key={area.code} className="bg-gray-50 rounded-lg p-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-600 mb-1">
                            {areaStudents.length}
                          </div>
                          <div className="text-sm font-medium text-gray-900 mb-1">
                            Área {area.code}
                          </div>
                          <div className="text-xs text-gray-600 mb-2">
                            {area.name}
                          </div>
                          <div className="text-xs text-green-600">
                            {admitted} ingresantes
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'students' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h3 className="text-lg font-semibold text-gray-900">Gestión de Postulantes</h3>
                <div className="flex flex-wrap gap-2">
                  <button 
                    onClick={handleExportData}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Exportar PDF
                  </button>
                  <button 
                    onClick={handleCreateStudent}
                    className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center"
                  >
                    <UserPlus className="h-4 w-4 mr-2" />
                    Agregar Postulante
                  </button>
                </div>
              </div>

              {/* Filtros */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Buscar por nombre, DNI o email..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  
                  <select
                    value={filterArea}
                    onChange={(e) => setFilterArea(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="">Todas las áreas</option>
                    {EXAM_AREAS.map(area => (
                      <option key={area.code} value={area.code}>
                        {area.code} - {area.name}
                      </option>
                    ))}
                  </select>
                  
                  <select
                    value={filterCareer}
                    onChange={(e) => setFilterCareer(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="">Todas las carreras</option>
                    {careers.map(career => (
                      <option key={career} value={career}>{career}</option>
                    ))}
                  </select>

                  <select
                    value={filterAdmitted}
                    onChange={(e) => setFilterAdmitted(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="">Todos los estados</option>
                    <option value="admitted">Ingresantes</option>
                    <option value="not-admitted">No ingresantes</option>
                  </select>

                  <div className="flex items-center text-sm text-gray-600">
                    <Filter className="h-4 w-4 mr-2" />
                    {filteredStudents.length} de {students.length} postulantes
                  </div>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Postulante</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">DNI</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Área</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Carrera</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Puntaje</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ranking</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ingresante</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredStudents.map((student) => (
                      <tr 
                        key={student.id} 
                        className={student.isAdmitted ? 'bg-green-50 hover:bg-green-100' : 'hover:bg-gray-50'}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                              <UserCheck className="h-5 w-5 text-gray-500" />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{student.name}</div>
                              <div className="text-sm text-gray-500">{student.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {student.dni}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                            {getAreaName(student.area)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {student.career}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{student.totalScore.toFixed(2)}</div>
                          <div className="text-sm text-gray-500">/ 2000 puntos</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {student.admissionRank ? `#${student.admissionRank}` : 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            student.isAdmitted 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {student.isAdmitted ? 'Sí' : 'No'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50">
                              <Eye className="h-4 w-4" />
                            </button>
                            <button 
                              onClick={() => handleEditStudent(student)}
                              className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button 
                              onClick={() => handleDeleteStudent(student.id)}
                              className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {filteredStudents.length === 0 && (
                <div className="text-center py-12">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No se encontraron postulantes con los filtros aplicados</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'users' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">Gestión de Usuarios</h3>
                <button 
                  onClick={handleCreateUser}
                  className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center"
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Agregar Usuario
                </button>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usuario</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rol</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users.map((user) => (
                      <tr key={user.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                              <UserCheck className="h-4 w-4 text-gray-500" />
                            </div>
                            <div className="ml-3">
                              <div className="text-sm font-medium text-gray-900">{user.name}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{user.email}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            user.role === 'student' ? 'bg-blue-100 text-blue-800' :
                            user.role === 'teacher' ? 'bg-green-100 text-green-800' :
                            'bg-purple-100 text-purple-800'
                          }`}>
                            {user.role === 'student' ? 'Postulante' : user.role === 'teacher' ? 'Docente' : 'Admin'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Activo
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button 
                              onClick={() => handleEditUser(user)}
                              className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button 
                              onClick={() => handleDeleteUser(user.id)}
                              className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'system' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Configuración del Sistema</h3>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h4 className="font-semibold text-gray-900 mb-4">Configuración OpenMP</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Número de Threads</label>
                      <select 
                        value={openmpConfig.numThreads}
                        onChange={(e) => setOpenmpConfig(prev => ({
                          ...prev,
                          numThreads: parseInt(e.target.value)
                        }))}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      >
                        <option value={4}>4 (Recomendado)</option>
                        <option value={8}>8</option>
                        <option value={16}>16</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Estrategia de Balanceo</label>
                      <select 
                        value={openmpConfig.schedulingStrategy}
                        onChange={(e) => setOpenmpConfig(prev => ({
                          ...prev,
                          schedulingStrategy: e.target.value as 'static' | 'dynamic' | 'guided'
                        }))}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      >
                        <option value="dynamic">Dynamic</option>
                        <option value="static">Static</option>
                        <option value="guided">Guided</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h4 className="font-semibold text-gray-900 mb-4">Configuración de Exámenes</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Tiempo máximo por examen</label>
                      <input type="number" className="w-full border border-gray-300 rounded-lg px-3 py-2" defaultValue="180" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Preguntas por examen</label>
                      <input type="number" className="w-full border border-gray-300 rounded-lg px-3 py-2" defaultValue="100" readOnly />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Puntaje máximo</label>
                      <input type="number" className="w-full border border-gray-300 rounded-lg px-3 py-2" defaultValue="2000" readOnly />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'monitoring' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Monitoreo del Sistema</h3>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h4 className="font-semibold text-gray-900 mb-4">Rendimiento CPU</h4>
                  <div className="space-y-3">
                    <div className="text-center">
                      <p className="text-3xl font-bold text-blue-600">69%</p>
                      <p className="text-sm text-gray-500">Uso promedio</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h4 className="font-semibold text-gray-900 mb-4">Memoria RAM</h4>
                  <div className="space-y-3">
                    <div className="text-center">
                      <p className="text-3xl font-bold text-green-600">4.2GB</p>
                      <p className="text-sm text-gray-500">de 8GB usados</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h4 className="font-semibold text-gray-900 mb-4">Conexiones Activas</h4>
                  <div className="space-y-3">
                    <div className="text-center">
                      <p className="text-3xl font-bold text-purple-600">247</p>
                      <p className="text-sm text-gray-500">usuarios conectados</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal de Gestión de Usuarios */}
      <UserManagementModal
        isOpen={showUserModal}
        onClose={() => setShowUserModal(false)}
        onSave={handleSaveUser}
        editingUser={editingUser}
        mode={modalMode}
      />

      {/* Modal de Registro de Postulantes */}
      <StudentRegistrationModal
        isOpen={showStudentModal}
        onClose={() => setShowStudentModal(false)}
        onSave={handleSaveStudent}
        editingStudent={editingStudent}
        mode={modalMode}
      />
    </div>
  );
};

export default AdminDashboard;