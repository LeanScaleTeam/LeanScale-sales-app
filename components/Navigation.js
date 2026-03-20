import { useState } from 'react';
import Link from 'next/link';
import { useCustomer } from '../context/CustomerContext';

// Navigation sections (About / Diagnostic / Getting Started)
// Diagnostic and Getting Started links are filtered by diagnosticType in the component
const aboutLinks = [
  { href: '/about', label: 'Overview' },
  { href: '/about/about', label: 'About Us' },
  { href: '/about/resources', label: 'Key Resources' },
  { href: '/about/references', label: 'Customer References' },
  { href: '/about/services', label: 'Services Catalog' },
  { href: '/about/glossary', label: 'GTM Ops Glossary' },
];

// Diagnostic links shown per diagnostic type
const diagnosticLinks = {
  gtm: [
    { href: '/diagnostic', label: 'Overview' },
    { href: '/diagnostic/start', label: 'Start Diagnostic' },
    { href: '/diagnostic/gtm', label: 'GTM Diagnostic' },
  ],
  clay: [
    { href: '/diagnostic', label: 'Overview' },
    { href: '/diagnostic/start', label: 'Start Diagnostic' },
    { href: '/diagnostic/clay', label: 'Clay Diagnostic' },
  ],
  cpq: [
    { href: '/diagnostic', label: 'Overview' },
    { href: '/diagnostic/start', label: 'Start Diagnostic' },
    { href: '/diagnostic/cpq', label: 'Q2C Diagnostic' },
  ],
  // Demo users see all diagnostic types
  all: [
    { href: '/diagnostic', label: 'Overview' },
    { href: '/diagnostic/start', label: 'Start Diagnostic' },
    { href: '/diagnostic/gtm', label: 'GTM Diagnostic' },
    { href: '/diagnostic/clay', label: 'Clay Diagnostic' },
    { href: '/diagnostic/cpq', label: 'Q2C Diagnostic' },
  ],
};

// Getting Started links — clay customers see Clay x LeanScale, others don't
const gettingStartedLinks = {
  default: [
    { href: '/getting-started/availability', label: 'Cohort Availability' },
    { href: '/getting-started/one-time-projects', label: 'One-Time Projects' },
    { href: '/getting-started/crm-migration', label: 'CRM Migration' },
    { href: '/getting-started/security', label: 'Security' },
    { href: '/getting-started/team', label: 'Your Team' },
  ],
  clay: [
    { href: '/getting-started/availability', label: 'Cohort Availability' },
    { href: '/getting-started/one-time-projects', label: 'One-Time Projects' },
    { href: '/getting-started/crm-migration', label: 'CRM Migration' },
    { href: '/getting-started/security', label: 'Security' },
    { href: '/getting-started/team', label: 'Your Team' },
    { href: '/getting-started/clay', label: 'Clay x LeanScale' },
  ],
};

export default function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const { customer, isDemo, displayName, customerPath } = useCustomer();

  const toggleDropdown = (name) => {
    setOpenDropdown(openDropdown === name ? null : name);
  };

  const closeMenu = () => {
    setMobileMenuOpen(false);
    setOpenDropdown(null);
  };

  const showCustomerBranding = !isDemo && displayName;
  const diagnosticType = customer.diagnosticType || 'gtm';

  // Build nav sections based on customer's diagnostic type
  const navSections = [
    {
      name: 'about',
      label: 'About Us',
      type: 'dropdown',
      links: aboutLinks,
    },
    {
      name: 'diagnostic',
      label: 'Diagnostic',
      type: 'dropdown',
      links: isDemo
        ? diagnosticLinks.all
        : (diagnosticLinks[diagnosticType] || diagnosticLinks.gtm),
    },
    {
      name: 'getting-started',
      label: 'Getting Started',
      type: 'dropdown',
      links: diagnosticType === 'clay'
        ? gettingStartedLinks.clay
        : gettingStartedLinks.default,
    },
  ];

  return (
    <nav className="nav">
      <Link href={customerPath('/')} className="nav-logo" onClick={closeMenu}>
        {showCustomerBranding && customer.customerLogo ? (
          <>
            <img src="/leanscale-logo.png" alt="LeanScale" />
            <span className="nav-logo-divider">&times;</span>
            <img
              src={customer.customerLogo}
              alt={displayName}
              className="nav-customer-logo"
            />
          </>
        ) : showCustomerBranding ? (
          <>
            <span className="nav-brand-text nav-brand-leanscale">LeanScale</span>
            <span className="nav-logo-divider-small">&times;</span>
            <span className="nav-brand-text nav-brand-customer">{displayName}</span>
          </>
        ) : (
          <img src="/leanscale-logo.png" alt="LeanScale" />
        )}
      </Link>

      <button
        className="mobile-menu-btn"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        aria-label="Toggle menu"
      >
        {mobileMenuOpen ? '\u2715' : '\u2630'}
      </button>

      <div className={`nav-links ${mobileMenuOpen ? 'nav-links-open' : ''}`}>
        {navSections.map((item) =>
          item.type === 'link' ? (
            <Link
              key={item.name}
              href={customerPath(item.href)}
              className="nav-button"
              onClick={closeMenu}
            >
              {item.label}
            </Link>
          ) : (
            <div className="nav-item" key={item.name}>
              <button
                className="nav-button"
                onClick={() => toggleDropdown(item.name)}
              >
                {item.label}
                {item.name === 'diagnostic' && !isDemo && customer.hasDiagnosticResult && (
                  <span className="nav-dot" />
                )}
                {' '}<span>&#9662;</span>
              </button>
              <div className={`nav-dropdown ${openDropdown === item.name ? 'nav-dropdown-open' : ''}`}>
                {item.links.map((link) => (
                  <Link href={customerPath(link.href)} onClick={closeMenu} key={link.href}>
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          )
        )}

      </div>
    </nav>
  );
}
