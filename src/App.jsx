import { useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'slope-chase-save-v1';
const HIGH_SCORE_KEY = 'slope-chase-best-v1';
const MAX_TIME = 20;

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
  const targetX = randomInt(-4, 4);
  const targetY = slope * targetX + intercept;
  const villainName = ['Mr. Gold', 'The Slope', 'The Grader', 'Professor Rise', 'Dr. Negative'][randomInt(0, 4)];

  return {
    villainName,
    slope,
    intercept,
    targetX,
    targetY,
    clue: `He is hiding on the line ${lineText(slope, intercept)} and on the graph at x = ${targetX}.`,
    level,
  };
}

function App() {
  const [playerSlope, setPlayerSlope] = useState(2);
  const [playerIntercept, setPlayerIntercept] = useState(1);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(() => Number(localStorage.getItem(HIGH_SCORE_KEY) || 0));
  const [round, setRound] = useState(() => createRound(1));
  const [timeLeft, setTimeLeft] = useState(MAX_TIME);
  const [status, setStatus] = useState('Ready to capture the villain!');
  const [isGameOver, setIsGameOver] = useState(false);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setTimeLeft((current) => {
        if (current <= 0) {
          setIsGameOver(true);
          setStatus('The villain escaped!');
          window.clearInterval(timer);
          return 0;
        }
        return current - 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [round, isGameOver]);

  useEffect(() => {
    localStorage.setItem(HIGH_SCORE_KEY, String(bestScore));
    const saveData = {
      score,
      bestScore,
      streak,
      playerSlope,
      playerIntercept,
      round,
      timeLeft,
      status,
      isGameOver,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saveData));
  }, [bestScore, isGameOver, playerIntercept, playerSlope, round, score, status, streak, timeLeft]);

  const playerFormula = useMemo(() => lineText(playerSlope, playerIntercept), [playerIntercept, playerSlope]);

  const handleAttempt = () => {
    if (isGameOver) {
      return;
    }

    const tolerance = 0.6;
    const matchSlope = Math.abs(playerSlope - round.slope) <= tolerance;
    const matchIntercept = Math.abs(playerIntercept - round.intercept) <= tolerance;

    if (matchSlope && matchIntercept) {
      const pointsEarned = 100 + Math.max(0, timeLeft) + streak * 25;
      const newScore = score + pointsEarned;
      setScore(newScore);
      setBestScore((previous) => Math.max(previous, newScore));
      setStreak((current) => current + 1);
      setStatus(`Caught ${round.villainName}! +${pointsEarned} points.`);
      setTimeLeft(MAX_TIME);
      setRound(createRound(round.level + 1));
    } else {
      const penalty = Math.max(10, 25 - streak * 2);
      setScore((current) => Math.max(0, current - penalty));
      setStreak(0);
      setStatus(`Missed! The correct line was ${lineText(round.slope, round.intercept)}.`);
      setRound(createRound(round.level + 1));
      setTimeLeft((current) => Math.max(0, current - 3));
    }
  };

  const restartGame = () => {
    setScore(0);
    setStreak(0);
    setTimeLeft(MAX_TIME);
    setStatus('New chase started.');
    setRound(createRound(1));
    setIsGameOver(false);
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
    const x = centerX + round.targetX * xScale;
    const y = centerY - (round.targetY * yScale);

    return { width, height, centerX, centerY, xScale, yScale, x, y };
  }, [round]);

  const linePoints = useMemo(() => {
    const { width, height, centerX, centerY, xScale, yScale } = graphCoordinates;
    const x1 = -10;
    const x2 = 10;
    const y1 = playerSlope * x1 + playerIntercept;
    const y2 = playerSlope * x2 + playerIntercept;
    const x1Px = centerX + x1 * xScale;
    const y1Px = centerY - y1 * yScale;
    const x2Px = centerX + x2 * xScale;
    const y2Px = centerY - y2 * yScale;

    return `${x1Px},${y1Px} ${x2Px},${y2Px}`;
  }, [graphCoordinates, playerIntercept, playerSlope]);

  return (
    <div className="app-shell">
      <header className="hud">
        <div>
          <p className="eyebrow">Math Villain Capture</p>
          <h1>Slope Chase</h1>
        </div>
        <div className="stats">
          <div className="stat-card"><span>Score</span><strong>{score}</strong></div>
          <div className="stat-card"><span>Best</span><strong>{bestScore}</strong></div>
          <div className="stat-card"><span>Time</span><strong>{timeLeft}s</strong></div>
        </div>
      </header>

      <main className="game-layout">
        <section className="panel story-panel">
          <p className="badge">Mission Briefing</p>
          <h2>Catch {round.villainName}</h2>
          <p>
            Mr. Gold, the villain known as <strong>The Slope</strong>, is making students miserable.
            He keeps slipping away on a hidden line. Tune the dials until your equation matches the trail.
          </p>
          <div className="mission-box">
            <span className="label">Current clue</span>
            <p>{round.clue}</p>
          </div>
          <div className="formula-preview">
            <span>Your line</span>
            <strong>{playerFormula}</strong>
          </div>
          <div className="controls">
            <label>
              <span>Slope m</span>
              <input
                type="range"
                min="-5"
                max="5"
                value={playerSlope}
                onChange={(event) => setPlayerSlope(Number(event.target.value))}
              />
              <strong>{playerSlope}</strong>
            </label>

            <label>
              <span>Intercept b</span>
              <input
                type="range"
                min="-8"
                max="8"
                value={playerIntercept}
                onChange={(event) => setPlayerIntercept(Number(event.target.value))}
              />
              <strong>{playerIntercept}</strong>
            </label>
          </div>

          <div className="actions">
            <button className="primary" onClick={handleAttempt} disabled={isGameOver}>Capture the line</button>
            <button className="secondary" onClick={restartGame}>Restart</button>
          </div>

          <p className={`status ${isGameOver ? 'danger' : ''}`}>{status}</p>
        </section>

        <section className="panel graph-panel">
          <svg viewBox={`0 0 ${graphCoordinates.width} ${graphCoordinates.height}`} role="img" aria-label="Coordinate graph showing the villain and your line.">
            <g>
              <line x1="0" y1={graphCoordinates.centerY} x2={graphCoordinates.width} y2={graphCoordinates.centerY} />
              <line x1={graphCoordinates.centerX} y1="0" x2={graphCoordinates.centerX} y2={graphCoordinates.height} />
              {Array.from({ length: 11 }, (_, index) => {
                const value = index - 5;
                const xPos = graphCoordinates.centerX + value * graphCoordinates.xScale;
                const yPos = graphCoordinates.centerY + value * graphCoordinates.yScale;
                return (
                  <g key={value}>
                    <line x1={xPos} y1="0" x2={xPos} y2={graphCoordinates.height} stroke="rgba(255,255,255,0.08)" />
                    <line x1="0" y1={yPos} x2={graphCoordinates.width} y2={yPos} stroke="rgba(255,255,255,0.08)" />
                  </g>
                );
              })}
              <polyline points={linePoints} fill="none" stroke="#f9d423" strokeWidth="4" strokeLinecap="round" />
              <circle cx={graphCoordinates.x} cy={graphCoordinates.y} r="10" fill="#ff5f6d" />
            </g>
          </svg>
          <div className="legend">
            <span><i className="dot villain"></i>Villain</span>
            <span><i className="dot player"></i>Your equation</span>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
