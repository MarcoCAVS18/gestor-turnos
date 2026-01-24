// src/components/dashboard/WelcomeCard/index.jsx

import { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { useApp } from '../../../contexts/AppContext';
import { useThemeColors } from '../../../hooks/useThemeColors';
import { formatCurrency } from '../../../utils/currency';
import Card from '../../ui/Card';

const WelcomeCard = ({ totalEarned, isFeatureVisible = false, className }) => {
  const { currentUser } = useAuth();
  const { userEmoji } = useApp();
  const colors = useThemeColors();
  const [userName, setUserName] = useState('');
  
  useEffect(() => {
    if (currentUser) {
      setUserName(
        currentUser.displayName || 
        (currentUser.email ? currentUser.email.split('@')[0] : '')
      );
    }
  }, [currentUser]);

  // Function to get greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning,';
    if (hour < 18) return 'Good afternoon,';
    return 'Good evening,';
  };

  return (
    <Card className={className}>
      <div className="flex flex-col h-full">
        <div className="my-auto">
          {/* Vertical layout (Mobile or when feature is visible) */}
          <div className={`${isFeatureVisible ? 'block' : 'block sm:hidden'} text-center space-y-4`}>
            <div>
              <h1 className="text-xl font-bold text-gray-800">
                {getGreeting()} {userName && `${userName} `}{userEmoji}
              </h1>
              <p className="text-gray-600 text-sm mt-2">
                Here is a summary of your activity
              </p>
            </div>
            
            <div>
              <p className="text-xs text-gray-500 pt-4 mb-1">Total earned</p>
              <p
                className="text-4xl font-bold"
                style={{ color: colors.primary }}
              >
                {formatCurrency(totalEarned || 0)}
              </p>
            </div>
          </div>

          {/* Horizontal layout (Tablet/Desktop without feature) */}
          <div className={`${isFeatureVisible ? 'hidden' : 'hidden sm:flex'} items-center justify-between`}>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                {getGreeting()} {userName && `${userName} `}{userEmoji}
              </h1>
              <p className="text-gray-600 mt-1">
                Here is a summary<br />
                of your activity
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Total earned</p>
              <p
                className="text-2xl font-bold"
                style={{ color: colors.primary }}
              >
                {formatCurrency(totalEarned || 0)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default WelcomeCard;