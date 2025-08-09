"use client";

import { FileUpload } from "@/components/file-upload";
import ManualBackground from "@/components/ManualBackground";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useExtractQuestions } from "@/hooks/useExtractQuestions";
import { useUploadFile } from "@/hooks/useUploadFile";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";
import { Trash2 } from "lucide-react";

// Define the type for fileObj
interface FileObj {
  file: File;
  status: "uploading" | "completed" | "error";
  progress: number;
  error: string | null;
}

const AddQuestion = () => {
  const params = useParams();
  const courseId = params.courseId as string;
  const createId = params.createId as string;
  const [createdAssessmentId, setCreatedAssessmentId] = useState<string | null>(
    null
  );
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!courseId || !createId) return;
    const key = `createdAssessmentId-${courseId}-${createId}`;
    const id = sessionStorage.getItem(key);
    if (id) setCreatedAssessmentId(id);
  }, [courseId, createId]);

  const router = useRouter();
  const [showAddBulk, setShowAddBulk] = useState(false);
  const [fileObj, setFileObj] = useState<FileObj | null>(null);
  const { mutate: extractQuestions, isPending: isExtracting } =
    useExtractQuestions();
  const { mutate: uploadFile, isPending: isUploading } = useUploadFile();

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

  const handleContinue = () => {
    if (!fileObj || fileObj.status !== "completed") return;
    if (!createdAssessmentId) {
      toast.error("Assessment was not created. Please go back and try again.");
      return;
    }

    // First upload the file to Cloudinary
    uploadFile(fileObj.file, {
      onSuccess: (uploadResponse) => {
        // Then extract questions using the uploaded file URL
        extractQuestions(
          {
            assessment_id: createdAssessmentId,
            doc_url: uploadResponse.script_url,
          },
          {
            onSuccess: () => {
              toast.success("Questions extracted successfully");
              router.push(
                `/my-courses/${courseId}/assessments/create/${createId}/create-assessment/${createdAssessmentId}`
              );
            },
            onError: (err: any) => {
              toast.error(err.message || "Failed to extract questions");
              setFileObj((prev) =>
                prev ? { ...prev, status: "error", error: err.message } : null
              );
            },
          }
        );
      },
      onError: (err: any) => {
        toast.error(err.message || "Failed to upload file");
        setFileObj((prev) =>
          prev ? { ...prev, status: "error", error: err.message } : null
        );
      },
    });
  };

  return (
    <main className="lg:px-[108px] md:px-[20] p-5">
      <div className="flex justify-between lg:items-center gap-4 mt-2">
        <Image
          src="/images/back.svg"
          alt="back"
          width={44}
          height={44}
          onClick={() => router.back()}
        />
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
                  Upload your Question
                </h2>
              </div>
              <div className="flex flex-col justify-center items-center gap-11">
                <div className="flex flex-col gap-3 lg:min-w-[534px]">
                  {fileObj ? (
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center justify-between p-4 border border-[#EBEBEB] rounded-xl bg-white">
                        <div className="flex items-center gap-3">
                          <Image
                            src="/images/file.svg"
                            alt="file"
                            width={24}
                            height={24}
                          />
                          <div className="flex flex-col gap-1">
                            <p className="text-sm font-medium text-[#444444]">
                              {fileObj.file.name}
                            </p>
                            <p className="text-xs text-[#838282]">
                              {(fileObj.file.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleDelete}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                      {fileObj.status === "uploading" && (
                        <div className="flex flex-col gap-2">
                          <Progress
                            value={fileObj.progress}
                            className="w-full"
                          />
                          <p className="text-xs text-[#838282] text-center">
                            Uploading... {fileObj.progress}%
                          </p>
                        </div>
                      )}
                      {fileObj.status === "error" && (
                        <p className="text-xs text-red-500 text-center">
                          {fileObj.error}
                        </p>
                      )}
                    </div>
                  ) : (
                    <FileUpload
                      onFileSelect={handleFileSelect}
                      accept={{
                        "application/msword": [".doc"],
                        "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
                          [".docx"],
                        "application/vnd.google-apps.document": [".gdoc"],
                        "application/vnd.oasis.opendocument.text": [".odt"],
                        "text/plain": [".txt"],
                        "application/rtf": [".rtf"],
                      }}
                      maxSize={20 * 1024 * 1024} // 20MB
                      uploadText="Choose a file or drag & drop it here"
                      subText="DOC, DOCX, GDOC, ODT, TXT and RTF formats, up to 20 MB"
                      icon="/images/upload.svg"
                    />
                  )}
                </div>
                <Button
                  className="w-fit md:text-[13px] text-xs rounded-[10px] py-2.5 px-6 bg-gradient-to-t from-[#0089FF] to-[#0068FF] max-h-10"
                  onClick={handleContinue}
                  disabled={
                    !fileObj ||
                    fileObj.status !== "completed" ||
                    isUploading ||
                    isExtracting
                  }
                >
                  {isUploading
                    ? "Uploading..."
                    : isExtracting
                    ? "Extracting Questions..."
                    : "Continue"}
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
                    Add Questions
                  </h2>
                  <p className="lg:text-sm text-xs text-[#5C5C5C]">
                    Select how you&apos;d like to add your questions
                  </p>
                </div>
                <div className="flex flex-col gap-4 md:min-w-[397.33px]">
                  <div
                    className="relative py-[22px] px-[18px] rounded-[14px] h-[85px] shadow-sm bg-white overflow-hidden cursor-pointer"
                    onClick={() => setShowAddBulk(true)}
                  >
                    <div className="flex flex-col gap-1">
                      <h4 className="lg:text-[15px] text-sm text-[#474545] lg:font-semibold font-medium">
                        Upload Question
                      </h4>
                      <div className="flex items-center gap-1.5">
                        <p className="lg:text-[13px] text-xs text-[#929292] font-medium">
                          Upload your question file
                        </p>
                      </div>
                    </div>
                    <ManualBackground
                      color={"#FFF0F1"}
                      className="absolute right-0 bottom-0"
                    />
                  </div>
                  <Link
                    href={`/my-courses/${courseId}/assessments/create/${createId}/create-assessment/${
                      createdAssessmentId ?? ""
                    }`}
                    className="relative py-[22px] px-[18px] rounded-[14px] h-[85px] shadow-sm bg-white overflow-hidden cursor-pointer"
                    onClick={(e) => {
                      if (!createdAssessmentId) {
                        e.preventDefault();
                        toast.error(
                          "Assessment was not created. Please go back and try again."
                        );
                      }
                    }}
                  >
                    <div className="flex flex-col gap-1">
                      <h4 className="lg:text-[15px] text-sm text-[#474545] lg:font-semibold font-medium">
                        Type Questions
                      </h4>
                      <div className="flex items-center gap-1.5">
                        <p className="lg:text-[13px] text-xs text-[#929292] font-medium">
                          Type out your questions
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

export default AddQuestion;
