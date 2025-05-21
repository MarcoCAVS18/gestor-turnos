// src/pages/onboarding/Onboarding.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { Clock, Users, DollarSign, Briefcase } from 'lucide-react';

const Onboarding = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [tipoTrabajo, setTipoTrabajo] = useState('');
  const [descuento, setDescuento] = useState(15);
  const [colorTema, setColorTema] = useState('#EC4899'); // pink-600 por defecto
  
  const opciones = [
    {
      id: 'freelance',
      title: 'Trabajo freelance',
      description: 'Servicios profesionales, diseño, desarrollo, consultoría...',
      icon: <Briefcase className="h-8 w-8 text-pink-600" />
    },
    {
      id: 'casual',
      title: 'Trabajo casual',
      description: 'Trabajos por día o turno, eventos, hostelería...',
      icon: <Clock className="h-8 w-8 text-pink-600" />
    },
    {
      id: 'partTime',
      title: 'Trabajo a tiempo parcial',
      description: 'Empleos regulares a tiempo parcial',
      icon: <Users className="h-8 w-8 text-pink-600" />
    },
    {
      id: 'multiple',
      title: 'Múltiples trabajos',
      description: 'Combinación de diferentes tipos de trabajo',
      icon: <DollarSign className="h-8 w-8 text-pink-600" />
    }
  ];
  
  const colores = [
    { name: 'Rosa', value: '#EC4899' }, // pink-600
    { name: 'Índigo', value: '#6366F1' }, // indigo-500
    { name: 'Rojo', value: '#EF4444' }, // red-500
    { name: 'Verde', value: '#10B981' }, // emerald-500
    { name: 'Púrpura', value: '#8B5CF6' }, // violet-500
    { name: 'Azul', value: '#3B82F6' } // blue-500
  ];

  const handleContinue = async () => {
    if (currentStep < 2) {
      setCurrentStep(currentStep + 1);
    } else {
      try {
        setLoading(true);
        // Guardar preferencias del usuario
        const userRef = doc(db, 'usuarios', currentUser.uid);
        await updateDoc(userRef, {
          tipoTrabajo,
          'ajustes.descuentoDefault': descuento,
          'ajustes.colorPrincipal': colorTema
        });
        
        // Redireccionar al dashboard
        navigate('/');
      } catch (error) {
        console.error('Error al actualizar preferencias:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-800">¿Qué tipo de trabajo realizas?</h2>
            <p className="text-gray-600">
              Esto nos ayudará a adaptar la aplicación a tus necesidades específicas.
            </p>
            
            <div className="grid grid-cols-1 gap-4 mt-4">
              {opciones.map((opcion) => (
                <button
                  key={opcion.id}
                  onClick={() => setTipoTrabajo(opcion.id)}
                  className={`p-4 border rounded-lg flex items-start transition-all ${
                    tipoTrabajo === opcion.id 
                      ? 'border-pink-500 bg-pink-50 shadow-md' 
                      : 'border-gray-300 hover:border-pink-300 hover:bg-pink-50/50'
                  }`}
                >
                  <div className="mr-4">{opcion.icon}</div>
                  <div>
                    <h3 className="font-medium text-gray-900">{opcion.title}</h3>
                    <p className="text-sm text-gray-500">{opcion.description}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        );
      
      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-800">¿Aplicas algún descuento o retención?</h2>
            <p className="text-gray-600">
              Muchos trabajos casuales o freelance tienen retenciones o descuentos fiscales.
            </p>
            
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700">
                Porcentaje de descuento
              </label>
              <div className="mt-1 flex rounded-md shadow-sm">
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={descuento}
                  onChange={(e) => setDescuento(Number(e.target.value))}
                  className="flex-1 min-w-0 block w-full px-3 py-2 rounded-l-md border border-gray-300 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
                  placeholder="15"
                />
                <span className="inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                  %
                </span>
              </div>
              <p className="mt-2 text-sm text-gray-500">
                Esto se aplicará por defecto a todos tus trabajos y turnos. Podrás modificarlo más adelante.
              </p>
            </div>
          </div>
        );
      
      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-800">Personaliza tu experiencia</h2>
            <p className="text-gray-600">
              Elige el color principal para personalizar tu aplicación.
            </p>
            
            <div className="grid grid-cols-3 gap-4 mt-4">
              {colores.map((color) => (
                <button
                  key={color.value}
                  onClick={() => setColorTema(color.value)}
                  className={`p-4 flex flex-col items-center rounded-lg border transition-all ${
                    colorTema === color.value 
                      ? 'border-gray-600 shadow-md' 
                      : 'border-gray-200'
                  }`}
                >
                  <div 
                    className="w-10 h-10 rounded-full mb-2" 
                    style={{ backgroundColor: color.value }}
                  ></div>
                  <span className="text-sm">{color.name}</span>
                </button>
              ))}
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Cabecera */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <h1 className="text-lg font-semibold text-gray-900">Primeros pasos</h1>
        </div>
      </header>
      
      {/* Contenido principal */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6">
          {/* Pasos de progreso */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-500">
                Paso {currentStep + 1} de 3
              </span>
              <span className="text-sm font-medium text-gray-500">
                {((currentStep + 1) / 3 * 100).toFixed(0)}% completado
              </span>
            </div>
            <div className="h-2 w-full bg-gray-200 rounded-full">
              <div 
                className="h-2 bg-pink-600 rounded-full" 
                style={{ width: `${((currentStep + 1) / 3) * 100}%` }}
              ></div>
            </div>
          </div>
          
          {/* Contenido del paso actual */}
          {renderStep()}
          
          {/* Botones de navegación */}
          <div className="mt-8 flex justify-between">
            <button
              type="button"
              onClick={() => currentStep > 0 ? setCurrentStep(currentStep - 1) : null}
              disabled={currentStep === 0}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Atrás
            </button>
            
            <button
              type="button"
              onClick={handleContinue}
              disabled={loading || (currentStep === 0 && !tipoTrabajo)}
              className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {currentStep === 2 ? 'Finalizar' : 'Continuar'}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Onboarding;