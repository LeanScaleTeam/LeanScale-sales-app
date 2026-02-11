/**
 * API endpoint for SOW scenarios
 * GET    /api/sow/[id]/scenarios       - List scenarios for a SOW
 * POST   /api/sow/[id]/scenarios       - Create a new scenario
 * PUT    /api/sow/[id]/scenarios       - Update a scenario
 * DELETE /api/sow/[id]/scenarios       - Delete a scenario
 */

import {
  listScenarios,
  createScenario,
  updateScenario,
  deleteScenario,
  duplicateScenario,
} from '../../../../lib/sow-scenarios';
import { getSowById } from '../../../../lib/sow';

export default async function handler(req, res) {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ success: false, error: 'Missing SOW id' });
  }

  const sow = await getSowById(id);
  if (!sow) {
    return res.status(404).json({ success: false, error: 'SOW not found' });
  }

  switch (req.method) {
    case 'GET':
      return handleGet(id, res);
    case 'POST':
      return handlePost(id, req, res);
    case 'PUT':
      return handlePut(id, req, res);
    case 'DELETE':
      return handleDelete(id, req, res);
    default:
      return res.status(405).json({ success: false, error: 'Method not allowed' });
  }
}

async function handleGet(sowId, res) {
  try {
    const scenarios = await listScenarios(sowId);
    return res.status(200).json({ success: true, data: scenarios });
  } catch (error) {
    console.error('Error listing scenarios:', error);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
}

async function handlePost(sowId, req, res) {
  try {
    const { name, description, sectionIds, isDefault, duplicateFrom } = req.body;

    // Duplicate mode
    if (duplicateFrom) {
      const scenario = await duplicateScenario(sowId, duplicateFrom, name);
      if (!scenario) {
        return res.status(400).json({ success: false, error: 'Source scenario not found' });
      }
      return res.status(201).json({ success: true, data: scenario });
    }

    if (!name) {
      return res.status(400).json({ success: false, error: 'name is required' });
    }

    const scenario = await createScenario(sowId, { name, description, sectionIds, isDefault });
    if (!scenario) {
      return res.status(500).json({ success: false, error: 'Failed to create scenario' });
    }

    return res.status(201).json({ success: true, data: scenario });
  } catch (error) {
    console.error('Error creating scenario:', error);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
}

async function handlePut(sowId, req, res) {
  try {
    const { scenarioId, name, description, sectionIds, isDefault } = req.body;

    if (!scenarioId) {
      return res.status(400).json({ success: false, error: 'scenarioId is required' });
    }

    const updates = {};
    if (name !== undefined) updates.name = name;
    if (description !== undefined) updates.description = description;
    if (sectionIds !== undefined) updates.sectionIds = sectionIds;
    if (isDefault !== undefined) updates.isDefault = isDefault;

    const scenario = await updateScenario(sowId, scenarioId, updates);
    if (!scenario) {
      return res.status(404).json({ success: false, error: 'Scenario not found' });
    }

    return res.status(200).json({ success: true, data: scenario });
  } catch (error) {
    console.error('Error updating scenario:', error);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
}

async function handleDelete(sowId, req, res) {
  try {
    const { scenarioId } = req.body;

    if (!scenarioId) {
      return res.status(400).json({ success: false, error: 'scenarioId is required' });
    }

    const success = await deleteScenario(sowId, scenarioId);
    if (!success) {
      return res.status(500).json({ success: false, error: 'Failed to delete scenario' });
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error deleting scenario:', error);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
}
