import RadialProgress from "@/components/radial-progress";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import React from "react";

const Result = () => {
  return (
    <main className="lg:px-[108px] md:px-[20] p-5">
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
                      Saudi Aramco and Siemens Energy ink 15-year contract for
                      oil field power supply
                    </p>
                    <p className="font-geist text-[#9A9A9A] lg:text-[15.66px] text-sm">
                      Robots could replace hundreds of thousands of oil and gas
                      jobs, save billions in drilling costs by 2
                    </p>
                    <p className="font-geist text-[#9A9A9A] lg:text-[15.66px] text-sm">
                      Egypt could launch oil and gas exploration bid round this
                      month
                    </p>
                    <p className="font-geist text-[#9A9A9A] lg:text-[15.66px] text-sm">
                      Oil bubbles up on Saudi supply, demand confidence and weak
                      dollar
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
                      Solid effort with a 75%. You understand the basics, but
                      review key concepts for stronger accuracy. Keep it up!
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
      </div>
    </main>
  );
};

export default Result;
