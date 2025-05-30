import { Plus } from "lucide-react";
import Image from "next/image";

export default function Home() {
  return (
    <main className="">
      <div className="flex lg:flex-row flex-col justify-between lg:items-center py-5 gap-4">
        <div className="flex items-center gap-[14px]">
          <div className="flex justify-center items-center rounded-full lg:size-12 size-8 bg-[#C0D5FF] lg:text-[22px] text-base text-[#122368] font-bold">
            G
          </div>
          <div className="flex flex-col lg:gap-1">
            <h5 className="lg:text-lg text-base text-[#171717] font-semibold">
              George Chris
            </h5>
            <p className="lg:text-sm text-xs text-[#878787] font-medium">
              What are you marking today?
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1 bg-gradient-to-t from-[#0068FF] to-[#0089FF] rounded-[10px] p-2.5 text-white lg:h-10 h-8 w-fit cursor-pointer hover:opacity-95 transition-all duration-300 lg:text-sm text-xs lg:font-semibold font-medium">
          <Plus className="lg:size-5 size-4" />
          <span>Create New Course</span>
        </div>
      </div>
      <div className="grid lg:grid-cols-2 grid-cols-1 gap-[14px]">
        <div className="flex justify-between items-center bg-[#F0F3FF] lg:p-[22px] p-3 rounded-[10px]">
          <div className="flex flex-col lg:gap-2">
            <h4 className="text-black lg:text-base text-sm lg:font-bold font-medium">
              Mark a New Script
            </h4>
            <p className="lg:text-base text-[10px] text-[#939393] lg:font-medium font-normal">
              Upload and mark a script
            </p>
          </div>
          <Image src="/images/book.svg" alt="book" width={44} height={44} className="lg:size-11 size-8" />
        </div>
        <div className="flex justify-between items-center bg-[#F0F3FF] lg:p-[22px] p-3 rounded-[10px]">
          <div className="flex flex-col lg:gap-2">
            <h4 className="text-black lg:text-base text-sm lg:font-bold font-medium">
              Manage Marked Scripts
            </h4>
            <p className="lg:text-base text-[10px] text-[#939393] lg:font-medium font-normal">
              Reject, Approve an already marked script
            </p>
          </div>
          <Image src="/images/book-2.svg" alt="book" width={44} height={44} className="lg:size-11 size-8" />
        </div>
      </div>
    </main>
  );
}
