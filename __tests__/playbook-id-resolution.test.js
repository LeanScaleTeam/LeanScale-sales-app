/**
 * Playbook ID Resolution Tests
 *
 * Verifies all Sales App service IDs resolve to playbook content
 * (either directly or through aliases).
 */

const fs = require('fs');
const path = require('path');

const CONTENT_DIR = path.join(__dirname, '..', 'playbooks-content');
const REGISTRY_PATH = path.join(CONTENT_DIR, 'registry.json');
const ALIASES_PATH = path.join(CONTENT_DIR, 'id-aliases.json');
const PLAYBOOKS_DIR = path.join(CONTENT_DIR, 'playbooks');

// Import services catalog (CommonJS-compatible extraction)
const catalogPath = path.join(__dirname, '..', 'data', 'services-catalog.js');
const catalogSource = fs.readFileSync(catalogPath, 'utf8');

// Extract all IDs from strategicProjects
function extractServiceIds(source) {
  const ids = [];
  const idPattern = /id:\s*'([^']+)'/g;
  let match;
  while ((match = idPattern.exec(source)) !== null) {
    // Skip managed service IDs (ending in -impl)
    if (!match[1].endsWith('-impl')) {
      ids.push(match[1]);
    }
  }
  return [...new Set(ids)];
}

const serviceIds = extractServiceIds(catalogSource);

// Load registry and aliases
const registry = JSON.parse(fs.readFileSync(REGISTRY_PATH, 'utf8'));
const aliases = JSON.parse(fs.readFileSync(ALIASES_PATH, 'utf8'));

const registrySlugs = new Set(registry.playbooks.map(p => p.slug));

function resolveSlug(id) {
  if (registrySlugs.has(id)) return id;
  if (aliases.aliases[id] && registrySlugs.has(aliases.aliases[id])) {
    return aliases.aliases[id];
  }
  return null;
}

describe('Playbook ID Resolution', () => {
  test('registry.json contains 68 entries', () => {
    expect(registry.playbooks.length).toBe(68);
  });

  test('51 published + 17 stubs = 68', () => {
    const published = registry.playbooks.filter(p => p.status === 'published');
    const stubs = registry.playbooks.filter(p => p.status === 'stub');
    expect(published.length).toBe(51);
    expect(stubs.length).toBe(17);
  });

  test('id-aliases.json has 6 aliases', () => {
    expect(Object.keys(aliases.aliases).length).toBe(6);
  });

  test('all alias targets exist in registry', () => {
    for (const [oldId, newSlug] of Object.entries(aliases.aliases)) {
      expect(registrySlugs.has(newSlug)).toBe(true);
    }
  });

  test('every strategic project ID resolves to a playbook slug', () => {
    const unresolved = [];
    for (const id of serviceIds) {
      const slug = resolveSlug(id);
      if (!slug) unresolved.push(id);
    }
    expect(unresolved).toEqual([]);
  });

  test('every published playbook has 3 markdown files', () => {
    const published = registry.playbooks.filter(p => p.status === 'published');
    for (const p of published) {
      const dir = path.join(PLAYBOOKS_DIR, p.slug);
      expect(fs.existsSync(path.join(dir, 'advisory.md'))).toBe(true);
      expect(fs.existsSync(path.join(dir, 'methodology.md'))).toBe(true);
      expect(fs.existsSync(path.join(dir, 'implementation.md'))).toBe(true);
    }
  });

  test('every playbook has a meta.json', () => {
    for (const p of registry.playbooks) {
      const metaPath = path.join(PLAYBOOKS_DIR, p.slug, 'meta.json');
      expect(fs.existsSync(metaPath)).toBe(true);
      const meta = JSON.parse(fs.readFileSync(metaPath, 'utf8'));
      expect(meta.slug).toBe(p.slug);
      expect(meta.status).toBe(p.status);
    }
  });

  test('no Docusaurus frontmatter in published markdown', () => {
    const published = registry.playbooks.filter(p => p.status === 'published');
    for (const p of published) {
      const pages = ['advisory', 'methodology', 'implementation'];
      for (const page of pages) {
        const content = fs.readFileSync(
          path.join(PLAYBOOKS_DIR, p.slug, `${page}.md`),
          'utf8'
        );
        expect(content.startsWith('---\n')).toBe(false);
      }
    }
  });

  test('no JSX Loom embeds in published markdown', () => {
    const published = registry.playbooks.filter(p => p.status === 'published');
    for (const p of published) {
      const pages = ['advisory', 'methodology', 'implementation'];
      for (const page of pages) {
        const content = fs.readFileSync(
          path.join(PLAYBOOKS_DIR, p.slug, `${page}.md`),
          'utf8'
        );
        expect(content).not.toContain('<div style={{');
        expect(content).not.toContain('loom.com/embed');
      }
    }
  });

  test('10 core + 58 extended = 68', () => {
    const core = registry.playbooks.filter(p => p.tier === 'core');
    const extended = registry.playbooks.filter(p => p.tier === 'extended');
    expect(core.length).toBe(10);
    expect(extended.length).toBe(58);
  });
});
