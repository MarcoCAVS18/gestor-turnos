// src/components/settings/SessionSection/index.jsx

import { LogOut, FileText, Shield, Trash2, ChevronRight, Crown, RefreshCw } from 'lucide-react';
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

  const LinkItem = ({ to, icon: Icon, label }) => (
    <Link
      to={to}
      className="flex items-center justify-between p-2 rounded-lg transition-colors text-gray-600 hover:bg-gray-50"
    >
      <div className="flex items-center gap-2">
        <Icon size={16} />
        <span className="text-sm">{label}</span>
      </div>
      <ChevronRight size={16} className="text-gray-400" />
    </Link>
  );

  const PremiumButton = () => (
    <div
      className="flex items-center p-2 rounded-lg transition-colors text-amber-600 hover:bg-amber-50 cursor-pointer"
    >
      <div className="flex items-center gap-2">
        <Crown size={16} />
        <span className="text-sm">Change to Premium</span>
      </div>
    </div>
  );

  return (
    <SettingsSection icon={LogOut} title="Account" className={className}>
      <div className="space-y-3">
        {/* Grid layout: 2 columns */}
        <div className="grid grid-cols-2 gap-1">
          <LinkItem to="/terms" icon={FileText} label="Terms of Service" />
          <PremiumButton />
          <LinkItem to="/privacy" icon={Shield} label="Privacy Policy" />
          <LinkItem to="/clear-everything" icon={RefreshCw} label="Clear Everything" />
        </div>

        {/* Delete Account - Full width, centered */}
        <div className="pt-1">
          <Link
            to="/delete-account"
            className="flex items-center justify-center gap-2 p-2 rounded-lg transition-colors text-red-500 hover:bg-red-50"
          >
            <Trash2 size={16} />
            <span className="text-sm">Delete Account</span>
          </Link>
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