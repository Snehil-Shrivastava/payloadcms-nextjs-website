"use client";

import { useSearchParams, usePathname } from "next/navigation";
import Link from "next/link";
import consultationIcon from "@/public/consultation_modal_icon.svg";
import contactIcon from "@/public/contact_icon.svg";
import Image from "next/image";
import { useState } from "react";

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

  const [step, setStep] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  // If the param doesn't exist, don't render anything
  if (!modal) return null;

  const toggleOption = (option: string) => {
    setSelectedOptions(
      (prev) =>
        prev.includes(option)
          ? prev.filter((item) => item !== option) // Remove if exists
          : [...prev, option], // Add if doesn't exist
    );
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSubmit = (e: any) => {
    e.preventDefault();

    const finalPayload = {
      projectType: selectedOptions,
      ...formData,
    };

    console.log("Submitting Data:", finalPayload);
    // Add your API call here
    // alert("Form Submitted! Check console.");
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-999" />

      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-lg:w-[90%] max-w-200 bg-white p-6 pb-10 shadow-xl z-1000">
        {/* Header (Close Button) */}
        <div className="flex justify-end items-center mb-4">
          <Link href={pathname} scroll={false} className="text-black">
            ✕
          </Link>
        </div>

        <div className="w-full">
          {/* Icon & Title - Dynamic based on step */}
          <div className="inline-flex gap-5 max-sm:gap-2.5 items-center mx-auto relative left-1/2 -translate-x-1/2 mb-8 max-sm:mb-0">
            <div className="bg-black p-1">
              <Image
                src={step === 1 ? consultationIcon : contactIcon}
                alt="consultation_icon"
                width={15}
                height={15}
                className="max-sm:w-2 max-sm:h-2"
              />
            </div>
            <h2 className="uppercase text-lg max-sm:text-xs font-medium leading-5">
              {step === 1
                ? "What are you planning to build"
                : "Contact details"}
            </h2>
          </div>

          {/* --- STEP 1: RADIO SELECTION --- */}
          {step === 1 && (
            <div className="animate-in fade-in duration-300">
              <div className="py-8 grid grid-cols-2 justify-items-center gap-10 max-sm:gap-6">
                {ConsulationOptions.map((options, index) => {
                  const isSelected = selectedOptions.includes(options);

                  return (
                    <label
                      key={index}
                      className={`
                    cursor-pointer px-6 py-3 border transition-all duration-200 w-48 max-sm:w-30 text-center select-none max-sm:text-sm
                    ${
                      isSelected
                        ? "bg-black text-white border-black"
                        : "border-gray-300 hover:bg-black hover:text-white text-black"
                    }
                  `}
                    >
                      <input
                        type="checkbox"
                        value={options}
                        name="wantToBuild"
                        className="sr-only"
                        checked={isSelected}
                        onChange={() => toggleOption(options)}
                      />
                      {options}
                    </label>
                  );
                })}
              </div>

              {/* Next Button */}
              <div
                className={`flex justify-end transition-all duration-100 ease-linear mt-4 w-4/5 max-sm:w-full mx-auto select-none max-sm:text-sm ${
                  selectedOptions.length > 0
                    ? "opacity-100 visible"
                    : "opacity-0 invisible"
                }`}
              >
                <button
                  onClick={() => setStep(2)}
                  className="bg-black text-white px-8 py-2 hover:bg-gray-800 transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {/* --- STEP 2: CONTACT FORM --- */}
          {step === 2 && (
            <form
              onSubmit={handleSubmit}
              className="animate-in fade-in duration-300 w-full mx-auto"
            >
              <div className="space-y-10 py-4 max-w-md mx-auto max-sm:text-sm">
                <div>
                  <input
                    required
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full border-b border-gray-300 p-2 focus:outline-none focus:border-black transition-colors"
                    placeholder="Your Name*"
                  />
                </div>

                <div>
                  <input
                    required
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full border-b border-gray-300 p-2 focus:outline-none focus:border-black transition-colors"
                    placeholder="Your Email*"
                  />
                </div>

                <div>
                  <input
                    required
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full border-b border-gray-300 p-2 focus:outline-none focus:border-black transition-colors"
                    placeholder="Your Number*"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-between mt-8 w-4/5 max-sm:w-full mx-auto select-none max-sm:text-sm">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-black underline underline-offset-4 hover:text-gray-600"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="bg-black text-white px-8 py-2 hover:bg-gray-800 transition-colors"
                >
                  Submit
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </>
  );
};

export default ConsultationModal;
