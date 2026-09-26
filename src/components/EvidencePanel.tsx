import { useState } from 'react';
import type { DocumentationContract } from '../types';
import Icon from './Icon';

export default function EvidencePanel({ contract }: { contract: DocumentationContract }) {
  return (
    <section className="panel evidence-panel">
      <div className="section-heading-row">
        <div><span className="eyebrow">Evidence</span><h2>Repository proof</h2></div>
        <span className="evidence-source"><Icon name="file" size={14} /> {contract.evidenceFile ?? contract.source.split('#')[0]} {contract.evidenceLines ? `· ${contract.evidenceLines}` : ''}</span>
      </div>
      {contract.evidenceSnippet && <CodeBlock code={contract.evidenceSnippet} />}
      <div className="evidence-explanation">
        <strong>Evidence summary</strong>
        <p>{contract.evidence}</p>
      </div>
      <div className="evidence-path" aria-label="Evidence relationship">
        <span>{contract.source}</span><Icon name="arrow-right" size={14} /><span>Documentation claim</span><Icon name="arrow-right" size={14} /><span>{contract.evidenceFile ?? 'Repository'}</span><Icon name="arrow-right" size={14} /><span>{contract.status === 'pass' ? 'Verified' : contract.status === 'warning' ? 'Needs clarification' : 'Mismatch detected'}</span>
      </div>
    </section>
  );
}

function CodeBlock({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  function copy() {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div className="code-block-wrap">
      <pre className="code-block"><code>{code}</code></pre>
      <button className={`copy-btn${copied ? ' copied' : ''}`} onClick={copy} aria-label="Copy code to clipboard" title="Copy to clipboard">
        {copied ? <Icon name="check" size={13} /> : <Icon name="file" size={13} />}
        <span>{copied ? 'Copied' : 'Copy'}</span>
      </button>
    </div>
  );
}
