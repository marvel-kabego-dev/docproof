import type { DocumentationContract } from '../types';
import { AREA_SHORT_LABELS } from '../constants';
import Icon from './Icon';
import StatusBadge from './StatusBadge';

export default function ContractCard({ contract, onOpen }: { contract: DocumentationContract; onOpen: (contract: DocumentationContract) => void }) {
  return (
    <button className="contract-card" onClick={() => onOpen(contract)}>
      <StatusBadge status={contract.status} approvalStatus={contract.approvalStatus} />
      <span className="contract-card-main"><strong>{contract.claim}</strong><span>{contract.source}</span></span>
      <span className="contract-card-area">{AREA_SHORT_LABELS[contract.area]}</span>
      <Icon name="arrow-right" size={15} />
    </button>
  );
}
