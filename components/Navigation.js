import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useCustomer } from '../context/CustomerContext';

const aboutLinks = [
  { href: '/about', label: 'Overview' },
  { href: '/about/about', label: 'About Us' },
  { href: '/about/resources', label: 'Key Resources' },
  { href: '/about/references', label: 'Customer References' },
  { href: '/about/services', label: 'Services Catalog' },
  { href: '/about/glossary', label: 'GTM Ops Glossary' },
];

const diagnosticLinks = {
  gtm: [
    { href: '/diagnostic', label: 'Overview' },
    { href: '/diagnostic/start', label: 'Start Diagnostic' },
    { href: '/diagnostic/gtm', label: 'GTM Diagnostic' },
  ],
  clay: [
    { href: '/diagnostic', label: 'Overview' },
    { href: '/diagnostic/start', label: 'Start Diagnostic' },
    { href: '/diagnostic/gtm', label: 'GTM Diagnostic' },
  ],
  cpq: [
    { href: '/diagnostic', label: 'Overview' },
    { href: '/diagnostic/start', label: 'Start Diagnostic' },
    { href: '/diagnostic/gtm', label: 'GTM Diagnostic' },
  ],
  all: [
    { href: '/diagnostic', label: 'Overview' },
    { href: '/diagnostic/start', label: 'Start Diagnostic' },
    { href: '/diagnostic/gtm', label: 'GTM Diagnostic' },
  ],
};

const gettingStartedLinks = {
  default: [
    { type: 'group', label: 'Ultimate GTM', children: [
      { href: '/getting-started/ultimate-gtm', label: 'Overview' },
      { href: '/getting-started/ultimate-gtm#review-scope', label: 'Review Scope' },
    ]},
    { type: 'group', label: 'Embedded', children: [
      { href: '/getting-started/embedded', label: 'Overview' },
      { href: '/getting-started/availability', label: 'Cohort Availability' },
      { href: '/getting-started/team', label: 'Your Team' },
    ]},
  ],
  clay: [
    { type: 'group', label: 'Ultimate GTM', children: [
      { href: '/getting-started/ultimate-gtm', label: 'Overview' },
      { href: '/getting-started/ultimate-gtm#review-scope', label: 'Review Scope' },
    ]},
    { type: 'group', label: 'Embedded', children: [
      { href: '/getting-started/embedded', label: 'Overview' },
      { href: '/getting-started/availability', label: 'Cohort Availability' },
      { href: '/getting-started/team', label: 'Your Team' },
    ]},
    { href: '/getting-started/clay', label: 'Clay x LeanScale' },
  ],
};

