import { Navigate, Route, Routes } from 'react-router-dom';
import AppShell from './components/AppShell';
import ApproveReject from './pages/ApproveReject';
import ContractDetail from './pages/ContractDetail';
import Contracts from './pages/Contracts';
import Dashboard from './pages/Dashboard';
import History from './pages/History';
import Issues from './pages/Issues';
import ProjectSetup from './pages/ProjectSetup';
import Reverified from './pages/Reverified';
import TrustScore from './pages/TrustScore';
import VerificationRunning from './pages/VerificationRunning';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<ProjectSetup />} />
      <Route path="/verify" element={<VerificationRunning />} />
      <Route element={<AppShell />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/contracts" element={<Contracts />} />
        <Route path="/contracts/:id" element={<ContractDetail />} />
        <Route path="/contracts/:id/fix" element={<ApproveReject />} />
        <Route path="/contracts/:id/reverified" element={<Reverified />} />
        <Route path="/issues" element={<Issues />} />
        <Route path="/trust-score" element={<TrustScore />} />
        <Route path="/history" element={<History />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
