import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  FaArrowRight,
  FaChartLine,
  FaCheckCircle,
  FaChevronLeft,
  FaChevronRight,
  FaClock,
  FaConciergeBell,
  FaEnvelope,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaSearch,
  FaShieldAlt,
  FaShoppingBag,
  FaStar,
  FaTruck,
  FaUtensils,
  FaWhatsapp,
} from 'react-icons/fa';
import FoodCard from '../components/FoodCard';
import EmptyState from '../components/EmptyState';
import { foodService } from '../services';
import isombeImage from '../../images/OIP.jpg';
import drinkImage from '../../images/346.jpeg';
import potatoesImage from '../../images/1.jpg';

const fallbackFoods = [
  {
    id: 'sample-isombe',
    name: "Isombe n'ubugali",
    description: 'Ifunguro rya Kinyarwanda riteguwe neza, rifite intungamubiri kandi rigera aho uri rishyushye.',
    price: 3500,
    restaurantName: 'NTUMA Kitchen',
    rating: '4.8',
    image: isombeImage,
  },
  {
    id: 'sample-potatoes',
    name: 'Ibirayi biteguye neza',
    description: 'Ibirayi biryoshye bitegurwa ku buryo buboneye, bikajyana neza n isosi yawe ukunda.',
    price: 2500,
    restaurantName: 'Ntuma Express',
    rating: '4.7',
    image: potatoesImage,
  },
  {
    id: 'sample-drink',
    name: 'Umutobe w imbuto',
    description: 'Umutobe ukonje kandi mwiza, uhuza imbuto zitoranyijwe n uburyohe bwiza.',
    price: 1800,
    restaurantName: 'Nzanira Fresh',
    rating: '4.9',
    image: drinkImage,
  },
  {
    id: 'sample-combo',
    name: 'NTUMA combo',
    description: 'Ifunguro ryuzuye ku muntu umwe, ririmo amahitamo akunzwe n abakiriya bacu.',
    price: 5200,
    restaurantName: 'NTUMA',
    rating: '4.8',
    image: '/123.png',
  },
];

const stats = [
  { value: '30 min', label: 'Impuzandengo yo kugeza ibyo watumije' },
  { value: '500+', label: 'Abakiriya batumiza neza' },
  { value: '24/7', label: 'Ubufasha kuri telefoni na WhatsApp' },
];

const processSteps = [
  {
    icon: FaSearch,
    title: 'Shaka',
    text: 'Hitamo amafunguro, ukoreshe akayunguruzo, urebe igiciro n ibisobanuro mbere yo gutumiza.',
  },
  {
    icon: FaShoppingBag,
    title: 'Tuma',
    text: 'Shyira amafunguro mu byatoranyijwe, wemeze umubare n aho uyageza.',
  },
  {
    icon: FaTruck,
    title: 'Akira',
    text: 'Dukurikirana itegurwa n urugendo kugira ngo ibyo watumije bikugereho vuba.',
  },
];

const featureSlides = [
  {
    icon: FaClock,
    title: 'Igihe gito cyo gutegereza',
    text: 'Imiterere mishya ishyira menu, search, cart na contact hafi y umukoresha kuri telefoni cyangwa desktop.',
    stat: '30 min',
    tag: 'Speed',
  },
  {
    icon: FaShieldAlt,
    title: 'Icyizere n umutekano',
    text: 'CTA zisobanutse, forms zifite labels, security headers na privacy links byongera icyizere cy abakiriya.',
    stat: 'Secure',
    tag: 'Trust',
  },
  {
    icon: FaChartLine,
    title: 'Gukurikirana imikorere',
    text: 'Performance metrics zoherezwa ku endpoint ya analytics iyo VITE_ANALYTICS_ENDPOINT yashyizweho.',
    stat: 'Live',
    tag: 'Insights',
  },
];

const resources = [
  {
    title: 'Uko wahitamo ifunguro rikubereye',
    text: 'Reba igiciro, rating, ibisobanuro n aho restaurant iherereye mbere yo gutumiza.',
  },
  {
    title: 'Kwishyura no kwemeza order',
    text: 'Komeza amakuru yawe arinzwe, ukoreshe WhatsApp cyangwa konti yawe kugira ngo ukurikirane order.',
  },
  {
    title: 'Inama zo kugabanya igihe cyo gutegereza',
    text: 'Tanga location isobanutse, telefoni ikora n amakuru yose akenewe ku delivery.',
  },
];

