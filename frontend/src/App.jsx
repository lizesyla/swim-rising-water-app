import React, { useState, useRef, useCallback, useEffect } from 'react';
import Grid from './components/Grid';
import Controls from './components/Controls';
import { ToastContainer } from './components/Toast';
import { IconWave } from './components/Icons';
import { solveSwimProblem } from './utils/api';

const INITIAL_GRID = [[0, 1, 2, 3, 4], [24, 23, 22, 21, 5], [12, 13, 14, 15, 16], [11, 17, 18, 19, 20], [10, 9, 8, 7, 6]];

export default function App() {
  const [grid, setGrid] = useState(INITIAL_GRID);
  const [cellStates, setCellStates] = useState({});
  const [pathCells, setPathCells] = useState({});
  const [maxTime, setMaxTime] = useState(null);
  const [loading, setLoading] = useState(false);
  const [animating, setAnimating] = useState(false);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(null);
  const [shuffling, setShuffling] = useState(false);
  const [toasts, setToasts] = useState([]);
  const timersRef = useRef([]);

  const addToast = useCallback((message, type = 'info') => setToasts((current) => [...current, { id: `${Date.now()}-${Math.random()}`, message, type }].slice(-3)), []);
  const dismissToast = useCallback((id) => setToasts((current) => current.filter((toast) => toast.id !== id)), []);
  const clearTimers = useCallback(() => { timersRef.current.forEach(clearTimeout); timersRef.current = []; }, []);

  const resetVisualization = useCallback(() => {
    clearTimers(); setCellStates({}); setPathCells({}); setMaxTime(null); setAnimating(false); setError(null); setProgress(null);
  }, [clearTimers]);

  const animateVisualization = useCallback((steps, path) => {
    clearTimers(); setCellStates({}); setPathCells({}); setAnimating(true); setProgress(0);
    steps.forEach((step, index) => {
      const id = setTimeout(() => {
        setCellStates((previous) => ({ ...previous, [`${step.row}-${step.col}`]: step.status }));
        setProgress((index + 1) / steps.length);
        if (index === steps.length - 1) {
          setAnimating(false); setProgress(null);
          setPathCells(Object.fromEntries(path.map(({ row, col }) => [`${row}-${col}`, true])));
          addToast('Rruga optimale u ndriçua.', 'success');
        }
      }, index * 120);
      timersRef.current.push(id);
    });
  }, [addToast, clearTimers]);

  const handleSolve = useCallback(async () => {
    setLoading(true); setError(null); setMaxTime(null); setProgress(null); clearTimers(); setCellStates({}); setPathCells({});
    const result = await solveSwimProblem(grid);
    if (!result) { setError('Nuk u lidh dot me serverin. Sigurohuni që backend-i po punon (port 8000).'); addToast('Nuk u lidh dot me serverin.', 'error'); setLoading(false); return; }
    if (result.max_time === -1) { setError('Algoritmi nuk gjeti një rrugë të vlefshme.'); addToast('Nuk u gjet një rrugë e vlefshme.', 'error'); setLoading(false); return; }
    setMaxTime(result.max_time); animateVisualization(result.steps, result.path || []); setLoading(false);
  }, [addToast, animateVisualization, clearTimers, grid]);

  const generateRandomGrid = () => {
    resetVisualization(); setShuffling(true);
    const nums = Array.from({ length: 25 }, (_, i) => i).sort(() => Math.random() - 0.5);
    const newGrid = []; while (nums.length) newGrid.push(nums.splice(0, 5)); setGrid(newGrid);
    addToast('U krijua një hartë e re 5×5.', 'info'); const id = setTimeout(() => setShuffling(false), 520); timersRef.current.push(id);
  };

  const updateCellValue = useCallback((row, col, value) => {
    setGrid((current) => current.map((gridRow, r) => r === row ? gridRow.map((cell, c) => c === col ? value : cell) : gridRow));
  }, []);

  useEffect(() => () => clearTimers(), [clearTimers]);
  useEffect(() => {
    const onKeyDown = (event) => { if ((event.metaKey || event.ctrlKey) && event.key === 'Enter' && !loading && !animating) { event.preventDefault(); handleSolve(); } };
    window.addEventListener('keydown', onKeyDown); return () => window.removeEventListener('keydown', onKeyDown);
  }, [animating, handleSolve, loading]);

  const waterLevel = progress === null ? (maxTime === null ? 0 : 100) : Math.max(8, progress * 100);
  return <div className="app-container">
    <header className="app-header"><a className="wordmark" href="#swim-field" aria-label="Swim in Rising Water"><span className="wordmark-mark"><IconWave size={18} /></span><span>SWIM <i>IN</i> RISING WATER</span></a><div className="header-telemetry"><span>ALG-778</span><i /><span>MIN-HEAP</span></div></header>
    <main className="app-main"><div className="main-content" id="swim-field">
      <Controls loading={loading} animating={animating} maxTime={maxTime} error={error} progress={progress} onGenerate={generateRandomGrid} onSolve={handleSolve} onReset={resetVisualization} />
      <Grid grid={grid} cellStates={cellStates} pathCells={pathCells} animating={animating} waterLevel={waterLevel} shuffling={shuffling} onCellChange={updateCellValue} editingDisabled={loading || animating} />
    </div></main>
    <footer className="app-footer"><span>DIJKSTRA / MIN-HEAP</span><span>REACT + FASTAPI</span></footer><ToastContainer toasts={toasts} onDismiss={dismissToast} />
  </div>;
}
