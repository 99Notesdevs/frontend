import Image from "next/image";
import { notFound } from "next/navigation";
import { BaseTemplateProps } from "@/components/templates/types";
import { Metadata } from "next";
import AssistiveTouch from "@/components/navigation/Assistivetouch";
import { RelatedTopics } from "@/components/Blogs/relatedTopics";
import { Tags } from "@/components/ui/tags/Tags";
import { api } from "@/config/api/route";
import ContentWrapper from "@/components/Blogs/ContentWrapper";
async function getPage(
  slug: string
): Promise<BaseTemplateProps["page"] | null> {
  try {
    const normalizedSlug = slug.replace(/\s+/g, "-"); // Normalize slug by replacing spaces with hyphens
    console.log("NORMALIZED SLUG", normalizedSlug);
    const response = await api.get(`/blog/slug/${normalizedSlug}`) as { success: boolean, data: BaseTemplateProps["page"] | null };
    const page = response.data;
    console.log("PAGE", page);
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

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { blogs: slug } = await params; // Await params first
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
  const { blogs: slug } = await params; // Await params first
  const normalizedSlug = slug.replace(/\s+/g, "-");
  const page = await getPage(normalizedSlug);
  const tags = page?.tags;
  if (!slug || !page) {
    notFound();
  }

  const { title, content, metadata, imageUrl, id } = page;
  const parsedMetadata =
    typeof metadata === "string" ? JSON.parse(metadata) : metadata || {};
  const jsonLD = parsedMetadata.schemaData;
  const displayImagearray = JSON.parse(imageUrl as string) || (parsedMetadata.coverImage as string);
  const displayImage = displayImagearray[0];
  const displayImageAlt = displayImagearray[1];

  return (
    <>
      <section>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLD || "" }}
        />
      </section>
      <main className="bg-white dark:bg-slate-900 transition-colors duration-200">
        <div className="min-h-screen relative w-full overflow-x-hidden">
          {/* Assistive Touch */}
          <AssistiveTouch content={content || ""} />
          <div className="w-full max-w-[1400px] xl:max-w-6.5xl mx-auto px-2 lg:px-8 py-4 sm:py-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 lg:gap-6 mt-5">
              {/* Main Content Column */}
              <main className="lg:col-start-1 lg:col-span-9 space-y-4 sm:space-y-6">
                <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 shadow-lg rounded-xl transition-colors duration-200">
                  {/* Featured Image */}
                  {displayImage && (
                    <div className="w-full">
                      <div className="relative w-full h-[200px] sm:h-[300px] md:h-[400px] bg-gray-50 dark:bg-slate-700">
                        <Image
                          src={displayImage}
                          alt={displayImageAlt}
                          fill
                          className="object-cover rounded-t-xl"
                          priority
                        />
                      </div>
                    </div>
                  )}

                  {/* Article Content */}
                  <div className="p-4 sm:p-6">
                    <h1 className="text-2xl sm:text-3xl font-bold text-[var(--surface-darker)] dark:text-white mb-4">
                      {title}
                    </h1>

                    <div className="text-sm text-[var(--text-tertiary)] dark:text-gray-400 mb-4">
                      By 99Notes
                    </div>

                    <ContentWrapper input={content} />
                    <div>{tags && tags.length > 0 && <Tags tags={tags} />}</div>
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