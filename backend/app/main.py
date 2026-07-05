from fastapi import FastAPI, UploadFile, File

app = FastAPI()


@app.get("/")
def home():
    return {"message": "Welcome to AI Resume Analyzer Backend"}


@app.post("/upload-resume")
async def upload_resume(file: UploadFile = File(...)):
    return {
        "filename": file.filename,
        "content_type": file.content_type
    }