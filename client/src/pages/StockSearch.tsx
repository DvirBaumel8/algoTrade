import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

export default function StockSearch() {
  const [symbol, setSymbol] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [shake, setShake] = useState(false);
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 400);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!symbol.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`http://localhost:3000/stocks/validate/${symbol.trim()}`);
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.message ?? 'Symbol not found');
      }
      navigate(`/dashboard/${symbol.trim()}`);
    } catch (err: any) {
      setError(err.message ?? 'An error occurred');
      triggerShake();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <h1 className="text-4xl font-bold text-white text-center mb-2 tracking-tight">
          AlgoTrade
        </h1>
        <p className="text-slate-400 text-center mb-10 text-sm">
          Enter a stock symbol to get started
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            ref={inputRef}
            type="text"
            value={symbol}
            onChange={(e) => setSymbol(e.target.value.toUpperCase())}
            placeholder="e.g. AAPL"
            className={`w-full bg-slate-900 border border-slate-700 text-white text-2xl font-mono
              tracking-widest text-center rounded-lg px-6 py-4 outline-none
              focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors
              placeholder:text-slate-600
              ${shake ? 'animate-shake border-red-500' : ''}`}
            disabled={loading}
            autoFocus
          />

          {error && (
            <p className="text-red-400 text-sm text-center font-mono">{error}</p>
          )}

          <button
            type="submit"
            disabled={!symbol.trim() || loading}
            className="w-full py-3 px-6 rounded-lg font-semibold text-white
              bg-gradient-to-r from-blue-600 to-indigo-600
              hover:from-blue-500 hover:to-indigo-500
              disabled:opacity-40 disabled:cursor-not-allowed
              transition-all duration-200 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                Validating...
              </>
            ) : (
              'Continue'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
