"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import Link from "next/link";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const NewCourse = () => {
  const router = useRouter();
  return (
    <main className="lg:px-[108px] md:px-[20] p-5 bg-white min-h-screen">
      <div className="flex justify-between lg:items-center gap-4">
        <div className="flex items-center gap-3 mt-2">
          <Link href="/">
            <Image src="/images/back.svg" alt="back" width={44} height={44} />
          </Link>
          <h3 className="text-black font-semibold lg:text-[17px] text-sm">
            Create new course
          </h3>
        </div>
        <Image src="/images/spinner.svg" alt="spinner" width={32} height={32} />
      </div>
      <div className="flex flex-col gap-3.5 mt-6">
        <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-3.5">
          <div className="flex flex-col gap-1">
            <Label className="text-sm text-[#171717] font-medium">
              Course name <span className="text-[#335CFF]">*</span>
            </Label>
            <Input
              placeholder="eg, Introduction to business education"
              className="shadow-sm border border-[#EBEBEB] p-2.5 pl-3 text-sm placeholder:text-[#8A8A8A] h-10"
            />
          </div>
          <div className="flex flex-col gap-1">
            <Label className="text-sm text-[#171717] font-medium">
              Course title <span className="text-[#335CFF]">*</span>
            </Label>
            <Input
              placeholder="eg, BSE 101"
              className="shadow-sm border border-[#EBEBEB] p-2.5 pl-3 text-sm placeholder:text-[#8A8A8A] h-10"
            />
          </div>
          <div className="flex flex-col gap-1">
            <Label className="text-sm text-[#171717] font-medium">
              Session <span className="text-[#335CFF]">*</span>
            </Label>
            <Select>
              <SelectTrigger className="border border-[#EBEBEB] shadow-sm text-sm h-10 rounded-[10px] text-[#8A8A8A]">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <Label className="text-sm text-[#171717] font-medium">
            Course name <span className="text-[#335CFF]">*</span>
          </Label>
          <Input
            placeholder="eg, BSE 101"
            className="shadow-sm border border-[#EBEBEB] p-2.5 pl-3 text-sm placeholder:text-[#8A8A8A] h-10"
          />
        </div>
      </div>
      <Button
        className="md:mt-40 mt-20 md:text-[13px] text-xs rounded-[10px] py-2.5 px-6 bg-gradient-to-t from-[#0089FF] to-[#0068FF]"
        onClick={() => router.push("/my-script")}
      >
        Continue
      </Button>
    </main>
  );
};

export default NewCourse;
