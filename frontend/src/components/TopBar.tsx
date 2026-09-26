import Icon from './Icon';

export default function TopBar({
  repository,
  branch,
  lastVerified,
  onVerify,
  onNewRepository,
  onMenu,
  onSearch,
}: {
  repository: string;
  branch: string;
  lastVerified: string;
  onVerify: () => void;
  onNewRepository: () => void;
  onMenu: () => void;
  onSearch: () => void;
}) {
  const repoName = repository ? repository.replace(/\/$/, '').split('/').pop() : 'No repository';
  return (
    <header className="topbar">
      <button className="menu-button" onClick={onMenu} aria-label="Open navigation"><span /><span /><span /></button>
      <div className="topbar-project"><Icon name="github" size={15} /><strong>{repoName}</strong><span>/</span><span>{branch || 'main'}</span></div>
      <div className="topbar-actions">
        <button className="topbar-search-btn" onClick={onSearch} aria-label="Search contracts (Ctrl+K)">
          <Icon name="search" size={14} />
          <span className="topbar-search-hint">Search</span>
          <kbd>⌘K</kbd>
        </button>
        <span className="last-verified"><Icon name="clock" size={14} /> Last verified: {lastVerified}</span>
        <button className="button button-secondary compact topbar-new-repo" onClick={onNewRepository}><Icon name="github" size={14} /> Verify Another Repository</button>
        <button className="button button-primary compact" onClick={onVerify}><Icon name="refresh" size={14} /> Run Verification</button>
      </div>
    </header>
  );
}
