import React from "react";
import Link from "next/link";
import {
  Instagram,
  Phone,
  Mail,
  MapPin,
  ExternalLink,
  Facebook,
} from "lucide-react";

const FooterSection = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div className="space-y-4">
    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
      {title}
    </h3>
    {children}
  </div>
);

const FooterLink = ({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) => (
  <Link
    href={href}
    className="inline-flex items-center text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 transition-colors duration-200"
  >
    {children}
  </Link>
);

const ContactItem = ({
  icon: Icon,
  children,
}: {
  icon: any;
  children: React.ReactNode;
}) => (
  <div className="flex items-start gap-3">
    <Icon className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0" />
    <span className="text-gray-600 dark:text-gray-300">{children}</span>
  </div>
);

const SocialLink = ({
  href,
  icon: Icon,
  children,
}: {
  href: string;
  icon: any;
  children: string;
}) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="inline-flex items-center text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 transition-colors duration-200"
  >
    <Icon className="w-5 h-5 mr-2" />
    {children}
  </a>
);

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 md:grid-cols-4">
          {/* About Section */}
          <FooterSection title="About">
            <ul className="space-y-3">
              <li>
                <FooterLink href="/about">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Our Story
                </FooterLink>
              </li>
              <li>
                <FooterLink href="/policy">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Privacy Policy
                </FooterLink>
              </li>
              <li>
                <FooterLink href="/faq">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  FAQ
                </FooterLink>
              </li>
            </ul>
          </FooterSection>

          {/* Quick Links Section */}
          <FooterSection title="Quick Links">
            <ul className="space-y-3">
              <li>
                <FooterLink href="/courses">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Courses
                </FooterLink>
              </li>
              <li>
                <FooterLink href="/profile">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  My Profile
                </FooterLink>
              </li>
            </ul>
          </FooterSection>

          {/* Social Links Section */}
          <FooterSection title="Social Links">
            <ul className="space-y-3">
              <li>
                <SocialLink
                  href="https://www.instagram.com/bluekites_slg?igsh=OWRpaGV2Nm5wN3Vo"
                  icon={Instagram}
                >
                  Instagram
                </SocialLink>
              </li>
              <li>
                <SocialLink
                  href="https://www.facebook.com/share/15MwLtGCqU/"
                  icon={Facebook}
                >
                  Facebook
                </SocialLink>
              </li>
            </ul>
          </FooterSection>

          {/* Contact Info Section */}
          <FooterSection title="Contact Info">
            <div className="space-y-4">
              <ContactItem icon={Phone}>
                <a
                  href="tel:+917029864675"
                  className="hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
                >
                  +91-7029864675
                </a>{" "}
                (Arijit Banerjee)
                <br />
                <a
                  href="tel:+917432091777"
                  className="hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
                >
                  +91-7432091777
                </a>{" "}
                (Nilanjan Ganguly)
              </ContactItem>

              <ContactItem icon={MapPin}>
                Rabindra Sarani Main Road, Siliguri 734006, West Bengal, IN
              </ContactItem>

              <ContactItem icon={Mail}>
                <a
                  href="mailto:bluekites162@gmail.com"
                  className="hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
                >
                  bluekites162@gmail.com
                </a>
              </ContactItem>
            </div>
          </FooterSection>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
          <div className="text-center">
            <p className="text-gray-600 dark:text-gray-300">
              Copyright © {currentYear} Bluekites | All Rights Reserved
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
