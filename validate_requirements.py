import json
import csv
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent
DOCS_DIR = BASE_DIR / "sample_documents"
JSON_MATRIX = BASE_DIR / "role_requirement_matrix.json"
CSV_MATRIX = BASE_DIR / "role_requirement_matrix.csv"


def validate():
    print("=" * 70)
    print("SKILLSPRINT REQUIREMENT VALIDATION REPORT")
    print("=" * 70)

    # 1. Conflicting / Ambiguous Cases
    conflicts = list(DOCS_DIR.glob("conflict_*.txt"))
    print(f"\n[1] Conflicting/Ambiguous Document Cases: Found {len(conflicts)}")
    for f in sorted(conflicts):
        print(f"    - {f.name}")
    assert len(conflicts) >= 10, f"Expected at least 10 conflicting cases, found {len(conflicts)}"

    # 2. Policy Version Changes (old v1.0 vs new v2.0)
    v1_files = list(DOCS_DIR.glob("*_v1.0.txt"))
    v2_files = list(DOCS_DIR.glob("*_v2.0.txt"))
    print(f"\n[2] Policy Version Changes (Pairs): Found {len(v1_files)} v1.0 and {len(v2_files)} v2.0 files")
    for f1, f2 in zip(sorted(v1_files), sorted(v2_files)):
        print(f"    - Old: {f1.name}  <===>  New: {f2.name}")
    assert len(v1_files) >= 10 and len(v2_files) >= 10, "Expected at least 10 policy version pairs"

    # 3. Adversarial / Prompt-Injection Test Documents
    adv_files = list(DOCS_DIR.glob("adv_doc_*.txt"))
    print(f"\n[3] Adversarial / Prompt-Injection Test Docs: Found {len(adv_files)}")
    for f in sorted(adv_files):
        print(f"    - {f.name}")
    assert len(adv_files) >= 10, f"Expected at least 10 adversarial test documents, found {len(adv_files)}"

    # 4. Role Requirement Matrix (JSON & CSV)
    print(f"\n[4] Role Requirement Matrix Verification:")
    assert JSON_MATRIX.exists(), "role_requirement_matrix.json missing!"
    assert CSV_MATRIX.exists(), "role_requirement_matrix.csv missing!"

    with open(JSON_MATRIX, "r", encoding="utf-8") as f:
        matrix_data = json.load(f)
    
    print(f"    - JSON Matrix: {len(matrix_data)} roles defined.")
    assert len(matrix_data) >= 10, "Expected at least 10 roles in matrix"

    with open(CSV_MATRIX, "r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        csv_rows = list(reader)
    print(f"    - CSV Spreadsheet Matrix: {len(csv_rows)} rows defined.")
    assert len(csv_rows) >= 10, "Expected at least 10 CSV rows"

    print("\n" + "=" * 70)
    print("SUCCESS: ALL REQUIREMENTS FULLY MET & VERIFIED!")
    print("=" * 70)


if __name__ == "__main__":
    validate()
