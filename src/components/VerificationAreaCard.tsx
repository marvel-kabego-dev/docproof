import type { VerificationAreaProgress } from '../types';
import Icon from './Icon';

export default function VerificationAreaCard({ item }: { item: VerificationAreaProgress }) {
  const icon = item.status === 'complete' ? 'check' : item.status === 'error' ? 'x' : item.status === 'running' ? 'refresh' : 'clock';
  return (
    <article className={`verification-area-card ${item.status}`}>
      <span className="area-status-icon"><Icon name={icon} size={16} /></span>
      <div><strong>{item.label}</strong><span>{item.status === 'complete' ? 'Completed' : item.status === 'running' ? 'Running verification' : item.status === 'error' ? 'Could not complete' : 'Waiting'}</span></div>
    </article>
  );
}
