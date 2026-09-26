@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700;800&display=swap');

:root {
  color-scheme: dark;
  font-family: 'Inter', sans-serif;
  background: #0c1225;
  color: #edf2ff;
  line-height: 1.5;
  font-weight: 400;
  --panel: rgba(18, 25, 42, 0.92);
  --panel-border: rgba(159, 181, 255, 0.2);
  --primary: #7cf0d7;
  --secondary: #f9d423;
  --danger: #ff5f6d;
  --accent: #7fd3ff;
}

* {
  box-sizing: border-box;
}

html, body, #root {
  margin: 0;
  min-height: 100%;
  height: 100%;
  background:
    radial-gradient(circle at top, rgba(124, 240, 215, 0.16), transparent 30%),
    linear-gradient(135deg, #0b1020 0%, #101a32 35%, #111827 100%);
}

body {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

button, input {
  font: inherit;
}

.app-shell {
  width: min(1200px, calc(100vw - 32px));
  padding: 28px 18px 18px;
}

.hud {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  margin-bottom: 20px;
}

.eyebrow {
  margin: 0 0 8px;
  color: var(--accent);
  text-transform: uppercase;
  letter-spacing: 0.12em;
  font-size: 0.76rem;
  font-weight: 700;
}

h1 {
  margin: 0;
  font-size: clamp(2.1rem, 3vw, 3.2rem);
}

.stats {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.stat-card {
  min-width: 110px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid var(--panel-border);
  border-radius: 12px;
  padding: 10px 14px;
  text-align: center;
}

.stat-card span {
  display: block;
  font-size: 0.72rem;
  color: rgba(237, 242, 255, 0.74);
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.stat-card strong {
  display: block;
  margin-top: 4px;
  font-size: 1.5rem;
}

.game-layout {
  display: grid;
  grid-template-columns: 1.05fr 1.35fr;
  gap: 18px;
}

.panel {
  background: var(--panel);
  border: 1px solid var(--panel-border);
  border-radius: 22px;
  padding: 24px;
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.24);
}

.story-panel {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.badge {
  margin: 0;
  display: inline-block;
  width: fit-content;
  padding: 6px 10px;
  border-radius: 999px;
  background: rgba(127, 211, 255, 0.1);
  color: var(--accent);
  font-size: 0.72rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  font-weight: 700;
}

.story-panel h2 {
  margin: 0;
  font-size: 2rem;
}

.story-panel p {
  margin: 0;
  color: rgba(237, 242, 255, 0.9);
}

.mission-box {
  background: rgba(255, 255, 255, 0.04);
  border-radius: 16px;
  border: 1px solid rgba(255,255,255,0.09);
  padding: 16px;
}

.label {
  display: block;
  margin-bottom: 8px;
  color: var(--secondary);
  font-size: 0.72rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  font-weight: 700;
}

.formula-preview {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  align-items: center;
  padding: 16px 18px;
  border-radius: 14px;
  background: rgba(124, 240, 215, 0.08);
  border: 1px solid rgba(124, 240, 215, 0.2);
}

.formula-preview span {
  color: rgba(237, 242, 255, 0.72);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-size: 0.7rem;
}

.formula-preview strong {
  font-size: clamp(1.2rem, 3vw, 1.8rem);
  color: var(--primary);
}

.controls {
  display: grid;
  gap: 18px;
}

.controls label {
  display: grid;
  gap: 8px;
  font-weight: 600;
}

.controls label span {
  color: rgba(237, 242, 255, 0.78);
}

input[type='range'] {
  width: 100%;
  accent-color: var(--secondary);
}

.actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

button {
  border: none;
  border-radius: 12px;
  padding: 12px 18px;
  cursor: pointer;
  transition: transform 0.15s ease, opacity 0.15s ease;
}

button:hover {
  transform: translateY(-1px);
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

button.primary {
  background: linear-gradient(135deg, var(--secondary), #f0a500);
  color: #121212;
  font-weight: 800;
}

button.secondary {
  background: rgba(255,255,255,0.07);
  color: #edf2ff;
  border: 1px solid rgba(255,255,255,0.08);
}

.status {
  margin: 0;
  min-height: 28px;
  font-weight: 700;
  color: var(--primary);
}

.status.danger {
  color: var(--danger);
}

.graph-panel {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

svg {
  width: 100%;
  height: 420px;
  background: linear-gradient(180deg, rgba(10, 13, 20, 0.8), rgba(18, 25, 42, 0.9));
  border-radius: 18px;
  border: 1px solid rgba(255,255,255,0.08);
}

svg line {
  stroke: rgba(255,255,255,0.12);
  stroke-width: 1;
}

svg polyline {
  filter: drop-shadow(0 0 10px rgba(249, 212, 35, 0.5));
}

.legend {
  display: flex;
  gap: 20px;
  align-items: center;
  color: rgba(237, 242, 255, 0.8);
  font-size: 0.95rem;
}

.dot {
  display: inline-block;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  margin-right: 8px;
  vertical-align: middle;
}

.dot.villain {
  background: var(--danger);
  box-shadow: 0 0 14px rgba(255, 95, 109, 0.8);
}

.dot.player {
  background: var(--secondary);
  box-shadow: 0 0 14px rgba(249, 212, 35, 0.8);
}

@media (max-width: 900px) {
  .hud,
  .game-layout {
    grid-template-columns: 1fr;
    display: grid;
  }

  .hud {
    justify-content: stretch;
  }

  .stats {
    justify-content: space-between;
  }
}

@media (max-width: 520px) {
  .app-shell {
    width: min(100vw - 18px, 100%);
    padding-top: 18px;
  }

  .panel {
    padding: 18px;
  }

  .story-panel h2 {
    font-size: 1.6rem;
  }

  .formula-preview {
    display: grid;
    gap: 8px;
  }
}
