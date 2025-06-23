import { Skeleton } from "@/components/ui/skeleton";

const CourseDetailsSkeleton = () => {
  return (
    <div className="lg:px-[108px] md:px-[20] p-5 pt-7">
      <div className="flex lg:flex-row flex-col justify-between lg:items-center gap-7">
        <div className="flex gap-[27px]">
          <Skeleton className="h-11 w-11 rounded-lg" />
          <div className="flex flex-col gap-1">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-4 w-48" />
          </div>
        </div>
        <div className="flex items-center gap-[14px]">
          <Skeleton className="h-10 w-36" />
          <Skeleton className="h-10 w-[122px]" />
        </div>
      </div>

      <div className="flex flex-col gap-[27px]">
        <div className="mt-10 grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-[18px]">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-[57px] rounded-[14px] w-full" />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CourseDetailsSkeleton;
