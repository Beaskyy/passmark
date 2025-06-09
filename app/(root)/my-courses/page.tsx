"use client"

import EmptyState from "@/components/empty-state";
import { coursesData } from "@/lib/courses";
import Image from "next/image";
import Link from "next/link";
import ManualBackground from "@/components/ManualBackground";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

const MyCourses = () => {
  const router = useRouter()
  return (
    <div className="lg:px-[108px] md:px-[20] p-5 pt-7">
      {coursesData ? (
        <div className="flex flex-col gap-[27px]">
          <div className="flex flex-col gap-[27px]">
            <Link href="/">
              <Image src="/images/back.svg" alt="back" width={44} height={44} />
            </Link>
            <div className="flex flex-col gap-1">
              <h4 className="text-black lg:text-[17px] text-sm lg:font-semibold font-medium">
                Select Course
              </h4>
              <p className="text-[#939393] lg:text-base text-sm">
                Select from existing course
              </p>
            </div>
          </div>
          <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-[18px]">
            {coursesData?.map(
              ({ code, id, title, year, yearColor, bgColor, pillBg }) => (
                <div
                  key={id}
                  className="relative py-[22px] px-[18px] rounded-[14px] h-[85px] shadow-sm bg-white overflow-hidden cursor-pointer"
                  onClick={() => router.push(`/my-courses/${id}`)}
                >
                  <div className="flex flex-col gap-1">
                    <h4 className="lg:text-[15px] text-sm text-[#474545] lg:font-semibold font-medium">
                      {title}
                    </h4>
                    <div className="flex items-center gap-1.5">
                      <p className="lg:text-[13px] text-xs text-[#929292] font-medium">
                        {code}
                      </p>
                      <div
                        className="w-[81px] h-5 py-0.5 px-2 text-xs font-medium rounded-lg"
                        style={{
                          backgroundColor: pillBg,
                          color: yearColor,
                        }}
                      >
                        {year}
                      </div>
                    </div>
                  </div>
                  <ManualBackground
                    color={bgColor}
                    className="absolute right-0 bottom-0"
                  />
                </div>
              )
            )}
          </div>
          <Link
            href={"/new-course"}
            className="mt-5 flex items-center gap-1 bg-gradient-to-t from-[#0068FF] to-[#0089FF] rounded-[10px] p-2.5 text-white lg:h-10 h-8 w-fit cursor-pointer hover:opacity-95 transition-all duration-300 lg:text-sm text-xs font-medium"
          >
            <Plus className="lg:size-5 size-4" />
            <span>Create New Course</span>
          </Link>
        </div>
      ) : (
        <EmptyState
          image="/images/corrupt-file.svg"
          title="My Courses"
          desc="No courses available, Kindly add one to get started"
          link="/new-course"
          buttonText="Create New Course"
          showIcon={true}
        />
      )}
    </div>
  );
};

export default MyCourses;
