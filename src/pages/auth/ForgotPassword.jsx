// src/pages/auth/ForgotPassword.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const ForgotPassword = () => {
  const { resetPassword } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Obtener email de la ubicación si existe
  const [email, setEmail] = useState(location.state?.email || '');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailValid, setEmailValid] = useState(false);

  // Validar email cuando cambia
  useEffect(() => {
    // Expresión regular para validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setEmailValid(emailRegex.test(email));
  }, [email]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!emailValid) {
      return setError('Por favor ingresa un email válido');
    }

    try {
      setError('');
      setLoading(true);
      await resetPassword(email);
      
      // Redirigir a login con mensaje de éxito
      navigate('/login', { 
        state: { 
          emailSent: true,
          email: email
        } 
      });
    } catch (error) {
      console.error('Error al enviar email de recuperación:', error);
      setError('No se pudo enviar el email de recuperación. Verifica tu dirección de correo.');
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
      
      {/* Contenido de recuperación */}
      <div className="fixed inset-0 z-20 bg-transparent flex items-center justify-center p-4">
        <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-2xl">
          <h1 className="text-2xl font-bold text-center mb-2">Recuperar contraseña</h1>
          <p className="text-center text-gray-600 mb-6">
            Ingresa tu dirección de correo electrónico y te enviaremos un enlace para restablecer tu contraseña.
          </p>
          
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-700 mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded focus:ring-pink-500 focus:border-pink-500"
                placeholder="tu@email.com"
                required
              />
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="py-2 px-4 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancelar
              </button>
              
              <button
                type="submit"
                disabled={loading || !emailValid}
                className="flex-1 py-2 px-4 bg-pink-600 hover:bg-pink-700 text-white font-semibold rounded-md disabled:opacity-50"
              >
                {loading ? "Enviando..." : "Recuperar contraseña"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;