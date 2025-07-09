import React, { useState } from 'react';
import { BookOpen, Clock, Award, TrendingUp, Play, CheckCircle, Calendar, User, FileText, AlertCircle } from 'lucide-react';
import { Exam, ExamResult, EXAM_AREAS } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import { getStudentProfileByEmail } from '../../database/students';
import { getAllExams } from '../../database/exams';
import ExamInterface from './ExamInterface';

export const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'available' | 'completed' | 'profile'>('available');
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);
  const [showExamInterface, setShowExamInterface] = useState(false);
  const [completedExams, setCompletedExams] = useState<ExamResult[]>([]);

  // Obtener información del estudiante basada en el usuario logueado
  const getStudentProfile = () => {

    return getStudentProfileByEmail(user?.email || '');
  };

  const studentProfile = getStudentProfile();
  const studentArea = EXAM_AREAS.find(area => area.code === studentProfile.area);

  // Mock data - exámenes disponibles (100 preguntas cada uno)
  const allExams = getAllExams();

  // Filtrar exámenes según el área del estudiante
  const availableExams = allExams.filter(exam => 
    exam.area === studentProfile.area && 
    !completedExams.some(completed => completed.examId === exam.id)
  );

  const stats = [
    {
      name: 'Área de Postulación',
      value: `${studentProfile.area} - ${studentArea?.name.split(',')[0]}`,
      icon: BookOpen,
      color: 'bg-blue-500',
    },
    {
      name: 'Exámenes Disponibles',
      value: availableExams.length,
      icon: CheckCircle,
      color: 'bg-green-500',
    },
    {
      name: 'Exámenes Completados',
      value: completedExams.length,
      icon: TrendingUp,
      color: 'bg-purple-500',
    },
    {
      name: 'Puntaje Máximo',
      value: '2000 pts',
      icon: Award,
      color: 'bg-yellow-500',
    },
  ];

  const handleStartExam = (exam: Exam) => {
    setSelectedExam(exam);
    setShowExamInterface(true);
  };

  const handleExamComplete = (answers: Record<string, string>) => {
    console.log('Examen completado:', answers);
    
    // Crear un nuevo resultado con estado pendiente
    const newResult: ExamResult = {
      id: `result_${Date.now()}`,
      examId: selectedExam?.id || '',
      studentId: user?.id || '1',
      studentName: studentProfile.name,
      answerString: Object.values(answers).join(''),
      correctAnswers: selectedExam?.correctAnswers || '',
      score: 0, // No calculado aún
      totalPoints: 2000,
      percentage: 0, // No calculado aún
      completedAt: new Date(),
      timeSpent: 165, // Simulado
      correctCount: 0,
      incorrectCount: 0,
      blankCount: 0,
      totalQuestions: 100,
      processingTime: 0,
      status: 'pending',
    };

    // Agregar a la lista de exámenes completados
    setCompletedExams(prev => [...prev, newResult]);
    
    setShowExamInterface(false);
    setSelectedExam(null);
    
    // Mostrar mensaje de confirmación
    alert('Examen enviado correctamente. Tu resultado estará disponible una vez que sea evaluado por el administrador.');
  };

  const handleExamExit = () => {
    setShowExamInterface(false);
    setSelectedExam(null);
  };

  if (showExamInterface && selectedExam) {
    return (
      <ExamInterface
        exam={selectedExam}
        onComplete={handleExamComplete}
        onExit={handleExamExit}
      />
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Panel del Postulante</h1>
        <p className="mt-2 text-gray-600">
          Bienvenido {studentProfile.name} - Postulante a {studentProfile.career}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => {
          const IconComponent = stat.icon;
          return (
            <div key={stat.name} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className={`p-3 rounded-lg ${stat.color} text-white`}>
                  <IconComponent className="h-6 w-6" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                  <p className="text-lg font-bold text-gray-900">{stat.value}</p>
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
              onClick={() => setActiveTab('available')}
              className={`py-4 px-6 border-b-2 font-medium text-sm ${
                activeTab === 'available'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Exámenes Disponibles
            </button>
            <button
              onClick={() => setActiveTab('completed')}
              className={`py-4 px-6 border-b-2 font-medium text-sm ${
                activeTab === 'completed'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Exámenes Completados ({completedExams.length})
            </button>
            <button
              onClick={() => setActiveTab('profile')}
              className={`py-4 px-6 border-b-2 font-medium text-sm ${
                activeTab === 'profile'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Mi Perfil
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'available' && (
            <div className="space-y-4">
              {availableExams.length > 0 ? (
                <>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                    <h4 className="font-semibold text-blue-900 mb-2">Información Importante</h4>
                    <div className="text-blue-800 text-sm space-y-1">
                      <p>• Como postulante a <strong>{studentProfile.career}</strong>, solo puedes rendir el examen del <strong>Área {studentProfile.area}</strong>.</p>
                      <p>• El examen consta de <strong>100 preguntas</strong> con un puntaje máximo de <strong>2000 puntos</strong>.</p>
                      <p>• Tienes <strong>un solo intento</strong> para completar el examen.</p>
                      <p>• Una vez enviado, tu resultado estará <strong>pendiente hasta ser evaluado</strong> por el administrador.</p>
                    </div>
                  </div>
                  
                  {availableExams.map((exam) => (
                    <div key={exam.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">{exam.title}</h3>
                            <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                              Disponible
                            </span>
                          </div>
                          <p className="text-gray-600 mt-1">{exam.description}</p>
                          <div className="flex items-center space-x-4 mt-3 text-sm text-gray-500">
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 mr-1" />
                              {exam.duration} min
                            </div>
                            <div className="flex items-center">
                              <Award className="h-4 w-4 mr-1" />
                              {exam.totalPoints} pts máx
                            </div>
                            <div className="flex items-center">
                              <FileText className="h-4 w-4 mr-1" />
                              {exam.correctAnswers.length} preguntas
                            </div>
                            <div className="text-red-600 font-medium">
                              Solo 1 intento
                            </div>
                          </div>
                        </div>
                        <button 
                          onClick={() => handleStartExam(exam)}
                          className="ml-4 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                        >
                          <Play className="h-4 w-4 mr-2" />
                          Iniciar Examen
                        </button>
                      </div>
                    </div>
                  ))}
                </>
              ) : (
                <div className="text-center py-12">
                  <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">
                    {completedExams.length > 0 
                      ? 'Ya has completado el examen de tu área'
                      : 'No hay exámenes disponibles para tu área de postulación'
                    }
                  </p>
                  <p className="text-sm text-gray-400 mt-2">Área: {studentProfile.area} - {studentArea?.name}</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'completed' && (
            <div className="space-y-4">
              {completedExams.length > 0 ? (
                completedExams.map((result) => (
                  <div key={result.id} className="border border-gray-200 rounded-lg p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {allExams.find(e => e.id === result.examId)?.title || 'Examen Completado'}
                        </h3>
                        <p className="text-gray-600 mt-1">Completado el {result.completedAt.toLocaleDateString()}</p>
                        
                        {result.status === 'pending' ? (
                          <div className="flex items-center space-x-2 mt-3">
                            <AlertCircle className="h-5 w-5 text-yellow-600" />
                            <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                              Esperando Calificación
                            </span>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-4 mt-3 text-sm">
                            <div className="flex items-center text-green-600">
                              <CheckCircle className="h-4 w-4 mr-1" />
                              {result.correctCount} correctas
                            </div>
                            <div className="text-red-600">
                              {result.incorrectCount} incorrectas
                            </div>
                            <div className="text-gray-500">
                              {result.blankCount} en blanco
                            </div>
                            <div className="text-gray-500">
                              Tiempo: {result.timeSpent} min
                            </div>
                          </div>
                        )}
                      </div>
                      
                      {result.status === 'pending' ? (
                        <div className="text-right">
                          <div className="text-2xl font-bold text-yellow-600">
                            PENDIENTE
                          </div>
                          <div className="text-sm text-gray-500">
                            Esperando evaluación
                          </div>
                        </div>
                      ) : (
                        <div className="text-right">
                          <div className={`text-3xl font-bold ${
                            result.percentage >= 80 ? 'text-green-600' :
                            result.percentage >= 60 ? 'text-yellow-600' : 'text-red-600'
                          }`}>
                            {result.percentage.toFixed(1)}%
                          </div>
                          <div className="text-sm text-gray-500">
                            {result.score.toFixed(2)}/{result.totalPoints} pts
                          </div>
                        </div>
                      )}
                    </div>

                    {result.status === 'pending' ? (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <h4 className="font-medium text-yellow-900 mb-2">Estado del Examen</h4>
                        <p className="text-yellow-800 text-sm">
                          Tu examen ha sido enviado correctamente y está en cola para ser evaluado. 
                          Los resultados aparecerán aquí una vez que el administrador complete la evaluación paralela.
                        </p>
                        <div className="mt-3 text-xs text-yellow-700">
                          <p><strong>Respuestas enviadas:</strong> {result.answerString.length} de 100 preguntas</p>
                          <p><strong>Fecha de envío:</strong> {result.completedAt.toLocaleString()}</p>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 mb-2">Análisis de Respuestas</h4>
                        <div className="flex flex-wrap gap-1">
                          {result.answerString.split('').map((answer, index) => {
                            const correct = result.correctAnswers[index];
                            const isCorrect = answer === correct;
                            const isBlank = answer === 'X';
                            
                            return (
                              <div
                                key={index}
                                className={`w-8 h-8 rounded flex items-center justify-center text-xs font-bold ${
                                  isBlank
                                    ? 'bg-gray-300 text-gray-600'
                                    : isCorrect
                                    ? 'bg-green-500 text-white'
                                    : 'bg-red-500 text-white'
                                }`}
                                title={`P${index + 1}: ${answer} ${isBlank ? '(En blanco)' : isCorrect ? '(Correcta)' : `(Incorrecta, correcta: ${correct})`}`}
                              >
                                {answer}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <CheckCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Aún no has completado ningún examen</p>
                  <p className="text-sm text-gray-400 mt-2">
                    Dirígete a la pestaña "Exámenes Disponibles" para rendir tu examen de admisión
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="max-w-4xl">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center space-x-3 mb-6">
                    <User className="h-6 w-6 text-blue-600" />
                    <h3 className="text-lg font-semibold text-gray-900">Información Personal</h3>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Nombre Completo</label>
                      <p className="text-gray-900">{studentProfile.name}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">DNI</label>
                      <p className="text-gray-900">{studentProfile.dni}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <p className="text-gray-900">{user?.email}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                      <p className="text-gray-900">{studentProfile.phone}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
                      <p className="text-gray-900">{studentProfile.address}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Nacimiento</label>
                      <p className="text-gray-900">{studentProfile.birthDate.toLocaleDateString()}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Colegio de Procedencia</label>
                      <p className="text-gray-900">{studentProfile.school}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center space-x-3 mb-6">
                    <BookOpen className="h-6 w-6 text-green-600" />
                    <h3 className="text-lg font-semibold text-gray-900">Información Académica</h3>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Carrera Postulada</label>
                      <p className="text-gray-900 font-medium">{studentProfile.career}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Área de Examen</label>
                      <p className="text-gray-900">{studentProfile.area} - {studentArea?.name}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                        Postulante Activo
                      </span>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Exámenes Disponibles</label>
                      <p className="text-gray-900">{availableExams.length}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Exámenes Completados</label>
                      <p className="text-gray-900">{completedExams.length}</p>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-2 bg-white border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center space-x-3 mb-6">
                    <TrendingUp className="h-6 w-6 text-purple-600" />
                    <h3 className="text-lg font-semibold text-gray-900">Información del Proceso</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-600 mb-2">
                        {availableExams.length}
                      </div>
                      <div className="text-sm text-gray-600">Exámenes Disponibles</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600 mb-2">
                        {completedExams.length}
                      </div>
                      <div className="text-sm text-gray-600">Exámenes Completados</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-purple-600 mb-2">
                        100
                      </div>
                      <div className="text-sm text-gray-600">Preguntas por Examen</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-yellow-600 mb-2">
                        2000
                      </div>
                      <div className="text-sm text-gray-600">Puntos Máximos</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};