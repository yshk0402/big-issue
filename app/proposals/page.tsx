"use client";
import Link from "next/link";
import { useState, useEffect } from "react";

type Proposal = {
  id: number;
  author: string;
  content: string;
  votes: number;
  date: string;
};

export default function ProposalsPage() {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [newProposal, setNewProposal] = useState("");

  // 初期読み込み時にlocalStorageからデータ取得
  useEffect(() => {
    const saved = localStorage.getItem("proposals");
    if (saved) {
      setProposals(JSON.parse(saved));
    } else {
      // 初期データ（初回のみ）
      const initial = [
        { id: 1, author: "@elon.musk", content: "Add dark mode feature", votes: 128, date: "2023-10-26" },
        { id: 2, author: "@satya.nadella", content: "Add gamification badges", votes: 94, date: "2023-10-25" },
      ];
      setProposals(initial);
      localStorage.setItem("proposals", JSON.stringify(initial));
    }
  }, []);

  // proposalsが変化するたびに保存
  useEffect(() => {
    localStorage.setItem("proposals", JSON.stringify(proposals));
  }, [proposals]);

  // 投稿処理
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProposal.trim()) return;
    const newItem: Proposal = {
      id: Date.now(),
      author: "@you",
      content: newProposal.trim(),
      votes: 0,
      date: new Date().toISOString().slice(0, 10),
    };
    setProposals([newItem, ...proposals]);
    setNewProposal("");
  };

  // 投票処理
  const handleVote = (id: number) => {
    setProposals(
      proposals.map((x) =>
        x.id === id ? { ...x, votes: x.votes + 1 } : x
      )
    );
  };

  return (
    <div className="flex min-h-screen bg-background-light dark:bg-background-dark font-display text-gray-800 dark:text-gray-200">
      {/* サイドバー */}
      <aside className="w-64 bg-white dark:bg-[#182c27] flex flex-col p-4 border-r border-gray-200 dark:border-gray-700">
        <h1 className="text-lg font-bold text-gray-900 dark:text-white mb-6">GOAT App</h1>
        <nav className="flex flex-col gap-2 flex-grow">
          <Link className="px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800" href="/">🏠 Home</Link>
          <Link className="px-3 py-2 rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-300" href="/proposals">💡 Proposals</Link>
        </nav>
      </aside>

      {/* メイン */}
      <main className="flex-1 p-6 md:p-8 lg:p-12 overflow-y-auto">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-black mb-6">Users’ Proposals</h1>

          {/* 投稿フォーム */}
          <form onSubmit={handleSubmit} className="mb-6 flex gap-3">
            <input
              type="text"
              placeholder="提案を入力してください..."
              className="flex-1 p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#182c27]"
              value={newProposal}
              onChange={(e) => setNewProposal(e.target.value)}
            />
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
            >
              投稿
            </button>
          </form>

          {/* 提案リスト */}
          <div className="flex flex-col gap-4">
            {proposals.map((p) => (
              <div
                key={p.id}
                className="rounded-xl bg-white dark:bg-[#182c27] border border-gray-200 dark:border-gray-700 p-4"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold">{p.content}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {p.author} ・ {p.date}
                    </p>
                  </div>
                  <button
                    onClick={() => handleVote(p.id)}
                    className="text-primary hover:underline"
                  >
                    👍 {p.votes}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}