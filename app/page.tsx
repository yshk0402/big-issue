"use client";

import { useState, useEffect, Dispatch, SetStateAction } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "./hooks/useTranslation";
import { useMediaQuery } from "./hooks/useMediaQuery";
import DesktopHomeSkeleton from "./components/DesktopHomeSkeleton";

// --- 型定義 ---
type LayoutProps = {
  input: string;
  setInput: Dispatch<SetStateAction<string>>;
  handleSubmit: () => void;
  t: (key: string) => string;
  isDesktop: boolean;
};

// --- Child Components for Layouts ---

const Card = ({ icon, title, text }: { icon: string; title: string; text: string }) => (
  <div className="flex flex-col gap-3 rounded-2xl border border-gray-200 bg-white dark:bg-zinc-800/50 shadow-sm p-5 hover:shadow-md transition-shadow">
    <span className="material-symbols-outlined text-indigo-600">{icon}</span>
    <div>
      <h2 className="font-bold text-gray-900 dark:text-gray-100 text-base">{title}</h2>
      <p className="text-gray-500 dark:text-gray-400 text-sm">{text}</p>
    </div>
  </div>
);

const SubmissionForm = ({ input, setInput, handleSubmit, t, isDesktop }: LayoutProps) => {
  const handleBlur = () => {
    // On mobile, scroll to top when keyboard closes via tap outside
    if (!isDesktop) {
      setTimeout(() => {
        window.scrollTo(0, 0);
      }, 100);
    }
  };

  return (
    <div className="relative">
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onBlur={handleBlur}
        className="form-input w-full resize-none rounded-xl text-gray-800 dark:text-gray-100 bg-white dark:bg-gray-800/50 shadow-lg shadow-gray-200/50 dark:shadow-black/20 focus:outline-0 focus:ring-2 focus:ring-indigo-400 border border-transparent min-h-[60px] placeholder:text-slate-400 dark:placeholder:text-gray-500 p-4 pr-14 text-base"
        placeholder={t('home.inputPlaceholder')}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
          }
        }}
      />
      <button
        onClick={handleSubmit}
        aria-label="Submit idea"
        className="absolute right-2.5 top-2.5 flex items-center justify-center size-10 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-400 disabled:bg-indigo-400"
        disabled={!input.trim()}
      >
        <span className="material-symbols-outlined text-xl">arrow_upward</span>
      </button>
    </div>
  );
};

// --- Layout-specific Components ---

const MobileLayout = (props: LayoutProps) => (
  <main className="flex-1 flex flex-col p-4">
    <div className="flex-grow flex flex-col justify-center items-center text-center">
      <div>
        <h1 className="text-gray-900 dark:text-gray-100 tracking-tight text-3xl font-bold leading-tight pb-3">
          {props.t('home.title')}
        </h1>
        <p className="text-slate-500 dark:text-gray-300 text-base font-normal leading-normal">
          {props.t('home.description')}
        </p>
      </div>
    </div>
    <div className="w-full max-w-2xl mx-auto pb-2">
      <SubmissionForm {...props} />
    </div>
  </main>
);

const DesktopLayout = (props: LayoutProps) => (
  <main className="flex-1 flex flex-col items-center justify-center p-6 lg:p-12">
    <div className="w-full max-w-4xl mx-auto text-center">
      <div className="mb-10">
        <h1 className="text-gray-900 dark:text-gray-100 tracking-tight text-4xl font-bold leading-tight pb-3">
          {props.t('home.title')}
        </h1>
        <p className="text-slate-500 dark:text-gray-300 text-base font-normal leading-normal">
          {props.t('home.description')}
        </p>
      </div>
      <div className="grid grid-cols-3 gap-4 mb-10 w-full">
        <Card icon="emoji_objects" title={props.t('home.card1.title')} text={props.t('home.card1.text')} />
        <Card icon="psychology" title={props.t('home.card2.title')} text={props.t('home.card2.text')} />
        <Card icon="check_circle" title={props.t('home.card3.title')} text={props.t('home.card3.text')} />
      </div>
      <div className="w-full flex flex-col items-center mt-6">
        <div className="w-full max-w-2xl mx-auto">
          <SubmissionForm {...props} />
        </div>
      </div>
    </div>
  </main>
);

// --- Main Page Component ---

export default function HomePage() {
  const [isClient, setIsClient] = useState(false);
  const [input, setInput] = useState("");
  const [toastVisible, setToastVisible] = useState(false);
  const router = useRouter();
  const { t } = useTranslation();
  const isDesktop = useMediaQuery('(min-width: 768px)');

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleSubmit = () => {
    if (!input.trim()) return;
    const newIdea = {
      id: Date.now(),
      text: input.trim(),
      upvotes: 0,
      downvotes: 0,
      date: new Date().toISOString(),
    };
    try {
      const stored = localStorage.getItem("ideas");
      const currentIdeas = stored ? JSON.parse(stored) : [];
      localStorage.setItem("ideas", JSON.stringify([newIdea, ...currentIdeas]));
    } catch (e) {
      console.error("Error saving to localStorage", e);
    }
    setInput("");
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 4000);
  };

  const handleToastClick = () => {
    setToastVisible(false);
    router.push("/ideas");
  };

  const layoutProps = { input, setInput, handleSubmit, t, isDesktop };

  if (!isClient) {
    return (
      <main className="flex-1 flex items-center justify-center">
        <DesktopHomeSkeleton />
      </main>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {isDesktop ? <DesktopLayout {...layoutProps} /> : <MobileLayout {...layoutProps} />}
      
      {toastVisible && (
        <div
          onClick={handleToastClick}
          className="fixed bottom-6 right-6 bg-indigo-600 text-white px-6 py-3 rounded-lg shadow-lg cursor-pointer hover:bg-indigo-700 transition-all duration-200 z-50"
        >
          {t('home.toast')}
        </div>
      )}
    </div>
  );
}