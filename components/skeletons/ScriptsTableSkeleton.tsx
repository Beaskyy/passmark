import { Skeleton } from "@/components/ui/skeleton";

export default function ScriptsTableSkeleton() {
  return (
    <div className="w-full bg-white rounded-lg shadow-sm overflow-x-auto">
      <div className="min-w-[900px]">
        {/* Table header */}
        <div className="flex items-center border-b px-4 py-2 bg-[#F8F9FB]">
          <Skeleton className="w-5 h-5 mr-4" /> {/* Checkbox */}
          <Skeleton className="h-5 w-32 mr-4" /> {/* Script Uploaded */}
          <Skeleton className="h-5 w-24 mr-4" /> {/* Student's ID */}
          <Skeleton className="h-5 w-24 mr-4" /> {/* Student's Score */}
          <Skeleton className="h-5 w-32 mr-4" /> {/* Date Marked */}
          <Skeleton className="h-5 w-20 mr-4" /> {/* Status */}
          <Skeleton className="h-5 w-24" /> {/* Actions */}
        </div>
        {/* Table rows */}
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex items-center border-b px-4 py-3">
            <Skeleton className="w-5 h-5 mr-4" />
            <div className="flex items-center mr-4">
              <Skeleton className="w-8 h-8 rounded mr-2" />
              <Skeleton className="h-4 w-24" />
            </div>
            <Skeleton className="h-4 w-20 mr-4" />
            <Skeleton className="h-4 w-20 mr-4" />
            <Skeleton className="h-4 w-28 mr-4" />
            <Skeleton className="h-4 w-16 mr-4" />
            <div className="flex gap-2">
              <Skeleton className="h-8 w-20 rounded" />
              <Skeleton className="h-8 w-20 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
