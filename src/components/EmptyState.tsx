import type { ReactNode } from 'react';
import Icon from './Icon';

export default function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="empty-state panel">
      <span className="empty-state-icon"><Icon name="file" size={22} /></span>
      <strong>{title}</strong>
      <span>{description}</span>
      {action}
    </div>
  );
}
