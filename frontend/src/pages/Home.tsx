import { useState } from "react";

function Home() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState("");

  const uploadResume = async () => {
    if (!selectedFile) {
      setError("Please select a resume first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await fetch("http://127.0.0.1:8000/upload-resume", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      console.log("Backend Response:", data);

      if (response.ok) {
        alert(`Uploaded Successfully: ${data.filename}`);
        setError("");
      } else {
        setError("Upload failed!");
      }
    } catch (err) {
      setError("Server error. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex flex-col items-center justify-center px-6">
      
      <h1 className="text-5xl md:text-6xl font-extrabold text-blue-700 text-center">
        🤖 AI Resume Analyzer
      </h1>

      <p className="mt-6 max-w-2xl text-center text-xl text-gray-600">
        Upload your resume and get an ATS score instantly.
      </p>

      <div className="mt-10 rounded-2xl bg-white p-8 shadow-xl">
        
        <h2 className="mb-4 text-2xl font-bold">
          Upload Your Resume
        </h2>

        {/* Upload Button */}
        <label
          htmlFor="resume"
          className="cursor-pointer rounded-xl bg-blue-600 px-8 py-4 text-lg font-semibold text-white shadow-lg transition hover:scale-105 hover:bg-blue-700"
        >
          📄 Upload Resume
        </label>

        {/* Hidden File Input */}
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
            setSelectedFile(file);
          }}
        />

        {/* Upload to backend button */}
        <button
          onClick={uploadResume}
          className="mt-4 rounded-xl bg-green-600 px-8 py-4 text-lg font-semibold text-white shadow-lg transition hover:bg-green-700"
        >
          ⬆️ Upload Resume
        </button>

        {/* Selected file */}
        {selectedFile && (
          <p className="mt-4 text-green-600 font-medium">
            ✅ {selectedFile.name}
          </p>
        )}

        {/* Error message */}
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