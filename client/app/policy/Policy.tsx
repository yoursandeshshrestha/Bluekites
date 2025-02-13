import React, { useState } from "react";
import { ChevronDown, ChevronUp, Shield, AlertTriangle } from "lucide-react";

const CustomAlert = ({ title, description }: any) => (
  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
    <div className="flex items-center gap-2">
      <AlertTriangle className="w-5 h-5 text-blue-800 dark:text-blue-200" />
      <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200">
        {title}
      </h3>
    </div>
    <p className="mt-2 text-blue-700 dark:text-blue-300">{description}</p>
  </div>
);

const Policy = () => {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const policies = [
    {
      id: "privacy",
      title: "Privacy & Data Protection",
      icon: <Shield className="w-5 h-5" />,
      content:
        "We are committed to maintaining the confidentiality and privacy of our users' personal information. Any data collected during registration, course participation, or any interactions on our platform will be securely stored and will not be shared with third parties without the user's explicit consent, except where required by law.",
    },
    {
      id: "refunds",
      title: "Refund Policy",
      icon: <Shield className="w-5 h-5" />,
      content:
        "Students are entitled to a full refund if they decide to leave a course within 7 days of enrollment, regardless of the reason. If a student withdraws after 7 days but before the course concludes, they will receive a 20% refund of the total course fee, and the remaining 80% will be retained by Blue Kites to cover administrative and resource costs.",
    },
    {
      id: "certificates",
      title: "Certification Requirements",
      icon: <Shield className="w-5 h-5" />,
      content:
        "Students who withdraw from a course without completing the full curriculum will not be eligible to receive a certificate of completion. Certificates are awarded only to students who successfully finish the course as per the set criteria.",
    },
    {
      id: "instructors",
      title: "Instructor Changes",
      icon: <Shield className="w-5 h-5" />,
      content:
        "Teachers may be replaced during the course of a program due to scheduling, availability, or performance reasons. We expect our users to cooperate and adapt to these changes, as our goal is to provide the best possible learning experience with qualified instructors.",
    },
    {
      id: "subscription",
      title: "Subscription Benefits",
      icon: <Shield className="w-5 h-5" />,
      content:
        "Users who enroll in our annual subscription package will receive an additional one month of free access as a bonus. This incentive is designed to reward long-term commitment and provide added value to our dedicated users.",
    },
    {
      id: "courses",
      title: "Course Availability",
      icon: <Shield className="w-5 h-5" />,
      content:
        "Courses with low enrollment or demand may be temporarily removed from our platform and replaced with other courses that better suit our users' interests. This ensures that we continue offering high-quality and relevant content for the majority of learners.",
    },
    {
      id: "piracy",
      title: "Content Protection",
      icon: <Shield className="w-5 h-5" />,
      content:
        "Any user found engaging in piracy or illegal distribution of our content will face severe consequences. This includes a permanent suspension from the platform and potential legal action. We are dedicated to protecting our intellectual property and maintaining the integrity of our services.",
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 pt-[150px]">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-black dark:text-white mb-4">
          Platform Terms and Conditions
        </h1>
        <CustomAlert
          title="Important Notice"
          description="Please review our terms and conditions carefully. By using our platform, you agree to these terms."
        />
      </div>

      {/* Policy Sections */}
      <div className="space-y-4">
        {policies.map((policy) => (
          <div
            key={policy.id}
            className="border dark:border-gray-700 rounded-lg overflow-hidden bg-white dark:bg-gray-800"
          >
            <button
              onClick={() =>
                setExpandedSection(
                  expandedSection === policy.id ? null : policy.id
                )
              }
              className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
            >
              <div className="flex items-center space-x-3">
                {policy.icon}
                <h2 className="text-lg font-semibold text-black dark:text-white">
                  {policy.title}
                </h2>
              </div>
              {expandedSection === policy.id ? (
                <ChevronUp className="w-5 h-5 text-gray-500" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-500" />
              )}
            </button>

            {expandedSection === policy.id && (
              <div className="px-6 py-4 border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {policy.content}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Footer Note */}
      <div className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
        Last updated: February 2025. These terms are subject to change. Please
        check regularly for updates.
      </div>
    </div>
  );
};

export default Policy;
