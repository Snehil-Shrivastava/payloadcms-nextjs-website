import Image from "next/image";
import CTAIcon from "@/public/CTA_Icon.svg";
import Link from "next/link";

const CTA = () => {
  return (
    <Link
      href={`/?showConsultation=true`}
      className="fixed bottom-15 max-lg:bottom-8 right-20 max-lg:right-10"
    >
      <div className="bg-black text-white py-2.5 max-lg:py-3 px-5 max-lg:px-3 max-lg:rounded-[50%]">
        <div className="flex gap-2.5 items-center">
          <Image src={CTAIcon} alt="CTA_Icon" width={25} height={25} />
          <h1 className="text-lg max-lg:hidden">Get a Free Consultation</h1>
        </div>
      </div>
    </Link>
  );
};

export default CTA;
