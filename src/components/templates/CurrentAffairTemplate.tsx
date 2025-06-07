"use client";
import React, { useEffect } from "react";
import { BaseTemplateProps } from "./types";
import Link from "next/link";
import ContactForm from "@/components/common/ContactForm/ContactForm";
import ContactMap from "@/components/ui/ContactMap";
import Breadcrumb from "@/components/ui/breadcrumb";

export const CurrentAffairTemplate: React.FC<BaseTemplateProps> = ({
  page,
}) => {
  const { title, content, metadata, children } = page;
  const mainContent = content || "";
  // @ts-ignore
  const jsonLD = JSON.parse(metadata).schemaData;
  const parsedMetadata = JSON.parse(metadata);
  const headScripts =
    parsedMetadata?.header
      ?.split("||")
      ?.map((script: string) => script.trim()) || [];
  const bodyScripts =
    parsedMetadata?.body?.split("||")?.map((script: string) => script.trim()) ||
    [];

  useEffect(() => {
    // Inject head scripts
    if (headScripts) {
      headScripts.forEach((script: string) => {
        try {
          if (script.startsWith("<script")) {
            // Parse the full <script> tag and extract attributes
            const tempDiv = document.createElement("div");
            tempDiv.innerHTML = script.trim();
            const scriptElement = tempDiv.firstChild as HTMLScriptElement;
            if (scriptElement && scriptElement.tagName === "SCRIPT") {
              document.head.appendChild(scriptElement);
            }
          } else {
            // Handle raw JavaScript content
            const scriptElement = document.createElement("script");
            scriptElement.textContent = script; // Use textContent for raw JavaScript
            document.head.appendChild(scriptElement);
          }
        } catch (error) {
          console.error("Error injecting head script:", error, script);
        }
      });
    }

    // Inject body scripts
    if (bodyScripts) {
      bodyScripts.forEach((script: string) => {
        try {
          if (script.startsWith("<script")) {
            // Parse the full <script> tag and extract attributes
            const tempDiv = document.createElement("div");
            tempDiv.innerHTML = script.trim();
            const scriptElement = tempDiv.firstChild as HTMLScriptElement;
            if (scriptElement && scriptElement.tagName === "SCRIPT") {
              document.body.appendChild(scriptElement);
            }
          } else {
            // Handle raw JavaScript content
            const scriptElement = document.createElement("script");
            scriptElement.textContent = script; // Use textContent for raw JavaScript
            document.body.appendChild(scriptElement);
          }
        } catch (error) {
          console.error("Error injecting body script:", error, script);
        }
      });
    }
  }, [headScripts, bodyScripts]);

  return (
    <>
      <section>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLD }}
        />
      </section>
      <main>
        <div className="min-h-screen bg-gradient-to-b from-[var(--bg-main)] to-white">
          <Breadcrumb
            containerClasses="bg-muted/40 px-4 py-2 rounded-md"
            activeClasses="font-semibold"
          />
          <div className="bg-[var(--tertiary)] py-12">
            <div className="container mx-auto px-4 max-w-5xl">
              {/* Page Title */}
              <div className="text-center mb-10">
                <h2 className="text-3xl font-bold text-[var(--primary)] mb-3">
                  {title}
                </h2>
                <div className="w-24 h-1 bg-[var(--accent)] rounded-full mx-auto"></div>
              </div>

              {/* Main Content */}
              <div className="mb-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {/* Child Cards */}
                  {children?.map((child: any) => (
                    <Link
                      key={child.id}
                      href={`/${child.slug}`}
                      className="group"
                    >
                      <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-all duration-300 h-[400px] flex flex-col justify-between border border-[var(--border-light)]">
                        <div>
                          <h3 className="text-xl font-semibold text-[var(--primary)] group-hover:text-[var(--accent)] transition-colors text-center mb-4">
                            {child.title}
                          </h3>
                          <div className="text-[var(--text-tertiary)] text-sm leading-relaxed h-[80px] overflow-hidden">
                            <span
                              dangerouslySetInnerHTML={{
                                __html: child.content,
                              }}
                              className="block overflow-hidden text-ellipsis"
                            ></span>
                          </div>
                        </div>
                        <div className="text-[var(--primary)] group-hover:text-[var(--secondary)] font-medium flex items-center justify-center mt-4">
                          <span className="text-sm">Read More →</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>

                {/* Main Content */}
                {mainContent && (
                  <div className="mt-12">
                    <div
                      className="prose prose-lg text-[var(--text-strong)] mx-auto"
                      dangerouslySetInnerHTML={{ __html: mainContent }}
                    ></div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Contact Section */}
          <div className="bg-white py-12">
            <div className="container mx-auto px-4 max-w-5xl">
              <h2 className="text-3xl font-bold text-[var(--primary)] mb-6 text-center">
                Contact Us
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <ContactForm />
                <ContactMap />
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default CurrentAffairTemplate;
