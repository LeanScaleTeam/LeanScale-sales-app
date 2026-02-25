/**
 * @jest-environment jsdom
 */

/**
 * Tests for AnalyzingScreen component
 *
 * Validates the 3-step animated progress screen shown during
 * Salesforce metadata analysis. Tests cover rendering, step
 * progression, API calls, success/error callbacks, and cleanup.
 */

import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import AnalyzingScreen from '../../components/diagnostic-intake/AnalyzingScreen';

// Mock framer-motion to render plain divs (avoids animation timing issues in tests)
jest.mock('framer-motion', () => {
  const React = require('react');
  return {
    motion: {
      div: React.forwardRef(({ children, ...props }, ref) => {
        // Strip motion-specific props so they don't warn on DOM elements
        const {
          initial, animate, exit, transition, whileHover, whileTap,
          variants, layout, layoutId, onAnimationComplete, ...domProps
        } = props;
        return <div ref={ref} {...domProps}>{children}</div>;
      }),
      span: React.forwardRef(({ children, ...props }, ref) => {
        const {
          initial, animate, exit, transition, whileHover, whileTap,
          variants, layout, layoutId, onAnimationComplete, ...domProps
        } = props;
        return <span ref={ref} {...domProps}>{children}</span>;
      }),
    },
    AnimatePresence: ({ children }) => <>{children}</>,
  };
});

// Mock timers for controlling delay() calls
beforeEach(() => {
  jest.useFakeTimers();
  global.fetch = jest.fn();
});

afterEach(() => {
  jest.useRealTimers();
  jest.restoreAllMocks();
});

