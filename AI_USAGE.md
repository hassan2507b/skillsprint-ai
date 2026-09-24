# SkillSprint AI — AI Tool Usage Log

| AI Tool | Purpose | Prompt/Assistance Type | File/Module Affected | Modification Made | Test Performed | Verified By |
|---|---|---|---|---|---|---|
| Antigravity AI | Code Refactoring & API Migration | "Fix model deprecation and add 429 backoff retry" | `genai_pipeline/generator.py` | Updated model to `gemini-3.6-flash` and added exponential backoff | Ran `generator.py` test | hassan2507b |
| Antigravity AI | Data Dataset Generation | "Create 10 policy version pairs v1.0 and v2.0" | `sample_documents/policy_*_v1.0.txt` | Generated 20 versioned policy files | Inspected file content | hassan2507b |
| Antigravity AI | Conflicting Case Setup | "Create 10 document conflict cases" | `sample_documents/conflict_*.txt` | Generated 10 conflicting policy cases | Verified with `validate_requirements.py` | hassan2507b |
| Antigravity AI | Adversarial Test Suite | "Create 10 prompt injection test documents" | `sample_documents/adv_doc_*.txt` | Created 10 prompt injection files | Ran `security_tester.py` | hassan2507b |
| Antigravity AI | Role Matrix Construction | "Build 10-role requirement matrix in JSON & CSV" | `role_requirement_matrix.json`, `csv` | Created JSON and CSV matrices | Validated JSON schema | hassan2507b |
| Antigravity AI | Python Validation Engine | "Build independent Python validation rule engine" | `python_validation/validator.py` | Implemented coverage & traceability scoring | Executed `validator.py` | hassan2507b |
| Antigravity AI | Comparison Engine | "Build GenAI vs Python comparison engine" | `comparison_engine/compare.py` | Implemented metric comparison reporting | Executed `compare.py` | hassan2507b |
| Antigravity AI | Full Pipeline Orchestrator | "Create master pipeline execution script" | `run_full_pipeline.py` | Built end-to-end execution script | Executed `run_full_pipeline.py` | hassan2507b |
