import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import logo from '../../../public/assets/images/logo.png';

const Footer = () => {
  return (
    <footer className="bg-white text-gray-800 py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Important UPSC Links */}
          <div className="flex flex-col">
            <h3 className="text-xl font-semibold mb-4">Important UPSC Links</h3>
            <ul className="space-y-2">
              <li><Link href="/upsc-previous-papers" className="hover:text-blue-600">UPSC Previous Year Question Papers</Link></li>
              <li><Link href="/ias-eligibility" className="hover:text-blue-600">IAS Eligibility</Link></li>
              <li><Link href="/ncert-notes" className="hover:text-blue-600">NCERT Notes For UPSC</Link></li>
              <li><Link href="/ias-salary" className="hover:text-blue-600">IAS Salary</Link></li>
            </ul>
          </div>

          {/* Current Affairs */}
          <div className="flex flex-col">
            <h3 className="text-xl font-semibold mb-4">Current Affairs</h3>
            <ul className="space-y-2">
              <li><Link href="/daily-mains-answer" className="hover:text-blue-600">Daily Mains Answer Writing</Link></li>
              <li><Link href="/daily-facts" className="hover:text-blue-600">Daily Facts</Link></li>
              <li><Link href="/yojana-summary" className="hover:text-blue-600">Yojana Summary</Link></li>
              <li><Link href="/pib" className="hover:text-blue-600">PIB</Link></li>
              <li><Link href="/budget" className="hover:text-blue-600">Budget</Link></li>
              <li><Link href="/economic-survey" className="hover:text-blue-600">Economic Survey</Link></li>
              <li><Link href="/forest-report" className="hover:text-blue-600">Forest Report</Link></li>
            </ul>
          </div>

          {/* UPSC Syllabus */}
          <div className="flex flex-col">
            <h3 className="text-xl font-semibold mb-4">UPSC Syllabus</h3>
            <ul className="space-y-2">
              <li><Link href="/upsc-prelims-syllabus" className="hover:text-blue-600">Download UPSC Prelims Syllabus</Link></li>
              <li><Link href="/upsc-mains-syllabus" className="hover:text-blue-600">Download UPSC Mains Syllabus</Link></li>
              <li><Link href="/upsc-optional-syllabus" className="hover:text-blue-600">Download UPSC Optional Syllabus</Link></li>
            </ul>
          </div>

          {/* GS 1 Topper Notes */}
          <div className="flex flex-col">
            <h3 className="text-xl font-semibold mb-4">GS 1 Topper Notes</h3>
            <ul className="space-y-2">
              <li><Link href="/history-notes" className="hover:text-blue-600">History Notes</Link></li>
              <li><Link href="/society-notes" className="hover:text-blue-600">Society Notes</Link></li>
              <li><Link href="/geography-notes" className="hover:text-blue-600">Geography Notes</Link></li>
            </ul>
          </div>

          {/* GS 2 Topper Notes */}
          <div className="flex flex-col">
            <h3 className="text-xl font-semibold mb-4">GS 2 Topper Notes</h3>
            <ul className="space-y-2">
              <li><Link href="/polity-notes" className="hover:text-blue-600">Polity Notes</Link></li>
              <li><Link href="/indian-constitution" className="hover:text-blue-600">Indian Constitution</Link></li>
              <li><Link href="/governance-notes" className="hover:text-blue-600">Governance Notes</Link></li>
              <li><Link href="/ir-notes" className="hover:text-blue-600">IR (International Relations) Notes</Link></li>
            </ul>
          </div>

          {/* GS 3 Topper Notes */}
          <div className="flex flex-col">
            <h3 className="text-xl font-semibold mb-4">GS 3 Topper Notes</h3>
            <ul className="space-y-2">
              <li><Link href="/indian-economy" className="hover:text-blue-600">Indian Economy Notes</Link></li>
              <li><Link href="/agriculture-notes" className="hover:text-blue-600">Agriculture Notes</Link></li>
              <li><Link href="/science-tech" className="hover:text-blue-600">Science & Technology Notes</Link></li>
              <li><Link href="/environment-notes" className="hover:text-blue-600">Environment Notes</Link></li>
              <li><Link href="/internal-security" className="hover:text-blue-600">Internal Security Notes</Link></li>
            </ul>
          </div>

          {/* GS 4 Topper Notes */}
          <div className="flex flex-col">
            <h3 className="text-xl font-semibold mb-4">GS 4 Topper Notes</h3>
            <ul className="space-y-2">
              <li><Link href="/ethics-human-interface" className="hover:text-blue-600">Ethics And Human Interface</Link></li>
              <li><Link href="/attitude-notes" className="hover:text-blue-600">Attitude Notes</Link></li>
              <li><Link href="/aptitude-civil-services" className="hover:text-blue-600">Aptitude For Civil Services Notes</Link></li>
              <li><Link href="/emotional-intelligence" className="hover:text-blue-600">Emotional Intelligence Notes</Link></li>
              <li><Link href="/moral-thinkers" className="hover:text-blue-600">Moral Thinkers And Philosophers</Link></li>
              <li><Link href="/civil-service-values" className="hover:text-blue-600">Civil Service Values Notes</Link></li>
              <li><Link href="/ethical-issues" className="hover:text-blue-600">Ethical Issues In International Relations Notes</Link></li>
              <li><Link href="/corporate-governance" className="hover:text-blue-600">Corporate Governance Notes</Link></li>
              <li><Link href="/probity-governance" className="hover:text-blue-600">Probity In Governance Notes</Link></li>
              <li><Link href="/case-studies" className="hover:text-blue-600">Case Study On Above Issues Notes</Link></li>
            </ul>
          </div>

          {/* Policy Links */}
          <div className="flex flex-col">
            <ul className="space-y-2">
              <li><Link href="/privacy-policy" className="hover:text-blue-600">Privacy Policy</Link></li>
              <li><Link href="/refund-policy" className="hover:text-blue-600">Refund Policy</Link></li>
              <li><Link href="/shipping-policy" className="hover:text-blue-600">Shipping Policy</Link></li>
              <li><Link href="/terms-conditions" className="hover:text-blue-600">Terms and Conditions</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <Link href="/">
                <Image src={logo} alt="Logo" className="h-12" />
              </Link>
            </div>
            <div className="flex space-x-6">
              {/* Social Media Links */}
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-blue-600">
                <i className="fab fa-facebook"></i>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-blue-600">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-blue-600">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="https://telegram.org" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-blue-600">
                <i className="fab fa-telegram"></i>
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-blue-600">
                <i className="fab fa-youtube"></i>
              </a>
            </div>
          </div>
          <div className="text-center mt-6">
            <p className="text-sm text-gray-600">© {new Date().getFullYear()} YourCompany. All Rights Reserved</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
