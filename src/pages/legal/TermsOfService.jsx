// src/pages/legal/TermsOfService.jsx
// Text: src/locales/<lang>/legal/terms.json (en, es, fr)

import LegalPageShell from './LegalPageShell';
import LegalContent, { useLegalDoc } from './LegalContent';
import buildInfo from '../../generated/buildInfo.json';

const TermsOfService = () => {
  const doc = useLegalDoc('terms');
  return (
    <LegalPageShell
      seo={{ title: doc.seoTitle, description: doc.seoDescription, canonical: 'https://orary.app/terms' }}
      badge={{ label: doc.badge, bg: 'rgba(236,72,153,0.2)', text: '#f9a8d4' }}
      title={doc.title}
      lastUpdated={buildInfo.legalDates.terms}
      currentPath="/terms"
    >
      <LegalContent doc="terms" />
    </LegalPageShell>
  );
};

export default TermsOfService;
