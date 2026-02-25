/**
 * Salesforce Metadata Parser
 *
 * Parses a Salesforce CLI metadata zip (from `sf project retrieve start`)
 * into the same JSON shape as the API downloader output. This ensures
 * signal-extractor-sf.js has a single input format.
 */

import JSZip from 'jszip';

/**
 * Parse a Salesforce metadata zip buffer into normalized metadata.
 * @param {Buffer} zipBuffer - The uploaded zip file
 * @returns {Promise<object>} Normalized metadata matching API downloader shape
 */
export async function parseMetadataZip(zipBuffer) {
  const zip = await JSZip.loadAsync(zipBuffer);
  const files = {};

  // Collect all file paths and contents
  for (const [path, entry] of Object.entries(zip.files)) {
    if (!entry.dir) {
      files[path] = await entry.async('string');
    }
  }

  // Find the root directory (force-app/main/default/ or unpackaged/)
  const root = detectRoot(Object.keys(files));

  return {
    objects: parseObjects(files, root),
    stages: { opportunityStages: [], leadStatuses: [] }, // Not available in metadata zip
    users: [], // Not available in metadata zip
    flows: parseFlows(files, root),
    workflowRules: parseWorkflowRules(files, root),
    validationRules: parseValidationRules(files, root),
    apexTriggers: parseTriggers(files, root),
    apexClasses: parseClasses(files, root),
    profiles: parseProfiles(files, root),
    permissionSets: parsePermissionSets(files, root),
    roles: parseRoles(files, root),
    reports: listByFolder(files, root, 'reports'),
    dashboards: listByFolder(files, root, 'dashboards'),
    connectedApps: listByFolder(files, root, 'connectedApps'),
    namedCredentials: listByFolder(files, root, 'namedCredentials'),
    recordTypes: extractRecordTypes(files, root),
  };
}

function detectRoot(paths) {
  for (const p of paths) {
    if (p.includes('force-app/main/default/')) return p.split('force-app/main/default/')[0] + 'force-app/main/default/';
    if (p.includes('unpackaged/')) return p.split('unpackaged/')[0] + 'unpackaged/';
  }
  return '';
}

/**
 * Parse object metadata to match describe API shape.
 */
function parseObjects(files, root) {
  const objectNames = ['Lead', 'Contact', 'Account', 'Opportunity', 'Case', 'Campaign'];
  const result = {};

  for (const objName of objectNames) {
    const fields = [];
    const prefix = `${root}objects/${objName}/fields/`;

    for (const [path, content] of Object.entries(files)) {
      if (path.startsWith(prefix) && path.endsWith('.field-meta.xml')) {
        const field = parseFieldXML(content, path);
        if (field) fields.push(field);
      }
    }

    result[objName] = { fields };
  }

  return result;
}

function parseFieldXML(xml, path) {
  const name = path.split('/').pop().replace('.field-meta.xml', '');
  const isCustom = name.endsWith('__c');
  const label = extractXMLValue(xml, 'label') || name;
  const type = extractXMLValue(xml, 'type') || 'Text';

  return { name, label, type, custom: isCustom };
}

function parseFlows(files, root) {
  const flows = [];
  const prefix = `${root}flows/`;

  for (const [path, content] of Object.entries(files)) {
    if (path.startsWith(prefix) && path.endsWith('.flow-meta.xml')) {
      const label = extractXMLValue(content, 'label') || path.split('/').pop().replace('.flow-meta.xml', '');
      const processType = extractXMLValue(content, 'processType') || '';
      const status = extractXMLValue(content, 'status') || 'Active';
      flows.push({ Label: label, ProcessType: processType, Status: status });
    }
  }

  return flows;
}

function parseWorkflowRules(files, root) {
  const rules = [];
  const prefix = `${root}workflows/`;

  for (const [path, content] of Object.entries(files)) {
    if (path.startsWith(prefix) && path.endsWith('.workflow-meta.xml')) {
      const name = path.split('/').pop().replace('.workflow-meta.xml', '');
      // Extract individual rules from workflow XML
      const ruleMatches = content.match(/<rules>[\s\S]*?<\/rules>/g) || [];
      for (const ruleXml of ruleMatches) {
        const ruleName = extractXMLValue(ruleXml, 'fullName') || name;
        const active = extractXMLValue(ruleXml, 'active');
        if (active !== 'false') {
          rules.push({ Name: ruleName, TableEnumOrId: name, Active: true });
        }
      }
    }
  }

  return rules;
}

