"use client";

import UserHeader from "../../components/user-header";
import ActionCards from "../../components/action-cards";
import { DataTable } from "@/components/data-table";
import { markedScriptsData, MarkedScript } from "../../lib/data";
import { columns } from "./components/columns";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <main className="flex flex-col gap-5 lg:px-[108px] md:px-[20] px-5">
      <UserHeader />
      <ActionCards />
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
}
