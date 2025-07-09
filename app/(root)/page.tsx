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

export default function Home() {
  const router = useRouter();
  const { data: scripts, isLoading, isError } = useFetchOrganisationScriptList();

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
        <DataTable
          columns={columns}
          data={scripts}
          searchKey="scriptUploaded"
          tableName="Recently marked scripts"
          getId={(row) => row.student_id}
          onRowClick={(row: MarkedScript) =>
            router.push(`/marked-scripts/${row.student_id}`)
          }
        />
      )}
    </main>
  );
}
