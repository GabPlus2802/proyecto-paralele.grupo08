import React from 'react';
import { X, Clock, Award, FileText, Users, Calendar, CheckCircle } from 'lucide-react';
import { Exam, EXAM_AREAS } from '../../types';

interface ExamDetailsModalProps {
  exam: Exam;
  onClose: () => void;
}

const ExamDetailsModal: React.FC<ExamDetailsModalProps> = ({ exam, onClose }) => {
  const area = EXAM_AREAS.find(a => a.code === exam.area);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900">Detalles del Examen</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          {/* Información General */}
          <div className="mb-8">
            <div className="flex items-center space-x-2 mb-4">
              <h3 className="text-2xl font-bold text-gray-900">{exam.title}</h3>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                exam.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
              }`}>
                {exam.isActive ? 'Activo' : 'Inactivo'}
              </span>
              <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                Área {exam.area}
              </span>
            </div>
            <p className="text-gray-600 text-lg mb-6">{exam.description}</p>

            {/* Estadísticas del Examen */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-blue-50 rounded-lg p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <Clock className="h-6 w-6 text-blue-600" />
                </div>
                <div className="text-2xl font-bold text-blue-600">{exam.duration}</div>
                <div className="text-sm text-blue-800">Minutos</div>
              </div>
              
              <div className="bg-green-50 rounded-lg p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <FileText className="h-6 w-6 text-green-600" />
                </div>
                <div className="text-2xl font-bold text-green-600">100</div>
                <div className="text-sm text-green-800">Preguntas</div>
              </div>
              
              <div className="bg-yellow-50 rounded-lg p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <Award className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="text-2xl font-bold text-yellow-600">{exam.totalPoints}</div>
                <div className="text-sm text-yellow-800">Puntos Máx</div>
              </div>
              
              <div className="bg-purple-50 rounded-lg p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
                <div className="text-2xl font-bold text-purple-600">{exam.allowedAttempts}</div>
                <div className="text-sm text-purple-800">Intentos</div>
              </div>
            </div>
          </div>

          {/* Información del Área */}
          {area && (
            <div className="mb-8">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Información del Área</h4>
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h5 className="font-medium text-gray-900 mb-2">Área {area.code}: {area.name}</h5>
                    <p className="text-gray-600 text-sm mb-4">{area.description}</p>
                  </div>
                  <div>
                    <h5 className="font-medium text-gray-900 mb-2">Carreras Incluidas</h5>
                    <div className="space-y-1">
                      {area.careers.map((career, index) => (
                        <div key={index} className="flex items-center text-sm text-gray-600">
                          <CheckCircle className="h-3 w-3 text-green-500 mr-2" />
                          {career}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Sistema de Puntuación */}
          <div className="mb-8">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Sistema de Puntuación</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                  <span className="font-medium text-gray-800">Respuesta en Blanco</span>
                </div>
                <p className="text-sm text-gray-700">0 puntos</p>
              </div>
            </div>
          </div>

          {/* Información Adicional */}
          <div className="border-t border-gray-200 pt-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Información Adicional</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="space-y-3">
                  <div className="flex items-center text-sm">
                    <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-gray-600">Creado:</span>
                    <span className="ml-2 text-gray-900">{exam.createdAt.toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Users className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-gray-600">Creado por:</span>
                    <span className="ml-2 text-gray-900">Docente ID: {exam.createdBy}</span>
                  </div>
                </div>
              </div>
              <div>
                <div className="space-y-3">
                  <div className="flex items-center text-sm">
                    <FileText className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-gray-600">ID del Examen:</span>
                    <span className="ml-2 text-gray-900 font-mono">{exam.id}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <CheckCircle className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-gray-600">Respuestas Correctas:</span>
                    <span className="ml-2 text-gray-900 font-mono">
                      {exam.correctAnswers.substring(0, 10)}...
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Instrucciones para Estudiantes */}
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h4 className="font-semibold text-blue-900 mb-3">Instrucciones para Estudiantes</h4>
            <div className="text-blue-800 text-sm space-y-2">
              <p>• Solo los estudiantes postulantes al Área {exam.area} pueden rendir este examen.</p>
              <p>• El examen tiene una duración de {exam.duration} minutos y consta de 100 preguntas.</p>
              <p>• Cada estudiante tiene {exam.allowedAttempts} intento{exam.allowedAttempts > 1 ? 's' : ''} para completar el examen.</p>
              <p>• Las respuestas en blanco no suman ni restan puntos.</p>
              <p>• Los resultados estarán disponibles después de la evaluación paralela del administrador.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamDetailsModal;