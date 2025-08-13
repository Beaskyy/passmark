"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const View = () => {
  const router = useRouter();
  const [selectedPages, setSelectedPages] = useState<number[]>([]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Parse input into array of page numbers
    const pages = value
      .split(",")
      .map((num) => parseInt(num.trim(), 10))
      .filter((num) => !isNaN(num));
    setSelectedPages(pages);
  };
  return (
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
      <div className="grid lg:grid-cols-3 grid-cols-1">
        {/* Images section */}
        <div className="flex flex-col gap-6 lg:col-span-2 order-2 lg:order-1">
          {[1, 2].map((pageNumber) => (
            <div
              key={pageNumber}
              className="relative w-full lg:h-[556px] h-[300px] max-w-[581px] lg:left-[148px]"
            >
              <Image
                src="/images/script-selection.svg"
                alt={`Page ${pageNumber}`}
                fill
                className="absolute"
              />
              {/* Checkbox at bottom right */}
              <input
                type="checkbox"
                checked={selectedPages.includes(pageNumber)}
                readOnly
                className="absolute bottom-4 right-6 w-4 h-4 border-primary"
              />
            </div>
          ))}
        </div>

        {/* Sidebar section */}
        <div className="flex flex-col gap-[34px] max-w-[346px] order-1 lg:order-2 lg:fixed lg:left-[887px] lg:top-[202px]">
          <h5 className="max-w-[191px] lg:text-lg text-base text-[#171717] lg:font-semibold font-medium">
            Select the pages you&apos;d like to skip
          </h5>
          <div className="flex flex-col gap-2.5">
            <div className="flex flex-col gap-1.5">
              <Label className="text-sm text-[#344054] font-medium">
                Pages
              </Label>
              <Input
                placeholder="eg, 1,2,7"
                onChange={handleInputChange}
                className="shadow-sm border border-[#EBEBEB] p-2.5 pl-3 text-sm placeholder:text-[#8A8A8A] h-10"
              />
            </div>
            <div className="bg-[#F5F9FF] p-3 rounded-xl">
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-1.5">
                  <Image
                    src="/images/info2.svg"
                    alt="notice"
                    width={20}
                    height={20}
                  />
                  <p className="text-[#2B2A30] lg:text-[15px] text-sm lg:font-semibold font-medium tracking-[0.1px]">
                    Important Notice
                  </p>
                </div>
                <p className="lg:text-[15px] text-sm text-[#56555F] tracking-[1%]">
                  Kindly note that this settings will apply to all the scripts
                  you’ve uploaded
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 bg-white h-20 w-full border-y border-[#EBEBEB] p-5">
        <div className="flex justify-end items-center">
          <div className="flex items-center gap-3">
            <Button className="!h-10 md:text-sm text-xs rounded-[10px] bg-gradient-to-t from-[#0089FF] to-[#0068FF] max-h-10 font-medium hover:opacity-90 w-[114px]">
              Continue
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default View;
