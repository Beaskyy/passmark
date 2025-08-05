"use client";

import RadialProgress from "@/components/radial-progress";
import { Button } from "@/components/ui/button";
import { Minus, Plus } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useFetchScript } from "@/hooks/useFetchScript";
import { useFetchMarkedScriptsList } from "@/hooks/useFetchMarkedScriptsList";
import { useFetchMarkedScript } from "@/hooks/useFetchMarkedScript";
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

  // Fetch specific marked script using the script ID
  const {
    data: markedScript,
    isLoading: markedScriptLoading,
    error: markedScriptError,
  } = useFetchMarkedScript(scriptId);

  const [number1a, setNumber1a] = useState(10);
  const [number1b, setNumber1b] = useState(10);
  const [number1c, setNumber1c] = useState(10);
  const [currentStep, setCurrentStep] = useState(1);

  // Lightbox state and images array
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const images = ["/images/result.svg", "/images/landscape.svg"];

  return (
    <div className="relative">
      {/* Script fetch demo */}
      {isLoading && (
        <div className="lg:w-[770px] w-full mx-auto mt-8">
          <div className="flex flex-col justify-center items-center gap-8 text-center animate-pulse">
            <div className="flex flex-col gap-[17px] items-center">
              <div className="rounded-full bg-gray-200 h-24 w-24 mb-2" />
              <div className="h-6 w-32 bg-gray-200 rounded mb-2" />
            </div>
            <div className="flex flex-col justify-center items-center bg-white rounded-[14.74px] p-[12.89px] gap-[22.11px] w-full">
              <div className="h-6 w-48 bg-gray-200 rounded mb-4" />
              <div className="grid md:grid-cols-2 grid-cols-1 gap-[16.58px] w-full">
                <div className="relative w-[363.82px] h-[336.56px] rounded-[12.89px] bg-gray-200" />
                <div className="flex flex-col gap-[15.17px] border border-[#F5F5F5] p-[13.82px] rounded-[12.89px] text-start w-full">
                  <div className="h-5 w-3/4 bg-gray-200 rounded mb-2" />
                  <div className="h-4 w-full bg-gray-100 rounded mb-1" />
                  <div className="h-4 w-5/6 bg-gray-100 rounded mb-1" />
                  <div className="h-4 w-2/3 bg-gray-100 rounded mb-1" />
                  <div className="h-4 w-1/2 bg-gray-100 rounded" />
                </div>
              </div>
            </div>
            <div className="bg-[#F0F5FF] p-3.5 rounded-xl w-full flex items-center gap-2">
              <div className="flex gap-2 items-center">
                <div className="bg-gray-200 rounded-full h-6 w-6" />
                <div className="flex flex-col gap-1.5 text-start">
                  <div className="h-4 w-24 bg-gray-200 rounded mb-1" />
                  <div className="h-3 w-64 bg-gray-100 rounded" />
                </div>
              </div>
              <div className="w-[92px] h-[34px] bg-gray-200 rounded-[10px] ml-auto" />
            </div>
          </div>
        </div>
      )}
      {error && <div>Error loading script</div>}
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
                  <RadialProgress progress={script?.total_mark_awarded || 0} />
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
                          Solid effort with a 75%. You understand the basics,
                          but review key concepts for stronger accuracy. Keep it
                          up!
                        </p>
                      </div>
                    </div>
                    <Button className="w-[92px] md:text-[13px] !h-[34px] !text-xs rounded-[10px] py-[7px] px-2 bg-gradient-to-t from-[#0089FF] to-[#0068FF] max-h-10 font-semibold">
                      Edit Review
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-4 bg-white w-full rounded-[12.38px] border border-[#F5F5F5] p-[13.82px] mt-10">
              <div className="flex flex-col gap-4">
                <h6 className="font-geist text-black font-bold lg:text-lg text-base">
                  1a. Which of the following element dies not contain neuron?
                </h6>
                <div className="">
                  <p className="font-geist text-[#9A9A9A] lg:text-[15.66px] text-sm leading-[22.21px]">
                    Saudi Aramco and Siemens Energy ink 15-year contract for oil
                    field power supply
                  </p>
                  <p className="font-geist text-[#9A9A9A] lg:text-[15.66px] text-sm leading-[22.21px]">
                    Robots could replace hundreds of thousands of oil and gas
                    jobs, save billions in drilling costs by 2
                  </p>
                  <p className="font-geist text-[#9A9A9A] lg:text-[15.66px] text-sm leading-[22.21px]">
                    Egypt could launch oil and gas exploration bid round this
                    month
                  </p>
                  <p className="font-geist text-[#9A9A9A] lg:text-[15.66px] text-sm leading-[22.21px]">
                    Oil bubbles up on Saudi supply, demand confidence and weak
                    dollar
                  </p>
                </div>
                <div
                  className="flex items-center"
                  style={{ boxShadow: "0px 10px 10px 3px #9C9C9C05" }}
                >
                  <div
                    className="flex justify-center items-center p-3 border-2 border-[#F8F8F8] rounded-tl-[22px] rounded-bl-[22px] size-11 cursor-pointer hover:opacity-90"
                    onClick={() => setNumber1a((prev) => Math.max(0, prev - 1))}
                  >
                    <Minus className="size-5 text-[#797979]" />
                  </div>
                  <input
                    type="text"
                    value={number1a}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value === "" || /^\d+$/.test(value)) {
                        setNumber1a(value === "" ? 0 : parseInt(value));
                      }
                    }}
                    className="flex justify-center items-center p-3 border-y-2 border-[#F8F8F8] size-11 text-[#333333] text-sm font-medium text-center focus:outline-none"
                  />
                  <div
                    className="flex justify-center items-center p-3 border-2 border-[#F8F8F8] rounded-tr-[22px] rounded-br-[22px] size-11 cursor-pointer hover:opacity-90"
                    onClick={() => setNumber1a((prev) => prev + 1)}
                  >
                    <Plus className="size-5 text-[#0089FF] " />
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-4">
                <h6 className="font-geist text-black font-bold lg:text-lg text-base">
                  1b. Which of the following element dies not contain neuron?
                </h6>
                <div className="">
                  <p className="font-geist text-[#9A9A9A] lg:text-[15.66px] text-sm leading-[22.21px]">
                    Saudi Aramco and Siemens Energy ink 15-year contract for oil
                    field power supply
                  </p>
                  <p className="font-geist text-[#9A9A9A] lg:text-[15.66px] text-sm leading-[22.21px]">
                    Robots could replace hundreds of thousands of oil and gas
                    jobs, save billions in drilling costs by 2
                  </p>
                  <p className="font-geist text-[#9A9A9A] lg:text-[15.66px] text-sm leading-[22.21px]">
                    Egypt could launch oil and gas exploration bid round this
                    month
                  </p>
                  <p className="font-geist text-[#9A9A9A] lg:text-[15.66px] text-sm leading-[22.21px]">
                    Oil bubbles up on Saudi supply, demand confidence and weak
                    dollar
                  </p>
                </div>
                <div
                  className="flex items-center"
                  style={{ boxShadow: "0px 10px 10px 3px #9C9C9C05" }}
                >
                  <div
                    className="flex justify-center items-center p-3 border-2 border-[#F8F8F8] rounded-tl-[22px] rounded-bl-[22px] size-11 cursor-pointer hover:opacity-90"
                    onClick={() => setNumber1b((prev) => Math.max(0, prev - 1))}
                  >
                    <Minus className="size-5 text-[#797979]" />
                  </div>
                  <input
                    type="text"
                    value={number1b}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value === "" || /^\d+$/.test(value)) {
                        setNumber1b(value === "" ? 0 : parseInt(value));
                      }
                    }}
                    className="flex justify-center items-center p-3 border-y-2 border-[#F8F8F8] size-11 text-[#333333] text-sm font-medium text-center focus:outline-none"
                  />
                  <div
                    className="flex justify-center items-center p-3 border-2 border-[#F8F8F8] rounded-tr-[22px] rounded-br-[22px] size-11 cursor-pointer hover:opacity-90"
                    onClick={() => setNumber1b((prev) => prev + 1)}
                  >
                    <Plus className="size-5 text-[#0089FF] " />
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-4">
                <h6 className="font-geist text-black font-bold lg:text-lg text-base">
                  1c. Which of the following element dies not contain neuron?
                </h6>
                <div className="">
                  <p className="font-geist text-[#9A9A9A] lg:text-[15.66px] text-sm leading-[22.21px]">
                    Saudi Aramco and Siemens Energy ink 15-year contract for oil
                    field power supply
                  </p>
                  <p className="font-geist text-[#9A9A9A] lg:text-[15.66px] text-sm leading-[22.21px]">
                    Robots could replace hundreds of thousands of oil and gas
                    jobs, save billions in drilling costs by 2
                  </p>
                  <p className="font-geist text-[#9A9A9A] lg:text-[15.66px] text-sm leading-[22.21px]">
                    Egypt could launch oil and gas exploration bid round this
                    month
                  </p>
                  <p className="font-geist text-[#9A9A9A] lg:text-[15.66px] text-sm leading-[22.21px]">
                    Oil bubbles up on Saudi supply, demand confidence and weak
                    dollar
                  </p>
                </div>
                <div
                  className="flex items-center"
                  style={{ boxShadow: "0px 10px 10px 3px #9C9C9C05" }}
                >
                  <div
                    className="flex justify-center items-center p-3 border-2 border-[#F8F8F8] rounded-tl-[22px] rounded-bl-[22px] size-11 cursor-pointer hover:opacity-90"
                    onClick={() => setNumber1c((prev) => Math.max(0, prev - 1))}
                  >
                    <Minus className="size-5 text-[#797979]" />
                  </div>
                  <input
                    type="text"
                    value={number1c}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value === "" || /^\d+$/.test(value)) {
                        setNumber1c(value === "" ? 0 : parseInt(value));
                      }
                    }}
                    className="flex justify-center items-center p-3 border-y-2 border-[#F8F8F8] size-11 text-[#333333] text-sm font-medium text-center focus:outline-none"
                  />
                  <div
                    className="flex justify-center items-center p-3 border-2 border-[#F8F8F8] rounded-tr-[22px] rounded-br-[22px] size-11 cursor-pointer hover:opacity-90"
                    onClick={() => setNumber1c((prev) => prev + 1)}
                  >
                    <Plus className="size-5 text-[#0089FF] " />
                  </div>
                </div>
              </div>
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default Result;
