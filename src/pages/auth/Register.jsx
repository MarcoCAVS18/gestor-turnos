// src/pages/auth/Register.jsx

import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

// Nueva importación estructurada
import Button from '../../components/ui/Button';

const Register = () => {
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
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

  const handleGoogleSignup = async () => {
    try {
      setLoading(true);
      setError('');
      await loginWithGoogle();
      
      // Navegar a la ruta de redirección
      navigate(redirectTo);
    } catch (error) {
      setError('Error al registrarse con Google: ' + error.message);
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 overflow-hidden">
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
      <div className="fixed inset-0 z-20 bg-transparent flex items-center justify-center p-4">
        <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-2xl">
          <h2 className="text-2xl font-bold text-center mb-6">Crear una cuenta</h2>
          
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
                  {showPassword ? "Ocultar" : "Mostrar"}
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
          
          <button 
            onClick={handleGoogleSignup}
            disabled={loading}
            className="w-full flex items-center justify-center bg-black hover:bg-gray-800 text-white font-medium py-2 px-4 rounded-md mb-6"
          >
            <svg className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
              <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
              <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
              <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
              <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
            </svg>
            Registrarse con Google
          </button>
          
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
      </div>
    </div>
  );
};

export default Register;