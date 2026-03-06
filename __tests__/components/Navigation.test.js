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
 * - Unified "View Diagnostic" CTA for all users
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
        },
        isDemo: true,
        displayName: null,
        customerPath: (p) => p,
      });
    });

    test('renders About Us dropdown', () => {
      render(<Navigation />);
      expect(screen.getByText('About Us')).toBeInTheDocument();
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

    test('renders View Diagnostic CTA', () => {
      render(<Navigation />);
      expect(screen.getByText('View Diagnostic')).toBeInTheDocument();
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
        },
        isDemo: false,
        displayName: 'Acme Corp',
        customerPath: (p) => `/c/acme${p}`,
      });
    });

    test('renders unified nav sections', () => {
      render(<Navigation />);
      expect(screen.getByText('About Us')).toBeInTheDocument();
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

    test('renders View Diagnostic CTA', () => {
      render(<Navigation />);
      expect(screen.getByText('View Diagnostic')).toBeInTheDocument();
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
});
