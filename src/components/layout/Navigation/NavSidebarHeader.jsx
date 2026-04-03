// src/components/layout/Navigation/NavSidebarHeader.jsx

import React, { memo } from 'react';
import { Pencil } from 'lucide-react';
import Flex from '../../ui/Flex';

const NavSidebarHeader = memo(({
  fileInputRef,
  handleLogoClick,
  profilePhotoURL,
  isPhotoLoading,
  showPhotoEdit,
  setShowPhotoEdit,
  handleEditPhotoClick,
  handlePhotoUpload,
  colors,
  t,
}) => {
  return (
    <div className="p-6 border-b border-gray-100 dark:border-slate-800">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handlePhotoUpload}
        className="hidden"
      />

      <button
        onClick={handleLogoClick}
        className="flex items-center space-x-4 hover:opacity-80 transition-opacity w-full text-left"
      >
        <div
          className="relative w-14 h-14 rounded-xl overflow-hidden shadow-lg group"
          onMouseEnter={() => setShowPhotoEdit(true)}
          onMouseLeave={() => setShowPhotoEdit(false)}
          style={{
            backgroundColor: profilePhotoURL?.includes('logo.svg') ? colors.primary : 'transparent'
          }}
        >
          <img
            src={profilePhotoURL}
            alt="Profile"
            className={`w-full h-full ${
              profilePhotoURL?.includes('logo.svg')
                ? 'object-contain p-2 filter brightness-0 invert'
                : 'object-cover'
            } ${isPhotoLoading && !profilePhotoURL?.includes('logo.svg') ? 'opacity-70 blur-sm' : ''}`}
            style={
              profilePhotoURL?.includes('logo.svg')
                ? { filter: 'brightness(0) invert(1)' }
                : {}
            }
          />

          {showPhotoEdit && (
            <Flex
              variant="center"
              onClick={handleEditPhotoClick}
              className="absolute inset-0 bg-black bg-opacity-50 cursor-pointer transition-opacity"
              style={{ backgroundColor: colors.transparent50 }}
            >
              <Pencil className="text-white" size={20} />
            </Flex>
          )}
        </div>

        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            Orary.
          </h1>
          <p className="text-xs text-gray-500 dark:text-slate-400 font-light">
            {t('nav.tagline')}
          </p>
        </div>
      </button>
    </div>
  );
});

NavSidebarHeader.displayName = 'NavSidebarHeader';
export default NavSidebarHeader;
