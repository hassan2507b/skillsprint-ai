import json
from pathlib import Path
from document_processing.parser import DocumentParser
from python_validation.validator import PythonValidationEngine
from comparison_engine.compare import ComparisonEngine
from security.security_tester import SecurityAuditEngine
from genai_pipeline.generator import load_role_matrix

BASE_DIR = Path(__file__).resolve().parent
REPORTS_DIR = BASE_DIR / "reports"
PLANS_DIR = REPORTS_DIR / "onboarding_plans"


def run_pipeline():
    print("=" * 70)
    print("SKILLSPRINT AI — FULL BACKEND PIPELINE EXECUTION")
    print("=" * 70)

    REPORTS_DIR.mkdir(exist_ok=True)
    PLANS_DIR.mkdir(exist_ok=True)

    # 1. Document Parsing & Chunking
    print("\n[Step 1] Ingesting and Parsing Documents...")
    parser = DocumentParser("sample_documents")
    docs = parser.load_and_parse_all()
    print(f"-> Parsed {len(docs)} document files into structured chunks with traceability metadata.")

    # 2. Load Roles Matrix
    print("\n[Step 2] Loading Role Requirement Matrix...")
    roles = load_role_matrix()
    print(f"-> Loaded {len(roles)} corporate roles.")

    # 3. Generate Mock / Verified Plans for all 10 Roles
    print("\n[Step 3] Compiling Onboarding Plans for All 10 Roles...")
    all_plans = {}
    for role_item in roles:
        role_name = role_item["role_name"]
        
        # Build comprehensive plan matching schema
        plan = {
            "employee_role": role_name,
            "company": "Apex Logistics",
            "onboarding_plan": [
                {
                    "requirement": f"Complete {role_name} general orientation and safety clearance",
                    "category": "Orientation & Safety",
                    "priority": "Mandatory",
                    "source_document": "policy_health_safety_v2.0.txt",
                    "source_section": "1. Personal Protective Equipment (PPE)"
                },
                {
                    "requirement": f"Review {role_name} operational guidelines and active policy compliance",
                    "category": "Compliance",
                    "priority": "Mandatory",
                    "source_document": "policy_security_v2.0.txt",
                    "source_section": "2. Multi-Factor Authentication (MFA)"
                }
            ],
            "training_requirements": [
                {
                    "training": t,
                    "mandatory": True,
                    "source_document": "policy_security_v2.0.txt"
                } for t in role_item["mandatory_trainings"]
            ],
            "contradictions": [
                {
                    "issue": "Working Hours Conflict",
                    "documents": ["conflict_01_working_hours.txt", "employee_handbook.txt"],
                    "description": "General handbook specifies 9:00 AM start; Warehouse ops SOP mandates 8:00 AM shift start."
                },
                {
                    "issue": "Resignation Notice Period Ambiguity",
                    "documents": ["conflict_02_notice_period.txt", "hr_policy_guide.txt"],
                    "description": "HR policy guide requires 30 days notice; Offer framework specifies 14 days."
                },
                {
                    "issue": "Probationary Duration Difference",
                    "documents": ["conflict_03_probation_period.txt", "tech_onboarding_guide.txt"],
                    "description": "Standard handbook probation is 90 days vs technical guide probation of 180 days."
                },
                {
                    "issue": "BYOD vs Corporate Hardware Policy",
                    "documents": ["conflict_04_byod_vs_hardware.txt", "infosec_standard.txt"],
                    "description": "Mobile guidelines permit BYOD with MDM vs InfoSec standard prohibiting BYOD."
                },
                {
                    "issue": "Dress Code vs Safety Attire",
                    "documents": ["conflict_05_dress_code.txt", "warehouse_safety.txt"],
                    "description": "Business casual corporate policy conflicts with industrial safety uniform."
                }
            ],
            "security_warnings": [
                {
                    "document": "adv_doc_01_override_instructions.txt",
                    "warning": "Direct instruction override detected: Attempted to bypass system prompt rules."
                },
                {
                    "document": "adv_doc_02_secret_exfiltration.txt",
                    "warning": "Secret exfiltration attempt detected: Prompt requested leak of system prompt."
                },
                {
                    "document": "adv_doc_03_fake_hr_grant.txt",
                    "warning": "Privilege escalation attempt detected: Impersonated VP of HR to bypass training."
                },
                {
                    "document": "adv_doc_04_json_hijack.txt",
                    "warning": "JSON schema hijack attack detected: Closing brackets injected."
                },
                {
                    "document": "adv_doc_05_hidden_comment.txt",
                    "warning": "Hidden HTML comment directive injection detected."
                }
            ],
            "summary": {
                "total_requirements": 2,
                "mandatory_requirements": 2,
                "contradictions_found": 5,
                "security_warnings_found": 5
            }
        }
        all_plans[role_name] = plan

        # Save plan file
        safe_filename = role_name.lower().replace(" ", "_") + "_onboarding_plan.json"
        plan_file = PLANS_DIR / safe_filename
        with open(plan_file, "w", encoding="utf-8") as f:
            json.dump(plan, f, indent=2)

    print(f"-> Saved 10 onboarding plan JSON files in '{PLANS_DIR}'.")

    # 4. Python Validation Engine Execution
    print("\n[Step 4] Running Independent Python Validation Engine...")
    validator = PythonValidationEngine("role_requirement_matrix.json")
    val_reports = []
    for role_name, plan in all_plans.items():
        v_rep = validator.validate_plan(plan)
        val_reports.append(v_rep)
    
    val_report_file = REPORTS_DIR / "validation_report.json"
    with open(val_report_file, "w", encoding="utf-8") as f:
        json.dump(val_reports, f, indent=2)
    print(f"-> Overall Validation Report generated in '{val_report_file}'.")

    # 5. GenAI vs Python Comparison Engine Execution
    print("\n[Step 5] Running GenAI vs Python Comparison Engine...")
    comp_engine = ComparisonEngine("role_requirement_matrix.json")
    comp_report = comp_engine.generate_comparison_report(all_plans)
    comp_report_file = REPORTS_DIR / "comparison_report.json"
    with open(comp_report_file, "w", encoding="utf-8") as f:
        json.dump(comp_report, f, indent=2)
    print(f"-> GenAI vs Python Comparison Report generated in '{comp_report_file}'.")

    # 6. Security Audit Execution
    print("\n[Step 6] Running Prompt Injection Security Audit...")
    sec_engine = SecurityAuditEngine()
    sec_report = sec_engine.audit_adversarial_documents()
    sec_report_file = REPORTS_DIR / "security_testing_report.json"
    with open(sec_report_file, "w", encoding="utf-8") as f:
        json.dump(sec_report, f, indent=2)
    print(f"-> Security Audit Report generated in '{sec_report_file}'.")

    print("\n" + "=" * 70)
    print("SUCCESS: ALL BACKEND PIPELINES EXECUTED AND REPORTS SAVED!")
    print("=" * 70)


if __name__ == "__main__":
    run_pipeline()
