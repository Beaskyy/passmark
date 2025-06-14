import Image from "next/image";
import React from "react";
import { Button } from "./ui/button";
import { Loader, Trash2, X } from "lucide-react";
import { Progress } from "./ui/progress";

export const Misc = () => {
  return (
    <main className="lg:px-[108px] md:px-[20] p-5">
      <div className="flex justify-between lg:items-center gap-4 mt-2">
        <Image src="/images/back.svg" alt="back" width={44} height={44} />
      </div>
      <div className="flex flex-col justify-center items-center mt-7 ">
        <div className="lg:w-[534px] w-full">
          <div className="flex flex-col justify-center items-center gap-[30px] text-center">
            <div className="flex flex-col gap-1.5 max-w-[354px]">
              <h2 className="lg:text-lg text-base text-[#171717] font-semibold mt-7">
                Upload Script
              </h2>
              <p className="text-[#5C5C5C] lg:text-sm text-xs">
                Upload your student&apos;s answer script/sheet
              </p>
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
                      JPEG, PNG, PDF, and DOC formats, up to 50 MB
                    </p>
                  </div>
                  <Button className="bg-transparent border border-[#EBEBEB] text-[#5C5C5C] lg:text-sm text-xs max-h-9 py-2 px-[18px] shadow-sm font-medium hover:text-white">
                    Browse File
                  </Button>
                </div>
                <div className="flex flex-col gap-3">
                  <div className="flex flex-col gap-4 bg-white border border-[#FDB4BA] p-4 pl-3.5 rounded-xl">
                    <div className="flex justify-between">
                      <div className="flex items-start gap-2">
                        <Image
                          src="/images/pdf.svg"
                          alt="pdf"
                          width={40}
                          height={40}
                        />
                        <div className="flex items-start flex-col gap-1">
                          <h6 className="text-[#171717] lg:text-sm text-xs font-medium tracking-[-0.06%]">
                            adeolakinsman.pdf
                          </h6>
                          <div className="flex items-center gap-1">
                            <p className="text-[#5C5C5C] lg:text-xs text-[10px]">
                              49.2 MB of 100 MB
                            </p>
                            <p className="text-[#5C5C5C]">∙</p>
                            <div className="flex items-center gap-1">
                              <Image
                                src="/images/error.svg"
                                alt="error"
                                width={16}
                                height={16}
                              />
                              <p className="text-[#171717] lg:text-xs text-[10px]">
                                This file exceeds the size limit
                              </p>
                            </div>
                          </div>
                          <p className="text-[#FB3748] lg:text-sm text-xs tracking-[-0.06%] underline font-medium">
                            Try Again
                          </p>
                        </div>
                      </div>
                      <Trash2 className="lg:size-5 size-3 text-[#FB3748] cursor-pointer" />
                    </div>
                  </div>
                  <div className="flex flex-col gap-4 bg-white border border-[#EBEBEB] p-4 pl-3.5 rounded-xl">
                    <div className="flex justify-between">
                      <div className="flex items-center gap-2">
                        <Image
                          src="/images/pdf.svg"
                          alt="pdf"
                          width={40}
                          height={40}
                        />
                        <div className="flex items-start flex-col gap-1">
                          <h6 className="text-[#171717] lg:text-sm text-xs font-medium tracking-[-0.06%]">
                            adeolakinsman.pdf
                          </h6>
                          <div className="flex items-center gap-1">
                            <p className="text-[#5C5C5C] lg:text-xs text-[10px]">
                              1.2 MB of 2.9 MB
                            </p>
                            <p className="text-[#5C5C5C]">∙</p>
                            <div className="flex items-center gap-1">
                              <Loader className="text-primary size-4 animate-spin" />
                              <p className="text-[#171717] lg:text-xs text-[10px]">
                                Uploading...
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <X className="lg:size-5 size-3 text-[#5C5C5C] cursor-pointer" />
                    </div>
                    <Progress value={10} />
                  </div>
                  <div className="flex flex-col gap-4 bg-white border border-[#EBEBEB] p-4 pl-3.5 rounded-xl">
                    <div className="flex justify-between">
                      <div className="flex items-center gap-2">
                        <Image
                          src="/images/png.svg"
                          alt="png"
                          width={40}
                          height={40}
                        />
                        <div className="flex items-start flex-col gap-1">
                          <h6 className="text-[#171717] lg:text-sm text-xs font-medium tracking-[-0.06%]">
                            seyeolusegun.pdf
                          </h6>
                          <div className="flex items-center gap-1">
                            <p className="text-[#5C5C5C] lg:text-xs text-[10px]">
                              94 KB of 94 KB
                            </p>
                            <p className="text-[#5C5C5C]">∙</p>
                            <div className="flex items-center gap-1">
                              <Image
                                src="/images/check.svg"
                                alt="png"
                                width={16}
                                height={16}
                              />
                              <p className="text-[#171717] lg:text-xs text-[10px]">
                                Completed
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <Trash2 className="lg:size-5 size-3 text-[#5C5C5C] cursor-pointer" />
                    </div>
                  </div>
                </div>
              </div>

              <Button
                className="w-[174px] md:text-[13px] text-xs rounded-[10px] py-2.5 px-6 bg-gradient-to-t from-[#0089FF] to-[#0068FF] max-h-10 disabled:bg-[#F6F6F6] disabled:bg-none disabled:text-[#9A9A9A]"
                disabled
              >
                Mark Script
              </Button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};
