import { useState, useEffect } from "react";
import { checkPassword } from "../services/api";
import "./PasswordChecker.css";

function PasswordChecker() {
  const [password, setPassword] = useState("");
  const [result, setResult] = useState(null);
  const [progressClass, setProgressClass] = useState("");
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isChecking, setIsChecking] = useState(false);

  useEffect(() => {
    if (!result) return;
    switch (result.strength) {
      case "weak":
        setProgressClass("progress-weak");
        break;
      case "medium":
        setProgressClass("progress-medium");
        break;
      case "strong":
        setProgressClass("progress-strong");
        break;
      default:
        setProgressClass("");
    }
  }, [result]);

  async function handleCheck() {
    if (!password) {
      setError("Please enter a password first!");
      setTimeout(() => setError(null), 3000);
      return;
    }

    setIsChecking(true);
    try {
      const data = await checkPassword(password);
      setResult(data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch data from server. Check your backend.");
      setTimeout(() => setError(null), 3000);
      setResult(null);
    } finally {
      setIsChecking(false);
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleCheck();
    }
  };

  return (
    <div className="app-container">
      {error && <div className="error-banner">{error}</div>}

      <div className="header">
        <h1>Password Analyzer</h1>
        <p>Advanced security scoring powered by HaveIBeenPwned & zxcvbn</p>
      </div>

      <div className="input-section">
        <div className="input-wrapper">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Enter a password to analyze..."
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button
            className="toggle-btn"
            onClick={() => setShowPassword(!showPassword)}
            type="button"
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>
        <button className="check-btn" onClick={handleCheck} disabled={isChecking}>
          {isChecking ? "Analyzing..." : "Analyze Password"}
        </button>
      </div>

      {result && (
        <div className="result-section">
          <div className="glass-panel">
            <div className="stats-grid">
              <div className="stat-item">
                <span className="stat-label">Length</span>
                <span className="stat-value">{result.length} characters</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Entropy</span>
                <span className="stat-value">{result.entropy} bits</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Score (0-4)</span>
                <span className="stat-value">{result.score}/4</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Time to Crack</span>
                <span className="stat-value">{result.crack_time_display}</span>
              </div>
            </div>

            <div className="progress-container">
              <div className="progress-header">
                <span className="strength-label">Security Measure</span>
                <span className="stat-value" style={{ fontSize: '1.25rem' }}>{result.safety_percent}%</span>
              </div>
              <div className="progress-bar">
                <div
                  className={`progress-fill ${progressClass}`}
                  style={{ width: `${result.safety_percent}%` }}
                />
              </div>
            </div>

            {(result.warning || (result.suggestions && result.suggestions.length > 0)) && (
              <div className="feedback-section">
                {result.warning && (
                  <div className="warning-text">
                    {result.warning}
                  </div>
                )}
                {result.suggestions && result.suggestions.length > 0 && (
                  <ul className="suggestions-list">
                    {result.suggestions.map((suggestion, idx) => (
                      <li key={idx}>{suggestion}</li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            {result.breached ? (
              <div className="breach-alert">
                <span>COMPROMISED: Found in {result.count.toLocaleString()} data breaches! Do not use.</span>
              </div>
            ) : (
              <div className="safe-alert">
                <span>CLEAR: No known data breaches found.</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default PasswordChecker;
