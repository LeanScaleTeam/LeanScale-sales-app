import { useState, useEffect, useRef } from 'react';

const SLIDE_LABELS = [
  'Overview',
  'Function Summary',
  'Cross Functional',
  'Marketing',
  'Sales',
  'Customer Success',
  'Partnerships',
  'Priority Items',
  'Recommendations',
];

export default function PresentationControls({
  currentSlide,
  totalSlides,
  onPrev,
  onNext,
  onGoTo,
  onExit,
  slideLabels = SLIDE_LABELS,
}) {
  const [elapsed, setElapsed] = useState(0);
  const [showJump, setShowJump] = useState(false);
  const startRef = useRef(Date.now());
  const jumpRef = useRef(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startRef.current) / 1000));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Close jump dropdown on outside click
  useEffect(() => {
    if (!showJump) return;
    const handler = (e) => {
      if (jumpRef.current && !jumpRef.current.contains(e.target)) setShowJump(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [showJump]);

  const mins = Math.floor(elapsed / 60);
  const secs = elapsed % 60;
  const timeStr = `${mins}:${secs.toString().padStart(2, '0')}`;

  return (
    <div className="pres-controls">
      <button className="pres-ctrl-btn" onClick={onExit} title="Exit Presentation (Esc)">
        ✕
      </button>

      <button className="pres-ctrl-btn" onClick={onPrev} disabled={currentSlide === 0} title="Previous (←)">
        ‹
      </button>

      <div className="pres-ctrl-counter" ref={jumpRef} style={{ position: 'relative' }}>
        <button
          className="pres-ctrl-counter-btn"
          onClick={() => setShowJump(!showJump)}
          title="Jump to slide..."
        >
          {currentSlide + 1} / {totalSlides}
        </button>
        {showJump && (
          <div className="pres-jump-dropdown">
            {slideLabels.slice(0, totalSlides).map((label, i) => (
              <button
                key={i}
                className={`pres-jump-item ${i === currentSlide ? 'active' : ''}`}
                onClick={() => { onGoTo(i); setShowJump(false); }}
              >
                <span className="pres-jump-num">{i + 1}</span> {label}
              </button>
            ))}
          </div>
        )}
      </div>

      <button className="pres-ctrl-btn" onClick={onNext} disabled={currentSlide === totalSlides - 1} title="Next (→)">
        ›
      </button>

      <div className="pres-ctrl-timer" title="Presentation timer">
        ⏱ {timeStr}
      </div>
    </div>
  );
}
