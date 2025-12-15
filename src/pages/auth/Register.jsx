// src/pages/auth/Register.jsx

import React, ***REMOVED*** useState, useEffect ***REMOVED*** from 'react';
import ***REMOVED*** Link, useNavigate, useLocation ***REMOVED*** from 'react-router-dom';
import ***REMOVED*** Eye, EyeOff ***REMOVED*** from 'lucide-react';
import ***REMOVED*** useAuth ***REMOVED*** from '../../contexts/AuthContext';

// Nueva importación estructurada
import Button from '../../components/ui/Button';
import Flex from '../../components/ui/Flex';
import Logo from '../../components/icons/Logo';

import GoogleIcon from '../../components/icons/GoogleIcon';

const Register = () => ***REMOVED***
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const ***REMOVED*** signup, loginWithGoogle ***REMOVED*** = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Obtener la ruta de redirección de los state de navegación
  const redirectTo = location.state?.redirectTo || '/';
  
  // Estados para validaciones
  const [emailValid, setEmailValid] = useState(true);
  const [passwordStrength, setPasswordStrength] = useState(***REMOVED***
    isValid: false,
    hasMinLength: false,
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumber: false
  ***REMOVED***);
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [nameValid, setNameValid] = useState(true);
  
  // Validar email
  useEffect(() => ***REMOVED***
    if (email) ***REMOVED***
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      setEmailValid(emailRegex.test(email));
    ***REMOVED*** else ***REMOVED***
      setEmailValid(true); // No mostrar error si está vacío
    ***REMOVED***
  ***REMOVED***, [email]);
  
  // Validar nombre
  useEffect(() => ***REMOVED***
    if (displayName) ***REMOVED***
      setNameValid(displayName.trim().length >= 2);
    ***REMOVED*** else ***REMOVED***
      setNameValid(true); // No mostrar error si está vacío
    ***REMOVED***
  ***REMOVED***, [displayName]);
  
  // Validar fortaleza de contraseña
  useEffect(() => ***REMOVED***
    if (password) ***REMOVED***
      const strength = ***REMOVED***
        hasMinLength: password.length >= 6,
        hasUpperCase: /[A-Z]/.test(password),
        hasLowerCase: /[a-z]/.test(password),
        hasNumber: /[0-9]/.test(password)
      ***REMOVED***;
      
      // Agregando paréntesis para clarificar el orden de las operaciones
      strength.isValid = strength.hasMinLength && (
                        (strength.hasUpperCase && strength.hasLowerCase) || 
                        (strength.hasNumber && (strength.hasUpperCase || strength.hasLowerCase))
                       );
      
      setPasswordStrength(strength);
    ***REMOVED*** else ***REMOVED***
      setPasswordStrength(***REMOVED***
        isValid: false,
        hasMinLength: false,
        hasUpperCase: false,
        hasLowerCase: false,
        hasNumber: false
      ***REMOVED***);
    ***REMOVED***
  ***REMOVED***, [password]);
  
  // Verificar que las contraseñas coinciden
  useEffect(() => ***REMOVED***
    if (confirmPassword) ***REMOVED***
      setPasswordsMatch(password === confirmPassword);
    ***REMOVED*** else ***REMOVED***
      setPasswordsMatch(true); // No mostrar error si está vacío
    ***REMOVED***
  ***REMOVED***, [password, confirmPassword]);

  const handleSubmit = async (e) => ***REMOVED***
    e.preventDefault();
    
    // Validación final antes de enviar
    if (!nameValid) ***REMOVED***
      return setError('El nombre debe tener al menos 2 caracteres');
    ***REMOVED***
    
    if (!emailValid) ***REMOVED***
      return setError('Por favor ingresa un email válido');
    ***REMOVED***
    
    if (!passwordStrength.isValid) ***REMOVED***
      return setError('La contraseña no cumple con los requisitos mínimos');
    ***REMOVED***
    
    if (password !== confirmPassword) ***REMOVED***
      return setError('Las contraseñas no coinciden');
    ***REMOVED***
    
    try ***REMOVED***
      setError('');
      setLoading(true);
      await signup(email, password, displayName);
      
      // Navegar a la ruta de redirección
      navigate(redirectTo);
    ***REMOVED*** catch (error) ***REMOVED***
      if (error.code === 'auth/email-already-in-use') ***REMOVED***
        setError('Este email ya está en uso. Intenta iniciar sesión.');
      ***REMOVED*** else if (error.code === 'auth/weak-password') ***REMOVED***
        setError('La contraseña es muy débil. Debe tener al menos 6 caracteres.');
      ***REMOVED*** else ***REMOVED***
        setError('Error al crear la cuenta. Inténtalo de nuevo.');
      ***REMOVED***
      setLoading(false);
    ***REMOVED***
  ***REMOVED***;

  const handleGoogleRegister = async () => ***REMOVED***
    try ***REMOVED***
      setGoogleLoading(true);
      setError('');
      await loginWithGoogle();
      
      // Navegar a la ruta de redirección
      navigate(redirectTo);
    ***REMOVED*** catch (error) ***REMOVED***
      setError('Error al registrarse con Google: ' + error.message);
      setGoogleLoading(false);
    ***REMOVED***
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
      
      ***REMOVED***/* Contenido del registro */***REMOVED***
      <Flex variant="center" className="flex-col fixed inset-0 z-20 bg-transparent p-4">
        <Logo />
        <div className="text-center text-white mb-4">
          <h1 className="text-4xl font-bold mb-2">GestAPP</h1>
          <p className="text-lg">Gestiona tus turnos de trabajo fácilmente.</p>
        </div>
        <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-2xl">
          
          ***REMOVED***error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
              ***REMOVED***error***REMOVED***
            </div>
          )***REMOVED***
          
          <form onSubmit=***REMOVED***handleSubmit***REMOVED*** className="space-y-4">
            <div>
              <label htmlFor="displayName" className="block text-sm font-medium text-gray-700 mb-1">
                Nombre
              </label>
              <input
                id="displayName"
                type="text"
                value=***REMOVED***displayName***REMOVED***
                onChange=***REMOVED***(e) => setDisplayName(e.target.value)***REMOVED***
                className=***REMOVED***`w-full p-2 border rounded-md focus:ring-pink-500 focus:border-pink-500 $***REMOVED***
                  !nameValid && displayName ? 'border-red-500' : 'border-gray-300'
                ***REMOVED***`***REMOVED***
                placeholder="Tu nombre"
                required
              />
              ***REMOVED***!nameValid && displayName && (
                <p className="mt-1 text-xs text-red-500">
                  El nombre debe tener al menos 2 caracteres
                </p>
              )***REMOVED***
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                value=***REMOVED***email***REMOVED***
                onChange=***REMOVED***(e) => setEmail(e.target.value)***REMOVED***
                className=***REMOVED***`w-full p-2 border rounded-md focus:ring-pink-500 focus:border-pink-500 $***REMOVED***
                  !emailValid && email ? 'border-red-500' : 'border-gray-300'
                ***REMOVED***`***REMOVED***
                placeholder="tu@email.com"
                required
              />
              ***REMOVED***!emailValid && email && (
                <p className="mt-1 text-xs text-red-500">
                  Por favor ingresa un email válido
                </p>
              )***REMOVED***
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Contraseña
              </label>
              <div className="relative">
                <input
                  id="password"
                  type=***REMOVED***showPassword ? "text" : "password"***REMOVED***
                  value=***REMOVED***password***REMOVED***
                  onChange=***REMOVED***(e) => setPassword(e.target.value)***REMOVED***
                  className=***REMOVED***`w-full p-2 border rounded-md focus:ring-pink-500 focus:border-pink-500 $***REMOVED***
                    password && !passwordStrength.isValid ? 'border-red-500' : 'border-gray-300'
                  ***REMOVED***`***REMOVED***
                  placeholder="Mínimo 6 caracteres"
                  required
                  minLength=***REMOVED***6***REMOVED***
                />
                <button 
                  type="button"
                  onClick=***REMOVED***() => setShowPassword(!showPassword)***REMOVED***
                  className="absolute right-3 top-2.5 text-gray-500"
                >
                  ***REMOVED***showPassword ? <EyeOff size=***REMOVED***20***REMOVED*** /> : <Eye size=***REMOVED***20***REMOVED*** />***REMOVED***
                </button>
              </div>
              
              ***REMOVED***/* Indicadores de fortaleza de contraseña */***REMOVED***
              ***REMOVED***password && (
                <div className="mt-2 text-xs space-y-1">
                  <p className=***REMOVED***passwordStrength.hasMinLength ? 'text-green-600' : 'text-gray-500'***REMOVED***>
                    ✓ Mínimo 6 caracteres
                  </p>
                  <p className=***REMOVED***passwordStrength.hasUpperCase ? 'text-green-600' : 'text-gray-500'***REMOVED***>
                    ✓ Al menos una letra mayúscula
                  </p>
                  <p className=***REMOVED***passwordStrength.hasLowerCase ? 'text-green-600' : 'text-gray-500'***REMOVED***>
                    ✓ Al menos una letra minúscula
                  </p>
                  <p className=***REMOVED***passwordStrength.hasNumber ? 'text-green-600' : 'text-gray-500'***REMOVED***>
                    ✓ Al menos un número
                  </p>
                </div>
              )***REMOVED***
            </div>
            
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Confirmar contraseña
              </label>
              <div className="relative">
              <input
                id="confirmPassword"
                type=***REMOVED***showPassword ? "text" : "password"***REMOVED***
                value=***REMOVED***confirmPassword***REMOVED***
                onChange=***REMOVED***(e) => setConfirmPassword(e.target.value)***REMOVED***
                className=***REMOVED***`w-full p-2 border rounded-md focus:ring-pink-500 focus:border-pink-500 $***REMOVED***
                  !passwordsMatch && confirmPassword ? 'border-red-500' : 'border-gray-300'
                ***REMOVED***`***REMOVED***
                placeholder="Confirma tu contraseña"
                required
              />
                <button 
                  type="button"
                  onClick=***REMOVED***() => setShowPassword(!showPassword)***REMOVED***
                  className="absolute right-3 top-2.5 text-gray-500"
                >
                  ***REMOVED***showPassword ? <EyeOff size=***REMOVED***20***REMOVED*** /> : <Eye size=***REMOVED***20***REMOVED*** />***REMOVED***
                </button>
              </div>
              ***REMOVED***!passwordsMatch && confirmPassword && (
                <p className="mt-1 text-xs text-red-500">
                  Las contraseñas no coinciden
                </p>
              )***REMOVED***
            </div>
            
            <Button
              type="submit"
              disabled=***REMOVED***loading || !emailValid || !passwordStrength.isValid || !passwordsMatch || !nameValid***REMOVED***
              loading=***REMOVED***loading***REMOVED***
              className="w-full"
            >
              Registrarse
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
            onClick=***REMOVED***handleGoogleRegister***REMOVED***
            loading=***REMOVED***googleLoading***REMOVED***
            variant="secondary"
            className="w-full mb-4"
            icon=***REMOVED***GoogleIcon***REMOVED***
            iconPosition="left"
          >
            Registrarse con Google
          </Button>
          
          <div className="text-center">
            <p className="text-gray-600 mb-2">¿Ya tienes una cuenta?</p>
            <Link 
              to="/login"
              className="text-pink-600 hover:text-pink-800 font-medium"
            >
              Inicia sesión aquí
            </Link>
          </div>
        </div>
      </Flex>
    </div>
  );
***REMOVED***;

export default Register;