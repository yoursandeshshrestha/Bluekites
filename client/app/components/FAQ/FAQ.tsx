import React, { useState, useEffect } from "react";
import { useGetHeroDataQuery } from "@/redux/features/layout/layoutApi";
import { ChevronDown, ChevronUp, Search, HelpCircle } from "lucide-react";

const FAQ = () => {
  const { data } = useGetHeroDataQuery("FAQ", {});
  const [activeQuestion, setActiveQuestion] = useState<string | null>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredQuestions, setFilteredQuestions] = useState<any[]>([]);

  useEffect(() => {
    if (data) {
      setQuestions(data.layout.faq);
      setFilteredQuestions(data.layout.faq);
    }
  }, [data]);

  useEffect(() => {
    const filtered = questions.filter(
      (q) =>
        q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.answer.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredQuestions(filtered);
  }, [searchTerm, questions]);

  const toggleQuestion = (id: string) => {
    setActiveQuestion(activeQuestion === id ? null : id);
  };

  // Group questions by category if they have one
  const groupedQuestions = filteredQuestions.reduce((acc: any, question) => {
    const category = question.category || "General";
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(question);
    return acc;
  }, {});

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* Header Section */}
      <div className="text-center mb-12">
        <div className="inline-block p-2 bg-blue-50 dark:bg-blue-900/20 rounded-full mb-4">
          <HelpCircle className="w-8 h-8 text-blue-500" />
        </div>
        <h1 className="text-4xl font-bold mb-6 text-black dark:text-white">
          Frequently Asked Questions
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
          Find answers to common questions about our platform and services
        </p>

        {/* Search Bar */}
        <div className="relative max-w-xl mx-auto">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search questions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 
                     bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                     focus:ring-2 focus:ring-blue-500 focus:border-transparent
                     transition-all duration-200"
          />
        </div>
      </div>

      {/* FAQ Content */}
      <div className="space-y-8">
        {Object.entries(groupedQuestions).map(
          ([category, categoryQuestions]: [string, any]) => (
            <div
              key={category}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm"
            >
              <h2 className="text-xl font-semibold p-6 border-b border-gray-100 dark:border-gray-700">
                {category}
              </h2>
              <div className="divide-y divide-gray-100 dark:divide-gray-700">
                {categoryQuestions.map((q: any) => (
                  <div key={q._id} className="relative overflow-hidden">
                    <button
                      onClick={() => toggleQuestion(q._id)}
                      className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                    >
                      <span className="text-lg font-medium text-gray-900 dark:text-white pr-8">
                        {q.question}
                      </span>
                      {activeQuestion === q._id ? (
                        <ChevronUp className="w-5 h-5 text-blue-500 flex-shrink-0" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                      )}
                    </button>
                    <div
                      className={`overflow-hidden transition-all duration-300 ease-in-out ${
                        activeQuestion === q._id ? "max-h-96" : "max-h-0"
                      }`}
                    >
                      <div className="px-6 pb-4 text-gray-600 dark:text-gray-300">
                        {q.answer}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        )}

        {filteredQuestions.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">
              No questions found matching your search. Try different keywords or
              browse all questions.
            </p>
          </div>
        )}
      </div>

      {/* Contact Support */}
      <div className="mt-12 text-center bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 p-8 rounded-xl">
        <h3 className="text-xl font-semibold mb-4">Still have questions?</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Can&apos;t find the answer you&apos;re looking for? Please get in
          touch with our friendly team.
        </p>
        <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-full font-medium transition-colors">
          Contact Support
        </button>
      </div>
    </div>
  );
};

export default FAQ;
