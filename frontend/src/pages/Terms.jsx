import React from 'react';

const Terms = () => {
  return (
    <div className="max-w-4xl mx-auto p-8 pt-24 leading-relaxed">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Terms of Service</h1>
      <p className="text-gray-500 mb-8">Last Updated: April 2026</p>

      <section className="mb-8">
        <h2 className="text-xl font-semibold text-orange-600 mb-4">1. Introduction</h2>
        <p className="text-gray-700">Welcome to Ntuma. By using our website and services, you agree to follow these rules. Please read them carefully.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold text-orange-600 mb-4">2. Ordering & Payments</h2>
        <p className="text-gray-700">When you place an order, you agree to pay the total price listed. Payments are currently handled via Mobile Money or Cash upon delivery. Please ensure your phone number is correct for WhatsApp communication.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold text-orange-600 mb-4">3. Delivery Policy</h2>
        <p className="text-gray-700">We aim to deliver within 45 minutes. However, delivery times may vary based on weather in your place or traffic. You must provide an accurate location using our GPS tool to ensure successful delivery.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold text-orange-600 mb-4">4. Cancellations</h2>
        <p className="text-gray-700">Orders can only be canceled before the restaurant starts preparing your food. Once the food is ready, you are responsible for the payment.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold text-orange-600 mb-4">5. Contact Us</h2>
        <p className="text-gray-700">If you have any questions about these terms, contact us at: <span className="font-bold">aimeishimwe2023@gmail.com</span></p>
      </section>
    </div>
  );
};

export default Terms;