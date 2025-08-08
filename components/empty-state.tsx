import { Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface EmptyStateProps {
  image: string;
  title: string;
  desc: string;
  link: string;
  buttonText: string;
  showIcon?: boolean;
  onClick?: () => void;
}

const EmptyState = ({
  image,
  title,
  desc,
  link,
  buttonText,
  showIcon,
  onClick,
}: EmptyStateProps) => {
  const buttonContent = (
    <>
      {showIcon && <Plus className="lg:size-5 size-4" />}
      <span>{buttonText}</span>
    </>
  );

  return (
    <div className="flex flex-col justify-center items-center min-h-[60vh]">
      <div className="flex flex-col justify-center items-center gap-[22px] max-w-[241px]">
        <Image src={image} alt="image" width={100} height={100} />
        <div className="flex flex-col gap-[13px] text-center">
          <h4 className="text-black lg:text-lg text-base leading-5 font-semibold">
            {title}
          </h4>
          <p className="text-[#808080] lg:text-sm text-xs max-w-[220px]">
            {desc}
          </p>
        </div>
      </div>
      {onClick ? (
        <button
          onClick={onClick}
          className="mt-12 flex items-center gap-1 bg-gradient-to-t from-[#0089FF] to-[#0068FF] rounded-[10px] p-2.5 text-white lg:h-10 h-8 w-fit cursor-pointer hover:opacity-95 transition-all duration-300 lg:text-sm text-xs font-medium"
        >
          {buttonContent}
        </button>
      ) : (
        <Link
          href={link}
          className="mt-12 flex items-center gap-1 bg-gradient-to-t from-[#0089FF] to-[#0068FF] rounded-[10px] p-2.5 text-white lg:h-10 h-8 w-fit cursor-pointer hover:opacity-95 transition-all duration-300 lg:text-sm text-xs font-medium"
        >
          {buttonContent}
        </Link>
      )}
    </div>
  );
};

export default EmptyState;
