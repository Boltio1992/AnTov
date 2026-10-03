'use client';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

function fmt(x) {
  // minimal safe renderer: *italic*, **bold**
  let s = x.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  s = s.replace(/\*\*(.+?)\*\*/g, '<b>$1</b>');
  s = s.replace(/\*(.+?)\*/g, '<em>$1</em>');
  return s;
}

export default function Reader({ seriesId, seriesTitle, chapterIdx, chapters, blocks }) {
  const scroller = useRef(null);
  const [pct, setPct] = useState(0);
  const [sheet, setSheet] = useState(null); // null | 'toc' | 'set'

  const ch = chapters[chapterIdx];
  const first = !chapters.slice(0, chapterIdx).some(c => !c.locked); // is this the first readable chapter?

  /* restore saved theme extras (fs/lh applied in layout script) */
  useEffect(() => {
    const saved = localStorage.getItem('an_tov_bright');
    if (saved) applyBright(+saved);
    try {
      const p = JSON.parse(localStorage.getItem('an_tov_pos'));
      if (p && p.s === seriesId && p.c === chapterIdx && p.y > 200) {
        setTimeout(() => { if (scroller.current) scroller.current.scrollTop = p.y; }, 60);
      }
    } catch (e) {}
  }, [seriesId, chapterIdx]);

  const save = p => {
    localStorage.setItem('an_tov_pos', JSON.stringify({
      s: seriesId, c: chapterIdx, y: scroller.current?.scrollTop || 0, pct: Math.round(p)
    }));
  };

  const onScroll = () => {
    const el = scroller.current;
    const max = el.scrollHeight - el.clientHeight;
    const p = max > 0 ? el.scrollTop / max * 100 : 0;
    setPct(p);
    if (!save.t) save.t = Date.now();
    if (Date.now() - save.t > 800) { save.t = Date.now(); save(p); }
  };

  const go = d => {
    const n = chapterIdx + d;
    if (n < 0 || n >= chapters.length || chapters[n].locked) return;
    window.location.href = `/read/${seriesId}/${n}`;
  };

  const applyBright = v => {
    document.body.style.filter = v > 0 ? `brightness(${1 - v / 100})` : '';
  };

  const setTheme = k => {
    document.documentElement.dataset.theme = k;
    localStorage.setItem('an_tov_theme', k);
  };
  const setRange = (key, cssVar, unit, scale) => e => {
    const v = +e.target.value;
    document.documentElement.style.setProperty(cssVar, scale ? (v / 10) : v + unit);
    localStorage.setItem(key, v);
  };
  const savedFs = +(localStorage?.getItem('an_tov_fs') || 18);
  const savedLh = +(localStorage?.getItem('an_tov_lh') || 19);
  const savedBr = +(localStorage?.getItem('an_tov_bright') || 0);
  const curTheme = () => document.documentElement.dataset.theme || 'night';

  return (
    <div className="reader-root" style={{ position: 'fixed', inset: 0, background: 'var(--bg)', overflowY: 'auto' }} ref={scroller} onScroll={onScroll}>
      {/* top */}
      <div className="rtop">
        <Link href={`/series/${seriesId}`} className="icon-btn">←</Link>
        <span className="rtitle">{seriesTitle}</span>
        <button className="icon-btn" onClick={() => setSheet('set')}>Aa</button>
      </div>

      {/* paper */}
      <div className="reader-paper" onClick={e => {
        if (e.target.closest('button,a')) return;
        document.body.classList.toggle('immersive');
      }}>
        <div className="ch-label">Chapter {chapterIdx + 1} of {chapters.length}</div>
        <h2>{ch.title.replace(/^Chapter [^·]+·\s*/, '')}</h2>
        <p className="byline">{ch.byline}</p>
        <div className="prose">
          {blocks.map((b, i) => {
            if (b.t === 'q') return <blockquote key={i} dangerouslySetInnerHTML={{ __html: fmt(b.x) }} />;
            if (b.t === 'hr') return <hr key={i} />;
            if (b.t === 'img') return (
              <figure key={i} className="ch-img">
                <img src={b.src} alt={b.cap || ''} loading="lazy" />
                {b.cap && <figcaption>{b.cap}</figcaption>}
              </figure>
            );
            return <p key={i} className={i === 0 ? 'drop' : ''} dangerouslySetInnerHTML={{ __html: fmt(b.x) }} />;
          })}
          <div style={{ textAlign: 'center', color: 'var(--ink-soft)', fontSize: 12, margin: '2.5em 0 1em', letterSpacing: 1 }}>
            — end of chapter {chapterIdx + 1} —
          </div>
        </div>
      </div>
      <div style={{ height: 96 }} />

      {/* swipe: only as bonus, with edge dead-zones */}
      <div className="tapzone l" onClick={() => go(-1)} />
      <div className="tapzone r" onClick={() => go(1)} />

      {/* bottom nav */}
      <div className="rbottom">
        <button className="rb-btn" disabled={chapterIdx === 0} onClick={() => go(-1)}><span className="ic">◀</span>Prev</button>
        <button className="rb-btn" onClick={() => setSheet('toc')}><span className="ic">☰</span>Chapters</button>
        <span className="rb-pct">{Math.round(pct)}%</span>
        <button className="rb-btn" disabled={chapterIdx >= chapters.length - 1} onClick={() => go(1)}><span className="ic">▶</span>Next</button>
        <button className="rb-btn" onClick={() => document.body.classList.toggle('immersive')}><span className="ic">👁</span>Focus</button>
      </div>

      {/* sheets */}
      <div className={`sheet-backdrop ${sheet ? 'open' : ''}`} onClick={() => setSheet(null)} />
      <div className={`sheet ${sheet === 'toc' ? 'open' : ''}`}>
        <div className="grab" />
        <h3>Chapters <button className="x" onClick={() => setSheet(null)}>✕</button></h3>
        {chapters.map((c, i) => (
          <div key={c.slug}
            className={`toc-item ${i === chapterIdx ? 'cur' : ''}`}
            style={c.locked ? { opacity: .45 } : {}}
            onClick={() => { if (!c.locked) { setSheet(null); window.location.href = `/read/${seriesId}/${i}`; } }}>
            <span className="n">{c.locked ? '🔒' : i + 1}</span><span>{c.title}</span>
          </div>
        ))}
      </div>
      <div className={`sheet ${sheet === 'set' ? 'open' : ''}`}>
        <div className="grab" />
        <h3>Reading settings <button className="x" onClick={() => setSheet(null)}>✕</button></h3>
        <div className="set-row"><label>Theme</label>
          <div className="theme-row">
            {['paper', 'night', 'dim'].map(k => (
              <button key={k} data-t={k} onClick={e => {
                setTheme(k);
                e.currentTarget.parentElement.querySelectorAll('button').forEach(b => b.classList.remove('on'));
                e.currentTarget.classList.add('on');
              }}>{k[0].toUpperCase() + k.slice(1)}</button>
            ))}
          </div>
        </div>
        <div className="set-row"><label>Brightness</label>
          <input type="range" min="0" max="60" defaultValue={savedBr}
            onChange={e => { applyBright(+e.target.value); localStorage.setItem('an_tov_bright', e.target.value); }} />
        </div>
        <div className="set-row"><label>Text size</label>
          <input type="range" min="15" max="24" defaultValue={savedFs}
            onChange={setRange('an_tov_fs', '--fs', 'px', false)} />
        </div>
        <div className="set-row"><label>Line height</label>
          <input type="range" min="16" max="24" defaultValue={savedLh}
            onChange={setRange('an_tov_lh', '--lh', '', true)} />
        </div>
      </div>

      <MarkTheme />
    </div>
  );
}

function MarkTheme() {
  useEffect(() => {
    const k = document.documentElement.dataset.theme || 'night';
    document.querySelectorAll('.theme-row button').forEach(b => b.classList.toggle('on', b.dataset.t === k));
  }, []);
  return null;
}
