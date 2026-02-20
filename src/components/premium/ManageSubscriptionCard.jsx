// src/components/premium/ManageSubscriptionCard.jsx

import React, { useState } from 'react';
import { ExternalLink, AlertTriangle, XCircle, Settings, CreditCard, FileText, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useThemeColors } from '../../hooks/useThemeColors';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { formatDate } from './constants';
import logger from '../../utils/logger';

const ManageSubscriptionCard = ({ subscription, onOpenBillingPortal, portalLoading, onCancelSubscription }) => {
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);
  const colors = useThemeColors();
  const isCancelling = subscription?.status === 'cancelling';

  const handleCancelSubscription = async () => {
    setCancelLoading(true);
    try {
      await onCancelSubscription();
      setShowCancelConfirm(false);
    } catch (error) {
      logger.error('Cancel failed:', error);
    } finally {
      setCancelLoading(false);
    }
  };

  const actions = [
    {
      icon: CreditCard,
      label: 'Update Payment',
      description: 'Change your card or payment method',
      onClick: onOpenBillingPortal,
      loading: portalLoading,
    },
    {
      icon: FileText,
      label: 'View Invoices',
      description: 'Download receipts and invoices',
      onClick: onOpenBillingPortal,
      loading: portalLoading,
    },
  ];

  return (
    <Card className="p-5 h-full flex flex-col">
      <div className="flex items-center gap-2.5 mb-4">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: `${colors.primary}15` }}
        >
          <Settings size={16} style={{ color: colors.primary }} />
        </div>
        <h2 className="text-lg font-semibold text-gray-900">Manage</h2>
      </div>

      <div className="space-y-2 flex-1">
        {actions.map((action, index) => (
          <motion.button
            key={action.label}
            onClick={action.onClick}
            disabled={action.loading}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="w-full flex items-center gap-3 p-3 rounded-xl transition-all hover:shadow-sm group text-left"
            style={{ backgroundColor: `${colors.primary}08` }}
            whileHover={{ backgroundColor: `${colors.primary}15`, x: 2 }}
            whileTap={{ scale: 0.98 }}
          >
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors"
              style={{ backgroundColor: `${colors.primary}15` }}
            >
              <action.icon size={16} style={{ color: colors.primary }} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-800">{action.label}</p>
              <p className="text-xs text-gray-400 truncate">{action.description}</p>
            </div>
            <ChevronRight
              size={14}
              className="text-gray-300 group-hover:translate-x-0.5 transition-transform flex-shrink-0"
              style={{ color: `${colors.primary}60` }}
            />
          </motion.button>
        ))}

        {/* Billing Portal full button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
        >
          <Button
            onClick={onOpenBillingPortal}
            loading={portalLoading}
            loadingText="Opening..."
            variant="outline"
            size="sm"
            className="w-full justify-center mt-1"
            style={{ borderColor: `${colors.primary}30`, color: colors.primary }}
          >
            <ExternalLink size={14} className="mr-1.5" />
            Open Billing Portal
          </Button>
        </motion.div>
      </div>

      {/* Cancel section */}
      <div className="border-t border-gray-100 pt-3 mt-4">
        <AnimatePresence mode="wait">
          {isCancelling ? (
            <motion.div
              key="cancelling"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="flex items-start gap-2.5 p-3 rounded-xl bg-amber-50 border border-amber-200"
            >
              <AlertTriangle size={16} className="text-amber-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs font-semibold text-amber-700 mb-0.5">Cancellation scheduled</p>
                <p className="text-xs text-amber-600">
                  Access continues until {formatDate(subscription?.expiryDate)}
                </p>
              </div>
            </motion.div>
          ) : showCancelConfirm ? (
            <motion.div
              key="confirm"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="space-y-2.5"
            >
              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-red-50 border border-red-200">
                <AlertTriangle size={16} className="text-red-500 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-red-700">
                  You'll keep access until <strong>{formatDate(subscription?.expiryDate)}</strong>. After that, your plan reverts to Free.
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
                  loadingText="..."
                  size="sm"
                  className="flex-1 justify-center bg-red-500 hover:bg-red-600 text-white"
                >
                  <XCircle size={14} className="mr-1" />
                  Confirm
                </Button>
              </div>
            </motion.div>
          ) : (
            <motion.button
              key="cancel-link"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCancelConfirm(true)}
              className="w-full text-xs text-gray-400 hover:text-red-500 transition-colors py-1.5 rounded-lg hover:bg-red-50"
            >
              Cancel subscription
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </Card>
  );
};

export default ManageSubscriptionCard;
