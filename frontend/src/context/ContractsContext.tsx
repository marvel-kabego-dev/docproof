import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import {
  DEFAULT_BRANCH,
  DEFAULT_DOCUMENTATION,
  DEMO_REPOSITORY,
} from '../constants';
import { initialContracts, initialHistory } from '../data/mockData';
import type {
  DocumentationContract,
  ProjectSelection,
  VerificationRun,
  VerificationSummary,
} from '../types';
import {
  applyApprovedFix,
  applyRejectedFix,
  computeAreaScores,
  computeSummary,
  computeTrustScore,
  createCurrentHistoryRun,
  createFreshProjectSelection,
} from '../utils/verification';

type VerificationMode = 'idle' | 'running' | 'complete' | 'error';

interface ContractsContextValue {
  contracts: DocumentationContract[];
  project: ProjectSelection;
  history: VerificationRun[];
  verificationMode: VerificationMode;
  lastVerifiedLabel: string;
  score: number;
  previousScore: number;
  summary: VerificationSummary;
  areaScores: ReturnType<typeof computeAreaScores>;
  setProject: (project: ProjectSelection) => void;
  useDemoProject: () => void;
  startVerification: () => void;
  finishVerification: () => void;
  failVerification: () => void;
  approveContract: (contractId: string) => void;
  rejectContract: (contractId: string) => void;
  completeReverification: (contractId: string) => void;
  getContract: (contractId?: string) => DocumentationContract | undefined;
  resetDemo: () => void;
  startNewRepository: () => void;
}

const ContractsContext = createContext<ContractsContextValue | undefined>(undefined);

const defaultProject: ProjectSelection = createFreshProjectSelection(DEFAULT_BRANCH, DEFAULT_DOCUMENTATION);

export function ContractsProvider({ children }: { children: ReactNode }) {
  const [contracts, setContracts] = useState<DocumentationContract[]>(initialContracts);
  const [project, setProject] = useState<ProjectSelection>(defaultProject);
  const [history, setHistory] = useState<VerificationRun[]>(initialHistory);
  const [verificationMode, setVerificationMode] = useState<VerificationMode>('idle');
  const [previousScore, setPreviousScore] = useState(72);
  const [lastVerifiedLabel, setLastVerifiedLabel] = useState('Not verified yet');

  const summary = useMemo(() => computeSummary(contracts), [contracts]);
  const score = useMemo(() => computeTrustScore(contracts), [contracts]);
  const areaScores = useMemo(() => computeAreaScores(contracts), [contracts]);

  const useDemoProject = useCallback(() => {
    setProject({
      repository: DEMO_REPOSITORY,
      branch: DEFAULT_BRANCH,
      documentation: [...DEFAULT_DOCUMENTATION],
    });
  }, []);

  const startVerification = useCallback(() => {
    setVerificationMode('running');
  }, []);

  const finishVerification = useCallback(() => {
    setVerificationMode('complete');
    setLastVerifiedLabel('Just now');
    const run = createCurrentHistoryRun(contracts, project.branch || DEFAULT_BRANCH, 'demo-verify', 'Just now');
    setHistory((current) => [run, ...current.map((item) => ({ ...item, current: false }))]);
  }, [contracts, project.branch]);

  const failVerification = useCallback(() => {
    setVerificationMode('error');
  }, []);

  const approveContract = useCallback((contractId: string) => {
    setContracts((current) => current.map((contract) => (
      contract.id === contractId
        ? { ...contract, approvalStatus: 'approved', approved: true, reverified: false }
        : contract
    )));
  }, []);

  const rejectContract = useCallback((contractId: string) => {
    setContracts((current) => applyRejectedFix(current, contractId));
  }, []);

  const completeReverification = useCallback((contractId: string) => {
    const beforeScore = computeTrustScore(contracts);
    const updated = applyApprovedFix(contracts, contractId);
    const run = createCurrentHistoryRun(updated, project.branch || DEFAULT_BRANCH, 'demo-fix', 'Just now');
    setPreviousScore(beforeScore);
    setContracts(updated);
    setHistory((historyCurrent) => [run, ...historyCurrent.map((item) => ({ ...item, current: false }))]);
    setLastVerifiedLabel('Just now');
  }, [contracts, project.branch]);

  const getContract = useCallback(
    (contractId?: string) => contracts.find((contract) => contract.id === contractId),
    [contracts],
  );


  const startNewRepository = useCallback(() => {
    setContracts(initialContracts);
    setHistory([]);
    setVerificationMode('idle');
    setPreviousScore(computeTrustScore(initialContracts));
    setLastVerifiedLabel('Not verified yet');
    setProject(createFreshProjectSelection(DEFAULT_BRANCH, DEFAULT_DOCUMENTATION));
  }, []);

  const resetDemo = useCallback(() => {
    setContracts(initialContracts);
    setHistory(initialHistory);
    setVerificationMode('idle');
    setPreviousScore(72);
    setLastVerifiedLabel('Not verified yet');
    setProject({
      repository: DEMO_REPOSITORY,
      branch: DEFAULT_BRANCH,
      documentation: [...DEFAULT_DOCUMENTATION],
    });
  }, []);

  const value = useMemo<ContractsContextValue>(() => ({
    contracts,
    project,
    history,
    verificationMode,
    lastVerifiedLabel,
    score,
    previousScore,
    summary,
    areaScores,
    setProject,
    useDemoProject,
    startVerification,
    finishVerification,
    failVerification,
    approveContract,
    rejectContract,
    completeReverification,
    getContract,
    resetDemo,
    startNewRepository,
  }), [
    contracts,
    project,
    history,
    verificationMode,
    lastVerifiedLabel,
    score,
    previousScore,
    summary,
    areaScores,
    useDemoProject,
    startVerification,
    finishVerification,
    failVerification,
    approveContract,
    rejectContract,
    completeReverification,
    getContract,
    resetDemo,
    startNewRepository,
  ]);

  return <ContractsContext.Provider value={value}>{children}</ContractsContext.Provider>;
}

export function useContracts() {
  const context = useContext(ContractsContext);
  if (!context) throw new Error('useContracts must be used within ContractsProvider');
  return context;
}
