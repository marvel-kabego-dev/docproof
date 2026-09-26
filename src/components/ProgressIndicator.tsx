export default function ProgressIndicator({ progress }: { progress: number }) {
  return (
    <div className="progress-block" aria-label={`Verification ${progress}% complete`}>
      <div className="progress-copy"><span>{progress}% complete</span><strong>{Math.round((progress / 100) * 17)} of 17 claims verified</strong></div>
      <div className="progress-track"><span style={{ width: `${progress}%` }} /></div>
    </div>
  );
}
