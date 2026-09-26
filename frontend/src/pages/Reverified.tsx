import { useEffect, useRef, useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { useContracts } from '../context/ContractsContext';
import Icon from '../components/Icon';

const stages = [
  'Suggested fix approved',
  'Documentation update prepared',
  'Repository checked',
  'Re-verifying claim',
];

export default function Reverified() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getContract, completeReverification, previousScore, score } = useContracts();
  const contract = getContract(id);
  const [stage, setStage] = useState(0);
  const [complete, setComplete] = useState(Boolean(contract?.reverified));
  const didComplete = useRef(false);

  useEffect(() => {
    if (!contract || contract.reverified || didComplete.current) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let current = 0;
    const timer = window.setInterval(() => {
      current += 1;
      setStage(Math.min(current, stages.length - 1));
      if (current >= stages.length) {
        window.clearInterval(timer);
        if (!didComplete.current) {
          didComplete.current = true;
          completeReverification(contract.id);
          setComplete(true);
        }
      }
    }, reduced ? 90 : 460);
    return () => window.clearInterval(timer);
  }, [completeReverification, contract]);

  if (!contract) return <Navigate to="/contracts" replace />;

  return (
    <section className="reverify-page page-stack">
      {!complete ? (
        <section className="panel reverify-progress">
          <span className="reverify-spinner"><Icon name="refresh" size={24} /></span>
          <div><span className="eyebrow">Re-verification in progress</span><h1>Checking the approved documentation fix</h1><p>DocProof is comparing the updated claim with repository evidence again.</p></div>
          <div className="reverify-stages">{stages.map((label, index) => <div key={label} className={index < stage ? 'done' : index === stage ? 'active' : ''}><span>{index < stage ? <Icon name="check" size={13} /> : index === stage ? <Icon name="refresh" size={13} /> : <Icon name="clock" size={13} />}</span>{label}</div>)}</div>
        </section>
      ) : (
        <section className="verification-success">
          <span className="success-mark"><Icon name="check" size={26} /></span>
          <span className="eyebrow">Verification Passed</span>
          <h1>The documentation now matches the repository.</h1>
          <p>The approved correction was re-verified against repository evidence.</p>
          <div className="before-after-result panel"><article><span>BEFORE</span><strong className="bad">FAILED</strong><small>{contract.expected}</small></article><Icon name="arrow-right" size={20} /><article><span>AFTER</span><strong className="good">PASSED</strong><small>{contract.actual}</small></article></div>
          <div className="score-improvement panel"><span>Documentation Trust Score</span><div><strong>{previousScore}</strong><Icon name="arrow-right" size={18} /><strong>{score}</strong><b>+{Math.max(0, score - previousScore)}</b></div></div>
          <div className="result-actions"><button className="button button-primary" onClick={() => navigate('/dashboard')}>Return to Dashboard</button><button className="button button-secondary" onClick={() => navigate(`/contracts/${contract.id}`)}>View Contract</button><button className="button button-ghost" onClick={() => navigate('/issues')}>Review Remaining Issues</button></div>
        </section>
      )}
    </section>
  );
}
