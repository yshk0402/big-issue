
const VoteSkeleton = () => (
  <div className="w-full max-w-4xl mx-auto animate-pulse">
    {/* Question Skeleton */}
    <div className="h-10 bg-gray-200 dark:bg-zinc-700 rounded w-3/4 mx-auto mb-6"></div>
    <div className="h-6 bg-gray-200 dark:bg-zinc-700 rounded w-1/2 mx-auto mb-12"></div>

    {/* Chart and Buttons Skeleton */}
    <div className="bg-white dark:bg-zinc-800/50 rounded-xl shadow-lg border border-slate-200 dark:border-zinc-800 p-6 md:p-8">
      {/* Bar Chart Skeleton */}
      <div className="space-y-4 mb-8">
        <div className="flex items-center gap-4">
          <div className="h-8 bg-gray-200 dark:bg-zinc-700 rounded w-16"></div>
          <div className="h-8 bg-gray-300 dark:bg-zinc-600 rounded-full flex-grow"></div>
          <div className="h-8 bg-gray-200 dark:bg-zinc-700 rounded w-12"></div>
        </div>
        <div className="flex items-center gap-4">
          <div className="h-8 bg-gray-200 dark:bg-zinc-700 rounded w-16"></div>
          <div className="h-8 bg-gray-300 dark:bg-zinc-600 rounded-full flex-grow"></div>
          <div className="h-8 bg-gray-200 dark:bg-zinc-700 rounded w-12"></div>
        </div>
      </div>

      {/* Buttons Skeleton */}
      <div className="flex justify-center gap-4">
        <div className="h-12 bg-gray-200 dark:bg-zinc-700 rounded-lg w-32"></div>
        <div className="h-12 bg-gray-200 dark:bg-zinc-700 rounded-lg w-32"></div>
      </div>
    </div>
  </div>
);

export default VoteSkeleton;
