// src/pages/auth/ForgotPassword.jsx

import React, ***REMOVED*** useState, useEffect ***REMOVED*** from 'react';
import ***REMOVED*** useNavigate, useLocation ***REMOVED*** from 'react-router-dom';
import ***REMOVED*** useAuth ***REMOVED*** from '../../contexts/AuthContext';

// New structured import
import Button from '../../components/ui/Button';
import Flex from '../../components/ui/Flex';
import Logo from '../../components/icons/Logo';

const ForgotPassword = () => ***REMOVED***
  const ***REMOVED*** resetPassword ***REMOVED*** = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get email from location if it exists
  const [email, setEmail] = useState(location.state?.email || '');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailValid, setEmailValid] = useState(false);

  // Validate email when it changes
  useEffect(() => ***REMOVED***
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setEmailValid(emailRegex.test(email));
  ***REMOVED***, [email]);

  const handleSubmit = async (e) => ***REMOVED***
    e.preventDefault();
    
    if (!emailValid) ***REMOVED***
      return setError('Please enter a valid email');
    ***REMOVED***

    try ***REMOVED***
      setError('');
      setLoading(true);
      await resetPassword(email);
      
      // Redirect to login with success message
      navigate('/login', ***REMOVED*** 
        state: ***REMOVED*** 
          emailSent: true,
          email: email
        ***REMOVED*** 
      ***REMOVED***);
    ***REMOVED*** catch (error) ***REMOVED***
      console.error('Error sending recovery email:', error);
      setError('Could not send recovery email. Check your email address.');
      setLoading(false);
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
      
      ***REMOVED***/* Recovery content */***REMOVED***
      <Flex variant="center" className="flex-col fixed inset-0 z-20 bg-transparent p-4 py-12 overflow-y-auto">
        <Logo />
        <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-2xl">
          <h1 className="text-2xl font-bold text-center mb-2">Recover password</h1>
          <p className="text-center text-gray-600 mb-6">
            Enter your email address and we will send you a link to reset your password.
          </p>
          
          ***REMOVED***error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
              ***REMOVED***error***REMOVED***
            </div>
          )***REMOVED***
          
          <form onSubmit=***REMOVED***handleSubmit***REMOVED*** className="space-y-4">
            <div>
              <label className="block text-gray-700 mb-2">Email</label>
              <input
                type="email"
                value=***REMOVED***email***REMOVED***
                onChange=***REMOVED***(e) => setEmail(e.target.value)***REMOVED***
                className="w-full p-2 border border-gray-300 rounded focus:ring-pink-500 focus:border-pink-500"
                placeholder="your@email.com"
                required
              />
            </div>
            
            <div className="flex items-center space-x-4">
              <Button
                type="button"
                onClick=***REMOVED***() => navigate('/login')***REMOVED***
                variant="outline"
                disabled=***REMOVED***loading***REMOVED***
              >
                Cancel
              </Button>
              
              <Button
                type="submit"
                disabled=***REMOVED***loading || !emailValid***REMOVED***
                loading=***REMOVED***loading***REMOVED***
                className="flex-1"
              >
                Recover password
              </Button>
            </div>
          </form>
        </div>
      </Flex>
    </div>
  );
***REMOVED***;

export default ForgotPassword;