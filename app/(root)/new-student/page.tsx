"use client"

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Plus, Trash, Trash2 } from "lucide-react";

const NewStudent = () => {
  const [students, setStudents] = useState([{ id: "", name: "" }]);

  const addStudent = () => {
    setStudents([...students, { id: "", name: "" }]);
  };

  const removeStudent = (index: number) => {
    if (students.length > 1) {
      const newStudents = students.filter((_, i) => i !== index);
      setStudents(newStudents);
    }
  };

  const updateStudent = (
    index: number,
    field: "id" | "name",
    value: string
  ) => {
    const newStudents = [...students];
    newStudents[index][field] = value;
    setStudents(newStudents);
  };

  return (
    <main className="lg:px-[108px] md:px-[20] p-5 bg-white min-h-screen">
      <div className="flex justify-between lg:items-center gap-4">
        <div className="flex items-center gap-3 mt-2">
          <Link href="/">
            <Image src="/images/back.svg" alt="back" width={44} height={44} />
          </Link>
          <h3 className="text-black font-semibold lg:text-[17px] text-sm">
            Add my Student
          </h3>
        </div>
        <Image src="/images/spinner.svg" alt="spinner" width={32} height={32} />
      </div>
      <div className="flex flex-col gap-3.5 mt-6">
        <h2 className="text-black lg:text-[15px] text-sm font-semibold">
          My Students
        </h2>
        {students.map((student, index) => (
          <div
            key={index}
            className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-3.5"
          >
            <div className="flex flex-col gap-1">
              <Label className="text-sm text-[#171717] font-medium">
                Student ID <span className="text-[#335CFF]">*</span>
              </Label>
              <Input
                placeholder="123/343/HJ"
                className="shadow-sm border border-[#EBEBEB] p-2.5 pl-3 text-sm placeholder:text-[#8A8A8A] h-10"
                value={student.id}
                onChange={(e) => updateStudent(index, "id", e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1">
              <Label className="text-sm text-[#171717] font-medium">
                Student name <span className="text-[#335CFF]">*</span>
              </Label>
              <div className="flex items-center gap-3.5">
                <Input
                  placeholder="Enter student name"
                  className="shadow-sm border border-[#EBEBEB] p-2.5 pl-3 text-sm placeholder:text-[#8A8A8A] h-10"
                  value={student.name}
                  onChange={(e) => updateStudent(index, "name", e.target.value)}
                />
                {students.length > 1 && (
                  <div
                    className="flex justify-center items-center size-8 rounded-lg bg-[#FFE9E9] cursor-pointer"
                    onClick={() => removeStudent(index)}
                  >
                    <Trash2 className="text-[#EB5D57] w-[12.44x] h-3.5" />
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        <div
          className="flex items-center gap-1 cursor-pointer text-[#335CFF] lg:text-sm text-xs font-semibold hover:opacity-85"
          onClick={addStudent}
        >
          <Plus size={20} />
          Add New Student(s)
        </div>
      </div>
      <Button className="md:mt-40 mt-20 md:text-[13px] text-xs rounded-[10px] py-2.5 px-6 bg-gradient-to-t from-[#0068FF] to-[#0089FF] max-h-10">
        Continue
      </Button>
    </main>
  );
};

export default NewStudent;