function parseValidationRules(files, root) {
  const rules = [];

  for (const [path, content] of Object.entries(files)) {
    if (path.includes('/validationRules/') && path.endsWith('.validationRule-meta.xml')) {
      const name = extractXMLValue(content, 'fullName') || path.split('/').pop().replace('.validationRule-meta.xml', '');
      const active = extractXMLValue(content, 'active');
      const objectName = path.split('/objects/')[1]?.split('/')[0] || 'Unknown';
      if (active !== 'false') {
        rules.push({
          ValidationName: name,
          Active: true,
          EntityDefinition: { QualifiedApiName: objectName },
        });
      }
    }
  }

  return rules;
}

function parseTriggers(files, root) {
  const triggers = [];
  const prefix = `${root}triggers/`;

  for (const [path] of Object.entries(files)) {
    if (path.startsWith(prefix) && path.endsWith('.trigger-meta.xml')) {
      const name = path.split('/').pop().replace('.trigger-meta.xml', '');
      triggers.push({ Name: name, Status: 'Active' });
    }
  }

  return triggers;
}

function parseClasses(files, root) {
  const classes = [];
  const prefix = `${root}classes/`;

  for (const [path, content] of Object.entries(files)) {
    if (path.startsWith(prefix) && path.endsWith('.cls')) {
      const name = path.split('/').pop().replace('.cls', '');
      const lines = content.split('\n').filter((l) => l.trim() && !l.trim().startsWith('//')).length;
      classes.push({ Name: name, LengthWithoutComments: lines, NamespacePrefix: null });
    }
  }

  return classes;
}

function parseProfiles(files, root) {
  const items = [];
  const prefix = `${root}profiles/`;

  for (const [path] of Object.entries(files)) {
    if (path.startsWith(prefix) && path.endsWith('.profile-meta.xml')) {
      const name = path.split('/').pop().replace('.profile-meta.xml', '');
      items.push({ Name: name });
    }
  }

  return items;
}

function parsePermissionSets(files, root) {
  const items = [];
  const prefix = `${root}permissionsets/`;

  for (const [path] of Object.entries(files)) {
    if (path.startsWith(prefix) && path.endsWith('.permissionset-meta.xml')) {
      const name = path.split('/').pop().replace('.permissionset-meta.xml', '');
      items.push({ Label: name, IsCustom: true });
    }
  }

  return items;
}

function parseRoles(files, root) {
  const items = [];
  const prefix = `${root}roles/`;

  for (const [path, content] of Object.entries(files)) {
    if (path.startsWith(prefix) && path.endsWith('.role-meta.xml')) {
      const name = path.split('/').pop().replace('.role-meta.xml', '');
      const parentRole = extractXMLValue(content, 'parentRole');
      items.push({ Id: name, DeveloperName: name, ParentRoleId: parentRole || null });
    }
  }

  return items;
}

function listByFolder(files, root, folder) {
  const items = [];
  const prefix = `${root}${folder}/`;

  for (const [path] of Object.entries(files)) {
    if (path.startsWith(prefix)) {
      const name = path.replace(prefix, '').split('/')[0];
      if (!items.some((i) => i.Name === name)) {
        items.push({ Name: name, Id: name });
      }
    }
  }

  return items;
}

function extractRecordTypes(files, root) {
  const counts = {};

  for (const [path] of Object.entries(files)) {
    if (path.includes('/recordTypes/') && path.endsWith('.recordType-meta.xml')) {
      const objectName = path.split('/objects/')[1]?.split('/')[0] || 'Unknown';
      counts[objectName] = (counts[objectName] || 0) + 1;
    }
  }

  return Object.entries(counts).map(([obj, cnt]) => ({ SobjectType: obj, cnt }));
}

/**
 * Simple XML value extractor (no full parser needed for metadata XML).
 */
function extractXMLValue(xml, tag) {
  const match = xml.match(new RegExp(`<${tag}>([^<]*)</${tag}>`));
  return match ? match[1] : null;
}
