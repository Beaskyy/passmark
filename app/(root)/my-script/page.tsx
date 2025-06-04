"use client";

import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const MyScript = () => {
  const router = useRouter();
  return (
    <main className="lg:px-[108px] md:px-[20] p-5">
      <div className="flex justify-between lg:items-center  gap-4">
        <Link href="/new-course">
          <Image src="/images/back.svg" alt="back" width={44} height={44} />
        </Link>
        <Image src="/images/spinner.svg" alt="spinner" width={32} height={32} />
      </div>
      <div className="flex justify-center items-center">
        <div className="flex flex-col gap-[31px]">
          <div className="flex flex-col gap-1.5 text-center">
            <h2 className="lg:text-lg text-base text-[#171717] font-semibold">
              Add Students
            </h2>
            <p className="lg:text-sm text-xs text-[#5C5C5C]">
              Select how you’d like to add students
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex flex-col gap-4">
              <div className="relative py-[22px] px-[18px] rounded-[14px] h-[85px] shadow-sm bg-white">
                <div className="flex flex-col gap-1">
                  <h4 className="text-[15px] text-sm text-[#474545] font-semibold">
                    Add Manually
                  </h4>
                  <p className="lg:text-[13px] text-xs text-[#929292] font-medium">
                    Add students one after the other
                  </p>
                </div>
                <Image
                  src="/images/manual-bg.svg"
                  alt="manual"
                  width={102.7952033403981}
                  height={102.10327829710428}
                  className="absolute right-0 bottom-0"
                />
              </div>
              <div className="relative py-[22px] px-[18px] rounded-[14px] h-[85px] shadow-sm bg-white">
                <div className="flex flex-col gap-1">
                  <h4 className="text-[15px] text-sm text-[#474545] font-semibold">
                    Add Students Bulk
                  </h4>
                  <p className="lg:text-[13px] text-xs text-[#929292] font-medium">
                    Upload a CSV file of all your students at once
                  </p>
                </div>
                <Image
                  src="/images/bulk-bg.svg"
                  alt="bulk"
                  width={102.7952033403981}
                  height={102.10327829710428}
                  className="absolute right-0 bottom-0"
                />
              </div>
            </div>
            <div className="flex items-center p-2.5 rounded-xl bg-[#F5F7FF] gap-2">
              <Image src="/images/info.svg" alt="info" width={28} height={28} />
              <p className="lg:text-sm text-xs text-[#5F5F5F] font-medium max-w-[321px]">
                Skipping student upload means your marked sheet won’t be linked
                to any student
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-center items-center">

      <Button
        className="mt-20 md:text-[13px] text-xs rounded-[10px] py-2.5 px-6 bg-gradient-to-t from-[#0068FF] to-[#0089FF]"
        onClick={() => router.push("/new-student")}
      >
        Skip
      </Button>
      </div>
    </main>
  );
};

export default MyScript;
