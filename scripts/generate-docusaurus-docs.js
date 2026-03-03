#!/usr/bin/env node
/**
 * Generate Docusaurus-compatible docs from playbooks-content/
 *
 * This script is intended for the Playbooks-Site repo.
 * It reads the shared content package and generates the docs/ directory
 * with Docusaurus frontmatter and Loom video embeds.
 *
 * Usage: Copy this script to the Playbooks-Site repo and run as prebuild.
 */

const fs = require('fs');
const path = require('path');

// Adjust these paths when using in Playbooks-Site
const CONTENT_DIR = path.join(__dirname, '..', 'playbooks-content');
const REGISTRY_PATH = path.join(CONTENT_DIR, 'registry.json');
const PLAYBOOKS_DIR = path.join(CONTENT_DIR, 'playbooks');
const DOCS_OUT = path.join(__dirname, '..', 'docs');

function generateDocs() {
  if (!fs.existsSync(REGISTRY_PATH)) {
    console.error('registry.json not found. Ensure playbooks-content/ submodule is initialized.');
    process.exit(1);
  }

  const registry = JSON.parse(fs.readFileSync(REGISTRY_PATH, 'utf8'));
  let generated = 0;
  let skipped = 0;

  for (const playbook of registry.playbooks) {
    if (playbook.status === 'stub') {
      skipped++;
      continue;
    }

    const tier = playbook.tier; // 'core' or 'extended'
    const slug = playbook.slug;
    const outDir = path.join(DOCS_OUT, tier, slug);

    fs.mkdirSync(outDir, { recursive: true });

    // Generate _category_.json
    const category = {
      label: playbook.title,
      position: parseInt(playbook.numericId),
      link: { type: 'doc', id: 'advisory' },
    };
    fs.writeFileSync(
      path.join(outDir, '_category_.json'),
      JSON.stringify(category, null, 2)
    );

    // Generate each page with Docusaurus frontmatter + Loom embed
    const pages = [
      { name: 'advisory', position: 1, label: '1. Advisory' },
      { name: 'methodology', position: 2, label: '2. Methodology' },
      { name: 'implementation', position: 3, label: '3. Implementation' },
    ];

    for (const page of pages) {
      const srcPath = path.join(PLAYBOOKS_DIR, slug, `${page.name}.md`);
      if (!fs.existsSync(srcPath)) continue;

      const rawMd = fs.readFileSync(srcPath, 'utf8');

      // Inject Docusaurus frontmatter + Loom embed
      const loomId = playbook.loomEmbedId;
      const loomBlock = loomId
        ? `\n<div style={{position: "relative", paddingBottom: "56.25%", height: 0}}><iframe src="https://www.loom.com/embed/${loomId}" frameBorder="0" webkitallowfullscreen="true" mozallowfullscreen="true" allowFullScreen style={{position: "absolute", top: 0, left: 0, width: "100%", height: "100%"}}></iframe></div>\n`
        : '';

      const output = `---
title: "${page.label}"
sidebar_position: ${page.position}
---
${loomBlock}
${rawMd}`;

      fs.writeFileSync(path.join(outDir, `${page.name}.md`), output);
    }

    generated++;
  }

  console.log(`Generated Docusaurus docs:`);
  console.log(`  Published: ${generated}`);
  console.log(`  Skipped stubs: ${skipped}`);
  console.log(`  Output: ${DOCS_OUT}/`);
}

generateDocs();
