import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  FaArrowRight,
  FaCheckCircle,
  FaClock,
  FaMapMarkedAlt,
  FaShieldAlt,
  FaUsers,
} from 'react-icons/fa';

const values = [
  {
    icon: FaClock,
    title: 'Kwihuta',
    text: 'Dushyira menu, cart na contact hafi kugira ngo umukiriya atinde gato ashaka ibyo akeneye.',
  },
  {
    icon: FaShieldAlt,
    title: 'Icyizere',
    text: 'Dutanga amakuru asobanutse ku giciro, restaurant, order n uburyo bwo kutuvugisha.',
  },
  {
    icon: FaMapMarkedAlt,
    title: 'Kugera aho uri',
    text: 'Location, telefoni na WhatsApp bifasha ikipe ya delivery kugeza order ku mukiriya neza.',
  },
];

export default function About() {
  return (
    <div className="px-4 py-14 sm:px-6 lg:px-8">
      <section className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1fr_0.85fr] lg:items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
        >
          <p className="text-sm font-black uppercase tracking-[0.18em] text-emerald-700 dark:text-emerald-300">
            Ibyerekeye NTUMA
          </p>
          <h1 className="mt-3 max-w-3xl text-4xl font-black leading-tight text-slate-950 dark:text-white sm:text-5xl">
            Turoroshya gutumiza amafunguro meza, aho uri hose.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600 dark:text-slate-300">
            NTUMA yubatswe kugira ngo ihuze abakiriya n amaresitora yizewe mu buryo bwihuse,
            bworoshye kandi bwizewe. Intego ni ukugabanya igihe umuntu amara ashaka ibiryo,
            akamenya igiciro, akemeza order, hanyuma agakomeza umunsi we.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/"
              className="focus-ring inline-flex items-center gap-2 rounded-full bg-emerald-700 px-5 py-3 text-sm font-black text-white hover:bg-emerald-800"
            >
              Reba menu
              <FaArrowRight aria-hidden="true" />
            </Link>
            <Link
              to="/contact"
              className="focus-ring inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 hover:text-emerald-700 dark:border-white/10 dark:bg-white/10 dark:text-slate-100"
            >
              Twandikire
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, duration: 0.45 }}
          className="rounded-lg border border-slate-200 bg-white p-6 shadow-xl shadow-emerald-950/5 dark:border-white/10 dark:bg-white/10"
        >
          <img
            src="/123.png"
            alt="NTUMA good food good mood"
            className="aspect-[4/3] w-full rounded-lg object-cover"
          />
          <div className="mt-5 grid gap-3 text-sm font-bold text-slate-600 dark:text-slate-300">
            {[
              'Amahitamo asomeka neza kuri mobile na desktop',
              'Inzira ngufi yo guhitamo, gutumiza no gukurikirana order',
              'Ubufasha kuri WhatsApp, telefoni na email',
            ].map((item) => (
              <p key={item} className="flex items-start gap-2">
                <FaCheckCircle className="mt-1 shrink-0 text-emerald-600" aria-hidden="true" />
                {item}
              </p>
            ))}
          </div>
        </motion.div>
      </section>

      <section className="mx-auto mt-16 max-w-7xl">
        <div className="grid gap-5 md:grid-cols-3">
          {values.map((value, index) => {
            const Icon = value.icon;
            return (
              <motion.article
                key={value.title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
                className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/10"
              >
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-400/20 dark:text-emerald-200">
                  <Icon aria-hidden="true" />
                </div>
                <h2 className="text-xl font-black text-slate-950 dark:text-white">{value.title}</h2>
                <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">{value.text}</p>
              </motion.article>
            );
          })}
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-7xl rounded-lg border border-emerald-200 bg-emerald-50 p-6 dark:border-emerald-400/20 dark:bg-emerald-400/10">
        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-emerald-700 text-2xl text-white">
            <FaUsers aria-hidden="true" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-emerald-950 dark:text-white">
              Twubaka serivisi ikorera abantu, si page nziza gusa.
            </h2>
            <p className="mt-3 text-sm leading-7 text-emerald-950/75 dark:text-emerald-50">
              Urubuga rushya rushyira imbere accessibility, SEO, performance monitoring,
              security headers n imiterere yorohera buri mukiriya kubona ibyo akeneye.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
