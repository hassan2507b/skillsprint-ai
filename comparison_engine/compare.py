import json
from pathlib import Path
from python_validation.validator import PythonValidationEngine


class ComparisonEngine:
    """
    GenAI vs Python Comparison Engine. Compares AI outputs against Python rule evaluation
    and generates comprehensive requirement-level metrics.
    """

    def __init__(self, matrix_path="role_requirement_matrix.json"):
        self.validator = PythonValidationEngine(matrix_path)

    def generate_comparison_report(self, ai_plans_dict):
        report_summary = []

        for role, plan in ai_plans_dict.items():
            validation_res = self.validator.validate_plan(plan)

            comparison_row = {
                "role": role,
                "genai_total_requirements": plan.get("summary", {}).get("total_requirements", 0),
                "genai_mandatory_requirements": plan.get("summary", {}).get("mandatory_requirements", 0),
                "python_coverage_score": validation_res["coverage_score"],
                "python_traceability_score": validation_res["traceability_score"],
                "contradictions_found_by_ai": plan.get("summary", {}).get("contradictions_found", 0),
                "security_warnings_found_by_ai": plan.get("summary", {}).get("security_warnings_found", 0),
                "validation_status": validation_res["status"],
                "missing_trainings": validation_res["missing_mandatory_trainings"]
            }
            report_summary.append(comparison_row)

        return {
            "title": "SkillSprint AI vs Python Engine Comparison Report",
            "total_roles_evaluated": len(report_summary),
            "comparison_details": report_summary
        }


if __name__ == "__main__":
    engine = ComparisonEngine()
    print("Comparison Engine ready.")
