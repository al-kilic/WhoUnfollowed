import { EXPORT_APPS, TOP_APPS, type Access } from './data';
import { fmt } from './stats';
import type { StudyContent } from './content';

const APP_URL = (id: number) => `https://apps.apple.com/us/app/id${id}`;
const DOT: Record<Access, string> = { stated: 'var(--st-acc)', features: 'var(--st-acc)', unstated: 'var(--st-un)' };

// The full top-30 table and the export-based list. Also the accessible view of
// the chart above it: every count in the bar can be read off this table.
export function StudyTable({ c }: { c: StudyContent }) {
  return (
    <div className="st-scroll">
      <table className="st-table">
        <thead><tr>{c.cols.map((h) => <th key={h} scope="col" className={h === 'Ratings' ? 'num' : undefined}>{h}</th>)}</tr></thead>
        <tbody>
          {TOP_APPS.map((a) => (
            <tr key={a.id}>
              <td className="num">{a.rank}</td>
              <td><a href={APP_URL(a.id)} target="_blank" rel="noopener noreferrer nofollow"><b>{a.name}</b></a><small>{a.developer}</small></td>
              <td className="num">{fmt(a.ratings)}<small>{a.stars.toFixed(1)} stars</small></td>
              <td style={{ whiteSpace: 'nowrap' }}>{a.updated}</td>
              <td><span className="st-tag"><i style={{ background: DOT[a.access] }} aria-hidden="true" />{c.access[a.access]}</span></td>
              <td>{a.evidence ?? ''}</td>
              <td>{a.price ?? ''}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function ExportTable({ c }: { c: StudyContent }) {
  return (
    <div className="st-scroll">
      <table className="st-table" style={{ minWidth: 560 }}>
        <thead><tr>{c.exportCols.map((h) => <th key={h} scope="col" className={h === 'Ratings' ? 'num' : undefined}>{h}</th>)}</tr></thead>
        <tbody>
          {[...EXPORT_APPS].sort((x, y) => y.ratings - x.ratings).map((a) => (
            <tr key={a.id}>
              <td><a href={APP_URL(a.id)} target="_blank" rel="noopener noreferrer nofollow"><b>{a.name}</b></a></td>
              <td>{a.developer}</td>
              <td className="num">{fmt(a.ratings)}</td>
              <td style={{ whiteSpace: 'nowrap' }}>{a.updated}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
