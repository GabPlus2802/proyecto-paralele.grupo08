import { ExamAttempt, ExamResult, OpenMPConfig, ProcessingStats, ThreadUtilization } from '../types';

// Simulador de OpenMP para evaluación paralela de exámenes
export class OpenMPEvaluationEngine {
  private config: OpenMPConfig;
  private threads: ThreadUtilization[];
  private processingQueue: ExamAttempt[];
  private isProcessing: boolean = false;
  private stats: ProcessingStats;

  constructor(config: OpenMPConfig) {
    this.config = config;
    this.threads = Array.from({ length: config.numThreads }, (_, i) => ({
      threadId: i,
      isActive: false,
      utilization: 0,
      examsProcessed: 0,
    }));
    this.processingQueue = [];
    this.stats = {
      totalExams: 0,
      processedExams: 0,
      currentlyProcessing: 0,
      averageProcessingTime: 0,
      threadsUtilization: this.threads,
    };
  }

  // Evalúa una cadena de respuestas según las reglas especificadas (100 preguntas)
  private evaluateAnswerString(studentAnswers: string, correctAnswers: string): {
    score: number;
    correctCount: number;
    incorrectCount: number;
    blankCount: number;
  } {
    let score = 0;
    let correctCount = 0;
    let incorrectCount = 0;
    let blankCount = 0;

    // Asegurar que ambas cadenas tengan 100 caracteres
    const studentAnswersPadded = studentAnswers.padEnd(100, 'X');
    const correctAnswersPadded = correctAnswers.padEnd(100, 'A');

    for (let i = 0; i < 100; i++) {
      const studentAnswer = studentAnswersPadded[i];
      const correctAnswer = correctAnswersPadded[i];

      if (studentAnswer === 'X') {
        // Respuesta en blanco - no suma ni resta
        blankCount++;
      } else if (studentAnswer === correctAnswer) {
        // Respuesta correcta - suma 20 puntos
        score += 20;
        correctCount++;
      } else {
        // Respuesta incorrecta - resta 1.125 puntos
        score -= 1.125;
        incorrectCount++;
      }
    }

    return { score, correctCount, incorrectCount, blankCount };
  }

  // Simula el procesamiento paralelo de un examen en un hilo específico
  private async processExamInThread(exam: ExamAttempt, threadId: number): Promise<ExamResult> {
    const thread = this.threads[threadId];
    thread.isActive = true;
    thread.currentExam = `${exam.studentName} - Área ${exam.examId.split('_')[1]}`;
    
    const startTime = Date.now();
    
    // Simular tiempo de procesamiento variable según la estrategia de scheduling
    let processingTime: number;
    switch (this.config.schedulingStrategy) {
      case 'static':
        processingTime = 1200 + Math.random() * 600; // 1200-1800ms (más tiempo para 100 preguntas)
        break;
      case 'dynamic':
        processingTime = 1000 + Math.random() * 800; // 1000-1800ms
        break;
      case 'guided':
        processingTime = 800 + Math.random() * 700; // 800-1500ms
        break;
    }

    // Simular carga de CPU durante el procesamiento
    await new Promise(resolve => setTimeout(resolve, processingTime));

    // Obtener respuestas correctas del examen
    const areaCode = exam.examId.split('_')[1] || 'A';
    const correctAnswers = areaCode.repeat(100); // 100 respuestas correctas del área
    
    // Evaluar las respuestas
    const evaluation = this.evaluateAnswerString(exam.answerString, correctAnswers);
    
    const endTime = Date.now();
    const actualProcessingTime = endTime - startTime;

    // Actualizar estadísticas del hilo
    thread.isActive = false;
    thread.currentExam = undefined;
    thread.examsProcessed++;
    thread.utilization = Math.min(100, thread.utilization + Math.random() * 15);

    const result: ExamResult = {
      id: `result_${exam.id}`,
      examId: exam.examId,
      studentId: exam.studentId,
      studentName: exam.studentName,
      answerString: exam.answerString,
      correctAnswers,
      score: Math.max(0, evaluation.score), // El puntaje no puede ser negativo
      totalPoints: 2000, // 100 preguntas x 20 puntos máximo
      percentage: Math.max(0, (evaluation.score / 2000) * 100),
      completedAt: new Date(),
      timeSpent: exam.endTime ? Math.floor((exam.endTime.getTime() - exam.startTime.getTime()) / 60000) : 0,
      correctCount: evaluation.correctCount,
      incorrectCount: evaluation.incorrectCount,
      blankCount: evaluation.blankCount,
      totalQuestions: 100,
      processingTime: actualProcessingTime,
      status: 'evaluated',
    };

    return result;
  }

  // Procesa múltiples exámenes en paralelo usando OpenMP
  async processExamsBatch(exams: ExamAttempt[]): Promise<ExamResult[]> {
    this.processingQueue = [...exams];
    this.stats.totalExams = exams.length;
    this.stats.processedExams = 0;
    this.isProcessing = true;

    const results: ExamResult[] = [];
    const processingPromises: Promise<ExamResult>[] = [];

    // Distribuir exámenes entre hilos disponibles
    for (let i = 0; i < exams.length; i++) {
      const threadId = i % this.config.numThreads;
      const exam = exams[i];
      
      exam.status = 'evaluating';
      exam.processingThread = threadId;
      
      this.stats.currentlyProcessing++;
      
      const promise = this.processExamInThread(exam, threadId).then(result => {
        this.stats.processedExams++;
        this.stats.currentlyProcessing--;
        exam.status = 'evaluated';
        return result;
      });
      
      processingPromises.push(promise);
      
      // Simular delay entre asignaciones según la estrategia
      if (this.config.schedulingStrategy === 'dynamic') {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }

    // Esperar a que todos los hilos terminen
    const batchResults = await Promise.all(processingPromises);
    results.push(...batchResults);

    // Calcular estadísticas finales
    const totalProcessingTime = results.reduce((sum, r) => sum + r.processingTime, 0);
    this.stats.averageProcessingTime = totalProcessingTime / results.length;
    
    this.isProcessing = false;
    return results;
  }

  // Obtiene las estadísticas actuales de procesamiento
  getProcessingStats(): ProcessingStats {
    return { ...this.stats, threadsUtilization: [...this.threads] };
  }

  // Actualiza la configuración de OpenMP
  updateConfig(newConfig: OpenMPConfig): void {
    this.config = newConfig;
    
    // Redimensionar array de hilos si es necesario
    if (newConfig.numThreads !== this.threads.length) {
      this.threads = Array.from({ length: newConfig.numThreads }, (_, i) => ({
        threadId: i,
        isActive: false,
        utilization: 0,
        examsProcessed: 0,
      }));
      this.stats.threadsUtilization = this.threads;
    }
  }

  // Verifica si el motor está procesando actualmente
  isCurrentlyProcessing(): boolean {
    return this.isProcessing;
  }
}

// Instancia global del motor de evaluación
export const evaluationEngine = new OpenMPEvaluationEngine({
  numThreads: 4,
  schedulingStrategy: 'dynamic',
  chunkSize: 1,
});