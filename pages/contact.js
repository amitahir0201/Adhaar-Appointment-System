import React, { useState } from "react";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Check if fields are filled (basic validation)
    if (!formData.name || !formData.email || !formData.message) {
      alert("Please fill in all fields before sending.");
      return;
    }

    // 1. Show the confirmation alert
    alert(`Thank you, ${formData.name}! Your message has been sent successfully to VGEC Administration.`);
    
    // 2. Log the data (for your testing)
    console.log("Form Submitted:", formData);

    // 3. Clear the form
    setFormData({
      name: "",
      email: "",
      message: "",
    });
  };

  return (
    <section className="text-gray-600 body-font relative bg-white">
      {/* Header Section */}
      <div className="container px-5 py-10 mx-auto">
        <div className="flex flex-col text-center w-full mb-4">
          <h2 className="sm:text-3xl text-2xl font-medium title-font mb-4 text-gray-900">
            Contact VGEC
          </h2>
          <p className="lg:w-2/3 mx-auto leading-relaxed text-base text-gray-500">
            Have questions about admissions, events, or academics? Reach out to us directly or visit our campus in Chandkheda.
          </p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="container px-5 pb-24 mx-auto flex sm:flex-nowrap flex-wrap">
        
        {/* MAP SECTION + CONTACT INFO OVERLAY */}
        <div className="lg:w-2/3 md:w-1/2 bg-gray-300 rounded-lg overflow-hidden sm:mr-10 p-10 flex items-end justify-start relative h-[600px] md:h-auto min-h-[500px] w-full">
          <iframe
            width="100%"
            height="100%"
            className="absolute inset-0"
            frameBorder="0"
            title="VGEC Location"
            marginHeight="0"
            marginWidth="0"
            scrolling="no"
            src="https://maps.google.com/maps?q=Vishwakarma%20Government%20Engineering%20College&t=&z=15&ie=UTF8&iwloc=&output=embed"
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            style={{ filter: "none" }}
          ></iframe>

          {/* Contact Details Box (White Overlay) */}
          <div className="bg-white relative flex flex-wrap py-6 rounded shadow-md w-full">
            <div className="lg:w-1/2 px-6">
              <h2 className="title-font font-semibold text-gray-900 tracking-widest text-xs">ADDRESS</h2>
              <p className="mt-1 text-sm text-gray-600">
                Vishwakarma Government Engineering College,<br/>
                Nr. Visat Three Roads, Chandkheda,<br/>
                Ahmedabad, Gujarat 382424
              </p>
            </div>
            <div className="lg:w-1/2 px-6 mt-4 lg:mt-0">
              <h2 className="title-font font-semibold text-gray-900 tracking-widest text-xs">EMAIL</h2>
              <a href="mailto:principal@vgecg.ac.in" className="text-indigo-500 leading-relaxed text-sm">
                principal@vgecg.ac.in
              </a>
              <h2 className="title-font font-semibold text-gray-900 tracking-widest text-xs mt-4">PHONE</h2>
              <p className="leading-relaxed text-sm text-gray-600">+91 79 2329 3891</p>
            </div>
          </div>
        </div>

        {/* FORM SECTION */}
        <div className="lg:w-1/3 md:w-1/2 bg-white flex flex-col md:ml-auto w-full md:py-8 mt-8 md:mt-0">
          <h2 className="text-gray-900 text-lg mb-1 font-medium title-font">
            Send a Message
          </h2>
          <p className="leading-relaxed mb-5 text-gray-600">
            We generally respond within 24 hours.
          </p>
          <form onSubmit={handleSubmit}>
            <div className="relative mb-4">
              <label htmlFor="name" className="leading-7 text-sm text-gray-600">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                required
              />
            </div>
            <div className="relative mb-4">
              <label htmlFor="email" className="leading-7 text-sm text-gray-600">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                required
              />
            </div>
            <div className="relative mb-4">
              <label htmlFor="message" className="leading-7 text-sm text-gray-600">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 h-32 text-base outline-none text-gray-700 py-1 px-3 resize-none leading-6 transition-colors duration-200 ease-in-out"
                required
              ></textarea>
            </div>
            <button
              type="submit"
              className="text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded text-lg w-full transition-all"
            >
              Send Message
            </button>
            <p className="text-xs text-gray-500 mt-3">
              We respect your privacy.
            </p>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;