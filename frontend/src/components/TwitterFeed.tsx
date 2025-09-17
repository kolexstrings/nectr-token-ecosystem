"use client";
import { useEffect, useState } from "react";

type Tweet = {
  id: string;
  text: string;
  created_at?: string;
  public_metrics?: {
    like_count?: number;
    reply_count?: number;
    retweet_count?: number;
  };
};

export default function TwitterFeed({
  handle = "KoladeOlukoya",
  limit = 5,
  ttlMs = 300000,
}: {
  handle?: string;
  limit?: number;
  ttlMs?: number;
}) {
  const [tweets, setTweets] = useState<Tweet[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/twitter?handle=${encodeURIComponent(
            handle
          )}&limit=${encodeURIComponent(
            String(limit)
          )}&ttl=${encodeURIComponent(String(ttlMs))}`,
          {
            cache: "no-store",
          }
        );
        const data = await res.json();
        if (!res.ok) throw new Error(data?.error || "Failed to load tweets");
        if (!cancelled) setTweets(data?.data || []);
      } catch (e: unknown) {
        if (!cancelled) setError(e instanceof Error ? e.message : String(e));
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    run();
    return () => {
      cancelled = true;
    };
  }, [handle, limit, ttlMs]);

  if (loading)
    return <div className="bg-dark-800 rounded-lg p-4">Loading tweets…</div>;
  if (error)
    return (
      <div className="bg-dark-800 rounded-lg p-4 text-red-400">{error}</div>
    );
  if (!tweets || tweets.length === 0)
    return <div className="bg-dark-800 rounded-lg p-4">No recent tweets.</div>;

  const loop = [...tweets, ...tweets];

  return (
    <section className="my-0 overflow-hidden">
      <div className="marquee w-full">
        <div
          className="marquee__track marquee__track--rtl"
          style={{ animationDuration: "35s" }}
        >
          {loop.map((t, i) => (
            <article
              key={`${t.id}-${i}`}
              className="flex-shrink-0 w-64 sm:w-72 mx-3 sm:mx-4 bg-dark-800 rounded-xl overflow-hidden border border-dark-700 shadow-lg hover:shadow-xl transition-shadow p-3 sm:p-4"
            >
              <p className="text-[13px] sm:text-sm whitespace-pre-wrap leading-snug line-clamp-6">
                {t.text}
              </p>
              <div className="text-[10px] sm:text-[11px] text-gray-400 mt-3 flex items-center gap-3 sm:gap-4">
                <span>
                  {t.created_at
                    ? new Date(t.created_at).toLocaleDateString()
                    : ""}
                </span>
                <span>❤ {t.public_metrics?.like_count ?? 0}</span>
                <span>↩ {t.public_metrics?.retweet_count ?? 0}</span>
                <span>💬 {t.public_metrics?.reply_count ?? 0}</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
