import React, { useState } from 'react';
import { IconGrid, IconPlay, IconReset, IconWave } from './Icons';
import CountUp from './CountUp';

const LEGEND_ITEMS = [
  ['legend-swatch--queued', 'Rryma e ardhshme'],
  ['legend-swatch--visiting', 'Në lëvizje'],
  ['legend-swatch--visited', 'Rrugë e përshkuar'],
];

export default function Controls({ loading, animating, maxTime, error, progress, onGenerate, onSolve, onReset }) {
  const [showLegend, setShowLegend] = useState(false);
  const isActive = loading || animating;
  const status = loading ? 'Duke lexuar rrymën' : animating ? 'Not në progres' : maxTime !== null ? 'Rrugë e gjetur' : 'Gati për zhytje';

  return (
    <aside className="expedition-panel" aria-label="Gjendja e ekspeditës">
      <div className="depth-readout">
        <span className="hud-eyebrow">THELLËSIA KRITIKE</span>
        <strong>{maxTime === null ? '—' : <CountUp value={maxTime} />}</strong>
        <span className="depth-unit">njësi</span>
      </div>

      <div className={`signal-line${isActive ? ' is-active' : ''}`}>
        <span className="signal-dot" />
        <span>{status}</span>
      </div>

      {isActive && progress !== null && (
        <div className="current-meter" aria-label="Progresi i notit">
          <span>RRYMË</span>
          <div className="current-track"><i style={{ width: `${Math.max(5, progress * 100)}%` }} /></div>
          <b>{Math.round(progress * 100)}%</b>
        </div>
      )}

      {error && <p className="expedition-error" role="alert">{error}</p>}

      <div className="expedition-actions">
        <button className="launch-button" onClick={onSolve} disabled={isActive} aria-label="Nis simulimin">
          {loading ? <span className="btn-spinner" /> : <IconPlay size={14} />}
          <span>{loading ? 'Duke llogaritur' : 'Nis simulimin'}</span>
        </button>
        <button className="sonar-button" onClick={onGenerate} disabled={isActive} aria-label="Gjenero një hartë të re uji">
          <IconGrid size={16} />
          <span>Hartë e re</span>
        </button>
        {(animating || maxTime !== null) && (
          <button className="icon-button" onClick={onReset} disabled={loading} aria-label="Pastro gjurmën">
            <IconReset size={16} />
          </button>
        )}
      </div>

      <div className="legend-dock">
        <button onClick={() => setShowLegend(!showLegend)} aria-expanded={showLegend}>
          <IconWave size={14} /> Lexo rrymat
        </button>
        {showLegend && <div className="legend-stream">
          {LEGEND_ITEMS.map(([className, label]) => <span key={label}><i className={`legend-swatch ${className}`} />{label}</span>)}
        </div>}
      </div>
    </aside>
  );
}
