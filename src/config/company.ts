// Single source of truth for Property Spotter company / trust details.
// Used by the trust block, footer, and any compliance-facing copy.

const API_BASE = import.meta.env.VITE_BACKEND_API ?? '';

export const company = {
  name: 'Property Spotter',
  tagline: 'Your property, our treasure',

  // Director / accountable person
  director: {
    name: 'Machiel Venter',
    title: 'Founder & Director',
    photo: '/Machiel-headshot.png',
  },

  // PPRA (Property Practitioners Regulatory Authority) credentials
  ppra: {
    certificateType: 'Fidelity Fund Certificate',
    certificateNumber: '202514013050000',
    act: 'Property Practitioners Act 22 of 2019',
    industry: 'Estate Agency',
    validUntil: '31 December 2027',
    // Authoritative copy of the certificate, served by the backend
    certificateUrl: `${API_BASE}api/company/ppra-certificate/`,
  },

  // Registered address (per PPRA Fidelity Fund Certificate)
  address: {
    street: '18 Albertyn Street',
    suburb: 'Lahoff',
    city: 'Klerksdorp',
    province: 'North West',
    postalCode: '2571',
    full: '18 Albertyn Street, Lahoff, Klerksdorp, North West, 2571',
  },

  contact: {
    tel: '+27 79 855 7301',
    telHref: 'tel:+27798557301',
    email: 'info@propertyspotter.co.za',
    emailHref: 'mailto:info@propertyspotter.co.za',
  },
} as const;

export default company;
