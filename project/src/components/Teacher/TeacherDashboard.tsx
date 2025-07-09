import React, { useState, useEffect } from 'react';
import { Plus, BookOpen, Users, BarChart3, Edit, Eye, Trash2, Play, Settings, FileText, Clock, CheckCircle } from 'lucide-react';
import { Exam, ExamAttempt, ExamResult, OpenMPConfig, EXAM_AREAS } from '../../types';
import { evaluationEngine } from '../../utils/openmpSimulator';
import { getAllExams, addExam, updateExam, deleteExam, toggleExamStatus } from '../../database/exams';
import { getPendingExamAttempts, removeProcessedAttempts } from '../../database/examAttempts';
import { addExamResults, getAllExamResults } from '../../database/examResults';
import OpenMPMonitor from '../Evaluation/OpenMPMonitor';
import EvaluationResults from '../Evaluation/EvaluationResults';
import ExamCreator from './ExamCreator';
import ExamDetailsModal from './ExamDetailsModal';

const TeacherDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'exams' | 'evaluation' | 'results' | 'config'>('exams');
  const [isProcessing, setIsProcessing] = useState(false);
  const [evaluationResults, setEvaluationResults] = useState<ExamResult[]>([]);
  const [showExamCreator, setShowExamCreator] = useState(false);
  const [editingExam, setEditingExam] = useState<Exam | undefined>();
  const [selectedExamDetails, setSelectedExamDetails] = useState<Exam | null>(null);
  const [exams, setExams] = useState<Exam[]>(getAllExams());
  const [pendingExams, setPendingExams] = useState<ExamAttempt[]>(getPendingExamAttempts());
  const [openmpConfig, setOpenmpConfig] = useState<OpenMPConfig>({
    numThreads: 4,
    schedulingStrategy: 'dynamic',
    chunkSize: 1,
  });

  // Inicializar datos desde la base de datos
  useEffect(() => {
    setExams(getAllExams());
    setPendingExams(getPendingExamAttempts());
    setEvaluationResults(getAllExamResults());
  }, []);

  const stats = [
    {
      name: 'Exámenes por Área',
      value: exams.length,
      icon: BookOpen,
      color: 'bg-blue-500',
    },
    {
      name: 'Pendientes Evaluación',
      value: pendingExams.filter(e => e.status === 'pending').length,
      icon: Users,
      color: 'bg-orange-500',
    },
    {
      name: 'Evaluados Hoy',
      value: evaluationResults.length,
      icon: BarChart3,
      color: 'bg-green-500',
    },
    {
      name: 'Hilos OpenMP',
      value: openmpConfig.numThreads,
      icon: Settings,
      color: 'bg-purple-500',
    },
  ];

  const handleStartEvaluation = async () => {
    const pendingToEvaluate = pendingExams.filter(e => e.status === 'pending');
    if (pendingToEvaluate.length === 0) return;
    
    setIsProcessing(true);
    
    try {
      const results = await evaluationEngine.processExamsBatch(pendingToEvaluate);
      
      // Marcar resultados como evaluados
      const evaluatedResults = results.map(result => ({
        ...result,
        status: 'evaluated' as const
      }));
      
      setEvaluationResults(prev => [...prev, ...evaluatedResults]);
      
      // Remover los exámenes evaluados de la lista de pendientes
      const processedIds = pendingToEvaluate.map(e => e.id);
      removeProcessedAttempts(processedIds);
      addExamResults(evaluatedResults);
      setPendingExams(getPendingExamAttempts());
      
      console.log('Exámenes evaluados:', evaluatedResults);
      
    } catch (error) {
      console.error('Error durante la evaluación:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleConfigUpdate = (newConfig: OpenMPConfig) => {
    setOpenmpConfig(newConfig);
    evaluationEngine.updateConfig(newConfig);
  };

  const handleCreateExam = () => {
    setEditingExam(undefined);
    setShowExamCreator(true);
  };

  const handleEditExam = (exam: Exam) => {
    setEditingExam(exam);
    setShowExamCreator(true);
  };

  const handleViewExamDetails = (exam: Exam) => {
    setSelectedExamDetails(exam);
  };

  const handleSaveExam = (examData: Partial<Exam>) => {
    if (editingExam) {
      // Actualizar examen existente
      updateExam(editingExam.id, examData);
    } else {
      // Crear nuevo examen
      const newExam: Exam = {
        id: `exam_${Date.now()}`,
        createdBy: '2', // ID del docente actual
        createdAt: new Date(),
        isActive: true,
        area: 'A', // Por defecto, debería seleccionarse en el creator
        ...examData as Exam,
      };
      addExam(newExam);
    }
    setExams(getAllExams());
    setShowExamCreator(false);
    setEditingExam(undefined);
  };

  const handleDeleteExam = (examId: string) => {
    if (confirm('¿Estás seguro de que deseas eliminar este examen?')) {
      deleteExam(examId);
      setExams(getAllExams());
    }
  };

  const handleToggleExamStatus = (examId: string) => {
    toggleExamStatus(examId);
    setExams(getAllExams());
  };

  if (showExamCreator) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ExamCreator
          onSave={handleSaveExam}
          onCancel={() => {
            setShowExamCreator(false);
            setEditingExam(undefined);
          }}
          editingExam={editingExam}
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Panel del Docente</h1>
          <p className="mt-2 text-gray-600">Gestiona exámenes y evaluación paralela con OpenMP</p>
        </div>
        <button 
          onClick={handleCreateExam}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Crear Examen
        </button>
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
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
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
              onClick={() => setActiveTab('exams')}
              className={`py-4 px-6 border-b-2 font-medium text-sm ${
                activeTab === 'exams'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Exámenes por Área
            </button>
            <button
              onClick={() => setActiveTab('evaluation')}
              className={`py-4 px-6 border-b-2 font-medium text-sm ${
                activeTab === 'evaluation'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Evaluación OpenMP
            </button>
            <button
              onClick={() => setActiveTab('results')}
              className={`py-4 px-6 border-b-2 font-medium text-sm ${
                activeTab === 'results'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Resultados ({evaluationResults.length})
            </button>
            <button
              onClick={() => setActiveTab('config')}
              className={`py-4 px-6 border-b-2 font-medium text-sm ${
                activeTab === 'config'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Configuración
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'exams' && (
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <h4 className="font-semibold text-blue-900 mb-2">Sistema de Exámenes UNMSM</h4>
                <p className="text-blue-800 text-sm">
                  Cada área tiene su propio examen de 100 preguntas con un puntaje máximo de 2000 puntos. 
                  Los estudiantes solo pueden rendir el examen correspondiente a su área de postulación.
                </p>
              </div>

              {exams.map((exam) => (
                <div key={exam.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{exam.title}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          exam.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {exam.isActive ? 'Activo' : 'Inactivo'}
                        </span>
                        <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">
                          Área {exam.area}
                        </span>
                      </div>
                      <p className="text-gray-600">{exam.description}</p>
                      <div className="flex items-center space-x-4 mt-3 text-sm text-gray-500">
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {exam.duration} min
                        </div>
                        <div className="flex items-center">
                          <FileText className="h-4 w-4 mr-1" />
                          100 preguntas
                        </div>
                        <div>Puntos: {exam.totalPoints}</div>
                        <div>Creado: {exam.createdAt.toLocaleDateString()}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      <button 
                        onClick={() => handleToggleExamStatus(exam.id)}
                        className={`p-2 rounded-lg transition-colors ${
                          exam.isActive 
                            ? 'text-yellow-600 hover:bg-yellow-50' 
                            : 'text-green-600 hover:bg-green-50'
                        }`}
                        title={exam.isActive ? 'Desactivar' : 'Activar'}
                      >
                        <Play className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => handleViewExamDetails(exam)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Ver detalles"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => handleEditExam(exam)}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="Editar"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => handleDeleteExam(exam.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Eliminar"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              
              {exams.length === 0 && (
                <div className="text-center py-12">
                  <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 mb-4">No hay exámenes configurados</p>
                  <button 
                    onClick={handleCreateExam}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Crear examen para un área
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'evaluation' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Evaluación Paralela con OpenMP</h3>
                  <p className="text-gray-600">
                    {pendingExams.filter(e => e.status === 'pending').length} exámenes pendientes de evaluación
                  </p>
                </div>
                <button
                  onClick={handleStartEvaluation}
                  disabled={isProcessing || pendingExams.filter(e => e.status === 'pending').length === 0}
                  className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Play className="h-4 w-4 mr-2" />
                  {isProcessing ? 'Evaluando...' : 'Iniciar Evaluación Paralela'}
                </button>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 className="font-semibold text-yellow-900 mb-2">Proceso de Evaluación</h4>
                <p className="text-yellow-800 text-sm">
                  Al hacer clic en "Iniciar Evaluación Paralela", todos los exámenes pendientes serán procesados 
                  simultáneamente usando OpenMP. Los resultados aparecerán automáticamente para los estudiantes 
                  una vez completada la evaluación.
                </p>
              </div>

              <OpenMPMonitor isProcessing={isProcessing} />

              {/* Lista de Exámenes Pendientes */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-4">Exámenes Pendientes de Evaluación</h4>
                <div className="space-y-3">
                  {pendingExams.filter(e => e.status === 'pending').map((exam) => (
                    <div key={exam.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{exam.studentName}</p>
                        <p className="text-sm text-gray-600">
                          Área: {exam.examId.split('_')[1]} • Completado: {exam.endTime?.toLocaleString()}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Respuestas: 
                          <span className="font-mono ml-1 bg-white px-2 py-1 rounded text-xs">
                            {exam.answerString.substring(0, 20)}...
                          </span>
                          (100 preguntas)
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          Pendiente
                        </span>
                      </div>
                    </div>
                  ))}
                  
                  {pendingExams.filter(e => e.status === 'pending').length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <CheckCircle className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                      <p>No hay exámenes pendientes de evaluación</p>
                      <p className="text-sm mt-1">Todos los exámenes han sido procesados</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'results' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">Resultados de Exámenes Evaluados</h3>
                <div className="text-sm text-gray-500">
                  {evaluationResults.length} exámenes evaluados
                </div>
              </div>
              
              {evaluationResults.length > 0 ? (
                <EvaluationResults results={evaluationResults} isLoading={isProcessing} />
              ) : (
                <div className="text-center py-12">
                  <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No hay resultados de evaluación disponibles</p>
                  <p className="text-sm text-gray-400 mt-2">
                    Los resultados aparecerán aquí después de ejecutar la evaluación paralela
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'config' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Configuración OpenMP</h3>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h4 className="font-semibold text-gray-900 mb-4">Parámetros de Procesamiento</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Número de Hilos (Threads)
                      </label>
                      <select 
                        value={openmpConfig.numThreads}
                        onChange={(e) => handleConfigUpdate({
                          ...openmpConfig,
                          numThreads: parseInt(e.target.value)
                        })}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      >
                        <option value={2}>2 Hilos</option>
                        <option value={4}>4 Hilos (Recomendado)</option>
                        <option value={8}>8 Hilos</option>
                        <option value={16}>16 Hilos</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Estrategia de Scheduling
                      </label>
                      <select 
                        value={openmpConfig.schedulingStrategy}
                        onChange={(e) => handleConfigUpdate({
                          ...openmpConfig,
                          schedulingStrategy: e.target.value as 'static' | 'dynamic' | 'guided'
                        })}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      >
                        <option value="static">Static - Distribución fija</option>
                        <option value="dynamic">Dynamic - Distribución dinámica</option>
                        <option value="guided">Guided - Distribución guiada</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Chunk Size
                      </label>
                      <input 
                        type="number" 
                        value={openmpConfig.chunkSize}
                        onChange={(e) => handleConfigUpdate({
                          ...openmpConfig,
                          chunkSize: parseInt(e.target.value)
                        })}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2" 
                        min="1" 
                        max="10"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h4 className="font-semibold text-gray-900 mb-4">Sistema de Puntuación</h4>
                  <div className="space-y-4">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex items-center mb-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                        <span className="font-medium text-green-800">Respuesta Correcta</span>
                      </div>
                      <p className="text-sm text-green-700">+20 puntos</p>
                    </div>
                    
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <div className="flex items-center mb-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                        <span className="font-medium text-red-800">Respuesta Incorrecta</span>
                      </div>
                      <p className="text-sm text-red-700">-1.125 puntos</p>
                    </div>
                    
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center mb-2">
                        <div className="w-3 h-3 bg-gray-500 rounded-full mr-2"></div>
                        <span className="font-medium text-gray-800">Respuesta en Blanco (X)</span>
                      </div>
                      <p className="text-sm text-gray-700">0 puntos</p>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-sm text-gray-600">
                      <strong>Exámenes:</strong> 100 preguntas por área con puntaje máximo de 2000 puntos. 
                      Cada respuesta en blanco o marcada múltiples veces se registra como "X".
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal de Detalles del Examen */}
      {selectedExamDetails && (
        <ExamDetailsModal
          exam={selectedExamDetails}
          onClose={() => setSelectedExamDetails(null)}
        />
      )}
    </div>
  );
};

export default TeacherDashboard;