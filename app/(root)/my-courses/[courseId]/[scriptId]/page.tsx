"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { columns } from "@/app/(root)/components/columns";
import { DataTable } from "@/components/data-table";
import EmptyState from "@/components/empty-state";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import ScriptsTableSkeleton from "@/components/skeletons/ScriptsTableSkeleton";
import { useFetchAssessmentDetails } from "@/hooks/useFetchAssessmentDetails";
import { useFetchAssessmentScriptList } from "@/hooks/useFetchAssessmentScriptList";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useDeleteAssessment } from "@/hooks/useDeleteAssessment";
import { useAcceptScript } from "@/hooks/useAcceptScript";
import { useQueryClient } from "@tanstack/react-query";

const ScriptId = ({
  params,
}: {
  params: { scriptId: string; courseId: string };
}) => {
  const { scriptId, courseId } = params;
  const router = useRouter();
  const { data, isLoading, isError, error } =
    useFetchAssessmentScriptList(scriptId);
  const { data: assessmentDetails, isLoading: isAssessmentLoading } =
    useFetchAssessmentDetails(scriptId);
  let tableData = data || [];
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const { mutate: deleteAssessment, isPending: isDeleting } =
    useDeleteAssessment();

  // Approve modal state and logic
  const [approveDialogOpen, setApproveDialogOpen] = useState(false);
  const [selectedScriptId, setSelectedScriptId] = useState<string | null>(null);
  const { mutate: acceptScript, isPending: isAccepting } = useAcceptScript();
  const queryClient = useQueryClient();

  const handleApprove = (script_id: string) => {
    setSelectedScriptId(script_id);
    setApproveDialogOpen(true);
  };

  const handleApproveConfirm = () => {
    if (!selectedScriptId) return;
    acceptScript(
      { script_id: selectedScriptId },
      {
        onSuccess: () => {
          toast.success("Script approved successfully");
          setApproveDialogOpen(false);
          setSelectedScriptId(null);
          queryClient.invalidateQueries({
            queryKey: ["assessmentScriptList", scriptId],
          });
        },
        onError: (error: any) => {
          toast.error(error.message || "Failed to approve script");
        },
      }
    );
  };

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
          <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
            <DropdownMenuTrigger className="lg:h-10 h-8 bg-[#F5F7FF] border border-[#F0F3FF] text-[#335CFF] lg:text-sm text-xs tracking-[1.5%] rounded-[10px] lg:font-semibold font-medium w-[122px] hover:bg-[#F0F3FF] hover:text-primary">
              More Options
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[183px] py-3">
              <DropdownMenuLabel
                onClick={() => {
                  router.push(
                    `/my-courses/${courseId}/assessments/edit/${assessmentDetails?.data?.assessment_id}`
                  );
                }}
                className="cursor-pointer"
              >
                <span className="lg:text-sm text-xs font-medium text-[#333333]">
                  Edit Assessment
                </span>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => setDeleteDialogOpen(true)}
                className="cursor-pointer"
              >
                <span className="text-sm font-medium text-[#F11B1B]">
                  Delete Assessment
                </span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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
            getId={(row) => row.script_id}
            onRowClick={(row: any) =>
              router.push(`/marked-scripts/${row.script_id}`)
            }
            meta={{ onApprove: handleApprove }}
          />
        </div>
      ) : (
        <EmptyState
          image="/images/empty-state.svg"
          title="No Marked Script"
          desc="You've not marked any script yet"
          link={`/my-courses/${courseId}/${scriptId}/upload-script`}
          buttonText="Mark New Script"
          showIcon={false}
        />
      )}

      {/* Approve Confirmation Dialog */}
      <Dialog open={approveDialogOpen} onOpenChange={setApproveDialogOpen}>
        <DialogContent
          className="max-w-[357px] px-5 py-4 text-center"
          style={{ borderRadius: "20px" }}
        >
          <div className="flex flex-col items-center">
            <div className="bg-[#FEEDE1] rounded-[10px] p-2 w-10 h-10 flex items-center justify-center mb-4">
              <Image
                src="/images/alert.svg"
                alt="alert"
                width={40}
                height={40}
              />
            </div>
            <DialogTitle className="text-base text-[#171717] font-semibold mb-2">
              Are you sure?
            </DialogTitle>
            <DialogDescription className="text-sm mb-6 text-[#8C8C8C]">
              Kindly confirm that you want to approve this script.
            </DialogDescription>
            <div className="flex gap-3 w-full justify-center">
              <DialogClose asChild>
                <Button
                  variant="outline"
                  className="w-1/2 border-none  lg:h-10 h-8 bg-[#F5F7FF] border border-[#F0F3FF] text-[#335CFF] lg:text-sm text-xs tracking-[1.5%] rounded-[10px] lg:font-semibold font-medium hover:bg-[#F0F3FF] hover:text-primary"
                >
                  No, Cancel
                </Button>
              </DialogClose>
              <Button
                className="w-1/2 bg-[#335CFF] hover:bg-[#2346A0] flex items-center gap-1 whitespace-nowrap bg-gradient-to-t from-[#0089FF] to-[#0068FF] rounded-[10px] p-2.5 text-white lg:h-10 h-8 cursor-pointer hover:opacity-95 transition-all duration-300 lg:text-sm text-xs lg:font-semibold font-medium"
                disabled={isAccepting}
                onClick={handleApproveConfirm}
              >
                {isAccepting ? "Approving..." : "Yes, Approve"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent
          className="max-w-[357px] px-5 py-4 text-center"
          style={{ borderRadius: "20px" }}
        >
          <div className="flex flex-col items-center">
            <div className="bg-[#FEEDE1] rounded-[10px] p-2 w-10 h-10 flex items-center justify-center mb-4">
              <Image
                src="/images/alert.svg"
                alt="alert"
                width={40}
                height={40}
              />
            </div>
            <DialogTitle className="text-base text-[#171717] font-semibold mb-2">
              Are you sure?
            </DialogTitle>
            <DialogDescription className="text-sm mb-6 text-[#8C8C8C]">
              Kindly confirm that you want to delete this assessment?
            </DialogDescription>
            <div className="flex gap-3 w-full justify-center">
              <DialogClose asChild>
                <Button
                  variant="outline"
                  className="w-1/2 border-none  lg:h-10 h-8 bg-[#F5F7FF] border border-[#F0F3FF] text-[#335CFF] lg:text-sm text-xs tracking-[1.5%] rounded-[10px] lg:font-semibold font-medium hover:bg-[#F0F3FF] hover:text-primary"
                >
                  No, Cancel
                </Button>
              </DialogClose>
              <Button
                className="w-1/2 bg-[#335CFF] hover:bg-[#2346A0] flex items-center gap-1 whitespace-nowrap bg-gradient-to-t from-[#0089FF] to-[#0068FF] rounded-[10px] p-2.5 text-white lg:h-10 h-8 cursor-pointer hover:opacity-95 transition-all duration-300 lg:text-sm text-xs lg:font-semibold font-medium"
                disabled={isDeleting}
                onClick={() => {
                  deleteAssessment(
                    { assessment_id: scriptId },
                    {
                      onSuccess: (data) => {
                        toast.success(
                          data.message || "Assessment deleted successfully"
                        );
                        setDeleteDialogOpen(false);
                        router.push(`/my-courses/${courseId}`);
                      },
                      onError: (error) => {
                        toast.error(
                          error.message || "Failed to delete assessment"
                        );
                      },
                    }
                  );
                }}
              >
                {isDeleting ? "Deleting..." : "Yes, Delete"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ScriptId;
