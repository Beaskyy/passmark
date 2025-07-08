"use client";

import { columns } from "@/app/(root)/components/columns";
import { DataTable } from "@/components/data-table";
import EmptyState from "@/components/empty-state";
import { Button } from "@/components/ui/button";
import { assessments, coursesData } from "@/lib/courses";
import { markedScriptsData } from "@/lib/data";
import { Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import ScriptsTableSkeleton from "@/components/skeletons/ScriptsTableSkeleton";
import { useFetchAssessmentDetails } from "@/hooks/useFetchAssessmentDetails";
import { useFetchAssessmentScriptList } from "@/hooks/useFetchAssessmentScriptList";

const ScriptId = ({
  params,
}: {
  params: { scriptId: string; courseId: string };
}) => {
  const { scriptId, courseId } = params;
  const router = useRouter();
  const { data, isLoading, isError, error } = useFetchAssessmentScriptList(scriptId)
  const { data: assessmentDetails, isLoading: isAssessmentLoading } =
    useFetchAssessmentDetails(scriptId);
  let tableData = data || [];

  return (
    <div className="lg:px-[108px] md:px-[20] p-5 pt-7">
      <div className="flex lg:flex-row flex-col justify-between lg:items-center gap-7">
        <div className="flex items-center gap-[27px]">
          <div className="cursor-pointer" onClick={() => router.back()}>
            <Image src="/images/back.svg" alt="back" width={44} height={44} />
          </div>
          <div className="flex flex-col gap-1">
            <h4 className="text-black lg:text-[17px] text-sm lg:font-semibold font-medium">
              {isAssessmentLoading ? (
                <div className="h-5 w-40 bg-gray-200 animate-pulse rounded" />
              ) : (
                assessmentDetails?.data?.description || "Assessment"
              )}
            </h4>
          </div>
        </div>
        <div className="flex items-center gap-[14px]">
          <Link
            href={`/my-courses/${courseId}/${scriptId}/upload-script`}
            className="flex items-center gap-1 bg-gradient-to-t from-[#0089FF] to-[#0068FF] rounded-[10px] p-2.5 text-white lg:h-10 h-8 w-fit cursor-pointer hover:opacity-95 transition-all duration-300 lg:text-sm text-xs lg:font-semibold font-medium
                "
          >
            <span>Mark New Script</span>
          </Link>
          <Button className="lg:h-10 h-8 w-fit bg-[#F5F7FF] border border-[#F0F3FF] text-[#335CFF] lg:text-sm text-xs tracking-[1.5%] hover:text-[#F5F7FF] hover:bg-primary rounded-[10px] lg:font-semibold font-medium">
            More Options
          </Button>
        </div>
      </div>
      {isLoading ? (
        <div className="mt-10">
          <ScriptsTableSkeleton />
        </div>
      ) : isError ? (
        <div className="mt-10 text-red-500">
          {error?.message || "Error loading scripts"}
        </div>
      ) : tableData && tableData.length > 0 ? (
        <div className="flex flex-col gap-[27px] mt-10">
          <DataTable
            columns={columns}
            data={tableData}
            searchKey="scriptUploaded"
            tableName="Recently marked scripts"
            getId={(row) => row.student_id}
            onRowClick={(row: any) =>
              router.push(`/marked-scripts/${row.studentId}`)
            }
          />
        </div>
      ) : (
        <EmptyState
          image="/images/empty-state.svg"
          title="No Marked Script"
          desc="You've not marked any script yet"
          link="/assessment"
          buttonText="Mark New Script"
          showIcon={false}
        />
      )}
    </div>
  );
};

export default ScriptId;
