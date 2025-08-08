"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useCreateStudent } from "@/hooks/useCreateStudent";
import { useDeleteEnrollment } from "@/hooks/useDeleteEnrollment";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useUpdateStudent } from "@/hooks/useUpdateStudent";
import { useFetchEnrolledStudents } from "@/hooks/useFetchEnrolledStudents";
import EditStudentsSkeleton from "@/components/skeletons/EditStudentsSkeleton";

import { Button } from "@/components/ui/button";
import { Plus, Trash, Trash2 } from "lucide-react";
import { useParams } from "next/navigation";
import { useAccount } from "@/providers/AccountProvider";

type Student = {
  id: string;
  name: string;
  student_id?: string; // The server-generated ID after creation
  error?: {
    id?: string;
    name?: string;
  };
};

const NewStudent = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { courseId } = useParams();
  const { user } = useAccount();
  const router = useRouter();
  const createStudent = useCreateStudent();
  const deleteEnrollment = useDeleteEnrollment();
  const updateStudentApi = useUpdateStudent();
  const { data: studentList, isLoading } = useFetchEnrolledStudents(
    courseId as string
  );

  useEffect(() => {
    if (studentList) {
      // Transform the fetched students into our local format
      const transformedStudents: Student[] = studentList.map((student) => ({
        id: student.student_number,
        name: student.full_name,
        student_id: student.student_id,
        error: {},
      }));
      // Add an empty form at the end for new students
      transformedStudents.push({ id: "", name: "", error: {} });
      setStudents(transformedStudents);
    } else {
      // If no students loaded yet, start with one empty form
      setStudents([{ id: "", name: "", error: {} }]);
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
    // Only create if both fields are filled, not already created, and not the last empty form
    if (student.id.trim() && student.name.trim()) {
      if (!student.student_id) {
        // Check if this is the last student and if it's empty
        const isLastStudent = index === students.length - 1;
        const lastStudent = students[students.length - 1];
        const isLastEmpty =
          isLastStudent && !lastStudent.id.trim() && !lastStudent.name.trim();

        // Only auto-create if it's not the last empty form
        if (!isLastEmpty) {
          setIsSubmitting(true);
          try {
            const response = await createStudent.mutateAsync({
              course_id: courseId as string,
              student: {
                student_number: student.id,
                full_name: student.name,
              },
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
            // toast.success("Student added successfully");
          } catch (error) {
            toast.error(
              error instanceof Error ? error.message : "Failed to add student"
            );
          } finally {
            setIsSubmitting(false);
          }
        }
      } else {
        // If student_id exists, update the student
        setIsSubmitting(true);
        try {
          await updateStudentApi.mutateAsync({
            student_id: student.student_id,
            course_id: courseId as string,
            student_number: student.id,
            full_name: student.name,
          });
          // Optionally show a toast or update state if needed
        } catch (error) {
          toast.error(
            error instanceof Error ? error.message : "Failed to update student"
          );
        } finally {
          setIsSubmitting(false);
        }
      }
    }
  };

  const removeStudent = async (index: number) => {
    const student = students[index];
    console.log("Attempting to remove student:", student);
    console.log("User object:", user);
    console.log("Organisation ID:", user?.organisation?.org_id);
    console.log("Course ID:", courseId);

    try {
      // If the student has a student_id (means they were saved to the server)
      if (student.student_id) {
        console.log(
          "Calling delete endpoint for student_id:",
          student.student_id
        );
        const payload = {
          organisation_id: user?.organisation?.org_id || "",
          course_id: courseId as string,
          student_id: student.student_id,
        };
        console.log("Delete payload:", payload);
        await deleteEnrollment.mutateAsync(payload);
        console.log("Successfully deleted student from server");
        toast.success("Student enrollment deleted successfully");
      } else {
        console.log("Student was not saved to server, only removing from list");
      }

      // Remove from the list
      const newStudents = students.filter((_, i) => i !== index);
      if (newStudents.length === 0) {
        // If no students left, add an empty form
        newStudents.push({ id: "", name: "", error: {} });
      }
      setStudents(newStudents);
    } catch (error) {
      console.error("Error deleting student:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to delete student enrollment"
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
        [field]: undefined, // Clear the error when user types
      },
    };
    setStudents(newStudents);
  };

  const handleSubmit = async () => {
    router.push(`/my-courses/${courseId}`);
    return;
    // Check if the last student form has data but hasn't been saved
    const lastStudent = students[students.length - 1];
    const hasUnsavedData =
      lastStudent &&
      !lastStudent.student_id &&
      lastStudent.id.trim() &&
      lastStudent.name.trim();

    if (hasUnsavedData) {
      // Create the last student if it has data but hasn't been saved
      setIsSubmitting(true);
      try {
        await createStudent.mutateAsync({
          course_id: courseId as string,
          student: {
            student_number: lastStudent.id,
            full_name: lastStudent.name,
          },
        });
        toast.success("Student added successfully");
        router.push(`/my-courses/${courseId}`);
      } catch (error: any) {
        toast.error(
          error instanceof Error ? error.message : "Failed to add student"
        );
      } finally {
        setIsSubmitting(false);
      }
    } else {
      // No unsaved data, just proceed to next step
      router.push(`/my-courses/${courseId}`);
    }
  };

  if (isLoading) {
    return <EditStudentsSkeleton />;
  }

  return (
    <main className="lg:px-[108px] md:px-[20] p-5 bg-white min-h-screen">
      <div className="flex justify-between lg:items-center gap-4">
        <div className="flex items-center gap-3 mt-2">
          <Link href={`/new-course/${courseId}/add-student`}>
            <Image src="/images/back.svg" alt="back" width={44} height={44} />
          </Link>
          <h3 className="text-black font-semibold lg:text-[17px] text-sm">
            Add my Student
          </h3>
        </div>
        {isSubmitting || deleteEnrollment.isPending ? (
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
                {student.student_id && (
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
        disabled={isSubmitting}
      >
        {isSubmitting ? "Saving..." : "Continue"}
      </Button>
    </main>
  );
};

export default NewStudent;
