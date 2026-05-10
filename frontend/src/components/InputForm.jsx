import { useState } from "react";

const NEIGHBOURHOODS = [
"Parkdale", "East York", "Scarborough", "Kensington Market",
"North York", "Etobicoke", "Leslieville", "Mississauga",
];

const COMFORT_COLOR = {
GREEN:  "#22c55e",
YELLOW: "#f59e0b",
RED:    "#ef4444",
};

const RISK_COLOR = { LOW: "#22c55e", MEDIUM: "#f59e0b", HIGH: "#ef4444" };

export default function InputForm({ onAnalyze, onCompare, loading }) {
const [mode, setMode] = useState("analyze"); // "analyze" | "afford"
const [income, setIncome] = useState("");
const [neighbourhood, setNeighbourhood] = useState("");
const [naturalText, setNaturalText] = useState("");
const [watsonLoading, setWatsonLoading] = useState(false);

// Reverse calculator state
const [budget, setBudget] = useState("");
const [affordResults, setAffordResults] = useState(null);
const [affordLoading, setAffordLoading] = useState(false);

const handleWatsonParse = async () => {
  if (!naturalText) return;
  setWatsonLoading(true);
  try {
    const res = await fetch("http://127.0.0.1:5000/watson-analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: naturalText }),
    });
    const data = await res.json();
    if (data.extracted_income) setIncome(String(data.extracted_income));
    if (data.extracted_neighbourhood) setNeighbourhood(data.extracted_neighbourhood);
    alert(`✨ Watson extracted: $${data.extracted_income?.toLocaleString()} income, ${data.extracted_neighbourhood} neighbourhood`);
  } catch (err) {
    console.error(err);
    alert("Watson connection failed — is Flask running?");
  } finally {
    setWatsonLoading(false);
  }
};

const handleSubmit = () => {
  if (!income || !neighbourhood) { alert("Please fill in both fields."); return; }
  onAnalyze({ income: parseFloat(income), neighbourhood });
};

const handleCompareAll = () => {
  if (!income) { alert("Please enter your annual income first."); return; }
  onCompare(parseFloat(income));
};

const handleAfford = async () => {
  if (!budget) { alert("Please enter your monthly budget."); return; }
  setAffordLoading(true);
  setAffordResults(null);
  try {
    const res = await fetch("http://127.0.0.1:5000/afford", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ monthly_budget: parseFloat(budget) }),
    });
    const data = await res.json();
    setAffordResults(data);
  } catch (err) {
    alert("Could not connect to backend. Make sure Flask is running.");
    console.error(err);
  } finally {
    setAffordLoading(false);
  }
};

