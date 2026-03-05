// src/components/shifts/ShiftsEmptyState/index.jsx

import React from 'react';
import { useTranslation } from 'react-i18next';
import { Calendar, Plus, Briefcase, ArrowRight, Clock, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Card from '../../ui/Card';

function ShiftsEmptyState({ allJobs, onNewShift, thematicColors }) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // No jobs - need to create a work first
  if (!allJobs || allJobs.length === 0) {
    return (
      <Card className="p-8 sm:p-12">
        <div className="max-w-md mx-auto text-center">
          {/* Icon */}
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
            style={{ backgroundColor: `${thematicColors?.base}15` }}
          >
            <Briefcase
              size={40}
              style={{ color: thematicColors?.base }}
            />
          </div>

          {/* Text */}
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {t('shifts.firstAddWork')}
          </h3>
          <p className="text-gray-500 mb-8">
            {t('shifts.needWorkDesc')}
          </p>

          {/* Action button */}
          <button
            onClick={() => navigate('/works')}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white font-medium transition-all hover:shadow-lg hover:scale-105"
            style={{ backgroundColor: thematicColors?.base }}
          >
            <Briefcase size={18} />
            <span>{t('shifts.goToWorks')}</span>
            <ArrowRight size={18} />
          </button>
        </div>
      </Card>
    );
  }

  // Has jobs but no shifts
  return (
    <Card className="p-8 sm:p-12">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
            style={{ backgroundColor: `${thematicColors?.base}15` }}
          >
            <Calendar
              size={40}
              style={{ color: thematicColors?.base }}
            />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {t('shifts.noShiftsYet')}
          </h3>
          <p className="text-gray-500">
            {t('shifts.startTrackingDesc')}
          </p>
        </div>

        {/* Options */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          {/* Manual option */}
          <button
            onClick={onNewShift}
            className="p-4 rounded-xl border-2 border-dashed border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all text-left group"
          >
            <div className="flex items-center gap-3 mb-2">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: `${thematicColors?.base}15` }}
              >
                <Clock size={20} style={{ color: thematicColors?.base }} />
              </div>
              <span className="font-medium text-gray-900">{t('shifts.addManually')}</span>
            </div>
            <p className="text-sm text-gray-500">
              {t('shifts.enterShiftDetails')}
            </p>
          </button>

          {/* Live Mode option */}
          <button
            onClick={() => navigate('/live')}
            className="p-4 rounded-xl border-2 border-dashed border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all text-left group"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-green-100">
                <Zap size={20} className="text-green-600" />
              </div>
              <span className="font-medium text-gray-900">{t('shifts.useLiveMode')}</span>
            </div>
            <p className="text-sm text-gray-500">
              {t('shifts.liveModeDesc')}
            </p>
          </button>
        </div>

        {/* Primary action */}
        <div className="text-center">
          <button
            onClick={onNewShift}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white font-medium transition-all hover:shadow-lg hover:scale-105"
            style={{ backgroundColor: thematicColors?.base }}
          >
            <Plus size={18} />
            <span>{t('shifts.addFirstShift')}</span>
          </button>
        </div>
      </div>
    </Card>
  );
}

export default ShiftsEmptyState;
