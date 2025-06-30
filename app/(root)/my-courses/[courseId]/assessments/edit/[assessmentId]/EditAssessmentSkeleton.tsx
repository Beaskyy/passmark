import { Skeleton } from "@/components/ui/skeleton";

const EditAssessmentSkeleton = () => {
  return (
    <main className="lg:px-[108px] md:px-[20] p-5 bg-white min-h-screen animate-pulse">
      {/* Header */}
      <div className="flex justify-between lg:items-center gap-4 mb-6">
        <div className="flex items-center gap-3 mt-2">
          <Skeleton className="w-11 h-11 rounded-full" />
          <Skeleton className="w-40 h-8 rounded" />
        </div>
        <Skeleton className="w-24 h-10 rounded" />
      </div>
      {/* Title & Description */}
      <div className="mb-8">
        <Skeleton className="w-1/2 h-8 mb-3 rounded" />
        <Skeleton className="w-full h-6 rounded mb-2" />
        <Skeleton className="w-2/3 h-6 rounded" />
      </div>
      {/* Questions */}
      <div className="space-y-8">
        {[1, 2].map((q) => (
          <div key={q} className="border rounded-lg p-6 space-y-4">
            <div className="flex gap-4 items-center">
              <Skeleton className="w-8 h-8 rounded" />
              <Skeleton className="w-1/3 h-6 rounded" />
              <Skeleton className="w-1/4 h-6 rounded" />
            </div>
            {/* Question text */}
            <Skeleton className="w-full h-6 rounded" />
            {/* Marking Guides */}
            <div className="space-y-2">
              <Skeleton className="w-1/4 h-5 rounded" />
              {[1, 2].map((i) => (
                <div key={i} className="flex gap-2">
                  <Skeleton className="w-1/3 h-5 rounded" />
                  <Skeleton className="w-1/6 h-5 rounded" />
                  <Skeleton className="w-1/2 h-5 rounded" />
                </div>
              ))}
            </div>
            {/* Penalties */}
            <div className="space-y-2">
              <Skeleton className="w-1/4 h-5 rounded" />
              {[1].map((i) => (
                <div key={i} className="flex gap-2">
                  <Skeleton className="w-2/3 h-5 rounded" />
                  <Skeleton className="w-1/6 h-5 rounded" />
                </div>
              ))}
            </div>
            {/* Bonuses */}
            <div className="space-y-2">
              <Skeleton className="w-1/4 h-5 rounded" />
              {[1].map((i) => (
                <div key={i} className="flex gap-2">
                  <Skeleton className="w-2/3 h-5 rounded" />
                  <Skeleton className="w-1/6 h-5 rounded" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
};

export default EditAssessmentSkeleton;
