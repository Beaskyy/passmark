"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useCreateStudent } from "@/hooks/useCreateStudent";
import { useDeleteStudent } from "@/hooks/useDeleteStudent";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useUpdateStudent } from "@/hooks/useUpdateStudent";
import { useFetchStudentList } from "@/hooks/useFetchStudentList";

import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { useParams } from "next/navigation";
import { useAccount } from "@/providers/AccountProvider";

type Student = {
  id: string;
  name: string;
  student_id?: string;
  error?: {
    id?: string;
    name?: string;
  };
};

const ManageStudents = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { courseId } = useParams();
  const { user } = useAccount();
  const router = useRouter();
  const createStudent = useCreateStudent();
  const deleteStudent = useDeleteStudent();
  const updateStudentApi = useUpdateStudent();
  const { data: studentList, isLoading } = useFetchStudentList(
    user?.organisation?.org_id || ""
  );

  useEffect(() => {
    if (studentList) {
      // Transform the fetched students into our local format
      const transformedStudents = studentList.map((student) => ({
        id: student.student_number,
        name: student.full_name,
        student_id: student.student_id,
        error: {},
      }));
      setStudents([...transformedStudents, { id: "", name: "", error: {} }]);
    }
  }, [studentList]);

  const validateStudent = (student: Student): boolean => {
    const newError: { id?: string; name?: string } = {};
    let isValid = true;

    if (!student.id.trim()) {
      newError.id = "Student ID is required";
      isValid = false;
    }
    if (!student.name.trim()) {
      newError.name = "Student name is required";
      isValid = false;
    }

    // Update the student's error state
    const studentIndex = students.findIndex((s) => s === student);
    if (studentIndex !== -1) {
      const newStudents = [...students];
      newStudents[studentIndex] = { ...student, error: newError };
      setStudents(newStudents);
    }

    return isValid;
  };

  const handleStudentBlur = async (index: number) => {
    const student = students[index];
    // Only create/update if both fields are filled
    if (student.id.trim() && student.name.trim()) {
      setIsSubmitting(true);
      try {
        if (!student.student_id) {
          // Create new student
          const response = await createStudent.mutateAsync({
            course_id: courseId as string,
            student_number: student.id,
            full_name: student.name,
          });
          // Update the student with their server-generated ID
          let newStudents = [...students];
          newStudents[index] = {
            ...student,
            student_id: response.data?.student_id || response.student_id,
          };
          // If there is no empty student form at the end, add one
          const last = newStudents[newStudents.length - 1];
          if (last.id.trim() && last.name.trim()) {
            newStudents = [...newStudents, { id: "", name: "", error: {} }];
          }
          setStudents(newStudents);
          toast.success("Student added successfully");
        } else {
          // Update existing student
          await updateStudentApi.mutateAsync({
            student_id: student.student_id,
            course_id: courseId as string,
            student_number: student.id,
            full_name: student.name,
          });
          toast.success("Student updated successfully");
        }
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Failed to save student"
        );
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const removeStudent = async (index: number) => {
    const student = students[index];
    try {
      if (student.student_id) {
        await deleteStudent.mutateAsync({
          student_id: student.student_id,
        });
        toast.success("Student deleted successfully");
      }

      const newStudents = students.filter((_, i) => i !== index);
      // Ensure there's always an empty form at the end
      if (
        newStudents.length === 0 ||
        newStudents[newStudents.length - 1].id !== ""
      ) {
        newStudents.push({ id: "", name: "", error: {} });
      }
      setStudents(newStudents);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete student"
      );
    }
  };

  const updateStudent = (
    index: number,
    field: "id" | "name",
    value: string
  ) => {
    const newStudents = [...students];
    newStudents[index] = {
      ...newStudents[index],
      [field]: value,
      error: {
        ...newStudents[index].error,
        [field]: undefined,
      },
    };
    setStudents(newStudents);
  };

  const handleSubmit = async () => {
    const lastStudent = students[students.length - 1];
    if (
      lastStudent.id.trim() &&
      lastStudent.name.trim() &&
      !lastStudent.student_id
    ) {
      setIsSubmitting(true);
      try {
        await createStudent.mutateAsync({
          course_id: courseId as string,
          student_number: lastStudent.id,
          full_name: lastStudent.name,
        });
        router.push(`/my-courses/${courseId}`);
        return;
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Failed to add student"
        );
        setIsSubmitting(false);
        return;
      }
    }
    router.push(`/my-courses/${courseId}`);
  };

  if (isLoading) {
    return (
      <main className="lg:px-[108px] md:px-[20] p-5 bg-white min-h-screen">
        <div className="flex justify-center items-center h-[50vh]">
          <Image
            src="/images/spinner.svg"
            alt="loading"
            width={40}
            height={40}
            className="animate-spin"
          />
        </div>
      </main>
    );
  }

  return (
    <main className="lg:px-[108px] md:px-[20] p-5 bg-white min-h-screen">
      <div className="flex justify-between lg:items-center gap-4">
        <div className="flex items-center gap-3 mt-2">
          <Link href={`/my-courses/${courseId}`}>
            <Image src="/images/back.svg" alt="back" width={44} height={44} />
          </Link>
          <h3 className="text-black font-semibold lg:text-[17px] text-sm">
            Manage Students
          </h3>
        </div>
        {isSubmitting || deleteStudent.isPending ? (
          <Image
            src="/images/spinner.svg"
            alt="spinner"
            width={32}
            height={32}
            className="animate-spin"
          />
        ) : (
          <Image
            src="/images/spinner.svg"
            alt="spinner"
            width={32}
            height={32}
          />
        )}
      </div>
      <div className="flex flex-col gap-3.5 mt-6">
        <h2 className="text-black lg:text-[15px] text-sm font-semibold">
          Course Students
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
                className={`shadow-sm border ${
                  student.error?.id ? "border-red-500" : "border-[#EBEBEB]"
                } p-2.5 pl-3 text-sm placeholder:text-[#8A8A8A] h-10`}
                value={student.id}
                onChange={(e) => updateStudent(index, "id", e.target.value)}
                required
                onBlur={() => handleStudentBlur(index)}
              />
              {student.error?.id && (
                <span className="text-xs text-red-500 mt-1">
                  {student.error.id}
                </span>
              )}
            </div>
            <div className="flex flex-col gap-1">
              <Label className="text-sm text-[#171717] font-medium">
                Student name <span className="text-[#335CFF]">*</span>
              </Label>
              <div className="flex items-center gap-3.5">
                <div className="flex-1 flex flex-col">
                  <Input
                    placeholder="Enter student name"
                    className={`shadow-sm border ${
                      student.error?.name
                        ? "border-red-500"
                        : "border-[#EBEBEB]"
                    } p-2.5 pl-3 text-sm placeholder:text-[#8A8A8A] h-10`}
                    value={student.name}
                    onChange={(e) =>
                      updateStudent(index, "name", e.target.value)
                    }
                    required
                    onBlur={() => handleStudentBlur(index)}
                  />
                  {student.error?.name && (
                    <span className="text-xs text-red-500 mt-1">
                      {student.error.name}
                    </span>
                  )}
                </div>
                <div
                  className="flex justify-center items-center size-8 rounded-lg bg-[#FFE9E9] cursor-pointer"
                  onClick={() => removeStudent(index)}
                >
                  <Trash2 className="text-[#EB5D57] w-[12.44x] h-3.5" />
                </div>
              </div>
            </div>
          </div>
        ))}
        <div
          className="flex items-center gap-1 cursor-pointer text-[#335CFF] lg:text-sm text-xs font-semibold hover:opacity-85"
          onClick={() =>
            setStudents([...students, { id: "", name: "", error: {} }])
          }
        >
          <Plus size={20} />
          Add New Student
        </div>
      </div>
      <Button
        className="md:mt-40 mt-20 md:text-[13px] text-xs rounded-[10px] py-2.5 px-6 bg-gradient-to-t from-[#0089FF] to-[#0068FF] max-h-10"
        onClick={handleSubmit}
      >
        Save Changes
      </Button>
    </main>
  );
};

export default ManageStudents;
