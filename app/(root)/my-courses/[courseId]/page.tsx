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

const formSchema = z.object({
  title: z.string().min(1, "Course name is required"),
  code: z.string().min(1, "Course code is required"),
  session: z.string().min(1, "Session is required"),
  description: z.string().optional(),
});

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

const CourseId = ({ params }: { params: { courseId: string } }) => {
  const { courseId } = params;
  const router = useRouter();
  const queryClient = useQueryClient();
  const { mutate: deleteCourse, isPending } = useDeleteCourse();
  const { status } = useSession();
  const { mutate: editCourse, isPending: isEditPending } = useEditCourse();
  const [showEdit, setShowEdit] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

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
          <Link
            href={`/my-courses/${courseId}/assessments/create`}
            className="flex items-center gap-1 whitespace-nowrap bg-gradient-to-t from-[#0089FF] to-[#0068FF] rounded-[10px] p-2.5 text-white lg:h-10 h-8 w-fit cursor-pointer hover:opacity-95 transition-all duration-300 lg:text-sm text-xs lg:font-semibold font-medium
                "
          >
            <span>Create Assessment</span>
          </Link>
          <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
            <DropdownMenuTrigger className="lg:h-10 h-8 bg-[#F5F7FF] border border-[#F0F3FF] text-[#335CFF] lg:text-sm text-xs tracking-[1.5%] rounded-[10px] lg:font-semibold font-medium w-[122px] hover:bg-[#F0F3FF] hover:text-primary">
              More Options
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[183px] py-3">
              <DropdownMenuLabel
                onClick={() => {
                  setShowEdit(true);
                  setDropdownOpen(false);
                }}
                className="cursor-pointer"
              >
                <span className="lg:text-sm text-xs font-medium text-[#333333]">
                  Edit Course Information
                </span>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuLabel
                onClick={() => router.push(`/my-courses/${courseId}/edit-students`)}
                className="cursor-pointer"
              >
                <span className="lg:text-sm text-xs font-medium text-[#333333]">
                  Edit Student
                </span>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => handleDelete(courseId)}
                className="cursor-pointer"
              >
                <span className="text-sm font-medium text-[#F11B1B]">
                  Delete Course
                </span>
              </DropdownMenuItem>
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
            ) : assessmentList && assessmentList.length > 0 ? (
              <div className="flex flex-col gap-[27px]">
                <div className="mt-10 grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-[18px]">
                  {assessmentList.map(
                    ({ assessment_id, title, description }) => {
                      // Determine type from title or description
                      let type = "other";
                      if (/exam/i.test(title)) type = "examination";
                      else if (/test/i.test(title)) type = "test";
                      else if (/assign/i.test(title)) type = "assignment";
                      else if (/custom|other/i.test(title)) type = "custom";
                      const { yearColor, pillBg } =
                        getAssessmentTypeColors(type);
                      return (
                        <div
                          key={assessment_id}
                          className="relative py-[22px] px-[18px] rounded-[14px] min-h-[57px] shadow-sm hover:shadow-md bg-white overflow-hidden cursor-pointer"
                          onClick={() =>
                            router.push(
                              `/my-courses/${courseId}/${assessment_id}`
                            )
                          }
                        >
                          <div className="flex justify-between items-center gap-1">
                            <h4 className="lg:text-[15px] text-xs text-[#474545] lg:font-semibold font-medium">
                              {description}
                            </h4>
                            <div className="flex items-center gap-1.5">
                              <div
                                className="h-5 py-0.5 px-2 text-xs font-medium rounded-lg w-fit"
                                style={{
                                  backgroundColor: pillBg,
                                  color: yearColor,
                                }}
                              >
                                {type.charAt(0).toUpperCase() + type.slice(1)}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    }
                  )}
                </div>
              </div>
            ) : (
              <EmptyState
                image="/images/empty-state.svg"
                title="No Assessment"
                desc="You've not added any assessment yet"
                link={`/my-courses/${courseId}/assessments/create`}
                buttonText="Create Assessment"
                showIcon={false}
              />
            )}
          </>
        )}
      </>
    </div>
  );
};

export default CourseId;
