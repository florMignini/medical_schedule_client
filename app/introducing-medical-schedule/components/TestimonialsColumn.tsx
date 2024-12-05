import Image from "next/image";
import React from "react";
import { firstColumn } from "../data/testimonials";
import { twMerge } from "tailwind-merge";
type testimonials = {
  text: string;
  imgSrc: string;
  name: string;
  specialty: string;
};
const TestimonialsColumn = (props: {
  className?: string;
  testimonials: typeof testimonials;
}) => {
  return (
    <div
      className={twMerge(
        "flex flex-col gap-6 mt-10 [mask-image:linear-gradient(to_bottom,transparent,black_25%,black_75%,transparent)]",
        props.className
      )}
    >
      {props.testimonials?.map(
        ({ text, imgSrc, name, specialty }: testimonials) => (
          <div
            className="bg-white max-w-xs w-full rounded-3xl shadow-[0_7px_14px_#EAEAEA] mx-auto px-2 py-3 border-[#222222]/10 h-auto mt-2"
            key={name}
          >
            <p className="text-gray-400 text-[15px] ml-1 font-light">{text}</p>
            <div className="flex items-center gap-2 mt-5">
              <Image
                src={imgSrc}
                alt="user-image"
                width={40}
                height={40}
                className="h-10 w-10 rounded-full"
              />
              <div className="flex flex-col">
                <p className="ml-1 font-semibold leading-5 tracking-tight">
                  {name}
                </p>
                <p className="text-gray-400 ml-1 text-sm font-light leading-5 tracking-tight">
                  {specialty}
                </p>
              </div>
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default TestimonialsColumn;
