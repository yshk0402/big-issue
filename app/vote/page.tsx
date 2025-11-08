"use client";

import { useEffect, useMemo, useState } from "react";
import VoteSkeleton from "../components/VoteSkeleton";
import { useTranslation } from "../hooks/useTranslation";

type Counts = { agree: number; disagree: number };
type Choice = "agree" | "disagree" | null;

const USER_ID_KEY = "bigIssueVote_userId";

const errorKeyMap = {
  fetch: 'vote.error.fetch',
  submit: 'vote.error.submit',
} as const;

type ErrorKey = keyof typeof errorKeyMap;

export default function VotePage() {
  const { t } = useTranslation();
  const [counts, setCounts] = useState<Counts>({ agree: 0, disagree: 0 });
  const [choice, setChoice] = useState<Choice>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [errorKey, setErrorKey] = useState<ErrorKey | null>(null);
  const errorMessage = errorKey ? t(errorKeyMap[errorKey]) : null;

  useEffect(() => {
    if (typeof window === 'undefined') return;
    let stored = window.localStorage.getItem(USER_ID_KEY);
    if (!stored) {
      stored = self.crypto?.randomUUID?.() ?? Math.random().toString(36).slice(2);
      window.localStorage.setItem(USER_ID_KEY, stored);
    }
    setUserId(stored);
  }, []);

  useEffect(() => {
    if (!userId) return;
    const controller = new AbortController();
    const fetchCounts = async () => {
      setLoading(true);
      setErrorKey(null);
      try {
        const res = await fetch(`/api/votes?userId=${userId}`, { cache: 'no-store', signal: controller.signal });
        if (!res.ok) throw new Error('Failed to fetch votes');
        const data = await res.json();
        setCounts(data.counts);
        setChoice(data.choice);
      } catch (err) {
        if ((err as Error).name === 'AbortError') return;
        console.error(err);
        setErrorKey('fetch');
      } finally {
        setLoading(false);
      }
    };

    fetchCounts();
    return () => controller.abort();
  }, [userId]);

  // 合計と割合
  const total = useMemo(() => counts.agree + counts.disagree, [counts]);

  const agreePct = useMemo(
    () => (total > 0 ? Math.round((counts.agree / total) * 100) : 0),
    [counts, total]
  );
  const disagreePct = 100 - agreePct;

  const castVote = async (next: Exclude<Choice, null>) => {
    if (!userId || submitting || choice === next) return;
    setSubmitting(true);
    setErrorKey(null);
    try {
      const res = await fetch('/api/votes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, choice: next }),
      });

      if (!res.ok) throw new Error('Failed to submit vote');

      const data = await res.json();
      setCounts(data.counts);
      setChoice(data.choice);
    } catch (err) {
      console.error(err);
      setErrorKey('submit');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="flex-1 flex flex-col items-center justify-center p-4">
      <div className="relative z-0 w-full">
        {loading ? (
          <VoteSkeleton />
        ) : (
          <div className="w-full max-w-3xl mx-auto">
            {/* ✅ ヘッダー */}
            <header className="mb-10 text-center">
              <h1 className="text-zinc-900 text-3xl md:text-4xl font-black leading-tight tracking-[-0.033em]">
                {t('vote.title')}
              </h1>
              <p className="text-zinc-500 text-base mt-2">
                {t('vote.description')}
              </p>
            </header>

            {/* ✅ 投票カード */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 sm:p-8 shadow-sm">
              {errorMessage && (
                <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                  {errorMessage}
                </div>
              )}
              <div className="flex flex-col gap-2">
                <p className="text-zinc-900 text-xl md:text-2xl font-bold tracking-[-0.015em]">
                  {t('vote.question')}
                </p>
                <p className="text-zinc-500 text-base pb-4">
                  {t('vote.subQuestion')}
                </p>
              </div>

              {/* ✅ 進捗バー */}
              <div className="flex flex-col gap-4 py-4">
                {/* Agree */}
                <div className="flex flex-col gap-3">
                  <div className="flex items-baseline justify-between">
                    <p className="text-[#10A37F] text-base font-medium">{t('vote.agree')}</p>
                    <p className="text-zinc-800 text-lg font-bold">
                      {agreePct}%
                    </p>
                  </div>
                  <div className="h-4 rounded-full bg-gray-200 overflow-hidden">
                    <div
                      className="h-4 rounded-full bg-[#10A37F] transition-[width] duration-300"
                      style={{ width: `${agreePct}%` }}
                    />
                  </div>
                </div>

                {/* Disagree */}
                <div className="flex flex-col gap-3">
                  <div className="flex items-baseline justify-between">
                    <p className="text-[#D3302F] text-base font-medium">{t('vote.disagree')}</p>
                    <p className="text-zinc-800 text-lg font-bold">
                      {disagreePct}%
                    </p>
                  </div>
                  <div className="h-4 rounded-full bg-gray-200 overflow-hidden">
                    <div
                      className="h-4 rounded-full bg-[#D3302F] transition-[width] duration-300"
                      style={{ width: `${disagreePct}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 my-6" />

              {/* ✅ 投票ボタン（クリック保証版） */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => castVote("agree")}
                  className={`
                    relative z-10
                    flex flex-1 items-center justify-center rounded-lg h-12 px-5
                    text-white text-base font-bold tracking-[0.015em] transition-colors
                    ${choice === "agree"
                      ? "bg-[#0E8A6B]"
                      : "bg-[#10A37F] hover:bg-[#0E8A6B]"
                    }
                  `}
                  disabled={submitting}
                >
                  {t('vote.agree')}
                </button>

                <button
                  onClick={() => castVote("disagree")}
                  className={`
                    relative z-10
                    flex flex-1 items-center justify-center rounded-lg h-12 px-5
                    text-white text-base font-bold tracking-[0.015em] transition-colors
                    ${choice === "disagree"
                      ? "bg-[#B92A29]"
                      : "bg-[#D3302F] hover:bg-[#B92A29]"
                    }
                  `}
                  disabled={submitting}
                >
                  {t('vote.disagree')}
                </button>
              </div>

              <p className="text-center text-zinc-500 text-sm mt-6">
                {t('vote.totalVotes')}: {total.toLocaleString()}
              </p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
