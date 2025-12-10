import { useRouter } from "next/router";
import { useState } from "react";

const faqData = [
  {
    question: "How can I update my Aadhaar details?",
    answer:
      "You can update your Aadhaar details by visiting the nearest Aadhaar Seva Kendra or using the UIDAI website.",
  },
  {
    question: "What are the documents required for Aadhaar update?",
    answer:
      "You need a valid government-issued ID like a Passport, Voter ID, or Driving License for updates.",
  },
  {
    question: "How can I book an appointment?",
    answer:
      "You can book an appointment online using our portal and selecting your preferred date and time slot.",
  },
  {
    question: "Is there any fee for Aadhaar update?",
    answer:
      "Yes, as per UIDAI guidelines, a nominal fee is charged for updates.",
  },
  {
    question: "Can I check my appointment status online?",
    answer:
      "Yes, you can track your appointment status using your reference number on our portal.",
  },
];

export default function AadhaarServices() {
  const [openIndex, setOpenIndex] = useState(null);
  const router = useRouter();

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const handleClick = () => {
    router.push({
      pathname: "/steps",
    });
  };

  return (
    <div className="bg-white min-h-screen font-sans text-gray-800">
      {/* --- HERO SECTION --- */}
      <section className="body-font">
        <div className="container mx-auto px-5 py-16 md:py-24">
          <div className="flex flex-col text-center w-full mb-12 max-w-3xl mx-auto">
            <h1 className="sm:text-4xl text-3xl font-bold title-font mb-4 text-gray-900">
              Welcome to Aadhaar Appointment Booking
            </h1>
            <p className="lg:w-2/3 mx-auto leading-relaxed text-base text-gray-600 mb-8">
              Easily book your Aadhaar appointment with our user-friendly system.
              Access, update, and manage your Aadhaar details with ease from the
              comfort of your home.
            </p>
            <button
              onClick={handleClick}
              className="mx-auto bg-blue-500 text-white border-0 py-3 px-8 focus:outline-none hover:bg-blue-600 rounded-full text-lg flex items-center gap-2 transition-all shadow-lg hover:shadow-xl"
            >
              Book Appointment
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>

          {/* --- FEATURES SECTION --- */}
          <div className="flex flex-wrap -m-4">
            {/* Card 1 */}
            <div className="p-4 md:w-1/3 w-full">
              <div className="h-full bg-white shadow-md border border-gray-100 px-8 pt-12 pb-12 rounded-3xl overflow-hidden text-center relative transition-all duration-300 hover:shadow-xl hover:-translate-y-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-12 h-12 mb-4 mx-auto text-blue-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8 2v4M16 2v4M3 10h18M5 6h14a2 2 0 012 2v12a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0-2-2z"
                  />
                </svg>
                <h1 className="title-font sm:text-2xl text-xl font-bold text-gray-900 mb-3">
                  Easy Scheduling
                </h1>
                <p className="leading-relaxed text-gray-500">
                  Book your appointment at your convenience with just a few
                  clicks.
                </p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="p-4 md:w-1/3 w-full">
              <div className="h-full bg-white shadow-md border border-gray-100 px-8 pt-12 pb-12 rounded-3xl overflow-hidden text-center relative transition-all duration-300 hover:shadow-xl hover:-translate-y-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-12 h-12 mb-4 mx-auto text-blue-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 2l7 4v6a9 9 0 01-7 8.71A9 9 0 015 12V6l7-4z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12l2 2 4-4"
                  />
                </svg>
                <h1 className="title-font sm:text-2xl text-xl font-bold text-gray-900 mb-3">
                  Secure System
                </h1>
                <p className="leading-relaxed text-gray-500">
                  Your data is protected with top-notch security encryption
                  measures.
                </p>
              </div>
            </div>

            {/* Card 3 */}
            <div className="p-4 md:w-1/3 w-full">
              <div className="h-full bg-white shadow-md border border-gray-100 px-8 pt-12 pb-12 rounded-3xl overflow-hidden text-center relative transition-all duration-300 hover:shadow-xl hover:-translate-y-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-12 h-12 mb-4 mx-auto text-blue-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z"
                  />
                </svg>
                <h1 className="title-font sm:text-2xl text-xl font-bold text-gray-900 mb-3">
                  User Support
                </h1>
                <p className="leading-relaxed text-gray-500">
                  Our dedicated support team is here to assist you at every step.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- FAQ SECTION --- */}
      <section className="bg-gray-50 py-16 px-6">
        <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-lg">
          <h1 className="text-3xl font-bold text-center text-blue-600 mb-8">
            Frequently Asked Questions
          </h1>

          <div className="space-y-2">
            {faqData.map((faq, index) => (
              <div key={index} className="border-b border-gray-200 py-4">
                <button
                  className="flex justify-between items-center w-full text-left font-medium text-lg text-gray-800 hover:text-blue-600 transition-colors focus:outline-none"
                  onClick={() => toggleFAQ(index)}
                >
                  <span>{faq.question}</span>
                  <span
                    className={`transform transition-transform duration-300 text-blue-500 ${
                      openIndex === index ? "rotate-180" : ""
                    }`}
                  >
                    ▼
                  </span>
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    openIndex === index
                      ? "max-h-40 opacity-100 mt-2"
                      : "max-h-0 opacity-0"
                  }`}
                >
                  <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}