"use client";

import { useSearchParams, usePathname } from "next/navigation";
import Link from "next/link";

import consultationIcon from "@/public/consultation_modal_icon.svg";
import Image from "next/image";

const ConsulationOptions = [
  "Home",
  "Office",
  "Showroom",
  "Restaurants",
  "Outdoors",
  "Others",
];

const ConsultationModal = () => {
  const searchParams = useSearchParams();
  const modal = searchParams.get("showConsultation");
  const pathname = usePathname();

  // If the param doesn't exist, don't render anything
  if (!modal) return null;

  return (
    <>
      {/* 1. Backdrop: Click to close (Links back to current path without params) */}
      <div className="fixed inset-0 bg-black/50 z-999" />

      {/* 2. Modal Content */}
      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-200 bg-white p-6 shadow-xl z-1000">
        {/* Header */}
        <div className="flex justify-end items-center mb-4">
          <Link href={pathname} scroll={false} className="text-black">
            ✕
          </Link>
        </div>

        <div className="w-full">
          <div className="inline-flex gap-5 items-center mx-auto relative left-1/2 -translate-x-1/2">
            <div className="bg-black p-1">
              <Image
                src={consultationIcon}
                alt="consultation_icon"
                width={16}
                height={17}
              />
            </div>
            <h2 className="uppercase text-lg font-medium leading-5">
              What are you planning to build
            </h2>
          </div>

          <div className="py-12 grid grid-cols-2 justify-items-center gap-15">
            {ConsulationOptions.map((options, index) => (
              <div
                key={index}
                className="border border-[#00000026] inline-block py-5 px-15 w-69 max-w-69 hover:bg-black hover:text-white hover:font-semibold transition-all duration-300 ease-in-out"
              >
                <h2 className="uppercase font-medium text-center">{options}</h2>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default ConsultationModal;
