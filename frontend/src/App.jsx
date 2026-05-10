import { useState } from "react";
import InputForm from "./components/InputForm";
import Dashboard from "./components/Dashboard";
import CompareView from "./components/CompareView";
import "./App.css";


export default function App() {
 const [view, setView] = useState("home");
 const [results, setResults] = useState(null);
 const [compareResults, setCompareResults] = useState(null);
 const [loading, setLoading] = useState(false);
 const [formData, setFormData] = useState(null);

 const [theme, setTheme] = useState("light");        // ← add here

 const toggleTheme = () => {                          // ← and this right after
  const next = theme === "light" ? "dark" : "light";
  setTheme(next);
  document.documentElement.setAttribute("data-theme", next);
};


const API = "https://realroot-api.onrender.com";


 const handleAnalyze = async ({ income, neighbourhood }) => {
   setLoading(true);
   setFormData({ income, neighbourhood });
   try {
     const res = await fetch(`${API}/analyze`, {
       method: "POST",
       headers: { "Content-Type": "application/json" },
       body: JSON.stringify({ income, neighbourhood }),
     });
     const data = await res.json();
     setResults({ neighbourhood, ...data });
     setView("results");
   } catch (err) {
     alert("Could not connect to backend. Make sure Flask is running on port 5000.");
   } finally {
     setLoading(false);
   }
 };


 const handleCompare = async (income) => {
   setLoading(true);
   try {
     const res = await fetch(`${API}/compare`, {
       method: "POST",
       headers: { "Content-Type": "application/json" },
       body: JSON.stringify({ income }),
     });
     const data = await res.json();
     setCompareResults({ income, results: data });
     setView("compare");
   } catch (err) {
     alert("Could not connect to backend. Make sure Flask is running on port 5000.");
   } finally {
     setLoading(false);
   }
 };


 const scrollToApp = () => {
   setView("app");
   setTimeout(() => {
     document.getElementById("app-section")?.scrollIntoView({ behavior: "smooth" });
   }, 50);
 };


 return (
   <div className="app">


     {/* ── Header ── */}
     <header className="header">
       <div className="header-inner">
         <div className="logo" onClick={() => setView("home")}>
           <span className="logo-icon">🌿</span>
           <span className="logo-text">RealRoot</span>
         </div>
         <nav className="nav">
          <button className="nav-btn" onClick={toggleTheme}>
            {theme === "light" ? "🌙 Dark" : "☀️ Light"}
          </button>
          {compareResults && (
            <button
              className={`nav-btn ${view === "compare" ? "active" : ""}`}
              onClick={() => setView("compare")}
            >
              Compare
            </button>
          )}
        </nav>
       </div>
     </header>


     <main className="main">


       {/* ── Hero Section ── */}
       {(view === "home" || view === "app") && (
         <section className="hero-section">
           <h1 className="hero-title">RealRoot</h1>
           <p className="hero-slogan">real cost of where you root yourself</p>
           <p className="hero-desc">
             Rent is only part of the story. RealRoot reveals hidden costs —
             commute, gentrification risk, and time lost — in one unified score
             powered by real data.
           </p>
           <div className="scroll-indicator" onClick={scrollToApp}>
             <span className="scroll-text">Start exploring</span>
             <div className="scroll-arrow">↓</div>
           </div>
         </section>
       )}


       {/* ── App Section ── */}
       {(view === "app" || view === "results" || view === "compare") && (
         <div id="app-section" className="app-section">


           {view === "app" && (
             <>
               <div className="app-section-header">
                 <h2 className="app-section-title">Find your neighbourhood</h2>
                 <p className="app-section-sub">
                   Analyze a specific neighbourhood or find what fits your budget
                 </p>
               </div>
               <InputForm
                 onAnalyze={handleAnalyze}
                 onCompare={handleCompare}
                 loading={loading}
               />
             </>
           )}


           {view === "results" && results && (
             <Dashboard
               results={results}
               income={formData?.income}
               onBack={() => setView("app")}
               onCompare={() => handleCompare(formData?.income)}
             />
           )}


           {view === "compare" && compareResults && (
             <CompareView
               data={compareResults}
               onBack={() => setView("app")}
               onSelect={(neighbourhood) =>
                 handleAnalyze({ income: compareResults.income, neighbourhood })
               }
             />
           )}


         </div>
       )}

     </main>

     {/* ── Footer ── */}
     <footer className="footer">
       <p>RealRoot</p>
       <div className="footer-badges">
         <span className="hero-badge">Statistics Canada</span>
         <span className="hero-badge">Google Maps</span>
         <span className="hero-badge">IBM Watson AI</span>
         <span className="hero-badge">Toronto Open Data</span>
         <span className="hero-badge">Neighbourhoods</span>
       </div>
     </footer>

   </div>
 );
}

