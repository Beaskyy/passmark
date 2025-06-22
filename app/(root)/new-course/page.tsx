"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import Link from "next/link";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { useAccount } from "@/providers/AccountProvider";

const formSchema = z.object({
  title: z.string().min(3, {
    message: "The course name must be at least 3 characters",
  }),
  code: z.string().min(3, {
    message: "The course code must be at least 3 characters",
  }),
  session: z.string().min(1, { message: "Please select a session" }),
  description: z.string().optional(),
});

const NewCourse = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const { user } = useAccount();
  console.log(user, "besky");

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      code: "",
      session: "",
      description: "",
    },
  });

  const { mutate: createCourse, isPending } = useMutation({
    mutationFn: async (payload: z.infer<typeof formSchema>) => {
      const fullPayload = {
        ...payload,
        organisation_id: user?.organisation?.org_id,
      };
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/main/course/update/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.accessToken}`,
          },
          body: JSON.stringify(fullPayload),
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create course");
      }
      return response.json();
    },
    onSuccess: (response) => {
      console.log(response, "this is the response");
      toast.success("Course created successfully!");
      router.push("/my-courses");
    },
    onError: (error: any) => {
      toast.error(error.detail || "Something went wrong.");
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    createCourse(values);
  }

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
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-3.5">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Course name <span className="text-[#335CFF]">*</span>
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
                      Course title<span className="text-[#335CFF]">*</span>
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
                        <SelectItem value="2024/2025">2024/2025</SelectItem>
                        <SelectItem value="2025/2026">2025/2026</SelectItem>
                        <SelectItem value="2026/2027">2026/2027</SelectItem>
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
                disabled={isPending}
              >
                {isPending ? "Creating..." : "Continue"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </main>
  );
};

export default NewCourse;
