import { useEffect, useMemo, useRef, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { AREA_LABELS } from '../constants';
import { useContracts } from '../context/ContractsContext';
import type { VerificationArea, VerificationAreaProgress } from '../types';
import Icon from '../components/Icon';
import ProgressIndicator from '../components/ProgressIndicator';
import VerificationAreaCard from '../components/VerificationAreaCard';

const steps = [8, 18, 31, 47, 63, 78, 91, 100];
const areas: VerificationArea[] = ['runtime_requirements', 'commands', 'config_env', 'api_docs'];

export default function VerificationRunning() {
  const navigate = useNavigate();
  const { project, verificationMode, startVerification, finishVerification } = useContracts();
  const [progress, setProgress] = useState(6);
  const finished = useRef(false);

  useEffect(() => {
    if (!project.repository) return;
    if (verificationMode === 'idle') {
      startVerification();
      return;
    }
    if (verificationMode !== 'running') return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let index = 0;
    const timer = window.setInterval(() => {
      index += 1;
      const next = steps[Math.min(index, steps.length - 1)];
      setProgress(next);
      if (next >= 100 && !finished.current) {
        finished.current = true;
        window.clearInterval(timer);
        finishVerification();
        window.setTimeout(() => navigate('/dashboard', { replace: true }), reduced ? 120 : 650);
      }
    }, reduced ? 80 : 430);
    return () => window.clearInterval(timer);
  }, [finishVerification, navigate, project.repository, startVerification, verificationMode]);

  const areaProgress = useMemo<VerificationAreaProgress[]>(() => areas.map((area, index) => {
    const thresholds = [22, 42, 62, 82];
    const completeAt = [42, 62, 82, 100];
    const status = progress >= completeAt[index] ? 'complete' : progress >= thresholds[index] ? 'running' : 'pending';
    return { area, label: AREA_LABELS[area], status };
  }), [progress]);

  if (!project.repository) return <Navigate to="/" replace />;
  if (verificationMode === 'error') {
    return (
      <main className="verification-page">
        <header className="verification-header"><div className="setup-brand small"><span className="brand-mark"><Icon name="shield" size={16} /></span><span>DocProof</span></div><span>{project.branch}</span></header>
        <section className="verification-content">
          <section className="panel verification-error"><span className="error-mark"><Icon name="warning" size={22} /></span><h1>Verification Incomplete</h1><p>Some checks could not be completed, so DocProof will not calculate a final Trust Score for this run.</p><div className="error-checks"><span>Runtime Requirements <b>✓</b></span><span>Project Commands <b>✓</b></span><span>Environment & Configuration <b>✕</b></span><span>API Documentation <b>✕</b></span></div><button className="button button-primary" onClick={startVerification}>Retry Failed Checks</button></section>
        </section>
      </main>
    );
  }

  const repoName = project.repository.replace(/\/$/, '').split('/').pop();
  return (
    <main className="verification-page">
      <header className="verification-header"><div className="setup-brand small"><span className="brand-mark"><Icon name="shield" size={16} /></span><span>DocProof</span></div><span>{repoName} / {project.branch}</span></header>
      <section className="verification-content">
        <div className="verification-title"><span className="live-dot" /><div><h1>Verifying Documentation</h1><p>DocProof is checking documentation claims against repository evidence.</p></div></div>
        <ProgressIndicator progress={progress} />

        <section className="workflow-stage-list panel">
          <div className={progress >= 8 ? 'complete' : 'active'}><span><Icon name="check" size={14} /></span><div><strong>Understanding Documentation</strong><small>Extracting verifiable technical claims from selected files.</small></div></div>
          <div className={progress >= 88 ? 'complete' : progress >= 18 ? 'active' : ''}><span><Icon name={progress >= 88 ? 'check' : 'refresh'} size={14} /></span><div><strong>Verifying Repository Claims</strong><small>Comparing claims against code, configuration, and routes.</small></div></div>
          <div className={progress >= 96 ? 'complete' : progress >= 88 ? 'active' : ''}><span><Icon name={progress >= 96 ? 'check' : 'code'} size={14} /></span><div><strong>Generating Evidence</strong><small>Building evidence-backed Documentation Contracts.</small></div></div>
          <div className={progress >= 100 ? 'complete' : progress >= 96 ? 'active' : ''}><span><Icon name={progress >= 100 ? 'check' : 'shield'} size={14} /></span><div><strong>Calculating Trust Score</strong><small>Summarizing verification results across all four areas.</small></div></div>
        </section>

        <div className="verification-area-grid">{areaProgress.map((item) => <VerificationAreaCard key={item.area} item={item} />)}</div>
        <p className="verification-note">Demo mode uses deterministic verification results so the hackathon walkthrough is repeatable.</p>
      </section>
    </main>
  );
}
