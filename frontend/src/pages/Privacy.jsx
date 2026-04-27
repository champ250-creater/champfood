import React from 'react';

const Privacy = () => {
  return (
    <div className="max-w-4xl mx-auto p-8 pt-24 leading-relaxed">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Privacy Policy</h1>
      <p className="text-gray-500 mb-8">Last Updated: April 2026</p>

      <section className="mb-8">
        <h2 className="text-xl font-semibold text-orange-600 mb-4">How We Use Your Data</h2>
        <p className="text-gray-700">At NZANIRA, we only collect information that is strictly necessary to deliver your food.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold text-orange-600 mb-4">Location Data</h2>
        <p className="text-gray-700">When you use our "Use My Location" feature, we access your GPS coordinates to help our delivery partners find you in Kigali. We do not store your live movement history.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold text-orange-600 mb-4">WhatsApp & Communication</h2>
        <p className="text-gray-700">Your phone number is used to send order confirmations and location links via WhatsApp. We do not share your number with third-party advertisers.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold text-orange-600 mb-4">Security</h2>
        <p className="text-gray-700">We use industry-standard encryption to protect your account details. As an Electronics and Telecommunication-focused platform, we prioritize system integrity.</p>
      </section>
    </div>
  );
};

export default Privacy;