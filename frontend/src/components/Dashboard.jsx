import { useState, useEffect } from "react";

const SCORE_LABEL = (score) => {
 if (score >= 75) return { label: "Great Deal", color: "#22c55e" };
 if (score >= 55) return { label: "Fair Deal", color: "#f59e0b" };
 if (score >= 35) return { label: "Risky Choice", color: "#f97316" };
 return { label: "Poor Value", color: "#ef4444" };
};

const RISK_COLOR = { LOW: "#22c55e", MEDIUM: "#f59e0b", HIGH: "#ef4444" };

export default function Dashboard({ results, onBack, onCompare }) {
 const scoreInfo = SCORE_LABEL(results.citytax_score);
 const [statcan, setStatcan] = useState(null);

 const [torontoData, setTorontoData] = useState(null);

 useEffect(() => {
   // Fetch StatCan data
   fetch(`https://realroot-api.onrender.com/statcan/${results.neighbourhood}`)
     .then((res) => res.json())
     .then((data) => setStatcan(data))
     .catch((err) => console.error("StatCan fetch error:", err));

   // Fetch Toronto Open Data
   fetch(`https://realroot-api.onrender.com/toronto-data/${results.neighbourhood}`)
     .then((res) => res.json())
     .then((data) => setTorontoData(data))
     .catch((err) => console.error("Toronto data fetch error:", err));
 }, [results.neighbourhood]);

 return (
   <div className="dashboard">
     <button className="back-btn" onClick={onBack}>← Back</button>

     <h2 className="dashboard-title">
       RealRoot Report — <span className="accent">{results.neighbourhood}</span>
     </h2>

     {results.warning && <div className="warning-banner">{results.warning}</div>}

     {/* ── Big Score ── */}
     <div className="score-card">
        <div className="score-ring" style={{ borderColor: scoreInfo.color }}>
          <span className="score-number" style={{ color: scoreInfo.color }}>{results.citytax_score}</span>
          <span className="score-max">/100</span>
        </div>
        <div className="score-info">
          <span className="score-label" style={{ color: scoreInfo.color }}>{scoreInfo.label}</span>
          <p className="score-desc">
            RealRoot Score combines rent burden, commute cost, time lost, and
            displacement risk into one number. Higher = better deal.
          </p>
        </div>
      </div>

     {/* ── Main Stats ── */}
     <div className="cards-grid">
       <div className="stat-card">
         <div className="stat-icon">🏠</div>
         <div className="stat-label">Monthly Rent</div>
         <div className="stat-value">${results.avg_rent.toLocaleString()}</div>
         <div className="stat-sub">
           {results.rent_burden_pct}% of your income
           {results.rent_burden_pct > 30 && <span className="stat-warn"> — above 30% ⚠️</span>}
         </div>
       </div>


       <div className="stat-card">
         <div className="stat-icon">🚌</div>
         <div className="stat-label">Monthly Commute</div>
         <div className="stat-value">${results.commute_cost_monthly}</div>
         <div className="stat-sub">{results.avg_commute_mins} min each way · TTC pass</div>
       </div>


       <div className="stat-card">
         <div className="stat-icon">⏱️</div>
         <div className="stat-label">Time Lost to Commute</div>
         <div className="stat-value">{results.commute_hours_monthly} hrs</div>
         <div className="stat-sub">per month · worth ~${results.time_cost_monthly} of your time</div>
       </div>


       <div className="stat-card highlight-card">
         <div className="stat-icon">💸</div>
         <div className="stat-label">True Monthly Cost</div>
         <div className="stat-value">${results.total_monthly_cost.toLocaleString()}</div>
         <div className="stat-sub">rent + commute combined</div>
       </div>


       <div className="stat-card">
         <div className="stat-icon">📈</div>
         <div className="stat-label">Gentrification Risk</div>
         <div className="stat-value" style={{ color: RISK_COLOR[results.gentrify_risk] }}>
           {results.gentrify_risk}
         </div>
         <div className="stat-sub">Rent up {results.rent_increase_2yr}% in last 24 months</div>
         {results.watson_confidence !== undefined && (
           <div className="watson-confidence">
             🤖 IBM Watson NLU confidence: <strong>{Math.round(results.watson_confidence * 100)}%</strong>
           </div>
         )}
       </div>


       <div className="stat-card">
         <div className="stat-icon">🚶</div>
         <div className="stat-label">Walk Score</div>
         <div className="stat-value">{results.walk_score}/100</div>
         <div className="stat-sub">
           {results.walk_score >= 80 ? "Very walkable" : results.walk_score >= 60 ? "Somewhat walkable" : "Car dependent"}
         </div>
       </div>
     </div>


     {/* ── Statistics Canada Section ── */}
     {statcan && (
       <div className="statcan-section">
         <div className="statcan-header">
           <span className="statcan-badge">🇨🇦 Statistics Canada</span>
           <span className="statcan-source">{statcan.data_source}</span>
         </div>
         <div className="cards-grid">
           <div className="stat-card">
             <div className="stat-icon">👥</div>
             <div className="stat-label">Neighbourhood Population</div>
             <div className="stat-value">{statcan.population.toLocaleString()}</div>
             <div className="stat-sub">residents · StatCan Census 2021</div>
           </div>
           <div className="stat-card">
             <div className="stat-icon">💰</div>
             <div className="stat-label">Median Household Income</div>
             <div className="stat-value">${statcan.median_household_income.toLocaleString()}</div>
             <div className="stat-sub">per year in this neighbourhood</div>
           </div>
           <div className="stat-card">
             <div className="stat-icon">📊</div>
             <div className="stat-label">Low Income Rate</div>
             <div className="stat-value"
               style={{ color: statcan.low_income_pct > 25 ? "#ef4444" : statcan.low_income_pct > 15 ? "#f59e0b" : "#22c55e" }}
             >
               {statcan.low_income_pct}%
             </div>
             <div className="stat-sub">of residents below low-income threshold</div>
           </div>
           <div className="stat-card highlight-card" style={{ gridColumn: "1 / -1", flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: "28px 40px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div className="stat-icon">🎯</div>
                <div className="stat-label">Income Needed to Afford This</div>
              </div>
              <div className="stat-value" style={{ fontSize: "52px", margin: "0" }}>
                ${statcan.affordable_if_earning.toLocaleString()}
              </div>
              <div className="stat-sub">
                per year · based on StatCan 30% affordability rule
                {statcan.affordable_if_earning > results.avg_rent * 12 / 0.30 * 1.1 && (
                  <span className="stat-warn"> — you may be stretched ⚠️</span>
                )}
              </div>
            </div>
         </div>
       </div>
     )}


     {/* ── Toronto Open Data Section ── */}
     {torontoData && (
       <div className="statcan-section">
         <div className="statcan-header">
           <span className="statcan-badge" style={{ background: "#3b82f612", borderColor: "#3b82f640", color: "#93c5fd" }}>
             🏢 Toronto Open Data
           </span>
           <span className="statcan-source">{torontoData.data_source}</span>
           <span className="statcan-source" style={{
             color: torontoData.api_status === "connected" ? "#22c55e" : "#f59e0b"
           }}>
             {torontoData.api_status === "connected" ? "● Live API" : "● Researched Data"}
           </span>
         </div>
         <div className="warning-banner" style={{
           background: torontoData.development_pressure === "HIGH" ? "#ef444412" :
                       torontoData.development_pressure === "MEDIUM" ? "#f59e0b12" : "#22c55e12",
           borderColor: torontoData.development_pressure === "HIGH" ? "#ef444440" :
                        torontoData.development_pressure === "MEDIUM" ? "#f59e0b40" : "#22c55e40",
           color: torontoData.development_pressure === "HIGH" ? "#fca5a5" :
                  torontoData.development_pressure === "MEDIUM" ? "#fcd34d" : "#86efac",
         }}>
           {torontoData.pressure_message}
         </div>
         <div className="cards-grid">
           <div className="stat-card">
             <div className="stat-icon">🏗️</div>
             <div className="stat-label">Building Permits (YTD)</div>
             <div className="stat-value">{torontoData.building_permits_ytd}</div>
             <div className="stat-sub">new construction permits filed this year</div>
           </div>
           <div className="stat-card">
             <div className="stat-icon">📋</div>
             <div className="stat-label">Development Applications</div>
             <div className="stat-value">{torontoData.development_apps}</div>
             <div className="stat-sub">active rezoning + development proposals</div>
           </div>
           <div className="stat-card">
             <div className="stat-icon">🔍</div>
             <div className="stat-label">Apartment Audits</div>
             <div className="stat-value">{torontoData.apartment_audits}</div>
             <div className="stat-sub">building inspections conducted</div>
           </div>
           <div className="stat-card"
             style={{ borderColor: torontoData.bylaw_violations > 10 ? "#ef444444" : "var(--border)" }}
           >
             <div className="stat-icon">⚠️</div>
             <div className="stat-label">Bylaw Violations</div>
             <div className="stat-value"
               style={{ color: torontoData.bylaw_violations > 10 ? "#ef4444" : "#22c55e" }}
             >
               {torontoData.bylaw_violations}
             </div>
             <div className="stat-sub">reported violations in this area</div>
           </div>
         </div>
       </div>
     )}


     {/* ── Compare CTA ── */}
     <div className="compare-cta">
       <p>Want to see how this compares to other neighbourhoods?</p>
       <button className="btn btn-primary" onClick={onCompare}>
         Compare All Neighbourhoods →
       </button>
     </div>
   </div>
 );
}