return (
  <div className="form-page">
    <div className="hero">
    <h1 className="form-hero-title">
        What's the <span className="accent">true cost</span><br />of where you live?
      </h1>
      <p className="hero-sub">
      </p>
    </div>

    {/* ── Mode Toggle ── */}
    <div className="mode-toggle">
      <button
        className={`mode-btn ${mode === "analyze" ? "mode-active" : ""}`}
        onClick={() => { setMode("analyze"); setAffordResults(null); }}
      >
        🔍 Analyze a Neighbourhood
      </button>
      <button
        className={`mode-btn ${mode === "afford" ? "mode-active" : ""}`}
        onClick={() => { setMode("afford"); setAffordResults(null); }}
      >
        💰 What Can I Afford?
      </button>
    </div>

    {/* ── Analyze Mode ── */}
    {mode === "analyze" && (
      <>
        {/* Watson Box */}
        <div className="form-card" style={{ marginBottom: "16px" }}>
          <div className="form-group">
            <label className="form-label">Describe your situation</label>
            <div style={{ display: "flex", gap: "12px" }}>
              <input
                className="form-input"
                placeholder='e.g. "I make 60k and want to live in Scarborough"'
                value={naturalText}
                onChange={(e) => setNaturalText(e.target.value)}
              />
              <button
                className="btn btn-primary"
                onClick={handleWatsonParse}
                disabled={watsonLoading}
                style={{ whiteSpace: "nowrap" }}
              >
                {watsonLoading ? "Analyzing..." : "Auto-fill →"}
              </button>
            </div>
            <span className="form-hint">IBM Watson NLU reads your input and fills the form automatically</span>
          </div>
        </div>

        {/* Manual Form */}
        <div className="form-card">
          <div className="form-group">
            <label className="form-label">Annual Income (CAD)</label>
            <input
              className="form-input"
              type="number"
              placeholder="e.g. 58000"
              value={income}
              onChange={(e) => setIncome(e.target.value)}
              min="0"
            />
            <span className="form-hint">Your gross annual salary before tax</span>
          </div>
          <div className="form-group">
            <label className="form-label">Target Neighbourhood</label>
            <select
              className="form-input"
              value={neighbourhood}
              onChange={(e) => setNeighbourhood(e.target.value)}
            >
              <option value="">— Select a neighbourhood —</option>
              {NEIGHBOURHOODS.map((n) => <option key={n} value={n}>{n}</option>)}
            </select>
            <span className="form-hint">Where are you thinking of living?</span>
          </div>
          <div className="form-actions">
            <button className="btn btn-primary" onClick={handleSubmit} disabled={loading}>
              {loading ? "Analyzing..." : "Analyze Neighbourhood →"}
            </button>
            <button className="btn btn-secondary" onClick={handleCompareAll} disabled={loading}>
              {loading ? "Loading..." : "Compare All Neighbourhoods"}
            </button>
          </div>
        </div>
      </>
    )}

    {/* ── Afford Mode ── */}
    {mode === "afford" && (
      <>
        <div className="form-card">
          <div className="form-group">
            <label className="form-label">Maximum Monthly Budget (CAD)</label>
            <input
              className="form-input"
              type="number"
              placeholder="e.g. 2000"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              min="0"
            />
            <span className="form-hint">
              Total you can spend per month on rent + transit combined
            </span>
          </div>
          <div className="form-actions">
            <button
              className="btn btn-primary"
              onClick={handleAfford}
              disabled={affordLoading}
            >
              {affordLoading ? "Calculating..." : "Show What I Can Afford →"}
            </button>
          </div>
        </div>

        {/* Afford Results */}
        {affordResults && (
          <div className="afford-results">
            <div className="afford-summary">
              <span className="afford-summary-text">
                With a <strong>${Number(affordResults.monthly_budget).toLocaleString()}/mo</strong> budget —
              </span>
              <span className="afford-count" style={{ color: affordResults.affordable_count > 0 ? "#22c55e" : "#ef4444" }}>
                {affordResults.affordable_count} neighbourhood{affordResults.affordable_count !== 1 ? "s" : ""} fit your budget
              </span>
            </div>

            <div className="afford-list">
              {affordResults.results.map((r) => (
                <div
                  key={r.neighbourhood}
                  className="afford-row"
                  style={{ borderLeft: `3px solid ${COMFORT_COLOR[r.comfort_color]}` }}
                  onClick={() => r.fits_budget && onAnalyze({ income: budget * 12, neighbourhood: r.neighbourhood })}
                >
                  <div className="afford-row-left">
                    <span className="afford-name">{r.neighbourhood}</span>
                    <span className="afford-meta">
                      {r.avg_commute_mins} min commute · Walk {r.walk_score}/100 ·
                      <span style={{ color: RISK_COLOR[r.gentrify_risk] }}> {r.gentrify_risk} gentrify risk</span>
                    </span>
                  </div>
                  <div className="afford-row-right">
                    <span className="afford-cost">${r.total_monthly_cost.toLocaleString()}/mo</span>
                    <span
                      className="afford-comfort"
                      style={{ color: COMFORT_COLOR[r.comfort_color] }}
                    >
                      {r.comfort}
                      {r.fits_budget
                        ? ` · $${Math.abs(r.budget_gap)} under budget`
                        : ` · $${Math.abs(r.budget_gap)} over budget`}
                    </span>
                  </div>
                  {r.fits_budget && (
                    <span className="afford-view">View full report →</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </>
    )}

  </div>
);
}