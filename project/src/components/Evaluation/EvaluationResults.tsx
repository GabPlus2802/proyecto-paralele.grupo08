import React from 'react';
import { CheckCircle, XCircle, Minus, Award, Clock, Target } from 'lucide-react';
import { ExamResult } from '../../types';

interface EvaluationResultsProps {
  results: ExamResult[];
  isLoading: boolean;
}

const EvaluationResults: React.FC<EvaluationResultsProps> = ({ results, isLoading }) => {
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Procesando resultados con OpenMP...</p>
        </div>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="text-center">
          <Award className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No hay resultados para mostrar</p>
        </div>
      </div>
    );
  }

  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (percentage: number) => {
    if (percentage >= 80) return 'bg-green-50 border-green-200';
    if (percentage >= 60) return 'bg-yellow-50 border-yellow-200';
    return 'bg-red-50 border-red-200';
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">
          Resultados de Evaluación ({results.length} exámenes)
        </h3>
        <div className="text-sm text-gray-500">
          Procesamiento promedio: {(results.reduce((sum, r) => sum + r.processingTime, 0) / results.length).toFixed(0)}ms
        </div>
      </div>

      <div className="grid gap-4">
        {results.map((result) => (
          <div key={result.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <h4 className="text-lg font-semibold text-gray-900">{result.studentName}</h4>
                <p className="text-sm text-gray-600">Examen ID: {result.examId}</p>
                <p className="text-xs text-gray-500">
                  Procesado en {result.processingTime}ms • {result.completedAt.toLocaleString()}
                </p>
              </div>
              <div className={`px-4 py-2 rounded-lg border ${getScoreBgColor(result.percentage)}`}>
                <div className="text-center">
                  <div className={`text-2xl font-bold ${getScoreColor(result.percentage)}`}>
                    {result.percentage.toFixed(1)}%
                  </div>
                  <div className="text-sm text-gray-600">
                    {result.score.toFixed(2)}/{result.totalPoints} pts
                  </div>
                </div>
              </div>
            </div>

            {/* Análisis de Respuestas */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-4">
              <div>
                <h5 className="font-medium text-gray-900 mb-3">Cadena de Respuestas</h5>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm text-gray-600">Estudiante: </span>
                    <div className="mt-1 p-3 bg-gray-100 rounded-lg border">
                      <div className="font-mono text-xs leading-relaxed break-all">
                        {result.answerString.match(/.{1,20}/g)?.map((chunk, index) => (
                          <div key={index} className="mb-1">
                            <span className="text-gray-500 mr-2">{(index * 20 + 1).toString().padStart(3, '0')}-{Math.min((index + 1) * 20, result.answerString.length).toString().padStart(3, '0')}:</span>
                            <span className="text-gray-900">{chunk}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Correctas: </span>
                    <div className="mt-1 p-3 bg-green-100 rounded-lg border border-green-200">
                      <div className="font-mono text-xs leading-relaxed break-all text-green-800">
                        {result.correctAnswers.match(/.{1,20}/g)?.map((chunk, index) => (
                          <div key={index} className="mb-1">
                            <span className="text-green-600 mr-2">{(index * 20 + 1).toString().padStart(3, '0')}-{Math.min((index + 1) * 20, result.correctAnswers.length).toString().padStart(3, '0')}:</span>
                            <span className="text-green-800">{chunk}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h5 className="font-medium text-gray-900 mb-3">Estadísticas</h5>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-1">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-1" />
                      <span className="text-sm font-medium text-green-600">Correctas</span>
                    </div>
                    <div className="text-lg font-bold text-gray-900">{result.correctCount}</div>
                    <div className="text-xs text-gray-500">+{result.correctCount * 20} pts</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-1">
                      <XCircle className="h-4 w-4 text-red-600 mr-1" />
                      <span className="text-sm font-medium text-red-600">Incorrectas</span>
                    </div>
                    <div className="text-lg font-bold text-gray-900">{result.incorrectCount}</div>
                    <div className="text-xs text-gray-500">-{(result.incorrectCount * 1.125).toFixed(2)} pts</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-1">
                      <Minus className="h-4 w-4 text-gray-600 mr-1" />
                      <span className="text-sm font-medium text-gray-600">En Blanco</span>
                    </div>
                    <div className="text-lg font-bold text-gray-900">{result.blankCount}</div>
                    <div className="text-xs text-gray-500">0 pts</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Visualización de Respuestas */}
            <div>
              <h5 className="font-medium text-gray-900 mb-3">Análisis por Pregunta</h5>
              <div className="grid grid-cols-10 sm:grid-cols-15 md:grid-cols-20 gap-1 max-h-40 overflow-y-auto p-2 bg-gray-50 rounded-lg border">
                {result.answerString.split('').map((answer, index) => {
                  const correct = result.correctAnswers[index];
                  const isCorrect = answer === correct;
                  const isBlank = answer === 'X';
                  
                  return (
                    <div
                      key={index}
                      className={`w-8 h-8 rounded border flex items-center justify-center text-xs font-bold ${
                        isBlank
                          ? 'bg-gray-100 border-gray-300 text-gray-500'
                          : isCorrect
                          ? 'bg-green-100 border-green-300 text-green-800'
                          : 'bg-red-100 border-red-300 text-red-800'
                      }`}
                      title={`Pregunta ${index + 1}: ${answer} ${isBlank ? '(En blanco)' : isCorrect ? '(Correcta)' : `(Incorrecta, correcta: ${correct})`}`}
                    >
                      {answer}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Información Adicional */}
            <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between text-sm text-gray-600">
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  Tiempo: {result.timeSpent} min
                </div>
                <div className="flex items-center">
                  <Target className="h-4 w-4 mr-1" />
                  {result.totalQuestions} preguntas
                </div>
              </div>
              <div className="text-xs">
                Evaluado con OpenMP
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EvaluationResults;