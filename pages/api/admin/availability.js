/**
 * Admin API for availability/cohort date CRUD operations
 * Requires authentication via Supabase session
 */

import { supabaseAdmin } from '../../../lib/supabase';

export default async function handler(req, res) {
  if (!supabaseAdmin) {
    return res.status(500).json({ error: 'Supabase not configured' });
  }

  switch (req.method) {
    case 'GET':
      return handleGet(req, res);
    case 'POST':
      return handlePost(req, res);
    case 'PUT':
      return handlePut(req, res);
    case 'DELETE':
      return handleDelete(req, res);
    default:
      return res.status(405).json({ error: 'Method not allowed' });
  }
}

// Get all dates or single date
async function handleGet(req, res) {
  try {
    const { id } = req.query;

    if (id) {
      const { data, error } = await supabaseAdmin
        .from('availability_dates')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return res.status(200).json(data);
    }

    const { data, error } = await supabaseAdmin
      .from('availability_dates')
      .select('*')
      .order('date', { ascending: true });

    if (error) throw error;
    return res.status(200).json(data);
  } catch (err) {
    console.error('Error fetching availability dates:', err);
    return res.status(500).json({ error: err.message });
  }
}

// Create new availability date
async function handlePost(req, res) {
  try {
    const {
      date,
      cohort_number,
      status,
      spots_total,
      spots_left,
    } = req.body;

    // Validate required fields
    if (!date || !cohort_number || !status) {
      return res.status(400).json({ error: 'Missing required fields: date, cohort_number, status' });
    }

    // Validate status
    const validStatuses = ['available', 'limited', 'waitlist', 'sold_out'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` });
    }

    // Check if date already exists
    const { data: existing } = await supabaseAdmin
      .from('availability_dates')
      .select('id')
      .eq('date', date)
      .single();

    if (existing) {
      return res.status(400).json({ error: 'An availability date already exists for this date' });
    }

    const { data, error } = await supabaseAdmin
      .from('availability_dates')
      .insert({
        date,
        cohort_number: parseInt(cohort_number),
        status,
        spots_total: parseInt(spots_total) || 4,
        spots_left: parseInt(spots_left) || 4,
      })
      .select()
      .single();

    if (error) throw error;
    return res.status(201).json(data);
  } catch (err) {
    console.error('Error creating availability date:', err);
    return res.status(500).json({ error: err.message });
  }
}

// Update existing availability date
async function handlePut(req, res) {
  try {
    const {
      id,
      date,
      cohort_number,
      status,
      spots_total,
      spots_left,
    } = req.body;

    if (!id) {
      return res.status(400).json({ error: 'Missing date id' });
    }

    // Validate status if provided
    const validStatuses = ['available', 'limited', 'waitlist', 'sold_out'];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({ error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` });
    }

    // Check for duplicate date (excluding current record)
    if (date) {
      const { data: existing } = await supabaseAdmin
        .from('availability_dates')
        .select('id')
        .eq('date', date)
        .neq('id', id)
        .single();

      if (existing) {
        return res.status(400).json({ error: 'An availability date already exists for this date' });
      }
    }

    const { data, error } = await supabaseAdmin
      .from('availability_dates')
      .update({
        date,
        cohort_number: parseInt(cohort_number),
        status,
        spots_total: parseInt(spots_total),
        spots_left: parseInt(spots_left),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return res.status(200).json(data);
  } catch (err) {
    console.error('Error updating availability date:', err);
    return res.status(500).json({ error: err.message });
  }
}

// Delete availability date
async function handleDelete(req, res) {
  try {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({ error: 'Missing date id' });
    }

    const { error } = await supabaseAdmin
      .from('availability_dates')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('Error deleting availability date:', err);
    return res.status(500).json({ error: err.message });
  }
}
