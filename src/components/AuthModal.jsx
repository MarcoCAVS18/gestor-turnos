// src/components/AuthModal.jsx
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { X } from 'lucide-react';

const AuthModal = ({ visible, onClose }) => {
  const { login } = useAuth();
  const [step, setStep] = useState('select'); // 'select', 'email', 'password'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!visible) return null;

  const handleEmailNext = () => {
    if (!email) return setError('Por favor ingresá un email válido');
    setError('');
    setStep('password');
  };

  const handleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      await login(email, password);
      onClose();
    } catch (err) {
      setError('Email o contraseña incorrectos');
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-60 flex items-center justify-center">
      <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-lg relative">
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-500 hover:text-black">
          <X size={20} />
        </button>

        <h2 className="text-xl font-bold text-center mb-4">Iniciar sesión</h2>

        {step === 'select' && (
          <div className="space-y-3">
            <button
              onClick={() => setStep('email')}
              className="w-full py-2 px-4 bg-pink-600 text-white rounded-xl hover:bg-pink-700 transition"
            >
              Continuar con Email
            </button>

            <button
              onClick={() => alert('Implementar login con Google')}
              className="w-full py-2 px-4 border border-gray-300 rounded-xl hover:bg-gray-50 transition"
            >
              Continuar con Google
            </button>
          </div>
        )}

        {step === 'email' && (
          <div className="space-y-4">
            <input
              type="email"
              placeholder="Tu email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded-lg"
            />
            <button
              onClick={handleEmailNext}
              className="w-full py-2 bg-pink-600 text-white rounded-xl hover:bg-pink-700 transition"
            >
              Continuar
            </button>
          </div>
        )}

        {step === 'password' && (
          <div className="space-y-4">
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded-lg"
            />
            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full py-2 bg-pink-600 text-white rounded-xl hover:bg-pink-700 transition"
            >
              {loading ? 'Iniciando...' : 'Iniciar sesión'}
            </button>
            <button onClick={() => setStep('email')} className="text-sm text-gray-500 hover:underline">
              Volver
            </button>
          </div>
        )}

        {error && <p className="text-sm text-red-500 mt-3">{error}</p>}
      </div>
    </div>
  );
};

export default AuthModal;
