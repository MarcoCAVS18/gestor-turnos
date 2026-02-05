// src/components/shifts/ShiftsEmptyState/index.jsx

import React from 'react';
import { Calendar, Plus, Briefcase, ArrowRight, Clock, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Card from '../../ui/Card';

function ShiftsEmptyState({ allJobs, onNewShift, thematicColors }) {
  const navigate = useNavigate();

  // No jobs - need to create a work first
  if (allJobs.length === 0) {
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
            First, add a work
          </h3>
          <p className="text-gray-500 mb-8">
            Before you can track shifts, you need to create at least one work.
            This could be a job, a delivery platform, or any other income source.
          </p>

          {/* Action button */}
          <button
            onClick={() => navigate('/works')}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white font-medium transition-all hover:shadow-lg hover:scale-105"
            style={{ backgroundColor: thematicColors?.base }}
          >
            <Briefcase size={18} />
            <span>Go to Works</span>
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
            No shifts yet
          </h3>
          <p className="text-gray-500">
            Start tracking your work hours to see your earnings and statistics.
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
              <span className="font-medium text-gray-900">Add manually</span>
            </div>
            <p className="text-sm text-gray-500">
              Enter shift details like date, start and end time
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
              <span className="font-medium text-gray-900">Use Live Mode</span>
            </div>
            <p className="text-sm text-gray-500">
              Start a timer and track your shift in real-time
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
            <span>Add your first shift</span>
          </button>
        </div>
      </div>
    </Card>
  );
}

export default ShiftsEmptyState;
