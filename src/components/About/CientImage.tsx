"use client";

import React from "react";
import Image from "next/image";

interface ClientImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
}

const ClientImage: React.FC<ClientImageProps> = ({
  src,
  alt,
  width,
  height,
  className,
}) => {
  return (
    <div className="relative w-full h-full overflow-hidden">
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={`${className || ""}`}
        style={{ objectFit: "cover", objectPosition: "center" }}
      />
    </div>
  );
};

export default ClientImage;
