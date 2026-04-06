/**
 * Customer config helpers for both server and client side
 */

import { getCustomerBySlug, supabaseAdmin } from './supabase';

/**
 * Get customer config on the server side (getServerSideProps, API routes)
 * Reads customer slug from middleware-injected header or query param
 *
 * @param {Object} context - Next.js context (req, query, etc.)
 * @returns {Promise<Object|null>} Customer config or null
 */
export async function getCustomerServer(context) {
  let slug = null;

  // Try to get from middleware header
  if (context.req?.headers) {
    slug = context.req.headers['x-customer-slug'];
  }

  // Try to get from cookie
  if (!slug && context.req?.cookies) {
    slug = context.req.cookies['customer-slug'];
  }

  // Try to get from query param (slug or customer)
  if (!slug && context.query?.slug) {
    slug = context.query.slug;
  }
  if (!slug && context.query?.customer) {
    slug = context.query.customer;
  }

  // Default to demo
  slug = slug || 'demo';

  // Prefer supabaseAdmin server-side so RLS doesn't block the lookup
  if (supabaseAdmin) {
    const { data } = await supabaseAdmin
      .from('customers')
      .select('*')
      .eq('slug', slug)
      .maybeSingle();
    if (data) return transformCustomerConfig(data);
  }

  const customer = await getCustomerBySlug(slug);

  if (!customer) {
    return null;
  }

  return transformCustomerConfig(customer);
}

/**
 * Get customer slug from cookies on the client side
 * @returns {string} Customer slug or 'demo'
 */
export function getCustomerSlugClient() {
  if (typeof window === 'undefined') {
    return 'demo';
  }

  const cookies = document.cookie.split(';');
  const customerCookie = cookies.find(c => c.trim().startsWith('customer-slug='));

  if (customerCookie) {
    return customerCookie.split('=')[1].trim();
  }

  return 'demo';
}

/**
 * Fetch full customer config on the client side
 * Calls the /api/customer endpoint
 *
 * @returns {Promise<Object|null>} Customer config or null
 */
export async function getCustomerClient() {
  if (typeof window === 'undefined') {
    console.warn('getCustomerClient called on server side. Use getCustomerServer instead.');
    return null;
  }

  try {
    const response = await fetch('/api/customer', {
      credentials: 'include',
    });

    if (!response.ok) {
      console.error('Failed to fetch customer config:', response.status);
      return null;
    }

    return await response.json();
  } catch (err) {
    console.error('Error fetching customer config:', err);
    return null;
  }
}

/**
 * Transform database snake_case to camelCase for frontend use
 * Maintains backward compatibility with existing customerConfig format
 *
 * @param {Object} dbCustomer - Customer record from database
 * @returns {Object} Transformed customer config
 */
function transformCustomerConfig(dbCustomer) {
  return {
    // Identity
    id: dbCustomer.id,
    slug: dbCustomer.slug,

    // Branding (match existing customerConfig format)
    customerName: dbCustomer.name,
    customerLogo: dbCustomer.logo_url,

    // Authentication
    password: dbCustomer.password,

    // External links
    ndaLink: dbCustomer.nda_link,
    intakeFormLink: dbCustomer.intake_form_link,

    // Embedded content
    youtubeVideoId: dbCustomer.youtube_video_id,
    googleSlidesEmbedUrl: dbCustomer.google_slides_embed_url,

    // Team
    assignedTeam: dbCustomer.assigned_team || [],

    // Configuration
    diagnosticType: dbCustomer.diagnostic_type || 'gtm',
    diagnosticVersion: dbCustomer.diagnostic_version || 2,
    customerType: dbCustomer.customer_type || 'active',

    // Visibility
    hideEngagement: dbCustomer.hide_engagement || false,

    // Metadata
    isDemo: dbCustomer.is_demo,
    createdAt: dbCustomer.created_at,
  };
}

/**
 * Detect whether the request has an active Supabase admin session.
 * Supabase v2 sets a cookie named sb-{project-ref}-auth-token when
 * auth-helpers or SSR is used. The plain JS client uses localStorage,
 * but also sets a cookie in some configurations. We check for any
 * sb-*-auth-token cookie as a reliable server-side signal.
 */
function hasAdminSession(req) {
  const cookies = req?.cookies || {};
  return Object.keys(cookies).some(
    key => key.startsWith('sb-') && key.endsWith('-auth-token')
  ) || !!(cookies['admin-session']);
}

/**
 * Reusable getServerSideProps that resolves customer data server-side.
 * Passes customer via pageProps so CustomerProvider initialises without
 * a client-side fetch, eliminating flash-of-wrong-content.
 */
export async function getCustomerServerSideProps(context) {
  const customer = await getCustomerServer(context);
  const isAdminSession = hasAdminSession(context.req);
  return {
    props: {
      // JSON.parse(JSON.stringify(...)) strips undefined values that Next.js can't serialize
      customer: customer ? JSON.parse(JSON.stringify({ ...customer, customerType: customer.customerType || 'active' })) : null,
      isAdminSession,
    },
  };
}

export default {
  getCustomerServer,
  getCustomerSlugClient,
  getCustomerClient,
  getCustomerServerSideProps,
};
