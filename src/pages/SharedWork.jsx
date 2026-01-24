// src/pages/SharedWork.jsx

import ***REMOVED*** Share2, Plus, ArrowLeft, AlertCircle ***REMOVED*** from 'lucide-react';
import ***REMOVED*** useNavigate ***REMOVED*** from 'react-router-dom';
import ***REMOVED*** useSharedWork ***REMOVED*** from '../hooks/useSharedWork';
import ***REMOVED*** useAuth ***REMOVED*** from '../contexts/AuthContext';
import WorkPreviewCard from '../components/shared/WorkPreviewCard';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Loader from '../components/other/Loader';
import PageHeader from '../components/layout/PageHeader';

const SharedWork = () => ***REMOVED***
  const ***REMOVED*** sharedWork, loading, error, adding, addWork ***REMOVED*** = useSharedWork();
  const ***REMOVED*** currentUser ***REMOVED*** = useAuth();
  const navigate = useNavigate();

  // If no authenticated user, redirect to login
  if (!currentUser) ***REMOVED***
    return (
      <div className="max-w-md mx-auto px-4 py-6">
        <Card className="text-center py-8">
          <AlertCircle size=***REMOVED***48***REMOVED*** className="mx-auto mb-4 text-yellow-500" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Sign In</h2>
          <p className="text-gray-600 mb-6">
            You need to sign in to add this work to your account
          </p>
          <div className="space-y-3">
            <Button
              onClick=***REMOVED***() => navigate('/login', ***REMOVED*** 
                state: ***REMOVED*** redirectTo: window.location.pathname ***REMOVED*** 
              ***REMOVED***)***REMOVED***
              className="w-full"
            >
              Sign In
            </Button>
            <Button
              onClick=***REMOVED***() => navigate('/register', ***REMOVED*** 
                state: ***REMOVED*** redirectTo: window.location.pathname ***REMOVED*** 
              ***REMOVED***)***REMOVED***
              variant="outline"
              className="w-full"
            >
              Create Account
            </Button>
          </div>
        </Card>
      </div>
    );
  ***REMOVED***

  if (loading) ***REMOVED***
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader />
      </div>
    );
  ***REMOVED***

  if (error) ***REMOVED***
    return (
      <div className="max-w-md mx-auto px-4 py-6">
        <Card className="text-center py-8">
          <Share2 size=***REMOVED***48***REMOVED*** className="mx-auto mb-4 text-red-400" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Error</h2>
          <p className="text-gray-600 mb-6">***REMOVED***error***REMOVED***</p>
          <Button
            onClick=***REMOVED***() => navigate('/works')***REMOVED***
            variant="outline"
            icon=***REMOVED***ArrowLeft***REMOVED***
          >
            Go to my works
          </Button>
        </Card>
      </div>
    );
  ***REMOVED***

  return (
    <div className="max-w-md mx-auto px-4 py-6 space-y-6">
      <PageHeader
        title="Shared Work"
        subtitle="Details of the work shared with you."
        icon=***REMOVED***Share2***REMOVED***
      />
      ***REMOVED***/* Work preview */***REMOVED***
      ***REMOVED***sharedWork && <WorkPreviewCard work=***REMOVED***sharedWork***REMOVED*** />***REMOVED***

      ***REMOVED***/* Action buttons */***REMOVED***
      <div className="space-y-3">
        <Button
          onClick=***REMOVED***addWork***REMOVED***
          disabled=***REMOVED***adding***REMOVED***
          loading=***REMOVED***adding***REMOVED***
          className="w-full"
          icon=***REMOVED***Plus***REMOVED***
        >
          ***REMOVED***adding ? 'Adding...' : 'Add to my works'***REMOVED***
        </Button>
        
        <Button
          onClick=***REMOVED***() => navigate('/works')***REMOVED***
          variant="outline"
          className="w-full"
          icon=***REMOVED***ArrowLeft***REMOVED***
        >
          Go to my works
        </Button>
      </div>

      ***REMOVED***/* Help message */***REMOVED***
      <Card className="text-center py-4" padding="sm">
        <p className="text-xs text-gray-500">
          By adding this work, it will be copied to your account with all its configurations.
        </p>
      </Card>
    </div>
  );
***REMOVED***;

export default SharedWork;