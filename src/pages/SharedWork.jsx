// src/pages/SharedWork.jsx

import { Share2, Plus, ArrowLeft, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSharedWork } from '../hooks/useSharedWork';
import { useAuth } from '../contexts/AuthContext';
import WorkPreviewCard from '../components/shared/WorkPreviewCard';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Loader from '../components/other/Loader';
import PageHeader from '../components/layout/PageHeader';

const SharedWork = () => {
  const { sharedWork, loading, error, adding, addWork } = useSharedWork();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  // If no authenticated user, redirect to login
  if (!currentUser) {
    return (
      <div className="max-w-md mx-auto px-4 py-6">
        <Card className="text-center py-8">
          <AlertCircle size={48} className="mx-auto mb-4 text-yellow-500" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Sign In</h2>
          <p className="text-gray-600 mb-6">
            You need to sign in to add this work to your account
          </p>
          <div className="space-y-3">
            <Button
              onClick={() => navigate('/login', { 
                state: { redirectTo: window.location.pathname } 
              })}
              className="w-full"
            >
              Sign In
            </Button>
            <Button
              onClick={() => navigate('/register', { 
                state: { redirectTo: window.location.pathname } 
              })}
              variant="outline"
              className="w-full"
            >
              Create Account
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto px-4 py-6">
        <Card className="text-center py-8">
          <Share2 size={48} className="mx-auto mb-4 text-red-400" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Button
            onClick={() => navigate('/works')}
            variant="outline"
            icon={ArrowLeft}
          >
            Go to my works
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-4 py-6 space-y-6">
      <PageHeader
        title="Shared Work"
        subtitle="Details of the work shared with you."
        icon={Share2}
      />
      {/* Work preview */}
      {sharedWork && <WorkPreviewCard work={sharedWork} />}

      {/* Action buttons */}
      <div className="space-y-3">
        <Button
          onClick={addWork}
          disabled={adding}
          loading={adding}
          className="w-full"
          icon={Plus}
        >
          {adding ? 'Adding...' : 'Add to my works'}
        </Button>
        
        <Button
          onClick={() => navigate('/works')}
          variant="outline"
          className="w-full"
          icon={ArrowLeft}
        >
          Go to my works
        </Button>
      </div>

      {/* Help message */}
      <Card className="text-center py-4" padding="sm">
        <p className="text-xs text-gray-500">
          By adding this work, it will be copied to your account with all its configurations.
        </p>
      </Card>
    </div>
  );
};

export default SharedWork;