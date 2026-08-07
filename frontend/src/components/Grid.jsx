import React, { useRef, useCallback } from 'react';

const STATE_LABELS = { queued: 'Rrymë e ardhshme', visiting: 'Duke notuar', visited: 'Gjurmë' };

export default function Grid({ grid, cellStates, pathCells, animating, waterLevel, shuffling }) {
  const size = grid.length;
  const stageRef = useRef(null);
  const moveLight = useCallback((event) => {
    const stage = stageRef.current;
    if (!stage) return;
    const box = stage.getBoundingClientRect();
    stage.style.setProperty('--beam-x', `${event.clientX - box.left}px`);
    stage.style.setProperty('--beam-y', `${event.clientY - box.top}px`);
  }, []);

  return (
    <section className="ocean-stage" ref={stageRef} onMouseMove={moveLight} aria-label="Fusha e notit">
      <div className="stage-header">
        <div><span className="hud-eyebrow">SEKTORI 05</span><h2>Kalimi i ujërave</h2></div>
        <div className="coordinates"><span>GRID</span>{size} × {size}</div>
      </div>
      <div className="water-chamber">
        <div className="caustics" aria-hidden="true" />
        <div className="waterline" style={{ height: `${waterLevel}%` }} aria-hidden="true"><i /></div>
        <div className={`grid-container${shuffling ? ' grid-container--shuffling' : ''}`} style={{ gridTemplateColumns: `repeat(${size}, 1fr)` }} role="grid">
          {grid.map((row, r) => row.map((val, c) => {
            const state = cellStates[`${r}-${c}`];
            const isPath = pathCells[`${r}-${c}`];
            const isStart = r === 0 && c === 0;
            const isEnd = r === size - 1 && c === size - 1;
            const stateClass = state ? ` cell-${state}` : '';
            return <div key={`${r}-${c}`} className={`cell${stateClass}${isPath ? ' cell-path' : ''}${isStart ? ' cell-start' : ''}${isEnd ? ' cell-end' : ''}`} role="gridcell" tabIndex="0" aria-label={`Sektori ${r + 1}, ${c + 1}, thellësia ${val}${isPath ? ', rruga e zgjedhur' : ''}`}>
              <span className="cell-index">{String(r * size + c + 1).padStart(2, '0')}</span>
              <strong>{val}</strong>
              {(isStart || isEnd || isPath) && <span className="cell-marker">{isStart ? 'NISJA' : isEnd ? 'DALJA' : 'RRUGA'}</span>}
              <span className="cell-tooltip">Thellësia <b>{val}</b> · {STATE_LABELS[state] || 'E qetë'}</span>
            </div>;
          }))}
        </div>
      </div>
      <div className="stage-footer">
        <span><i className="pulse-ring" /> {animating ? 'Uji po rritet' : Object.keys(pathCells).length ? 'Rruga e zgjedhur është e ndriçuar' : 'Lëvizni për të ndriçuar sipërfaqen'}</span>
        <span className="command-hint"><kbd>Ctrl</kbd><b>+</b><kbd>Enter</kbd> për të nisur simulimin</span>
      </div>
    </section>
  );
}
