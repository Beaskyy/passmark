import { useAccount } from "@/providers/AccountProvider";
import { Plus } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Skeleton } from "./ui/skeleton";

export default function UserHeader() {
  const { data: session } = useSession();
  const { user, isLoading } = useAccount();
  return (
    <div className="flex lg:flex-row flex-col justify-between lg:items-center py-5 gap-4">
      <div className="flex items-center gap-[14px]">
        {isLoading || !user ? (
          <>
            <Skeleton className="rounded-full lg:size-12 size-8" />
            <div className="flex flex-col lg:gap-1 ml-3">
              <Skeleton className="w-24 h-6 mb-1" />
              <Skeleton className="w-32 h-4" />
            </div>
          </>
        ) : (
          <>
            <div className="flex justify-center items-center rounded-full lg:size-12 size-8 bg-[#C0D5FF] lg:text-[22px] text-base text-[#122368] font-bold uppercase">
              {`${user.firstname?.charAt(0)}` ||
                session?.user?.name?.split(" ")[0]?.charAt(0)}
            </div>
            <div className="flex flex-col lg:gap-1">
              <h5 className="lg:text-lg text-base text-[#171717] font-semibold">
                {user.firstname && user.lastname
                  ? `${user.firstname} ${user.lastname}`
                  : session?.user?.name || "User"}
              </h5>
              <div className="lg:text-sm text-xs text-[#878787] font-medium">
                What are you grading today?
              </div>
            </div>
          </>
        )}
      </div>
      <Link
        href={"/new-course"}
        className="flex items-center gap-1 bg-gradient-to-t from-[#0089FF] to-[#0068FF] rounded-[10px] p-2.5 text-white lg:h-10 h-8 w-fit cursor-pointer hover:opacity-95 transition-all duration-300 lg:text-sm text-xs font-medium"
      >
        <Plus className="lg:size-5 size-4" />
        <span>Create New Course</span>
      </Link>
    </div>
  );
}
