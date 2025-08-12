"use client";

import EmptyState from "@/components/empty-state";
import Image from "next/image";
import Link from "next/link";
import ManualBackground from "@/components/ManualBackground";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useFetchCourses } from "@/hooks/useFetchCourses";
import MyCoursesSkeleton from "@/components/skeletons/MyCoursesSkeleton";
import { useSession } from "next-auth/react";

const colorSchemes = [
  {
    yearColor: "#335CFF",
    bgColor: "#F0FAFF",
    pillBg: "#EBF1FF",
  },
  {
    yearColor: "#FA7319",
    bgColor: "#FFF0F0",
    pillBg: "#FFF3EB",
  },
  {
    yearColor: "#FB4BA3",
    bgColor: "#FFF0F6",
    pillBg: "#FFEBF4",
  },
  {
    yearColor: "#7D52F4",
    bgColor: "#EFEBFF",
    pillBg: "#EFEBFF",
  },
  {
    yearColor: "#F6B51E",
    bgColor: "#FFF7E0",
    pillBg: "#FFFAEB",
  },
  {
    yearColor: "#1FC16B",
    bgColor: "#F4F9F0",
    pillBg: "#E0FAEC",
  },
];

const MyCourses = () => {
  const router = useRouter();
  const { data: courses, isLoading, isError, error } = useFetchCourses();
  const { status } = useSession();

  if (status === "loading" || isLoading) return <MyCoursesSkeleton />;
  if (status === "unauthenticated") {
    router.push("/login");
    return null;
  }
  if (isError) return <p>Error fetching senders: {error.message}</p>;

  return (
    <div className="lg:px-[108px] md:px-[20] p-5 pt-7">
      {courses && courses.length === 0 ? (
        <EmptyState
          image="/images/corrupt-file.svg"
          title="My Courses"
          desc="No courses available, Kindly add one to get started"
          link="/new-course"
          buttonText="Create New Course"
          showIcon={true}
        />
      ) : (
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
            {courses?.map(({ code, course_id, title, session }, idx) => {
              const color = colorSchemes[idx % colorSchemes.length];
              return (
                <div
                  key={course_id}
                  className="relative py-[22px] px-[18px] rounded-[14px] minh-[85px] shadow-sm hover:shadow-md bg-white overflow-hidden cursor-pointer"
                  onClick={() => router.push(`/my-courses/${course_id}`)}
                >
                  <div className="flex flex-col gap-1">
                    <h4 className="lg:text-[15px] text-sm text-[#474545] lg:font-semibold font-medium">
                      {title}
                    </h4>
                    <div className="flex items-center gap-1.5">
                      <p className="lg:text-[13px] text-xs text-[#929292] font-medium uppercase">
                        {code}
                      </p>
                     {session &&  <div
                        className="w-[81px] h-5 py-0.5 px-2 text-xs font-medium rounded-lg"
                        style={{
                          backgroundColor: color.pillBg,
                          color: color.yearColor,
                        }}
                      >
                        {session}
                      </div>}
                    </div>
                  </div>
                  <ManualBackground
                    color={color.bgColor}
                    className="absolute right-0 bottom-0"
                  />
                </div>
              );
            })}
          </div>
          <Link
            href={"/new-course"}
            className="mt-5 flex items-center gap-1 bg-gradient-to-t from-[#0068FF] to-[#0089FF] rounded-[10px] p-2.5 text-white lg:h-10 h-8 w-fit cursor-pointer hover:opacity-95 transition-all duration-300 lg:text-sm text-xs font-medium"
          >
            <Plus className="lg:size-5 size-4" />
            <span>Create New Course</span>
          </Link>
        </div>
      )}
    </div>
  );
};

export default MyCourses;
