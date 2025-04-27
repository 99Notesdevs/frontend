import Image from "next/image";
import { notFound } from "next/navigation";
import { env } from "@/config/env";
import { BaseTemplateProps } from "@/components/templates/types";
import { Metadata } from "next";
import AssistiveTouch from "@/components/navigation/Assistivetouch";

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

type Params = Promise<{ blogs: string }>;

export async function generateMetadata({params}: {params: Params}): Promise<Metadata> {
  const slug = (await params).blogs;
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
  const slug = (await params).blogs;
  const normalizedSlug = slug.replace(/\s+/g, '-'); // Normalize slug by replacing spaces with hyphens
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
            className="w-full max-w-7xl xl:max-w-6.5xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-12"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 lg:gap-6 mt-4 sm:mt-12">
              {/* Main Content Column */}
              <main className="lg:col-start-1 lg:col-span-8 xl:col-span-8 space-y-0 sm:space-y-0">
                <div className="bg-white border shadow-lg rounded-xl">
                  {/* Featured Image */}
                  {displayImage && (
                    <div className="w-full">
                      <div className="relative w-full h-[400px] rounded-t-xl overflow-hidden">
                        <Image
                          src={`${displayImage}`}
                          alt={title}
                          fill
                          className="object-cover"
                          priority
                        />
                      </div>
                    </div>
                  )}

                  {/* Article Content */}
                  <div className="p-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-0">
                      {title}
                    </h1>

                    <div className="text-xs text-gray-500 mb-4">
                      By 99Notes . Created: {new Date(page.createdAt).toLocaleDateString()}
                    </div>

                    <div
                      className="prose prose-sm sm:prose-base lg:prose-lg max-w-none
                      prose-headings:font-semibold
                      prose-headings:tracking-normal
                      prose-headings:text-left
                      prose-headings:relative
                      prose-headings:mb-6
                      
                      prose-h1:text-3xl sm:prose-h1:text-4xl
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
                      [&>*]:w-full"
                    >
                      <div dangerouslySetInnerHTML={{ __html: content || '' }}></div>
                    </div>
                  </div>
                </div>
              </main>

              {/* Sidebar */}
              <aside className="lg:col-start-9 lg:col-span-4 xl:col-start-9 xl:col-span-4 space-y-4 sm:space-y-8">
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h2 className="text-lg font-semibold mb-4">Related Topics</h2>
                  <p className="text-gray-600">Coming soon...</p>
                </div>
              </aside>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}