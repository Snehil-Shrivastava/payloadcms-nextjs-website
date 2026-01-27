import Image from "next/image";
import CTAIcon from "@/public/CTA_Icon.svg";
import Link from "next/link";

const CTA = () => {
  return (
    <Link href={`/?showConsultation=true`} className="fixed bottom-15 right-20">
      <div className="bg-black text-white py-2.5 px-5">
        <div className="flex gap-2.5 items-center">
          <Image src={CTAIcon} alt="CTA_Icon" width={25} height={25} />
          <h1 className="text-lg">Get a Free Consultation</h1>
        </div>
      </div>
    </Link>
  );
};

export default CTA;
