import { Skeleton } from "@/components/ui/skeleton";

const ProfileSkeleton = () => (
  <div className="lg:px-[108px] md:px-[20] p-5 pt-7">
    <div className="flex flex-col gap-[34px]">
      {/* Profile Header */}
      <div className="flex flex-col gap-3">
        <Skeleton className="w-32 h-6 mb-2" />
        <div className="flex lg:flex-row flex-col justify-between lg:items-center py-4 px-[22px] bg-[#F0F3FF] rounded-[10px] gap-4">
          <div className="flex items-center gap-[18px]">
            <Skeleton className="w-8 h-8 rounded-full" />
            <div className="flex flex-col gap-1">
              <Skeleton className="w-32 h-5" />
              <Skeleton className="w-40 h-4" />
            </div>
          </div>
          <Skeleton className="w-36 h-10 rounded-[10px]" />
        </div>
      </div>
      {/* Overview Cards */}
      <div className="flex flex-col gap-3">
        <Skeleton className="w-32 h-6 mb-2" />
        <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-3.5">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="flex justify-between items-center bg-white shadow-sm p-[22px] rounded-[10px]"
            >
              <div className="flex flex-col gap-2">
                <Skeleton className="w-24 h-5" />
                <Skeleton className="w-28 h-4" />
              </div>
              <Skeleton className="w-11 h-11 rounded-full" />
            </div>
          ))}
        </div>
      </div>
      {/* Contact Support */}
      <div className="flex flex-col gap-3">
        <Skeleton className="w-32 h-6 mb-2" />
        <div className="bg-white shadow-sm p-[14.7px] rounded-[8.4px]">
          <div className="flex flex-col gap-2">
            <Skeleton className="w-28 h-4" />
            <div className="flex justify-between w-[269px] mt-2">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="w-6 h-6 rounded-full" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default ProfileSkeleton;
