// src/components/layout/Header/index.jsx

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Settings } from 'lucide-react';
import { useApp } from '../../../contexts/AppContext';
import { useAuth } from '../../../contexts/AuthContext';
import { usePremium } from '../../../contexts/PremiumContext';
import Flex from '../../ui/Flex';

const Header = () => {
  const { t } = useTranslation();
  const { thematicColors } = useApp();
  const { profilePhotoURL } = useAuth();
  const { isPremium } = usePremium();
  const navigate = useNavigate();
  const [showSettingsIcon, setShowSettingsIcon] = useState(false);
  // Track de error de carga: si la foto del usuario falla, caemos al ícono
  // de Settings para que nunca aparezca el placeholder de imagen rota.
  const [imageError, setImageError] = useState(false);

  // Cualquier cambio de URL resetea el flag de error (si volvió a haber foto válida)
  useEffect(() => {
    setImageError(false);
  }, [profilePhotoURL]);

  const hasCustomPhoto =
    profilePhotoURL && !profilePhotoURL.includes('logo.svg') && !imageError;

  // Animation: periodically show settings icon instead of profile photo
  useEffect(() => {
    if (!hasCustomPhoto) return;

    const interval = setInterval(() => {
      setShowSettingsIcon(true);
      // Show gear icon for 2 seconds, then return to photo
      setTimeout(() => {
        setShowSettingsIcon(false);
      }, 2000);
    }, 12000); // Every 12 seconds

    return () => clearInterval(interval);
  }, [hasCustomPhoto]);

  const handleSettingsClick = () => {
    navigate('/settings');
  };

  const handleLogoClick = () => {
    navigate('/dashboard');
  };

  // Desktop conserva los tamaños y look originales. Mobile recibe los retoques:
  // logo más compacto, título más chico, sin tagline, avatar con ring sutil,
  // border-radius inferior solo en mobile y un degradé sutil del thematicColor
  // del usuario (más oscuro arriba a la base abajo) para que la barra deje
  // de ser un rectángulo plano sin perder identidad cromática.
  const baseColor = thematicColors?.base || '#EC4899';
  const darkColor = thematicColors?.dark || baseColor;
  return (
    <header
      className="relative flex justify-between items-center px-4 pb-3 sm:pb-4 text-white shadow-md rounded-b-2xl sm:rounded-none"
      style={{
        background: `linear-gradient(180deg, ${darkColor} 0%, ${baseColor} 100%)`,
        paddingTop: 'calc(0.75rem + env(safe-area-inset-top))',
      }}
    >
      {/* Overlay sutil para profundidad — no oculta el thematicColor, solo
          le agrega un degradé apenas perceptible que lo hace más actual */}
      <div
        className="pointer-events-none absolute inset-0 sm:hidden rounded-b-2xl bg-gradient-to-b from-white/10 via-transparent to-transparent"
        aria-hidden="true"
      />

      {/* Logo and title on the left - clickable */}
      <Flex className="flex-1 relative z-10">
        <button
          onClick={handleLogoClick}
          aria-label="Go to dashboard"
          className="flex items-center gap-2 sm:gap-3 hover:opacity-80 transition-opacity"
        >
          {/* Logo SVG: compacto en mobile, mismo tamaño que antes en desktop */}
          <Flex variant="center" className="w-10 h-10 sm:w-14 sm:h-14">
            <img
              src={isPremium ? "/assets/SVG/premium.svg" : "/assets/SVG/logo.svg"}
              alt={isPremium ? "Premium Logo" : "Logo"}
              className="w-full h-full filter brightness-0 invert"
              style={{ filter: 'brightness(0) invert(1)' }}
            />
          </Flex>

          {/* Title and subtitle */}
          <div className="text-left">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight leading-none">
              Orary.
            </h1>
            {/* Tagline solo en desktop — en mobile redunda con PageHeader */}
            <p className="hidden sm:block text-xs opacity-90 font-light">
              {t('nav.tagline')}
            </p>
          </div>
        </button>
      </Flex>

      {/* Profile/Settings button on the right */}
      <div className="flex gap-2 relative z-10">
        <button
          onClick={handleSettingsClick}
          aria-label="Go to settings"
          className="rounded-full transition-all duration-200 hover:bg-white/15 active:scale-95"
        >
          {!hasCustomPhoto ? (
            // Sin foto personalizada: ícono de settings sobre un fondo glass sutil
            // (bg-white/10 + backdrop-blur) que respeta el thematicColor por debajo.
            <Flex
              variant="center"
              className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm ring-1 ring-white/20"
            >
              <Settings className="h-5 w-5 text-white" />
            </Flex>
          ) : (
            // Con foto: ring sutil en lugar de border-2, sombra suave
            <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-white/40 shadow-md relative">
              <img
                src={profilePhotoURL}
                alt="Profile"
                referrerPolicy="no-referrer"
                className={`w-full h-full object-cover absolute inset-0 transition-opacity duration-500 ${
                  showSettingsIcon ? 'opacity-0' : 'opacity-100'
                }`}
                onError={() => setImageError(true)}
              />
              <Flex
                variant="center"
                className={`w-full h-full absolute inset-0 bg-white/20 backdrop-blur-sm transition-opacity duration-500 ${
                  showSettingsIcon ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <Settings className="h-5 w-5 text-white" />
              </Flex>
            </div>
          )}
        </button>
      </div>
    </header>
  );
};

export default Header;