// src/pages/auth/Login.jsx
import React, ***REMOVED*** useState, useEffect ***REMOVED*** from 'react';
import ***REMOVED*** useNavigate, useLocation ***REMOVED*** from 'react-router-dom';
import ***REMOVED*** useAuth ***REMOVED*** from '../../contexts/AuthContext';
import ***REMOVED*** Mail, Lock, Eye, EyeOff ***REMOVED*** from 'lucide-react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Card from '../../components/ui/Card';
import Flex from '../../components/ui/Flex';

const Login = () => ***REMOVED***
  const ***REMOVED*** login, loginWithGoogle ***REMOVED*** = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Obtener la ruta de redirección
  const redirectTo = location.state?.redirectTo || '/dashboard';

  // Detectar si venimos de forgot-password
  useEffect(() => ***REMOVED***
    if (location.state && location.state.emailSent) ***REMOVED***
      setSuccessMessage('Hemos enviado un link de recuperación a tu email.');
      setEmail(location.state.email || '');
      
      const timer = setTimeout(() => ***REMOVED***
        setSuccessMessage('');
      ***REMOVED***, 4000);
      
      return () => clearTimeout(timer);
    ***REMOVED***
  ***REMOVED***, [location]);

  const handleLogin = async (e) => ***REMOVED***
    e.preventDefault();
    if (!email || !password) ***REMOVED***
      return setError('Por favor ingresa tu email y contraseña');
    ***REMOVED***

    setLoading(true);
    setError('');
    try ***REMOVED***
      await login(email, password);
      navigate(redirectTo);
    ***REMOVED*** catch (err) ***REMOVED***
      setError('Email o contraseña incorrectos');
      setLoading(false);
    ***REMOVED***
  ***REMOVED***;

  const handleGoogleLogin = async () => ***REMOVED***
    setGoogleLoading(true);
    setError('');
    try ***REMOVED***
      await loginWithGoogle();
      navigate(redirectTo);
    ***REMOVED*** catch (err) ***REMOVED***
      setError('Error al iniciar sesión con Google');
      setGoogleLoading(false);
    ***REMOVED***
  ***REMOVED***;

  const handleRegister = () => ***REMOVED***
    navigate('/register', ***REMOVED*** 
      state: redirectTo ? ***REMOVED*** redirectTo ***REMOVED*** : undefined 
    ***REMOVED***);
  ***REMOVED***;

  const handleForgotPassword = () => ***REMOVED***
    navigate('/forgot-password', ***REMOVED*** state: ***REMOVED*** email ***REMOVED*** ***REMOVED***);
  ***REMOVED***;

  return (
    <div className="fixed inset-0 overflow-hidden">
      ***REMOVED***/* Video de fondo */***REMOVED***
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-black opacity-50 z-10"></div>
        <video 
          autoPlay 
          loop 
          muted 
          playsInline
          className="absolute object-cover w-full h-full"
        >
          <source src="/assets/videos/sample_0.mp4" type="video/mp4" />
          Tu navegador no soporta videos.
        </video>
      </div>
      
      ***REMOVED***/* Contenido del login */***REMOVED***
      <Flex variant="center" className="fixed inset-0 z-20 bg-transparent p-4">
        <Card className="w-full max-w-md shadow-2xl" padding="lg">
          <h1 className="text-2xl font-bold text-center mb-6">Iniciar sesión</h1>
          
          ***REMOVED***error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
              ***REMOVED***error***REMOVED***
            </div>
          )***REMOVED***
          
          ***REMOVED***successMessage && (
            <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md text-sm">
              ***REMOVED***successMessage***REMOVED***
            </div>
          )***REMOVED***
          
          <form onSubmit=***REMOVED***handleLogin***REMOVED***>
            <div className="mb-4">
              <Input
                type="email"
                label="Email"
                icon=***REMOVED***Mail***REMOVED***
                value=***REMOVED***email***REMOVED***
                onChange=***REMOVED***(e) => setEmail(e.target.value)***REMOVED***
                placeholder="tu@email.com"
                required
              />
            </div>
            
            <div className="mb-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Lock size=***REMOVED***16***REMOVED*** className="inline mr-2" />
                Contraseña
              </label>
              <div className="relative">
                <input
                  type=***REMOVED***showPassword ? "text" : "password"***REMOVED***
                  value=***REMOVED***password***REMOVED***
                  onChange=***REMOVED***(e) => setPassword(e.target.value)***REMOVED***
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-offset-0 transition-colors"
                  placeholder="Contraseña"
                  required
                />
                <button 
                  type="button"
                  onClick=***REMOVED***() => setShowPassword(!showPassword)***REMOVED***
                  className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
                >
                  ***REMOVED***showPassword ? <EyeOff size=***REMOVED***20***REMOVED*** /> : <Eye size=***REMOVED***20***REMOVED*** />***REMOVED***
                </button>
              </div>
            </div>
            
            ***REMOVED***/* Enlace de recuperación de contraseña */***REMOVED***
            <div className="mb-4 text-right">
              <button 
                type="button"
                onClick=***REMOVED***handleForgotPassword***REMOVED***
                className="text-sm text-pink-600 hover:text-pink-800"
              >
                ¿Has olvidado tu contraseña?
              </button>
            </div>
            
            <Button
              type="submit"
              loading=***REMOVED***loading***REMOVED***
              className="w-full mb-4"
            >
              Continuar
            </Button>
          </form>
          
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white px-3 text-gray-500 text-sm">o</span>
            </div>
          </div>
          
          <Button
            onClick=***REMOVED***handleGoogleLogin***REMOVED***
            loading=***REMOVED***googleLoading***REMOVED***
            variant="secondary"
            className="w-full mb-6"
          >
            <svg className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
              <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
              <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
              <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
              <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
            </svg>
            Continuar con Google
          </Button>
          
          <div className="text-center">
            <p className="text-gray-600 mb-2">¿No tienes una cuenta?</p>
            <button 
              onClick=***REMOVED***handleRegister***REMOVED***
              className="text-pink-600 hover:text-pink-800 font-bold"
            >
              Regístrate aquí
            </button>
          </div>
        </Card>
      </Flex>
    </div>
  );
***REMOVED***;

export default Login;