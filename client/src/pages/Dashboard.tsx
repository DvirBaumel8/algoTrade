import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';

interface CompanyProfile {
  sector: string | null;
  industry: string | null;
  longBusinessSummary: string | null;
  website: string | null;
}

function SkeletonCard() {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-lg p-5 space-y-3">
      <div className="shimmer h-4 w-24 rounded" />
      <div className="shimmer h-6 w-40 rounded" />
    </div>
  );
}

function SkeletonBlock() {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-lg p-5 space-y-3">
      <div className="shimmer h-4 w-20 rounded" />
      <div className="shimmer h-4 w-full rounded" />
      <div className="shimmer h-4 w-full rounded" />
      <div className="shimmer h-4 w-3/4 rounded" />
    </div>
  );
}

export default function Dashboard() {
  const { symbol } = useParams<{ symbol: string }>();
  const [profile, setProfile] = useState<CompanyProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!symbol) return;
    setLoading(true);
    setError(null);

    fetch(`http://localhost:3000/stocks/profile/${symbol}`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch profile');
        return res.json();
      })
      .then((data) => setProfile(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [symbol]);

  return (
    <div className="min-h-screen bg-slate-950 text-white font-mono px-4 py-10">
      <div className="max-w-2xl mx-auto space-y-8">
        <Link
          to="/"
          className="text-slate-500 hover:text-green-400 text-sm transition-colors"
        >
          &larr; back to search
        </Link>

        <div className="border-b border-slate-800 pb-6">
          <p className="text-green-400 text-xs uppercase tracking-widest mb-1">ticker</p>
          <h1 className="text-5xl font-bold text-white tracking-tight">{symbol}</h1>
        </div>

        {error && (
          <div className="bg-red-950 border border-red-800 rounded-lg p-4 text-red-400 text-sm">
            {error}
          </div>
        )}

        {loading ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <SkeletonCard />
              <SkeletonCard />
            </div>
            <SkeletonBlock />
          </div>
        ) : profile ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-900 border border-slate-800 rounded-lg p-5">
                <p className="text-green-400 text-xs uppercase tracking-widest mb-1">sector</p>
                <p className="text-white text-lg">{profile.sector ?? '—'}</p>
              </div>
              <div className="bg-slate-900 border border-slate-800 rounded-lg p-5">
                <p className="text-green-400 text-xs uppercase tracking-widest mb-1">industry</p>
                <p className="text-white text-lg">{profile.industry ?? '—'}</p>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-lg p-5 space-y-3">
              <p className="text-green-400 text-xs uppercase tracking-widest">about</p>
              <p className="text-slate-300 text-sm leading-relaxed">
                {profile.longBusinessSummary ?? 'No description available.'}
              </p>
              {profile.website && (
                <a
                  href={profile.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 text-sm underline transition-colors"
                >
                  {profile.website}
                </a>
              )}
            </div>
          </motion.div>
        ) : null}
      </div>
    </div>
  );
}
