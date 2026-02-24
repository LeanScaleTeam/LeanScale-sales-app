/**
 * LayerView — Default v2 diagnostic view with 3 collapsible layers.
 *
 * Each layer (Foundation, Motions, Maturity) expands to show its items
 * via ItemDetailPanel components.
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { staggerContainer, fadeUpItem } from '../../lib/animations';
import DiagnosticSummary from './DiagnosticSummary';
import LayerHeader from './LayerHeader';
import ItemDetailPanel from './ItemDetailPanel';

const LAYER_ORDER = ['foundation', 'motions', 'maturity'];

export default function LayerView({ diagnosticResult, editMode, onStatusChange }) {
  const { items, scores, companyProfile } = diagnosticResult;

  const [expandedLayers, setExpandedLayers] = useState(() => {
    // Auto-expand layers with warning items
    const open = {};
    for (const layer of LAYER_ORDER) {
      const layerItems = items.filter((it) => it.layer === layer);
      if (layerItems.some((it) => it.status === 'warning')) {
        open[layer] = true;
      }
    }
    return open;
  });

  const [expandedItem, setExpandedItem] = useState(null);

  function toggleLayer(layer) {
    setExpandedLayers((prev) => ({ ...prev, [layer]: !prev[layer] }));
  }

  function toggleItem(itemId) {
    setExpandedItem((prev) => (prev === itemId ? null : itemId));
  }

  // Group items by layer
  const layerGroups = LAYER_ORDER.map((layer) => ({
    layer,
    items: items.filter((it) => it.layer === layer),
    score: scores[layer] ?? 0,
  }));

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="show">
      {/* Executive summary */}
      <DiagnosticSummary
        scores={scores}
        itemCount={items.length}
        companyProfile={companyProfile}
      />

      {/* Layer accordions */}
      <div style={styles.layers}>
        {layerGroups.map(({ layer, items: layerItems, score }) => (
          <motion.div key={layer} variants={fadeUpItem}>
            <LayerHeader
              layer={layer}
              score={score}
              itemCount={layerItems.length}
              isExpanded={!!expandedLayers[layer]}
              onToggle={() => toggleLayer(layer)}
            />

            <AnimatePresence>
              {expandedLayers[layer] && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  style={{ overflow: 'hidden' }}
                >
                  <div style={styles.itemList}>
                    {layerItems.map((item) => (
                      <ItemDetailPanel
                        key={item.id}
                        item={item}
                        isExpanded={expandedItem === item.id}
                        onToggle={() => toggleItem(item.id)}
                        editMode={editMode}
                        onStatusChange={onStatusChange}
                      />
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

const styles = {
  layers: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
  itemList: {
    padding: '0.75rem 0 0.25rem',
  },
};
