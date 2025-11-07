
const IdeaCardSkeleton = () => (
  <div className="bg-white dark:bg-zinc-800/50 rounded-lg shadow-sm border border-slate-200 dark:border-zinc-800 p-5 animate-pulse">
    {/* Title Skeleton */}
    <div className="h-5 bg-gray-200 dark:bg-zinc-700 rounded w-3/4 mb-3"></div>

    {/* Author and Date Skeleton */}
    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-4">
      <div className="h-4 bg-gray-200 dark:bg-zinc-700 rounded w-20"></div>
      <span className="text-gray-300 dark:text-zinc-600">•</span>
      <div className="h-4 bg-gray-200 dark:bg-zinc-700 rounded w-16"></div>
    </div>

    {/* Vote Buttons Skeleton */}
    <div className="flex items-center gap-3">
      <div className="h-8 bg-gray-200 dark:bg-zinc-700 rounded-full w-16"></div>
      <div className="h-8 bg-gray-200 dark:bg-zinc-700 rounded-full w-16"></div>
    </div>
  </div>
);

export default IdeaCardSkeleton;
