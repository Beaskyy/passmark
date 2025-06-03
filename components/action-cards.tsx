import Image from "next/image";

export default function ActionCards() {
  return (
    <div className="grid lg:grid-cols-2 grid-cols-1 gap-[14px]">
      <div className="flex justify-between items-center bg-[#F0F3FF] lg:p-[22px] p-3 rounded-[10px]">
        <div className="flex flex-col lg:gap-2">
          <h4 className="text-black lg:text-base text-sm lg:font-bold font-medium">
            Mark a New Script
          </h4>
          <p className="lg:text-base text-[10px] text-[#939393] lg:font-medium font-normal">
            Upload and mark a script
          </p>
        </div>
        <Image
          src="/images/book.svg"
          alt="book"
          width={44}
          height={44}
          className="lg:size-11 size-8"
        />
      </div>
      <div className="flex justify-between items-center bg-[#F0F3FF] lg:p-[22px] p-3 rounded-[10px]">
        <div className="flex flex-col lg:gap-2">
          <h4 className="text-black lg:text-base text-sm lg:font-bold font-medium">
            Manage Marked Scripts
          </h4>
          <p className="lg:text-base text-[10px] text-[#939393] lg:font-medium font-normal">
            Reject, Approve an already marked script
          </p>
        </div>
        <Image
          src="/images/book-2.svg"
          alt="book"
          width={44}
          height={44}
          className="lg:size-11 size-8"
        />
      </div>
    </div>
  );
}
