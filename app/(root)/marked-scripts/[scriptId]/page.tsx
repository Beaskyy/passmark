"use client";

import RadialProgress from "@/components/radial-progress";
import { Button } from "@/components/ui/button";
import { Minus, Plus } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import { useFetchScript } from "@/hooks/useFetchScript";
import { useFetchMarkedScriptsList } from "@/hooks/useFetchMarkedScriptsList";
import { useFetchMarkedScript } from "@/hooks/useFetchMarkedScript";
import { useUpdateMark } from "@/hooks/useUpdateMark";
import { useParams } from "next/navigation";

const Result = () => {
  const router = useRouter();
  const params = useParams();
  const scriptId = Array.isArray(params?.scriptId)
    ? params.scriptId[0]
    : params?.scriptId;
  const { data: script, isLoading, error } = useFetchScript(scriptId);

  // Fetch marked scripts list using the assessment ID from the script
  const {
    data: markedScriptsList,
    isLoading: markedScriptsLoading,
    error: markedScriptsError,
  } = useFetchMarkedScriptsList(scriptId);

  // Fetch specific marked script using the first mark_id from the list
  const {
    data: markedScript,
    isLoading: markedScriptLoading,
    error: markedScriptError,
  } = useFetchMarkedScript(markedScriptsList?.data?.[0]?.mark_id);

  // Show loading if we're still fetching the marked scripts list
  const isLoadingData =
    isLoading || markedScriptsLoading || markedScriptLoading;

  const [currentStep, setCurrentStep] = useState(1);
  const [marks, setMarks] = useState<{ [key: string]: number }>({});
  const [pendingUpdates, setPendingUpdates] = useState<{
    [key: string]: NodeJS.Timeout;
  }>({});
  const { mutate: updateMark, isPending: isUpdating } = useUpdateMark();

  // Debounced update function
  const debouncedUpdate = useCallback(
    (markId: string, markValue: number) => {
      // Clear existing timeout for this mark
      if (pendingUpdates[markId]) {
        clearTimeout(pendingUpdates[markId]);
      }

      // Set new timeout
      const timeoutId = setTimeout(() => {
        updateMark({
          mark_id: markId,
          mark: markValue,
        });
        setPendingUpdates((prev) => {
          const newPending = { ...prev };
          delete newPending[markId];
          return newPending;
        });
      }, 500);

      setPendingUpdates((prev) => ({
        ...prev,
        [markId]: timeoutId,
      }));
    },
    [updateMark, pendingUpdates]
  );

  // Initialize marks when data is loaded
  useEffect(() => {
    if (markedScriptsList?.data) {
      const initialMarks: { [key: string]: number } = {};
      markedScriptsList.data.forEach((mark) => {
        initialMarks[mark.mark_id] = mark.awarded_marks;
      });
      setMarks(initialMarks);
    }
  }, [markedScriptsList?.data]);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      Object.values(pendingUpdates).forEach((timeoutId) => {
        clearTimeout(timeoutId);
      });
    };
  }, [pendingUpdates]);

  // Lightbox state and images array
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const images = ["/images/result.svg", "/images/landscape.svg"];

  return (
    <div className="relative">
      {/* Loading skeleton */}
      {isLoadingData && (
        <div className="lg:px-[108px] md:px-[20] p-5 overflow-y-auto pb-40">
          <div className="flex justify-between lg:items-center gap-4 mt-2">
            <div className="w-11 h-11 bg-gray-200 rounded animate-pulse" />
          </div>
          <div className="flex flex-col justify-center items-center">
            <div className="lg:w-[770px] w-full">
              <div className="flex flex-col justify-center items-center gap-8 text-center animate-pulse">
                <div className="flex flex-col gap-[17px] items-center">
                  <div className="rounded-full bg-gray-200 h-[100px] w-[100px] mb-2" />
                  <div className="h-6 w-32 bg-gray-200 rounded mb-2" />
                </div>
                <div className="flex flex-col justify-center items-center bg-white rounded-[14.74px] p-[12.89px] gap-[22.11px] w-full">
                  <div className="flex flex-col items-center gap-2">
                    <div className="h-6 w-48 bg-gray-200 rounded mb-2" />
                    <div className="h-8 w-24 bg-gray-200 rounded" />
                  </div>
                  <div className="grid md:grid-cols-2 grid-cols-1 gap-[16.58px] w-full">
                    <div className="relative md:w-[363.82px] w-full h-[336.56px] rounded-[12.89px] bg-gray-200" />
                    <div className="flex flex-col gap-[15.17px] border border-[#F5F5F5] p-[13.82px] rounded-[12.89px] text-start w-full">
                      <div className="h-5 w-3/4 bg-gray-200 rounded mb-2" />
                      <div className="h-4 w-full bg-gray-100 rounded mb-1" />
                      <div className="h-4 w-5/6 bg-gray-100 rounded mb-1" />
                      <div className="h-4 w-2/3 bg-gray-100 rounded mb-1" />
                      <div className="h-4 w-1/2 bg-gray-100 rounded" />
                    </div>
                  </div>
                </div>
                <div className="bg-[#F0F5FF] p-3.5 rounded-xl w-full">
                  <div className="flex justify-between items-center gap-2">
                    <div className="flex gap-2 items-center">
                      <div className="bg-gray-200 rounded-full h-6 w-6" />
                      <div className="flex flex-col gap-1.5 text-start">
                        <div className="h-4 w-24 bg-gray-200 rounded mb-1" />
                        <div className="h-3 w-64 bg-gray-100 rounded" />
                      </div>
                    </div>
                    <div className="w-[92px] h-[34px] bg-gray-200 rounded-[10px]" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {(error || markedScriptsError || markedScriptError) && (
        <div className="text-center text-red-500 mt-8">
          Error loading script data
        </div>
      )}
      <main className="lg:px-[108px] md:px-[20] p-5 overflow-y-auto pb-40">
        <div className="flex justify-between lg:items-center gap-4 mt-2">
          <Image
            src="/images/back.svg"
            alt="back"
            width={44}
            height={44}
            onClick={() => router.back()}
          />
        </div>
        <div className="flex flex-col justify-center items-center">
          {currentStep === 1 ? (
            <div className="lg:w-[770px] w-full">
              <div className="flex flex-col justify-center items-center gap-8 text-center">
                <div className="flex flex-col gap-[17px]">
                  <RadialProgress
                    size={100}
                    progress={
                      markedScriptsList?.data && script?.total_mark_awarded
                        ? Math.round(
                            (script.total_mark_awarded /
                              markedScriptsList.data.reduce(
                                (total, mark) =>
                                  total + mark.question.total_marks,
                                0
                              )) *
                              100
                          )
                        : 0
                    }
                    displayValue={`${script?.total_mark_awarded || 0}/${
                      markedScriptsList?.data?.reduce(
                        (total, mark) => total + mark.question.total_marks,
                        0
                      ) || 0
                    }`}
                  />
                  <p className="text-[#8B8B8B] lg:text-[22px] text-lg font-semibold">
                    Marked score
                  </p>
                </div>
                <div className="flex flex-col justify-center items-center bg-white rounded-[14.74px] p-[12.89px] gap-[22.11px]">
                  <div className="flex flex-col items-center gap-2">
                    <h6 className="text-[#4F4F4F] lg:text-[21.18px] text-lg font-semibold">
                      Handwritten Answer Scripts
                    </h6>
                    {script?.course?.code && (
                      <div className="flex items-center gap-2 bg-[#F0F5FF] px-3 py-1 rounded-lg">
                        <span className="text-[#335CFF] text-sm font-medium">
                          Course:
                        </span>
                        <span className="text-[#171717] text-sm font-semibold">
                          {script.course.code}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="grid md:grid-cols-2 grid-cols-1 gap-[16.58px]">
                    {/* Only the left image is clickable for lightbox */}
                    <div
                      className="relative md:w-[363.82px] w-full h-[336.56px] rounded-[12.89px] cursor-pointer group"
                      onClick={() => {
                        setLightboxOpen(true);
                      }}
                      tabIndex={0}
                      aria-label="Open script file"
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          setLightboxOpen(true);
                        }
                      }}
                      role="button"
                    >
                      {script && script.file_type === "application/pdf" ? (
                        <iframe
                          src={script.file_url}
                          title="Script PDF"
                          width="100%"
                          height="100%"
                          className="absolute rounded-[12.89px] bg-white"
                          style={{ minHeight: 0, minWidth: 0, border: 0 }}
                        />
                      ) : script && script.file_url ? (
                        <Image
                          src={script.file_url}
                          alt={script.file_name || "script-image"}
                          fill
                          className="absolute bg-cover rounded-[12.89px] group-hover:opacity-80 transition-opacity"
                        />
                      ) : null}
                      <span className="absolute bottom-2 right-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded">
                        Click to enlarge
                      </span>
                    </div>
                    <div className="flex flex-col gap-[15.17px] border border-[#F5F5F5] p-[13.82px] rounded-[12.89px] text-start">
                      <h6 className="font-geist text-black font-bold lg:text-lg text-base">
                        {markedScript?.data?.question?.text ||
                          "Loading question..."}
                      </h6>
                      <div className="flex flex-col gap-[7.59px]">
                        {markedScript?.data?.extracted_answer ? (
                          <p className="font-geist text-[#9A9A9A] lg:text-[15.66px] text-sm">
                            {markedScript.data.extracted_answer}
                          </p>
                        ) : (
                          <p className="font-geist text-[#9A9A9A] lg:text-[15.66px] text-sm">
                            No answer extracted
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-[#F0F5FF] p-3.5 rounded-xl w-full">
                  <div className="flex justify-between items-center gap-2">
                    <div className="flex gap-2">
                      <Image
                        src="/images/landscape.svg"
                        alt="landscape"
                        width={24}
                        height={24}
                      />
                      <div className="flex flex-col gap-1.5 text-start">
                        <h6 className="text-[#171717] lg:text-sm text-xs font-semibold">
                          Grading and Review
                        </h6>
                        <p className="text-[#747474] text-xs font-medium max-w-[550px]">
                          {script?.marked_comment || "No comment"}
                        </p>
                      </div>
                    </div>
                    <Button
                      onClick={() => setCurrentStep(2)}
                      className="w-[92px] md:text-[13px] !h-[34px] !text-xs rounded-[10px] py-[7px] px-2 bg-gradient-to-t from-[#0089FF] to-[#0068FF] max-h-10 font-semibold"
                    >
                      Edit Review
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-4 bg-white w-full rounded-[12.38px] border border-[#F5F5F5] p-[13.82px] mt-10">
              {markedScriptsList?.data?.map((mark, index) => (
                <div key={mark.mark_id} className="flex flex-col gap-4">
                  <h6 className="font-geist text-black font-bold lg:text-lg text-base">
                    {mark.question.number}. {mark.question.text}
                  </h6>
                  <div className="">
                    {mark.extracted_answer ? (
                      <p className="font-geist text-[#9A9A9A] lg:text-[15.66px] text-sm leading-[22.21px]">
                        {mark.extracted_answer}
                      </p>
                    ) : (
                      <p className="font-geist text-[#9A9A9A] lg:text-[15.66px] text-sm leading-[22.21px]">
                        No answer extracted
                      </p>
                    )}
                  </div>
                  <div
                    className="flex items-center"
                    style={{ boxShadow: "0px 10px 10px 3px #9C9C9C05" }}
                  >
                    <div
                      className="flex justify-center items-center p-3 border-2 border-[#F8F8F8] rounded-tl-[22px] rounded-bl-[22px] size-11 cursor-pointer hover:opacity-90"
                      onClick={() => {
                        const currentMark =
                          marks[mark.mark_id] || mark.awarded_marks;
                        if (currentMark > 0) {
                          const newMark = currentMark - 1;
                          setMarks((prev) => ({
                            ...prev,
                            [mark.mark_id]: newMark,
                          }));
                          debouncedUpdate(mark.mark_id, newMark);
                        }
                      }}
                    >
                      <Minus className="size-5 text-[#797979]" />
                    </div>
                    <input
                      type="text"
                      value={marks[mark.mark_id] || mark.awarded_marks}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value === "" || /^\d+$/.test(value)) {
                          const numValue = value === "" ? 0 : parseInt(value);
                          if (
                            numValue >= 0 &&
                            numValue <= mark.question.total_marks
                          ) {
                            setMarks((prev) => ({
                              ...prev,
                              [mark.mark_id]: numValue,
                            }));
                            debouncedUpdate(mark.mark_id, numValue);
                          }
                        }
                      }}
                      className="flex justify-center items-center p-3 border-y-2 border-[#F8F8F8] size-11 text-[#333333] text-sm font-medium text-center focus:outline-none"
                    />
                    <div
                      className="flex justify-center items-center p-3 border-2 border-[#F8F8F8] rounded-tr-[22px] rounded-br-[22px] size-11 cursor-pointer hover:opacity-90"
                      onClick={() => {
                        const currentMark =
                          marks[mark.mark_id] || mark.awarded_marks;
                        if (currentMark < mark.question.total_marks) {
                          const newMark = currentMark + 1;
                          setMarks((prev) => ({
                            ...prev,
                            [mark.mark_id]: newMark,
                          }));
                          debouncedUpdate(mark.mark_id, newMark);
                        }
                      }}
                    >
                      <Plus className="size-5 text-[#0089FF] " />
                    </div>
                  </div>
                  {mark.comment && (
                    <div className="mt-2 p-3 bg-[#F0F5FF] rounded-lg">
                      <p className="text-sm text-[#335CFF] font-medium">
                        Comment:
                      </p>
                      <p className="text-sm text-[#171717]">{mark.comment}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Lightbox Modal - always rendered at root level */}
      {lightboxOpen && script && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80"
          onClick={() => setLightboxOpen(false)}
          tabIndex={-1}
          aria-modal="true"
          role="dialog"
        >
          <button
            className="absolute top-4 right-6 text-white text-3xl font-bold focus:outline-none"
            onClick={(e) => {
              e.stopPropagation();
              setLightboxOpen(false);
            }}
            aria-label="Close lightbox"
          >
            &times;
          </button>
          <div className="relative flex items-center justify-center w-full h-full max-w-4xl max-h-[90vh]">
            {script.file_type === "application/pdf" ? (
              <iframe
                src={script.file_url}
                title="Script PDF Lightbox"
                width="800px"
                height="600px"
                className="rounded-lg shadow-2xl bg-white"
                style={{ border: 0 }}
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              <Image
                src={script.file_url}
                alt={script.file_name || "script-image"}
                width={700}
                height={700}
                className="rounded-lg shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              />
            )}
          </div>
        </div>
      )}

      <div className="fixed bottom-0 bg-white h-20 w-full border-y border-[#EBEBEB] p-5">
        <div className="flex justify-end items-center">
          <div className="flex items-center gap-3">
            <Button
              className="!h-10 bg-transparent border border-[#EBEBEB] rounded-lg text-[#5C5C5C] md:text-sm text-xs tracking-[-0.6%] font-medium hover:bg-transparent hover:opacity-90 shadow-sm"
              onClick={() => {
                if (currentStep === 1) {
                  setCurrentStep(2);
                } else {
                  setCurrentStep(1);
                }
              }}
            >
              {currentStep === 1 ? "Edit Markings" : "Go Back"}
            </Button>
            {script?.status !== "completed" && (
              <Button
                className="!h-10 md:text-sm text-xs rounded-[10px] bg-gradient-to-t from-[#0089FF] to-[#0068FF] max-h-10 font-medium hover:opacity-90"
                onClick={() => {
                  if (currentStep > 1) {
                    setCurrentStep(1);
                  }
                }}
              >
                {currentStep === 1 ? "Approve & Save" : "Update"}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Result;
