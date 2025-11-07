"use client";

import { useEffect, useState } from "react";
import { getProposals, createProposal, updateProposalVotes, type Proposal } from "@/app/lib/data";
import { useTranslation } from "../hooks/useTranslation";

const formatDateTime = (iso: string | null | undefined) => {
  if (!iso) return "—";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "—";
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
    date.getDate()
  ).padStart(2, "0")} ${String(date.getHours()).padStart(2, "0")}:${String(
    date.getMinutes()
  ).padStart(2, "0")}`;
};

export default function ProposalsPage() {
  const { t } = useTranslation();
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [newProposal, setNewProposal] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProposals = async () => {
    try {
      setLoading(true);
      const fetchedProposals = await getProposals();
      setProposals(fetchedProposals);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch proposals:", err);
      setError(
        "Failed to fetch proposals. Make sure Supabase is configured before using this page."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProposals();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProposal.trim()) return;
    try {
      setSubmitting(true);
      await createProposal(newProposal.trim());
      setNewProposal("");
      await fetchProposals();
    } catch (err) {
      console.error("Failed to create proposal:", err);
      setError("Failed to create proposal. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleVote = async (id: number) => {
    try {
      const target = proposals.find((p) => p.id === id);
      if (!target) return;
      await updateProposalVotes(id, (target.upvotes ?? 0) + 1);
      await fetchProposals();
    } catch (err) {
      console.error("Failed to update vote:", err);
      setError("Could not register your vote. Please try again.");
    }
  };

  return (
    <main className="flex-1 p-4 md:p-8 lg:p-12">
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="space-y-2">
          <p className="text-sm uppercase tracking-wide text-indigo-500 font-semibold">
            Supabase Prototype
          </p>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight text-gray-900">
            {t("ideas.title")}
          </h1>
          <p className="text-gray-500">Server-backed proposals powered by Supabase.</p>
        </header>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-200 p-4 md:p-6 shadow-sm space-y-4">
          <label className="text-sm font-semibold text-gray-700" htmlFor="new-proposal">
            Submit a new proposal
          </label>
          <textarea
            id="new-proposal"
            value={newProposal}
            onChange={(e) => setNewProposal(e.target.value)}
            placeholder={t("home.inputPlaceholder")}
            className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none p-3 min-h-[90px]"
          />
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={!newProposal.trim() || submitting}
              className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition-colors disabled:bg-indigo-300"
            >
              <span className="material-symbols-outlined text-base">send</span>
              {submitting ? "Submitting..." : "Post Proposal"}
            </button>
          </div>
        </form>

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
            {error}
          </div>
        )}

        <section className="space-y-4">
          {loading ? (
            <p className="text-gray-500">Loading proposals...</p>
          ) : proposals.length === 0 ? (
            <div className="rounded-xl border border-dashed border-gray-300 bg-white p-6 text-center text-gray-500">
              No proposals stored in Supabase yet.
            </div>
          ) : (
            proposals.map((proposal) => (
              <article
                key={proposal.id}
                className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-lg font-semibold text-gray-900">
                      {proposal.text || "Untitled proposal"}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Submitted {formatDateTime(proposal.created_at)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700">
                    <span className="material-symbols-outlined text-base text-indigo-600">thumb_up</span>
                    {proposal.upvotes ?? 0}
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                  <p className="text-sm text-gray-500">
                    Downvotes: <span className="font-semibold text-gray-700">{proposal.downvotes ?? 0}</span>
                  </p>
                  <button
                    onClick={() => handleVote(proposal.id)}
                    className="inline-flex items-center gap-2 rounded-full border border-indigo-200 px-4 py-2 text-sm font-semibold text-indigo-600 hover:bg-indigo-50"
                  >
                    <span className="material-symbols-outlined text-base">thumb_up</span>
                    Upvote
                  </button>
                </div>
              </article>
            ))
          )}
        </section>
      </div>
    </main>
  );
}
