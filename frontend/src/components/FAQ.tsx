'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface FAQItemProps {
  question: string;
  answer: string;
}

const FAQItem = ({ question, answer }: FAQItemProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-200 py-4">
      <button
        className="flex w-full items-center justify-between text-left"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-lg font-medium text-gray-900">{question}</span>
        <ChevronDown
          className={`h-5 w-5 text-gray-500 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>
      <div
        className={`mt-2 overflow-hidden transition-all duration-300 ${
          isOpen ? 'max-h-96' : 'max-h-0'
        }`}
      >
        <p className="text-gray-600 text-left">{answer}</p>
      </div>
    </div>
  );
};

const faqs = [
  {
    question: "What is Readibly?",
    answer: "Readibly is a SaaS application designed to help people with dyslexia read more easily. It uses eye-tracking technology and text-to-speech features to make reading more accessible and comfortable."
  },
  {
    question: "How does the eye-tracking feature work?",
    answer: "The eye-tracking feature monitors your eye movements while reading and adjusts the text display speed accordingly. This helps maintain a comfortable reading pace and reduces eye strain."
  },
  {
    question: "Can I use Readibly with any PDF document?",
    answer: "Yes, Readibly can process most PDF documents. Simply upload your PDF file, and the system will automatically parse and display it in a dyslexia-friendly format with OpenDyslexic font."
  },
  {
    question: "Is the text-to-speech feature available in multiple languages?",
    answer: "Currently, the text-to-speech feature supports English. We are working on adding support for more languages in future updates."
  },
  {
    question: "Is Readibly free to use?",
    answer: "Yes, Readibly is completely free to use. We believe in making reading accessible to everyone, regardless of their financial situation."
  }
];

export default function FAQ() {
  return (
    <div className="w-full max-w-6xl mx-auto">
      <h1 className="text-6xl font-bold text-center text-[#1e1e1e] mb-8">
        Frequently Asked Questions
      </h1>
      <h3 className="text-lg font-light text-center text-[#1e1e1e] mb-12">
        If you have any other questions, please contact the developer on the about page.
      </h3>
      <div className="space-y-1">
        {faqs.map((faq, index) => (
          <FAQItem
            key={index}
            question={faq.question}
            answer={faq.answer}
          />
        ))}
      </div>
    </div>
  );
} 