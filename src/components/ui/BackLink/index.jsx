// src/components/ui/BackLink/index.jsx

import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

// When `back` prop is provided, uses navigate(-1) and auto-detects label from location.state.from
// When `to` prop is provided, uses a regular Link (fixed destination)
const BackLink = ({ to, back, children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  if (back) {
    const fromLabel = location.state?.from || null;
    const label = children || (fromLabel ? `Back to ${fromLabel}` : 'Back');

    return (
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
      >
        <ArrowLeft size={16} />
        {label}
      </button>
    );
  }

  return (
    <Link
      to={to}
      className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
    >
      <ArrowLeft size={16} />
      {children || 'Back'}
    </Link>
  );
};

export default BackLink;
