// src/pages/auth/Register.jsx

import React, ***REMOVED*** useState, useEffect ***REMOVED*** from 'react';
import ***REMOVED*** Link, useNavigate, useLocation ***REMOVED*** from 'react-router-dom';
import ***REMOVED*** Eye, EyeOff ***REMOVED*** from 'lucide-react';
import ***REMOVED*** useAuth ***REMOVED*** from '../../contexts/AuthContext';

// New structured import
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

  // Get redirect route from navigation state
  const redirectTo = location.state?.redirectTo || '/';
  
  // States for validations
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
  
  // Validate email
  useEffect(() => ***REMOVED***
    if (email) ***REMOVED***
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      setEmailValid(emailRegex.test(email));
    ***REMOVED*** else ***REMOVED***
      setEmailValid(true); // Don't show error if empty
    ***REMOVED***
  ***REMOVED***, [email]);
  
  // Validate name
  useEffect(() => ***REMOVED***
    if (displayName) ***REMOVED***
      setNameValid(displayName.trim().length >= 2);
    ***REMOVED*** else ***REMOVED***
      setNameValid(true); // Don't show error if empty
    ***REMOVED***
  ***REMOVED***, [displayName]);
  
  // Validate password strength
  useEffect(() => ***REMOVED***
    if (password) ***REMOVED***
      const strength = ***REMOVED***
        hasMinLength: password.length >= 6,
        hasUpperCase: /[A-Z]/.test(password),
        hasLowerCase: /[a-z]/.test(password),
        hasNumber: /[0-9]/.test(password)
      ***REMOVED***;
      
      // Adding parentheses to clarify the order of operations
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
  
  // Check passwords match
  useEffect(() => ***REMOVED***
    if (confirmPassword) ***REMOVED***
      setPasswordsMatch(password === confirmPassword);
    ***REMOVED*** else ***REMOVED***
      setPasswordsMatch(true); // Don't show error if empty
    ***REMOVED***
  ***REMOVED***, [password, confirmPassword]);

  const handleSubmit = async (e) => ***REMOVED***
    e.preventDefault();
    
    // Final validation before submitting
    if (!nameValid) ***REMOVED***
      return setError('Name must be at least 2 characters');
    ***REMOVED***
    
    if (!emailValid) ***REMOVED***
      return setError('Please enter a valid email');
    ***REMOVED***
    
    if (!passwordStrength.isValid) ***REMOVED***
      return setError('Password does not meet minimum requirements');
    ***REMOVED***
    
    if (password !== confirmPassword) ***REMOVED***
      return setError('Passwords do not match');
    ***REMOVED***
    
    try ***REMOVED***
      setError('');
      setLoading(true);
      await signup(email, password, displayName);
      
      // Navigate to redirect route
      navigate(redirectTo);
    ***REMOVED*** catch (error) ***REMOVED***
      if (error.code === 'auth/email-already-in-use') ***REMOVED***
        setError('This email is already in use. Try signing in.');
      ***REMOVED*** else if (error.code === 'auth/weak-password') ***REMOVED***
        setError('Password is too weak. It must be at least 6 characters.');
      ***REMOVED*** else ***REMOVED***
        setError('Error creating account. Please try again.');
      ***REMOVED***
      setLoading(false);
    ***REMOVED***
  ***REMOVED***;

  const handleGoogleRegister = async () => ***REMOVED***
    try ***REMOVED***
      setGoogleLoading(true);
      setError('');
      await loginWithGoogle();
      
      // Navigate to redirect route
      navigate(redirectTo);
    ***REMOVED*** catch (error) ***REMOVED***
      setError('Error registering with Google: ' + error.message);
      setGoogleLoading(false);
    ***REMOVED***
  ***REMOVED***;

  return (
    <div className="fixed inset-0">
      ***REMOVED***/* Background video */***REMOVED***
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
      
      ***REMOVED***/* Register content */***REMOVED***
      <Flex variant="center" className="flex-col fixed inset-0 z-20 bg-transparent p-4 py-12 overflow-y-auto">
        <Logo />
        <div className="text-center text-white mb-4">
          <h1 className="text-4xl font-bold mb-2">GestAPP</h1>
          <p className="text-lg">Manage your work shifts easily.</p>
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
                Name
              </label>
              <input
                id="displayName"
                type="text"
                value=***REMOVED***displayName***REMOVED***
                onChange=***REMOVED***(e) => setDisplayName(e.target.value)***REMOVED***
                className=***REMOVED***`w-full p-2 border rounded-md focus:ring-pink-500 focus:border-pink-500 $***REMOVED***
                  !nameValid && displayName ? 'border-red-500' : 'border-gray-300'
                ***REMOVED***`***REMOVED***
                placeholder="Your name"
                required
              />
              ***REMOVED***!nameValid && displayName && (
                <p className="mt-1 text-xs text-red-500">
                  Name must be at least 2 characters
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
                placeholder="your@email.com"
                required
              />
              ***REMOVED***!emailValid && email && (
                <p className="mt-1 text-xs text-red-500">
                  Please enter a valid email
                </p>
              )***REMOVED***
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
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
                  placeholder="Minimum 6 characters"
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
              
              ***REMOVED***/* Password strength indicators */***REMOVED***
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
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
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
                placeholder="Confirm your password"
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
                  Passwords do not match
                </p>
              )***REMOVED***
            </div>
            
            <Button
              type="submit"
              disabled=***REMOVED***loading || !emailValid || !passwordStrength.isValid || !passwordsMatch || !nameValid***REMOVED***
              loading=***REMOVED***loading***REMOVED***
              className="w-full"
            >
              Register
            </Button>
          </form>
          
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white px-3 text-gray-500 text-sm">or</span>
            </div>
          </div>
          
          <Button
            onClick=***REMOVED***handleGoogleRegister***REMOVED***
            loading=***REMOVED***googleLoading***REMOVED***
            variant="secondary"
            className="w-full mb-4"
            icon=***REMOVED***GoogleIcon***REMOVED***
            iconPosition="left"
            bgColor="#121212"
            textColor="white"
          >
            Register with Google
          </Button>
          
          <div className="text-center">
            <p className="text-gray-600 mb-2">Already have an account?</p>
            <Link 
              to="/login"
              className="text-pink-600 hover:text-pink-800 font-medium"
            >
              Sign in here
            </Link>
          </div>
        </div>
      </Flex>
    </div>
  );
***REMOVED***;

export default Register;