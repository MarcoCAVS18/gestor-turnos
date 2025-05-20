// src/pages/onboarding/Onboarding.jsx
import React, ***REMOVED*** useState ***REMOVED*** from 'react';
import ***REMOVED*** useNavigate ***REMOVED*** from 'react-router-dom';
import ***REMOVED*** useAuth ***REMOVED*** from '../../contexts/AuthContext';
import ***REMOVED*** doc, updateDoc ***REMOVED*** from 'firebase/firestore';
import ***REMOVED*** db ***REMOVED*** from '../../firebase/config';
import ***REMOVED*** Clock, Users, DollarSign, Briefcase ***REMOVED*** from 'lucide-react';

const Onboarding = () => ***REMOVED***
  const ***REMOVED*** currentUser ***REMOVED*** = useAuth();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [tipoTrabajo, setTipoTrabajo] = useState('');
  const [descuento, setDescuento] = useState(15);
  const [colorTema, setColorTema] = useState('#EC4899'); // pink-600 por defecto
  
  const opciones = [
    ***REMOVED***
      id: 'freelance',
      title: 'Trabajo freelance',
      description: 'Servicios profesionales, diseño, desarrollo, consultoría...',
      icon: <Briefcase className="h-8 w-8 text-pink-600" />
    ***REMOVED***,
    ***REMOVED***
      id: 'casual',
      title: 'Trabajo casual',
      description: 'Trabajos por día o turno, eventos, hostelería...',
      icon: <Clock className="h-8 w-8 text-pink-600" />
    ***REMOVED***,
    ***REMOVED***
      id: 'partTime',
      title: 'Trabajo a tiempo parcial',
      description: 'Empleos regulares a tiempo parcial',
      icon: <Users className="h-8 w-8 text-pink-600" />
    ***REMOVED***,
    ***REMOVED***
      id: 'multiple',
      title: 'Múltiples trabajos',
      description: 'Combinación de diferentes tipos de trabajo',
      icon: <DollarSign className="h-8 w-8 text-pink-600" />
    ***REMOVED***
  ];
  
  const colores = [
    ***REMOVED*** name: 'Rosa', value: '#EC4899' ***REMOVED***, // pink-600
    ***REMOVED*** name: 'Índigo', value: '#6366F1' ***REMOVED***, // indigo-500
    ***REMOVED*** name: 'Rojo', value: '#EF4444' ***REMOVED***, // red-500
    ***REMOVED*** name: 'Verde', value: '#10B981' ***REMOVED***, // emerald-500
    ***REMOVED*** name: 'Púrpura', value: '#8B5CF6' ***REMOVED***, // violet-500
    ***REMOVED*** name: 'Azul', value: '#3B82F6' ***REMOVED*** // blue-500
  ];

  const handleContinue = async () => ***REMOVED***
    if (currentStep < 2) ***REMOVED***
      setCurrentStep(currentStep + 1);
    ***REMOVED*** else ***REMOVED***
      try ***REMOVED***
        setLoading(true);
        // Guardar preferencias del usuario
        const userRef = doc(db, 'usuarios', currentUser.uid);
        await updateDoc(userRef, ***REMOVED***
          tipoTrabajo,
          'ajustes.descuentoDefault': descuento,
          'ajustes.colorPrincipal': colorTema
        ***REMOVED***);
        
        // Redireccionar al dashboard
        navigate('/');
      ***REMOVED*** catch (error) ***REMOVED***
        console.error('Error al actualizar preferencias:', error);
      ***REMOVED*** finally ***REMOVED***
        setLoading(false);
      ***REMOVED***
    ***REMOVED***
  ***REMOVED***;

  const renderStep = () => ***REMOVED***
    switch (currentStep) ***REMOVED***
      case 0:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-800">¿Qué tipo de trabajo realizas?</h2>
            <p className="text-gray-600">
              Esto nos ayudará a adaptar la aplicación a tus necesidades específicas.
            </p>
            
            <div className="grid grid-cols-1 gap-4 mt-4">
              ***REMOVED***opciones.map((opcion) => (
                <button
                  key=***REMOVED***opcion.id***REMOVED***
                  onClick=***REMOVED***() => setTipoTrabajo(opcion.id)***REMOVED***
                  className=***REMOVED***`p-4 border rounded-lg flex items-start transition-all $***REMOVED***
                    tipoTrabajo === opcion.id 
                      ? 'border-pink-500 bg-pink-50 shadow-md' 
                      : 'border-gray-300 hover:border-pink-300 hover:bg-pink-50/50'
                  ***REMOVED***`***REMOVED***
                >
                  <div className="mr-4">***REMOVED***opcion.icon***REMOVED***</div>
                  <div>
                    <h3 className="font-medium text-gray-900">***REMOVED***opcion.title***REMOVED***</h3>
                    <p className="text-sm text-gray-500">***REMOVED***opcion.description***REMOVED***</p>
                  </div>
                </button>
              ))***REMOVED***
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
                  value=***REMOVED***descuento***REMOVED***
                  onChange=***REMOVED***(e) => setDescuento(Number(e.target.value))***REMOVED***
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
              ***REMOVED***colores.map((color) => (
                <button
                  key=***REMOVED***color.value***REMOVED***
                  onClick=***REMOVED***() => setColorTema(color.value)***REMOVED***
                  className=***REMOVED***`p-4 flex flex-col items-center rounded-lg border transition-all $***REMOVED***
                    colorTema === color.value 
                      ? 'border-gray-600 shadow-md' 
                      : 'border-gray-200'
                  ***REMOVED***`***REMOVED***
                >
                  <div 
                    className="w-10 h-10 rounded-full mb-2" 
                    style=***REMOVED******REMOVED*** backgroundColor: color.value ***REMOVED******REMOVED***
                  ></div>
                  <span className="text-sm">***REMOVED***color.name***REMOVED***</span>
                </button>
              ))***REMOVED***
            </div>
          </div>
        );
      
      default:
        return null;
    ***REMOVED***
  ***REMOVED***;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      ***REMOVED***/* Cabecera */***REMOVED***
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <h1 className="text-lg font-semibold text-gray-900">Primeros pasos</h1>
        </div>
      </header>
      
      ***REMOVED***/* Contenido principal */***REMOVED***
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6">
          ***REMOVED***/* Pasos de progreso */***REMOVED***
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-500">
                Paso ***REMOVED***currentStep + 1***REMOVED*** de 3
              </span>
              <span className="text-sm font-medium text-gray-500">
                ***REMOVED***((currentStep + 1) / 3 * 100).toFixed(0)***REMOVED***% completado
              </span>
            </div>
            <div className="h-2 w-full bg-gray-200 rounded-full">
              <div 
                className="h-2 bg-pink-600 rounded-full" 
                style=***REMOVED******REMOVED*** width: `$***REMOVED***((currentStep + 1) / 3) * 100***REMOVED***%` ***REMOVED******REMOVED***
              ></div>
            </div>
          </div>
          
          ***REMOVED***/* Contenido del paso actual */***REMOVED***
          ***REMOVED***renderStep()***REMOVED***
          
          ***REMOVED***/* Botones de navegación */***REMOVED***
          <div className="mt-8 flex justify-between">
            <button
              type="button"
              onClick=***REMOVED***() => currentStep > 0 ? setCurrentStep(currentStep - 1) : null***REMOVED***
              disabled=***REMOVED***currentStep === 0***REMOVED***
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Atrás
            </button>
            
            <button
              type="button"
              onClick=***REMOVED***handleContinue***REMOVED***
              disabled=***REMOVED***loading || (currentStep === 0 && !tipoTrabajo)***REMOVED***
              className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ***REMOVED***currentStep === 2 ? 'Finalizar' : 'Continuar'***REMOVED***
            </button>
          </div>
        </div>
      </main>
    </div>
  );
***REMOVED***;

export default Onboarding;