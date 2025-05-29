// src/pages/auth/ResetPassword.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { confirmPasswordReset } from 'firebase/auth';
import { auth } from '../../services/firebase';

// Nueva importación estructurada
import Button from '../../components/ui/Button';

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const queryParams = new URLSearchParams(location.search);
  const oobCode = queryParams.get('oobCode');
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [passwordStrength, setPasswordStrength] = useState({
    isValid: false,
    hasMinLength: false,
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumber: false
  });
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  
  useEffect(() => {
    if (!oobCode) {
      setError('Enlace inválido o expirado. Por favor, solicita un nuevo enlace de recuperación.');
    }
  }, [oobCode]);
  
  useEffect(() => {
    const strength = {
      hasMinLength: password.length >= 6,
      hasUpperCase: /[A-Z]/.test(password),
      hasLowerCase: /[a-z]/.test(password),
      hasNumber: /[0-9]/.test(password)
    };
    
    strength.isValid =
      strength.hasMinLength &&
      (
        (strength.hasUpperCase && strength.hasLowerCase) ||
        (strength.hasNumber && (strength.hasUpperCase || strength.hasLowerCase))
      );
    
    setPasswordStrength(strength);
  }, [password]);
  
  useEffect(() => {
    if (confirmPassword) {
      setPasswordsMatch(password === confirmPassword);
    } else {
      setPasswordsMatch(true);
    }
  }, [password, confirmPassword]);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!passwordStrength.isValid) {
      return setError('La contraseña no cumple con los requisitos mínimos.');
    }
    
    if (!passwordsMatch) {
      return setError('Las contraseñas no coinciden.');
    }
    
    try {
      setLoading(true);
      setError('');
      
      await confirmPasswordReset(auth, oobCode, password);
      
      setSuccess(true);
      setTimeout(() => {
        navigate('/login', { state: { passwordReset: true } });
      }, 3000);
    } catch (error) {
      console.error('Error al restablecer contraseña:', error);
      if (error.code === 'auth/expired-action-code') {
        setError('El enlace ha expirado. Por favor, solicita un nuevo enlace de recuperación.');
      } else if (error.code === 'auth/invalid-action-code') {
        setError('El enlace es inválido. Por favor, solicita un nuevo enlace de recuperación.');
      } else {
        setError('Error al restablecer tu contraseña. Por favor, inténtalo de nuevo.');
      }
      setLoading(false);
    }
  };
  
  return (
    <div className="fixed inset-0 overflow-hidden">
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
      
      <div className="fixed inset-0 z-20 bg-transparent flex items-center justify-center p-4">
        <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-2xl">
          <h1 className="text-2xl font-bold text-center mb-2">Crear nueva contraseña</h1>
          <p className="text-center text-gray-600 mb-6">
            Ingresa y confirma tu nueva contraseña.
          </p>
          
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
              {error}
            </div>
          )}
          
          {success && (
            <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md text-sm">
              ¡Tu contraseña ha sido restablecida con éxito! Serás redirigido en unos segundos...
            </div>
          )}
          
          {!success && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-2">Nueva contraseña</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full p-2 border rounded focus:ring-pink-500 focus:border-pink-500 ${
                    password && !passwordStrength.isValid ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Mínimo 6 caracteres"
                  required
                />
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
                <label className="block text-gray-700 mb-2">Confirmar contraseña</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`w-full p-2 border rounded focus:ring-pink-500 focus:border-pink-500 ${
                    confirmPassword && !passwordsMatch ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Repite tu contraseña"
                  required
                />
                {confirmPassword && !passwordsMatch && (
                  <p className="mt-1 text-xs text-red-500">
                    Las contraseñas no coinciden
                  </p>
                )}
              </div>
              
              <Button
                type="submit"
                disabled={loading || !passwordStrength.isValid || !passwordsMatch}
                loading={loading}
                className="w-full"
              >
                Confirmar nueva contraseña
              </Button>
            </form>
          )}
          
          <div className="mt-4 text-center">
            <Button
              type="button"
              onClick={() => navigate('/login')}
              variant="ghost"
              className="text-sm text-pink-600 hover:text-pink-800"
            >
              Volver a inicio de sesión
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;