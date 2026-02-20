// src/pages/auth/ForgotPassword.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../../components/ui/Button';
import AuthLayout from '../../components/layout/AuthLayout';
import logger from '../../utils/logger';

const ForgotPassword = () => {
  const { resetPassword } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState(location.state?.email || '');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailValid, setEmailValid] = useState(false);

  useEffect(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setEmailValid(emailRegex.test(email));
  }, [email]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!emailValid) return setError('Please enter a valid email');

    try {
      setError('');
      setLoading(true);
      await resetPassword(email);
      navigate('/login', { state: { emailSent: true, email } });
    } catch (error) {
      logger.error('Error sending recovery email:', error);
      setError('Could not send recovery email. Check your email address.');
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Orary" subtitle="Recover your password">
      <p className="text-center text-gray-600 text-sm mb-4">
        Enter your email address and we will send you a link to reset your password.
      </p>

      {error && (
        <div className="mb-3 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-offset-0 transition-colors"
            placeholder="your@email.com"
            required
          />
        </div>

        <div className="flex items-center gap-3">
          <Button
            type="button"
            onClick={() => navigate('/login')}
            variant="cancel"
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={loading || !emailValid}
            loading={loading}
            className="flex-1"
          >
            Recover password
          </Button>
        </div>
      </form>
    </AuthLayout>
  );
};

export default ForgotPassword;
