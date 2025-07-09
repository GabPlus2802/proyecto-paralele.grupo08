import React, { useState, useEffect } from 'react';
import { Clock, ChevronLeft, ChevronRight, Flag, AlertTriangle, CheckCircle } from 'lucide-react';
import { Exam, ExamSession } from '../../types';

interface ExamInterfaceProps {
  exam: Exam;
  onComplete: (answers: Record<string, string>) => void;
  onExit: () => void;
}

const ExamInterface: React.FC<ExamInterfaceProps> = ({ exam, onComplete, onExit }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeRemaining, setTimeRemaining] = useState(exam.duration * 60); // en segundos
  const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);
  const [flaggedQuestions, setFlaggedQuestions] = useState<Set<number>>(new Set());

  // Mock questions para 100 preguntas
  const questions = Array.from({ length: 100 }, (_, i) => ({
    id: `q${i + 1}`,
    text: `Pregunta ${i + 1}: ¿Cuál es la respuesta correcta para esta pregunta de ejemplo del examen de admisión UNMSM área ${exam.area}?`,
    options: [
      'Opción A - Primera alternativa de respuesta',
      'Opción B - Segunda alternativa de respuesta', 
      'Opción C - Tercera alternativa de respuesta',
      'Opción D - Cuarta alternativa de respuesta',
      'Opción E - Quinta alternativa de respuesta'
    ],
    correctAnswer: Math.floor(Math.random() * 5),
    subject: i < 20 ? 'Matemáticas' : i < 40 ? 'Comunicación' : i < 60 ? 'Ciencias' : i < 80 ? 'Historia' : 'Razonamiento',
    difficulty: 'medium' as const,
    points: 20
  }));

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswerSelect = (questionIndex: number, answer: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionIndex]: answer
    }));
  };

  const toggleFlag = (questionIndex: number) => {
    setFlaggedQuestions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(questionIndex)) {
        newSet.delete(questionIndex);
      } else {
        newSet.add(questionIndex);
      }
      return newSet;
    });
  };

  const handleSubmit = () => {
    // Convertir respuestas a cadena de caracteres de 100 posiciones
    const answerString = Array.from({ length: 100 }, (_, i) => {
      const answer = answers[i];
      return answer || 'X'; // X para respuestas en blanco
    });

    // Crear objeto de respuestas para enviar
    const finalAnswers: Record<string, string> = {};
    answerString.forEach((answer, index) => {
      finalAnswers[index.toString()] = answer;
    });

    onComplete(finalAnswers);
  };

  const getAnsweredCount = () => {
    return Object.keys(answers).length;
  };

  const getQuestionStatus = (index: number) => {
    if (answers[index]) return 'answered';
    if (flaggedQuestions.has(index)) return 'flagged';
    return 'unanswered';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'answered': return 'bg-green-500 text-white';
      case 'flagged': return 'bg-yellow-500 text-white';
      default: return 'bg-gray-200 text-gray-700 hover:bg-gray-300';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div>
              <h1 className="text-xl font-bold text-gray-900">{exam.title}</h1>
              <p className="text-sm text-gray-600">Pregunta {currentQuestion + 1} de {questions.length}</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className={`flex items-center space-x-2 px-3 py-1 rounded-lg ${
                timeRemaining < 600 ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
              }`}>
                <Clock className="h-4 w-4" />
                <span className="font-mono font-bold">{formatTime(timeRemaining)}</span>
              </div>
              <button
                onClick={() => setShowConfirmSubmit(true)}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                Finalizar Examen
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Panel de Navegación */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-24">
              <h3 className="font-semibold text-gray-900 mb-4">Navegación</h3>
              <div className="grid grid-cols-5 gap-2 mb-6">
                {questions.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentQuestion(index)}
                    className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
                      currentQuestion === index 
                        ? 'bg-blue-600 text-white' 
                        : getStatusColor(getQuestionStatus(index))
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
              
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Respondidas:</span>
                  <span className="font-medium text-green-600">{getAnsweredCount()}/{questions.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Marcadas:</span>
                  <span className="font-medium text-yellow-600">{flaggedQuestions.size}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Sin responder:</span>
                  <span className="font-medium text-gray-600">{questions.length - getAnsweredCount()}</span>
                </div>
                <div className="pt-3 border-t border-gray-200">
                  <div className="text-xs text-gray-500">
                    Progreso: {((getAnsweredCount() / questions.length) * 100).toFixed(1)}%
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(getAnsweredCount() / questions.length) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Área de Pregunta */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
              <div className="flex justify-between items-start mb-6">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">
                      {questions[currentQuestion].subject}
                    </span>
                    <span className="text-sm text-gray-500">20 puntos</span>
                    <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs font-medium">
                      Área {exam.area}
                    </span>
                  </div>
                  <h2 className="text-lg font-medium text-gray-900 leading-relaxed">
                    {questions[currentQuestion].text}
                  </h2>
                </div>
                <button
                  onClick={() => toggleFlag(currentQuestion)}
                  className={`p-2 rounded-lg transition-colors ${
                    flaggedQuestions.has(currentQuestion)
                      ? 'bg-yellow-100 text-yellow-600'
                      : 'bg-gray-100 text-gray-400 hover:text-gray-600'
                  }`}
                >
                  <Flag className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-3 mb-8">
                {questions[currentQuestion].options.map((option, index) => {
                  const optionLetter = String.fromCharCode(65 + index); // A, B, C, D, E
                  const isSelected = answers[currentQuestion] === optionLetter;
                  
                  return (
                    <label
                      key={index}
                      className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        isSelected
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <input
                        type="radio"
                        name={`question-${currentQuestion}`}
                        value={optionLetter}
                        checked={isSelected}
                        onChange={() => handleAnswerSelect(currentQuestion, optionLetter)}
                        className="sr-only"
                      />
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mr-4 ${
                        isSelected ? 'border-blue-500 bg-blue-500' : 'border-gray-300'
                      }`}>
                        {isSelected && <div className="w-2 h-2 bg-white rounded-full"></div>}
                      </div>
                      <div className="flex-1">
                        <span className="font-medium text-gray-900 mr-2">{optionLetter})</span>
                        <span className="text-gray-700">{option}</span>
                      </div>
                    </label>
                  );
                })}
              </div>

              {/* Navegación */}
              <div className="flex justify-between items-center">
                <button
                  onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
                  disabled={currentQuestion === 0}
                  className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Anterior
                </button>

                <div className="text-sm text-gray-500">
                  Pregunta {currentQuestion + 1} de {questions.length}
                </div>

                <button
                  onClick={() => setCurrentQuestion(Math.min(questions.length - 1, currentQuestion + 1))}
                  disabled={currentQuestion === questions.length - 1}
                  className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Siguiente
                  <ChevronRight className="h-4 w-4 ml-1" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Confirmación */}
      {showConfirmSubmit && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center space-x-3 mb-4">
              <AlertTriangle className="h-6 w-6 text-yellow-600" />
              <h3 className="text-lg font-semibold text-gray-900">Confirmar Envío</h3>
            </div>
            
            <div className="mb-6">
              <p className="text-gray-600 mb-4">
                ¿Estás seguro de que deseas finalizar el examen? Una vez enviado no podrás modificar tus respuestas 
                y tu resultado estará pendiente hasta ser evaluado por el administrador.
              </p>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Respondidas:</span>
                    <span className="ml-2 font-medium text-green-600">{getAnsweredCount()}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Sin responder:</span>
                    <span className="ml-2 font-medium text-red-600">{questions.length - getAnsweredCount()}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Tiempo restante:</span>
                    <span className="ml-2 font-medium text-blue-600">{formatTime(timeRemaining)}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Marcadas:</span>
                    <span className="ml-2 font-medium text-yellow-600">{flaggedQuestions.size}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => setShowConfirmSubmit(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Continuar Examen
              </button>
              <button
                onClick={handleSubmit}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Finalizar Examen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExamInterface;