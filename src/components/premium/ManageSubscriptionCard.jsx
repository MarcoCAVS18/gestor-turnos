// src/components/premium/ManageSubscriptionCard.jsx

import React, { useState } from 'react';
import { ExternalLink, AlertTriangle, XCircle } from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { formatDate } from './constants';

const ManageSubscriptionCard = ({ subscription, onOpenBillingPortal, portalLoading, onCancelSubscription }) => {
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);
  const isCancelling = subscription?.status === 'cancelling';

  const handleCancelSubscription = async () => {
    setCancelLoading(true);
    try {
      await onCancelSubscription();
      setShowCancelConfirm(false);
    } catch (error) {
      console.error('Cancel failed:', error);
    } finally {
      setCancelLoading(false);
    }
  };

  return (
    <Card className="p-5 h-full">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Manage</h2>
      <div className="space-y-3">
        <Button
          onClick={onOpenBillingPortal}
          loading={portalLoading}
          loadingText="Opening..."
          variant="outline"
          size="md"
          className="w-full justify-center"
        >
          <ExternalLink size={16} className="mr-2" />
          Billing Portal
        </Button>
        <p className="text-xs text-gray-400 text-center">
          Update payment method, download invoices, manage billing
        </p>

        <div className="border-t border-gray-100 pt-3 mt-3">
          {isCancelling ? (
            <div className="flex items-start gap-2 p-3 rounded-xl bg-amber-50 border border-amber-200">
              <AlertTriangle size={16} className="text-amber-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs font-medium text-amber-700 mb-0.5">Cancellation scheduled</p>
                <p className="text-xs text-amber-600">
                  Access continues until {formatDate(subscription?.expiryDate)}
                </p>
              </div>
            </div>
          ) : showCancelConfirm ? (
            <div className="space-y-2">
              <div className="flex items-start gap-2 p-3 rounded-xl bg-red-50 border border-red-200">
                <AlertTriangle size={16} className="text-red-500 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-red-700">
                  You'll keep access until {formatDate(subscription?.expiryDate)}. After that, your plan reverts to Free.
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => setShowCancelConfirm(false)}
                  variant="outline"
                  size="sm"
                  className="flex-1 justify-center"
                >
                  Keep Plan
                </Button>
                <Button
                  onClick={handleCancelSubscription}
                  loading={cancelLoading}
                  loadingText="Cancelling..."
                  size="sm"
                  className="flex-1 justify-center bg-red-500 hover:bg-red-600 text-white"
                >
                  <XCircle size={14} className="mr-1" />
                  Confirm
                </Button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowCancelConfirm(true)}
              className="w-full text-xs text-gray-400 hover:text-red-500 transition-colors py-1"
            >
              Cancel subscription
            </button>
          )}
        </div>
      </div>
    </Card>
  );
};

export default ManageSubscriptionCard;
