"use client";

import { useState, useEffect } from "react";

interface SearchProposal {
  _id?: string;
  prompt: string;
  venueName: string;
  location: string;
  estimatedCost: string;
  whyItFits: string;
  createdAt: string;
}

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentProposal, setCurrentProposal] = useState<SearchProposal | null>(null);
  const [history, setHistory] = useState<SearchProposal[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [historyError, setHistoryError] = useState<string | null>(null);

  // Fetch search history on page load
  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      setLoadingHistory(true);
      setHistoryError(null);
      const res = await fetch("/api/history");
      const data = await res.json();
      if (data.success) {
        setHistory(data.data);
      } else {
        setHistoryError(data.error || "Failed to load history.");
      }
    } catch (err: any) {
      setHistoryError("Error connecting to server history endpoint.");
      console.error(err);
    } finally {
      setLoadingHistory(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/propose", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();

      if (data.success) {
        setCurrentProposal(data.data);
        setPrompt(""); // Clear input form on success
        // Refresh history
        fetchHistory();
      } else {
        setError(data.error || "Failed to generate proposal.");
      }
    } catch (err: any) {
      setError("Failed to connect to the planning service. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 py-6 px-8 shadow-sm">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">✨</span>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              AI Event Concierge
            </h1>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-150">
            Corporate Offsite Planner
          </span>
        </div>
      </header>

      {/* Main Grid */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Form & Current Suggestion */}
        <section className="lg:col-span-7 flex flex-col gap-6">
          
          {/* Search/Input Form Card */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900 mb-2">
              Describe Your Corporate Event
            </h2>
            <p className="text-sm text-slate-500 mb-4">
              Enter group size, length of stay, preferred environment, budget, or other requirements.
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g. A 10-person leadership retreat in the mountains for 3 days with a $4k budget..."
                rows={4}
                className="w-full p-4 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-800 placeholder-slate-400 bg-slate-50 transition-all text-sm md:text-base resize-none"
                disabled={loading}
              />
              
              <button
                type="submit"
                disabled={loading || !prompt.trim()}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-150 flex items-center justify-center gap-2 cursor-pointer disabled:bg-slate-350 disabled:cursor-not-allowed text-sm md:text-base"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>AI is planning...</span>
                  </>
                ) : (
                  <span>Plan Event Proposal</span>
                )}
              </button>
            </form>

            {error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm flex items-start gap-2">
                <span>⚠️</span>
                <div>
                  <p className="font-semibold">Request failed</p>
                  <p className="text-xs mt-0.5">{error}</p>
                </div>
              </div>
            )}
          </div>

          {/* Current Suggestion Display */}
          {currentProposal ? (
            <div className="bg-indigo-50/50 p-6 rounded-xl border border-indigo-200 shadow-sm animate-fadeIn">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className="text-xs font-semibold text-indigo-700 bg-indigo-100/80 px-2.5 py-1 rounded">
                    Current Recommendation
                  </span>
                  <h2 className="text-xl font-bold text-slate-950 mt-2">
                    {currentProposal.venueName}
                  </h2>
                  <p className="text-sm text-slate-500 font-medium mt-1">
                    📍 {currentProposal.location}
                  </p>
                </div>
                <div className="bg-emerald-100 text-emerald-800 border border-emerald-250 px-3 py-1.5 rounded-lg text-center shadow-xs">
                  <div className="text-[10px] uppercase font-bold tracking-wider text-emerald-700">Cost Est.</div>
                  <div className="text-sm font-semibold">{currentProposal.estimatedCost}</div>
                </div>
              </div>

              <div className="border-t border-indigo-100 pt-4 mt-4">
                <h3 className="text-xs uppercase font-bold tracking-wider text-slate-500 mb-1.5">
                  Why It Fits
                </h3>
                <p className="text-slate-700 leading-relaxed text-sm">
                  {currentProposal.whyItFits}
                </p>
              </div>

              <div className="border-t border-indigo-100 pt-4 mt-4 text-xs text-slate-400">
                Original Search: &ldquo;{currentProposal.prompt}&rdquo;
              </div>
            </div>
          ) : (
            <div className="bg-white p-8 rounded-xl border border-slate-200 border-dashed text-center flex flex-col items-center justify-center text-slate-400 py-16 shadow-xs">
              <span className="text-4xl mb-3">🏔️</span>
              <h3 className="font-semibold text-slate-700 mb-1">No proposal loaded</h3>
              <p className="text-xs max-w-xs text-slate-400">
                Enter your event details above and hit &ldquo;Plan Event Proposal&rdquo; to generate a customized venue option.
              </p>
            </div>
          )}
        </section>

        {/* Right Column: Search History List */}
        <section className="lg:col-span-5 flex flex-col gap-4">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex-1 flex flex-col min-h-[400px]">
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-100">
              <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                📋 Proposal History
              </h2>
              <span className="text-xs font-semibold px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full">
                {history.length}
              </span>
            </div>

            {loadingHistory ? (
              <div className="flex-1 flex flex-col items-center justify-center py-12 text-slate-400">
                <svg className="animate-spin h-8 w-8 text-indigo-500 mb-3" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span className="text-sm">Loading history...</span>
              </div>
            ) : historyError ? (
              <div className="flex-1 flex flex-col items-center justify-center p-6 text-center text-red-500 text-sm">
                <span className="text-2xl mb-2">⚠️</span>
                <p className="font-semibold">Could not load history</p>
                <p className="text-xs text-slate-400 mt-1">{historyError}</p>
                <button 
                  onClick={fetchHistory}
                  className="mt-4 px-3 py-1.5 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded text-xs transition-colors font-medium border border-slate-200 cursor-pointer"
                >
                  Retry
                </button>
              </div>
            ) : history.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-slate-400 py-12 text-center">
                <span className="text-3xl mb-2">📂</span>
                <p className="font-medium text-sm text-slate-500">History is empty</p>
                <p className="text-xs max-w-xs text-slate-400 mt-1">
                  Once you plan an event, it will be saved here for quick access.
                </p>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto max-h-[500px] flex flex-col gap-3 pr-1">
                {history.map((item) => (
                  <button
                    key={item._id}
                    onClick={() => setCurrentProposal(item)}
                    className={`text-left p-3.5 rounded-lg border transition-all text-sm cursor-pointer block w-full hover:shadow-xs ${
                      currentProposal?._id === item._id
                        ? "bg-indigo-50/70 border-indigo-300 ring-1 ring-indigo-300"
                        : "bg-white border-slate-200 hover:bg-slate-50 hover:border-slate-350"
                    }`}
                  >
                    <div className="flex justify-between items-start gap-2 mb-1.5">
                      <h4 className="font-semibold text-slate-950 truncate max-w-[170px] md:max-w-[200px]">
                        {item.venueName}
                      </h4>
                      <span className="text-[10px] text-slate-400 whitespace-nowrap">
                        {new Date(item.createdAt).toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                    <p className="text-xs text-slate-450 truncate mb-1">
                      📍 {item.location}
                    </p>
                    <p className="text-xs text-slate-600 line-clamp-2 bg-slate-50 p-2 rounded border border-slate-100 font-serif italic">
                      &ldquo;{item.prompt}&rdquo;
                    </p>
                  </button>
                ))}
              </div>
            )}
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="bg-slate-150 border-t border-slate-200 py-6 text-center text-xs text-slate-500 mt-auto">
          <p>Built with ❤️ by Sparsh Agarwal</p>
      </footer>
    </div>
  );
}
