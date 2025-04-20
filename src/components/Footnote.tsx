import Link from "next/link";
import Image from "next/image";

const Footnote = () => {
  return (
    <div className="flex justify-end items-center gap-1 fixed bottom-2 right-0 bg-neutral-800 bg-opacity-50 rounded-l-2xl z-50">
      <p className="text-white text-[14px] py-1 pl-4 italic">
        Order form demo by:
      </p>
      <Link href="https://iceeqsolutions.fi" target="_blank">
        <Image
          src={"/iCeeqSolutionsLogo.png"}
          height={116}
          width={800}
          alt="Company logo"
          className="h-[20px] w-[125px]"
        />
      </Link>
    </div>
  );
};
export default Footnote;
