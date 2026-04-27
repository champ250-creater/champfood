import React from 'react';
import { motion } from 'framer-motion';

const About = () => {
  return (
    <div className="max-w-4xl mx-auto p-8 pt-24 leading-relaxed">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-6 border-b-2 border-orange-600 pb-2">
          Ibyerekeye NZANIRA
        </h1>
        
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-orange-600 mb-4">Intego Yacu</h2>
          <p className="text-gray-700 text-lg">
            NZANIRA ni urubuga rwubatswe hagamijwe gufasha abatuye mubice bimwenabimwe byigihugu  kubona amafunguro meza kandi agezweho mu buryo bwihuse. Twizera ko guhahira ibiryo ku mbuga nkoranyambaga bikwiriye koroha, kwizerwa, kandi bikajyana n'ikoranabuhanga rigezweho.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-orange-600 mb-4">Uko Dukora</h2>
          <p className="text-gray-700 text-lg">
            Duhuza amahoteri n'amaresitora mubice bimwenabimwe byigihugu n'abakiriya babo. Ukoresheje NZANIRA, ushobora guhitamo amafunguro ukunda, ukagaragaza aho uherereye ukoresheje GPS, maze tukakugezaho ibyo wategetse mu gihe gito cyane.
          </p>
        </section>

        <section className="mb-8 bg-orange-50 p-6 rounded-lg border-l-4 border-orange-600">
          <h2 className="text-xl font-semibold text-orange-900 mb-2">Ikoranabuhanga</h2>
          <p className="text-orange-800">
            NZANIRA yubatswe n'abahanga mu by'itumanaho n'ikoranabuhanga (champion group🏆), hagamijwe gukemura ibibazo by'itumanaho hagati y'umukiriya n'aho ibiryo bitunganyirizwa.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-orange-600 mb-4">Twandikire</h2>
          <p className="text-gray-700">
            Niba ufite ikibazo cyangwa inyunganizi, ushobora kutwandikira kuri: <br />
            <span className="font-bold">Email:</span> aimeishimwe2023@gmail.com <br />
            <span className="font-bold">Telefoni:</span> (+250) 785 032 720
          </p>
        </section>
      </motion.div>
    </div>
  );
};

export default About;