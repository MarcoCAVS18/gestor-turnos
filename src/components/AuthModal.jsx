// src/components/AuthModal.jsx
import React, ***REMOVED*** useState ***REMOVED*** from 'react';
import ***REMOVED*** useAuth ***REMOVED*** from '../contexts/AuthContext';
import ***REMOVED*** X ***REMOVED*** from 'lucide-react';

const AuthModal = (***REMOVED*** visible, onClose ***REMOVED***) => ***REMOVED***
  const ***REMOVED*** login ***REMOVED*** = useAuth();
  const [step, setStep] = useState('select'); // 'select', 'email', 'password'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!visible) return null;

  const handleEmailNext = () => ***REMOVED***
    if (!email) return setError('Por favor ingresá un email válido');
    setError('');
    setStep('password');
  ***REMOVED***;

  const handleLogin = async () => ***REMOVED***
    setLoading(true);
    setError('');
    try ***REMOVED***
      await login(email, password);
      onClose();
    ***REMOVED*** catch (err) ***REMOVED***
      setError('Email o contraseña incorrectos');
    ***REMOVED***
    setLoading(false);
  ***REMOVED***;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-60 flex items-center justify-center">
      <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-lg relative">
        <button onClick=***REMOVED***onClose***REMOVED*** className="absolute top-3 right-3 text-gray-500 hover:text-black">
          <X size=***REMOVED***20***REMOVED*** />
        </button>

        <h2 className="text-xl font-bold text-center mb-4">Iniciar sesión</h2>

        ***REMOVED***step === 'select' && (
          <div className="space-y-3">
            <button
              onClick=***REMOVED***() => setStep('email')***REMOVED***
              className="w-full py-2 px-4 bg-pink-600 text-white rounded-xl hover:bg-pink-700 transition"
            >
              Continuar con Email
            </button>

            <button
              onClick=***REMOVED***() => alert('Implementar login con Google')***REMOVED***
              className="w-full py-2 px-4 border border-gray-300 rounded-xl hover:bg-gray-50 transition"
            >
              Continuar con Google
            </button>
          </div>
        )***REMOVED***

        ***REMOVED***step === 'email' && (
          <div className="space-y-4">
            <input
              type="email"
              placeholder="Tu email"
              value=***REMOVED***email***REMOVED***
              onChange=***REMOVED***(e) => setEmail(e.target.value)***REMOVED***
              className="w-full p-2 border rounded-lg"
            />
            <button
              onClick=***REMOVED***handleEmailNext***REMOVED***
              className="w-full py-2 bg-pink-600 text-white rounded-xl hover:bg-pink-700 transition"
            >
              Continuar
            </button>
          </div>
        )***REMOVED***

        ***REMOVED***step === 'password' && (
          <div className="space-y-4">
            <input
              type="password"
              placeholder="Contraseña"
              value=***REMOVED***password***REMOVED***
              onChange=***REMOVED***(e) => setPassword(e.target.value)***REMOVED***
              className="w-full p-2 border rounded-lg"
            />
            <button
              onClick=***REMOVED***handleLogin***REMOVED***
              disabled=***REMOVED***loading***REMOVED***
              className="w-full py-2 bg-pink-600 text-white rounded-xl hover:bg-pink-700 transition"
            >
              ***REMOVED***loading ? 'Iniciando...' : 'Iniciar sesión'***REMOVED***
            </button>
            <button onClick=***REMOVED***() => setStep('email')***REMOVED*** className="text-sm text-gray-500 hover:underline">
              Volver
            </button>
          </div>
        )***REMOVED***

        ***REMOVED***error && <p className="text-sm text-red-500 mt-3">***REMOVED***error***REMOVED***</p>***REMOVED***
      </div>
    </div>
  );
***REMOVED***;

export default AuthModal;
