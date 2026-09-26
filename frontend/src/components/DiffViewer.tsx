import Icon from './Icon';

export default function DiffViewer({ before, after }: { before: string; after: string }) {
  return (
    <div className="diff-viewer">
      <section className="diff-pane diff-before"><div className="diff-label">BEFORE</div><pre><span>- </span>{before}</pre></section>
      <div className="diff-divider"><Icon name="arrow-right" size={16} /></div>
      <section className="diff-pane diff-after"><div className="diff-label">AFTER</div><pre><span>+ </span>{after}</pre></section>
    </div>
  );
}
