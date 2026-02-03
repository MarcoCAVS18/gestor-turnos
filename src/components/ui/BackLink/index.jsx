// src/components/ui/BackLink/index.jsx

import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const BackLink = ({ to, children = 'Back' }) => {
  return (
    <Link
      to={to}
      className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
    >
      <ArrowLeft size={16} />
      {children}
    </Link>
  );
};

export default BackLink;
