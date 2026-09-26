import { useNavigate } from 'react-router-dom';
import { AREA_LABELS } from '../constants';
import { useContracts } from '../context/ContractsContext';
import type { VerificationArea } from '../types';
import Icon from '../components/Icon';
import IssueCard from '../components/IssueCard';
import TrustScoreGauge from '../components/TrustScoreGauge';

const areaOrder: VerificationArea[] = ['runtime_requirements', 'commands', 'config_env', 'api_docs'];

export default function Dashboard() {
  const navigate = useNavigate();
  const { contracts, summary, score, previousScore, areaScores } = useContracts();
  const issues = contracts.filter((contract) => contract.status !== 'pass').slice(0, 3);

  return (
    <section className="page-stack">
      <div className="page-heading"><div><span className="eyebrow">Documentation health</span><h1>Overview</h1><p>See whether your documentation still matches the repository and what needs attention.</p></div><span className="verified-chip"><Icon name="shield" size={14} /> Evidence-backed results</span></div>

      <div className="dashboard-top-grid">
        <button className="panel score-panel" onClick={() => navigate('/trust-score')}>
          <div className="score-panel-copy"><span className="eyebrow">Documentation Trust Score</span><h2>{score >= 90 ? 'Highly verified' : score >= 75 ? 'Mostly verified' : 'Needs attention'}</h2><p>Overall confidence that documented technical claims still match repository evidence.</p><span className="text-link">View score details <Icon name="arrow-right" size={14} /></span></div>
          <TrustScoreGauge score={score} previous={previousScore} />
        </button>

        <section className="panel metric-panel">
          <div className="metric-panel-header"><span className="eyebrow">Verification summary</span><strong>{summary.total} claims checked</strong></div>
          <div className="metrics-row"><div><strong>{summary.passed}</strong><span>Passed</span></div><div><strong>{summary.failed}</strong><span>Failed</span></div><div><strong>{summary.warnings}</strong><span>Warnings</span></div></div>
          <button className="text-button" onClick={() => navigate('/contracts')}>View all documentation contracts <Icon name="arrow-right" size={14} /></button>
        </section>
      </div>

      <section className="dashboard-section">
        <div className="section-heading-row"><div><span className="eyebrow">Verification coverage</span><h2>Four core documentation areas</h2></div></div>
        <div className="coverage-grid">
          {areaOrder.map((area) => {
            const areaScore = areaScores[area];
            const count = contracts.filter((contract) => contract.area === area).length;
            return <button key={area} className="panel coverage-card" onClick={() => navigate(`/contracts?area=${area}`)}><div><strong>{AREA_LABELS[area]}</strong><span>{count} claims checked</span></div><b>{areaScore}%</b><div className="mini-progress"><span style={{ width: `${areaScore}%` }} /></div></button>;
          })}
        </div>
      </section>

      <section className="dashboard-section">
        <div className="section-heading-row"><div><span className="eyebrow">Action required</span><h2>Issues requiring attention</h2></div><button className="text-button" onClick={() => navigate('/issues')}>Open Issues & Fixes <Icon name="arrow-right" size={14} /></button></div>
        {issues.length ? <div className="issue-list">{issues.map((contract) => <IssueCard key={contract.id} contract={contract} actionLabel="Review Issue" onAction={() => navigate(`/contracts/${contract.id}`)} />)}</div> : <div className="panel success-state"><span><Icon name="check" size={18} /></span><div><strong>Documentation Verified</strong><p>All currently verifiable claims match the repository.</p></div></div>}
      </section>
    </section>
  );
}
