// src/pages/auth/ForgotPassword.jsx
import React, ***REMOVED*** useState ***REMOVED*** from 'react';
import ***REMOVED*** Link ***REMOVED*** from 'react-router-dom';
import ***REMOVED*** useAuth ***REMOVED*** from '../../contexts/AuthContext';

const ForgotPassword = () => ***REMOVED***
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const ***REMOVED*** resetPassword ***REMOVED*** = useAuth();

  const handleSubmit = async (e) => ***REMOVED***
    e.preventDefault();
    
    try ***REMOVED***
      setMessage('');
      setError('');
      setLoading(true);
      await resetPassword(email);
      setMessage('Se ha enviado un correo con instrucciones para restablecer tu contraseña.');
    ***REMOVED*** catch (error) ***REMOVED***
      setError('No se pudo enviar el correo de restablecimiento. Verifica tu email.');
      console.error(error);
    ***REMOVED*** finally ***REMOVED***
      setLoading(false);
    ***REMOVED***
  ***REMOVED***;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-gray-900">
            Recuperar contraseña
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Te enviaremos un correo para restablecer tu contraseña
          </p>
        </div>
        
        <form className="space-y-6" onSubmit=***REMOVED***handleSubmit***REMOVED***>
          ***REMOVED***error && <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">***REMOVED***error***REMOVED***</div>***REMOVED***
          ***REMOVED***message && <div className="bg-green-50 text-green-600 p-3 rounded-md text-sm">***REMOVED***message***REMOVED***</div>***REMOVED***
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value=***REMOVED***email***REMOVED***
              onChange=***REMOVED***(e) => setEmail(e.target.value)***REMOVED***
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-pink-500 focus:border-pink-500"
            />
          </div>

          <div>
            <button
              type="submit"
              disabled=***REMOVED***loading***REMOVED***
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 disabled:opacity-50"
            >
              ***REMOVED***loading ? 'Enviando...' : 'Enviar correo de recuperación'***REMOVED***
            </button>
          </div>
          
          <div className="text-sm text-center">
            <Link to="/login" className="font-medium text-pink-600 hover:text-pink-500">
              Volver al inicio de sesión
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
***REMOVED***;

export default ForgotPassword;