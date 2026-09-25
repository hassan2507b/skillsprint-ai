import json
from pathlib import Path
from document_processing.parser import DocumentParser
from python_validation.validator import PythonValidationEngine
from comparison_engine.compare import ComparisonEngine
from security.security_tester import SecurityAuditEngine
from genai_pipeline.generator import load_role_matrix, generate_onboarding_plan

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

    # 3. Generate Verified Plans for all 10 Roles
    print("\n[Step 3] Compiling Onboarding Plans for All 10 Roles...")
    all_plans = {}
    for role_item in roles:
        role_name = role_item["role_name"]
        print(f"   - Processing Role: {role_name}...")
        plan = generate_onboarding_plan(role_name)
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

