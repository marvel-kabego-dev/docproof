import { useNavigate } from 'react-router-dom';
import { useContracts } from '../context/ContractsContext';
import Icon from '../components/Icon';

export default function History() {
  const navigate = useNavigate();
  const { history } = useContracts();
  return (
    <section className="page-stack">
      <div className="page-heading"><div><span className="eyebrow">Verification history</span><h1>Project runs</h1><p>See how documentation confidence changes as drift is fixed over time.</p></div></div>
      <div className="history-list">{history.map((run) => <article className={`panel history-row${run.current ? ' current' : ''}`} key={run.id}><div className="history-time"><span>{run.date}</span>{run.current && <b>Current</b>}</div><div className="history-score"><span>Trust Score</span><strong>{run.trustScore}<small>/100</small></strong></div><div className="history-summary"><strong>{run.summary.total} claims</strong><span>{run.summary.passed} passed · {run.summary.failed} failed · {run.summary.warnings} warning{run.summary.warnings === 1 ? '' : 's'}</span></div><div className="history-meta"><span><Icon name="branch" size={13} /> {run.branch}</span><code>{run.commit}</code><button className="button button-ghost compact" onClick={() => navigate('/contracts')}>View Run</button></div></article>)}</div>
    </section>
  );
}
