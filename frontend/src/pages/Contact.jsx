import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaEnvelope, FaMapMarkerAlt, FaPhoneAlt, FaWhatsapp } from 'react-icons/fa';

const channels = [
  {
    icon: FaWhatsapp,
    title: 'WhatsApp',
    text: 'Tuvugishe mu buryo bwihuse kuri WhatsApp.',
    action: 'Andika ubu',
    href: 'https://wa.me/250785032720',
    color: 'text-emerald-700 bg-emerald-50 border-emerald-200',
  },
  {
    icon: FaEnvelope,
    title: 'Email',
    text: 'Ohereza ikibazo, inyunganizi cyangwa ubusabe bw ubufatanye.',
    action: 'Ohereza email',
    href: 'mailto:aimeishimwe2023@gmail.com',
    color: 'text-blue-700 bg-blue-50 border-blue-200',
  },
  {
    icon: FaPhoneAlt,
    title: 'Telefoni',
    text: 'Duhamagare kuri telefoni igihe ukeneye ubufasha bwihuse.',
    action: 'Hamagara',
    href: 'tel:+250785032720',
    color: 'text-amber-700 bg-amber-50 border-amber-200',
  },
];

export default function Contact() {
  const [form, setForm] = useState({ name: '', contact: '', message: '' });
  const [status, setStatus] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    const subject = encodeURIComponent('NTUMA contact request');
    const body = encodeURIComponent(
      `Amazina: ${form.name}\nImeri/Telefoni: ${form.contact}\nUbutumwa:\n${form.message}`
    );

    window.location.href = `mailto:aimeishimwe2023@gmail.com?subject=${subject}&body=${body}`;
    setStatus('Murakoze. Email client yawe irafunguka kugira ngo twohereze ubutumwa.');
    setForm({ name: '', contact: '', message: '' });
  };

  return (
    <div className="px-4 py-14 sm:px-6 lg:px-8">
      <section className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="max-w-3xl"
        >
          <p className="text-sm font-black uppercase tracking-[0.18em] text-emerald-700 dark:text-emerald-300">
            Twandikire
          </p>
          <h1 className="mt-3 text-4xl font-black leading-tight text-slate-950 dark:text-white sm:text-5xl">
            Ufite ikibazo, order cyangwa ubufatanye? Turi hafi.
          </h1>
          <p className="mt-5 text-base leading-8 text-slate-600 dark:text-slate-300">
            Hitamo uburyo bukorohera: WhatsApp, telefoni, email cyangwa form iri hano.
            Dusubiza vuba kandi dukurikirana buri busabe kugeza bubonewe igisubizo.
          </p>
        </motion.div>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {channels.map((channel, index) => {
            const Icon = channel.icon;
            return (
              <motion.a
                key={channel.title}
                href={channel.href}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08 }}
                className={`focus-ring rounded-lg border p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg ${channel.color}`}
              >
                <Icon className="text-3xl" aria-hidden="true" />
                <h2 className="mt-5 text-xl font-black text-slate-950">{channel.title}</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">{channel.text}</p>
                <span className="mt-5 inline-flex rounded-full bg-white px-4 py-2 text-sm font-black text-slate-800">
                  {channel.action}
                </span>
              </motion.a>
            );
          })}
        </div>
      </section>

      <section className="mx-auto mt-14 grid max-w-7xl gap-8 lg:grid-cols-[0.85fr_1.15fr]">
        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/10">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-400/20 dark:text-emerald-200">
            <FaMapMarkerAlt aria-hidden="true" />
          </div>
          <h2 className="mt-5 text-2xl font-black text-slate-950 dark:text-white">Amakuru yihuse</h2>
          <div className="mt-5 space-y-4 text-sm font-semibold text-slate-600 dark:text-slate-300">
            <p>Email: <a href="mailto:aimeishimwe2023@gmail.com" className="text-emerald-700 hover:underline">aimeishimwe2023@gmail.com</a></p>
            <p>Telefoni: <a href="tel:+250785032720" className="text-emerald-700 hover:underline">(+250) 785 032 720</a></p>
            <p>Service area: Rwanda, with priority support for active delivery zones.</p>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-lg border border-slate-200 bg-white p-6 shadow-xl shadow-emerald-950/5 dark:border-white/10 dark:bg-white/10"
        >
          <h2 className="text-2xl font-black text-slate-950 dark:text-white">Ohereza ubutumwa</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
            Uzuza amakuru make, tugufashe vuba.
          </p>

          <div className="mt-6 grid gap-4">
            <div>
              <label htmlFor="contact-name" className="mb-2 block text-sm font-bold text-slate-700 dark:text-slate-200">
                Amazina
              </label>
              <input
                id="contact-name"
                type="text"
                required
                value={form.name}
                onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                className="focus-ring w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 font-semibold text-slate-950 dark:border-white/10 dark:bg-slate-950 dark:text-white"
              />
            </div>

            <div>
              <label htmlFor="contact-contact" className="mb-2 block text-sm font-bold text-slate-700 dark:text-slate-200">
                Imeri cyangwa telefoni
              </label>
              <input
                id="contact-contact"
                type="text"
                required
                value={form.contact}
                onChange={(event) => setForm((current) => ({ ...current, contact: event.target.value }))}
                className="focus-ring w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 font-semibold text-slate-950 dark:border-white/10 dark:bg-slate-950 dark:text-white"
              />
            </div>

            <div>
              <label htmlFor="contact-message" className="mb-2 block text-sm font-bold text-slate-700 dark:text-slate-200">
                Ubutumwa
              </label>
              <textarea
                id="contact-message"
                rows="5"
                required
                value={form.message}
                onChange={(event) => setForm((current) => ({ ...current, message: event.target.value }))}
                className="focus-ring w-full resize-none rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 font-semibold text-slate-950 dark:border-white/10 dark:bg-slate-950 dark:text-white"
              />
            </div>
          </div>

          {status && (
            <p className="mt-4 rounded-lg bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800" role="status">
              {status}
            </p>
          )}

          <button
            type="submit"
            className="focus-ring mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-emerald-700 px-5 py-3 font-black text-white hover:bg-emerald-800"
          >
            <FaEnvelope aria-hidden="true" />
            Ohereza
          </button>
        </form>
      </section>
    </div>
  );
}
