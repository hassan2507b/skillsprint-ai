import json
from pathlib import Path


class PythonValidationEngine:
    """
    Independent Python Validation Engine that evaluates GenAI onboarding plans
    against the authoritative Role Requirement Matrix.
    """

    def __init__(self, matrix_path):
        self.matrix_path = Path(matrix_path)
        self.matrix = self._load_matrix()

    def _load_matrix(self):
        if self.matrix_path.exists():
            with open(self.matrix_path, "r", encoding="utf-8") as f:
                return json.load(f)
        return []

    def get_role_expectations(self, role_name):
        for role_data in self.matrix:
            if role_data["role_name"].lower() == role_name.lower():
                return role_data
        return None

    def validate_plan(self, ai_plan_json):
        role_name = ai_plan_json.get("employee_role", "")
        role_expected = self.get_role_expectations(role_name)

        onboarding_plan = ai_plan_json.get("onboarding_plan", [])
        training_requirements = ai_plan_json.get("training_requirements", [])
        contradictions = ai_plan_json.get("contradictions", [])
        security_warnings = ai_plan_json.get("security_warnings", [])

        # 1. Coverage Score Calculation
        total_expected_trainings = len(role_expected.get("mandatory_trainings", [])) if role_expected else 1
        covered_trainings = 0
        ai_training_names = [t.get("training", "").lower() for t in training_requirements]

        if role_expected:
            for expected in role_expected.get("mandatory_trainings", []):
                if any(expected.lower() in t_name for t_name in ai_training_names):
                    covered_trainings += 1
        
        coverage_score = round((covered_trainings / max(1, total_expected_trainings)) * 100, 2)

        # 2. Traceability Score Calculation
        items_with_source = 0
        total_items = len(onboarding_plan) + len(training_requirements)

        for item in onboarding_plan:
            if item.get("source_document") and item.get("source_document") != "Unknown":
                items_with_source += 1

        for item in training_requirements:
            if item.get("source_document") and item.get("source_document") != "Unknown":
                items_with_source += 1

        traceability_score = round((items_with_source / max(1, total_items)) * 100, 2)

        # 3. Detect Missing / Duplicate / Unsupported Requirements
        missing_trainings = []
        if role_expected:
            for req in role_expected.get("mandatory_trainings", []):
                if not any(req.lower() in t_name for t_name in ai_training_names):
                    missing_trainings.append(req)

        # 4. Final Status Assignment
        if coverage_score >= 80 and len(contradictions) >= 5 and len(security_warnings) >= 5:
            status = "Verified with High Vigilance"
        elif len(security_warnings) > 0:
            status = "Warning - Security Directives Flagged"
        else:
            status = "Requires Manual Review"

        validation_report = {
            "role_evaluated": role_name,
            "status": status,
            "coverage_score": f"{coverage_score}%",
            "traceability_score": f"{traceability_score}%",
            "metrics": {
                "total_onboarding_items": len(onboarding_plan),
                "total_trainings_found": len(training_requirements),
                "expected_trainings_count": total_expected_trainings,
                "covered_trainings_count": covered_trainings,
                "contradictions_detected": len(contradictions),
                "security_warnings_flagged": len(security_warnings)
            },
            "missing_mandatory_trainings": missing_trainings,
            "active_policy_precedence": role_expected.get("conflict_precedence_rules", "") if role_expected else "N/A",
            "adversarial_defense_summary": role_expected.get("adversarial_protection", "") if role_expected else "N/A"
        }

        return validation_report


if __name__ == "__main__":
    validator = PythonValidationEngine("role_requirement_matrix.json")
    print("Python Validation Engine initialized.")
