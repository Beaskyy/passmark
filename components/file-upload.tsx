"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import { Button } from "./ui/button";

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  accept?: Record<string, string[]>;
  maxSize?: number;
  className?: string;
  buttonText?: string;
  uploadText?: string;
  subText?: string;
  icon?: string;
}

export const FileUpload = ({
  onFileSelect,
  accept = {
    "text/csv": [".csv"],
    "application/vnd.ms-excel": [".xls"],
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
      ".xlsx",
    ],
  },
  maxSize = 20 * 1024 * 1024, // 20MB default
  className = "",
  buttonText = "Browse File",
  uploadText = "Choose a file or drag & drop it here",
  subText = "CSV, XLS and XLSX formats, up to 20 MB",
  icon = "/images/upload.svg",
}: FileUploadProps) => {
  const [file, setFile] = useState<File | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        setFile(acceptedFiles[0]);
        onFileSelect(acceptedFiles[0]);
      }
    },
    [onFileSelect]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxSize,
    multiple: false,
  });

  return (
    <div
      {...getRootProps()}
      className={`flex flex-col justify-center items-center gap-3 border border-dashed ${
        isDragActive ? "border-[#335CFF] bg-[#F5F7FF]" : "border-[#D1D1D1]"
      } p-8 rounded-xl cursor-pointer transition-colors duration-200 ${className}`}
    >
      <input {...getInputProps()} />
      <Image src={icon} alt="upload" width={24} height={24} />
      <div className="flex flex-col gap-1.5">
        <p className="lg:text-sm text-xs text-[#444444] lg:font-semibold font-medium">
          {file ? file.name : isDragActive ? "Drop the file here" : uploadText}
        </p>
        <p className="lg:text-sm text-xs text-[#838282] lg:font-normal font-light">
          {subText}
        </p>
      </div>
      <Button className="bg-transparent border border-[#EBEBEB] text-[#5C5C5C] lg:text-sm text-xs max-h-9 py-2 px-[18px] shadow-sm font-medium hover:text-white">
        {buttonText}
      </Button>
    </div>
  );
};
