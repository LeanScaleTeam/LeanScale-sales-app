/**
 * Design tokens for the inline-style marketing surface.
 *
 * The marketing pages (homepage, /about/*, /getting-started/*, /diagnostic/*)
 * use inline `style={{ ... }}` rather than CSS classes, so these are JS
 * constants instead of CSS variables. The audit found the same values
 * pasted dozens of times with subtle drift (4 different "near-black"
 * heading colors, 6 different hero padding ramps, etc.). Use these tokens
 * for any new marketing UI; existing pages can migrate incrementally.
 *
 * If you reach for a magic color/gradient/clamp string, check here first.
 */

// ── Colors ──────────────────────────────────────────────────────────

/** Canonical brand purple. Used for eyebrow labels, accent borders, focus rings. */
export const PURPLE = '#7c3aed';

/** Lighter purple, for gradient stops and hover/highlight surfaces. */
export const PURPLE_LIGHT = '#a855f7';

/** Lavender — used sparingly for muted purple text on dark surfaces. */
export const LAVENDER = '#a78bfa';

/** Lime green accent — eyebrow dots, gradient text, focus ring. */
export const LIME = '#a3e635';

/** Darker lime — gradient end stop. */
export const LIME_DEEP = '#84cc16';

/** Deep dark used as the base of every dark hero / footer. */
export const DARK_BG = '#0a0118';

/**
 * Canonical near-black for headings on light backgrounds. Resolves the
 * #1a0a2e / #0f0524 / #1a1a1a / #111 drift the audit flagged.
 */
export const DARK_HEADING = '#0f0524';

/** Default body-gray on light backgrounds (~5:1 contrast — passes AA). */
export const BODY_MUTED = '#6b7280';

/** Slightly darker body gray, used on About-style content surfaces. */
export const BODY_DARK = '#4a4a5a';

/** White body text on dark backgrounds (passes AA). */
export const WHITE_BODY = 'rgba(255, 255, 255, 0.7)';

/** Muted white, captions/labels on dark. */
export const WHITE_MUTED = 'rgba(255, 255, 255, 0.55)';

// ── Gradients ───────────────────────────────────────────────────────

/** Canonical dark hero background. Used on every marketing-page hero + footer. */
export const HERO_BG =
  'linear-gradient(160deg, #0a0118 0%, #1a0a2e 30%, #2d1845 60%, #1a0a2e 100%)';

/** Primary lime CTA gradient (buttons, gradient text). */
export const LIME_GRADIENT = `linear-gradient(135deg, ${LIME} 0%, ${LIME_DEEP} 100%)`;

/** Purple gradient for accents, "Most Popular" pills, etc. */
export const PURPLE_GRADIENT = `linear-gradient(135deg, ${PURPLE} 0%, ${PURPLE_LIGHT} 100%)`;

// ── Type ────────────────────────────────────────────────────────────

/** Canonical hero H1 size ramp. */
export const H1_FONT_SIZE = 'clamp(2rem, 5vw, 3.5rem)';

/** Canonical section H2 size ramp. */
export const H2_FONT_SIZE = 'clamp(1.65rem, 3vw, 2.25rem)';

// ── Spacing ─────────────────────────────────────────────────────────

/** Hero vertical padding ramp. */
export const HERO_PADDING_Y = 'clamp(4rem, 10vw, 8rem)';

/** Standard section vertical padding ramp. */
export const SECTION_PADDING_Y = 'clamp(3rem, 8vw, 6rem)';

/** Standard horizontal page padding ramp. */
export const PAGE_PADDING_X = 'clamp(1rem, 5vw, 3rem)';

// ── Reusable style fragments ────────────────────────────────────────

/**
 * The uppercase eyebrow label that sits above section H2s
 * (purple, small, wide letter-spacing).
 */
export const EYEBROW_LABEL_STYLE = {
  display: 'inline-block',
  fontSize: '0.8rem',
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: '0.12em',
  color: PURPLE,
  marginBottom: '0.75rem',
};

/**
 * Lime gradient text — apply to a span around the gradient word inside an H1.
 * Includes the WebKit prefixes the marketing pages already use.
 */
export const LIME_GRADIENT_TEXT_STYLE = {
  background: LIME_GRADIENT,
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
};
