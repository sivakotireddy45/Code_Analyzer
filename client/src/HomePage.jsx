import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import {
  FaChartLine,
  FaLightbulb,
  FaBookOpen,
  FaSun,
  FaMoon,
  FaCode,
} from "react-icons/fa";
import axios from "axios";

const HomePage = () => {
  const [code, setCode] = useState("");
  const [result, setResult] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem("darkMode") === "true";
  });

  const [level, setLevel] = useState(() => {
    return localStorage.getItem("level") || "Beginner";
  });
  const [language, setLanguage] = useState(
    localStorage.getItem("language") || "Java"
  );

  axios.defaults.withCredentials = true;
  axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;
  const handleCodeChange = (e) => setCode(e.target.value);

  const handleLevelChange = (e) => {
    const selectedLevel = e.target.value;
    setLevel(selectedLevel);
    localStorage.setItem("level", selectedLevel);
  };

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
    localStorage.setItem("language", e.target.value);
  };

  const getResult = async (action) => {
    if (!code.trim()) return;
    setIsLoading(true);
    try {

      const response = await axios.post("/api/get-data", {
        code,
        type: action,
        level,
        language,
      });
      setResult(response.data.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      setResult("❌ Failed to fetch data from server.");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleTheme = () => {
    setIsDarkMode((prev) => {
      localStorage.setItem("darkMode", !prev);
      return !prev;
    });
  };

  return (
    <div
      className={`min-vh-100 d-flex justify-content-center align-items-center pt-3 ${
        isDarkMode ? "text-light" : "text-dark"
      }`}
      style={{
        background: isDarkMode
          ? "linear-gradient(135deg, #0f2027, #203a43, #2c5364)"
          : "linear-gradient(135deg, #8ec5fc, #e0c3fc)",
        transition: "all 0.5s ease",
      }}
    >
      <div
        className="p-5 rounded-4 shadow-lg"
        style={{
          width: "90%",
          maxWidth: "1100px",
          background: "rgba(255, 255, 255, 0.15)",
          backdropFilter: "blur(10px)",
          border: isDarkMode
            ? "1px solid rgba(255,255,255,0.2)"
            : "1px solid rgba(0,0,0,0.1)",
          color: isDarkMode ? "#fff" : "#000",
          fontFamily: "Poppins, sans-serif",
          boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
          transition: "all 0.5s ease",
        }}
      >
        <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-2">
          <h2 className="fw-bold">
            <FaCode className="me-2" /> Code Analyzer
          </h2>

          <div className="d-flex align-items-center gap-3 flex-nowrap">
            <select
            value={language}
            onChange={handleLanguageChange}
            className="form-select"
            style={{
              backgroundColor: isDarkMode ? "#3a3b3c" : "",
              color: isDarkMode ? "#f1f1f1" : "",
              border: isDarkMode ? "1px solid #555" : "",
             
            }}
          >
            <option value="C++">C++</option>
            <option value="C#">C#</option>
            <option value="Go">Go</option>
            <option value="Java">Java</option>
            <option value="JavaScript">JavaScript</option>
            <option value="Python">Python</option>
            
          </select>

          <select
            value={level}
            onChange={handleLevelChange}
            className="form-select"
            style={{
              backgroundColor: isDarkMode ? "#3a3b3c" : "",
              color: isDarkMode ? "#f1f1f1" : "",
              border: isDarkMode ? "1px solid #555" : "",
              
            }}
          >
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
          <button className="btn btn-outline-light" onClick={toggleTheme}>
            {isDarkMode ? <FaSun /> : <FaMoon />}
          </button>
          </div>
        </div>
        

        <textarea
          className={`form-control mb-4 ${
            isDarkMode ? "bg-dark text-white" : ""
          }`}
          placeholder="Paste your code here..."
          rows="16"
          value={code}
          onChange={handleCodeChange}
          style={{ fontFamily: "monospace", fontSize: "0.9rem" }}
        ></textarea>

        <div className="d-flex gap-3 flex-wrap mb-4">
          <button
            className="btn custom-btn-analyze animate-btn"
            onClick={() => getResult("analyze")}
            disabled={!code || isLoading}
          >
            <FaChartLine /> Analyze
          </button>

          <button
            className="btn custom-btn-optimize animate-btn"
            onClick={() => getResult("optimize")}
            disabled={!code || isLoading}
          >
            <FaLightbulb /> Optimize
          </button>

          <button
            className="btn custom-btn-explain animate-btn"
            onClick={() => getResult("explain")}
            disabled={!code || isLoading}
          >
            <FaBookOpen /> Explain
          </button>
        </div>

        {isLoading && (
          <div className="text-center py-3">
            <div className="spinner-border text-primary" role="status"></div>
            <p className="mt-2">Processing...</p>
          </div>
        )}

        {result && (
          <div
            className={`p-3 rounded ${
              isDarkMode ? "bg-dark text-white" : "bg-light text-dark"
            }`}
            style={{ whiteSpace: "pre-wrap" }}
          >
            <div className={`mt-2 ${isDarkMode ? "text-white" : "text-dark"}`}>
              <ReactMarkdown>{result}</ReactMarkdown>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
