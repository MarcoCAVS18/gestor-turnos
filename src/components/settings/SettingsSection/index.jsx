// src/components/settings/SettingsSection/index.jsx

import React from 'react';
import Card from '../../ui/Card';

const SettingsSection = (***REMOVED*** 
  icon: Icon, 
  title, 
  children, 
  className = '' 
***REMOVED***) => ***REMOVED***
  return (
    <Card className=***REMOVED***`mb-6 $***REMOVED***className***REMOVED***`***REMOVED***>
      <div className="flex items-center mb-4">
        <Icon className="h-5 w-5 text-gray-500 mr-2" />
        <h2 className="text-lg font-semibold">***REMOVED***title***REMOVED***</h2>
      </div>
      ***REMOVED***children***REMOVED***
    </Card>
  );
***REMOVED***;

export default SettingsSection;