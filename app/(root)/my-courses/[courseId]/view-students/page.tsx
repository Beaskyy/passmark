"use client";

import EmptyState from "@/components/empty-state";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { useDeleteCourse } from "@/hooks/useDeleteCourse";
import { useFetchCourseDetails } from "@/hooks/useFetchCourseDetails";
import { assessments, coursesData } from "@/lib/courses";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import CourseDetailsSkeleton from "@/components/skeletons/CourseDetailsSkeleton";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { useEditCourse } from "@/hooks/useEditCourse";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useFetchAssessmentList } from "@/hooks/useFetchAssessmentList";
import { DataTable } from "@/components/data-table";
import { Checkbox } from "@/components/ui/checkbox";
import type { Row, Table } from "@tanstack/react-table";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { useFetchEnrolledStudents } from "@/hooks/useFetchEnrolledStudents";
import { useDeleteEnrollment } from "@/hooks/useDeleteEnrollment";

// Add Student type
interface Student {
  id: string;
  name: string;
  studentId: string;
  dateAdded: string;
}

// Helper to get initials
function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 1)
    .toUpperCase();
}

// Helper to format date
function formatDate(dateString: string) {
  if (!dateString) return "-";
  const date = new Date(dateString);
  return date
    .toLocaleString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })
    .replace(",", "")
    .replace(
      /(\d{2}:\d{2}) (AM|PM)/,
      (match, time, ampm) => `at ${time} ${ampm.toLowerCase()}`
    );
}

// Helper to get first name
function getFirstName(name: string) {
  return name.split(" ")[0];
}

