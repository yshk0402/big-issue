const DesktopHomeSkeleton = () => (
  <div className="w-full max-w-4xl mx-auto text-center animate-pulse">
    {/* Title Skeleton */}
    <div className="mb-10">
      <div className="h-10 bg-gray-200 dark:bg-zinc-700 rounded w-3/4 mx-auto mb-4"></div>
      <div className="h-6 bg-gray-200 dark:bg-zinc-700 rounded w-1/2 mx-auto"></div>
    </div>
    {/* Card Skeletons */}
    <div className="grid grid-cols-3 gap-4 mb-10 w-full">
      <div className="h-32 bg-gray-200 dark:bg-zinc-800/50 rounded-2xl"></div>
      <div className="h-32 bg-gray-200 dark:bg-zinc-800/50 rounded-2xl"></div>
      <div className="h-32 bg-gray-200 dark:bg-zinc-800/50 rounded-2xl"></div>
    </div>
    {/* Form Skeleton */}
    <div className="w-full flex flex-col items-center mt-6">
      <div className="w-full max-w-2xl">
        <div className="h-16 bg-gray-200 dark:bg-zinc-800/50 rounded-xl"></div>
      </div>
    </div>
  </div>
);

export default DesktopHomeSkeleton;
