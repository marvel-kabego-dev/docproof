import { AREA_LABELS } from '../constants';
import { useContracts } from '../context/ContractsContext';
import type { VerificationArea } from '../types';
import TrustScoreGauge from '../components/TrustScoreGauge';

const areaOrder: VerificationArea[] = ['runtime_requirements', 'commands', 'config_env', 'api_docs'];

export default function TrustScore() {
  const { contracts, score, previousScore, summary, areaScores } = useContracts();
  return (
    <section className="page-stack">
      <div className="page-heading"><div><span className="eyebrow">Documentation confidence</span><h1>Documentation Trust Score</h1><p>A transparent summary of how many documentation claims match repository evidence.</p></div></div>
      <div className="trust-page-grid">
        <section className="panel trust-hero"><div><span className="eyebrow">Overall Trust Score</span><h2>{score >= 90 ? 'Highly verified' : score >= 75 ? 'Mostly verified' : 'Needs attention'}</h2><p>Passed claims receive full credit, warnings receive partial credit, and failed claims receive no credit. The score changes as fixes are approved and re-verified.</p></div><TrustScoreGauge score={score} previous={previousScore} /></section>
        <section className="panel before-after-score"><span className="eyebrow">Before / Current</span><div><article><span>Previous</span><strong>{previousScore}</strong><small>/100</small></article><span className="score-arrow">→</span><article><span>Current</span><strong>{score}</strong><small>/100</small></article></div><p>{summary.passed} passed · {summary.failed} failed · {summary.warnings} warning{summary.warnings === 1 ? '' : 's'} across {contracts.length} claims.</p></section>
      </div>
      <section className="dashboard-section"><div className="section-heading-row"><div><span className="eyebrow">Score breakdown</span><h2>Verification areas</h2></div></div><div className="score-breakdown-list">{areaOrder.map((area) => { const value = areaScores[area]; return <div className="panel score-breakdown-row" key={area}><strong>{AREA_LABELS[area]}</strong><div className="mini-progress"><span style={{ width: `${value}%` }} /></div><b>{value}%</b></div>; })}</div></section>
    </section>
  );
}
