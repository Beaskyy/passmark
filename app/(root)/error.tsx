"use client";

import Image from "next/image";
import Link from "next/link";

export default function ErrorPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4">
      <Image
        src="/images/error.svg"
        alt="Error occurred"
        width={120}
        height={120}
        className="mb-6"
      />
      <h1 className="text-2xl font-bold text-[#171717] mb-2">
        Something went wrong
      </h1>
      <p className="text-[#5C5C5C] mb-6 text-center max-w-md">
        Sorry, an unexpected error has occurred. Please try again or return to
        the homepage.
      </p>
      <Link
        href="/"
        className="bg-gradient-to-t from-[#0068FF] to-[#0089FF] text-white px-6 py-2.5 rounded-[10px] font-medium hover:opacity-90 transition"
      >
        Go to Homepage
      </Link>
    </div>
  );
}
