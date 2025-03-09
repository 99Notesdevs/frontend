import React, { useEffect, useState } from "react";
import Image from "next/image";

interface SliderProps {
  images: { src: string; alt: string; info: string }[];
}

const Slider: React.FC<SliderProps> = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="slider w-full">
      <div className="flex space-x-4 overflow-hidden w-full">
        {images.slice(currentIndex, currentIndex + 3).map((image, index) => (
          <div key={index} className="w-1/3 flex-shrink-0 p-2 relative group">
            <Image src={image.src} alt={image.alt} width={300} height={200} className="rounded-lg shadow-lg w-full h-64 object-cover" />
            <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-lg">
              {image.info}
            </div>
          </div>
        ))}
        {currentIndex + 3 > images.length && images.slice(0, (currentIndex + 3) % images.length).map((image, index) => (
          <div key={index + images.length} className="w-1/3 flex-shrink-0 p-2 relative group">
            <Image src={image.src} alt={image.alt} width={300} height={200} className="rounded-lg shadow-lg w-full h-64 object-cover" />
            <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-lg">
              {image.info}
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-center mt-4 space-x-2">
        {images.map((_, index) => (
          <div
            key={index}
            className={`w-3 h-3 rounded-full ${index === currentIndex ? 'bg-gray-800' : 'bg-gray-400'}`}
          />
        ))}
      </div>
    </div>
  );
};

export default Slider;
