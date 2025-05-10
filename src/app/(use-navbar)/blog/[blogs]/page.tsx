import Image from "next/image";
import { notFound } from "next/navigation";
import { env } from "@/config/env";
import { BaseTemplateProps } from "@/components/templates/types";
import { Metadata } from "next";
import AssistiveTouch from "@/components/navigation/Assistivetouch";
import { RelatedTopics } from "@/components/Blogs/relatedTopics";

async function getPage(
  slug: string
): Promise<BaseTemplateProps["page"] | null> {
  try {
    const normalizedSlug = slug.replace(/\s+/g, '-'); // Normalize slug by replacing spaces with hyphens
    console.log("NORMALIZED SLUG", normalizedSlug);
    const response = await fetch(`${env.API}/blog/slug/${normalizedSlug}`);
    const res = await response.json();
    const page = res.data;
    
    if (!page) {
      return null;
    }

    return page as BaseTemplateProps["page"];
  } catch (error) {
    console.error("Error fetching page:", error);
    return null;
  }
}

type Params = Promise<{
  blogs: string;
}>;

export async function generateMetadata({params}: {params: Params}): Promise<Metadata> {
  const { blogs: slug } = await params;  // Await params first
  const page = await getPage(slug);
  
  if (!page || !page.metadata) {
    return {
      title: "Page Not Found",
      description: "The requested page could not be found.",
    };
  }
  
  const JSONMetaData = JSON.parse(page.metadata);
  
  return {
    title: JSONMetaData.metaTitle || "Default Title",
    description: JSONMetaData.metaDescription || "Default description",
    keywords: JSONMetaData.metaKeywords || "Default keywords",
    robots: JSONMetaData.robots || "index, follow",
    openGraph: {
      title: JSONMetaData.ogTitle || "Default OG Title",
      description: JSONMetaData.ogDescription || "Default OG Description",
      url: JSONMetaData.canonicalUrl || "https://example.com",
      images: [
        {
          url: JSONMetaData.ogImage || "https://example.com/default-image.jpg",
        },
      ],
      type: JSONMetaData.ogType || "website",
    },
    twitter: {
      card: JSONMetaData.twitterCard || "summary_large_image",
      title: JSONMetaData.twitterTitle || "Default Twitter Title",
      description:
        JSONMetaData.twitterDescription || "Default Twitter Description",
      images: [
        {
          url:
            JSONMetaData.twitterImage ||
            "https://example.com/default-twitter-image.jpg",
        },
      ],
    },
    alternates: {
      canonical:
        JSONMetaData.canonicalUrl ||
        "https://example.com/default-canonical-url",
    },
  };
}

export default async function Page({ params }: { params: Params }) {
  const { blogs: slug } = await params;  // Await params first
  const normalizedSlug = slug.replace(/\s+/g, '-');
  const page = await getPage(normalizedSlug);

  if (!page) {
    notFound();
  }

  const { title, content, metadata, imageUrl, id } = page;
  const parsedMetadata = typeof metadata === 'string' ? JSON.parse(metadata) : metadata || {};
  const jsonLD = parsedMetadata.schemaData;
  const displayImage = imageUrl || parsedMetadata.coverImage as string;

  return (
    <>
      <section>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLD || '' }}
        />
      </section>
      <main>
        <div className="min-h-screen bg-white relative w-full overflow-x-hidden">
          {/* Assistive Touch */}
          <AssistiveTouch content={content || ''} />
          <div
            className="w-full max-w-[1400px] xl:max-w-6.5xl mx-auto px-2 lg:px-8 py-4 sm:py-6"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 lg:gap-6 mt-5">
              {/* Main Content Column */}
              <main className="lg:col-start-1 lg:col-span-9 space-y-4 sm:space-y-6">
                <div className="bg-white border shadow-lg rounded-xl">
                  {/* Featured Image */}
                  {displayImage && (
                    <div className="w-full">
                      <div className="relative w-full h-[200px] sm:h-[300px] md:h-[400px] bg-gray-50">
                        <Image
                          src={displayImage}
                          alt={title || 'Blog Post'}
                          fill
                          className="object-cover rounded-t-xl"
                          priority
                        />
                      </div>
                    </div>
                  )}

                  {/* Article Content */}
                  <div className="p-4 sm:p-6">
                    <h1 className="text-2xl sm:text-3xl font-bold text-[var(--surface-darker)] mb-4">
                      {title}
                    </h1>

                    <div className="text-sm text-[var(--text-tertiary)] mb-4">
                      By 99Notes
                    </div>

                    <div
                      className="prose prose-sm sm:prose-base lg:prose-lg max-w-none
                      prose-headings:font-semibold
                      prose-headings:tracking-normal
                      prose-headings:text-left
                      prose-headings:relative
                      prose-headings:mb-6
                      
                      prose-h1:text-2xl sm:prose-h1:text-3xl lg:prose-h1:text-4xl
                      prose-h1:font-bold
                      prose-h1:text-gray-800
                      prose-h1:leading-tight
                      
                      prose-h2:text-2xl sm:prose-h2:text-3xl
                      prose-h2:text-gray-700
                      prose-h2:pb-2
                      prose-h2:after:content-['']
                      prose-h2:after:block
                      prose-h2:after:w-16
                      prose-h2:after:h-[2px]
                      prose-h2:after:mt-2
                      prose-h2:after:bg-yellow-500
                      prose-h2:after:rounded-full
                      
                      prose-h3:text-xl sm:prose-h3:text-2xl
                      prose-h3:text-gray-600
                      prose-h3:font-medium
                      prose-h3:pl-3
                      
                      prose-h4:text-lg sm:prose-h4:text-xl
                      prose-h4:text-gray-600
                      prose-h4:font-medium
                      prose-h4:before:content-['§']
                      prose-h4:before:text-yellow-500
                      prose-h4:before:mr-2
                      prose-h4:before:opacity-70
                      
                      prose-p:text-gray-600
                      prose-p:leading-relaxed
                      prose-p:tracking-wide
                      prose-strong:text-gray-800
                      prose-a:text-blue-600
                      prose-a:no-underline
                      prose-a:border-b-2
                      prose-a:border-blue-200
                      prose-a:transition-colors
                      prose-a:hover:border-blue-500
                      prose-blockquote:border-l-blue-500
                      prose-blockquote:bg-blue-50
                      prose-blockquote:p-3 sm:prose-blockquote:p-4
                      prose-blockquote:rounded-r-lg
                      prose-pre:bg-gray-50
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
                      <div dangerouslySetInnerHTML={{ __html: content || '' }}></div>
                    </div>
                  </div>
                </div>
              </main>

              {/* Sidebar */}
              <aside className="lg:col-start-10 lg:col-span-4 space-y-4 sm:space-y-8 mt-5 lg:mt-0">
                <RelatedTopics currentBlogSlug={slug} />
              </aside>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}