import type { DocumentationContract } from '../types';
import { AREA_LABELS } from '../constants';
import Icon from './Icon';
import StatusBadge from './StatusBadge';

export default function IssueCard({
  contract,
  actionLabel = 'Review Fix',
  onAction,
}: {
  contract: DocumentationContract;
  actionLabel?: string;
  onAction: () => void;
}) {
  return (
    <article className="panel issue-card">
      <div className="issue-card-header">
        <div className="issue-title-group">
          <span className={`severity severity-${contract.severity ?? 'medium'}`}>{(contract.severity ?? 'medium').toUpperCase()}</span>
          <div><strong>{contract.claim}</strong><span>{contract.source.split('#')[0]} · {AREA_LABELS[contract.area]}</span></div>
        </div>
        <StatusBadge status={contract.status} approvalStatus={contract.approvalStatus} />
      </div>
      <div className="issue-comparison">
        <div><span>Documentation</span><strong>{contract.expected}</strong></div>
        <Icon name="arrow-right" size={15} />
        <div><span>Repository</span><strong>{contract.actual}</strong></div>
      </div>
      <div className="issue-card-footer"><span>{contract.suggested_fix ? 'Suggested correction available' : 'Review repository evidence'}</span><button className="button button-secondary" onClick={onAction}>{actionLabel}<Icon name="arrow-right" size={14} /></button></div>
    </article>
  );
}
