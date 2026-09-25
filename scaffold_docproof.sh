#!/usr/bin/env bash
# DocProof — repo scaffold script (v2)
# Run this FROM THE ROOT of your already-cloned "docproof" repo
# (the folder that contains backend/, bob_sessions/, docs/, frontend/, sample_repo/).
# It only creates missing folders/files inside them — it will NOT touch
# README.md, LICENSE, important.env, important.gitignore, or docker-compose.yml
# since those already exist at the root.
#
# Safe to re-run: existing files are left untouched (touch does not overwrite content).

set -e

echo "Populating DocProof folders in $(pwd) ..."

# ---------- bob_sessions (REQUIRED for submission) ----------
mkdir -p bob_sessions
touch bob_sessions/.gitkeep
if [ ! -f bob_sessions/README.md ]; then
cat > bob_sessions/README.md << 'EOF'
# bob_sessions

Screenshots of IBM Bob IDE Task Session Summaries go here (Bob IDE chat -> Tasks -> task header).
Name them clearly, e.g. docproof_task01_agent_setup_summary.png

Required checkpoints (see sprint plan):
- task01: first Bob task (Agent mode / subagent setup) - Sprint 2
- task02: Runtime requirements verification - Sprint 2
- task03: Commands verification - Sprint 2
- task04: Config/Env verification - Sprint 3
- task05: API docs verification - Sprint 3
- task06: Fix suggestion task - Sprint 4
- task07: Re-verification after approval - Sprint 4
- task08: Full end-to-end pipeline run - Sprint 5
EOF
fi

# ---------- backend ----------
mkdir -p backend/app/api
mkdir -p backend/app/core
mkdir -p backend/app/orchestration/subagents
mkdir -p backend/app/verification
mkdir -p backend/app/fixes
mkdir -p backend/app/storage
mkdir -p backend/tests

touch backend/requirements.txt
touch backend/Dockerfile
touch backend/app/__init__.py
touch backend/app/main.py

touch backend/app/api/__init__.py
touch backend/app/api/contracts.py
touch backend/app/api/verify.py
touch backend/app/api/fix.py
touch backend/app/api/approve.py
touch backend/app/api/trust_score.py

touch backend/app/core/__init__.py
touch backend/app/core/config.py
touch backend/app/core/models.py

touch backend/app/orchestration/__init__.py
touch backend/app/orchestration/agent_coordinator.py
touch backend/app/orchestration/parallel_runner.py
touch backend/app/orchestration/subagents/__init__.py
touch backend/app/orchestration/subagents/runtime_agent.py
touch backend/app/orchestration/subagents/commands_agent.py
touch backend/app/orchestration/subagents/config_env_agent.py
touch backend/app/orchestration/subagents/api_docs_agent.py

touch backend/app/verification/__init__.py
touch backend/app/verification/doc_parser.py
touch backend/app/verification/evidence_builder.py
touch backend/app/verification/trust_score.py

touch backend/app/fixes/__init__.py
touch backend/app/fixes/fix_generator.py
touch backend/app/fixes/approval_flow.py

touch backend/app/storage/__init__.py
touch backend/app/storage/db.py
touch backend/app/storage/repository.py

touch backend/tests/__init__.py
touch backend/tests/test_runtime_agent.py
touch backend/tests/test_commands_agent.py
touch backend/tests/test_config_env_agent.py
touch backend/tests/test_api_docs_agent.py
touch backend/tests/test_trust_score.py

# ---------- frontend ----------
mkdir -p frontend/public
mkdir -p frontend/src/pages
mkdir -p frontend/src/components
mkdir -p frontend/src/api
mkdir -p frontend/src/styles

touch frontend/package.json
touch frontend/Dockerfile
touch frontend/src/App.tsx

touch frontend/src/pages/Dashboard.tsx
touch frontend/src/pages/ContractDetail.tsx
touch frontend/src/pages/TrustScore.tsx
touch frontend/src/pages/ApproveReject.tsx

touch frontend/src/components/ContractCard.tsx
touch frontend/src/components/EvidencePanel.tsx
touch frontend/src/components/TrustScoreGauge.tsx
touch frontend/src/components/DiffViewer.tsx

touch frontend/src/api/client.ts
touch frontend/src/styles/.gitkeep

# ---------- sample_repo (demo target with deliberately outdated docs) ----------
mkdir -p sample_repo/docs
mkdir -p sample_repo/src
touch sample_repo/README.md
touch sample_repo/.env.example
touch sample_repo/docs/.gitkeep
touch sample_repo/src/.gitkeep

# ---------- docproof's own project docs ----------
mkdir -p docs
touch docs/architecture.md
touch docs/documentation_contract_spec.md
touch docs/submission_checklist.md
touch docs/demo_script.md

echo "Done. Run 'git status' to see the new files, then commit and push."
echo "Tip: 'find . -type f -not -path \"./.git/*\" | sort' to review everything."
