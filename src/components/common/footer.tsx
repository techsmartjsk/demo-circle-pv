import Image from "next/image";
import logo from "@/assets/logo.png"

export const Footer = () => {
  return (
    <div className="bg-primary h-full">
      <div className="flex justify-between">
        <div className="pl-10 lg:pl-20 py-10">
          <Image src={logo} className="w-[150px] lg:w-[200px]" alt="Logo"></Image>
          <p className="font-bacasime-antique text-white py-10 text-3xl lg:text-6xl">
          Creating Sustainable Solutions for Solar Panel Waste Management
          </p>
          <div className="flex gap-x-20">
            <div>
              <p className="text-white text-xl text-white pb-8">Company</p>
              <ul className="text-white flex flex-col gap-y-4 text-md">
                <li>
                  <a href="/about">About us</a>
                </li>
                <li>
                  <a href="/contact">Contact us</a>
                </li>
              </ul>
            </div>
            <div>
              <p className="text-white text-xl text-white pb-8">Our Work</p>
              <ul className="text-white flex flex-col gap-y-4 text-md">
                <li>
                  <a href="/solution">Our Solution</a>
                </li>
              </ul>
            </div>
          </div>
          <div></div>
        </div>
      </div>
      <div className="py-8 px-5 lg:px-20 mt-4 border-t-[1px] border-secondary flex justify-between">
        <div className="text-white text-lg">
          <p>© 2025 Circle PV Limited</p>
        </div>
      </div>
    </div>
  );
};
