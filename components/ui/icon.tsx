import Image from "next/image";
import React from "react";
interface IconI {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  blurWidth?: number | undefined;
  blurHeight?: number | undefined;
}
const Icon = ({ src, alt, width, height, blurWidth, blurHeight }: IconI) => {
  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
    />
  );
};

export default Icon;
