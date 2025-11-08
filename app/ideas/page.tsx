"use client";

import { useEffect, useMemo, useState } from "react";
import IdeaCardSkeleton from "../components/IdeaCardSkeleton";
import { useTranslation } from "../hooks/useTranslation";

type SortOption = "newest" | "oldest" | "top" | "downvoted";

type Idea = {
  id: number;
  text: string;
  date: string;
  upvotes: number;
  downvotes: number;
};

type Comment = {
  id: number;
  text: string | null;
  user_name: string | null;
  created_at: string;
};

const errorKeyMap = {
  fetch: 'ideas.error.fetchFailed',
  commentFetch: 'ideas.error.commentFetchFailed',
  commentPost: 'ideas.error.commentFailed',
  vote: 'ideas.error.voteFailed',
} as const;

type ErrorKey = keyof typeof errorKeyMap;

// ヘルパー関数: 日時フォーマット
const formatDateTime = (isoString: string | undefined) => {
  if (!isoString) return "—";
  try {
    const date = new Date(isoString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  } catch {
    return "—";
  }
};

export default function IdeasPage() {
  const { t } = useTranslation();
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [comments, setComments] = useState<Record<number, Comment[]>>({});
  const [activeIdea, setActiveIdea] = useState<Idea | null>(null);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadingComments, setLoadingComments] = useState(false);
  const [errorKey, setErrorKey] = useState<ErrorKey | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState<SortOption>("newest");
  const errorMessage = errorKey ? t(errorKeyMap[errorKey]) : null;

  // --- 初期ロード ---
  useEffect(() => {
    const controller = new AbortController();

    const fetchIdeas = async () => {
      setLoading(true);
      setErrorKey(null);
      try {
        const res = await fetch('/api/proposals', { cache: 'no-store', signal: controller.signal });
        if (!res.ok) throw new Error('Failed to fetch proposals');
        const data: { id: number; text: string; created_at: string; upvotes: number; downvotes: number }[] = await res.json();
        const mapped = data.map((proposal) => ({
          id: proposal.id,
          text: proposal.text ?? '',
          date: proposal.created_at,
          upvotes: proposal.upvotes ?? 0,
          downvotes: proposal.downvotes ?? 0,
        }));
        setIdeas(mapped);
      } catch (err) {
        if ((err as Error).name === 'AbortError') return;
        console.error(err);
        setErrorKey('fetch');
      } finally {
        setLoading(false);
      }
    };

    fetchIdeas();
    return () => controller.abort();
  }, []);

  // --- 検索フィルタリング ---
  const filteredIdeas = useMemo(() => {
    if (!searchQuery) {
      return ideas;
    }
    return ideas.filter((idea) =>
      idea.text.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [ideas, searchQuery]);

  // --- ソート処理 ---
  const sortedIdeas = useMemo(() => {
    const sorted = [...filteredIdeas];
    switch (sortOption) {
      case "newest":
        return sorted.sort((a, b) => b.id - a.id);
      case "oldest":
        return sorted.sort((a, b) => a.id - b.id);
      case "top":
        return sorted.sort((a, b) => (b.upvotes ?? 0) - (a.upvotes ?? 0));
      case "downvoted":
        return sorted.sort((a, b) => (b.downvotes ?? 0) - (a.downvotes ?? 0));
      default:
        return sorted;
    }
  }, [filteredIdeas, sortOption]);

  // --- コメント投稿処理 ---
  const handlePostComment = async () => {
    if (!activeIdea || !newComment.trim()) return;

    try {
      const ideaComments = comments[activeIdea.id] || [];
      const randomNames = ['Falcon', 'Nova', 'Echo', 'Sparrow', 'Orion', 'Lyra', 'Comet', 'Vega', 'Luna', 'Pixel'];
      const randomName = randomNames[Math.floor(Math.random() * randomNames.length)];
      const userName = `${String(ideaComments.length + 1).padStart(3, '0')} ${randomName}`;

      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ proposalId: activeIdea.id, text: newComment.trim(), userName }),
      });

      if (!res.ok) throw new Error('Failed to create comment');

      const created: Comment = await res.json();
      setComments((prev) => ({ ...prev, [activeIdea.id]: [created, ...(prev[activeIdea.id] || [])] }));
      setNewComment('');
    } catch (err) {
      console.error(err);
      setErrorKey('commentPost');
    }
  };

  const openComments = async (idea: Idea) => {
    setActiveIdea(idea);
    setShowComments(true);
    if (comments[idea.id]?.length) {
      return;
    }
    setLoadingComments(true);
    setErrorKey(null);
    try {
      const res = await fetch(`/api/comments?proposalId=${idea.id}`, { cache: 'no-store' });
      if (!res.ok) throw new Error('Failed to fetch comments');
      const data: Comment[] = await res.json();
      setComments((prev) => ({ ...prev, [idea.id]: data }));
    } catch (err) {
      console.error(err);
      setErrorKey('commentFetch');
    } finally {
      setLoadingComments(false);
    }
  };

  const closeComments = () => {
    setActiveIdea(null);
    setShowComments(false);
  };

  // --- コメント（新しい順）---
  const activeIdeaComments = useMemo(() => {
    if (!activeIdea) return [];
    return comments[activeIdea.id] || [];
  }, [activeIdea, comments]);

  const handleVote = async (id: number, voteType: 'up' | 'down') => {
    try {
      const res = await fetch(`/api/proposals/${id}/votes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ voteType }),
      });

      if (!res.ok) throw new Error('Failed to vote');

      const updated: Idea = await res.json();
      setIdeas((prev) =>
        prev.map((idea) =>
          idea.id === updated.id
            ? {
                ...idea,
                upvotes: updated.upvotes ?? idea.upvotes,
                downvotes: updated.downvotes ?? idea.downvotes,
              }
            : idea
        )
      );
    } catch (err) {
      console.error(err);
      setErrorKey('vote');
    }
  };

const SortButton = ({ option, label }: { option: SortOption; label: string }) => (
    <button
      onClick={() => setSortOption(option)}
      className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
        sortOption === option
          ? "bg-indigo-600 text-white"
          : "text-gray-600 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-zinc-700"
      }`}>
      {label}
    </button>
  );

    return (
    <>
      <main className="p-4 md:p-8 lg:p-12">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-gray-900 text-3xl md:text-4xl font-black leading-tight tracking-tight">
              {t('ideas.title')}
            </h1>
            <p className="text-gray-500 text-base mt-2">
              {t('ideas.description')}
            </p>
          </div>

          {errorMessage && (
            <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {errorMessage}
            </div>
          )}

          {/* フィルターセクション */}
          <div className="mb-8 flex flex-col md:flex-row gap-4">
            {/* 検索欄 */}
            <div className="relative flex-grow">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                search
              </span>
              <input
                className="form-input w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-[#6366f1] focus:border-[#6366f1] placeholder:text-gray-400"
                placeholder={t('ideas.searchPlaceholder')}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            {/* ソートボタン */}
            <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl p-1">
                <SortButton option="newest" label={t('ideas.sort.newest')} />
                <SortButton option="oldest" label={t('ideas.sort.oldest')} />
                <SortButton option="top" label={t('ideas.sort.top')} />
                <SortButton option="downvoted" label={t('ideas.sort.downvoted')} />
            </div>
          </div>

          {/* 提案リスト */}
          <div className="flex flex-col gap-6">
            {loading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <IdeaCardSkeleton key={index} />
              ))
            ) : sortedIdeas.length > 0 ? (
              sortedIdeas.map((idea) => (
                <div
                  key={idea.id}
                  className="flex flex-col rounded-xl bg-white border border-gray-200 shadow-sm hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="p-6">
                    <p className="text-gray-900 text-lg font-bold">
                      {idea.text || "Untitled Idea"}
                    </p>
                    <p className="text-gray-400 text-xs mt-2">
                      {t('ideas.card.submittedOn')} {formatDateTime(idea.date)}
                    </p>
                  </div>

                  <div className="border-t border-gray-200 px-6 py-2 flex items-center justify-between">
                    <div className="flex items-center gap-4">

                      {/* ✅ UPVOTE */}
                      <div className="flex items-center gap-1.5 text-gray-500">
                        <button
                          onClick={() => handleVote(idea.id, 'up')}
                          className="p-2 rounded-full hover:bg-[#6366f1]/10 text-[#6366f1]"
                        >
                          <span className="material-symbols-outlined text-xl">
                            arrow_upward
                          </span>
                        </button>
                        <p className="text-sm font-bold">
                          {idea.upvotes ?? 0}
                        </p>
                      </div>

                      {/* ✅ DOWNVOTE */}
                      <div className="flex items-center gap-1.5 text-gray-500">
                        <button
                          onClick={() => handleVote(idea.id, 'down')}
                          className="p-2 rounded-full hover:bg-gray-200"
                        >
                          <span className="material-symbols-outlined text-xl">
                            arrow_downward
                          </span>
                        </button>
                        <p className="text-sm font-bold">
                          {idea.downvotes ?? 0}
                        </p>
                      </div>

                    </div>

                    {/* コメントボタン */}
                    <button
                      onClick={() => openComments(idea)}
                      className="flex items-center gap-1.5 p-2 rounded-full text-gray-500 hover:text-[#6366f1] transition-colors"
                    >
                      <span className="material-symbols-outlined text-xl">
                        chat_bubble
                      </span>
                      <span className="text-sm font-medium">
                        {comments[idea.id]?.length ?? 0}
                      </span>
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">{t('ideas.empty.title')}</p>
                <p className="text-gray-400 mt-1">{t('ideas.empty.description')}</p>
              </div>
            )}
          </div>
        </div>
      </main>

    {/* コメントモーダル */}
    {showComments && activeIdea && (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* 背景 */}
        <div
        className="absolute inset-0 bg-black/40"
        onClick={closeComments}
        ></div>

        {/* モーダル（固定サイズ） */}
        <div
        className="relative bg-[#f6f8f7] rounded-xl shadow-2xl flex flex-col w-full max-w-2xl h-full max-h-[90vh] overflow-hidden"
        >
        {/* ヘッダー */}
        <div className="p-6 border-b border-gray-200 flex-shrink-0">
            <div className="flex items-start justify-between">
            <h2 className="text-xl font-bold text-gray-900">
                Comments on: “{activeIdea.text}”
            </h2>
            <button
                onClick={closeComments}
                className="p-1 rounded-full text-gray-400 hover:bg-gray-200 hover:text-gray-700 transition-colors"
            >
                <span className="material-symbols-outlined">close</span>
            </button>
            </div>
        </div>

        {/* コメント一覧（スクロール） */}
        <div className="flex-grow p-6 overflow-y-auto space-y-6">
        {loadingComments ? (
          <p className="text-sm text-gray-500">Loading comments...</p>
        ) : activeIdeaComments.length ? (
          activeIdeaComments.map((c) => (
            <div
              key={c.id}
              className="pb-3 border-b border-gray-100 last:border-0"
            >
              <p className="text-sm font-bold text-gray-800">
                {c.user_name || 'Anonymous'}
              </p>
              <p className="text-xs text-gray-400">
                {formatDateTime(c.created_at)}
              </p>
              <p className="text-sm text-gray-600 mt-1">{c.text || ''}</p>
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-500 italic">
            No comments yet. Be the first to comment!
          </p>
        )}
        </div>

        {/* 入力欄 */}
        <div className="p-6 border-t border-gray-200 flex-shrink-0 bg-white">
            <div className="flex items-start gap-4">
            <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="One comment is One Opinion"
                className="form-input flex-1 py-3 px-4 text-base bg-[#f6f8f7] 
                        border-gray-300 rounded-lg placeholder:text-gray-400 
                        focus:ring-2 focus:ring-[#6366f1] focus:border-[#6366f1]"
            />

            <button
                onClick={handlePostComment}
                className="h-11 px-6 bg-[#6366f1] text-white text-sm font-medium 
                        rounded-lg hover:bg-[#4f4fcf] transition-colors flex-shrink-0"
            >
                Post Comment
            </button>
            </div>
        </div>
        </div>
    </div>
    )}

    </>
  );
}
