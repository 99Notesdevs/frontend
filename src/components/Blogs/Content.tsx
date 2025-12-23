import React from 'react';

interface ContentProps {
  input: string;
}

const Content: React.FC<ContentProps> = ({ input }) => {
  return (
    <div
        className="prose prose-sm sm:prose-base lg:prose-lg max-w-none
        prose-headings:font-semibold
        prose-headings:tracking-normal
        prose-headings:text-left
        prose-headings:relative
        prose-headings:mb-6
        
        prose-h1:text-2xl sm:prose-h1:text-3xl lg:prose-h1:text-4xl
        prose-h1:font-bold
        prose-h1:text-gray-800 dark:prose-h1:text-white
        prose-h1:leading-tight
        
        prose-h2:text-2xl sm:prose-h2:text-3xl
        prose-h2:text-gray-700 dark:prose-h2:text-gray-200
        prose-h2:pb-2
        prose-h2:after:content-['']
        prose-h2:after:block
        prose-h2:after:w-16
        prose-h2:after:h-[2px]
        prose-h2:after:mt-2
        prose-h2:after:bg-yellow-500
        prose-h2:after:rounded-full
        
        prose-h3:text-xl sm:prose-h3:text-2xl
        prose-h3:text-gray-600 dark:prose-h3:text-gray-300
        prose-h3:font-medium
        prose-h3:pl-3
        
        prose-h4:text-lg sm:prose-h4:text-xl
        prose-h4:text-gray-600 dark:prose-h4:text-gray-400
        prose-h4:font-medium
        prose-h4:before:content-['§']
        prose-h4:before:text-yellow-500
        prose-h4:before:mr-2
        prose-h4:before:opacity-70
        
        prose-p:text-gray-600 dark:prose-p:text-gray-300
        prose-p:leading-relaxed
        prose-p:tracking-wide
        prose-strong:text-gray-800 dark:prose-strong:text-gray-200
        prose-a:text-blue-600
        prose-a:no-underline
        prose-a:border-b-2
        prose-a:border-blue-200
        prose-a:transition-colors
        prose-a:hover:border-blue-500
        prose-blockquote:border-l-blue-500
        prose-blockquote:bg-blue-50 dark:prose-blockquote:bg-blue-900/20
        prose-blockquote:p-3 sm:prose-blockquote:p-4
        prose-blockquote:rounded-r-lg
        prose-pre:bg-gray-50 dark:prose-pre:bg-slate-800/50
        prose-pre:rounded-lg
        prose-pre:p-3 sm:prose-pre:p-4
        prose-img:rounded-lg
        prose-img:shadow-md
        prose-ul:list-disc
        prose-ul:pl-4 sm:prose-ul:pl-6
        prose-ol:list-decimal
        prose-ol:pl-4 sm:prose-ol:pl-6
        [&>*]:w-full
        
        /* YouTube Video Styles */
        iframe {
          width: 100% !important;
          height: 100% !important;
          max-width: 100%;
          aspect-ratio: 16/9;
        }
        
        /* Responsive YouTube Container */
        .youtube-container {
          position: relative;
          width: 100%;
          padding-bottom: 56.25%; /* 16:9 aspect ratio */
          margin: 1rem 0;
        }
        
        .youtube-container iframe {
          position: absolute;
          top: 0;
          left: 0;
          width: 100% !important;
          height: 100% !important;
          border: none;
        }
        
        /* Prevent overflow */
        .prose-video {
          overflow: hidden;
          max-width: 100%;
          margin: 1rem 0;
        }
        
        /* Responsive images */
        img {
          max-width: 100%;
          height: auto;
          display: block;
          margin: 0 auto;
        }"
      >
        <div
          dangerouslySetInnerHTML={{ __html: input || "" }}
        ></div>
      </div>
  );
};

export default Content;