const RISK_COLOR = { LOW: "#22c55e", MEDIUM: "#f59e0b", HIGH: "#ef4444" };
const SCORE_COLOR = (s) => s >= 75 ? "#22c55e" : s >= 55 ? "#f59e0b" : s >= 35 ? "#f97316" : "#ef4444";

export default function CompareView({ data, onBack, onSelect }) {
  const entries = Object.entries(data.results);

  return (
    <div className="compare-page">
      <button className="back-btn" onClick={onBack}>← Back</button>

      <h2 className="dashboard-title">
        Neighbourhood Comparison
        <span className="dashboard-subtitle"> — Income: ${Number(data.income).toLocaleString()} / yr</span>
      </h2>
      <p className="compare-desc">Ranked best to worst by RealRoot Score. Click any row to see the full breakdown.</p>

      <div className="compare-table-wrap">
        <table className="compare-table">
          <thead>
            <tr>
              <th>#</th><th>Neighbourhood</th><th>Score</th><th>Rent</th>
              <th>Rent Burden</th><th>Commute</th><th>Gentrify Risk</th>
              <th>True Monthly Cost</th><th></th>
            </tr>
          </thead>
          <tbody>
            {entries.map(([name, s], i) => (
              <tr key={name} className="compare-row" onClick={() => onSelect(name)}>
                <td className="rank">{i + 1}</td>
                <td className="n-name">{name}</td>
                <td>
                  <span className="score-pill" style={{ background: SCORE_COLOR(s.citytax_score) + "22", color: SCORE_COLOR(s.citytax_score), border: `1px solid ${SCORE_COLOR(s.citytax_score)}` }}>
                    {s.citytax_score}
                  </span>
                </td>
                <td>${s.avg_rent.toLocaleString()}/mo</td>
                <td style={{ color: s.rent_burden_pct > 30 ? "#ef4444" : "inherit", fontWeight: s.rent_burden_pct > 30 ? "600" : "400" }}>{s.rent_burden_pct}%</td>
                <td>{s.avg_commute_mins} min</td>
                <td style={{ color: RISK_COLOR[s.gentrify_risk], fontWeight: "600" }}>{s.gentrify_risk}</td>
                <td>${s.total_monthly_cost.toLocaleString()}</td>
                <td><button className="btn-inline">View →</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {entries.length > 0 && (
        <div className="best-pick">
          <span className="best-pick-label">🏆 Best value for your income:</span>
          <span className="best-pick-name">{entries[0][0]}</span>
          <span className="best-pick-score">RealRoot Score: {entries[0][1].citytax_score}/100</span>
          <button className="btn btn-primary" onClick={() => onSelect(entries[0][0])}>See Full Report →</button>
        </div>
      )}
    </div>
  );
}