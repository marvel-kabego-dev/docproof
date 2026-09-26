import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { AREA_LABELS } from '../constants';
import { useContracts } from '../context/ContractsContext';
import EvidencePanel from '../components/EvidencePanel';
import Icon from '../components/Icon';
import StatusBadge from '../components/StatusBadge';

export default function ContractDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getContract } = useContracts();
  const contract = getContract(id);
  if (!contract) return <Navigate to="/contracts" replace />;

  return (
    <section className="detail-page page-stack">
      <button className="back-button" onClick={() => navigate('/contracts')}><Icon name="arrow-left" size={15} /> Back to Verification Results</button>
      <div className="page-heading contract-detail-heading"><div><span className="eyebrow">Documentation Contract</span><h1>{contract.id}</h1><p>{AREA_LABELS[contract.area]}</p></div><StatusBadge status={contract.status} approvalStatus={contract.approvalStatus} /></div>

      <section className="panel claim-panel"><div className="section-heading-row"><div><span className="eyebrow">Documentation claim</span><h2>{contract.source}</h2></div></div><blockquote>{contract.claim}</blockquote></section>

      <section className="comparison-grid"><article className="panel comparison-card expected"><span>DOCUMENTATION EXPECTED</span><strong>{contract.expected}</strong></article><article className="panel comparison-card actual"><span>REPOSITORY ACTUAL</span><strong>{contract.actual}</strong></article></section>

      {contract.status !== 'pass' && <div className={`mismatch-banner ${contract.status}`}><Icon name={contract.status === 'warning' ? 'warning' : 'x'} size={15} /><strong>{contract.status === 'warning' ? 'Needs clarification' : 'Mismatch detected'}</strong><span>{contract.status === 'warning' ? 'The claim is partially true but needs clearer wording.' : 'Documentation does not match repository evidence.'}</span></div>}

      <EvidencePanel contract={contract} />

      {contract.status !== 'pass' && contract.suggested_fix && <section className="panel suggested-fix-preview"><div className="section-heading-row"><div><span className="eyebrow">Suggested fix</span><h2>{contract.suggested_fix}</h2></div><button className="button button-primary" onClick={() => navigate(`/contracts/${contract.id}/fix`)}>Review Fix <Icon name="arrow-right" size={14} /></button></div><p>No documentation changes are applied without your approval.</p>{contract.approvalStatus === 'rejected' && <div className="inline-notice rejected"><Icon name="x" size={14} /> This suggested fix was rejected. You can review it again at any time.</div>}</section>}
    </section>
  );
}
