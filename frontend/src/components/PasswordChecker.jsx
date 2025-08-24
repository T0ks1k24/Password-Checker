import { useState, useEffect } from "react";
import { checkPassword } from "../services/api";
import "./PasswordChecker.css";

function PasswordChecker() {
  const [password, setPassword] = useState("");
  const [result, setResult] = useState(null);
  const [progressClass, setProgressClass] = useState("");
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

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
      setError("⚠️ Please enter a password first!");
      return;
    }

    try {
      const data = await checkPassword(password);
      setResult(data);
      setError(null);
    } catch (err) {
      setError("❌ Failed to fetch data from server. Check your backend.");
      setResult(null);
    }
  }

  return (
    <div className="app-container">
      {error && <div className="error-banner">{error}</div>}

      <div className="header">
        <h1>🔐 Password Analyzer</h1>
        <p>Check how strong and secure your password is</p>
      </div>

      <div className="input-section">
        <div className="input-wrapper">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password..."
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            className="toggle-btn"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>
        <button className="check-btn" onClick={handleCheck}>
          Check Password
        </button>
      </div>

      {result && (
        <div className="result-section">
          <div className="stats-block">
            <h2>📊 Stats</h2>
            <p><b>Length:</b> {result.length}</p>
            <p><b>Entropy:</b> {result.entropy}</p>
            <p><b>Safety:</b> {result.safety_percent}%</p>
            <div className="progress-bar">
              <div
                className={`progress-fill ${progressClass}`}
                style={{ width: `${result.safety_percent}%` }}
              />
            </div>
          </div>

          <div className="result-block">
            <h2>⚡ Strength</h2>
            <p className={`strength-text ${result.strength}`}>
              {result.strength.toUpperCase()}
            </p>
            {result.breached ? (
              <p className="breached">
                ❌ Found in data breaches ({result.count} times)
              </p>
            ) : (
              <p className="safe">✅ Not found in data breaches</p>
            )}
            <small>💡 Tip: Mix letters, numbers & symbols</small>
          </div>
        </div>
      )}
    </div>
  );
}

export default PasswordChecker;
