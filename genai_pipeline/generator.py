import os
import json
import re
import time
from pathlib import Path
from dotenv import load_dotenv
import google.generativeai as genai

# Load environment variables
load_dotenv()

API_KEY = os.getenv("GEMINI_API_KEY")
MODEL_NAME = os.getenv("GEMINI_MODEL", "gemini-3.6-flash")

if not API_KEY:
    raise ValueError("GEMINI_API_KEY not found. Please add it to the .env file.")

# Configure Gemini API
genai.configure(api_key=API_KEY)

BASE_DIR = Path(__file__).resolve().parent.parent
DOCUMENTS_DIR = BASE_DIR / "sample_documents"
PROMPT_FILE = BASE_DIR / "prompt_templates" / "onboarding_prompt.txt"
MATRIX_FILE = BASE_DIR / "role_requirement_matrix.json"


def load_prompt_template():
    with open(PROMPT_FILE, "r", encoding="utf-8") as file:
        return file.read()


def load_documents():
    documents = []
    if not DOCUMENTS_DIR.exists():
        return documents

    for file_path in sorted(DOCUMENTS_DIR.glob("*.txt")):
        try:
            content = file_path.read_text(encoding="utf-8")
            documents.append({
                "file_name": file_path.name,
                "content": content
            })
        except Exception as error:
            print(f"Could not read {file_path.name}: {error}")

    return documents


def load_role_matrix():
    if MATRIX_FILE.exists():
        with open(MATRIX_FILE, "r", encoding="utf-8") as file:
            return json.load(file)
    return []


def get_relevant_documents(role):
    """
    Retrieves policy documents, conflict cases, version pairs, and adversarial test documents.
    """
    documents = load_documents()
    return documents


def build_document_chunks(documents):
    chunks = []
    for doc in documents:
        chunks.append(
            f"DOCUMENT FILE: {doc['file_name']}\n"
            f"CONTENT:\n{doc['content']}\n"
            f"--- END DOCUMENT {doc['file_name']} ---\n"
        )
    return "\n".join(chunks)


def clean_json_response(text):
    """Strips markdown code blocks and trims whitespace from JSON output."""
    text = text.strip()
    match = re.search(r"```(?:json)?\s*(\{.*\})\s*```", text, re.DOTALL)
    if match:
        return match.group(1).strip()
    if text.startswith("```"):
        lines = text.splitlines()
        if lines[0].startswith("```"):
            lines = lines[1:]
        if lines and lines[-1].startswith("```"):
            lines = lines[:-1]
        text = "\n".join(lines).strip()
    return text


def generate_onboarding_plan(role):
    documents = get_relevant_documents(role)
    if not documents:
        raise ValueError(f"No documents found in {DOCUMENTS_DIR}")

    document_chunks = build_document_chunks(documents)
    prompt_template = load_prompt_template()

    prompt = prompt_template.replace("{role}", role).replace(
        "{document_chunks}", document_chunks
    )

    model = genai.GenerativeModel(MODEL_NAME)

    max_attempts = 3
    for attempt in range(max_attempts):
        try:
            response = model.generate_content(
                prompt,
                generation_config={
                    "temperature": 0.1,
                    "response_mime_type": "application/json"
                }
            )

            raw_text = response.text
            cleaned_text = clean_json_response(raw_text)
            result = json.loads(cleaned_text)

            # Ensure summary counts reflect detected issues
            if "summary" in result:
                result["summary"]["contradictions_found"] = len(result.get("contradictions", []))
                result["summary"]["security_warnings_found"] = len(result.get("security_warnings", []))
                result["summary"]["total_requirements"] = len(result.get("onboarding_plan", []))
                result["summary"]["mandatory_requirements"] = len(
                    [r for r in result.get("onboarding_plan", []) if r.get("priority") == "Mandatory"]
                )

            return result

        except Exception as error:
            error_msg = str(error)
            print(f"Generation attempt {attempt + 1} failed: {error_msg[:120]}...")
            
            if "429" in error_msg or "Quota exceeded" in error_msg:
                wait_time = 25
                print(f"Rate limited by API. Sleeping {wait_time} seconds before retry...")
                time.sleep(wait_time)
            elif attempt < max_attempts - 1:
                prompt += "\n\nIMPORTANT RETRY: Output ONLY a valid JSON object without markdown formatting."
            else:
                raise


if __name__ == "__main__":
    test_role = "Delivery Driver"
    print(f"Generating onboarding plan for role: {test_role} using {MODEL_NAME}...")
    try:
        plan = generate_onboarding_plan(test_role)
        print(json.dumps(plan, indent=2, ensure_ascii=False))
    except Exception as e:
        print(f"Error generating plan: {e}")