import { useState } from "react";
function Home() {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [error, setError] = useState("");
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex flex-col items-center justify-center px-6">
      <h1 className="text-5xl md:text-6xl font-extrabold text-blue-700 text-center">
        🤖 AI Resume Analyzer
      </h1>

      <p className="mt-6 max-w-2xl text-center text-xl text-gray-600">
        Upload your resume and get an ATS score instantly.
      </p>

      <div className="mt-10 rounded-2xl bg-white p-8 shadow-xl">
        <h2 className="mb-4 text-2xl font-bold">Upload Your Resume</h2>
        <label
  htmlFor="resume"
  className="cursor-pointer rounded-xl bg-blue-600 px-8 py-4 text-lg font-semibold text-white shadow-lg transition hover:scale-105 hover:bg-blue-700"
>
          📄 Upload Resume
        </label>
       <input
  id="resume"
  type="file"
  className="hidden"
  onChange={(event) => {
    const file = event.target.files?.[0];

if (!file) return;
const allowedTypes = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

if (!allowedTypes.includes(file.type)) {
  setError("❌ Please upload only PDF, DOC, or DOCX files.");
  setSelectedFile(null);
  return;
}

setError("");
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    }
  }}
/>
{selectedFile && (
  <p className="mt-4 text-green-600 font-medium">
    ✅ {selectedFile.name}
  </p>
)}
{error && (
  <p className="mt-4 text-red-600 font-medium">
    {error}
  </p>
)}
      </div>
    </div>
  );
}

export default Home;