describe('AnalyzingScreen', () => {
  const defaultProps = {
    customerId: 'test-customer-123',
    onComplete: jest.fn(),
    onError: jest.fn(),
  };

  describe('Initial rendering', () => {
    test('renders the title "Analyzing Salesforce Org"', () => {
      render(<AnalyzingScreen {...defaultProps} />);
      expect(screen.getByText('Analyzing Salesforce Org')).toBeInTheDocument();
    });

    test('renders the subtitle "This takes a few seconds..."', () => {
      render(<AnalyzingScreen {...defaultProps} />);
      expect(screen.getByText('This takes a few seconds...')).toBeInTheDocument();
    });

    test('renders all 3 step labels', () => {
      render(<AnalyzingScreen {...defaultProps} />);
      expect(screen.getByText('Connecting to Salesforce...')).toBeInTheDocument();
      expect(screen.getByText('Downloading org metadata...')).toBeInTheDocument();
      expect(screen.getByText('Analyzing your configuration...')).toBeInTheDocument();
    });

    test('renders a spinner element', () => {
      const { container } = render(<AnalyzingScreen {...defaultProps} />);
      // The spinner is a div with border-top styled blue and border-radius 50%
      const spinner = container.querySelector('[data-testid="spinner"]');
      expect(spinner).toBeInTheDocument();
    });
  });

  describe('Step progression', () => {
    test('step 1 completes after 800ms delay', async () => {
      render(<AnalyzingScreen {...defaultProps} />);

      // Before 800ms: step 1 should still be "Connecting to Salesforce..."
      expect(screen.getByText('Connecting to Salesforce...')).toBeInTheDocument();

      // Advance past the 800ms delay
      await act(async () => {
        jest.advanceTimersByTime(800);
      });

      // Step 1 should now show as completed (checkmark replaces ellipsis)
      await waitFor(() => {
        expect(screen.queryByText('Connecting to Salesforce...')).not.toBeInTheDocument();
      });
    });

    test('step 2 completes after an additional 1200ms delay', async () => {
      render(<AnalyzingScreen {...defaultProps} />);

      // Complete step 1
      await act(async () => {
        jest.advanceTimersByTime(800);
      });

      // Step 2 should still be in progress
      expect(screen.getByText('Downloading org metadata...')).toBeInTheDocument();

      // Advance past the 1200ms delay
      await act(async () => {
        jest.advanceTimersByTime(1200);
      });

      // Step 2 should now show as completed
      await waitFor(() => {
        expect(screen.queryByText('Downloading org metadata...')).not.toBeInTheDocument();
      });
    });
  });

  describe('API call for inference', () => {
    test('calls POST /api/salesforce/infer with customerId after steps 1 and 2', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ preFill: { A2: { value: '6-15', confidence: 'high' } } }),
      });

      render(<AnalyzingScreen {...defaultProps} />);

      // Complete step 1 (800ms) + step 2 (1200ms)
      await act(async () => {
        jest.advanceTimersByTime(800);
      });
      await act(async () => {
        jest.advanceTimersByTime(1200);
      });

      // The fetch should now be called
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith('/api/salesforce/infer', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ customerId: 'test-customer-123' }),
        });
      });
    });

    test('calls onComplete with preFill map on successful API response', async () => {
      const preFillData = { A2: { value: '6-15', confidence: 'high' } };
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ preFill: preFillData }),
      });

      render(<AnalyzingScreen {...defaultProps} />);

      // Complete steps 1 and 2
      await act(async () => {
        jest.advanceTimersByTime(800);
      });
      await act(async () => {
        jest.advanceTimersByTime(1200);
      });

      // Wait for fetch to complete, then advance past 600ms completion pause
      await act(async () => {
        await Promise.resolve(); // flush fetch promise
        jest.advanceTimersByTime(600);
      });

      await waitFor(() => {
        expect(defaultProps.onComplete).toHaveBeenCalledWith(preFillData);
      });
    });

    test('calls onComplete with empty object when API returns no preFill', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({}),
      });

      render(<AnalyzingScreen {...defaultProps} />);

      // Complete steps 1 and 2
      await act(async () => {
        jest.advanceTimersByTime(800);
      });
      await act(async () => {
        jest.advanceTimersByTime(1200);
      });

      // Wait for fetch + 600ms pause
      await act(async () => {
        await Promise.resolve();
        jest.advanceTimersByTime(600);
      });

      await waitFor(() => {
        expect(defaultProps.onComplete).toHaveBeenCalledWith({});
      });
    });
  });

  describe('Error handling', () => {
    test('calls onError when API returns non-ok response', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
      });

      render(<AnalyzingScreen {...defaultProps} />);

      // Complete steps 1 and 2
      await act(async () => {
        jest.advanceTimersByTime(800);
      });
      await act(async () => {
        jest.advanceTimersByTime(1200);
      });

      // Wait for fetch to complete
      await act(async () => {
        await Promise.resolve();
      });

      await waitFor(() => {
        expect(defaultProps.onError).toHaveBeenCalledWith('Failed to analyze Salesforce data');
      });
    });

    test('calls onError when fetch throws a network error', async () => {
      global.fetch.mockRejectedValueOnce(new Error('Network failure'));

      render(<AnalyzingScreen {...defaultProps} />);

      // Complete steps 1 and 2
      await act(async () => {
        jest.advanceTimersByTime(800);
      });
      await act(async () => {
        jest.advanceTimersByTime(1200);
      });

      // Wait for the rejected fetch
      await act(async () => {
        await Promise.resolve();
      });

      await waitFor(() => {
        expect(defaultProps.onError).toHaveBeenCalledWith('Network failure');
      });
    });
  });

  describe('Edge cases', () => {
    test('does nothing when customerId is not provided', async () => {
      render(<AnalyzingScreen onComplete={defaultProps.onComplete} onError={defaultProps.onError} />);

      await act(async () => {
        jest.advanceTimersByTime(5000);
      });

      // Neither callback should be called
      expect(defaultProps.onComplete).not.toHaveBeenCalled();
      expect(defaultProps.onError).not.toHaveBeenCalled();
      expect(global.fetch).not.toHaveBeenCalled();
    });

    test('does not call callbacks after unmount (cleanup)', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ preFill: { A2: { value: '1-5' } } }),
      });

      const { unmount } = render(<AnalyzingScreen {...defaultProps} />);

      // Advance partway through
      await act(async () => {
        jest.advanceTimersByTime(400);
      });

      // Unmount before steps complete
      unmount();

      // Advance remaining timers
      await act(async () => {
        jest.advanceTimersByTime(5000);
      });

      // Callbacks should not have been called
      expect(defaultProps.onComplete).not.toHaveBeenCalled();
      expect(defaultProps.onError).not.toHaveBeenCalled();
    });
  });
});
