"use client"

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";

type AssessmentType = {
  title: string;
  description: string;
  href: string;
};

const CreateAssessment = () => {
  const params = useParams();
  const courseId = params.courseId as string;

  const ASSESSMENT_TYPES: AssessmentType[] = [
    {
      title: "Examination",
      description: "Create a new exam",
      href: `/my-courses/${courseId}/assessments/create/examination`,
    },
    {
      title: "Tests",
      description: "Create a new test",
      href: `/my-courses/${courseId}/assessments/create/test`,
    },
    {
      title: "Assignment",
      description: "Create a new assignment",
      href: `/my-courses/${courseId}/assessments/create/assignment`,
    },
    {
      title: "Others",
      description: "Create a custom assessment",
      href: `/my-courses/${courseId}/assessments/create/other`,
    },
  ];

  const AssessmentCard = ({ title, description, href }: AssessmentType) => (
    <Link href={href} className="block">
      <div className="bg-white shadow-sm py-[22px] px-[18px] rounded-[14px] transition-all duration-200 hover:shadow-md">
        <div className="flex flex-col gap-1">
          <h6 className="text-[#474545] lg:text-[15px] text-sm font-semibold">
            {title}
          </h6>
          <p className="text-[#929292] lg:text-[13px] text-xs font-medium">
            {description}
          </p>
        </div>
      </div>
    </Link>
  );

  return (
    <main className="flex flex-col gap-5 lg:px-[108px] md:px-[20] px-5 pt-7">
      <div className="flex justify-between lg:items-center gap-4">
        <Link
          href={`/my-courses/${courseId}`}
          className="transition-transform hover:scale-105"
        >
          <Image src="/images/back.svg" alt="back" width={44} height={44} />
        </Link>
        <Image src="/images/spinner.svg" alt="spinner" width={32} height={32} />
      </div>
      <div className="flex flex-col gap-[31px]">
        <div className="flex flex-col gap-1.5">
          <h4 className="text-[#171717] lg:text-lg text-base font-semibold">
            Create Assessment
          </h4>
          <p className="text-[#5C5C5C] lg:text-sm text-xs">
            What type of assessment would you like to create?
          </p>
        </div>
        <div className="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-4">
          {ASSESSMENT_TYPES.map((type) => (
            <AssessmentCard key={type.title} {...type} />
          ))}
        </div>
      </div>
    </main>
  );
};

export default CreateAssessment;
