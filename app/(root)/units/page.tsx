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
import { useFetchPaymentPlans } from "@/hooks/useFetchPaymentPlans";
import { useCreatePaymentLink } from "@/hooks/useCreatePaymentLink";
import { useConfirmPayment } from "@/hooks/useConfirmPayment";
import { useAccount } from "@/providers/AccountProvider";
import { toast } from "sonner";
import Link from "next/link";

const Units = () => {
  const router = useRouter();
  const [units, setUnits] = useState("");
  const [error, setError] = useState("");
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { user } = useAccount();
  const { mutate: createPaymentLink, isPending: isCreatingPaymentLink } =
    useCreatePaymentLink();
  const { mutate: confirmPayment, isPending: isConfirmingPayment } =
    useConfirmPayment();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!units) {
      setError("Units is required");
      return;
    }
    setError("");
    // Continue with submit logic
  };

  const handleBuyUnits = () => {
    if (!selectedPlan) {
      toast.error("Please select a payment plan");
      return;
    }

    if (!user?.organisation?.org_id || !user?.email) {
      toast.error("Missing user information");
      return;
    }

    createPaymentLink(
      {
        pricing_id: selectedPlan,
        organisation_id: user.organisation.org_id,
        email: user.email,
      },
      {
        onSuccess: (response) => {
          if (response.data?.payment_link) {
            // Open payment link in new tab
            window.open(response.data.payment_link, "_blank");
            toast.success("Payment link generated successfully");

            // Call confirm payment endpoint
            if (response.data.tx_ref && user?.organisation?.org_id) {
              confirmPayment(
                {
                  tx_ref: response.data.tx_ref,
                  organisation_id: user.organisation.org_id,
                },
                {
                  onSuccess: () => {
                    toast.success("Payment confirmed successfully");
                    setIsDialogOpen(false);
                    setSelectedPlan(null);
                  },
                  onError: (error: any) => {
                    toast.error(error.message || "Failed to confirm payment");
                  },
                }
              );
            } else {
              setIsDialogOpen(false);
              setSelectedPlan(null);
            }
          } else {
            toast.error("Failed to generate payment link");
          }
        },
        onError: (error: any) => {
          toast.error(error.message || "Failed to create payment link");
        },
      }
    );
  };

  // Remove useAccount and useFetchScripts
  // const { user } = useAccount();
  // const organisationId = user?.organisation?.org_id;
  // const { data = [], isLoading } = useFetchScripts(organisationId);

  const { data, isLoading } = useFetchOrganisationPaymentTransactions();
  const { data: creditBalance, isLoading: isCreditLoading } =
    useFetchOrganisationCreditBalance();
  const { data: paymentPlans, isLoading: isPaymentPlansLoading } =
    useFetchPaymentPlans();

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
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger className="flex items-center gap-1 bg-gradient-to-t from-[#0089FF] to-[#0068FF] rounded-[10px] p-2.5 text-white lg:h-10 h-8 w-fit cursor-pointer hover:opacity-95 transition-all duration-300 lg:text-sm text-xs font-medium">
                <Plus className="lg:size-5 size-4" />
                <span>Buy More Units</span>
              </DialogTrigger>

              <DialogContent className="flex flex-col gap-10 max-w-[336px] w-full">
                <DialogHeader>
                  <DialogTitle className="text-[#111827] lg:text-xl text-balance font-semibold tracking-[-1%]">
                    Buy Units
                  </DialogTitle>
                  <DialogDescription className="text-[#475467] lg:text-sm text-xs">
                    Select what you&apos;ll like to get
                  </DialogDescription>
                </DialogHeader>
                <>
                  <div className="flex flex-col gap-2.5">
                    {isPaymentPlansLoading
                      ? // Loading skeleton for payment plans
                        Array.from({ length: 3 }).map((_, index) => (
                          <div
                            key={index}
                            className="flex justify-center items-center border border-[#F2F2F2] py-3 px-3.5 rounded-xl h-12"
                          >
                            <div className="flex justify-between items-center lg:text-sm text-xs text-[#2A2A2A] font-semibold w-full tracking-[-0.1px]">
                              <div className="w-20 h-4 bg-gray-200 animate-pulse rounded" />
                              <div className="w-16 h-4 bg-gray-200 animate-pulse rounded" />
                            </div>
                          </div>
                        ))
                      : paymentPlans?.data && paymentPlans.data.length > 0
                      ? // Render payment plans from API
                        paymentPlans.data
                          .filter((plan) => plan.is_active)
                          .map((plan) => (
                            <div
                              key={plan.pricing_id}
                              className={`flex justify-center items-center border py-3 px-3.5 rounded-xl h-12 cursor-pointer transition-all duration-200 ${
                                selectedPlan === plan.pricing_id
                                  ? "border-[#0089FF] bg-[#F0F3FF]"
                                  : "border-[#F2F2F2] hover:border-primary"
                              }`}
                              onClick={() => setSelectedPlan(plan.pricing_id)}
                            >
                              <div className="flex justify-between items-center lg:text-sm text-xs text-[#2A2A2A] font-semibold w-full tracking-[-0.1px]">
                                <p className="">
                                  {Number(plan.credit).toLocaleString()} Units
                                </p>
                                <p className="">
                                  ₦{Number(plan.amount).toLocaleString()}
                                </p>
                              </div>
                            </div>
                          ))
                      : null}
                    <div className="h-10 bg-[#F7FAFF] rounded-lg mt-1 py-2.5 px-2 flex items-center gap-1.5">
                      <Image
                        src="/images/info2.svg"
                        alt="info"
                        width={20}
                        height={20}
                      />
                      <p className="text-[#504D4D] text-[13px] font-medium">
                        Need More Units? Kindly{" "}
                        <Link href="/units" className="underline">
                          Contact Us
                        </Link>
                      </p>
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
                        setSelectedPlan(null);
                        setIsDialogOpen(false);
                      }}
                    >
                      No, Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="flex items-center gap-1 bg-gradient-to-t from-[#0089FF] to-[#0068FF] rounded-[10px] p-2.5 text-white lg:h-10 h-8 w-full cursor-pointer hover:opacity-95 transition-all duration-300 lg:text-sm text-xs font-medium"
                      onClick={handleBuyUnits}
                      disabled={!selectedPlan || isCreatingPaymentLink}
                    >
                      {isCreatingPaymentLink ? "Creating..." : "Buy Units"}
                    </Button>
                  </div>
                </>
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
            onClick={() => setIsDialogOpen(true)}
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
