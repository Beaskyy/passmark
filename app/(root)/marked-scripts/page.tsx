"use client";

import { DataTable } from "@/components/data-table";
import { MarkedScript } from "@/lib/data";
import { useRouter } from "next/navigation";
import ScriptCards from "@/components/scripts-cards";
import { columns } from "./components/columns";
import { useFetchScripts } from "@/hooks/useFetchScripts";
import { useAccount } from "@/providers/AccountProvider";
import ScriptsTableSkeleton from "@/components/skeletons/ScriptsTableSkeleton";

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
  return (
    <main className="flex flex-col gap-5 lg:px-[108px] md:px-[20] p-5 pt-10">
      <ScriptCards approvedCount={approvedCount} pendingCount={pendingCount} />
      {isLoading ? (
        <ScriptsTableSkeleton />
      ) : (
        <DataTable
          columns={columns}
          data={data}
          searchKey="file_name"
          tableName="Recently marked scripts"
          getId={(row) => row.student.student_id}
          onRowClick={(row: MarkedScript) =>
            router.push(`/marked-scripts/${row.student.student_id}`)
          }
        />
      )}
    </main>
  );
};

export default MarkedScripts;