export default function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [hoveredDropdown, setHoveredDropdown] = useState(null);
  const [bookingOpen, setBookingOpen] = useState(false);
  const bookingRef = useRef(null);
  const { customer, isDemo, displayName, customerPath } = useCustomer();
  const router = useRouter();
  const navRef = useRef(null);

  const closeMenu = () => {
    setMobileMenuOpen(false);
    setOpenDropdown(null);
    setHoveredDropdown(null);
  };

  useEffect(() => {
    router.events.on('routeChangeComplete', closeMenu);
    return () => router.events.off('routeChangeComplete', closeMenu);
  }, [router]);

  useEffect(() => {
    const handleClick = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) {
        closeMenu();
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileMenuOpen]);

  // Load Reclaim scheduling script when modal opens
  useEffect(() => {
    if (bookingOpen && bookingRef.current) {
      bookingRef.current.innerHTML = '';
      const script = document.createElement('script');
      script.src = 'https://meet.reclaimai.com/scripts/embed-scheduling-link.0.x.x.js';
      script.dataset.id = '7f49bc93-ac0e-47eb-9e6a-0936f035cfa8';
      script.dataset.redirect = 'NONE';
      bookingRef.current.appendChild(script);
    }
  }, [bookingOpen]);

  // Lock scroll when booking modal is open
  useEffect(() => {
    if (bookingOpen) {
      document.body.style.overflow = 'hidden';
    } else if (!mobileMenuOpen) {
      document.body.style.overflow = '';
    }
  }, [bookingOpen, mobileMenuOpen]);

  const showCustomerBranding = !isDemo && displayName;
  const diagnosticType = customer.diagnosticType || 'gtm';

  const navSections = [
    { name: 'about', label: 'About Us', links: aboutLinks },
    {
      name: 'diagnostic',
      label: 'Diagnostic',
      links: isDemo ? diagnosticLinks.all : (diagnosticLinks[diagnosticType] || diagnosticLinks.gtm),
      hasDot: !isDemo && customer.hasDiagnosticResult,
    },
    {
      name: 'getting-started',
      label: 'Getting Started',
      links: diagnosticType === 'clay' ? gettingStartedLinks.clay : gettingStartedLinks.default,
    },
  ];

  return (
    <nav
      ref={navRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        height: 72,
        background: '#0f0720',
        borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
      }}
    >
      <div style={{
        maxWidth: 1200,
        margin: '0 auto',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 clamp(1.5rem, 4vw, 3rem)',
      }}>
        {/* Logo */}
        <Link href={customerPath('/')} onClick={closeMenu} style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.6rem',
          textDecoration: 'none',
          flexShrink: 0,
        }}>
          {showCustomerBranding && customer.customerLogo ? (
            <>
              <img src="/leanscale-logo.png" alt="LeanScale" style={{ height: 30, filter: 'brightness(0) invert(1)' }} />
              <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: '1.2rem', fontWeight: 200 }}>|</span>
              <img src={customer.customerLogo} alt={displayName} style={{ height: 26, maxWidth: 100, objectFit: 'contain' }} />
            </>
          ) : showCustomerBranding ? (
            <>
              <span style={{
                fontWeight: 700,
                fontSize: '1.15rem',
                color: '#fff',
                letterSpacing: '-0.02em',
              }}>LeanScale</span>
              <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: '1.2rem', fontWeight: 200 }}>|</span>
              <span style={{ fontWeight: 500, fontSize: '0.95rem', color: 'rgba(255,255,255,0.7)' }}>{displayName}</span>
            </>
          ) : (
            <img src="/leanscale-logo.png" alt="LeanScale" style={{ height: 30, filter: 'brightness(0) invert(1)' }} />
          )}
        </Link>

        {/* Desktop Nav Links + CTA */}
        <div className="nav-desktop-links" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.25rem',
        }}>
          {navSections.map((section) => (
            <div
              key={section.name}
              style={{ position: 'relative' }}
              onMouseEnter={() => setHoveredDropdown(section.name)}
              onMouseLeave={() => setHoveredDropdown(null)}
            >
              <button
                className="nav-link-btn"
                style={{
                  background: 'none',
                  border: 'none',
                  padding: '0.5rem 1rem',
                  height: 72,
                  fontSize: '0.9rem',
                  fontWeight: 500,
                  color: hoveredDropdown === section.name ? '#fff' : 'rgba(255,255,255,0.6)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  transition: 'color 0.2s ease',
                  fontFamily: 'inherit',
                  letterSpacing: '-0.01em',
                  position: 'relative',
                }}
              >
                {section.label}
                {section.hasDot && (
                  <span style={{
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    background: '#a3e635',
                    display: 'inline-block',
                  }} />
                )}
                {/* Active underline indicator */}
                <span style={{
                  position: 'absolute',
                  bottom: 16,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: hoveredDropdown === section.name ? '60%' : '0%',
                  height: 2,
                  background: '#a3e635',
                  borderRadius: 1,
                  transition: 'width 0.2s ease',
                }} />
              </button>

              {/* Dropdown */}
              <div style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                paddingTop: 4,
                opacity: hoveredDropdown === section.name ? 1 : 0,
                visibility: hoveredDropdown === section.name ? 'visible' : 'hidden',
                transform: hoveredDropdown === section.name ? 'translateY(0)' : 'translateY(-6px)',
                transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                pointerEvents: hoveredDropdown === section.name ? 'auto' : 'none',
              }}>
              <div style={{
                background: '#1a1030',
                border: '1px solid rgba(124, 58, 237, 0.15)',
                borderRadius: 10,
                padding: '0.5rem',
                minWidth: 230,
                boxShadow: '0 16px 48px rgba(0, 0, 0, 0.4)',
              }}>
                {section.links.map((link, idx) =>
                  link.type === 'group' ? (
                    <div key={link.label} style={{ marginTop: idx > 0 ? '0.15rem' : 0 }}>
                      {idx > 0 && <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', margin: '0.3rem 0.6rem' }} />}
                      <div style={{
                        fontSize: '0.7rem',
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        color: '#a855f7',
                        padding: '0.4rem 0.75rem 0.15rem',
                      }}>
                        {link.label}
                      </div>
                      {link.children.map((child) => (
                        <Link
                          href={customerPath(child.href)}
                          onClick={closeMenu}
                          key={child.href}
                          className="nav-dropdown-link"
                          style={{
                            display: 'block',
                            padding: '0.4rem 0.75rem',
                            color: 'rgba(255,255,255,0.6)',
                            fontSize: '0.85rem',
                            fontWeight: 450,
                            borderRadius: 6,
                            textDecoration: 'none',
                            transition: 'all 0.12s ease',
                          }}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <Link
                      href={customerPath(link.href)}
                      onClick={closeMenu}
                      key={link.href}
                      className="nav-dropdown-link"
                      style={{
                        display: 'block',
                        padding: '0.4rem 0.75rem',
                        color: 'rgba(255,255,255,0.6)',
                        fontSize: '0.85rem',
                        fontWeight: 450,
                        borderRadius: 6,
                        textDecoration: 'none',
                        transition: 'all 0.12s ease',
                      }}
                    >
                      {link.label}
                    </Link>
                  )
                )}
              </div>
              </div>
            </div>
          ))}

          {/* CTA Button */}
          <button
            onClick={() => { closeMenu(); setBookingOpen(true); }}
            style={{
              marginLeft: '0.75rem',
              padding: '0.5rem 1.25rem',
              background: 'linear-gradient(135deg, #a3e635 0%, #84cc16 100%)',
              color: '#0a0118',
              fontSize: '0.8rem',
              fontWeight: 700,
              borderRadius: '9999px',
              border: 'none',
              cursor: 'pointer',
              letterSpacing: '-0.01em',
              transition: 'opacity 0.15s ease, transform 0.15s ease',
              whiteSpace: 'nowrap',
              fontFamily: 'inherit',
            }}
            className="nav-cta-btn"
          >
            Book a Call
          </button>
        </div>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
          className="nav-mobile-btn"
          style={{
            display: 'none',
            background: 'none',
            border: 'none',
            width: 44,
            height: 44,
            cursor: 'pointer',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 0,
            flexShrink: 0,
          }}
        >
          <div style={{ width: 20, height: 14, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <span style={{
              display: 'block', width: 20, height: 2, background: '#fff', borderRadius: 1,
              transition: 'all 0.25s ease',
              transform: mobileMenuOpen ? 'translateY(6px) rotate(45deg)' : 'none',
            }} />
            <span style={{
              display: 'block', width: 20, height: 2, background: '#fff', borderRadius: 1,
              transition: 'all 0.25s ease',
              opacity: mobileMenuOpen ? 0 : 1,
            }} />
            <span style={{
              display: 'block', width: 20, height: 2, background: '#fff', borderRadius: 1,
              transition: 'all 0.25s ease',
              transform: mobileMenuOpen ? 'translateY(-6px) rotate(-45deg)' : 'none',
            }} />
          </div>
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div
          className="nav-mobile-menu"
          style={{
            position: 'fixed',
            top: 72,
            left: 0,
            right: 0,
            bottom: 0,
            background: '#0f0720',
            overflowY: 'auto',
            zIndex: 999,
            padding: '1rem 0 2rem',
            animation: 'navFadeIn 0.2s ease',
          }}
        >
          <div style={{ maxWidth: 480, margin: '0 auto', padding: '0 1.5rem' }}>
            {navSections.map((section, sIdx) => (
              <div key={section.name} style={{
                borderBottom: sIdx < navSections.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none',
              }}>
                <button
                  onClick={() => setOpenDropdown(openDropdown === section.name ? null : section.name)}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '1.1rem 0',
                    background: 'none',
                    border: 'none',
                    color: '#fff',
                    fontSize: '1.05rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    letterSpacing: '-0.01em',
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {section.label}
                    {section.hasDot && (
                      <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#a3e635' }} />
                    )}
                  </span>
                  <svg width="12" height="7" viewBox="0 0 12 7" fill="none" style={{
                    transition: 'transform 0.25s ease',
                    transform: openDropdown === section.name ? 'rotate(180deg)' : 'rotate(0)',
                    opacity: 0.35,
                  }}>
                    <path d="M1 1L6 6L11 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>

                {openDropdown === section.name && (
                  <div style={{ paddingBottom: '0.75rem' }}>
                    {section.links.map((link) =>
                      link.type === 'group' ? (
                        <div key={link.label} style={{ marginBottom: '0.35rem' }}>
                          <div style={{
                            fontSize: '0.7rem',
                            fontWeight: 600,
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                            color: '#a855f7',
                            padding: '0.4rem 0 0.25rem',
                          }}>
                            {link.label}
                          </div>
                          {link.children.map((child) => (
                            <Link
                              href={customerPath(child.href)}
                              onClick={closeMenu}
                              key={child.href}
                              style={{
                                display: 'block',
                                padding: '0.55rem 0 0.55rem 0.75rem',
                                color: 'rgba(255,255,255,0.5)',
                                fontSize: '0.95rem',
                                textDecoration: 'none',
                              }}
                            >
                              {child.label}
                            </Link>
                          ))}
                        </div>
                      ) : (
                        <Link
                          href={customerPath(link.href)}
                          onClick={closeMenu}
                          key={link.href}
                          style={{
                            display: 'block',
                            padding: '0.55rem 0',
                            color: 'rgba(255,255,255,0.5)',
                            fontSize: '0.95rem',
                            textDecoration: 'none',
                          }}
                        >
                          {link.label}
                        </Link>
                      )
                    )}
                  </div>
                )}
              </div>
            ))}

            {/* Mobile CTA */}
            <div style={{ paddingTop: '1.25rem' }}>
              <button
                onClick={() => { closeMenu(); setBookingOpen(true); }}
                style={{
                  display: 'block',
                  width: '100%',
                  textAlign: 'center',
                  padding: '0.85rem',
                  background: 'linear-gradient(135deg, #a3e635 0%, #84cc16 100%)',
                  color: '#0a0118',
                  fontSize: '0.9rem',
                  fontWeight: 700,
                  borderRadius: '9999px',
                  border: 'none',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                }}
              >
                Book a Call
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Booking Modal */}
      {bookingOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 2000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(0, 0, 0, 0.6)',
            backdropFilter: 'blur(4px)',
            WebkitBackdropFilter: 'blur(4px)',
          }}
          onClick={(e) => { if (e.target === e.currentTarget) setBookingOpen(false); }}
        >
          <div style={{
            background: '#fff',
            borderRadius: 16,
            width: '90vw',
            maxWidth: 650,
            height: '80vh',
            maxHeight: 700,
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 24px 80px rgba(0, 0, 0, 0.3)',
          }}>
            {/* Close button */}
            <button
              onClick={() => setBookingOpen(false)}
              style={{
                position: 'absolute',
                top: 12,
                right: 12,
                zIndex: 10,
                width: 32,
                height: 32,
                borderRadius: '50%',
                border: 'none',
                background: '#f3f4f6',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1rem',
                color: '#374151',
                transition: 'background 0.15s ease',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = '#e5e7eb'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = '#f3f4f6'; }}
            >
              ✕
            </button>
            {/* Reclaim embed */}
            <div
              ref={bookingRef}
              style={{
                width: '100%',
                height: '100%',
                overflow: 'auto',
              }}
            />
          </div>
        </div>
      )}

      <style jsx global>{`
        .nav-mobile-btn { display: none !important; }
        .nav-desktop-links { display: flex !important; }
        .nav-dropdown-link:hover {
          background: rgba(124, 58, 237, 0.12) !important;
          color: #fff !important;
        }
        .nav-cta-btn:hover {
          opacity: 0.9;
          transform: translateY(-1px);
        }
        @keyframes navFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @media (max-width: 768px) {
          .nav-mobile-btn { display: flex !important; }
          .nav-desktop-links { display: none !important; }
        }
      `}</style>
    </nav>
  );
}
