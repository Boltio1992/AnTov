import { getSeries } from '../../../lib/content';
import SeriesClient from '../../../components/SeriesClient';

export default function Page({ params }) {
  const s = getSeries(params.id);
  if (!s) return <p style={{ padding: 40 }}>Series not found.</p>;
  const chapters = s.chapters.map(c => ({ slug: c.slug, title: c.title, byline: c.byline, locked: !!c.locked }));
  return <SeriesClient series={{ ...s, chapters }} />;
}
