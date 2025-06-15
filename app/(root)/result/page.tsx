"use client";

import RadialProgress from "@/components/radial-progress";
import { Button } from "@/components/ui/button";
import { Minus, Plus } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";

const Result = () => {
  const [number1a, setNumber1a] = useState(10);
  const [number1b, setNumber1b] = useState(10);
  const [number1c, setNumber1c] = useState(10);
  const [currentStep, setCurrentStep] = useState(1);

  return (
    <div className="relative">
      <main className="lg:px-[108px] md:px-[20] p-5 overflow-y-auto pb-40">
        <div className="flex justify-between lg:items-center gap-4 mt-2">
          <Image
            src="/images/back.svg"
            alt="back"
            width={44}
            height={44}
            // onClick={() => router.back()}
          />
        </div>
        <div className="flex flex-col justify-center items-center">
          {currentStep === 1 ? (
            <div className="lg:w-[770px] w-full">
              <div className="flex flex-col justify-center items-center gap-8 text-center">
                <div className="flex flex-col gap-[17px]">
                  <RadialProgress progress={75} />
                  <p className="text-[#8B8B8B] lg:text-[22px] text-lg font-semibold">
                    Marked score
                  </p>
                </div>
                <div className="flex flex-col justify-center items-center bg-white rounded-[14.74px] p-[12.89px] gap-[22.11px]">
                  <h6 className="text-[#4F4F4F] lg:text-[21.18px] text-lg font-semibold">
                    Handwritten Answer Scripts
                  </h6>
                  <div className="grid md:grid-cols-2 grid-cols-1 gap-[16.58px]">
                    <div className="relative w-[363.82px] h-[336.56px] rounded-[12.89px]">
                      <Image
                        src="/images/result.svg"
                        alt="result-script"
                        fill
                        className="absolute bg-cover"
                      />
                    </div>
                    <div className="flex flex-col gap-[15.17px] border border-[#F5F5F5] p-[13.82px] rounded-[12.89px] text-start">
                      <h6 className="font-geist text-black font-bold lg:text-lg text-base">
                        Which of the following element dies not contain neuron?
                      </h6>
                      <div className="flex flex-col gap-[7.59px]">
                        <p className="font-geist text-[#9A9A9A] lg:text-[15.66px] text-sm">
                          Saudi Aramco and Siemens Energy ink 15-year contract
                          for oil field power supply
                        </p>
                        <p className="font-geist text-[#9A9A9A] lg:text-[15.66px] text-sm">
                          Robots could replace hundreds of thousands of oil and
                          gas jobs, save billions in drilling costs by 2
                        </p>
                        <p className="font-geist text-[#9A9A9A] lg:text-[15.66px] text-sm">
                          Egypt could launch oil and gas exploration bid round
                          this month
                        </p>
                        <p className="font-geist text-[#9A9A9A] lg:text-[15.66px] text-sm">
                          Oil bubbles up on Saudi supply, demand confidence and
                          weak dollar
                        </p>
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
      <div className="fixed bottom-0 bg-white h-20 w-full border-y border-[#EBEBEB] p-5">
        <div className="flex justify-end items-center">
          <div className="flex items-center gap-3">
            <Button
              className="!h-10 bg-transparent border border-[#EBEBEB] rounded-lg text-[#5C5C5C] md:text-sm text-xs tracking-[-0.6%] font-medium hover:bg-transparent hover:opacity-90 shadow-sm"
              onClick={() => {
                if (currentStep > 1) {
                  setCurrentStep(1);
                }
              }}
            >
              {currentStep === 1 ? "Edit Markings" : "Go Back"}
            </Button>
            <Button
              className="!h-10 md:text-sm text-xs rounded-[10px] bg-gradient-to-t from-[#0089FF] to-[#0068FF] max-h-10 font-medium hover:opacity-90"
              onClick={() => {
                if (currentStep === 1) {
                  setCurrentStep(2);
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
