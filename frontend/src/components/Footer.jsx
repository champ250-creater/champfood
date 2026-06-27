import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaEnvelope, FaPhoneAlt, FaWhatsapp } from 'react-icons/fa';

export default function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className="border-t border-emerald-900/10 bg-slate-950 text-white"
    >
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.25fr_2fr]">
          <div>
            <Link to="/" className="focus-ring inline-flex items-center gap-3 rounded-full">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-900 p-1.5 ring-1 ring-emerald-300/25">
                <img src="/ntuma-logo.png" alt="NTUMA" className="h-full w-full object-contain" />
              </span>
              <span>
                <span className="block text-xl font-black">NTUMA</span>
                <span className="block text-xs font-bold uppercase tracking-[0.18em] text-emerald-300">
                  Good food mood
                </span>
              </span>
            </Link>
            <p className="mt-5 max-w-md text-sm leading-6 text-slate-300">
              Urubuga rwo gutumiza amafunguro ruguhuza n'amaresitora yizewe,
              rukagufasha guhitamo, kwishyura no gukurikirana ibyo watumije mu buryo bworoshye.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href="https://wa.me/250785032720"
                className="focus-ring inline-flex items-center gap-2 rounded-full bg-emerald-500 px-4 py-2 text-sm font-black text-emerald-950 hover:bg-emerald-400"
              >
                <FaWhatsapp aria-hidden="true" />
                WhatsApp
              </a>
              <a
                href="mailto:aimeishimwe2023@gmail.com"
                className="focus-ring inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm font-bold text-slate-100 hover:bg-white/10"
              >
                <FaEnvelope aria-hidden="true" />
                Email
              </a>
            </div>
          </div>

          <div className="grid gap-8 sm:grid-cols-3">
            <div>
              <h4 className="mb-4 text-sm font-black uppercase tracking-[0.16em] text-emerald-300">
                Urubuga
              </h4>
              <ul className="space-y-3 text-sm text-slate-300">
                <li><Link to="/" className="hover:text-white">Ahabanza</Link></li>
                <li><Link to="/about" className="hover:text-white">Ibyerekeye</Link></li>
                <li><Link to="/contact" className="hover:text-white">Twandikire</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="mb-4 text-sm font-black uppercase tracking-[0.16em] text-emerald-300">
                Ubufasha
              </h4>
              <ul className="space-y-3 text-sm text-slate-300">
                <li><Link to="/faq" className="hover:text-white">FAQ</Link></li>
                <li><Link to="/privacy" className="hover:text-white">Privacy Policy</Link></li>
                <li><Link to="/terms" className="hover:text-white">Terms</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="mb-4 text-sm font-black uppercase tracking-[0.16em] text-emerald-300">
                Contact
              </h4>
              <ul className="space-y-3 text-sm text-slate-300">
                <li className="flex gap-2">
                  <FaEnvelope className="mt-1 shrink-0 text-emerald-300" aria-hidden="true" />
                  <a href="mailto:aimeishimwe2023@gmail.com" className="break-all hover:text-white">
                    aimeishimwe2023@gmail.com
                  </a>
                </li>
                <li className="flex gap-2">
                  <FaPhoneAlt className="mt-1 shrink-0 text-emerald-300" aria-hidden="true" />
                  <a href="tel:+250785032720" className="hover:text-white">
                    (+250) 785 032 720
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-white/10 pt-6 text-sm text-slate-400 sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {new Date().getFullYear()} NTUMA. All rights reserved.</p>
          <p>Built for fast, accessible ordering across every screen.</p>
        </div>
      </div>
    </motion.footer>
  );
}
