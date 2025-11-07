"use client";

import { useEffect, useMemo, useState } from "react";
import VoteSkeleton from "../components/VoteSkeleton";
import { useTranslation } from "../hooks/useTranslation";

type Counts = { agree: number; disagree: number };
type Choice = "agree" | "disagree" | null;

const STORAGE_COUNTS = "bigIssueVote_counts";
const STORAGE_CHOICE = "bigIssueVote_choice";

// 既定値（72% / 28% → Total 1284）
const DEFAULT_COUNTS: Counts = { agree: 0, disagree: 0 };

export default function VotePage() {
  const { t } = useTranslation();
  const [counts, setCounts] = useState<Counts>(DEFAULT_COUNTS);
  const [choice, setChoice] = useState<Choice>(null);
  const [loading, setLoading] = useState(true);

  // 初期化：localStorage から復元
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      try {
        const savedCounts = window.localStorage.getItem(STORAGE_COUNTS);
        const savedChoice = window.localStorage.getItem(STORAGE_CHOICE);

        if (savedCounts) setCounts(JSON.parse(savedCounts));
        if (savedChoice === "agree" || savedChoice === "disagree") {
          setChoice(savedChoice);
        }
      } catch {
        /* 破損していたら既定値を継続 */
      }
      setLoading(false);
    }, 500); // 500ms待機してローディングを見せる

    return () => clearTimeout(timer);
  }, []);

  // 合計と割合
  const total = useMemo(() => counts.agree + counts.disagree, [counts]);

  const agreePct = useMemo(
    () => (total > 0 ? Math.round((counts.agree / total) * 100) : 0),
    [counts, total]
  );
  const disagreePct = 100 - agreePct;

  // 票の更新（1ブラウザ1票 / 切替方式）
  const castVote = (next: Exclude<Choice, null>) => {
    setCounts((prev) => {
      const nextCounts = { ...prev };

      // 同じ票を連打 → 無視
      if (choice === next) return prev;

      // 古い選択を取り消し
      if (choice === "agree") nextCounts.agree = Math.max(0, nextCounts.agree - 1);
      if (choice === "disagree")
        nextCounts.disagree = Math.max(0, nextCounts.disagree - 1);

      // 新しい選択を +1
      if (next === "agree") nextCounts.agree += 1;
      if (next === "disagree") nextCounts.disagree += 1;

      // 永続化
      try {
        window.localStorage.setItem(STORAGE_COUNTS, JSON.stringify(nextCounts));
        window.localStorage.setItem(STORAGE_CHOICE, next);
      } catch {}

      setChoice(next);
      return nextCounts;
    });
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
