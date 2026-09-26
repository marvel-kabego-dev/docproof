import type {
  ContractFilters,
  DocumentationContract,
  IssueBucket,
  ProjectSelection,
  VerificationArea,
  VerificationRun,
  VerificationSummary,
} from '../types.ts';

export type ContractFilter = ContractFilters['status'];

export function createFreshProjectSelection(
  branch: string,
  documentation: string[],
): ProjectSelection {
  return {
    repository: '',
    branch,
    documentation: [...documentation],
  };
}

export function computeSummary(contracts: DocumentationContract[]): VerificationSummary {
  return contracts.reduce<VerificationSummary>(
    (summary, contract) => {
      summary.total += 1;
      if (contract.status === 'pass') summary.passed += 1;
      if (contract.status === 'fail') summary.failed += 1;
      if (contract.status === 'warning') summary.warnings += 1;
      return summary;
    },
    { total: 0, passed: 0, failed: 0, warnings: 0 },
  );
}

export function computeTrustScore(contracts: DocumentationContract[]): number {
  if (contracts.length === 0) return 0;

  const earned = contracts.reduce((score, contract) => {
    if (contract.status === 'pass') return score + 1;
    if (contract.status === 'warning') return score + 0.5;
    return score;
  }, 0);

  return Math.round((earned / contracts.length) * 100);
}

export function computeAreaScores(
  contracts: DocumentationContract[],
): Record<VerificationArea, number> {
  const areas: VerificationArea[] = [
    'runtime_requirements',
    'commands',
    'config_env',
    'api_docs',
  ];

  return areas.reduce<Record<VerificationArea, number>>((scores, area) => {
    scores[area] = computeTrustScore(contracts.filter((contract) => contract.area === area));
    return scores;
  }, {
    runtime_requirements: 0,
    commands: 0,
    config_env: 0,
    api_docs: 0,
  });
}

export function filterContracts(
  contracts: DocumentationContract[],
  filtersOrStatus: ContractFilters | ContractFilter,
  legacyQuery = '',
): DocumentationContract[] {
  const filters: ContractFilters = typeof filtersOrStatus === 'string'
    ? { status: filtersOrStatus, query: legacyQuery, area: 'all', source: 'all' }
    : filtersOrStatus;

  const normalizedQuery = filters.query.trim().toLowerCase();

  return contracts.filter((contract) => {
    const matchesStatus = filters.status === 'all' || contract.status === filters.status;
    const matchesArea = filters.area === 'all' || contract.area === filters.area;
    const sourceFile = contract.source.split('#')[0];
    const matchesSource = filters.source === 'all' || sourceFile === filters.source;

    if (!matchesStatus || !matchesArea || !matchesSource) return false;
    if (!normalizedQuery) return true;

    const searchable = [
      contract.claim,
      contract.source,
      contract.area,
      contract.expected,
      contract.actual,
      contract.evidence,
      contract.suggested_fix,
    ]
      .join(' ')
      .toLowerCase();

    return searchable.includes(normalizedQuery);
  });
}

export function applyApprovedFix(
  contracts: DocumentationContract[],
  contractId: string,
): DocumentationContract[] {
  return contracts.map((contract) =>
    contract.id === contractId
      ? {
          ...contract,
          status: 'pass',
          approvalStatus: 'approved',
          approved: true,
          reverified: true,
          claim: contract.suggested_fix || contract.claim,
          expected: contract.actual,
        }
      : contract,
  );
}

export function applyRejectedFix(
  contracts: DocumentationContract[],
  contractId: string,
): DocumentationContract[] {
  return contracts.map((contract) =>
    contract.id === contractId
      ? {
          ...contract,
          approvalStatus: 'rejected',
          approved: false,
        }
      : contract,
  );
}

export function getIssueBucket(contract: DocumentationContract): IssueBucket {
  if (contract.status === 'pass' && contract.reverified && contract.approvalStatus === 'approved') return 'resolved';
  if (contract.approvalStatus === 'rejected') return 'rejected';
  if (contract.approvalStatus === 'approved' && !contract.reverified) return 'pending';
  return 'open';
}

export function createCurrentHistoryRun(
  contracts: DocumentationContract[],
  branch: string,
  commit: string,
  date: string,
): VerificationRun {
  return {
    id: `run_${Date.now()}`,
    date,
    branch,
    commit,
    trustScore: computeTrustScore(contracts),
    summary: computeSummary(contracts),
    current: true,
  };
}
