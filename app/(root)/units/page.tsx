"use client";

import Image from "next/image";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { DataTable } from "@/components/data-table";
import { columns } from "./components/columns";
import { useFetchOrganisationPaymentTransactions } from "@/hooks/useFetchOrganisationPaymentTransactions";
import ScriptsTableSkeleton from "@/components/skeletons/ScriptsTableSkeleton";
import EmptyState from "@/components/empty-state";
import { useState } from "react";
import { UnitHistory } from "@/lib/data";
import { formatDate } from "./components/columns";
import { useFetchOrganisationCreditBalance } from "@/hooks/useFetchOrganisationCreditBalance";

const Units = () => {
  const router = useRouter();
  const [units, setUnits] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!units) {
      setError("Units is required");
      return;
    }
    setError("");
    // Continue with submit logic
  };
  // Remove useAccount and useFetchScripts
  // const { user } = useAccount();
  // const organisationId = user?.organisation?.org_id;
  // const { data = [], isLoading } = useFetchScripts(organisationId);

  const { data, isLoading } = useFetchOrganisationPaymentTransactions();
  const { data: creditBalance, isLoading: isCreditLoading } =
    useFetchOrganisationCreditBalance();

  return (
    <div className="lg:px-[108px] md:px-[20] p-5 pt-7">
      <div className="flex flex-col gap-[34px]">
        <div className="flex flex-col gap-3">
          <div className="flex justify-between lg:items-center gap-4 mt-2">
            <Image
              src="/images/back.svg"
              alt="back"
              width={44}
              height={44}
              onClick={() => router.back()}
            />
          </div>
          <div className="flex lg:flex-row flex-col justify-between lg:items-center py-4 px-[22px] bg-[#F0F3FF] rounded-[10px] gap-4">
            <div className="flex flex-col">
              <h5 className="text-[#171717] lg:text-base text-sm font-semibold">
                {isCreditLoading ? (
                  <span className="inline-block w-24 h-6 bg-gray-200 animate-pulse rounded" />
                ) : creditBalance?.current_balance ? (
                  Number(creditBalance.current_balance).toLocaleString()
                ) : (
                  "0"
                )}
              </h5>
              <p className="text-[#737373] lg:text-sm text-xs">My Units</p>
            </div>
            <Dialog>
              <DialogTrigger className="flex items-center gap-1 bg-gradient-to-t from-[#0089FF] to-[#0068FF] rounded-[10px] p-2.5 text-white lg:h-10 h-8 w-fit cursor-pointer hover:opacity-95 transition-all duration-300 lg:text-sm text-xs font-medium">
                <Plus className="lg:size-5 size-4" />
                <span>Buy More Units</span>
              </DialogTrigger>

              <DialogContent className="flex flex-col gap-10 w-[336px]">
                <DialogHeader>
                  <DialogTitle className="text-[#111827] lg:text-xl text-balance font-semibold tracking-[-1%]">
                    Buy Units
                  </DialogTitle>
                </DialogHeader>
                <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
                  <div className="flex flex-col gap-[7px]">
                    <Label htmlFor="units" className="text-sm text-[#475467]">
                      Units
                    </Label>
                    <div className="relative">
                      <Input
                        id="units"
                        type="text"
                        min="1"
                        value={units}
                        onChange={(e) => {
                          setUnits(e.target.value.replace(/[^0-9]/g, ""));
                          setError("");
                        }}
                        placeholder="eg, 2,000 Units"
                        className="w-full pr-10 shadow-none"
                        required
                      />
                      {error && (
                        <p className="text-red-500 text-xs mt-1">{error}</p>
                      )}
                      <div className="h-10 bg-[#F7FAFF] rounded-lg mt-1 py-2.5 px-2 flex items-center gap-1.5">
                        <Image
                          src="/images/info2.svg"
                          alt="info"
                          width={20}
                          height={20}
                        />
                        <p className="text-[#504D4D] text-[13px] font-medium">
                          1 Unit is equals to N20,000
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      variant="outline"
                      className="w-full border-none lg:h-10 h-8 bg-[#F5F7FF] border border-[#F0F3FF] text-[#335CFF] lg:text-sm text-xs tracking-[1.5%] rounded-[10px] lg:font-semibold font-medium hover:bg-[#F0F3FF] hover:text-primary"
                      type="button"
                      onClick={() => {
                        setUnits("");
                        setError("");
                      }}
                    >
                      No, Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="flex items-center gap-1 bg-gradient-to-t from-[#0089FF] to-[#0068FF] rounded-[10px] p-2.5 text-white lg:h-10 h-8 w-full cursor-pointer hover:opacity-95 transition-all duration-300 lg:text-sm text-xs font-medium"
                    >
                      Continue
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        {/* Table Section */}
        {isLoading ? (
          <ScriptsTableSkeleton />
        ) : data?.data && data.data.length === 0 ? (
          <EmptyState
            image="/images/empty-state.svg"
            title="No Unit Transactions"
            desc="You have not made any unit transactions yet."
            link="/units"
            buttonText="Buy Units"
            showIcon
          />
        ) : (
          <DataTable
            columns={columns}
            data={(data?.data || []).map(
              (tx): UnitHistory => ({
                units: tx.credits_purchased
                  ? `${tx.credits_purchased.toLocaleString()} Units`
                  : "0 Units",
                amountPaid: tx.amount ? `₦${tx.amount.toLocaleString()}` : "₦0",
                transactionId: tx.transaction_id,
                transactionDate: formatDate(tx.created_at),
                status:
                  tx.payment_status === "COMPLETED" ? "Success" : "Pending",
              })
            )}
            searchKey="transactionId"
            tableName="Unit History"
            getId={(row) => row.transactionId}
          />
        )}
      </div>
    </div>
  );
};

export default Units;
