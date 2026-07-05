import { useState } from "react";

function Home() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // API response states
  const [skills, setSkills] = useState<string[]>([]);
  const [atsScore, setAtsScore] = useState<number | null>(null);
  const [jobScore, setJobScore] = useState<number | null>(null);
  const [missingSkills, setMissingSkills] = useState<string[]>([]);

  const uploadResume = async () => {
    if (!selectedFile) {
      setError("Please select a resume first.");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await fetch("http://127.0.0.1:8000/upload-resume", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setSkills(data.skills || []);
        setAtsScore(data.ats_score);
        setJobScore(data.job_match_score);
        setMissingSkills(data.missing_skills || []);
        setError("");
      } else {
        setError("Upload failed!");
      }
    } catch (err) {
      setError("Server error. Please try again.");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 px-6 py-10 flex flex-col items-center">

      {/* HEADER */}
      <h1 className="text-5xl font-extrabold text-blue-700">
        🤖 AI Resume Analyzer
      </h1>

      <p className="mt-3 text-gray-600 text-lg">
        Upload your resume and get AI-powered insights instantly
      </p>

      {/* UPLOAD BOX */}
      <div className="mt-8 bg-white p-6 rounded-2xl shadow-xl w-full max-w-xl">

        <label
          htmlFor="resume"
          className="cursor-pointer block text-center bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700"
        >
          📄 Choose Resume
        </label>

        <input
          id="resume"
          type="file"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (!file) return;

            setSelectedFile(file);
            setError("");
          }}
        />

        {/* Selected File */}
        {selectedFile && (
          <p className="mt-3 text-green-600 text-center font-medium">
            ✅ {selectedFile.name}
          </p>
        )}

        {/* Upload Button */}
        <button
          onClick={uploadResume}
          className="mt-4 w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700"
        >
          {loading ? (
            <span className="animate-pulse">Analyzing Resume...</span>
          ) : (
            "⬆️ Upload Resume"
          )}
        </button>

        {/* Error */}
        {error && (
          <p className="mt-3 text-red-600 text-center">{error}</p>
        )}
      </div>

      {/* DASHBOARD TITLE */}
      {(atsScore !== null || skills.length > 0) && (
        <h2 className="mt-10 text-2xl font-bold text-gray-700">
          📊 Resume Analysis Dashboard
        </h2>
      )}

      {/* DASHBOARD */}
      {(atsScore !== null || skills.length > 0) && (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-5xl">

          {/* ATS SCORE CARD */}
          <div className="bg-white p-6 rounded-2xl shadow-xl text-center">
            <h2 className="text-xl font-bold text-gray-700">ATS Score</h2>

            <div className="relative w-32 h-32 mx-auto mt-4">
              <div className="w-full h-full rounded-full border-8 border-blue-100"></div>

              <div
                className="absolute top-0 left-0 w-full h-full rounded-full border-8 border-blue-600"
                style={{
                  clipPath: `inset(${100 - (atsScore || 0)}% 0 0 0)`
                }}
              ></div>

              <div className="absolute inset-0 flex items-center justify-center text-2xl font-bold text-blue-700">
                {atsScore}
              </div>
            </div>
          </div>

          {/* JOB MATCH */}
          <div className="bg-white p-6 rounded-2xl shadow-xl text-center">
            <h2 className="text-xl font-bold text-gray-700">Job Match</h2>

            <div className="w-full bg-gray-200 rounded-full h-3 mt-6">
              <div
                className="bg-green-500 h-3 rounded-full"
                style={{ width: `${jobScore || 0}%` }}
              ></div>
            </div>

            <p className="mt-2 text-lg font-semibold text-green-600">
              {jobScore}% Match
            </p>
          </div>

          {/* SKILLS */}
          <div className="bg-white p-6 rounded-2xl shadow-xl">
            <h2 className="text-xl font-bold text-gray-700 mb-3">Skills Found</h2>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, i) => (
                <span
                  key={i}
                  className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* MISSING SKILLS */}
          <div className="bg-white p-6 rounded-2xl shadow-xl">
            <h2 className="text-xl font-bold text-gray-700 mb-3">Missing Skills</h2>
            <div className="flex flex-wrap gap-2">
              {missingSkills.map((skill, i) => (
                <span
                  key={i}
                  className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

        </div>
      )}

    </div>
  );
}

export default Home;