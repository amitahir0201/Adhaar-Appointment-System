import { useState } from "react";

const faqData = [
  { question: "How can I update my Aadhaar details?", answer: "You can update your Aadhaar details by visiting the nearest Aadhaar Seva Kendra or using the UIDAI website." },
  { question: "What are the documents required for Aadhaar update?", answer: "You need a valid government-issued ID like a Passport, Voter ID, or Driving License for updates." },
  { question: "How can I book an appointment?", answer: "You can book an appointment online using our portal and selecting your preferred date and time slot." },
  { question: "Is there any fee for Aadhaar update?", answer: "Yes, as per UIDAI guidelines, a nominal fee is charged for updates." },
  { question: "Can I check my appointment status online?", answer: "Yes, you can track your appointment status using your reference number on our portal." },
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center text-blue-600 mb-6">Frequently Asked Questions</h1>

        {faqData.map((faq, index) => (
          <div key={index} className="border-b border-gray-300 py-4">
            <button
              className="flex justify-between items-center w-full text-left font-medium text-lg"
              onClick={() => toggleFAQ(index)}
            >
              <span>{faq.question}</span>
              <span className="text-blue-500">{openIndex === index ? "▲" : "▼"}</span>
            </button>
            {openIndex === index && <p className="mt-2 text-gray-700">{faq.answer}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}
