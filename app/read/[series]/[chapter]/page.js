import { getSeries } from '../../../../lib/content';
import Reader from '../../../../components/Reader';

export default function Page({ params }) {
  const s = getSeries(params.series);
  if (!s) return <p style={{ padding: 40 }}>Series not found.</p>;
  const idx = parseInt(params.chapter);
  const ch = s.chapters[idx];
  if (!ch || ch.locked) return <p style={{ padding: 40 }}>Chapter locked or not found.</p>;
  const chapters = s.chapters.map(c => ({ slug: c.slug, title: c.title, locked: !!c.locked }));
  return (
    <Reader
      seriesId={s.id}
      seriesTitle={s.title}
      chapterIdx={idx}
      chapters={chapters}
      blocks={ch.blocks}
    />
  );
}
