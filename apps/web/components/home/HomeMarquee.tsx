// The slow band of phrases under the hero (repeated so the loop is seamless).
export function HomeMarquee({ words }: { words: string[] }) {
  const all = [...words, ...words, ...words, ...words];
  return <div className="mq" aria-hidden="true"><div className="mq-t">{all.map((w, i) => <span key={i}>{w}</span>)}</div></div>;
}
