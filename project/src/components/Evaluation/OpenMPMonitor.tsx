import React, { useState, useEffect } from 'react';
import { Cpu, Activity, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { ProcessingStats, ThreadUtilization } from '../../types';
import { evaluationEngine } from '../../utils/openmpSimulator';

interface OpenMPMonitorProps {
  isProcessing: boolean;
}

const OpenMPMonitor: React.FC<OpenMPMonitorProps> = ({ isProcessing }) => {
  const [stats, setStats] = useState<ProcessingStats | null>(null);

  useEffect(() => {
    const updateStats = () => {
      setStats(evaluationEngine.getProcessingStats());
    };

    updateStats();
    const interval = setInterval(updateStats, 500);

    return () => clearInterval(interval);
  }, []);

  if (!stats) return null;

  const getThreadStatusColor = (thread: ThreadUtilization) => {
    if (thread.isActive) return 'bg-green-500';
    if (thread.utilization > 70) return 'bg-yellow-500';
    return 'bg-gray-400';
  };

  const getThreadStatusText = (thread: ThreadUtilization) => {
    if (thread.isActive) return 'Procesando';
    if (thread.utilization > 70) return 'Carga Alta';
    return 'Inactivo';
  };

  return (
    <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-6 border border-blue-200">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-600 rounded-lg">
            <Cpu className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Monitor OpenMP</h3>
            <p className="text-sm text-gray-600">Procesamiento Paralelo de Exámenes</p>
          </div>
        </div>
        <div className={`flex items-center space-x-2 px-3 py-1 rounded-full ${
          isProcessing ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
        }`}>
          <div className={`w-2 h-2 rounded-full ${isProcessing ? 'bg-green-500' : 'bg-gray-400'}`}></div>
          <span className="text-sm font-medium">
            {isProcessing ? 'Procesando' : 'Inactivo'}
          </span>
        </div>
      </div>

      {/* Estadísticas Generales */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <div>
              <p className="text-sm text-gray-600">Procesados</p>
              <p className="text-xl font-bold text-gray-900">
                {stats.processedExams}/{stats.totalExams}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center space-x-2">
            <Activity className="h-5 w-5 text-blue-600" />
            <div>
              <p className="text-sm text-gray-600">En Proceso</p>
              <p className="text-xl font-bold text-gray-900">{stats.currentlyProcessing}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center space-x-2">
            <Clock className="h-5 w-5 text-purple-600" />
            <div>
              <p className="text-sm text-gray-600">Tiempo Promedio</p>
              <p className="text-xl font-bold text-gray-900">
                {stats.averageProcessingTime.toFixed(0)}ms
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center space-x-2">
            <Cpu className="h-5 w-5 text-orange-600" />
            <div>
              <p className="text-sm text-gray-600">Hilos Activos</p>
              <p className="text-xl font-bold text-gray-900">
                {stats.threadsUtilization.filter(t => t.isActive).length}/{stats.threadsUtilization.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Monitor de Hilos */}
      <div className="space-y-4">
        <h4 className="font-semibold text-gray-900">Estado de Hilos OpenMP</h4>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {stats.threadsUtilization.map((thread) => (
            <div key={thread.threadId} className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${getThreadStatusColor(thread)}`}></div>
                  <span className="font-medium text-gray-900">
                    Hilo #{thread.threadId}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    thread.isActive 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {getThreadStatusText(thread)}
                  </span>
                </div>
                <span className="text-sm text-gray-500">
                  {thread.examsProcessed} procesados
                </span>
              </div>

              {thread.currentExam && (
                <div className="mb-3">
                  <p className="text-sm text-gray-600">Procesando:</p>
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {thread.currentExam}
                  </p>
                </div>
              )}

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Utilización</span>
                  <span className="text-sm font-medium text-gray-900">
                    {thread.utilization.toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${
                      thread.isActive ? 'bg-green-500' : 
                      thread.utilization > 70 ? 'bg-yellow-500' : 'bg-blue-500'
                    }`}
                    style={{ width: `${Math.min(100, thread.utilization)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Barra de Progreso General */}
      {isProcessing && stats.totalExams > 0 && (
        <div className="mt-6 bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-900">Progreso General</span>
            <span className="text-sm text-gray-600">
              {((stats.processedExams / stats.totalExams) * 100).toFixed(1)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-500"
              style={{ width: `${(stats.processedExams / stats.totalExams) * 100}%` }}
            ></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OpenMPMonitor;