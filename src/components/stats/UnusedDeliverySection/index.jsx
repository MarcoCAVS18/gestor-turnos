// src/components/stats/UnusedDeliverySection/index.jsx

import { useState } from 'react';
import { ChevronDown, ChevronUp, EyeOff } from 'lucide-react';
/* import { useThemeColors } from '../../../hooks/useThemeColors';
 */
const UnusedDeliverySection = ({ children, className = '' }) => {
  const [isExpanded, setIsExpanded] = useState(false);
/*   const colors = useThemeColors();
 */
  return (
    <div className={className}>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg border border-dashed border-gray-300 bg-gray-50/50 hover:bg-gray-100/50 transition-colors text-gray-500"
      >
        <EyeOff size={16} />
        <span className="text-sm font-medium">
          {isExpanded ? 'Hide unused items' : 'Show currently unused items'}
        </span>
        {isExpanded ? (
          <ChevronUp size={16} />
        ) : (
          <ChevronDown size={16} />
        )}
      </button>

      {isExpanded && (
        <div className="mt-4 space-y-4 animate-fadeIn">
          {children}
        </div>
      )}
    </div>
  );
};

export default UnusedDeliverySection;
