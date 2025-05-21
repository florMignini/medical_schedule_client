import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
type testimonials = {
  text: string;
  imgSrc: string;
  name: string;
  specialty: string;
};
const TestimonialsColumn = (props: {
  className?: string;
  //   @ts-ignore
  testimonials: typeof testimonials;
}) => {
  return (
    <div className={props.className}>
      <motion.div
      animate={{
        translateY: "-30%"
      }}
      transition={{
        duration: 10,
        repeat: Infinity,
        ease: "linear",
        repeatType: "loop"
      }}
      className="flex flex-col gap-6">
        {[...new Array(1)].fill(0).map((_, index) => (
          <React.Fragment key={index}>
            {props.testimonials?.map(
              ({ text, imgSrc, name, specialty }: testimonials) => (
                <div
                  className="bg-white max-w-xs w-full rounded-3xl shadow-[0_7px_14px_#EAEAEA] mx-auto px-2 py-3 border-[#222222]/10 h-auto mt-2"
                  key={name}
                >
                  <p className="text-gray-400 text-[15px] ml-1 font-light">
                    {text}
                  </p>
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
          </React.Fragment>
        ))}
        {props.testimonials?.map(
          ({ text, imgSrc, name, specialty }: testimonials) => (
            <div
              className="bg-white max-w-xs w-full rounded-3xl shadow-[0_7px_14px_#EAEAEA] mx-auto px-2 py-3 border-[#222222]/10 h-auto mt-2"
              key={name}
            >
              <p className="text-gray-400 text-[15px] ml-1 font-light">
                {text}
              </p>
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
      </motion.div>
    </div>
  );
};

export default TestimonialsColumn;
