// src/pages/auth/Register.jsx

import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

// Nueva importación estructurada
import Button from '../../components/ui/Button';
import Flex from '../../components/ui/Flex';
import Logo from '../../components/icons/Logo';

import GoogleIcon from '../../components/icons/GoogleIcon';

const Register = () => {
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { signup, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Obtener la ruta de redirección de los state de navegación
  const redirectTo = location.state?.redirectTo || '/';
  
  // Estados para validaciones
  const [emailValid, setEmailValid] = useState(true);
  const [passwordStrength, setPasswordStrength] = useState({
    isValid: false,
    hasMinLength: false,
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumber: false
  });
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [nameValid, setNameValid] = useState(true);
  
  // Validar email
  useEffect(() => {
    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      setEmailValid(emailRegex.test(email));
    } else {
      setEmailValid(true); // No mostrar error si está vacío
    }
  }, [email]);
  
  // Validar nombre
  useEffect(() => {
    if (displayName) {
      setNameValid(displayName.trim().length >= 2);
    } else {
      setNameValid(true); // No mostrar error si está vacío
    }
  }, [displayName]);
  
  // Validar fortaleza de contraseña
  useEffect(() => {
    if (password) {
      const strength = {
        hasMinLength: password.length >= 6,
        hasUpperCase: /[A-Z]/.test(password),
        hasLowerCase: /[a-z]/.test(password),
        hasNumber: /[0-9]/.test(password)
      };
      
      // Agregando paréntesis para clarificar el orden de las operaciones
      strength.isValid = strength.hasMinLength && (
                        (strength.hasUpperCase && strength.hasLowerCase) || 
                        (strength.hasNumber && (strength.hasUpperCase || strength.hasLowerCase))
                       );
      
      setPasswordStrength(strength);
    } else {
      setPasswordStrength({
        isValid: false,
        hasMinLength: false,
        hasUpperCase: false,
        hasLowerCase: false,
        hasNumber: false
      });
    }
  }, [password]);
  
  // Verificar que las contraseñas coinciden
  useEffect(() => {
    if (confirmPassword) {
      setPasswordsMatch(password === confirmPassword);
    } else {
      setPasswordsMatch(true); // No mostrar error si está vacío
    }
  }, [password, confirmPassword]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validación final antes de enviar
    if (!nameValid) {
      return setError('El nombre debe tener al menos 2 caracteres');
    }
    
    if (!emailValid) {
      return setError('Por favor ingresa un email válido');
    }
    
    if (!passwordStrength.isValid) {
      return setError('La contraseña no cumple con los requisitos mínimos');
    }
    
    if (password !== confirmPassword) {
      return setError('Las contraseñas no coinciden');
    }
    
    try {
      setError('');
      setLoading(true);
      await signup(email, password, displayName);
      
      // Navegar a la ruta de redirección
      navigate(redirectTo);
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        setError('Este email ya está en uso. Intenta iniciar sesión.');
      } else if (error.code === 'auth/weak-password') {
        setError('La contraseña es muy débil. Debe tener al menos 6 caracteres.');
      } else {
        setError('Error al crear la cuenta. Inténtalo de nuevo.');
      }
      setLoading(false);
    }
  };

  const handleGoogleRegister = async () => {
    try {
      setGoogleLoading(true);
      setError('');
      await loginWithGoogle();
      
      // Navegar a la ruta de redirección
      navigate(redirectTo);
    } catch (error) {
      setError('Error al registrarse con Google: ' + error.message);
      setGoogleLoading(false);
    }
  };

  return (
    <div className="fixed inset-0">
      {/* Video de fondo */}
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
      
      {/* Contenido del registro */}
      <Flex variant="center" className="flex-col fixed inset-0 z-20 bg-transparent p-4 py-12 overflow-y-auto">
        <Logo />
        <div className="text-center text-white mb-4">
          <h1 className="text-4xl font-bold mb-2">GestAPP</h1>
          <p className="text-lg">Gestiona tus turnos de trabajo fácilmente.</p>
        </div>
        <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-2xl">
          
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="displayName" className="block text-sm font-medium text-gray-700 mb-1">
                Nombre
              </label>
              <input
                id="displayName"
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className={`w-full p-2 border rounded-md focus:ring-pink-500 focus:border-pink-500 ${
                  !nameValid && displayName ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Tu nombre"
                required
              />
              {!nameValid && displayName && (
                <p className="mt-1 text-xs text-red-500">
                  El nombre debe tener al menos 2 caracteres
                </p>
              )}
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full p-2 border rounded-md focus:ring-pink-500 focus:border-pink-500 ${
                  !emailValid && email ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="tu@email.com"
                required
              />
              {!emailValid && email && (
                <p className="mt-1 text-xs text-red-500">
                  Por favor ingresa un email válido
                </p>
              )}
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Contraseña
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full p-2 border rounded-md focus:ring-pink-500 focus:border-pink-500 ${
                    password && !passwordStrength.isValid ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Mínimo 6 caracteres"
                  required
                  minLength={6}
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-gray-500"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              
              {/* Indicadores de fortaleza de contraseña */}
              {password && (
                <div className="mt-2 text-xs space-y-1">
                  <p className={passwordStrength.hasMinLength ? 'text-green-600' : 'text-gray-500'}>
                    ✓ Mínimo 6 caracteres
                  </p>
                  <p className={passwordStrength.hasUpperCase ? 'text-green-600' : 'text-gray-500'}>
                    ✓ Al menos una letra mayúscula
                  </p>
                  <p className={passwordStrength.hasLowerCase ? 'text-green-600' : 'text-gray-500'}>
                    ✓ Al menos una letra minúscula
                  </p>
                  <p className={passwordStrength.hasNumber ? 'text-green-600' : 'text-gray-500'}>
                    ✓ Al menos un número
                  </p>
                </div>
              )}
            </div>
            
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Confirmar contraseña
              </label>
              <div className="relative">
              <input
                id="confirmPassword"
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`w-full p-2 border rounded-md focus:ring-pink-500 focus:border-pink-500 ${
                  !passwordsMatch && confirmPassword ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Confirma tu contraseña"
                required
              />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-gray-500"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {!passwordsMatch && confirmPassword && (
                <p className="mt-1 text-xs text-red-500">
                  Las contraseñas no coinciden
                </p>
              )}
            </div>
            
            <Button
              type="submit"
              disabled={loading || !emailValid || !passwordStrength.isValid || !passwordsMatch || !nameValid}
              loading={loading}
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
            onClick={handleGoogleRegister}
            loading={googleLoading}
            variant="secondary"
            className="w-full mb-4"
            icon={GoogleIcon}
            iconPosition="left"
            bgColor="#121212"
            textColor="white"
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
};

export default Register;