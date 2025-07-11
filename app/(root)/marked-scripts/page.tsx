"use client";

import { DataTable } from "@/components/data-table";
import { MarkedScript } from "@/lib/data";
import { useRouter } from "next/navigation";
import ScriptCards from "@/components/scripts-cards";
import { columns } from "./components/columns";
import { useFetchScripts } from "@/hooks/useFetchScripts";
import { useAccount } from "@/providers/AccountProvider";
import ScriptsTableSkeleton from "@/components/skeletons/ScriptsTableSkeleton";
import { useState } from "react";
import { useAcceptScript } from "@/hooks/useAcceptScript";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import dynamic from "next/dynamic";

const MarkedScripts = () => {
  const router = useRouter();
  const { user } = useAccount();
  const organisationId = user?.organisation?.org_id;
  const { data = [], isLoading } = useFetchScripts(organisationId);
  const approvedCount = data.filter(
    (s) => s.status.toLowerCase() === "approved"
  ).length;
  const pendingCount = data.filter(
    (s) => s.status.toLowerCase() === "pending"
  ).length;

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
            queryKey: ["scripts", organisationId],
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

  return (
    <main className="flex flex-col gap-5 lg:px-[108px] md:px-[20] p-5 pt-10">
      <ScriptCards approvedCount={approvedCount} pendingCount={pendingCount} />
      {isLoading ? (
        <ScriptsTableSkeleton />
      ) : (
        <>
          <DataTable
            columns={columns}
            data={data}
            searchKey="file_name"
            tableName="Recently marked scripts"
            getId={(row) => row.student.student_id}
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
};

export default MarkedScripts;
