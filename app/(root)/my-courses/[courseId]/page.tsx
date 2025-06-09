import EmptyState from "@/components/empty-state";
import { Button } from "@/components/ui/button";
import { assessments, coursesData } from "@/lib/courses";
import { Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const CourseId = ({ params }: { params: { courseId: string } }) => {
  const { courseId } = params;
  return (
    <div className="lg:px-[108px] md:px-[20] p-5 pt-7">
      {assessments ? (
        <div className="flex flex-col gap-[27px]">
          <div className="flex lg:flex-row flex-col justify-between lg:items-center gap-7">
            <div className="flex gap-[27px]">
              <Link href="/my-courses">
                <Image
                  src="/images/back.svg"
                  alt="back"
                  width={44}
                  height={44}
                />
              </Link>
              <div className="flex flex-col gap-1">
                <h4 className="text-black lg:text-[17px] text-sm lg:font-semibold font-medium">
                  BSE 101
                </h4>
                <p className="text-[#939393] lg:text-base text-sm">
                  Introduction to Business Education
                </p>
              </div>
            </div>
            <div className="flex items-center gap-[14px]">
              <Link
                href={"/new-course"}
                className="flex items-center gap-1 bg-gradient-to-t from-[#0089FF] to-[#0068FF] rounded-[10px] p-2.5 text-white lg:h-10 h-8 w-fit cursor-pointer hover:opacity-95 transition-all duration-300 lg:text-sm text-xs lg:font-semibold font-medium
                "
              >
                <span>Create Assessment</span>
              </Link>
              <Button className="lg:h-10 h-8 w-fit bg-[#F5F7FF] border border-[#F0F3FF] text-[#335CFF] lg:text-sm text-xs tracking-[1.5%] hover:text-[#F5F7FF] hover:bg-primary rounded-[10px] lg:font-semibold font-medium">
                More Options
              </Button>
            </div>
          </div>
          <div className="mt-10 grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-[18px]">
            {assessments?.map(({ id, title, year, yearColor, pillBg }) => (
              <div
                key={id}
                className="relative py-[22px] px-[18px] rounded-[14px] h-[57px] shadow-sm bg-white overflow-hidden cursor-pointer"
              >
                <div className="flex justify-between items-center gap-1">
                  <h4 className="lg:text-[15px] text-xs text-[#474545] lg:font-semibold font-medium">
                    {title}
                  </h4>
                  <div className="flex items-center gap-1.5">
                    <div
                      className="h-5 py-0.5 px-2 text-xs font-medium rounded-lg w-fit"
                      style={{
                        backgroundColor: pillBg,
                        color: yearColor,
                      }}
                    >
                      {year}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <EmptyState
          image="/images/empty-state.svg"
          title="No Assessment"
          desc="You’ve not added any assessment yet"
          link="/assessment"
          buttonText="Create Assessment"
          showIcon={false}
        />
      )}
    </div>
  );
};

export default CourseId;
