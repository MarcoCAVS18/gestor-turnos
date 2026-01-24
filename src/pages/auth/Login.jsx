// src/pages/auth/Login.jsx
import React, ***REMOVED*** useState, useEffect ***REMOVED*** from 'react';
import ***REMOVED*** useNavigate, useLocation ***REMOVED*** from 'react-router-dom';
import ***REMOVED*** useAuth ***REMOVED*** from '../../contexts/AuthContext';
import ***REMOVED*** Mail, Lock, Eye, EyeOff ***REMOVED*** from 'lucide-react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Card from '../../components/ui/Card';
import Flex from '../../components/ui/Flex';
import Logo from '../../components/icons/Logo';

import GoogleIcon from '../../components/icons/GoogleIcon';

const Login = () => ***REMOVED***
  const ***REMOVED*** login, loginWithGoogle ***REMOVED*** = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Get redirect route
  const redirectTo = location.state?.redirectTo || '/dashboard';

  // Detect if coming from forgot-password
  useEffect(() => ***REMOVED***
    if (location.state && location.state.emailSent) ***REMOVED***
      setSuccessMessage('We have sent a recovery link to your email.');
      setEmail(location.state.email || '');
      
      const timer = setTimeout(() => ***REMOVED***
        setSuccessMessage('');
      ***REMOVED***, 4000);
      
      return () => clearTimeout(timer);
    ***REMOVED***
  ***REMOVED***, [location]);

  const handleLogin = async (e) => ***REMOVED***
    e.preventDefault();
    if (!email || !password) ***REMOVED***
      return setError('Please enter your email and password');
    ***REMOVED***

    setLoading(true);
    setError('');
    try ***REMOVED***
      await login(email, password);
      navigate(redirectTo);
    ***REMOVED*** catch (err) ***REMOVED***
      setError('Incorrect email or password');
      setLoading(false);
    ***REMOVED***
  ***REMOVED***;

  const handleGoogleLogin = async () => ***REMOVED***
    setGoogleLoading(true);
    setError('');
    try ***REMOVED***
      await loginWithGoogle();
      navigate(redirectTo);
    ***REMOVED*** catch (err) ***REMOVED***
      setError('Error signing in with Google');
      setGoogleLoading(false);
    ***REMOVED***
  ***REMOVED***;

  const handleRegister = () => ***REMOVED***
    navigate('/register', ***REMOVED*** 
      state: redirectTo ? ***REMOVED*** redirectTo ***REMOVED*** : undefined 
    ***REMOVED***);
  ***REMOVED***;

  const handleForgotPassword = () => ***REMOVED***
    navigate('/forgot-password', ***REMOVED*** state: ***REMOVED*** email ***REMOVED*** ***REMOVED***);
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
      
      ***REMOVED***/* Login content */***REMOVED***
      <Flex variant="center" className="flex-col fixed inset-0 z-20 bg-transparent p-4 py-12 overflow-y-auto">
        <Logo />
        <div className="text-center text-white mb-4">
          <h1 className="text-4xl font-bold mb-2">GestAPP</h1>
          <p className="text-lg">Manage your work shifts easily.</p>
        </div>
        <Card className="w-full max-w-md shadow-2xl" padding="lg">
          
          ***REMOVED***error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
              ***REMOVED***error***REMOVED***
            </div>
          )***REMOVED***
          
          ***REMOVED***successMessage && (
            <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md text-sm">
              ***REMOVED***successMessage***REMOVED***
            </div>
          )***REMOVED***
          
          <form onSubmit=***REMOVED***handleLogin***REMOVED***>
            <div className="mb-4">
              <Input
                type="email"
                label="Email"
                icon=***REMOVED***Mail***REMOVED***
                value=***REMOVED***email***REMOVED***
                onChange=***REMOVED***(e) => setEmail(e.target.value)***REMOVED***
                placeholder="your@email.com"
                required
              />
            </div>
            
            <div className="mb-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Lock size=***REMOVED***16***REMOVED*** className="inline mr-2" />
                Password
              </label>
              <div className="relative">
                <input
                  type=***REMOVED***showPassword ? "text" : "password"***REMOVED***
                  value=***REMOVED***password***REMOVED***
                  onChange=***REMOVED***(e) => setPassword(e.target.value)***REMOVED***
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-offset-0 transition-colors"
                  placeholder="Password"
                  required
                />
                <button 
                  type="button"
                  onClick=***REMOVED***() => setShowPassword(!showPassword)***REMOVED***
                  className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
                >
                  ***REMOVED***showPassword ? <EyeOff size=***REMOVED***20***REMOVED*** /> : <Eye size=***REMOVED***20***REMOVED*** />***REMOVED***
                </button>
              </div>
            </div>
            
            ***REMOVED***/* Password recovery link */***REMOVED***
            <div className="mb-4 text-right">
              <button 
                type="button"
                onClick=***REMOVED***handleForgotPassword***REMOVED***
                className="text-sm text-pink-600 hover:text-pink-800"
              >
                Forgot your password?
              </button>
            </div>
            
            <Button
              type="submit"
              loading=***REMOVED***loading***REMOVED***
              className="w-full mb-4"
            >
              Continue
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
            onClick=***REMOVED***handleGoogleLogin***REMOVED***
            loading=***REMOVED***googleLoading***REMOVED***
            variant="secondary"
            className="w-full mb-4"
            icon=***REMOVED***GoogleIcon***REMOVED***
            iconPosition="left"
            bgColor="#121212"
            textColor="white"
          >
            Continue with Google
          </Button>
          
          <div className="text-center">
            <p className="text-gray-600 mb-2">Don't have an account?</p>
            <button 
              onClick=***REMOVED***handleRegister***REMOVED***
              className="text-pink-600 hover:text-pink-800 font-bold"
            >
              Register here!
            </button>
          </div>
        </Card>
      </Flex>
    </div>
  );
***REMOVED***;

export default Login;