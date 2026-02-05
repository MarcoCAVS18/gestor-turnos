// src/components/settings/SessionSection/index.jsx

import { useState } from 'react';
import { LogOut, FileText, Shield, Trash2, ChevronRight, Crown, RefreshCw } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { useThemeColors } from '../../../hooks/useThemeColors';
import { usePremium, PREMIUM_COLORS } from '../../../contexts/PremiumContext';
import SettingsSection from '../SettingsSection';
import Button from '../../ui/Button';
import PremiumModal from '../../modals/premium/PremiumModal';

const SessionSection = ({ onError, className = '' }) => {
  const { logout } = useAuth();
  const colors = useThemeColors();
  const navigate = useNavigate();
  const { isPremium } = usePremium();
  const [isPremiumModalOpen, setIsPremiumModalOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      onError?.('Error logging out: ' + error.message);
    }
  };

  const handlePremiumClick = () => {
    if (isPremium) {
      navigate('/premium');
    } else {
      setIsPremiumModalOpen(true);
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
    <button
      onClick={handlePremiumClick}
      className="flex items-center justify-between p-2 rounded-lg transition-colors cursor-pointer w-full text-left"
      style={{
        color: PREMIUM_COLORS.primary,
        backgroundColor: 'transparent',
      }}
      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = PREMIUM_COLORS.lighter}
      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
    >
      <div className="flex items-center gap-2">
        <Crown size={16} style={{ color: PREMIUM_COLORS.gold }} />
        <span className="text-sm">
          {isPremium ? 'Manage Premium' : 'Upgrade to Premium'}
        </span>
      </div>
      <ChevronRight size={16} style={{ color: PREMIUM_COLORS.primary }} />
    </button>
  );

  return (
    <>
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

      {/* Premium Modal */}
      <PremiumModal
        isOpen={isPremiumModalOpen}
        onClose={() => setIsPremiumModalOpen(false)}
      />
    </>
  );
};

export default SessionSection;
