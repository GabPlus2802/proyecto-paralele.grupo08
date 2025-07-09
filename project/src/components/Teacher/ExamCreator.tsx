import React, { useState } from 'react';
import { Plus, Trash2, Save, Eye, ArrowLeft } from 'lucide-react';
import { Question, Exam } from '../../types';

interface ExamCreatorProps {
  onSave: (exam: Partial<Exam>) => void;
  onCancel: () => void;
  editingExam?: Exam;
}

const ExamCreator: React.FC<ExamCreatorProps> = ({ onSave, onCancel, editingExam }) => {
  const [examData, setExamData] = useState({
    title: editingExam?.title || '',
    description: editingExam?.description || '',
    duration: editingExam?.duration || 180,
    allowedAttempts: editingExam?.allowedAttempts || 2,
  });

  const [questions, setQuestions] = useState<Question[]>(editingExam?.questions || []);
  const [currentQuestion, setCurrentQuestion] = useState<Partial<Question>>({
    text: '',
    options: ['', '', '', '', ''],
    correctAnswer: 0,
    subject: '',
    difficulty: 'medium',
    points: 20,
  });

  const [showPreview, setShowPreview] = useState(false);

  const subjects = [
    'Matemáticas',
    'Comunicación',
    'Historia del Perú',
    'Geografía',
    'Economía',
    'Filosofía',
    'Física',
    'Química',
    'Biología',
    'Literatura',
    'Psicología',
    'Educación Cívica'
  ];

  const addQuestion = () => {
    if (currentQuestion.text && currentQuestion.options?.every(opt => opt.trim()) && currentQuestion.subject) {
      const newQuestion: Question = {
        id: `q_${Date.now()}`,
        text: currentQuestion.text,
        options: currentQuestion.options as string[],
        correctAnswer: currentQuestion.correctAnswer || 0,
        subject: currentQuestion.subject,
        difficulty: currentQuestion.difficulty as 'easy' | 'medium' | 'hard',
        points: currentQuestion.points || 20,
      };

      setQuestions([...questions, newQuestion]);
      setCurrentQuestion({
        text: '',
        options: ['', '', '', '', ''],
        correctAnswer: 0,
        subject: '',
        difficulty: 'medium',
        points: 20,
      });
    }
  };

  const removeQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const updateQuestionOption = (index: number, value: string) => {
    const newOptions = [...(currentQuestion.options || ['', '', '', '', ''])];
    newOptions[index] = value;
    setCurrentQuestion({ ...currentQuestion, options: newOptions });
  };

  const handleSave = () => {
    if (!examData.title || !examData.description || questions.length === 0) {
      alert('Por favor completa todos los campos requeridos y agrega al menos una pregunta.');
      return;
    }

    const correctAnswers = questions.map(q => String.fromCharCode(65 + q.correctAnswer)).join('');

    const exam: Partial<Exam> = {
      ...examData,
      questions,
      totalPoints: questions.reduce((sum, q) => sum + q.points, 0),
      correctAnswers,
      isActive: true,
      createdAt: new Date(),
    };

    onSave(exam);
  };

  if (showPreview) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => setShowPreview(false)}
              className="flex items-center text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver al Editor
            </button>
            <h2 className="text-xl font-bold text-gray-900">Vista Previa del Examen</h2>
            <div></div>
          </div>

          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{examData.title}</h1>
            <p className="text-gray-600 mb-4">{examData.description}</p>
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <span>Duración: {examData.duration} minutos</span>
              <span>Preguntas: {questions.length}</span>
              <span>Puntos totales: {questions.reduce((sum, q) => sum + q.points, 0)}</span>
            </div>
          </div>

          <div className="space-y-6">
            {questions.map((question, index) => (
              <div key={question.id} className="border border-gray-200 rounded-lg p-6">
                <div className="flex items-center space-x-2 mb-3">
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">
                    {question.subject}
                  </span>
                  <span className="text-sm text-gray-500">{question.points} puntos</span>
                </div>
                
                <h3 className="font-medium text-gray-900 mb-4">
                  {index + 1}. {question.text}
                </h3>
                
                <div className="space-y-2">
                  {question.options.map((option, optIndex) => (
                    <div
                      key={optIndex}
                      className={`p-3 border rounded-lg ${
                        optIndex === question.correctAnswer
                          ? 'border-green-500 bg-green-50'
                          : 'border-gray-200'
                      }`}
                    >
                      <span className="font-medium mr-2">
                        {String.fromCharCode(65 + optIndex)})
                      </span>
                      {option}
                      {optIndex === question.correctAnswer && (
                        <span className="ml-2 text-green-600 text-sm font-medium">(Correcta)</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Editor de Examen */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            {editingExam ? 'Editar Examen' : 'Crear Nuevo Examen'}
          </h2>

          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Título del Examen *
              </label>
              <input
                type="text"
                value={examData.title}
                onChange={(e) => setExamData({ ...examData, title: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ej: Examen de Admisión - Ciencias"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descripción *
              </label>
              <textarea
                value={examData.description}
                onChange={(e) => setExamData({ ...examData, description: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
                placeholder="Describe el contenido del examen..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duración (minutos)
                </label>
                <input
                  type="number"
                  value={examData.duration}
                  onChange={(e) => setExamData({ ...examData, duration: parseInt(e.target.value) })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  min="30"
                  max="300"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Intentos Permitidos
                </label>
                <input
                  type="number"
                  value={examData.allowedAttempts}
                  onChange={(e) => setExamData({ ...examData, allowedAttempts: parseInt(e.target.value) })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  min="1"
                  max="5"
                />
              </div>
            </div>
          </div>

          {/* Editor de Pregunta */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Agregar Pregunta</h3>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Materia</label>
                  <select
                    value={currentQuestion.subject}
                    onChange={(e) => setCurrentQuestion({ ...currentQuestion, subject: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  >
                    <option value="">Seleccionar materia</option>
                    {subjects.map(subject => (
                      <option key={subject} value={subject}>{subject}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Dificultad</label>
                  <select
                    value={currentQuestion.difficulty}
                    onChange={(e) => setCurrentQuestion({ ...currentQuestion, difficulty: e.target.value as 'easy' | 'medium' | 'hard' })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  >
                    <option value="easy">Fácil</option>
                    <option value="medium">Medio</option>
                    <option value="hard">Difícil</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Pregunta</label>
                <textarea
                  value={currentQuestion.text}
                  onChange={(e) => setCurrentQuestion({ ...currentQuestion, text: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  rows={3}
                  placeholder="Escribe la pregunta aquí..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Alternativas</label>
                <div className="space-y-2">
                  {currentQuestion.options?.map((option, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="correctAnswer"
                        checked={currentQuestion.correctAnswer === index}
                        onChange={() => setCurrentQuestion({ ...currentQuestion, correctAnswer: index })}
                        className="text-blue-600"
                      />
                      <span className="font-medium text-gray-700 w-6">
                        {String.fromCharCode(65 + index)})
                      </span>
                      <input
                        type="text"
                        value={option}
                        onChange={(e) => updateQuestionOption(index, e.target.value)}
                        className="flex-1 border border-gray-300 rounded px-3 py-2"
                        placeholder={`Alternativa ${String.fromCharCode(65 + index)}`}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={addQuestion}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
              >
                <Plus className="h-4 w-4 mr-2" />
                Agregar Pregunta
              </button>
            </div>
          </div>
        </div>

        {/* Lista de Preguntas */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Preguntas ({questions.length})
            </h3>
            <div className="flex space-x-2">
              <button
                onClick={() => setShowPreview(true)}
                className="flex items-center px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                <Eye className="h-4 w-4 mr-1" />
                Vista Previa
              </button>
            </div>
          </div>

          <div className="space-y-4 max-h-96 overflow-y-auto">
            {questions.map((question, index) => (
              <div key={question.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">
                        {question.subject}
                      </span>
                      <span className="text-xs text-gray-500">{question.difficulty}</span>
                    </div>
                    <p className="text-sm text-gray-900 mb-2">
                      {index + 1}. {question.text.substring(0, 100)}
                      {question.text.length > 100 ? '...' : ''}
                    </p>
                    <p className="text-xs text-gray-500">
                      Respuesta correcta: {String.fromCharCode(65 + question.correctAnswer)}
                    </p>
                  </div>
                  <button
                    onClick={() => removeQuestion(index)}
                    className="p-1 text-red-600 hover:bg-red-50 rounded"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {questions.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Plus className="h-8 w-8 mx-auto mb-2 text-gray-400" />
              <p>No hay preguntas agregadas</p>
              <p className="text-sm">Agrega preguntas usando el formulario de la izquierda</p>
            </div>
          )}

          {/* Botones de Acción */}
          <div className="flex space-x-3 mt-6 pt-6 border-t border-gray-200">
            <button
              onClick={onCancel}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center"
            >
              <Save className="h-4 w-4 mr-2" />
              {editingExam ? 'Actualizar' : 'Guardar'} Examen
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamCreator;