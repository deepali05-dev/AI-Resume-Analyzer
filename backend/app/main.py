from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import fitz  # PyMuPDF

app = FastAPI()

# -----------------------------
# CORS CONFIG
# -----------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -----------------------------
# HOME ROUTE
# -----------------------------
@app.get("/")
def home():
    return {"message": "AI Resume Analyzer Backend Running"}

# -----------------------------
# SKILL EXTRACTION
# -----------------------------
def extract_skills(text: str):
    skills = [
        "python", "java", "javascript", "react", "node", "fastapi",
        "django", "flask", "sql", "machine learning", "deep learning",
        "html", "css", "git", "docker", "aws"
    ]

    found_skills = []
    text_lower = text.lower()

    for skill in skills:
        if skill in text_lower:
            found_skills.append(skill)

    return found_skills

# -----------------------------
# ATS SCORE ENGINE
# -----------------------------
def calculate_ats_score(text: str, skills: list):
    score = 0
    text_lower = text.lower()

    # Skill weight
    score += len(skills) * 12

    # Section detection
    sections = ["experience", "projects", "education", "skills"]
    for sec in sections:
        if sec in text_lower:
            score += 10

    # Length check
    words = len(text.split())
    if words > 800:
        score += 20
    elif words > 400:
        score += 10

    # Keyword quality
    keywords = ["developed", "built", "created", "implemented", "designed"]
    score += sum(3 for k in keywords if k in text_lower)

    return min(score, 100)

# -----------------------------
# JOB MATCHING ENGINE
# -----------------------------
def match_job_description(resume_text: str, job_text: str):
    resume_text = resume_text.lower()
    job_text = job_text.lower()

    job_keywords = [
        "python", "react", "node", "fastapi", "django",
        "sql", "aws", "docker", "machine learning"
    ]

    matched = []
    missing = []

    for skill in job_keywords:
        if skill in resume_text and skill in job_text:
            matched.append(skill)
        elif skill in job_text:
            missing.append(skill)

    score = int((len(matched) / len(job_keywords)) * 100)

    return score, matched, missing

# -----------------------------
# MAIN API
# -----------------------------
@app.post("/upload-resume")
async def upload_resume(file: UploadFile = File(...)):
    contents = await file.read()

    # Read PDF
    doc = fitz.open(stream=contents, filetype="pdf")

    text = ""
    for page in doc:
        text += page.get_text()

    # AI PROCESSING
    skills = extract_skills(text)
    ats_score = calculate_ats_score(text, skills)

    job_score, matched, missing = match_job_description(text, "")

    return {
        "filename": file.filename,
        "text": text[:500],
        "skills": skills,
        "ats_score": ats_score,
        "job_match_score": job_score,
        "matched_skills": matched,
        "missing_skills": missing
    }