export default function Home() {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeSlide, setActiveSlide] = useState(0);
  const [lead, setLead] = useState({ name: '', phone: '', details: '' });
  const [leadStatus, setLeadStatus] = useState('');

  useEffect(() => {
    fetchFoods();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((current) => (current + 1) % featureSlides.length);
    }, 6000);

    return () => clearInterval(timer);
  }, []);

  const fetchFoods = async () => {
    try {
      setLoading(true);
      const response = await foodService.getAllFoods();
      setFoods(response.data.data || []);
      setError('');
    } catch (err) {
      setError('Turerekana menu y urugero mu gihe connection ya kitchen iri gusubirwamo.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const menuItems = foods.length > 0 ? foods : fallbackFoods;

  const filteredFoods = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return menuItems;

    return menuItems.filter((food) =>
      [food.name, food.description, food.restaurantName]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
        .includes(term)
    );
  }, [menuItems, searchTerm]);

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleLeadSubmit = (event) => {
    event.preventDefault();
    const subject = encodeURIComponent('NTUMA lead request');
    const body = encodeURIComponent(
      `Amazina: ${lead.name}\nTelefoni: ${lead.phone}\nIcyifuzo: ${lead.details || 'Nifuza ko muntangariza byinshi.'}`
    );

    window.location.href = `mailto:aimeishimwe2023@gmail.com?subject=${subject}&body=${body}`;
    setLeadStatus('Murakoze. Email client yawe irafunguka kugira ngo twohereze icyifuzo.');
    setLead({ name: '', phone: '', details: '' });
  };

  const nextSlide = () => setActiveSlide((current) => (current + 1) % featureSlides.length);
  const previousSlide = () =>
    setActiveSlide((current) => (current - 1 + featureSlides.length) % featureSlides.length);

  const ActiveIcon = featureSlides[activeSlide].icon;

  return (
    <div className="min-h-screen overflow-hidden">
      <section className="relative isolate overflow-hidden bg-slate-950 text-white">
        <img
          src="/123.png"
          alt=""
          className="absolute inset-0 -z-10 h-full w-full object-cover opacity-35"
          aria-hidden="true"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-slate-950 via-slate-950/90 to-emerald-950/80" />

        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-24">
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            className="flex flex-col justify-center"
          >
            <div className="mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-bold text-emerald-100 backdrop-blur">
              <FaUtensils aria-hidden="true" />
              Food delivery ikorera mu Rwanda
            </div>

            <h1 className="max-w-3xl text-4xl font-black leading-tight text-white sm:text-5xl lg:text-6xl">
              Tuma ibiryo ukunda cyane.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-slate-200 sm:text-lg">
              NTUMA iguhuza n amaresitora yizewe, ikagufasha gushaka amafunguro,
              kuyatoranya no gutangira order mu buryo bwihuse kuri telefoni, tablet cyangwa desktop.
            </p>

            <form
              onSubmit={handleSearchSubmit}
              className="mt-8 flex flex-col gap-3 rounded-lg border border-white/20 bg-white/[0.12] p-2 shadow-2xl shadow-black/20 backdrop-blur-xl sm:flex-row"
              role="search"
            >
              <label htmlFor="home-search" className="sr-only">
                Shaka ibiryo cyangwa restaurant
              </label>
              <div className="flex min-w-0 flex-1 items-center gap-3 rounded-full bg-white px-4 py-3 text-slate-900">
                <FaSearch className="shrink-0 text-emerald-700" aria-hidden="true" />
                <input
                  id="home-search"
                  type="search"
                  placeholder="Shaka isombe, umutobe, restaurant..."
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  className="w-full bg-transparent text-sm font-semibold outline-none placeholder:text-slate-400 sm:text-base"
                />
              </div>
              <button
                type="submit"
                className="focus-ring inline-flex items-center justify-center gap-2 rounded-full bg-amber-400 px-6 py-3 text-sm font-black text-slate-950 hover:bg-amber-300"
              >
                Shaka
                <FaArrowRight aria-hidden="true" />
              </button>
            </form>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                to="/signup"
                className="focus-ring inline-flex items-center gap-2 rounded-full bg-emerald-500 px-5 py-3 text-sm font-black text-emerald-950 hover:bg-emerald-400"
              >
                <FaShoppingBag aria-hidden="true" />
                Tangira gutumiza
              </Link>
              <a
                href="https://wa.me/250785032720"
                className="focus-ring inline-flex items-center gap-2 rounded-full border border-white/20 px-5 py-3 text-sm font-bold text-white hover:bg-white/10"
              >
                <FaWhatsapp aria-hidden="true" />
                Vugana natwe
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15, duration: 0.55 }}
            className="self-end rounded-lg border border-white/20 bg-white/[0.12] p-5 shadow-2xl shadow-black/25 backdrop-blur-xl"
          >
            <div className="overflow-hidden rounded-lg border border-white/10 bg-slate-950/70">
              <img
                src="/ntuma-logo.png"
                alt="NTUMA good food good mood"
                className="h-72 w-full object-contain p-5 sm:h-80 lg:h-96"
              />
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              {stats.map((stat) => (
                <div key={stat.label} className="rounded-lg bg-white/10 p-4">
                  <div className="text-2xl font-black text-amber-300">{stat.value}</div>
                  <p className="mt-1 text-xs font-semibold leading-5 text-slate-200">{stat.label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <section id="menu" className="scroll-mt-24 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.18em] text-emerald-700 dark:text-emerald-300">
                Menu
              </p>
              <h2 className="mt-2 text-3xl font-black text-slate-950 dark:text-white sm:text-4xl">
                {searchTerm ? `Ibyabonetse (${filteredFoods.length})` : 'Amafunguro akunzwe'}
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-300">
                Reba amafunguro aboneka, uyungurure ukoresheje search, hanyuma winjire kugira ngo utangire order.
              </p>
            </div>
            {error && (
              <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-900">
                {error}
              </div>
            )}
          </div>

          {loading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="h-96 animate-pulse rounded-lg bg-white shadow-sm dark:bg-white/10" />
              ))}
            </div>
          ) : filteredFoods.length === 0 ? (
            <EmptyState
              title="Nta biryo bihuye n'ishakisha"
              description="Hindura ijambo washakishije cyangwa utwandikire kuri WhatsApp tugufashe kubona ibyo ushaka."
            />
          ) : (
            <motion.div layout className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {filteredFoods.map((food, index) => (
                <motion.div
                  key={food.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.06 }}
                >
                  <FoodCard food={food} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      <section className="bg-white px-4 py-16 dark:bg-slate-950/40 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.18em] text-emerald-700 dark:text-emerald-300">
                Uko bikora
              </p>
              <h2 className="mt-2 text-3xl font-black text-slate-950 dark:text-white sm:text-4xl">
                Gutumiza bikwiye koroha.
              </h2>
              <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-300">
                Twashyize ibikorwa by ingenzi mu nzira ngufi: search, menu, cart,
                contact na status y order. Buri ntambwe irasomeka kandi irakora no kuri mobile.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {processSteps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <motion.div
                    key={step.title}
                    initial={{ opacity: 0, y: 18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.08 }}
                    className="rounded-lg border border-slate-200 bg-slate-50 p-6 shadow-sm dark:border-white/10 dark:bg-white/10"
                  >
                    <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-400/20 dark:text-emerald-200">
                      <Icon aria-hidden="true" />
                    </div>
                    <h3 className="text-lg font-black text-slate-950 dark:text-white">{step.title}</h3>
                    <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">{step.text}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1fr_1.1fr] lg:items-center">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.18em] text-emerald-700 dark:text-emerald-300">
              Interactive
            </p>
            <h2 className="mt-2 text-3xl font-black text-slate-950 dark:text-white sm:text-4xl">
              Ibintu byongera conversion n icyizere.
            </h2>
            <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-300">
              Iyi slider yerekana ibyo urubuga rushyize imbere: kwihuta, umutekano,
              accessibility na analytics ishobora guhuza n endpoint yanyu.
            </p>
            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={previousSlide}
                className="focus-ring inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm hover:text-emerald-700 dark:border-white/10 dark:bg-white/10 dark:text-white"
                aria-label="Reba slide ibanza"
              >
                <FaChevronLeft aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={nextSlide}
                className="focus-ring inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm hover:text-emerald-700 dark:border-white/10 dark:bg-white/10 dark:text-white"
                aria-label="Reba slide ikurikira"
              >
                <FaChevronRight aria-hidden="true" />
              </button>
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-xl shadow-emerald-950/5 dark:border-white/10 dark:bg-white/10">
            <AnimatePresence mode="wait">
              <motion.div
                key={featureSlides[activeSlide].title}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
                className="grid gap-6 sm:grid-cols-[auto_1fr]"
              >
                <div className="flex h-20 w-20 items-center justify-center rounded-lg bg-emerald-700 text-3xl text-white shadow-lg shadow-emerald-900/20">
                  <ActiveIcon aria-hidden="true" />
                </div>
                <div>
                  <div className="mb-3 inline-flex rounded-full bg-amber-100 px-3 py-1 text-xs font-black uppercase tracking-[0.14em] text-amber-900">
                    {featureSlides[activeSlide].tag}
                  </div>
                  <h3 className="text-2xl font-black text-slate-950 dark:text-white">
                    {featureSlides[activeSlide].title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
                    {featureSlides[activeSlide].text}
                  </p>
                  <div className="mt-6 flex items-center gap-3 text-emerald-700 dark:text-emerald-300">
                    <span className="text-3xl font-black">{featureSlides[activeSlide].stat}</span>
                    <span className="text-sm font-bold text-slate-500 dark:text-slate-300">
                      system-ready signal
                    </span>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>

      <section className="bg-slate-950 px-4 py-16 text-white sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1fr_0.9fr] lg:items-start">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.18em] text-emerald-300">
              Resources
            </p>
            <h2 className="mt-2 text-3xl font-black sm:text-4xl">
              Inama zifasha abakiriya gutumiza neza.
            </h2>
            <div className="mt-8 grid gap-4 md:grid-cols-3 lg:grid-cols-1">
              {resources.map((resource) => (
                <article key={resource.title} className="rounded-lg border border-white/10 bg-white/[0.08] p-5">
                  <h3 className="font-black">{resource.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-300">{resource.text}</p>
                </article>
              ))}
            </div>
          </div>

          <form
            onSubmit={handleLeadSubmit}
            className="rounded-lg border border-white/10 bg-white p-6 text-slate-950 shadow-2xl shadow-black/25"
          >
            <div className="mb-6 flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                <FaConciergeBell aria-hidden="true" />
              </div>
              <div>
                <h3 className="text-2xl font-black">Saba ko tuguhamagara</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Tanga amakuru make, dukoreshe email cyangwa WhatsApp tubone uko tugufasha vuba.
                </p>
              </div>
            </div>

            <div className="grid gap-4">
              <div>
                <label htmlFor="lead-name" className="mb-2 block text-sm font-bold text-slate-700">
                  Amazina
                </label>
                <input
                  id="lead-name"
                  type="text"
                  required
                  value={lead.name}
                  onChange={(event) => setLead((current) => ({ ...current, name: event.target.value }))}
                  className="focus-ring w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 font-semibold text-slate-900"
                  placeholder="Andika amazina yawe"
                />
              </div>

              <div>
                <label htmlFor="lead-phone" className="mb-2 block text-sm font-bold text-slate-700">
                  Telefoni
                </label>
                <input
                  id="lead-phone"
                  type="tel"
                  required
                  value={lead.phone}
                  onChange={(event) => setLead((current) => ({ ...current, phone: event.target.value }))}
                  className="focus-ring w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 font-semibold text-slate-900"
                  placeholder="+250 ..."
                />
              </div>

              <div>
                <label htmlFor="lead-details" className="mb-2 block text-sm font-bold text-slate-700">
                  Icyo ukeneye
                </label>
                <textarea
                  id="lead-details"
                  rows="4"
                  value={lead.details}
                  onChange={(event) => setLead((current) => ({ ...current, details: event.target.value }))}
                  className="focus-ring w-full resize-none rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 font-semibold text-slate-900"
                  placeholder="Urugero: ndashaka gufungura konti ya restaurant..."
                />
              </div>
            </div>

            {leadStatus && (
              <p className="mt-4 rounded-lg bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800" role="status">
                {leadStatus}
              </p>
            )}

            <button
              type="submit"
              className="focus-ring mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-emerald-700 px-5 py-3 font-black text-white hover:bg-emerald-800"
            >
              <FaEnvelope aria-hidden="true" />
              Ohereza icyifuzo
            </button>

            <div className="mt-5 grid gap-3 text-sm font-semibold text-slate-600 sm:grid-cols-2">
              <a href="tel:+250785032720" className="inline-flex items-center gap-2 hover:text-emerald-700">
                <FaPhoneAlt aria-hidden="true" />
                Hamagara
              </a>
              <a href="https://wa.me/250785032720" className="inline-flex items-center gap-2 hover:text-emerald-700">
                <FaWhatsapp aria-hidden="true" />
                WhatsApp
              </a>
            </div>
          </form>
        </div>
      </section>

      <section className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 rounded-lg border border-emerald-200 bg-emerald-50 p-6 text-emerald-950 shadow-sm dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-50 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-3">
            <FaCheckCircle className="mt-1 shrink-0 text-emerald-700 dark:text-emerald-300" aria-hidden="true" />
            <p className="text-sm font-bold leading-6">
              Urubuga rwavuguruwe rushingiye kuri responsive design, accessibility,
              SEO metadata, security headers na performance monitoring ishobora guhuzwa na analytics endpoint.
            </p>
          </div>
          <Link
            to="/contact"
            className="focus-ring inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-emerald-700 px-5 py-3 text-sm font-black text-white hover:bg-emerald-800"
          >
            Twandikire
            <FaArrowRight aria-hidden="true" />
          </Link>
        </div>
      </section>
    </div>
  );
}
