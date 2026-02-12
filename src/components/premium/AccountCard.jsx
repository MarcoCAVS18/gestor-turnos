// src/components/premium/AccountCard.jsx

import React from 'react';
import { Crown, CalendarDays, Mail } from 'lucide-react';
import { PREMIUM_COLORS } from '../../contexts/PremiumContext';
import Card from '../ui/Card';

const AccountCard = ({ currentUser, profilePhotoURL, isPremium = true, membershipDuration = null }) => {
  if (isPremium) {
    return (
      <Card variant="transparent" className="p-5 h-full">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Account</h2>
        <div className="flex flex-col items-center text-center">
          <div className="relative mb-3">
            <div
              className="w-16 h-16 rounded-full overflow-hidden border-3"
              style={{ borderColor: PREMIUM_COLORS.light }}
            >
              <img src={profilePhotoURL} alt="Profile" className="w-full h-full object-cover" />
            </div>
            <div
              className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center"
              style={{ backgroundColor: PREMIUM_COLORS.gold }}
            >
              <Crown size={12} className="text-white" />
            </div>
          </div>
          <p className="font-medium text-gray-900">{currentUser?.displayName}</p>
          <p className="text-sm text-gray-500 mb-3">{currentUser?.email}</p>
          {membershipDuration && (
            <div className="flex items-center gap-1.5 text-xs text-gray-400">
              <CalendarDays size={12} />
              <span>Premium for {membershipDuration}</span>
            </div>
          )}
        </div>
      </Card>
    );
  }

  // Free user variant
  return (
    <Card variant="transparent" className="p-5 h-full flex flex-col items-center justify-center text-center">
      <div className="relative mb-3">
        <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-gray-200">
          <img src={profilePhotoURL} alt="Profile" className="w-full h-full object-cover" />
        </div>
        <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center">
          <Crown size={12} className="text-gray-500" />
        </div>
      </div>
      <p className="font-medium text-gray-900">{currentUser?.displayName}</p>
      <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
        <Mail size={12} />
        {currentUser?.email}
      </p>
      <p className="text-xs text-gray-400 mt-3">Free Plan</p>
    </Card>
  );
};

export default AccountCard;
