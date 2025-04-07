"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";

interface SliderProps {
  images: { src: string; alt: string; info: string }[];
}

const Slider: React.FC<SliderProps> = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);

  // Responsive images per slide based on screen size
  const [imagesPerSlide, setImagesPerSlide] = useState(3);

  // Update images per slide based on window size
  useEffect(() => {
    const handleResize = () => {
      if (typeof window !== 'undefined') {
        if (window.innerWidth < 640) {
          setImagesPerSlide(1); // Mobile: 1 image
        } else if (window.innerWidth < 1024) {
          setImagesPerSlide(2); // Tablet: 2 images
        } else {
          setImagesPerSlide(3); // Desktop: 3 images
        }
      }
    };

    // Set initial value
    handleResize();

    // Add event listener
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const totalSlides = Math.ceil(images.length / imagesPerSlide);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isAutoPlay) {
      interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % totalSlides);
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [totalSlides, isAutoPlay]);

  const handleDotClick = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlay(false);
  };

  const handlePrevClick = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + totalSlides) % totalSlides);
    setIsAutoPlay(false);
  };

  const handleNextClick = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % totalSlides);
    setIsAutoPlay(false);
  };

  const getCurrentSlideImages = () => {
    const startIdx = currentIndex * imagesPerSlide;
    return images.slice(startIdx, startIdx + imagesPerSlide);
  };

  return (
    <div className="slider w-full relative px-4 sm:px-2">
      {/* Main Images Display */}
      <div className="relative w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
          {getCurrentSlideImages().map((image, idx) => (
            image.src && (
              <div key={idx} className="relative aspect-[4/3] group overflow-hidden rounded-xl">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-indigo-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>
                <div className="w-full h-full relative">
                  <Image 
                    src={image.src} 
                    alt={image.alt}
                    width={400} 
                    height={300} 
                    className="w-full h-full object-cover rounded-xl shadow-md transition-all duration-500 group-hover:scale-105"
                    style={{ objectPosition: "center" }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl flex items-end justify-center p-4 z-20">
                    <p className="text-white text-sm font-medium text-center">
                      {image.info}
                    </p>
                  </div>
                </div>
              </div>
            )
          ))}
        </div>
      </div>

      {/* Navigation Arrows - Adjusted for mobile */}
      <button 
        onClick={handlePrevClick}
        className="absolute -left-2 sm:-left-4 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 bg-white/90 rounded-full flex items-center justify-center text-gray-800 hover:bg-white hover:shadow-lg transition-all duration-200 shadow-md z-30"
        aria-label="Previous slide"
      >
        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button 
        onClick={handleNextClick}
        className="absolute -right-2 sm:-right-4 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 bg-white/90 rounded-full flex items-center justify-center text-gray-800 hover:bg-white hover:shadow-lg transition-all duration-200 shadow-md z-30"
        aria-label="Next slide"
      >
        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Navigation Dots */}
      <div className="flex justify-center mt-4 sm:mt-6 space-x-2">
        {Array.from({ length: totalSlides }).map((_, index) => (
          <button
            key={index}
            onClick={() => handleDotClick(index)}
            className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full transition-all duration-300 ${
              index === currentIndex 
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 w-4 sm:w-5'
                : 'bg-gray-300 hover:bg-gray-400'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Play/Pause Button - Adjusted for mobile */}
      <button
        onClick={() => setIsAutoPlay(!isAutoPlay)}
        className="absolute bottom-2 right-2 sm:bottom-4 sm:right-4 w-6 h-6 sm:w-8 sm:h-8 bg-white/90 rounded-full flex items-center justify-center text-gray-800 hover:bg-white transition-all duration-200 shadow-md z-30"
        aria-label={isAutoPlay ? "Pause slideshow" : "Play slideshow"}
      >
        {isAutoPlay ? (
          <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6" />
          </svg>
        ) : (
          <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
          </svg>
        )}
      </button>
    </div>
  );
};

export default Slider;
