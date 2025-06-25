"use client";

import ManualBackground from "@/components/ManualBackground";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const AddAnswer = () => {
  const router = useRouter();
  const [showAddBulk, setShowAddBulk] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  return (
    <main className="lg:px-[108px] md:px-[20] p-5">
      <div className="flex justify-between lg:items-center gap-4 mt-2">
        <Link href="/new-course">
          <Image src="/images/back.svg" alt="back" width={44} height={44} />
        </Link>
        {!showAddBulk && (
          <Image
            src="/images/spinner.svg"
            alt="spinner"
            width={32}
            height={32}
          />
        )}
      </div>
      <div className="flex flex-col justify-center items-center mt-7 ">
        {showAddBulk ? (
          <div className="lg:w-[534px] w-full">
            <div className="flex flex-col justify-center items-center gap-[30px] text-center">
              <div className="flex flex-col gap-1.5 max-w-[354px]">
                <h2 className="lg:text-lg text-base text-[#171717] font-semibold mt-7">
                  Upload Answer
                </h2>
              </div>
              <div className="flex flex-col justify-center items-center gap-11">
                <div className="flex flex-col gap-3 lg:min-w-[534px]">
                  <div
                    className={`flex flex-col justify-center items-center gap-3 border border-dashed bg-white p-8 rounded-xl `}
                  >
                    <Image
                      src={`/images/upload.svg`}
                      alt="upload"
                      width={24}
                      height={24}
                    />
                    <div className="flex flex-col gap-1.5">
                      <p className="lg:text-sm text-xs text-[#444444] lg:font-semibold font-medium">
                        Choose a file or drag & drop it here
                      </p>
                      <p className="lg:text-sm text-xs text-[#838282] lg:font-normal font-light">
                        PDF, PNG, JPEG and DOC formats, up to 20 MB
                      </p>
                    </div>
                    <Button className="bg-transparent border border-[#EBEBEB] text-[#5C5C5C] lg:text-sm text-xs max-h-9 py-2 px-[18px] shadow-sm font-medium hover:text-white">
                      Browse File
                    </Button>
                  </div>
                </div>
                <Button className="w-fit md:text-[13px] text-xs rounded-[10px] py-2.5 px-6 bg-gradient-to-t from-[#0089FF] to-[#0068FF] max-h-10">
                  Continue
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="flex justify-center items-center">
              <div className="flex flex-col gap-[31px]">
                <div className="flex flex-col gap-1.5 text-center">
                  <h2 className="lg:text-lg text-base text-[#171717] font-semibold">
                    Add Answers
                  </h2>
                  <p className="lg:text-sm text-xs text-[#5C5C5C]">
                    Select how you&apos;d like to add your ansers
                  </p>
                </div>
                <div className="flex flex-col gap-4 md:min-w-[397.33px]">
                  <div
                    className="relative py-[22px] px-[18px] rounded-[14px] h-[85px] shadow-sm bg-white overflow-hidden cursor-pointer"
                    onClick={() => setShowAddBulk(true)}
                  >
                    <div className="flex flex-col gap-1">
                      <h4 className="lg:text-[15px] text-sm text-[#474545] lg:font-semibold font-medium">
                        Upload Answers
                      </h4>
                      <div className="flex items-center gap-1.5">
                        <p className="lg:text-[13px] text-xs text-[#929292] font-medium">
                          Upload your answers file
                        </p>
                      </div>
                    </div>
                    <ManualBackground
                      color={"#FFF0F1"}
                      className="absolute right-0 bottom-0"
                    />
                  </div>
                  <Link
                    href={`/assessments/answer/`}
                    className="relative py-[22px] px-[18px] rounded-[14px] h-[85px] shadow-sm bg-white overflow-hidden cursor-pointer"
                  >
                    <div className="flex flex-col gap-1">
                      <h4 className="lg:text-[15px] text-sm text-[#474545] lg:font-semibold font-medium">
                        Type Answers
                      </h4>
                      <div className="flex items-center gap-1.5">
                        <p className="lg:text-[13px] text-xs text-[#929292] font-medium">
                          Type out your answers
                        </p>
                      </div>
                    </div>
                    <ManualBackground
                      color={"#F1F0FF"}
                      className="absolute right-0 bottom-0"
                    />
                  </Link>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  );
};

export default AddAnswer;
