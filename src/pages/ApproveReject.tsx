import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { useContracts } from '../context/ContractsContext';
import { useToast } from '../context/ToastContext';
import DiffViewer from '../components/DiffViewer';
import Icon from '../components/Icon';

export default function ApproveReject() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getContract, approveContract, rejectContract } = useContracts();
  const { addToast } = useToast();
  const contract = getContract(id);
  if (!contract) return <Navigate to="/contracts" replace />;
  if (contract.status === 'pass') return <Navigate to={`/contracts/${contract.id}`} replace />;
  const contractId = contract.id;

  function reject() {
    rejectContract(contractId);
    addToast('Fix rejected — contract marked for future review.', 'error');
    navigate(`/contracts/${contractId}`, { replace: true });
  }
  function approve() {
    approveContract(contractId);
    addToast('Fix approved! Running re-verification…', 'success');
    navigate(`/contracts/${contractId}/reverified`, { replace: true });
  }

  return (
    <section className="narrow-page page-stack">
      <button className="back-button" onClick={() => navigate(`/contracts/${contract.id}`)}><Icon name="arrow-left" size={15} /> Contract Detail</button>
      <div className="page-heading"><div><span className="eyebrow">Human approval required</span><h1>Review Suggested Fix</h1><p>Compare the documented claim with DocProof's suggested correction before anything changes.</p></div></div>
      <section className="panel approval-card">
        <div className="approval-file-row"><div><strong>{contract.source.split('#')[0]}</strong><span>{contract.id} · {contract.source}</span></div><div className="human-pill"><Icon name="shield" size={13} /> Human controlled</div></div>
        <DiffViewer before={contract.claim} after={contract.suggested_fix} />
        <div className="approval-explainer"><strong>What happens after approval?</strong><ol><li>The suggested documentation correction is marked approved.</li><li>DocProof checks the claim against repository evidence again.</li><li>The contract result and Trust Score update only after re-verification succeeds.</li></ol></div>
        <div className="approval-safety"><Icon name="shield" size={14} /> No documentation changes are applied without your approval.</div>
        <div className="approval-actions"><button className="button button-secondary danger" onClick={reject}><Icon name="x" size={14} /> Reject Fix</button><button className="button button-primary" onClick={approve}>Approve & Re-verify <Icon name="refresh" size={14} /></button></div>
      </section>
    </section>
  );
}
