import { Skeleton } from "@/components/ui/skeleton";

const MyCoursesSkeleton = () => (
  <div className="flex flex-col gap-[27px] lg:px-[108px] md:px-[20] p-5 pt-7">
    <div className="flex flex-col gap-[27px]">
      <div className="w-[44px] h-[44px]">
        <Skeleton className="w-full h-full rounded-full" />
      </div>
      <div className="flex flex-col gap-1">
        <Skeleton className="w-40 h-6" />
        <Skeleton className="w-60 h-4" />
      </div>
    </div>
    <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-[18px]">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="relative py-[22px] px-[18px] rounded-[14px] minh-[85px] shadow-sm bg-white overflow-hidden"
        >
          <div className="flex flex-col gap-1">
            <Skeleton className="w-32 h-5 mb-2" />
            <div className="flex items-center gap-1.5">
              <Skeleton className="w-16 h-4" />
              <Skeleton className="w-[81px] h-5 rounded-lg" />
            </div>
          </div>
          <div className="absolute right-0 bottom-0">
            <Skeleton className="w-16 h-8 rounded-lg" />
          </div>
        </div>
      ))}
    </div>
    <div className="mt-5 w-48 h-10">
      <Skeleton className="w-full h-full rounded-[10px]" />
    </div>
  </div>
);

export default MyCoursesSkeleton;
