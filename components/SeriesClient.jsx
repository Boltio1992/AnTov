'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function SeriesClient({ series }) {
  const router = useRouter();

  // "Continue" → jump straight to first free chapter if never read
  useEffect(() => {
    try {
      const p = JSON.parse(localStorage.getItem('an_tov_pos'));
      if (p && p.s === series.id && p.c > 0) router.replace(`/read/${series.id}/${p.c}`);
    } catch (e) {}
  }, [series.id, router]);

  return (
    <div>
      <div className="topbar">
        <Link href="/" className="icon-btn">←</Link>
        <span className="crumb">Series</span>
        <ThemeChip />
      </div>
      <div className="wrap">
        <div className="hero">
          <img src={series.cover} alt={series.title} className="hero-img" />
          <span className="hero-emoji">{series.emoji}</span>
          <h1>{series.title}</h1>
          <p className="sub">{series.desc}</p>
          <div className="tags">{series.tags.map(t => <span className="tag" key={t}>{t}</span>)}</div>
        </div>
        <div className="section-lbl">Chapters</div>
        {series.chapters.map((c, i) => (
          <Link
            href={c.locked ? '#' : `/read/${series.id}/${i}`}
            key={c.slug}
            className={`ver ${c.locked ? 'locked' : ''}`}
            onClick={e => { if (c.locked) e.preventDefault(); }}
          >
            <div className="vn">{c.locked ? '🔒' : i + 1}</div>
            <div>
              <h3>{c.title}</h3>
              <p>{c.locked ? 'Locked — coming soon.' : c.byline}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

function ThemeChip() {
  return (
    <button className="chip-btn" onClick={() => {
      const order = ['paper', 'night', 'dim'];
      const cur = document.documentElement.dataset.theme || 'night';
      const next = order[(order.indexOf(cur) + 1) % 3];
      document.documentElement.dataset.theme = next;
      localStorage.setItem('an_tov_theme', next);
    }}>◐</button>
  );
}
