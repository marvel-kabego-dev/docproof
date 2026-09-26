import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AREA_LABELS } from '../constants';
import { useContracts } from '../context/ContractsContext';
import { filterContracts } from '../utils/verification';
import Icon from './Icon';
import StatusBadge from './StatusBadge';

export default function SpotlightSearch({ onClose }: { onClose: () => void }) {
  const navigate = useNavigate();
  const { contracts } = useContracts();
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    return filterContracts(contracts, { status: 'all', query, area: 'all', source: 'all' }).slice(0, 8);
  }, [query, contracts]);

  function pick(id: string) {
    navigate(`/contracts/${id}`);
    onClose();
  }

  return (
    <div className="spotlight-backdrop" onClick={onClose}>
      <div className="spotlight-modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-label="Search documentation contracts">
        <div className="spotlight-input-row">
          <Icon name="search" size={17} />
          <input
            ref={inputRef}
            className="spotlight-input"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search documentation contracts…"
            aria-label="Search contracts"
          />
          <kbd className="spotlight-kbd">ESC</kbd>
        </div>
        {results.length > 0 && (
          <ul className="spotlight-results" role="listbox">
            {results.map((contract) => (
              <li key={contract.id} role="option" aria-selected="false">
                <button className="spotlight-result" onClick={() => pick(contract.id)}>
                  <StatusBadge status={contract.status} approvalStatus={contract.approvalStatus} />
                  <div className="spotlight-result-body">
                    <span className="spotlight-result-claim">{contract.claim}</span>
                    <span className="spotlight-result-meta">{contract.id} · {AREA_LABELS[contract.area]}</span>
                  </div>
                  <Icon name="arrow-right" size={14} />
                </button>
              </li>
            ))}
          </ul>
        )}
        {query.trim() && results.length === 0 && (
          <p className="spotlight-empty">No contracts match <em>"{query}"</em></p>
        )}
        {!query.trim() && (
          <p className="spotlight-hint">Start typing to search claims, evidence, categories, or file names.</p>
        )}
      </div>
    </div>
  );
}
