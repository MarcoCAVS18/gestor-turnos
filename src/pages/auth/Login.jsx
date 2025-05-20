// src/pages/auth/Login.jsx
import React, ***REMOVED*** useState ***REMOVED*** from 'react';
import ***REMOVED*** Link, useNavigate ***REMOVED*** from 'react-router-dom';
import ***REMOVED*** useAuth ***REMOVED*** from '../../contexts/AuthContext';

const Login = () => ***REMOVED***
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const ***REMOVED*** login ***REMOVED*** = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => ***REMOVED***
    e.preventDefault();
    
    try ***REMOVED***
      setError('');
      setLoading(true);
      await login(email, password);
      navigate('/');
    ***REMOVED*** catch (error) ***REMOVED***
      setError('Error al iniciar sesión. Verifica tus credenciales.');
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
            Iniciar Sesión
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            ¿No tienes una cuenta?***REMOVED***' '***REMOVED***
            <Link to="/register" className="font-medium text-pink-600 hover:text-pink-500">
              Regístrate
            </Link>
          </p>
        </div>
        
        <form className="space-y-6" onSubmit=***REMOVED***handleSubmit***REMOVED***>
          ***REMOVED***error && <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">***REMOVED***error***REMOVED***</div>***REMOVED***
          
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
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Contraseña
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value=***REMOVED***password***REMOVED***
              onChange=***REMOVED***(e) => setPassword(e.target.value)***REMOVED***
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-pink-500 focus:border-pink-500"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm">
              <Link to="/forgot-password" className="font-medium text-pink-600 hover:text-pink-500">
                ¿Olvidaste tu contraseña?
              </Link>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled=***REMOVED***loading***REMOVED***
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 disabled:opacity-50"
            >
              ***REMOVED***loading ? 'Iniciando sesión...' : 'Iniciar Sesión'***REMOVED***
            </button>
          </div>
        </form>
      </div>
    </div>
  );
***REMOVED***;

export default Login;