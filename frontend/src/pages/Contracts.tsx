import { useEffect, useMemo, useState, type ChangeEvent, type KeyboardEvent } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AREA_LABELS } from '../constants';
import { useContracts } from '../context/ContractsContext';
import type { ContractFilters, VerificationArea } from '../types';
import { filterContracts } from '../utils/verification';
import EmptyState from '../components/EmptyState';
import Icon from '../components/Icon';
import StatusBadge from '../components/StatusBadge';

const statuses: { value: ContractFilters['status']; label: string }[] = [
  { value: 'all', label: 'All' }, { value: 'fail', label: 'Failed' }, { value: 'warning', label: 'Warning' }, { value: 'pass', label: 'Passed' },
];
const validAreas: VerificationArea[] = ['runtime_requirements', 'commands', 'config_env', 'api_docs'];

export default function Contracts() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const { contracts } = useContracts();
  const areaParam = params.get('area');
  const [filters, setFilters] = useState<ContractFilters>({ status: 'all', query: '', area: validAreas.includes(areaParam as VerificationArea) ? areaParam as VerificationArea : 'all', source: 'all' });

  useEffect(() => {
    setFilters((current) => ({ ...current, area: validAreas.includes(areaParam as VerificationArea) ? areaParam as VerificationArea : 'all' }));
  }, [areaParam]);

  const sources = useMemo(() => Array.from(new Set(contracts.map((contract) => contract.source.split('#')[0]))).sort(), [contracts]);
  const visible = useMemo(() => filterContracts(contracts, filters), [contracts, filters]);
  const countFor = (status: ContractFilters['status']) => status === 'all' ? contracts.length : contracts.filter((contract) => contract.status === status).length;

  return (
    <section className="page-stack">
      <div className="page-heading"><div><span className="eyebrow">Verification results</span><h1>Documentation Contracts</h1><p>{contracts.length} documentation claims verified against repository evidence.</p></div><span className="verified-chip">{visible.length} shown</span></div>
      <section className="panel contracts-controls">
        <div className="filter-tabs">{statuses.map((item) => <button key={item.value} className={filters.status === item.value ? 'active' : ''} onClick={() => setFilters((current) => ({ ...current, status: item.value }))}>{item.label}<span>{countFor(item.value)}</span></button>)}</div>
        <label className="search-box"><Icon name="search" size={15} /><input value={filters.query} onChange={(event: ChangeEvent<HTMLInputElement>) => setFilters((current) => ({ ...current, query: event.target.value }))} placeholder="Search documentation claims..." /></label>
        <div className="select-row">
          <label>Category<select value={filters.area} onChange={(event: ChangeEvent<HTMLSelectElement>) => setFilters((current) => ({ ...current, area: event.target.value as ContractFilters['area'] }))}><option value="all">All Categories</option>{validAreas.map((area) => <option key={area} value={area}>{AREA_LABELS[area]}</option>)}</select></label>
          <label>Source<select value={filters.source} onChange={(event: ChangeEvent<HTMLSelectElement>) => setFilters((current) => ({ ...current, source: event.target.value }))}><option value="all">All Files</option>{sources.map((source) => <option key={source} value={source}>{source}</option>)}</select></label>
        </div>
      </section>

      {visible.length ? <div className="contracts-table-wrap panel"><table className="contracts-table"><thead><tr><th>Status</th><th>Documentation Claim</th><th>Category</th><th>Source</th><th>Result</th></tr></thead><tbody>{visible.map((contract) => <tr key={contract.id} tabIndex={0} onClick={() => navigate(`/contracts/${contract.id}`)} onKeyDown={(event: KeyboardEvent<HTMLTableRowElement>) => { if (event.key === 'Enter' || event.key === ' ') navigate(`/contracts/${contract.id}`); }}><td><StatusBadge status={contract.status} approvalStatus={contract.approvalStatus} /></td><td><strong>{contract.claim}</strong><span>{contract.id}</span></td><td>{AREA_LABELS[contract.area]}</td><td>{contract.source}</td><td><span className={`result-text result-${contract.status}`}>{contract.status === 'pass' ? 'Verified' : contract.status === 'warning' ? 'Review' : 'Mismatch'}</span><Icon name="arrow-right" size={14} /></td></tr>)}</tbody></table></div> : <EmptyState title="No documentation claims found" description="No claims match your current filters. Try changing the status, category, source, or search text." />}
    </section>
  );
}
