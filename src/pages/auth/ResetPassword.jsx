// src/pages/auth/ResetPassword.jsx

import React, ***REMOVED*** useState, useEffect ***REMOVED*** from 'react';
import ***REMOVED*** useNavigate, useLocation ***REMOVED*** from 'react-router-dom';
import ***REMOVED*** confirmPasswordReset ***REMOVED*** from 'firebase/auth';
import ***REMOVED*** auth ***REMOVED*** from '../../services/firebase';

// Nueva importación estructurada
import Button from '../../components/ui/Button';

const ResetPassword = () => ***REMOVED***
  const navigate = useNavigate();
  const location = useLocation();
  
  const queryParams = new URLSearchParams(location.search);
  const oobCode = queryParams.get('oobCode');
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [passwordStrength, setPasswordStrength] = useState(***REMOVED***
    isValid: false,
    hasMinLength: false,
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumber: false
  ***REMOVED***);
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  
  useEffect(() => ***REMOVED***
    if (!oobCode) ***REMOVED***
      setError('Enlace inválido o expirado. Por favor, solicita un nuevo enlace de recuperación.');
    ***REMOVED***
  ***REMOVED***, [oobCode]);
  
  useEffect(() => ***REMOVED***
    const strength = ***REMOVED***
      hasMinLength: password.length >= 6,
      hasUpperCase: /[A-Z]/.test(password),
      hasLowerCase: /[a-z]/.test(password),
      hasNumber: /[0-9]/.test(password)
    ***REMOVED***;
    
    strength.isValid =
      strength.hasMinLength &&
      (
        (strength.hasUpperCase && strength.hasLowerCase) ||
        (strength.hasNumber && (strength.hasUpperCase || strength.hasLowerCase))
      );
    
    setPasswordStrength(strength);
  ***REMOVED***, [password]);
  
  useEffect(() => ***REMOVED***
    if (confirmPassword) ***REMOVED***
      setPasswordsMatch(password === confirmPassword);
    ***REMOVED*** else ***REMOVED***
      setPasswordsMatch(true);
    ***REMOVED***
  ***REMOVED***, [password, confirmPassword]);
  
  const handleSubmit = async (e) => ***REMOVED***
    e.preventDefault();
    
    if (!passwordStrength.isValid) ***REMOVED***
      return setError('La contraseña no cumple con los requisitos mínimos.');
    ***REMOVED***
    
    if (!passwordsMatch) ***REMOVED***
      return setError('Las contraseñas no coinciden.');
    ***REMOVED***
    
    try ***REMOVED***
      setLoading(true);
      setError('');
      
      await confirmPasswordReset(auth, oobCode, password);
      
      setSuccess(true);
      setTimeout(() => ***REMOVED***
        navigate('/login', ***REMOVED*** state: ***REMOVED*** passwordReset: true ***REMOVED*** ***REMOVED***);
      ***REMOVED***, 3000);
    ***REMOVED*** catch (error) ***REMOVED***
      console.error('Error al restablecer contraseña:', error);
      if (error.code === 'auth/expired-action-code') ***REMOVED***
        setError('El enlace ha expirado. Por favor, solicita un nuevo enlace de recuperación.');
      ***REMOVED*** else if (error.code === 'auth/invalid-action-code') ***REMOVED***
        setError('El enlace es inválido. Por favor, solicita un nuevo enlace de recuperación.');
      ***REMOVED*** else ***REMOVED***
        setError('Error al restablecer tu contraseña. Por favor, inténtalo de nuevo.');
      ***REMOVED***
      setLoading(false);
    ***REMOVED***
  ***REMOVED***;
  
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
          
          ***REMOVED***error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
              ***REMOVED***error***REMOVED***
            </div>
          )***REMOVED***
          
          ***REMOVED***success && (
            <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md text-sm">
              ¡Tu contraseña ha sido restablecida con éxito! Serás redirigido en unos segundos...
            </div>
          )***REMOVED***
          
          ***REMOVED***!success && (
            <form onSubmit=***REMOVED***handleSubmit***REMOVED*** className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-2">Nueva contraseña</label>
                <input
                  type="password"
                  value=***REMOVED***password***REMOVED***
                  onChange=***REMOVED***(e) => setPassword(e.target.value)***REMOVED***
                  className=***REMOVED***`w-full p-2 border rounded focus:ring-pink-500 focus:border-pink-500 $***REMOVED***
                    password && !passwordStrength.isValid ? 'border-red-500' : 'border-gray-300'
                  ***REMOVED***`***REMOVED***
                  placeholder="Mínimo 6 caracteres"
                  required
                />
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
                <label className="block text-gray-700 mb-2">Confirmar contraseña</label>
                <input
                  type="password"
                  value=***REMOVED***confirmPassword***REMOVED***
                  onChange=***REMOVED***(e) => setConfirmPassword(e.target.value)***REMOVED***
                  className=***REMOVED***`w-full p-2 border rounded focus:ring-pink-500 focus:border-pink-500 $***REMOVED***
                    confirmPassword && !passwordsMatch ? 'border-red-500' : 'border-gray-300'
                  ***REMOVED***`***REMOVED***
                  placeholder="Repite tu contraseña"
                  required
                />
                ***REMOVED***confirmPassword && !passwordsMatch && (
                  <p className="mt-1 text-xs text-red-500">
                    Las contraseñas no coinciden
                  </p>
                )***REMOVED***
              </div>
              
              <Button
                type="submit"
                disabled=***REMOVED***loading || !passwordStrength.isValid || !passwordsMatch***REMOVED***
                loading=***REMOVED***loading***REMOVED***
                className="w-full"
              >
                Confirmar nueva contraseña
              </Button>
            </form>
          )***REMOVED***
          
          <div className="mt-4 text-center">
            <Button
              type="button"
              onClick=***REMOVED***() => navigate('/login')***REMOVED***
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
***REMOVED***;

export default ResetPassword;