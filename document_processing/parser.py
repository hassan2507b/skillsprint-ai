import os
import re
from pathlib import Path

try:
    import docx
except ImportError:
    docx = None

try:
    import pdfplumber
except ImportError:
    pdfplumber = None


class DocumentParser:
    """
    Handles document ingestion, parsing, chunking, and traceability metadata extraction
    for policy documents (TXT, PDF, DOCX).
    """

    def __init__(self, documents_dir):
        self.documents_dir = Path(documents_dir)

    def validate_file(self, file_path):
        path = Path(file_path)
        if not path.exists():
            return False, f"File not found: {path}"
        if path.stat().st_size == 0:
            return False, f"File is empty: {path}"
        allowed = {".txt", ".pdf", ".docx"}
        if path.suffix.lower() not in allowed:
            return False, f"Unsupported file type: {path.suffix}"
        return True, "Valid"

    def parse_txt(self, file_path):
        path = Path(file_path)
        content = path.read_text(encoding="utf-8", errors="ignore")
        return self._extract_metadata(path, content)

    def parse_pdf(self, file_path):
        path = Path(file_path)
        content = ""
        if pdfplumber:
            try:
                with pdfplumber.open(path) as pdf:
                    content = "\n".join([page.extract_text() or "" for page in pdf.pages])
            except Exception as e:
                print(f"Error reading PDF {path.name}: {e}")
        else:
            content = f"PDF Parser unavailable for {path.name}"
        return self._extract_metadata(path, content)

    def parse_docx(self, file_path):
        path = Path(file_path)
        content = ""
        if docx:
            try:
                doc = docx.Document(path)
                content = "\n".join([p.text for p in doc.paragraphs if p.text])
            except Exception as e:
                print(f"Error reading DOCX {path.name}: {e}")
        else:
            content = f"DOCX Parser unavailable for {path.name}"
        return self._extract_metadata(path, content)

    def _extract_metadata(self, path, content):
        doc_id_match = re.search(r"Document ID:\s*([A-Za-z0-9\-_]+)", content, re.IGNORECASE)
        version_match = re.search(r"Version:\s*([0-9\.]+)", content, re.IGNORECASE)
        section_match = re.search(r"Section:\s*([^\n]+)", content, re.IGNORECASE)

        doc_id = doc_id_match.group(1) if doc_id_match else path.stem
        version = version_match.group(1) if version_match else ("2.0" if "v2.0" in path.name else "1.0")
        section = section_match.group(1).strip() if section_match else "General Policy"

        return {
            "file_name": path.name,
            "doc_id": doc_id,
            "version": version,
            "section": section,
            "content": content
        }

    def chunk_document(self, parsed_doc, chunk_size=2000):
        content = parsed_doc["content"]
        chunks = []
        raw_chunks = [p.strip() for p in content.split("\n\n") if p.strip()]

        for idx, chunk_text in enumerate(raw_chunks, 1):
            chunks.append({
                "chunk_id": f"{parsed_doc['doc_id']}_C{idx}",
                "doc_id": parsed_doc["doc_id"],
                "file_name": parsed_doc["file_name"],
                "version": parsed_doc["version"],
                "section": parsed_doc["section"],
                "content": chunk_text
            })

        return chunks

    def load_and_parse_all(self):
        parsed_docs = []
        if not self.documents_dir.exists():
            return parsed_docs

        for ext in ["*.txt", "*.pdf", "*.docx"]:
            for file_path in sorted(self.documents_dir.glob(ext)):
                valid, msg = self.validate_file(file_path)
                if valid:
                    if file_path.suffix.lower() == ".txt":
                        parsed_docs.append(self.parse_txt(file_path))
                    elif file_path.suffix.lower() == ".pdf":
                        parsed_docs.append(self.parse_pdf(file_path))
                    elif file_path.suffix.lower() == ".docx":
                        parsed_docs.append(self.parse_docx(file_path))
                else:
                    print(f"Skipping {file_path.name}: {msg}")

        return parsed_docs


if __name__ == "__main__":
    parser = DocumentParser("sample_documents")
    docs = parser.load_and_parse_all()
    print(f"Parsed {len(docs)} documents successfully.")

