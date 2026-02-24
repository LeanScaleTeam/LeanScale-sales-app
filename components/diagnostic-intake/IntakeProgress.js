/**
 * IntakeProgress — Visual progress bar showing sections completed
 */

export default function IntakeProgress({ sections, sectionTitles, currentSection, sectionsCompleted }) {
  return (
    <div style={styles.container}>
      {sections.map((section, i) => {
        const isComplete = sectionsCompleted.includes(section);
        const isCurrent = section === currentSection;
        const isPast = sections.indexOf(currentSection) > i;

        return (
          <div key={section} style={styles.step}>
            <div
              style={{
                ...styles.dot,
                background: isComplete || isPast ? 'var(--ls-purple)' : isCurrent ? 'var(--ls-purple-light)' : 'var(--gray-300)',
              }}
            >
              {isComplete ? (
                <span style={{ color: 'white', fontSize: '10px' }}>&#10003;</span>
              ) : (
                <span style={{ color: 'white', fontSize: '10px' }}>{i + 1}</span>
              )}
            </div>
            <div
              style={{
                ...styles.label,
                color: isCurrent ? 'var(--text-primary)' : 'var(--text-muted)',
                fontWeight: isCurrent ? 'var(--font-semibold)' : 'var(--font-normal)',
              }}
            >
              {sectionTitles[section]}
            </div>
            {i < sections.length - 1 && (
              <div
                style={{
                  ...styles.line,
                  background: isComplete || isPast ? 'var(--ls-purple)' : 'var(--gray-200)',
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0',
    marginBottom: '2rem',
    flexWrap: 'wrap',
  },
  step: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.375rem',
  },
  dot: {
    width: '1.5rem',
    height: '1.5rem',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  label: {
    fontSize: 'var(--text-xs)',
    whiteSpace: 'nowrap',
  },
  line: {
    width: '2rem',
    height: '2px',
    margin: '0 0.375rem',
    flexShrink: 0,
  },
};
