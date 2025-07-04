"use client";

import { DataTable } from "@/components/data-table";
import { MarkedScript, markedScriptsData } from "@/lib/data";
import { useRouter } from "next/navigation";
import ScriptCards from "@/components/scripts-cards";
import { columns } from "./components/columns";

const MarkedScripts = () => {
  const router = useRouter();
  const approvedCount = markedScriptsData.filter(
    (s) => s.status.toLowerCase() === "approved"
  ).length;
  const pendingCount = markedScriptsData.filter(
    (s) => s.status.toLowerCase() === "pending"
  ).length;
  return (
    <main className="flex flex-col gap-5 lg:px-[108px] md:px-[20] p-5 pt-10">
      <ScriptCards approvedCount={approvedCount} pendingCount={pendingCount} />
      <DataTable
        columns={columns}
        data={markedScriptsData}
        searchKey="scriptUploaded"
        tableName="Recently marked scripts"
        getId={(row) => row.studentId}
        onRowClick={(row: MarkedScript) =>
          router.push(`/marked-scripts/${row.studentId}`)
        }
      />
    </main>
  );
};

export default MarkedScripts;
