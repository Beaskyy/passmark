"use client";

import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { FileUpload } from "@/components/file-upload";
import { Trash2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";

// Define the type for fileObj
interface FileObj {
  file: File;
  status: "uploading" | "completed" | "error";
  progress: number;
  error: string | null;
}

const AddStudents = () => {
  const router = useRouter();
  const [showAddBulk, setShowAddBulk] = useState(false);
  const [fileObj, setFileObj] = useState<FileObj | null>(null);
  const { courseId } = useParams();

  const handleFileSelect = (selectedFile: File) => {
    setFileObj({
      file: selectedFile,
      status: "uploading",
      progress: 0,
      error: null,
    });

    let progress = 0;
    const interval = setInterval(() => {
      progress += 20;
      setFileObj((prev) =>
        prev ? { ...prev, progress: Math.min(progress, 100) } : null
      );
      if (progress >= 100) {
        clearInterval(interval);
        setFileObj((prev) =>
          prev
            ? {
                ...prev,
                status: "completed",
                progress: 100,
                error: null,
              }
            : null
        );
      }
    }, 200);
  };

  const handleDelete = () => {
    setFileObj(null);
  };

  return (
    <main className="lg:px-[108px] md:px-[20] p-5">
      <div className="flex justify-between lg:items-center gap-4 mt-2">
        <Link href={`/my-courses/${courseId}`}>
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
      <div className="flex flex-col justify-center items-center">
        {showAddBulk ? (
          <div className="lg:w-[534px] w-full">
            <div className="flex flex-col justify-center items-center gap-[30px] text-center">
              <div className="flex flex-col gap-1.5 max-w-[354px]">
                <h2 className="lg:text-lg text-base text-[#171717] font-semibold mt-20">
                  Add Students in Bulk
                </h2>
                <p className="lg:text-sm text-xs text-[#5C5C5C]">
                  Download the sample file, fill it out, and upload it again
                  once completed
                </p>
              </div>
              <div className="flex flex-col justify-center items-center gap-11">
                <div className="flex flex-col gap-3">
                  <div className="flex justify-center items-center p-2.5 rounded-lg bg-[#EBEFFF] lg:min-w-[534px]">
                    <div className="flex items-center gap-3">
                      <Image
                        src="/images/csv.svg"
                        alt="csv"
                        width={24}
                        height={24}
                      />
                      <p className="lg:text-sm text-xs font-medium text-[#696969]">
                        Download the Sample CSV File{" "}
                        <a
                          href="/files/Example Student List Spreadsheet.xlsx"
                          download
                          className="underline font-semibold text-[#393939] cursor-pointer"
                        >
                          here
                        </a>
                      </p>
                    </div>
                  </div>
                  {!fileObj ? (
                    <FileUpload onFileSelect={handleFileSelect} />
                  ) : (
                    <div className="flex flex-col gap-4 bg-white border p-4 pl-3.5 rounded-xl">
                      <div className="flex justify-between">
                        <div className="flex items-start gap-2">
                          <Image
                            src={
                              fileObj.file.type.includes("csv")
                                ? "/images/csv.svg"
                                : "/images/file.svg"
                            }
                            alt={fileObj.file.type}
                            width={40}
                            height={40}
                          />
                          <div className="flex flex-col gap-1">
                            <h6 className="text-[#171717] lg:text-sm text-xs font-medium">
                              {fileObj.file.name}
                            </h6>
                            <div className="flex items-center gap-1">
                              <p className="text-[#5C5C5C] lg:text-xs text-[10px]">
                                {(fileObj.file.size / (1024 * 1024)).toFixed(1)}{" "}
                                MB
                              </p>
                              <p className="text-[#5C5C5C]">∙</p>
                              <div className="flex items-center gap-1">
                                {fileObj.status === "uploading" && (
                                  <>
                                    <span className="loader" />
                                    <p className="text-[#171717] lg:text-xs text-[10px]">
                                      Uploading...
                                    </p>
                                  </>
                                )}
                                {fileObj.status === "completed" && (
                                  <>
                                    <Image
                                      src="/images/check.svg"
                                      alt="check"
                                      width={16}
                                      height={16}
                                    />
                                    <p className="text-[#171717] lg:text-xs text-[10px]">
                                      Completed
                                    </p>
                                  </>
                                )}
                                {fileObj.status === "error" && (
                                  <>
                                    <Image
                                      src="/images/error.svg"
                                      alt="error"
                                      width={16}
                                      height={16}
                                    />
                                    <p className="text-[#171717] lg:text-xs text-[10px]">
                                      {fileObj.error ||
                                        "This file exceeds the size limit"}
                                    </p>
                                  </>
                                )}
                              </div>
                            </div>
                            {fileObj.status === "error" && (
                              <p className="text-[#FB3748] lg:text-sm text-xs underline font-medium">
                                Try Again
                              </p>
                            )}
                          </div>
                        </div>
                        <Trash2
                          className={`lg:size-5 size-3 ${
                            fileObj.status === "error"
                              ? "text-[#FB3748]"
                              : "text-[#5C5C5C]"
                          } cursor-pointer`}
                          onClick={handleDelete}
                        />
                      </div>
                      {fileObj.status === "uploading" && (
                        <Progress value={fileObj.progress} />
                      )}
                    </div>
                  )}
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
                    Add Students
                  </h2>
                  <p className="lg:text-sm text-xs text-[#5C5C5C]">
                    Select how you&apos;d like to add students
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex flex-col gap-4">
                    <div
                      className="relative py-[22px] px-[18px] rounded-[14px] h-[85px] shadow-sm bg-white overflow-hidden cursor-pointer hover:shadow-md transition-all duration-300"
                      onClick={() =>
                        router.push(`/new-course/${courseId}/new-student`)
                      }
                    >
                      <div className="flex flex-col gap-1">
                        <h4 className="text-[15px] text-sm text-[#474545] font-semibold">
                          Add Manually
                        </h4>
                        <p className="lg:text-[13px] text-xs text-[#929292] font-medium">
                          Add students one after the other
                        </p>
                      </div>
                      <Image
                        src="/images/manual-bg.svg"
                        alt="manual"
                        width={102.7952033403981}
                        height={102.10327829710428}
                        className="absolute right-0 bottom-0"
                      />
                    </div>
                    <div
                      className="relative py-[22px] px-[18px] rounded-[14px] h-[85px] shadow-sm bg-white cursor-pointer hover:shadow-md transition-all duration-300 overflow-hidden"
                      onClick={() => setShowAddBulk(true)}
                    >
                      <div className="flex flex-col gap-1">
                        <h4 className="text-[15px] text-sm text-[#474545] font-semibold">
                          Add Students Bulk
                        </h4>
                        <p className="lg:text-[13px] text-xs text-[#929292] font-medium">
                          Upload a CSV file of all your students at once
                        </p>
                      </div>
                      <Image
                        src="/images/bulk-bg.svg"
                        alt="bulk"
                        width={102.7952033403981}
                        height={102.10327829710428}
                        className="absolute right-0 bottom-0"
                      />
                    </div>
                  </div>
                  <div className="flex items-center p-2.5 rounded-xl bg-[#F5F7FF] gap-2">
                    <Image
                      src="/images/info.svg"
                      alt="info"
                      width={28}
                      height={28}
                    />
                    <p className="lg:text-sm text-xs text-[#5F5F5F] font-medium max-w-[321px]">
                      Skipping student upload means your marked sheet won&apos;t
                      be linked to any student
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-center items-center">
              <Button
                className="mt-20 md:text-[13px] text-xs rounded-[10px] py-2.5 px-6 bg-gradient-to-t from-[#0089FF] to-[#0068FF]"
                onClick={() => router.push("/my-courses")}
              >
                Skip
              </Button>
            </div>
          </>
        )}
      </div>
    </main>
  );
};

export default AddStudents;
