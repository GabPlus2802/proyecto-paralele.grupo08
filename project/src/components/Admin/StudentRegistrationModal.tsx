import React, { useState } from 'react';
import { X, Save, UserPlus, GraduationCap } from 'lucide-react';
import { Student, EXAM_AREAS } from '../../types';

interface StudentRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (student: Partial<Student>) => void;
  editingStudent?: Student;
  mode: 'create' | 'edit';
}

const StudentRegistrationModal: React.FC<StudentRegistrationModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingStudent,
  mode
}) => {
  const [formData, setFormData] = useState({
    name: editingStudent?.name || '',
    email: editingStudent?.email || '',
    dni: editingStudent?.dni || '',
    phone: editingStudent?.phone || '',
    address: editingStudent?.address || '',
    birthDate: editingStudent?.birthDate ? editingStudent.birthDate.toISOString().split('T')[0] : '',
    school: editingStudent?.school || '',
    area: editingStudent?.area || 'A' as 'A' | 'B' | 'C' | 'D' | 'E',
    career: editingStudent?.career || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Obtener carreras según el área seleccionada
  const getCareersByArea = (areaCode: string) => {
    const area = EXAM_AREAS.find(a => a.code === areaCode);
    return area ? area.careers : [];
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre completo es requerido';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'El email no es válido';
    }

    if (!formData.dni.trim()) {
      newErrors.dni = 'El DNI es requerido';
    } else if (!/^\d{8}$/.test(formData.dni)) {
      newErrors.dni = 'El DNI debe tener 8 dígitos';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'El teléfono es requerido';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'La dirección es requerida';
    }

    if (!formData.birthDate) {
      newErrors.birthDate = 'La fecha de nacimiento es requerida';
    }

    if (!formData.school.trim()) {
      newErrors.school = 'El colegio de procedencia es requerido';
    }

    if (!formData.area) {
      newErrors.area = 'El área de postulación es requerida';
    }

    if (!formData.career.trim()) {
      newErrors.career = 'La carrera es requerida';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const studentData: Partial<Student> = {
      ...formData,
      birthDate: new Date(formData.birthDate),
      registrationDate: new Date(),
      examResults: [],
      totalScore: 0,
      isAdmitted: false,
    };

    onSave(studentData);
    onClose();
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => {
      const newData = { ...prev, [field]: value };
      
      // Si cambia el área, resetear la carrera
      if (field === 'area') {
        newData.career = '';
      }
      
      return newData;
    });
    
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  if (!isOpen) return null;

  const selectedArea = EXAM_AREAS.find(a => a.code === formData.area);
  const availableCareers = getCareersByArea(formData.area);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900 flex items-center">
            <GraduationCap className="h-5 w-5 mr-2" />
            {mode === 'create' ? 'Registrar Nuevo Postulante' : 'Editar Postulante'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Información Personal */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <UserPlus className="h-5 w-5 mr-2" />
                  Información Personal
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre Completo *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.name ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Ej: María González Pérez"
                    />
                    {errors.name && (
                      <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        DNI *
                      </label>
                      <input
                        type="text"
                        value={formData.dni}
                        onChange={(e) => handleInputChange('dni', e.target.value)}
                        className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          errors.dni ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="12345678"
                        maxLength={8}
                      />
                      {errors.dni && (
                        <p className="text-red-500 text-sm mt-1">{errors.dni}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Fecha de Nacimiento *
                      </label>
                      <input
                        type="date"
                        value={formData.birthDate}
                        onChange={(e) => handleInputChange('birthDate', e.target.value)}
                        className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          errors.birthDate ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errors.birthDate && (
                        <p className="text-red-500 text-sm mt-1">{errors.birthDate}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Correo Electrónico *
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.email ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="maria.gonzalez@gmail.com"
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Teléfono *
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.phone ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="+51 987 654 321"
                    />
                    {errors.phone && (
                      <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Dirección *
                    </label>
                    <textarea
                      value={formData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.address ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Av. Universitaria 1801, Lima"
                      rows={3}
                    />
                    {errors.address && (
                      <p className="text-red-500 text-sm mt-1">{errors.address}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Colegio de Procedencia *
                    </label>
                    <input
                      type="text"
                      value={formData.school}
                      onChange={(e) => handleInputChange('school', e.target.value)}
                      className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.school ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="I.E. José María Eguren"
                    />
                    {errors.school && (
                      <p className="text-red-500 text-sm mt-1">{errors.school}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Información Académica */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <GraduationCap className="h-5 w-5 mr-2" />
                  Información Académica
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Área de Postulación *
                    </label>
                    <select
                      value={formData.area}
                      onChange={(e) => handleInputChange('area', e.target.value)}
                      className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.area ? 'border-red-500' : 'border-gray-300'
                      }`}
                    >
                      {EXAM_AREAS.map(area => (
                        <option key={area.code} value={area.code}>
                          Área {area.code} - {area.name}
                        </option>
                      ))}
                    </select>
                    {errors.area && (
                      <p className="text-red-500 text-sm mt-1">{errors.area}</p>
                    )}
                  </div>

                  {selectedArea && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h4 className="font-medium text-blue-900 mb-2">
                        Área {selectedArea.code}: {selectedArea.name}
                      </h4>
                      <p className="text-blue-800 text-sm">{selectedArea.description}</p>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Carrera a Postular *
                    </label>
                    <select
                      value={formData.career}
                      onChange={(e) => handleInputChange('career', e.target.value)}
                      className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.career ? 'border-red-500' : 'border-gray-300'
                      }`}
                      disabled={!formData.area}
                    >
                      <option value="">Seleccionar carrera</option>
                      {availableCareers.map(career => (
                        <option key={career} value={career}>
                          {career}
                        </option>
                      ))}
                    </select>
                    {errors.career && (
                      <p className="text-red-500 text-sm mt-1">{errors.career}</p>
                    )}
                  </div>

                  {formData.career && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <h4 className="font-medium text-green-900 mb-2">Carrera Seleccionada</h4>
                      <p className="text-green-800 text-sm">
                        <strong>{formData.career}</strong> - Área {formData.area}
                      </p>
                      <p className="text-green-700 text-xs mt-1">
                        El postulante podrá rendir únicamente el examen del Área {formData.area}
                      </p>
                    </div>
                  )}

                  {mode === 'create' && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <h4 className="font-medium text-yellow-900 mb-2">Información de Acceso</h4>
                      <div className="text-yellow-800 text-sm space-y-1">
                        <p><strong>Usuario:</strong> El email ingresado será su usuario de acceso</p>
                        <p><strong>Contraseña:</strong> Por defecto será "123456"</p>
                        <p><strong>Rol:</strong> Se creará automáticamente como "Postulante"</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex space-x-3 mt-8 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
            >
              <Save className="h-4 w-4 mr-2" />
              {mode === 'create' ? 'Registrar Postulante' : 'Guardar Cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StudentRegistrationModal;