// Structured data (schema.org JSON-LD) for search engines, built from site.json and home.json
// so it stays in sync when Site Settings are edited in the admin page.
import { readFileSync } from 'node:fs';

const read = (f) => JSON.parse(readFileSync(new URL(f, import.meta.url), 'utf8'));

const STATE_NAMES = {
  AL: 'Alabama', AR: 'Arkansas', AZ: 'Arizona', FL: 'Florida', IL: 'Illinois', LA: 'Louisiana', MO: 'Missouri',
  MS: 'Mississippi', MT: 'Montana', NM: 'New Mexico', NY: 'New York', OH: 'Ohio', OK: 'Oklahoma', PA: 'Pennsylvania',
  SC: 'South Carolina', SD: 'South Dakota', TX: 'Texas', UT: 'Utah', VA: 'Virginia', WA: 'Washington', WY: 'Wyoming'
};

function postal(office) {
  // "Lafayette, LA 70506" -> locality, region, postal code
  const m = /^(.*),\s*([A-Z]{2})\s+(\d{5})/.exec(office.city || '');
  return {
    '@type': 'PostalAddress',
    streetAddress: office.street,
    addressLocality: m ? m[1] : office.city,
    addressRegion: m ? m[2] : undefined,
    postalCode: m ? m[3] : undefined,
    addressCountry: 'US'
  };
}

export default function () {
  const site = read('./site.json');
  const home = read('./home.json');
  const states = `${home.licensed_states || ''} · ${home.work_states || ''}`
    .split('·').map((s) => s.trim()).filter(Boolean);
  const offices = site.offices || [];
  const hq = offices[0];
  const naics = (/NAICS\s+(\d+)/.exec(site.federal_ids || '') || [])[1];
  const services = [...(home.services || []), ...(home.assessments || [])].map((s) => s.name);

  const org = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    '@id': `${site.url}/#organization`,
    name: site.name,
    alternateName: ['M&E Consulting', site.short_name].filter(Boolean),
    slogan: site.tagline,
    description: site.description,
    url: `${site.url}/`,
    logo: `${site.url}/images/me-logo.jpg`,
    image: `${site.url}/images/projects/lafayette-regional-airport-new-terminal/02.jpg`,
    telephone: site.phone,
    email: site.inquiry_email,
    foundingDate: '1997',
    naics,
    address: hq ? postal(hq) : undefined,
    openingHoursSpecification: [
      { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday'], opens: '07:00', closes: '17:00' },
      { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Friday', opens: '07:00', closes: '11:00' }
    ],
    areaServed: states.map((s) => ({ '@type': 'State', name: STATE_NAMES[s] || s })),
    knowsAbout: services,
    memberOf: (site.memberships || []).map((m) => ({ '@type': 'Organization', name: m })),
    sameAs: [site.linkedin, site.facebook].filter(Boolean),
    department: offices.slice(1).map((o) => ({
      '@type': 'ProfessionalService',
      name: `${site.name} (${o.name})`,
      address: postal(o),
      telephone: site.phone,
      parentOrganization: { '@id': `${site.url}/#organization` }
    }))
  };
  return JSON.stringify(org).replace(/</g, '\\u003c');
}
