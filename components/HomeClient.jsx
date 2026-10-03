'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

const ThemeChip = () => {
  const [name, setName] = useState('Night');
  useEffect(() => {
    const cur = document.documentElement.dataset.theme || 'night';
    setName(cur[0].toUpperCase() + cur.slice(1));
  }, []);
  const cycle = () => {
    const order = ['paper', 'night', 'dim'];
    const cur = document.documentElement.dataset.theme || 'night';
    const next = order[(order.indexOf(cur) + 1) % 3];
    document.documentElement.dataset.theme = next;
    localStorage.setItem('an_tov_theme', next);
    setName(next[0].toUpperCase() + next.slice(1));
  };
  return (
    <button onClick={cycle} className="chip-btn">◐ {name}</button>
  );
};

export default function HomeClient({ universes, series }) {
  const [uni, setUni] = useState('all');
  const [pos, setPos] = useState(null);

  useEffect(() => {
    try { setPos(JSON.parse(localStorage.getItem('an_tov_pos'))); } catch (e) {}
  }, []);

  const posSeries = pos && series.find(s => s.id === pos.s);
  const list = uni === 'all' ? series : series.filter(s => s.uni === uni);
  const uniName = id => universes.find(u => u.id === id)?.name || '';

  return (
    <div>
      {/* top bar */}
      <div className="topbar">
        <div className="brand">
          <svg width="30" height="30" viewBox="0 0 40 40">
            <path d="M27 8 A14.5 14.5 0 1 0 32 26 A12 12 0 0 1 27 8 Z" fill="var(--accent)" />
            <ellipse cx="20" cy="20" rx="8.5" ry="5" fill="none" stroke="var(--ink)" strokeWidth="1.6" />
            <circle cx="20" cy="20" r="3.2" fill="var(--accent)" />
            <circle cx="21.2" cy="18.8" r="1" fill="#fff" fillOpacity=".9" />
          </svg>
          <span className="wordmark">An<b>Tov</b></span>
        </div>
        <ThemeChip />
      </div>

      <div className="wrap">
        <div className="greet">
          <h1>Something is<br />waiting in the dark.</h1>
          <p>Read slow. Read scared. The night is long.</p>
        </div>

        {posSeries && (
          <Link href={`/read/${posSeries.id}/${pos.c}`} className="continue">
            <div className="cont-lbl">Continue Reading</div>
            <h3>{posSeries.title}</h3>
            <p>Chapter {(pos.c || 0) + 1} · {pos.pct || 0}% read</p>
            <div className="bar"><i style={{ width: `${pos.pct || 0}%` }} /></div>
            <span className="go">›</span>
          </Link>
        )}

        {/* universe chips */}
        <div className="uni-row">
          <button className={`uni-chip ${uni === 'all' ? 'on' : ''}`} onClick={() => setUni('all')}>✦ All</button>
          {universes.map(u => (
            <button key={u.id} className={`uni-chip ${uni === u.id ? 'on' : ''}`} onClick={() => setUni(u.id)}>
              {u.emoji} {u.name}
            </button>
          ))}
        </div>

        <div className="section-lbl">{uni === 'all' ? 'All Series' : uniName(uni)}</div>

        <div className="grid">
          {list.map(s => (
            <Link href={`/series/${s.id}`} key={s.id} className="card">
              {s.chapters.some(c => c.locked) && <span className="badge">New</span>}
              <div className="cover" style={s.cover ? { backgroundImage: `linear-gradient(rgba(10,8,6,.35),rgba(10,8,6,.55)), url(${s.cover})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}>
                {!s.cover && s.emoji}
              </div>
              <div className="meta">
                <h3>{s.title}</h3>
                <p>{s.chapters.filter(c => !c.locked).length} chapter{s.chapters.filter(c => !c.locked).length !== 1 ? 's' : ''} · {uniName(s.uni)}</p>
              </div>
            </Link>
          ))}
        </div>

        <footer>AN TOV — horror, one shift at a time</footer>
      </div>
    </div>
  );
}
