import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChevronDown } from 'react-icons/fa';

const faqs = [
  {
    q: 'NTUMA ikora ite?',
    a: 'NTUMA igufasha gushaka amafunguro ku maresitora yizewe, uyashyira mu byatoranyijwe, hanyuma utumize. Tukurikirana order yawe kugeza igukubiyeho.',
  },
  {
    q: 'Ni igihe kingana iki cyo gutegereza delivery?',
    a: 'Akenshi order ikugera mu minota 30-45, hagendewe ku masaha n aho uherereye. Mu gisagara cya Kigali niho delivery yihuta cyane.',
  },
  {
    q: 'Ni ubuhe buryo bwo kwishyura mushyigikiye?',
    a: 'Ushobora kwishyura ukoresheje Mobile Money (MTN MoMo, Airtel Money) igihe ibyo watumije bikugeze. Tukora kandi kuri Cash on Delivery.',
  },
  {
    q: 'Ese delivery ifite igiciro?',
    a: 'Igiciro cyo kugeza ibyo watumije gishingiye ku ntera uri kure y iresitora. Ubisanga byerekanwa mbere yo kwemeza order.',
  },
  {
    q: 'Ese nshobora guhagarika cyangwa guhindura order?',
    a: 'Niba order yawe itaratangira gutegurwa, ushobora kutwandikira kuri WhatsApp cyangwa telefoni kugira ngo tuyihindure cyangwa tuyihagarike.',
  },
  {
    q: 'Mufungura n amasaha angahe?',
    a: 'NTUMA ikora buri munsi, kuva saa mbiri z igitondo kugeza saa kumi n imwe z ijoro. Ubufasha bwa WhatsApp buboneka 24/7.',
  },
  {
    q: 'Nibura ndi mu Rwanda se?',
    a: 'Ubu NTUMA ikorera mu Rwanda gusa, ariko turacyahugura delivery zone. Twandikire niba ushaka kumenya niba aho uherereye duhakorera.',
  },
  {
    q: 'Ese nshobora gufungura konti nk umucuruzi w amafunguro?',
    a: 'Yego! Twandikire kuri email cyangwa WhatsApp utwereke ko ushaka guhuza restaurant yawe na NTUMA platform.',
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="px-4 py-14 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
        >
          <p className="text-sm font-black uppercase tracking-[0.18em] text-emerald-700 dark:text-emerald-300">
            FAQ
          </p>
          <h1 className="mt-3 text-4xl font-black leading-tight text-slate-950 dark:text-white sm:text-5xl">
            Ibibazo bikunze kubazwa
          </h1>
          <p className="mt-5 text-base leading-8 text-slate-600 dark:text-slate-300">
            Hano hari ibisubizo by ibibazo abakiriya bacu bakunze kubaza. Niba utabonye igisubizo ushaka, twandikire kuri WhatsApp.
          </p>
        </motion.div>

        <div className="mt-10 divide-y divide-slate-200 dark:divide-white/10">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.04 }}
            >
              <button
                type="button"
                onClick={() => toggle(index)}
                className="flex w-full items-center justify-between gap-4 py-5 text-left"
                aria-expanded={openIndex === index}
              >
                <span className="text-base font-black text-slate-950 dark:text-white">
                  {faq.q}
                </span>
                <FaChevronDown
                  className={`shrink-0 text-emerald-600 transition-transform duration-200 ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                  aria-hidden="true"
                />
              </button>
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <p className="pb-5 text-sm leading-7 text-slate-600 dark:text-slate-300">
                      {faq.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}