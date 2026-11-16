// src/components/settings/SessionSection/index.jsx

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LogOut, FileText, Shield, Trash2, ChevronRight, ChevronDown, Crown, RefreshCw } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { useThemeColors } from '../../../hooks/useThemeColors';
import { usePremium, PREMIUM_COLORS } from '../../../contexts/PremiumContext';
import { isBiometricAvailable } from '../../../services/biometricService';
import SettingsSection from '../SettingsSection';
import Button from '../../ui/Button';
import PremiumModal from '../../modals/premium/PremiumModal';

const SessionSection = ({ onError, className = '' }) => {
  const { t } = useTranslation();
  const { logout, lockApp } = useAuth();
  const colors = useThemeColors();
  const navigate = useNavigate();
  const { isPremium } = usePremium();
  const [isPremiumModalOpen, setIsPremiumModalOpen] = useState(false);
  // Privacy / Clear everything / Delete account stay collapsed by default so
  // this section keeps a small footprint. Expanding it grows only this card,
  // consuming the column's own slack instead of stretching the other columns.
  const [showMore, setShowMore] = useState(false);

  const handleLogout = async () => {
    try {
      // If biometric credentials exist on this device, lock the app instead of
      // signing out completely. This keeps the Firebase session alive so the
      // biometric button on the Login page can unlock it.
      // To fully sign out, the user must disable biometric in Integrations first.
      if (isBiometricAvailable()) {
        lockApp();
        navigate('/login');
        return;
      }
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
      state={{ from: 'Settings' }}
      className="flex items-center justify-between p-2 rounded-lg transition-colors text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700/50"
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
          {isPremium ? t('settings.session.managePremium') : t('settings.session.upgradePremium')}
        </span>
      </div>
      <ChevronRight size={16} style={{ color: PREMIUM_COLORS.primary }} />
    </button>
  );

  return (
    <>
      <SettingsSection icon={LogOut} title={t('settings.session.title')} className={className}>
        <div className="space-y-3">
          {/* Always visible essentials */}
          <div className="grid grid-cols-2 gap-1">
            <LinkItem to="/terms" icon={FileText} label={t('settings.session.terms')} />
            <PremiumButton />
          </div>

          {/* Collapsible: Privacy / Clear everything / Delete account.
              Collapsed by default to keep this card compact. */}
          <button
            type="button"
            onClick={() => setShowMore((v) => !v)}
            aria-expanded={showMore}
            className="flex items-center justify-between w-full p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors"
          >
            <span className="text-sm">{t('settings.session.more')}</span>
            <ChevronDown
              size={16}
              className={`text-gray-400 transition-transform duration-200 ${showMore ? 'rotate-180' : ''}`}
            />
          </button>

          {showMore && (
            <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="grid grid-cols-2 gap-1">
                <LinkItem to="/privacy" icon={Shield} label={t('settings.session.privacy')} />
                <LinkItem to="/clear-everything" icon={RefreshCw} label={t('settings.session.clearEverything')} />
              </div>

              {/* Delete Account - Full width, centered */}
              <div className="pt-1">
                <Link
                  to="/delete-account"
                  state={{ from: 'Settings' }}
                  className="flex items-center justify-center gap-2 p-2 rounded-lg transition-colors text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  <Trash2 size={16} />
                  <span className="text-sm">{t('settings.session.deleteAccount')}</span>
                </Link>
              </div>
            </div>
          )}

          {/* Logout button */}
          <div className="pt-2 border-t border-gray-100 dark:border-slate-700">
            <Button
              onClick={handleLogout}
              variant="outline"
              icon={LogOut}
              themeColor={colors.primary}
              className="w-full justify-center"
            >
              {t('settings.session.logout')}
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
