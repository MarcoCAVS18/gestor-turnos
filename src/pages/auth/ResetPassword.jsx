// src/pages/auth/ResetPassword.jsx

import React, ***REMOVED*** useState, useEffect ***REMOVED*** from 'react';
import ***REMOVED*** useNavigate, useLocation ***REMOVED*** from 'react-router-dom';
import ***REMOVED*** confirmPasswordReset ***REMOVED*** from 'firebase/auth';
import ***REMOVED*** auth ***REMOVED*** from '../../services/firebase';

// New structured import
import Button from '../../components/ui/Button';
import Flex from '../../components/ui/Flex';
import Logo from '../../components/icons/Logo';

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
      setError('Invalid or expired link. Please request a new recovery link.');
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
      return setError('Password does not meet minimum requirements.');
    ***REMOVED***
    
    if (!passwordsMatch) ***REMOVED***
      return setError('Passwords do not match.');
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
      console.error('Error resetting password:', error);
      if (error.code === 'auth/expired-action-code') ***REMOVED***
        setError('The link has expired. Please request a new recovery link.');
      ***REMOVED*** else if (error.code === 'auth/invalid-action-code') ***REMOVED***
        setError('The link is invalid. Please request a new recovery link.');
      ***REMOVED*** else ***REMOVED***
        setError('Error resetting your password. Please try again.');
      ***REMOVED***
      setLoading(false);
    ***REMOVED***
  ***REMOVED***;
  
  return (
    <div className="fixed inset-0">
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
          Your browser does not support videos.
        </video>
      </div>
      
      <Flex variant="center" className="flex-col fixed inset-0 z-20 bg-transparent p-4 py-12 overflow-y-auto">
        <Logo />
        <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-2xl">
          <h1 className="text-2xl font-bold text-center mb-2">Create new password</h1>
          <p className="text-center text-gray-600 mb-6">
            Enter and confirm your new password.
          </p>
          
          ***REMOVED***error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
              ***REMOVED***error***REMOVED***
            </div>
          )***REMOVED***
          
          ***REMOVED***success && (
            <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md text-sm">
              Your password has been successfully reset! You will be redirected in a few seconds...
            </div>
          )***REMOVED***
          
          ***REMOVED***!success && (
            <form onSubmit=***REMOVED***handleSubmit***REMOVED*** className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-2">New password</label>
                <input
                  type="password"
                  value=***REMOVED***password***REMOVED***
                  onChange=***REMOVED***(e) => setPassword(e.target.value)***REMOVED***
                  className=***REMOVED***`w-full p-2 border rounded focus:ring-pink-500 focus:border-pink-500 $***REMOVED***
                    password && !passwordStrength.isValid ? 'border-red-500' : 'border-gray-300'
                  ***REMOVED***`***REMOVED***
                  placeholder="Minimum 6 characters"
                  required
                />
                ***REMOVED***password && (
                  <div className="mt-2 text-xs space-y-1">
                    <p className=***REMOVED***passwordStrength.hasMinLength ? 'text-green-600' : 'text-gray-500'***REMOVED***>
                      ✓ Minimum 6 characters
                    </p>
                    <p className=***REMOVED***passwordStrength.hasUpperCase ? 'text-green-600' : 'text-gray-500'***REMOVED***>
                      ✓ At least one uppercase letter
                    </p>
                    <p className=***REMOVED***passwordStrength.hasLowerCase ? 'text-green-600' : 'text-gray-500'***REMOVED***>
                      ✓ At least one lowercase letter
                    </p>
                    <p className=***REMOVED***passwordStrength.hasNumber ? 'text-green-600' : 'text-gray-500'***REMOVED***>
                      ✓ At least one number
                    </p>
                  </div>
                )***REMOVED***
              </div>
              
              <div>
                <label className="block text-gray-700 mb-2">Confirm password</label>
                <input
                  type="password"
                  value=***REMOVED***confirmPassword***REMOVED***
                  onChange=***REMOVED***(e) => setConfirmPassword(e.target.value)***REMOVED***
                  className=***REMOVED***`w-full p-2 border rounded focus:ring-pink-500 focus:border-pink-500 $***REMOVED***
                    confirmPassword && !passwordsMatch ? 'border-red-500' : 'border-gray-300'
                  ***REMOVED***`***REMOVED***
                  placeholder="Repeat your password"
                  required
                />
                ***REMOVED***confirmPassword && !passwordsMatch && (
                  <p className="mt-1 text-xs text-red-500">
                    Passwords do not match
                  </p>
                )***REMOVED***
              </div>
              
              <Button
                type="submit"
                disabled=***REMOVED***loading || !passwordStrength.isValid || !passwordsMatch***REMOVED***
                loading=***REMOVED***loading***REMOVED***
                className="w-full"
              >
                Confirm new password
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
              Back to login
            </Button>
          </div>
        </div>
      </Flex>
    </div>
  );
***REMOVED***;

export default ResetPassword;