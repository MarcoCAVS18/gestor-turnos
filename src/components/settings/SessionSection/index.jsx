// src/components/settings/SessionSection/index.jsx

import { LogOut, FileText, Shield, Trash2, ChevronRight } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { useThemeColors } from '../../../hooks/useThemeColors';
import SettingsSection from '../SettingsSection';
import Button from '../../ui/Button';

const SessionSection = ({ onError, className = '' }) => {
  const { logout } = useAuth();
  const colors = useThemeColors();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      onError?.('Error logging out: ' + error.message);
    }
  };

  const links = [
    { to: '/terms', icon: FileText, label: 'Terms of Service' },
    { to: '/privacy', icon: Shield, label: 'Privacy Policy' },
    { to: '/delete-account', icon: Trash2, label: 'Delete Account', danger: true },
  ];

  return (
    <SettingsSection icon={LogOut} title="Account" className={className}>
      <div className="space-y-3">
        {/* Legal links */}
        <div className="space-y-1">
          {links.map(({ to, icon: Icon, label, danger }) => (
            <Link
              key={to}
              to={to}
              className={`flex items-center justify-between p-2 rounded-lg transition-colors ${
                danger
                  ? 'text-red-500 hover:bg-red-50'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-2">
                <Icon size={16} />
                <span className="text-sm">{label}</span>
              </div>
              <ChevronRight size={16} className="text-gray-400" />
            </Link>
          ))}
        </div>

        {/* Logout button */}
        <div className="pt-2 border-t border-gray-100">
          <Button
            onClick={handleLogout}
            variant="outline"
            icon={LogOut}
            themeColor={colors.primary}
            className="w-full justify-center"
          >
            Log out
          </Button>
        </div>
      </div>
    </SettingsSection>
  );
};

export default SessionSection;