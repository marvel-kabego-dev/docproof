import test from 'node:test';
import assert from 'node:assert/strict';
import {
  applyApprovedFix,
  applyRejectedFix,
  computeAreaScores,
  computeSummary,
  computeTrustScore,
  createCurrentHistoryRun,
  createFreshProjectSelection,
  filterContracts,
  getIssueBucket,
} from './verification.ts';
import type { DocumentationContract } from '../types.ts';

const contracts: DocumentationContract[] = [
  {
    id: 'contract_1',
    area: 'runtime_requirements',
    source: 'README.md#L10',
    claim: 'Requires Node.js 18+',
    expected: 'Node.js >=18',
    actual: 'Node.js >=20',
    status: 'fail',
    evidence: 'package.json engines.node = >=20',
    evidenceFile: 'package.json',
    suggested_fix: 'Requires Node.js 20+',
    approvalStatus: 'pending',
    approved: false,
    reverified: false,
  },
  {
    id: 'contract_2',
    area: 'commands',
    source: 'README.md#L20',
    claim: 'Run npm run dev',
    expected: 'npm run dev',
    actual: 'npm run dev',
    status: 'pass',
    evidence: 'package.json scripts.dev exists',
    suggested_fix: '',
    approvalStatus: 'pending',
    approved: false,
    reverified: true,
  },
  {
    id: 'contract_3',
    area: 'config_env',
    source: 'docs/setup.md#L8',
    claim: 'PORT=3000',
    expected: 'PORT=3000',
    actual: 'PORT defaults to 3000 but can be changed',
    status: 'warning',
    evidence: '.env.example contains PORT=3000',
    suggested_fix: 'Clarify that PORT is configurable.',
    approvalStatus: 'pending',
    approved: false,
    reverified: false,
  },
  {
    id: 'contract_4',
    area: 'api_docs',
    source: 'docs/api.md#L12',
    claim: 'POST /api/users/create',
    expected: 'POST /api/users/create',
    actual: 'POST /api/users',
    status: 'fail',
    evidence: 'route is POST /api/users',
    suggested_fix: 'POST /api/users',
    approvalStatus: 'rejected',
    approved: false,
    reverified: false,
  },
];

test('computeSummary counts pass, fail, and warning contracts', () => {
  assert.deepEqual(computeSummary(contracts), {
    total: 4,
    passed: 1,
    failed: 2,
    warnings: 1,
  });
});

test('computeTrustScore gives pass full credit, warning half credit, and fail zero', () => {
  assert.equal(computeTrustScore(contracts), 38);
});

test('filterContracts combines status, text, category, and source filters', () => {
  const result = filterContracts(contracts, {
    status: 'fail',
    query: 'node',
    area: 'runtime_requirements',
    source: 'README.md',
  });
  assert.equal(result.length, 1);
  assert.equal(result[0].id, 'contract_1');
});

test('computeAreaScores returns weighted scores per verification area', () => {
  assert.deepEqual(computeAreaScores(contracts), {
    runtime_requirements: 0,
    commands: 100,
    config_env: 50,
    api_docs: 0,
  });
});

test('applyApprovedFix marks contract approved, reverified, passed and updates claim to repository truth', () => {
  const result = applyApprovedFix(contracts, 'contract_1');
  const updated = result.find((item) => item.id === 'contract_1');
  assert.equal(updated?.approvalStatus, 'approved');
  assert.equal(updated?.approved, true);
  assert.equal(updated?.reverified, true);
  assert.equal(updated?.status, 'pass');
  assert.equal(updated?.claim, 'Requires Node.js 20+');
  assert.equal(updated?.expected, 'Node.js >=20');
});

test('applyRejectedFix marks only the selected contract rejected without changing verification status', () => {
  const result = applyRejectedFix(contracts, 'contract_1');
  const updated = result.find((item) => item.id === 'contract_1');
  assert.equal(updated?.approvalStatus, 'rejected');
  assert.equal(updated?.approved, false);
  assert.equal(updated?.status, 'fail');
});

test('getIssueBucket groups failed contracts by lifecycle state', () => {
  assert.equal(getIssueBucket(contracts[0]), 'open');
  assert.equal(getIssueBucket(contracts[3]), 'rejected');
  const resolved = { ...contracts[0], status: 'pass' as const, approved: true, reverified: true, approvalStatus: 'approved' as const };
  assert.equal(getIssueBucket(resolved), 'resolved');
});

test('createCurrentHistoryRun snapshots current score and summary', () => {
  const run = createCurrentHistoryRun(contracts, 'main', 'demo-001', 'Now');
  assert.equal(run.branch, 'main');
  assert.equal(run.commit, 'demo-001');
  assert.equal(run.trustScore, 38);
  assert.deepEqual(run.summary, computeSummary(contracts));
  assert.equal(run.current, true);
});


test('createFreshProjectSelection clears the repository and keeps safe defaults for a new verification', () => {
  const defaults = ['README.md', 'docs/setup.md'];
  const project = createFreshProjectSelection('main', defaults);
  assert.deepEqual(project, { repository: '', branch: 'main', documentation: defaults });
  assert.notEqual(project.documentation, defaults);
});