const CourseId = ({ params }: { params: { courseId: string } }) => {
  const { courseId } = params;
  const router = useRouter();
  const queryClient = useQueryClient();
  const { mutate: deleteCourse, isPending } = useDeleteCourse();
  const { status } = useSession();
  const { mutate: editCourse, isPending: isEditPending } = useEditCourse();
  const [showEdit, setShowEdit] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState<Student | null>(null);
  const { mutate: deleteEnrollment, isPending: isDeleting } =
    useDeleteEnrollment();

  // Move formSchema here
  const formSchema = z.object({
    title: z.string().min(1, "Course name is required"),
    code: z.string().min(1, "Course code is required"),
    session: z.string().min(1, "Session is required"),
    description: z.string().optional(),
  });

  // Move getAssessmentTypeColors here
  const getAssessmentTypeColors = (type: string) => {
    switch (type.toLowerCase()) {
      case "examination":
        return { yearColor: "#335CFF", pillBg: "#EBF1FF" };
      case "test":
        return { yearColor: "#FA7319", pillBg: "#FFF3EB" };
      case "assignment":
        return { yearColor: "#1FC16B", pillBg: "#E0FAEC" };
      case "custom":
      case "other":
        return { yearColor: "#7D52F4", pillBg: "#EFEBFF" };
      default:
        return { yearColor: "#335CFF", pillBg: "#EBF1FF" };
    }
  };

  const studentColumns = [
    {
      id: "select",
      header: ({ table }: { table: Table<Student> }) => (
        <Checkbox
          checked={table.getIsAllRowsSelected()}
          onCheckedChange={(value) => table.toggleAllRowsSelected(!!value)}
          aria-label="Select all"
          className="border-[#E1E4EA] data-[state=checked]:bg-primary data-[state=checked]:border-primary shadow-sm"
        />
      ),
      cell: ({ row }: { row: Row<Student> }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
          className="border-[#E1E4EA] data-[state=checked]:bg-primary data-[state=checked]:border-primary shadow-sm"
        />
      ),
    },
    {
      accessorKey: "name",
      header: ({ column }: { column: any }) => (
        <div
          className="flex items-center gap-0.5 cursor-pointer text-[#5C5C5C]"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Student Name
          <Image
            src="/images/up-down-fill.svg"
            alt="up-down-fill"
            width={20}
            height={20}
            style={{
              transform:
                column.getIsSorted() === "desc" ? "rotate(180deg)" : undefined,
              opacity: column.getIsSorted() ? 1 : 0.5,
            }}
          />
        </div>
      ),
      cell: ({ row }: { row: Row<Student> }) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#C0D5FF] flex items-center justify-center text-sm font-medium text-[#122368]">
            {getInitials(row.original.name)}
          </div>
          <span className="font-medium text-[#171717]">
            {row.original.name}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "studentId",
      header: ({ column }: { column: any }) => (
        <div
          className="flex items-center gap-0.5 cursor-pointer text-[#5C5C5C]"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Student&apos;s ID
          <Image
            src="/images/up-down-fill.svg"
            alt="up-down-fill"
            width={20}
            height={20}
            style={{
              transform:
                column.getIsSorted() === "desc" ? "rotate(180deg)" : undefined,
              opacity: column.getIsSorted() ? 1 : 0.5,
            }}
          />
        </div>
      ),
      cell: ({ row }: { row: Row<Student> }) => (
        <span className="text-[#171717]">{row.original.studentId}</span>
      ),
    },
    {
      accessorKey: "dateAdded",
      header: ({ column }: { column: any }) => (
        <div
          className="flex items-center gap-0.5 cursor-pointer text-[#5C5C5C]"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date Added
          <Image
            src="/images/up-down-fill.svg"
            alt="up-down-fill"
            width={20}
            height={20}
            style={{
              transform:
                column.getIsSorted() === "desc" ? "rotate(180deg)" : undefined,
              opacity: column.getIsSorted() ? 1 : 0.5,
            }}
          />
        </div>
      ),
      cell: ({ row }: { row: Row<Student> }) => (
        <span className="text-[#171717]">
          {formatDate(row.original.dateAdded)}
        </span>
      ),
    },
    {
      id: "actions",
      header: () => <div>Actions</div>,
      cell: ({ row }: { row: Row<Student> }) => (
        <button
          className="bg-white border border-[#EBEBEB] text-[#F63636] rounded-lg px-4 py-1.5 font-medium text-sm hover:bg-[#FFF0F0] transition-all drop-shadow-sm"
          onClick={() => {
            setStudentToDelete(row.original);
            setDeleteDialogOpen(true);
          }}
        >
          Delete Student
        </button>
      ),
    },
  ];

  const handleDelete = (course_id: string) => {
    deleteCourse(
      { course_id },
      {
        onSuccess: (data) => {
          toast.success(data.message || "Course deleted successfully");
          queryClient.invalidateQueries({ queryKey: ["courses"] });
          router.replace("/my-courses");
        },
        onError: (error) => {
          toast.error(error.message || "Failed to delete course");
        },
      }
    );
  };
  const {
    data: courseDetails,
    isLoading,
    isError,
    error,
  } = useFetchCourseDetails(courseId);

  const {
    data: assessmentList,
    isLoading: isAssessmentLoading,
    isError: isAssessmentError,
    error: assessmentError,
  } = useFetchAssessmentList(courseId);

  // Fetch enrolled students
  const {
    data: enrolledStudents,
    isLoading: isStudentsLoading,
    isError: isStudentsError,
    error: studentsError,
  } = useFetchEnrolledStudents(courseId);

  // Map API data to Student[] for the table
  const studentsData: Student[] =
    enrolledStudents?.map((s) => ({
      id: s.student_id,
      name: s.full_name,
      studentId: s.student_number,
      dateAdded: s.created_at, // use created_at for date added
    })) ?? [];

  // Setup form with default values from courseDetails
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: courseDetails?.title || "",
      code: courseDetails?.code || "",
      session: courseDetails?.session || "",
      description: courseDetails?.description || "",
    },
    values: {
      title: courseDetails?.title || "",
      code: courseDetails?.code || "",
      session: courseDetails?.session || "",
      description: courseDetails?.description || "",
    },
  });

  if (status === "loading" || isLoading) return <CourseDetailsSkeleton />;
  if (status === "unauthenticated") {
    router.push("/login");
    return null;
  }
  if (isError) return <div>Error - {error.message}</div>;
  const { code, description, title, organisation_id, session } = courseDetails!;

  // Edit handler
  const onSubmit = (values: any) => {
    editCourse(
      {
        ...values,
        course_id: courseId,
      },
      {
        onSuccess: (data) => {
          toast.success(data.message || "Course updated successfully");
          queryClient.invalidateQueries({ queryKey: ["courses"] });
          queryClient.invalidateQueries({ queryKey: ["course", courseId] });
          setShowEdit(false);
        },
        onError: (error) => {
          toast.error(error.message || "Failed to update course");
        },
      }
    );
  };

  return (
    <div className="lg:px-[108px] md:px-[20] p-5 pt-7">
      <div className="flex lg:flex-row flex-col justify-between lg:items-center gap-7">
        <div className="flex gap-[27px]">
          <Link href="/my-courses">
            <Image src="/images/back.svg" alt="back" width={44} height={44} />
          </Link>
          <div className="flex flex-col gap-1">
            <h4 className="text-black lg:text-[17px] text-sm lg:font-semibold font-medium uppercase">
              {code}
            </h4>
            <p className="text-[#939393] lg:text-base text-sm">{description}</p>
          </div>
        </div>
        <div className="flex items-center gap-[14px]">
          <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
            <DropdownMenuTrigger className="lg:h-10 h-8 bg-[#F5F7FF] border border-[#F0F3FF] text-[#335CFF] lg:text-sm text-xs tracking-[1.5%] rounded-[10px] lg:font-semibold font-medium w-[122px] hover:bg-[#F0F3FF] hover:text-primary">
              More Options
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[183px] py-3">
              <DropdownMenuLabel
                onClick={() =>
                  router.push(`/my-courses/${courseId}/edit-students`)
                }
                className="cursor-pointer"
              >
                <span className="lg:text-sm text-xs font-medium text-[#333333]">
                  Edit Student
                </span>
              </DropdownMenuLabel>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <>
        {showEdit ? (
          <div className="flex flex-col gap-4 mt-10">
            <h4 className="text-black lg:text-[17px] text-sm lg:font-semibold font-medium">
              Edit Course Information
            </h4>
            <div className="flex flex-col gap-3.5 mt-6">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-8"
                >
                  <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-3.5">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Course name{" "}
                            <span className="text-[#335CFF]">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="eg, Introduction to business education"
                              {...field}
                              className="shadow-sm border border-[#EBEBEB] text-sm placeholder:text-[#8A8A8A] max-h-10"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="code"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Course title
                            <span className="text-[#335CFF]">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="eg, BSE 101"
                              {...field}
                              className="shadow-sm border border-[#EBEBEB] text-sm placeholder:text-[#8A8A8A] max-h-10 uppercase"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="session"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Session <span className="text-[#335CFF]">*</span>
                          </FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="border border-[#EBEBEB] shadow-sm text-sm h-10 rounded-[10px] text-[#8A8A8A]">
                                <SelectValue placeholder="Select" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="2024/2025">
                                2024/2025
                              </SelectItem>
                              <SelectItem value="2025/2026">
                                2025/2026
                              </SelectItem>
                              <SelectItem value="2026/2027">
                                2026/2027
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Course description{" "}
                          <span className="text-[#5C5C5C] font-normal lg:text-sm text-xs">
                            (Optional)
                          </span>
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="eg, BSE 101" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="md:pt-40 pt-20">
                    <Button
                      type="submit"
                      className="md:text-[13px] text-xs rounded-[10px] py-2.5 px-6 bg-gradient-to-t from-[#0089FF] to-[#0068FF]"
                      disabled={isEditPending}
                    >
                      {isEditPending ? "Saving..." : "Save Changes"}
                    </Button>
                  </div>
                </form>
              </Form>
            </div>
          </div>
        ) : (
          <>
            {isAssessmentLoading ? (
              <CourseDetailsSkeleton />
            ) : isAssessmentError ? (
              <div>Error - {assessmentError.message}</div>
            ) : (
              <div className="flex flex-col gap-[27px]">
                <div className="mt-10">
                  <Link
                    href="marked-scripts"
                    className="flex justify-between items-center bg-[#F0F3FF] lg:p-[22px] p-3 rounded-[10px] hover:shadow-sm"
                  >
                    <div className="flex flex-col lg:gap-2">
                      <p className="lg:text-base text-[10px] text-[#939393] lg:font-medium font-normal">
                        My Students
                      </p>
                      <h4 className="text-black lg:text-base text-sm lg:font-[650] font-medium">
                        {studentsData?.length} Student
                        {studentsData?.length === 1 ? "" : "s"}
                      </h4>
                    </div>
                    <Image
                      src="/images/book-2.svg"
                      alt="book"
                      width={44}
                      height={44}
                      className="lg:size-11 size-8"
                    />
                  </Link>
                </div>
                <div className="mt-8">
                  {isStudentsLoading ? (
                    <div className="text-center py-8 text-[#8C8C8C]">
                      Loading students...
                    </div>
                  ) : isStudentsError ? (
                    <div className="text-center py-8 text-[#F63636]">
                      {studentsError?.message || "Failed to load students."}
                    </div>
                  ) : studentsData.length > 0 ? (
                    <DataTable
                      columns={studentColumns}
                      data={studentsData}
                      searchKey="name"
                      tableName="Student list"
                      getId={(row) => row.id}
                      showDeleteStudent={true}
                      showStatusFilter={false}
                    />
                  ) : (
                    <EmptyState
                      image="/images/empty-state.svg"
                      title="No student"
                      desc="You've not added any student"
                      link={`/my-courses/${courseId}/edit-students`}
                      buttonText="Add student"
                      showIcon={false}
                    />
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </>
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent
          className="max-w-[357px] px-5 py-4 text-center"
          style={{ borderRadius: "20px" }}
        >
          <div className="flex flex-col items-center">
            <div className="bg-[#FEEDE1] rounded-[10px] p-2 w-10 h-10 flex items-center justify-center mb-4">
              <Image
                src="/images/alert.svg"
                alt="alert"
                width={40}
                height={40}
              />
            </div>
            <DialogTitle className="text-base text-[#171717] font-semibold mb-2">
              Are you sure?
            </DialogTitle>
            <DialogDescription className="text-sm mb-6 text-[#8C8C8C]">
              Kindly confirm that you want to delete
              {studentToDelete
                ? getFirstName(studentToDelete.name)
                : "this student"}{" "}
              from your student list?
            </DialogDescription>
            <div className="flex gap-3 w-full justify-center">
              <DialogClose asChild>
                <Button
                  variant="outline"
                  className="w-1/2 border-none  lg:h-10 h-8 bg-[#F5F7FF] border border-[#F0F3FF] text-[#335CFF] lg:text-sm text-xs tracking-[1.5%] rounded-[10px] lg:font-semibold font-medium hover:bg-[#F0F3FF] hover:text-primary"
                >
                  No, Cancel
                </Button>
              </DialogClose>
              <Button
                className="w-1/2 bg-[#335CFF] hover:bg-[#2346A0]flex items-center gap-1 whitespace-nowrap bg-gradient-to-t from-[#0089FF] to-[#0068FF] rounded-[10px] p-2.5 text-white lg:h-10 h-8 cursor-pointer hover:opacity-95 transition-all duration-300 lg:text-sm text-xs lg:font-semibold font-medium"
                disabled={isDeleting}
                onClick={() => {
                  if (!studentToDelete) return;
                  deleteEnrollment(
                    {
                      organisation_id: organisation_id,
                      course_id: courseId,
                      student_id: studentToDelete.id,
                    },
                    {
                      onSuccess: () => {
                        toast.success("Student deleted successfully");
                        setDeleteDialogOpen(false);
                        setStudentToDelete(null);
                        // Refetch students
                        queryClient.invalidateQueries({
                          queryKey: ["enrolledStudents", courseId],
                        });
                      },
                      onError: (error: any) => {
                        toast.error(
                          error.message || "Failed to delete student"
                        );
                      },
                    }
                  );
                }}
              >
                {isDeleting ? "Deleting..." : "Yes, Delete"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CourseId;
