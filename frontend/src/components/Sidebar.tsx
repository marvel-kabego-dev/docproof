import { NavLink } from 'react-router-dom';
import { AREA_SHORT_LABELS } from '../constants';
import type { VerificationArea } from '../types';
import Icon from './Icon';

const areaLinks: { area: VerificationArea; label: string }[] = [
  { area: 'runtime_requirements', label: AREA_SHORT_LABELS.runtime_requirements },
  { area: 'commands', label: AREA_SHORT_LABELS.commands },
  { area: 'config_env', label: AREA_SHORT_LABELS.config_env },
  { area: 'api_docs', label: AREA_SHORT_LABELS.api_docs },
];

export default function Sidebar({
  repositoryLabel,
  branch,
  issueCount,
  open,
  onClose,
}: {
  repositoryLabel: string;
  branch: string;
  issueCount: number;
  open: boolean;
  onClose: () => void;
}) {
  const navClass = ({ isActive }: { isActive: boolean }) => `sidebar-link${isActive ? ' active' : ''}`;

  return (
    <>
      {open && <button className="sidebar-scrim" onClick={onClose} aria-label="Close navigation" />}
      <aside className={`sidebar${open ? ' open' : ''}`}>
        <div className="sidebar-brand"><span className="brand-mark"><Icon name="shield" size={17} /></span><div><strong>DocProof</strong><span>Documentation verification</span></div></div>
        <div className="project-block"><span className="sidebar-label">PROJECT</span><strong title={repositoryLabel}>{repositoryLabel}</strong><span><Icon name="branch" size={12} /> {branch || 'main'}</span></div>
        <nav className="sidebar-nav" aria-label="Primary navigation">
          <NavLink to="/dashboard" className={navClass} onClick={onClose}><Icon name="dashboard" size={17} /> Overview</NavLink>
          <div className="sidebar-group">
            <NavLink to="/contracts" className={navClass} onClick={onClose}><Icon name="contracts" size={17} /> Verification</NavLink>
            <div className="sidebar-subnav">
              {areaLinks.map(({ area, label }) => <NavLink key={area} to={`/contracts?area=${area}`} onClick={onClose}>{label}</NavLink>)}
            </div>
          </div>
          <NavLink to="/issues" className={navClass} onClick={onClose}><Icon name="wrench" size={17} /> Issues & Fixes {issueCount > 0 && <span className="nav-count">{issueCount}</span>}</NavLink>
          <NavLink to="/trust-score" className={navClass} onClick={onClose}><Icon name="shield" size={17} /> Trust Score</NavLink>
          <NavLink to="/history" className={navClass} onClick={onClose}><Icon name="history" size={17} /> History</NavLink>
        </nav>
        <div className="sidebar-footer"><button disabled title="Settings are outside the hackathon MVP."><Icon name="settings" size={16} /> Settings <span>MVP</span></button></div>
      </aside>
    </>
  );
}
