"use client";

import UserHeader from "../../components/user-header";
import ActionCards from "../../components/action-cards";
import { DataTable } from "@/components/data-table";
import { MarkedScript } from "@/lib/data";
import { columns } from "./components/columns";
import { useRouter } from "next/navigation";
import EmptyState from "@/components/empty-state";
import ScriptsTableSkeleton from "@/components/skeletons/ScriptsTableSkeleton";
import { useFetchOrganisationScriptList } from "@/hooks/useFetchOrganisationScriptList";
import { useState } from "react";
import { useAcceptScript } from "@/hooks/useAcceptScript";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import dynamic from "next/dynamic";

export default function Home() {
  const router = useRouter();
  const {
    data: scripts,
    isLoading,
    isError,
  } = useFetchOrganisationScriptList();

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
            queryKey: ["organisationScriptList"],
          });
        },
        onError: (error: any) => {
          toast.error(error.message || "Failed to approve script");
        },
      }
    );
  };

  // Dynamically import Dialog to avoid SSR issues
  const Dialog = dynamic(
    () => import("@/components/ui/dialog").then((mod) => mod.Dialog),
    { ssr: false }
  );
  const DialogContent = dynamic(
    () => import("@/components/ui/dialog").then((mod) => mod.DialogContent),
    { ssr: false }
  );
  const DialogTitle = dynamic(
    () => import("@/components/ui/dialog").then((mod) => mod.DialogTitle),
    { ssr: false }
  );
  const DialogDescription = dynamic(
    () => import("@/components/ui/dialog").then((mod) => mod.DialogDescription),
    { ssr: false }
  );
  const DialogClose = dynamic(
    () => import("@/components/ui/dialog").then((mod) => mod.DialogClose),
    { ssr: false }
  );
  const Button = dynamic(
    () => import("@/components/ui/button").then((mod) => mod.Button),
    { ssr: false }
  );
  const Image = dynamic(() => import("next/image"), { ssr: false });

  // Pass approve handler to DataTable via meta prop
  return (
    <main className="flex flex-col gap-5 lg:px-[108px] md:px-[20] px-5">
      <UserHeader />
      <ActionCards />
      {isLoading ? (
        <ScriptsTableSkeleton />
      ) : isError ? (
        <div>Error loading scripts.</div>
      ) : !scripts || scripts.length === 0 ? (
        <EmptyState
          image="/images/empty-state.svg"
          title="No Marked Script"
          desc="You've not marked any script yet"
          link="/assessment"
          buttonText="Mark New Script"
          showIcon={false}
        />
      ) : (
        <>
          <DataTable
            columns={columns}
            data={scripts}
            searchKey="scriptUploaded"
            tableName="Recently marked scripts"
            getId={(row) => row.student_id}
            meta={{ onApprove: handleApprove }}
          />
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
        </>
      )}
    </main>
  );
}
