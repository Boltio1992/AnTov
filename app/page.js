import { getUniverses, getSeriesAll } from '../lib/content';
import HomeClient from '../components/HomeClient';

export default function Page() {
  const universes = getUniverses();
  // strip chapter bodies from home payload (keep counts + first chapter titles)
  const series = getSeriesAll().map(s => ({
    ...s,
    chapters: s.chapters.map(c => ({ slug: c.slug, title: c.title, locked: !!c.locked }))
  }));
  return <HomeClient universes={universes} series={series} />;
}
