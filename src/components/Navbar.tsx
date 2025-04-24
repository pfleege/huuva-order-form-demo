"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

const Navbar = () => {
  const pathname = usePathname();

  useEffect(() => {
    // Scroll up by 100px on every route change
    window.scrollBy({ top: -75, left: 0, behavior: "smooth" });
  }, [pathname]); // Runs when the pathname changes

  return (
    <>
      <nav className="relative h-screen flex justify-center top-0 w-full z-40 navbar">
        <div className="flex bg-neutral-800/50 w-full z-10 h-[100px] mt-10 pl-16 items-center">
          <h1 className="text-[clamp(2rem,8vw,6rem)] firefox text-white text-center font-Playwrite z-10">
            Huuva Order
          </h1>
        </div>
        <div className="navText mx-auto mt-24 h-full flex flex-col justify-between items-center gap-10 z-10"></div>
        <div className="absolute inset-0 w-full h-full overflow-hidden">
          <video
            className="absolute inset-0 w-full h-full object-cover"
            autoPlay
            loop
            muted
            playsInline
          >
            <source src="/food.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      </nav>
      <div className="sticky navText top-0 text-lg sm:text-lg md:text-2xl lg:text-3xl font-Playwrite text-orange-400 links flex justify-center firefox z-40 bg-neutral-800/90 pt-6 pb-4">
        <div className="flex gap-[4vw] sm:gap-[5vw] md:gap-[7vw] lg:gap-[10vw] pl-2 text-center">
          <>
            <Link
              href="/"
              className={
                pathname === "/" ? "font-bold" : "hover:text-white text-black"
              }
            >
              Dashboard
            </Link>
            <Link
              href="/account-orders"
              className={
                pathname === "/account-orders"
                  ? "font-bold"
                  : "hover:text-white text-black"
              }
            >
              Order by Account
            </Link>
            <Link
              href="/view-orders"
              className={
                pathname === "/view-orders"
                  ? "font-bold"
                  : "hover:text-white text-black"
              }
            >
              Orders
            </Link>
            {/* <Link
              href="/add-order"
              className={
                pathname === "/add-order"
                  ? "font-bold"
                  : "hover:text-white text-black"
              }
            >
              Add Order
            </Link> */}
          </>
        </div>
      </div>
    </>
  );
};

export default Navbar;
