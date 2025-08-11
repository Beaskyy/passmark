"use client";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Loader, Trash2, X } from "lucide-react";
import Image from "next/image";
import { useRouter, useParams } from "next/navigation";
import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { useCreateScript } from "@/hooks/useCreateScript";
import { useEstimateCredits } from "@/hooks/useEstimateCredits";
import { useFetchOrganisationCreditBalance } from "@/hooks/useFetchOrganisationCreditBalance";
import { useFetchQuestions } from "@/hooks/useFetchQuestions";
import { useFetchStudentList } from "@/hooks/useFetchStudentList";
import { useSession } from "next-auth/react";
import { useAccount } from "@/providers/AccountProvider";
import { toast } from "sonner";

interface FileWithProgress {
  id: string;
  file: File;
  progress: number;
  status: "error" | "uploading" | "completed";
  error?: string;
}

const UploadScript = () => {
  const router = useRouter();
  const params = useParams();
  const courseId = params.courseId as string;
  const scriptId = params.scriptId as string;
  const [files, setFiles] = useState<FileWithProgress[]>([]);
  const [isMarking, setIsMarking] = useState(false);
  const [markingProgress, setMarkingProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const { mutate: createScript, isPending: isCreating } = useCreateScript();
  const [retryingFileId, setRetryingFileId] = useState<string | null>(null);
  const { mutateAsync: estimateCredits, isPending: isEstimating } =
    useEstimateCredits();
  const { data: creditBalance } = useFetchOrganisationCreditBalance();
  const { data: questionsResponse } = useFetchQuestions(scriptId);
  const { data: session } = useSession();
  const { user } = useAccount();
  const { data: studentsList } = useFetchStudentList(
    user?.organisation?.org_id || ""
  );

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.map((file) => ({
      id: Math.random().toString(36).substring(7),
      file,
      progress: 0,
      status: "uploading" as const,
    }));
    setFiles((prev) => [...prev, ...newFiles]);

    // Simulate upload progress for each new file
    newFiles.forEach((fileObj) => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        setFiles((prev) =>
          prev.map((f) => (f.id === fileObj.id ? { ...f, progress } : f))
        );

        if (progress >= 100) {
          clearInterval(interval);
          setFiles((prev) =>
            prev.map((f) =>
              f.id === fileObj.id ? { ...f, status: "completed" } : f
            )
          );
        }
      }, 500);
    });
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "image/png": [".png"],
      "image/jpeg": [".jpg", ".jpeg"],
    },
    maxSize: 50 * 1024 * 1024, // 50MB
  });

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  // Estimate totals for credit estimation
  const estimateTotals = () => {
    const pages = files.reduce((sum, f) => {
      if (f.file.type.includes("image")) return sum + 1;
      const estimatedPages = Math.max(
        1,
        Math.ceil(f.file.size / (1024 * 1024 * 0.5))
      );
      return sum + estimatedPages;
    }, 0);
    const questionList = ((questionsResponse as any)?.data as any[]) || [];
    const questions =
      questionList.length > 0 ? questionList.length : Math.ceil(pages * 1.5);
    const script_count = files.length;
    return { pages, questions, script_count };
  };

  const handleMarkScript = async () => {
    setUploadError(null);
    try {
      // Step 1: Validate file names match student IDs
      const students = studentsList || [];
      const studentIds = students.map((s) => s.student_number);

      for (const fileObj of files) {
        const fileNameWithoutExt = fileObj.file.name.replace(/\.[^/.]+$/, ""); // Remove file extension
        if (!studentIds.includes(fileNameWithoutExt)) {
          toast.error(
            `File "${fileObj.file.name}" does not match any student ID. Please ensure file names match student numbers.`
          );
          return;
        }
      }

      // Step 2: Estimate credits
      const { pages, questions, script_count } = estimateTotals();
      const estimate = await estimateCredits({
        pages,
        questions,
        script_count,
      });
      const estimatedCredits = estimate.data.estimated_credits;
      const currentBalance = Number(creditBalance?.current_balance || 0);
      if (currentBalance < estimatedCredits) {
        toast.error(
          `Insufficient credits. You need ${estimatedCredits.toFixed(
            2
          )} credits but have ${currentBalance.toFixed(2)} credits.`
        );
        return;
      }

      // Step 3: Proceed with upload and marking
      setIsMarking(true);
      setMarkingProgress(0);
      const uploaded: any[] = [];
      for (let i = 0; i < files.length; i++) {
        setMarkingProgress(Math.round((i / files.length) * 100));
        const fileObj = files[i];
        try {
          const result = await uploadToCloudinary(fileObj.file);
          uploaded.push(result);
        } catch (err: any) {
          setFiles((prev) =>
            prev.map((f) =>
              f.id === fileObj.id
                ? { ...f, status: "error", error: err.message }
                : f
            )
          );
          setUploadError("One or more files failed to upload to Cloudinary.");
          setIsMarking(false);
          return;
        }
      }
      setMarkingProgress(100);
      createScript(
        {
          assessment_id: scriptId,
          scripts: uploaded,
        },
        {
          onSuccess: () => {
            setTimeout(() => {
              router.push(`/my-courses/${courseId}/${scriptId}`);
            }, 1000);
          },
          onError: (err: any) => {
            setUploadError(err.message || "Failed to mark script");
            setIsMarking(false);
          },
        }
      );
    } catch (err: any) {
      setUploadError(err.message || "Unexpected error");
      setIsMarking(false);
    }
  };

  // Cloudinary upload function
  async function uploadToCloudinary(file: File) {
    const formData = new FormData();
    formData.append("file", file);
    formData.append(
      "upload_preset",
      process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!
    );
    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`,
      {
        method: "POST",
        body: formData,
      }
    );
    if (!res.ok) throw new Error("Cloudinary upload failed");
    const data = await res.json();
    return {
      script_url: data.secure_url,
      script_name: data.original_filename,
      script_type: file.type,
      script_size: file.size.toString(),
    };
  }

  // Retry upload for a single file
  const handleRetryUpload = async (fileId: string) => {
    setRetryingFileId(fileId);
    const fileObj = files.find((f) => f.id === fileId);
    if (!fileObj) return;
    setFiles((prev) =>
      prev.map((f) =>
        f.id === fileId ? { ...f, status: "uploading", error: undefined } : f
      )
    );
    try {
      await uploadToCloudinary(fileObj.file);
      setFiles((prev) =>
        prev.map((f) =>
          f.id === fileId ? { ...f, status: "completed", error: undefined } : f
        )
      );
      setRetryingFileId(null);
    } catch (err: any) {
      setFiles((prev) =>
        prev.map((f) =>
          f.id === fileId ? { ...f, status: "error", error: err.message } : f
        )
      );
      setRetryingFileId(null);
    }
  };

  const isUploading = files.some((f) => f.status === "uploading");
  const hasFiles = files.length > 0;
  const completedFiles = files.filter((f) => f.status === "completed").length;

  // Sort files: uploading first, then error, then completed
  const sortedFiles = [...files].sort((a, b) => {
    const statusOrder = { uploading: 0, error: 1, completed: 2 };
    return statusOrder[a.status] - statusOrder[b.status];
  });

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
      </div>
      <div className="flex flex-col justify-center items-center mt-7 ">
        <div className="lg:w-[534px] w-full">
          <div className="flex flex-col justify-center items-center gap-[30px] text-center">
            {!isMarking ? (
              <>
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
                      {...getRootProps()}
                      className={`flex flex-col justify-center items-center gap-3 border border-dashed bg-white p-8 rounded-xl cursor-pointer`}
                    >
                      <input {...getInputProps()} />
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
                          PDF, JPEG, and PNG formats, up to 50 MB
                        </p>
                      </div>
                      <Button className="bg-transparent border border-[#EBEBEB] text-[#5C5C5C] lg:text-sm text-xs max-h-9 py-2 px-[18px] shadow-sm font-medium hover:text-white">
                        Browse File
                      </Button>
                    </div>
                    {hasFiles && (
                      <div className="flex flex-col gap-3">
                        {sortedFiles.map((fileObj) => (
                          <div
                            key={fileObj.id}
                            className={`flex flex-col gap-4 bg-white border ${
                              fileObj.status === "error"
                                ? "border-[#FDB4BA]"
                                : "border-[#EBEBEB]"
                            } p-4 pl-3.5 rounded-xl`}
                          >
                            <div className="flex justify-between">
                              <div className="flex items-start gap-2">
                                <Image
                                  src={
                                    fileObj.file.type.includes("pdf")
                                      ? "/images/pdf.svg"
                                      : "/images/png.svg"
                                  }
                                  alt={fileObj.file.type}
                                  width={40}
                                  height={40}
                                />
                                <div className="flex items-start flex-col gap-1">
                                  <h6 className="text-[#171717] lg:text-sm text-xs font-medium tracking-[-0.06%]">
                                    {fileObj.file.name}
                                  </h6>
                                  <div className="flex items-center gap-1">
                                    <p className="text-[#5C5C5C] lg:text-xs text-[10px]">
                                      {(
                                        fileObj.file.size /
                                        (1024 * 1024)
                                      ).toFixed(1)}{" "}
                                      MB
                                    </p>
                                    <p className="text-[#5C5C5C]">∙</p>
                                    <div className="flex items-center gap-1">
                                      {retryingFileId === fileObj.id ? (
                                        <Loader className="inline-block size-4 animate-spin mr-1 align-middle" />
                                      ) : null}
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
                                    <p
                                      className="text-[#FB3748] lg:text-sm text-xs tracking-[-0.06%] underline font-medium cursor-pointer"
                                      onClick={() =>
                                        handleRetryUpload(fileObj.id)
                                      }
                                    >
                                      {retryingFileId === fileObj.id ? (
                                        <Loader className="inline-block size-4 animate-spin mr-1 align-middle" />
                                      ) : null}
                                      Try Again
                                    </p>
                                  )}
                                </div>
                              </div>
                              {fileObj.status === "uploading" ? (
                                <X
                                  className="lg:size-5 size-3 text-[#5C5C5C] cursor-pointer"
                                  onClick={() => removeFile(fileObj.id)}
                                />
                              ) : (
                                <Trash2
                                  className={`lg:size-5 size-3 ${
                                    fileObj.status === "error"
                                      ? "text-[#FB3748]"
                                      : "text-[#5C5C5C]"
                                  } cursor-pointer`}
                                  onClick={() => removeFile(fileObj.id)}
                                />
                              )}
                            </div>
                            {fileObj.status === "uploading" && (
                              <Progress value={fileObj.progress} />
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <Button
                    className="w-[174px] md:text-[13px] text-xs rounded-[10px] py-2.5 px-6 bg-gradient-to-t from-[#0089FF] to-[#0068FF] max-h-10 disabled:bg-[#F6F6F6] disabled:bg-none disabled:text-[#9A9A9A]"
                    disabled={
                      !hasFiles ||
                      isUploading ||
                      isMarking ||
                      isCreating ||
                      isEstimating
                    }
                    onClick={handleMarkScript}
                  >
                    {isEstimating ? "Estimating Credits..." : "Mark Script"}
                  </Button>
                  {uploadError && (
                    <div className="text-red-500 text-xs mt-2">
                      {uploadError}
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex flex-col gap-[53px] justify-center items-center">
                <div className="text-center">
                  <h2 className="lg:text-lg text-base text-[#171717] font-semibold mt-7">
                    Marking Script
                  </h2>
                  <p className="text-[#5C5C5C] lg:text-sm text-xs">
                    {completedFiles} currently in queue
                  </p>
                </div>
                <Progress value={markingProgress} className="w-[427px]" />
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default UploadScript;
