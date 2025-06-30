import { Skeleton } from "@/components/ui/skeleton";

const EditStudentsSkeleton = () => {
  return (
    <main className="lg:px-[108px] md:px-[20] p-5 bg-white min-h-screen">
      <div className="flex justify-between lg:items-center gap-4">
        <div className="flex items-center gap-3 mt-2">
          <Skeleton className="w-11 h-11 rounded-lg" /> {/* Back button */}
          <Skeleton className="h-6 w-32" /> {/* Title */}
        </div>
        <Skeleton className="w-8 h-8" /> {/* Loading spinner */}
      </div>

      <div className="flex flex-col gap-3.5 mt-6">
        <Skeleton className="h-5 w-28" /> {/* Section title */}
        {/* Student entries - showing 3 skeleton items */}
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-3.5"
          >
            <div className="flex flex-col gap-1">
              <Skeleton className="h-5 w-20" /> {/* Label */}
              <Skeleton className="h-10 w-full rounded-md" /> {/* Input */}
            </div>
            <div className="flex flex-col gap-1">
              <Skeleton className="h-5 w-24" /> {/* Label */}
              <div className="flex items-center gap-3.5">
                <div className="flex-1">
                  <Skeleton className="h-10 w-full rounded-md" /> {/* Input */}
                </div>
                <Skeleton className="h-8 w-8 rounded-lg" />{" "}
                {/* Delete button */}
              </div>
            </div>
          </div>
        ))}
        {/* Add new student button */}
        <Skeleton className="h-6 w-36 mt-2" />
      </div>

      {/* Continue button */}
      <Skeleton className="h-10 w-24 rounded-[10px] md:mt-40 mt-20" />
    </main>
  );
};

export default EditStudentsSkeleton;
