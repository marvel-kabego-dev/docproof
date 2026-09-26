import { useEffect, useState } from 'react';
import { Navigate, Outlet, useNavigate } from 'react-router-dom';
import { useContracts } from '../context/ContractsContext';
import Sidebar from './Sidebar';
import SpotlightSearch from './SpotlightSearch';
import ToastStack from './ToastStack';
import TopBar from './TopBar';

export default function AppShell() {
  const navigate = useNavigate();
  const { project, summary, lastVerifiedLabel, startVerification, startNewRepository } = useContracts();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [spotlightOpen, setSpotlightOpen] = useState(false);
  if (!project.repository) return <Navigate to="/" replace />;
  const repoLabel = project.repository ? project.repository.replace(/\/$/, '').split('/').pop() || 'repository' : 'No repository';

  function handleVerify() {
    startVerification();
    navigate('/verify');
  }

  function handleNewRepository() {
    startNewRepository();
    navigate('/');
  }

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSpotlightOpen((open) => !open);
      }
    }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  return (
    <div className="app-shell">
      <Sidebar repositoryLabel={repoLabel} branch={project.branch} issueCount={summary.failed + summary.warnings} open={mobileOpen} onClose={() => setMobileOpen(false)} />
      <div className="app-workspace">
        <TopBar repository={project.repository} branch={project.branch} lastVerified={lastVerifiedLabel} onVerify={handleVerify} onNewRepository={handleNewRepository} onMenu={() => setMobileOpen(true)} onSearch={() => setSpotlightOpen(true)} />
        <main className="app-main page-fade"><Outlet /></main>
      </div>
      {spotlightOpen && <SpotlightSearch onClose={() => setSpotlightOpen(false)} />}
      <ToastStack />
    </div>
  );
}
