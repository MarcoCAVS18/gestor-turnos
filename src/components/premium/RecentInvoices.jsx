// src/components/premium/RecentInvoices.jsx

import React, { useState, useEffect } from 'react';
import { Receipt, ExternalLink, Download, FileText } from 'lucide-react';
import { motion } from 'framer-motion';
import { PREMIUM_COLORS } from '../../contexts/PremiumContext';
import { getInvoices } from '../../services/stripeService';
import Card from '../ui/Card';

const RecentInvoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const data = await getInvoices();
        setInvoices(data);
      } catch (err) {
        console.error('Failed to load invoices:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchInvoices();
  }, []);

  const formatInvoiceDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  if (loading) {
    return (
      <Card className="p-5">
        <div className="flex items-center gap-2 mb-4">
          <Receipt size={20} style={{ color: PREMIUM_COLORS.primary }} />
          <h2 className="text-lg font-semibold text-gray-900">Recent Invoices</h2>
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 animate-pulse">
              <div className="w-10 h-10 rounded-lg bg-gray-200" />
              <div className="flex-1 space-y-2">
                <div className="h-3 bg-gray-200 rounded w-24" />
                <div className="h-2 bg-gray-200 rounded w-16" />
              </div>
              <div className="h-3 bg-gray-200 rounded w-16" />
            </div>
          ))}
        </div>
      </Card>
    );
  }

  if (invoices.length === 0) {
    return (
      <Card className="p-5">
        <div className="flex items-center gap-2 mb-4">
          <Receipt size={20} style={{ color: PREMIUM_COLORS.primary }} />
          <h2 className="text-lg font-semibold text-gray-900">Recent Invoices</h2>
        </div>
        <div className="flex flex-col items-center py-6 text-center">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center mb-3"
            style={{ backgroundColor: `${PREMIUM_COLORS.lighter}` }}
          >
            <FileText size={20} style={{ color: PREMIUM_COLORS.primary }} />
          </div>
          <p className="text-sm text-gray-500">No invoices yet</p>
          <p className="text-xs text-gray-400 mt-1">Your invoices will appear here after your first payment</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-5">
      <div className="flex items-center gap-2 mb-4">
        <Receipt size={20} style={{ color: PREMIUM_COLORS.primary }} />
        <h2 className="text-lg font-semibold text-gray-900">Recent Invoices</h2>
      </div>
      <div className="space-y-2">
        {invoices.map((invoice, index) => (
          <motion.div
            key={invoice.id}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors group"
          >
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: PREMIUM_COLORS.lighter }}
            >
              <Receipt size={18} style={{ color: PREMIUM_COLORS.primary }} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {invoice.number || `Invoice #${index + 1}`}
              </p>
              <p className="text-xs text-gray-500">
                {formatInvoiceDate(invoice.date)}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-900">
                ${invoice.amount.toFixed(2)}
              </span>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {invoice.pdfUrl && (
                  <a
                    href={invoice.pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-gray-200 transition-colors"
                    title="Download PDF"
                  >
                    <Download size={14} className="text-gray-500" />
                  </a>
                )}
                {invoice.hostedUrl && (
                  <a
                    href={invoice.hostedUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-gray-200 transition-colors"
                    title="View invoice"
                  >
                    <ExternalLink size={14} className="text-gray-500" />
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </Card>
  );
};

export default RecentInvoices;
