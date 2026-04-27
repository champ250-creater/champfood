import React from 'react';

const FAQ = () => {
  const faqs = [
    { q: "How long does delivery take?", a: "Most orders in rwanda arrive within 30-45 minutes based on location." },
    { q: "What are your delivery hours?", a: "We operate  every day." },
    { q: "Can I pay with MoMo?", a: "Yes! You can pay via mobile money upon delivery." },
    { q: "Is there a delivery fee?", a: "Fees depend on your distance from the restaurant." }
  ];

  return (
    <div className="max-w-4xl mx-auto p-8 pt-24">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Frequently Asked Questions</h1>
      <div className="space-y-6">
        {faqs.map((faq, index) => (
          <div key={index} className="border-b pb-4">
            <h3 className="font-bold text-lg text-orange-600 mb-2">{faq.q}</h3>
            <p className="text-gray-600">{faq.a}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQ;