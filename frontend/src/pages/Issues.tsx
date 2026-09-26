import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useContracts } from '../context/ContractsContext';
import type { IssueBucket } from '../types';
import { getIssueBucket } from '../utils/verification';
import EmptyState from '../components/EmptyState';
import IssueCard from '../components/IssueCard';

const tabs: { value: IssueBucket; label: string }[] = [
  { value: 'open', label: 'Open' },
  { value: 'pending', label: 'Pending Review' },
  { value: 'resolved', label: 'Resolved' },
  { value: 'rejected', label: 'Rejected' },
];

export default function Issues() {
  const navigate = useNavigate();
  const { contracts } = useContracts();
  const [tab, setTab] = useState<IssueBucket>('open');
  const issueContracts = useMemo(() => contracts.filter((contract) => contract.status !== 'pass' || contract.approvalStatus !== 'pending'), [contracts]);
  const grouped = useMemo(() => tabs.reduce<Record<IssueBucket, typeof issueContracts>>((result, item) => {
    result[item.value] = issueContracts.filter((contract) => getIssueBucket(contract) === item.value);
    return result;
  }, { open: [], pending: [], resolved: [], rejected: [] }), [issueContracts]);

  return (
    <section className="page-stack">
      <div className="page-heading"><div><span className="eyebrow">Documentation repair queue</span><h1>Issues & Fixes</h1><p>Review mismatches, warnings, rejected corrections, and resolved documentation drift.</p></div></div>
      <div className="issues-tabs panel">{tabs.map((item) => <button key={item.value} onClick={() => setTab(item.value)} className={tab === item.value ? 'active' : ''}>{item.label}<span>{grouped[item.value].length}</span></button>)}</div>
      {grouped[tab].length ? <div className="issue-list">{grouped[tab].map((contract) => <IssueCard key={contract.id} contract={contract} actionLabel={tab === 'resolved' ? 'View Contract' : tab === 'rejected' ? 'Review Again' : 'Review Fix'} onAction={() => navigate(tab === 'resolved' ? `/contracts/${contract.id}` : `/contracts/${contract.id}/fix`)} />)}</div> : <EmptyState title={tab === 'open' ? 'No open documentation issues' : `No ${tabs.find((item) => item.value === tab)?.label.toLowerCase()} items`} description={tab === 'open' ? 'All currently verifiable claims are resolved or awaiting another state.' : 'There are no contracts in this lifecycle state right now.'} />}
    </section>
  );
}
