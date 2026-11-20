// src/pages/legal/PrivacyPolicy.jsx
// Text: src/locales/<lang>/legal/privacy.json (en, es, fr)

import LegalPageShell from './LegalPageShell';
import LegalContent, { useLegalDoc } from './LegalContent';
import buildInfo from '../../generated/buildInfo.json';

const PrivacyPolicy = () => {
  const doc = useLegalDoc('privacy');
  return (
    <LegalPageShell
      seo={{ title: doc.seoTitle, description: doc.seoDescription, canonical: 'https://orary.app/privacy' }}
      badge={{ label: doc.badge, bg: 'rgba(99,102,241,0.2)', text: '#a5b4fc' }}
      title={doc.title}
      lastUpdated={buildInfo.legalDates.privacy}
      currentPath="/privacy"
    >
      <LegalContent doc="privacy" />
    </LegalPageShell>
  );
};

export default PrivacyPolicy;
