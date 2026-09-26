import { useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'slope-chase-save-v1';
const HIGH_SCORE_KEY = 'slope-chase-best-v1';

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function lineText(m, b) {
  const slopeText = Number(m) === 1 ? '' : Number(m) === -1 ? '-' : `${m}`;
  const interceptText = Number(b) === 0 ? '' : ` ${b > 0 ? '+' : '-'} ${Math.abs(b)}`;
  return `y = ${slopeText}x${interceptText}`;
}

function createRound(level) {
  const slope = randomInt(-5, 5);
  const intercept = randomInt(-8, 8);
  const firstX = randomInt(-4, 1);
  const secondX = randomInt(firstX + 1, 4);

  return {
    villainName: 'Mr. Gold',
    slope,
    intercept,
    firstPoint: { x: firstX, y: slope * firstX + intercept },
    secondPoint: { x: secondX, y: slope * secondX + intercept },
    level,
  };
}

function App() {
  const [playerSlope, setPlayerSlope] = useState(2);
  const [playerIntercept, setPlayerIntercept] = useState(1);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(() => Number(localStorage.getItem(HIGH_SCORE_KEY) || 0));
  const [round, setRound] = useState(() => createRound(1));
  const [status, setStatus] = useState('Find the line through both points.');
  const [isGameOver, setIsGameOver] = useState(false);
  const [streak, setStreak] = useState(0);
  const [attemptState, setAttemptState] = useState('idle');

  useEffect(() => {
    localStorage.setItem(HIGH_SCORE_KEY, String(bestScore));
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ score, bestScore, streak, playerSlope, playerIntercept, round, status, isGameOver }));
  }, [bestScore, isGameOver, playerIntercept, playerSlope, round, score, status, streak]);

  const playerFormula = useMemo(() => lineText(playerSlope, playerIntercept), [playerIntercept, playerSlope]);

  const handleAttempt = () => {
    if (isGameOver || attemptState === 'checking') return;
    setAttemptState('checking');

    window.setTimeout(() => {
      const matches = playerSlope === round.slope && playerIntercept === round.intercept;

      if (matches) {
        const pointsEarned = 150 + streak * 40 + round.level * 10;
        const newScore = score + pointsEarned;
        setScore(newScore);
        setBestScore((previous) => Math.max(previous, newScore));
        setStreak((current) => current + 1);
        setStatus(`Great work! You found Mr. Gold's line. +${pointsEarned} points.`);
        setRound(createRound(round.level + 1));
        setAttemptState('success');
      } else {
        setScore((current) => Math.max(0, current - 40));
        setStreak(0);
        setStatus('Not quite. Use the rise between the two points and where the line crosses the y-axis.');
        setAttemptState('miss');
      }
    }, 450);
  };

  const restartGame = () => {
    setScore(0);
    setStreak(0);
    setStatus('New chase started. Find the line through both points.');
    setRound(createRound(1));
    setIsGameOver(false);
    setAttemptState('idle');
    setPlayerSlope(2);
    setPlayerIntercept(1);
    localStorage.removeItem(STORAGE_KEY);
  };

  const graphCoordinates = useMemo(() => {
    const width = 420;
    const height = 260;
    const xScale = 30;
    const yScale = 30;
    const centerX = width / 2;
    const centerY = height / 2;
    const toPixel = ({ x, y }) => ({ x: centerX + x * xScale, y: centerY - y * yScale });
    return { width, height, xScale, yScale, centerX, centerY, first: toPixel(round.firstPoint), second: toPixel(round.secondPoint) };
  }, [round]);

  const linePoints = useMemo(() => {
    const { centerX, centerY, xScale, yScale } = graphCoordinates;
    const x1 = -10;
    const x2 = 10;
    return `${centerX + x1 * xScale},${centerY - (playerSlope * x1 + playerIntercept) * yScale} ${centerX + x2 * xScale},${centerY - (playerSlope * x2 + playerIntercept) * yScale}`;
  }, [graphCoordinates, playerIntercept, playerSlope]);

  return (
    <div className="app-shell">
      <header className="hud">
        <div><p className="eyebrow">Math Villain Capture</p><h1>Slope Chase</h1></div>
        <div className="stats">
          <div className="stat-card"><span>Score</span><strong>{score}</strong></div>
          <div className="stat-card"><span>Best</span><strong>{bestScore}</strong></div>
          <div className="stat-card"><span>Streak</span><strong>{streak}</strong></div>
        </div>
      </header>

      <main className="game-layout">
        <section className="panel story-panel">
          <p className="badge">Mission {round.level}</p>
          <h2>Find Mr. Gold</h2>
          <p>Mr. Gold made a student very sad. He escaped along a hidden straight line. Use the two points to work out his equation, then tune both dials exactly.</p>
          <div className="mission-box"><span className="label">Case file</span><p>Mr. Gold's line passes through <strong>({round.firstPoint.x}, {round.firstPoint.y})</strong> and <strong>({round.secondPoint.x}, {round.secondPoint.y})</strong>.</p></div>
          <div className="formula-preview"><span>Your line</span><strong>{playerFormula}</strong></div>
          <div className="controls">
            <label><span>Slope (m)</span><input type="range" min="-5" max="5" step="1" value={playerSlope} onChange={(event) => setPlayerSlope(Number(event.target.value))} /><strong>{playerSlope}</strong></label>
            <label><span>Y-Intercept (y)</span><input type="range" min="-8" max="8" step="1" value={playerIntercept} onChange={(event) => setPlayerIntercept(Number(event.target.value))} /><strong>{playerIntercept}</strong></label>
          </div>
          <div className="actions"><button className={`primary ${attemptState}`} onClick={handleAttempt} disabled={isGameOver || attemptState === 'checking'}>{attemptState === 'checking' ? 'Checking...' : 'Capture the line'}</button><button className="secondary" onClick={restartGame}>Restart</button></div>
          <p className={`status ${attemptState}`}>{status}</p>
        </section>

        <section className="panel graph-panel">
          <svg viewBox={`0 0 ${graphCoordinates.width} ${graphCoordinates.height}`} role="img" aria-label="Coordinate graph showing two clues and your line.">
            <line x1="0" y1={graphCoordinates.centerY} x2={graphCoordinates.width} y2={graphCoordinates.centerY} />
            <line x1={graphCoordinates.centerX} y1="0" x2={graphCoordinates.centerX} y2={graphCoordinates.height} />
            {Array.from({ length: 11 }, (_, index) => {
              const value = index - 5;
              const xPos = graphCoordinates.centerX + value * graphCoordinates.xScale;
              const yPos = graphCoordinates.centerY + value * graphCoordinates.yScale;
              return <g key={value}><line x1={xPos} y1="0" x2={xPos} y2={graphCoordinates.height} stroke="rgba(255,255,255,0.08)" /><line x1="0" y1={yPos} x2={graphCoordinates.width} y2={yPos} stroke="rgba(255,255,255,0.08)" /></g>;
            })}
            <polyline className="player-line" points={linePoints} fill="none" stroke="#f9d423" strokeWidth="4" strokeLinecap="round" />
            <circle className="clue-point" cx={graphCoordinates.first.x} cy={graphCoordinates.first.y} r="9" fill="#ff5f6d" />
            <circle className="clue-point" cx={graphCoordinates.second.x} cy={graphCoordinates.second.y} r="9" fill="#ff5f6d" />
          </svg>
          <div className="legend"><span><i className="dot villain"></i>Clue points</span><span><i className="dot player"></i>Your equation</span></div>
        </section>
      </main>
    </div>
  );
}

export default App;
