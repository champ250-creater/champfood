import React from 'react';
import { motion } from 'framer-motion';
import { FaWhatsapp, FaEnvelope, FaPhoneAlt } from 'react-icons/fa'; // Menya ko wagize 'react-icons'

const Contact = () => {
  return (
    <div className="max-w-4xl mx-auto p-8 pt-24">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Twandikire</h1>
        <p className="text-gray-600 mb-12">
          Ufite ikibazo ku biryo watumije? Cyangwa ushaka kuduha inyunganizi? Twehereze ubutumwa ubu, turagusubiza mu kanya katuri muli Kigali.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* WhatsApp Section */}
          <div className="p-6 border rounded-xl hover:shadow-lg transition cursor-pointer bg-green-50">
            <FaWhatsapp className="text-4xl text-green-600 mx-auto mb-4" />
            <h3 className="font-bold mb-2">WhatsApp</h3>
            <p className="text-sm text-gray-600 mb-4">Tuvugishe kuri WhatsApp mu buryo bwihuse.</p>
            <a 
              href="https://wa.me/250785032720" 
              className="bg-green-600 text-white px-4 py-2 rounded-full text-sm font-semibold"
            >
              Andika ubu
            </a>
          </div>

          {/* Email Section */}
          <div className="p-6 border rounded-xl hover:shadow-lg transition bg-blue-50">
            <FaEnvelope className="text-4xl text-blue-600 mx-auto mb-4" />
            <h3 className="font-bold mb-2">Email</h3>
            <p className="text-sm text-gray-600 mb-4">Twandikire kuri email yacu y'akazi.</p>
            <p className="text-blue-700 font-medium text-xs">aimeishimwe2023@gmail.com</p>
          </div>

          {/* Call Section */}
          <div className="p-6 border rounded-xl hover:shadow-lg transition bg-orange-50">
            <FaPhoneAlt className="text-4xl text-orange-600 mx-auto mb-4" />
            <h3 className="font-bold mb-2">Telefoni</h3>
            <p className="text-sm text-gray-600 mb-4">Duhamagare kuri telefoni igihe cyose.</p>
            <p className="text-orange-700 font-bold">(+250) 785 032 720</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Contact;