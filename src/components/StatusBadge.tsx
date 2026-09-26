import Icon from './Icon';
import type { ApprovalStatus, ContractResultStatus } from '../types';

const labels: Record<ContractResultStatus, string> = {
  pass: 'Passed',
  fail: 'Failed',
  warning: 'Warning',
};

export default function StatusBadge({
  status,
  approvalStatus,
}: {
  status: ContractResultStatus;
  approvalStatus?: ApprovalStatus;
}) {
  if (approvalStatus === 'rejected') {
    return <span className="status-badge status-rejected"><Icon name="x" size={13} /> Rejected</span>;
  }

  const icon = status === 'pass' ? 'check' : status === 'warning' ? 'warning' : 'x';
  return <span className={`status-badge status-${status}`}><Icon name={icon} size={13} /> {labels[status]}</span>;
}
