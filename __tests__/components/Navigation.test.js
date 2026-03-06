/**
 * @jest-environment jsdom
 */

/**
 * Tests for components/Navigation.js
 *
 * Validates the unified navigation:
 * - All users see About Us / Diagnostic / Getting Started sections
 * - Diagnostic links filtered by customer.diagnosticType
 * - Demo users see all diagnostic types
 * - Notification dot shown when customer has diagnostic results
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Navigation from '../../components/Navigation';

// Mock next/link to render a plain <a> tag
jest.mock('next/link', () => {
  return function MockLink({ children, href, ...props }) {
    return <a href={href} {...props}>{children}</a>;
  };
});

// Mock the customer context
const mockUseCustomer = jest.fn();
jest.mock('../../context/CustomerContext', () => ({
  useCustomer: () => mockUseCustomer(),
}));

describe('Navigation', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Demo / Prospect Navigation', () => {
    beforeEach(() => {
      mockUseCustomer.mockReturnValue({
        customer: {
          slug: 'demo',
          customerName: 'Demo',
          customerLogo: null,
          diagnosticType: 'gtm',
          hasDiagnosticResult: false,
        },
        isDemo: true,
        displayName: null,
        customerPath: (p) => p,
      });
    });

    test('renders About Us dropdown', () => {
      render(<Navigation />);
      expect(screen.getAllByText('About Us').length).toBeGreaterThanOrEqual(1);
    });

    test('renders Diagnostic dropdown', () => {
      render(<Navigation />);
      expect(screen.getByText('Diagnostic')).toBeInTheDocument();
    });

    test('renders Getting Started dropdown', () => {
      render(<Navigation />);
      expect(screen.getByText('Getting Started')).toBeInTheDocument();
    });

    test('demo users see all diagnostic types', () => {
      render(<Navigation />);
      expect(screen.getByText('GTM Diagnostic')).toBeInTheDocument();
      expect(screen.getByText('Clay Diagnostic')).toBeInTheDocument();
      expect(screen.getByText('Q2C Diagnostic')).toBeInTheDocument();
    });

    test('does not show notification dot for demo users', () => {
      render(<Navigation />);
      expect(document.querySelector('.nav-dot')).not.toBeInTheDocument();
    });
  });

  describe('GTM Customer Navigation', () => {
    beforeEach(() => {
      mockUseCustomer.mockReturnValue({
        customer: {
          slug: 'acme',
          customerName: 'Acme Corp',
          customerLogo: null,
          diagnosticType: 'gtm',
          hasDiagnosticResult: false,
        },
        isDemo: false,
        displayName: 'Acme Corp',
        customerPath: (p) => `/c/acme${p}`,
      });
    });

    test('renders unified nav sections', () => {
      render(<Navigation />);
      expect(screen.getAllByText('About Us').length).toBeGreaterThanOrEqual(1);
      expect(screen.getByText('Diagnostic')).toBeInTheDocument();
      expect(screen.getByText('Getting Started')).toBeInTheDocument();
    });

    test('only shows GTM Diagnostic link', () => {
      render(<Navigation />);
      expect(screen.getByText('GTM Diagnostic')).toBeInTheDocument();
      expect(screen.queryByText('Clay Diagnostic')).not.toBeInTheDocument();
      expect(screen.queryByText('Q2C Diagnostic')).not.toBeInTheDocument();
    });

    test('does not show Clay x LeanScale link', () => {
      render(<Navigation />);
      expect(screen.queryByText('Clay x LeanScale')).not.toBeInTheDocument();
    });

    test('shows customer branding', () => {
      render(<Navigation />);
      expect(screen.getByText('Acme Corp')).toBeInTheDocument();
    });
  });

  describe('Clay Customer Navigation', () => {
    beforeEach(() => {
      mockUseCustomer.mockReturnValue({
        customer: {
          slug: 'clayco',
          customerName: 'ClayCompany',
          customerLogo: null,
          diagnosticType: 'clay',
          hasDiagnosticResult: false,
        },
        isDemo: false,
        displayName: 'ClayCompany',
        customerPath: (p) => `/c/clayco${p}`,
      });
    });

    test('only shows Clay Diagnostic link', () => {
      render(<Navigation />);
      expect(screen.getByText('Clay Diagnostic')).toBeInTheDocument();
      expect(screen.queryByText('GTM Diagnostic')).not.toBeInTheDocument();
      expect(screen.queryByText('Q2C Diagnostic')).not.toBeInTheDocument();
    });

    test('shows Clay x LeanScale link', () => {
      render(<Navigation />);
      expect(screen.getByText('Clay x LeanScale')).toBeInTheDocument();
    });
  });

  describe('Diagnostic notification dot', () => {
    test('shows dot when customer has diagnostic result and is not demo', () => {
      mockUseCustomer.mockReturnValue({
        customer: {
          slug: 'acme',
          customerName: 'Acme Corp',
          customerLogo: null,
          diagnosticType: 'gtm',
          hasDiagnosticResult: true,
        },
        isDemo: false,
        displayName: 'Acme Corp',
        customerPath: (p) => `/c/acme${p}`,
      });
      render(<Navigation />);
      expect(document.querySelector('.nav-dot')).toBeInTheDocument();
    });

    test('does not show dot for demo users even with diagnostic result', () => {
      mockUseCustomer.mockReturnValue({
        customer: {
          slug: 'demo',
          customerName: 'Demo',
          customerLogo: null,
          diagnosticType: 'gtm',
          hasDiagnosticResult: true,
        },
        isDemo: true,
        displayName: null,
        customerPath: (p) => p,
      });
      render(<Navigation />);
      expect(document.querySelector('.nav-dot')).not.toBeInTheDocument();
    });

    test('does not show dot when customer has no diagnostic result', () => {
      mockUseCustomer.mockReturnValue({
        customer: {
          slug: 'acme',
          customerName: 'Acme Corp',
          customerLogo: null,
          diagnosticType: 'gtm',
          hasDiagnosticResult: false,
        },
        isDemo: false,
        displayName: 'Acme Corp',
        customerPath: (p) => `/c/acme${p}`,
      });
      render(<Navigation />);
      expect(document.querySelector('.nav-dot')).not.toBeInTheDocument();
    });
  });
});
