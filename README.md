# SkillSprint AI — Generative AI PowerPlay

> **TechWiz7 / Aptech 72-Hour Competition Project**  
> **Team:** hassan2507b  
> **Repository:** [https://github.com/hassan2507b/skillsprint-ai.git](https://github.com/hassan2507b/skillsprint-ai.git)

---

## 🚀 What This Project Does

**SkillSprint AI** ingests company policy documents, SOPs, and role specifications to automatically generate personalized, structured employee onboarding plans, checklists, training requirements, and safety guidelines — then **independently verifies the AI output using an autonomous Python Validation Engine**.

### Key System Capabilities:
- **Document Parsing & Traceability:** Ingests policies, extracts versioning metadata, and chunks text with Document IDs and Sections.
- **Realistic Document Complexity:** Evaluated against **10 policy version pairs (v1.0 vs v2.0)** and **10 conflicting/ambiguous policy cases**.
- **Adversarial Prompt Injection Defense:** Tested against **10 adversarial injection vectors** (jailbreaks, secret exfiltration, JSON hijacks, privilege escalation).
- **Dual Pipeline Verification:** Combines GenAI structured JSON output generation with an independent **Python Rule Validation Engine** calculating Coverage Score % and Traceability Score %.

---

## 🛠️ Tech Stack & Architecture

- **Primary Language:** Python 3.12
- **GenAI LLM Integration:** Google Gemini API (`gemini-3.6-flash`)
- **Document Parsing:** Standard & Structured Regex Document Ingestor
- **Validation Engine:** Rule-Based Python Evaluation Engine
- **Data Schemas:** JSON Schema validation (`schemas/onboarding_plan_schema.json`)
- **Security Audit:** Adversarial Security Engine (`security/security_tester.py`)

---

## 📁 Repository Structure

```text
skillsprint-ai/
├── README.md                           # Master Project Overview & Guide
├── AI_USAGE.md                         # Official AI Tool Usage Log
├── requirements.txt                    # Python Dependencies List
├── LICENSE                             # MIT Open Source License
├── .env.example                        # Environment Variables Template
├── .gitignore                          # Git Exclusion Rules
├── validate_requirements.py            # Master Checklist Verification Script
├── run_full_pipeline.py                # End-to-End Pipeline Execution Script
├── role_requirement_matrix.json        # Role Requirement Matrix (JSON)
├── role_requirement_matrix.csv         # Role Requirement Matrix (Spreadsheet)
├── document_processing/
│   └── parser.py                       # Document Ingestion, Parsing & Chunking
├── genai_pipeline/
│   └── generator.py                    # Gemini GenAI Onboarding Plan Generator
├── python_validation/
│   └── validator.py                    # Independent Python Rule Validation Engine
├── comparison_engine/
│   └── compare.py                      # GenAI vs Python Comparison Engine
├── security/
│   └── security_tester.py              # Prompt Injection Audit Engine
├── prompt_templates/
│   └── onboarding_prompt.txt           # Versioned GenAI Prompt Template
├── schemas/
│   └── onboarding_plan_schema.json     # JSON Output Schema Definition
├── sample_documents/                   # 40 Complex Policy Documents
│   ├── conflict_01_working_hours.txt ... conflict_10_data_classification.txt
│   ├── policy_leave_v1.0.txt ... policy_leave_v2.0.txt (10 Version Pairs)
│   └── adv_doc_01_override_instructions.txt ... adv_doc_10_payload_flood.txt
├── reports/                            # Generated Output & Audit Reports
│   ├── onboarding_plans/               # 10 Role Onboarding Plan JSON Files
│   ├── validation_report.json          # Overall Validation Report
│   ├── comparison_report.json          # GenAI vs Python Comparison Report
│   └── security_testing_report.json    # Prompt Injection Security Report
└── documentation/                      # Submission Documentation
    ├── PROJECT_REPORT.md               # Complete Project & Architecture Report
    ├── SECURITY_REPORT.md              # Detailed Security Testing Report
    ├── INSTALLATION.md                 # Setup & Installation Guide
    ├── EXECUTION.md                    # Pipeline Execution Guide
    └── TECHNICAL_BLOG.md               # 2,000+ Word Technical Deep Dive Blog
```

---

## ⚡ Quick Start

### 1. Installation
```powershell
# Clone the repository
git clone https://github.com/hassan2507b/skillsprint-ai.git
cd skillsprint-ai

# Activate Virtual Environment (if applicable)
.\venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

### 2. Configure Environment
Copy `.env.example` to `.env` and add your Gemini API key:
```env
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-3.6-flash
```

### 3. Run Pipeline Execution
```powershell
# Run backend pipeline (Parsing -> Generation -> Validation -> Comparison -> Security Audit)
python run_full_pipeline.py

# Verify Competition Master Checklist Requirements
python validate_requirements.py
```

---

## 📄 Documentation Links
- 📘 [PROJECT_REPORT.md](documentation/PROJECT_REPORT.md) — System Architecture, Problem & Solution
- 🛡️ [SECURITY_REPORT.md](documentation/SECURITY_REPORT.md) — Prompt Injection Defense Audit
- 📝 [TECHNICAL_BLOG.md](documentation/TECHNICAL_BLOG.md) — 2,000+ Word Technical Deep-Dive
- 🤖 [AI_USAGE.md](AI_USAGE.md) — Transparency & AI Tool Usage Log
- 💻 [INSTALLATION.md](documentation/INSTALLATION.md) — Detailed Setup Steps
- ⚙️ [EXECUTION.md](documentation/EXECUTION.md) — Pipeline Command Reference
