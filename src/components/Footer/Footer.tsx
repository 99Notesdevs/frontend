import React from "react";
import Link from "next/link";
import Image from "next/image";
import logo from "../../../public/Logo.svg";
import SocialMedia from "../navigation/socialmedia";

interface FooterLink {
  slug: string;
  title: string;
  link: string | null | undefined;
  children: FooterLink[];
}

interface FooterProps {
  footerSections: FooterLink[];
}

const Footer = ({ footerSections }: FooterProps) => {
  return (
    <footer className="bg-white dark:bg-slate-900 text-primary dark:text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {footerSections.map((section) => (
            <div key={section.slug} className="flex flex-col">
              <Link href={section.link ? section.link : `/${section.slug}`}>
                <h3 className="text-xl font-semibold mb-4 text-primary dark:text-white">
                  {section.title}
                </h3>
              </Link>
              <ul className="space-y-2">
                {section.children.map((link) => (
                  <li key={link.slug}>
                    <Link
                      href={link.link ? link.link : `/${link.slug}`}
                      className="hover:text-primary-active dark:hover:text-primary-300 text-gray-700 dark:text-gray-300"
                    >
                      {link.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-slate-700">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <Link href="/">
                <Image src={logo} alt="Logo" className="h-20 w-auto" />
              </Link>
            </div>
            <div className="w-full md:w-auto max-w-sm">
              <SocialMedia />
            </div>
          </div>
          <div className="text-center mt-6">
            <p className="text-sm text-secondary dark:text-gray-400">
              &copy; {new Date().getFullYear()}{" "}
              <a href="/" className="dark:text-white">
                99notes.in
              </a>{" "}
              All Rights Reserved
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
