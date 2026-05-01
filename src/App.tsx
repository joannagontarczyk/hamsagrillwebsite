import React, { useState, useEffect } from 'react';
import { MapPin, Phone, Clock, Utensils, ChefHat, Star, ArrowRight, Menu, Flame, Globe, Instagram, Calendar, Coffee, Salad, Pizza, Cake, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, useScroll, useTransform, AnimatePresence } from 'motion/react';
import { translations } from './translations';

const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.2 }
  }
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.2, 0.65, 0.3, 0.9] } }
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.8, ease: [0.2, 0.65, 0.3, 0.9] } }
};

export default function App() {
  const [lang, setLang] = useState<'en' | 'pl'>('en');
  const [isReservationModalOpen, setIsReservationModalOpen] = useState(false);
  const [reservationLocation, setReservationLocation] = useState('');
  const [reservationDate, setReservationDate] = useState('');
  const [reservationHour, setReservationHour] = useState('');
  const [reservationMinute, setReservationMinute] = useState('');
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [isCallModalOpen, setIsCallModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);
  
  const spaceImages = Array.from({ length: 7 }, (_, i) => `/space (${i + 1}).jpg`);
  const [currentSpaceImgIndex, setCurrentSpaceImgIndex] = useState(0);
  const [selectedSpaceImg, setSelectedSpaceImg] = useState<string | null>(null);

  const t = translations[lang];

  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const now = new Date();
  const todayStr = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().split('T')[0];

  const getSelectedDate = (dateStr: string) => {
    if (!dateStr) return null;
    const [year, month, day] = dateStr.split('-').map(Number);
    return new Date(year, month - 1, day);
  };

  const getAvailableHours = () => {
    if (!reservationDate) return [];
    
    const selectedDateObj = getSelectedDate(reservationDate);
    if (!selectedDateObj) return [];
    
    const isSunday = selectedDateObj.getDay() === 0;
    
    const isToday =
      selectedDateObj.getDate() === now.getDate() &&
      selectedDateObj.getMonth() === now.getMonth() &&
      selectedDateObj.getFullYear() === now.getFullYear();

    const startHour = isSunday ? 11 : 10;
    const endHour = isSunday ? 21 : 22;

    const currentHour = now.getHours();
    
    const options = [];
    for (let h = startHour; h <= endHour; h++) {
      if (isToday) {
        if (h < currentHour) continue;
        if (h === currentHour) {
           // Skip if there are no valid minutes left in this hour
           const isLastHour = h === endHour;
           const maxValidMinute = isLastHour ? 30 : 45;
           if (now.getMinutes() >= maxValidMinute) {
             continue;
           }
        }
      }
      options.push(h.toString().padStart(2, '0'));
    }
    return options;
  };

  const getAvailableMinutes = (hourStr: string) => {
    if (!hourStr || !reservationDate) return [];
    
    const selectedDateObj = getSelectedDate(reservationDate);
    if (!selectedDateObj) return [];

    const isSunday = selectedDateObj.getDay() === 0;
    
    const isToday =
      selectedDateObj.getDate() === now.getDate() &&
      selectedDateObj.getMonth() === now.getMonth() &&
      selectedDateObj.getFullYear() === now.getFullYear();

    const endHour = isSunday ? 21 : 22;
    const h = parseInt(hourStr, 10);

    const minutes = ["00", "15", "30", "45"];
    let filteredMinutes = minutes;

    if (h === endHour) {
      filteredMinutes = ["00", "15", "30"]; // Last reservation half an hour before close
    }

    if (isToday && h === now.getHours()) {
      const currentMinute = now.getMinutes();
      filteredMinutes = filteredMinutes.filter(m => parseInt(m, 10) > currentMinute);
    }
    
    return filteredMinutes;
  };

  const availableHours = getAvailableHours();
  const availableMinutes = getAvailableMinutes(reservationHour);

  return (
    <>
      <AnimatePresence>
        {showSplash && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 1.5, delay: 1.5 } }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/40 backdrop-blur-sm pointer-events-none"
          >
            <motion.img 
              initial={{ scale: 0.8, opacity: 0, filter: "blur(0px) brightness(1) sepia(0)" }}
              animate={{ scale: 1, opacity: 1, filter: "blur(0px) brightness(1) sepia(0)" }}
              exit={{ 
                scale: 1.15, 
                opacity: 0, 
                x: "10vw", 
                y: "-10vh",
                rotate: 10, 
                filter: "blur(40px) brightness(3) sepia(1) hue-rotate(-15deg) drop-shadow(0 0 100px rgba(245,158,11,1))",
                transition: { duration: 2.2, ease: "easeInOut" }
              }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              src="/Hamsa (alone).png" 
              alt="Hamsa Grill Logo" 
              className="w-[80vw] h-[80vh] object-contain drop-shadow-[0_25px_25px_rgba(0,0,0,0.7)] drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)] z-10 relative"
            />
            {/* Golden Stardust Wave */}
            {Array.from({ length: 400 }).map((_, i) => {
              const startX = (Math.random() - 0.5) * 60; // -30vw to 30vw
              const startY = (Math.random() - 0.5) * 60; // -30vh to 30vh
              const isSparkle = Math.random() > 0.85;
              const size = Math.random() * (isSparkle ? 3 : 6) + 2;
              
              // Wave delay from left bottom to right top
              const distanceDelay = ((startX + 30) / 60) * 0.4 + ((30 - startY) / 60) * 0.4;

              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: `${startX}vw`, y: `${startY}vh` }}
                  exit={{
                    opacity: [0, 1, 0.8, 0],
                    x: [
                      `${startX}vw`, 
                      `${startX + (Math.random() * 50 + 20)}vw`
                    ],
                    y: [
                      `${startY}vh`, 
                      `${startY - (Math.random() * 50 + 20)}vh`
                    ],
                    scale: [0, Math.random() * 1.5 + 0.5, 0],
                    rotate: [0, Math.random() * 360, Math.random() * 720],
                    transition: { 
                      duration: 2 + Math.random() * 1.5, 
                      ease: "easeOut",
                      delay: distanceDelay + Math.random() * 0.3
                    }
                  }}
                  className={`absolute rounded-full z-20 pointer-events-none ${isSparkle ? 'bg-white' : 'bg-gradient-to-tr from-amber-100 via-amber-400 to-amber-600'}`}
                  style={{
                    width: `${size}px`,
                    height: `${size}px`,
                    boxShadow: isSparkle ? "0 0 20px 3px rgba(255, 255, 255, 0.9)" : "0 0 25px 4px rgba(245, 158, 11, 0.8)"
                  }}
                />
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      <div 
        className="relative bg-neutral-950 min-h-screen font-sans text-neutral-200 selection:bg-amber-500/30 selection:text-amber-200 bg-cover bg-center bg-fixed"
      style={{ backgroundImage: 'url("/Background.png")' }}
    >
      {/* Ambient Background Glows */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-amber-600/10 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-orange-600/10 blur-[120px]" />
      </div>

      {/* Navigation */}
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: [0.2, 0.65, 0.3, 0.9] }}
        className="fixed w-full z-50 bg-neutral-950/50 backdrop-blur-xl border-b border-white/5"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-24">
            <a 
              href="#" 
              onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }} 
              className="flex items-center group cursor-pointer flex-shrink-0"
            >
              <div className="h-14 md:h-16 flex items-center justify-center transition-all duration-500">
                <img src="/Hamsa_logo_horizontal.png" alt="Hamsa Grill Logo" className="h-full w-auto object-contain" />
              </div>
            </a>
            <div className="hidden lg:flex items-center space-x-4 xl:space-x-6">
              {['About', 'Services', 'Gallery', 'Location'].map((item) => (
                <a 
                  key={item} 
                  href={`#${item.toLowerCase()}`} 
                  onClick={(e) => {
                    e.preventDefault();
                    const target = document.getElementById(item.toLowerCase());
                    if (target) {
                      target.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className="text-xs xl:text-sm font-medium text-neutral-400 hover:text-amber-400 transition-colors tracking-wide uppercase whitespace-nowrap"
                >
                  {t.nav[item.toLowerCase() as keyof typeof t.nav]}
                </a>
              ))}
              
              <button 
                onClick={() => setLang(lang === 'en' ? 'pl' : 'en')}
                className="flex items-center gap-1.5 text-xs xl:text-sm font-medium text-neutral-400 hover:text-amber-400 transition-colors tracking-wide uppercase whitespace-nowrap"
              >
                <Globe className="h-4 w-4" />
                {lang === 'en' ? 'PL' : 'EN'}
              </button>

              <button 
                onClick={(e) => {
                  e.preventDefault();
                  setIsOrderModalOpen(true);
                }}
                className="bg-amber-500 text-neutral-950 px-4 xl:px-6 py-2.5 rounded-2xl font-bold flex items-center justify-center hover:bg-amber-400 transition-colors whitespace-nowrap text-xs xl:text-sm tracking-wide"
              >
                {t.order.orderOnline}
              </button>

              <button 
                onClick={(e) => {
                  e.preventDefault();
                  setIsCallModalOpen(true);
                }}
                className="bg-white text-neutral-950 px-4 xl:px-6 py-2.5 rounded-2xl font-bold flex items-center justify-center hover:bg-neutral-100 transition-colors whitespace-nowrap text-xs xl:text-sm tracking-wide"
              >
                {t.nav.callNow}
              </button>

              <button 
                onClick={() => { setReservationLocation(''); setIsReservationModalOpen(true); }}
                className="bg-neutral-800 text-white px-4 xl:px-6 py-2.5 rounded-2xl font-bold flex items-center justify-center hover:bg-neutral-700 transition-colors border border-white/10 whitespace-nowrap text-xs xl:text-sm tracking-wide"
              >
                {t.nav.reservation}
              </button>
              <a 
                href="https://www.instagram.com/hamsagrillwarsaw/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-orange-500 hover:text-orange-400 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-[38px] w-[38px] xl:h-[42px] xl:w-[42px]" />
              </a>
            </div>
            <div className="lg:hidden flex items-center">
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-neutral-300 hover:text-white transition-colors"
                aria-label="Toggle Menu"
              >
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="lg:hidden bg-neutral-950 border-b border-white/10 overflow-hidden absolute w-full left-0 top-full"
            >
              <div className="px-4 py-6 flex flex-col space-y-4">
                {['About', 'Services', 'Gallery', 'Location'].map((item) => (
                  <a
                    key={item}
                    href={`#${item.toLowerCase()}`}
                    onClick={(e) => {
                      e.preventDefault();
                      setIsMobileMenuOpen(false);
                      const target = document.getElementById(item.toLowerCase());
                      if (target) {
                        // Small delay ensures the menu closing animation doesn't glitch the scroll calculation
                        setTimeout(() => target.scrollIntoView({ behavior: 'smooth' }), 50);
                      }
                    }}
                    className="text-lg font-medium text-neutral-400 hover:text-amber-400 transition-colors uppercase tracking-wide"
                  >
                    {t.nav[item.toLowerCase() as keyof typeof t.nav]}
                  </a>
                ))}
                
                <div className="relative flex items-center justify-center py-4 border-t border-white/10">
                  <div className="flex items-center gap-4">
                    <Globe className="h-5 w-5 text-amber-500" />
                    <button onClick={() => { setLang('pl'); setIsMobileMenuOpen(false); }} className={`font-medium transition-colors ${lang === 'pl' ? 'text-amber-500' : 'text-neutral-400 hover:text-white'}`}>PL</button>
                    <span className="text-neutral-600">|</span>
                    <button onClick={() => { setLang('en'); setIsMobileMenuOpen(false); }} className={`font-medium transition-colors ${lang === 'en' ? 'text-amber-500' : 'text-neutral-400 hover:text-white'}`}>EN</button>
                  </div>
                  <a href="https://www.instagram.com/hamsagrillwarsaw/" target="_blank" rel="noopener noreferrer" className="absolute right-4 text-orange-500 hover:text-orange-400 transition-colors" aria-label="Instagram">
                    <Instagram className="h-6 w-6" />
                  </a>
                </div>

                <div className="flex flex-col gap-3 pb-2">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      setIsMobileMenuOpen(false);
                      setTimeout(() => setIsOrderModalOpen(true), 50);
                    }}
                    className="w-full bg-amber-500 text-neutral-950 py-3.5 px-4 rounded-2xl font-bold flex items-center justify-center hover:bg-amber-400 transition-colors tracking-wide text-sm text-center"
                  >
                    {t.order.orderOnline}
                  </button>

                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      setIsMobileMenuOpen(false);
                      setTimeout(() => setIsCallModalOpen(true), 50);
                    }}
                    className="w-full bg-white text-neutral-950 py-3.5 px-4 rounded-2xl font-bold flex items-center justify-center hover:bg-neutral-100 transition-colors tracking-wide text-sm text-center"
                  >
                    {t.nav.callNow}
                  </button>

                  <button 
                    onClick={() => { setReservationLocation(''); setIsReservationModalOpen(true); setIsMobileMenuOpen(false); }}
                    className="w-full bg-neutral-800 text-white py-3.5 px-4 rounded-2xl font-bold flex items-center justify-center hover:bg-neutral-700 transition-colors border border-white/10 tracking-wide text-sm text-center"
                  >
                    {t.nav.reservation}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* About Section - Asymmetrical Layout */}
      <section id="about" className="pt-40 pb-8 relative z-10 overflow-hidden">
        <div className="absolute top-1/2 left-0 w-full h-[1px] bg-white/5" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="bg-neutral-800 backdrop-blur-2xl rounded-[3rem] shadow-2xl shadow-black/50 border border-white/5 p-8 md:p-16 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-[100px] pointer-events-none" />
            
            <motion.div 
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
              className="relative z-20 mb-16 flex flex-col items-center text-center"
            >
              <motion.div variants={fadeUp} className="flex items-center justify-center gap-4 mb-6">
                <div className="h-[1px] w-8 bg-amber-500" />
                <span className="text-amber-500 font-medium tracking-[0.2em] uppercase text-sm">{t.about.story}</span>
                <div className="h-[1px] w-8 bg-amber-500" />
              </motion.div>
              <motion.h2 variants={fadeUp} className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold text-white leading-tight whitespace-normal md:whitespace-nowrap">
                <span>{t.about.title1}</span> <br />
                <span className="italic text-neutral-500">{t.about.title2}</span>
              </motion.h2>
            </motion.div>

            <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-start relative z-10">
              <motion.div 
                initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
              className="relative z-20 h-full lg:h-[500px] flex flex-col"
            >
              <div className="text-neutral-300 text-sm md:text-base leading-relaxed flex flex-col justify-between gap-6 lg:gap-0 py-2 h-full w-full">
                <AnimatePresence>
                  {t.about.description.map((paragraph, idx) => (
                    <motion.p key={idx} variants={fadeUp}>
                      {paragraph}
                    </motion.p>
                  ))}
                </AnimatePresence>
              </div>
            </motion.div>
            
            <div className="relative w-full flex flex-col">
              <div className="relative w-full h-[500px] rounded-3xl overflow-hidden border border-white/10 shadow-2xl z-10 group">
                <AnimatePresence mode="wait">
                  <motion.img 
                    key={currentSpaceImgIndex}
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    src={spaceImages[currentSpaceImgIndex]}
                    alt={`Space image ${currentSpaceImgIndex + 1}`}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 cursor-pointer"
                    onClick={() => setSelectedSpaceImg(spaceImages[currentSpaceImgIndex])}
                  />
                </AnimatePresence>
                <div className="absolute inset-0 bg-neutral-950/20 pointer-events-none" />
                
                {/* Carousel Controls */}
                <button 
                  onClick={() => setCurrentSpaceImgIndex((prev) => (prev > 0 ? prev - 1 : spaceImages.length - 1))}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/50 hover:bg-amber-500 rounded-full flex items-center justify-center text-white transition-colors backdrop-blur-sm z-20"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button 
                  onClick={() => setCurrentSpaceImgIndex((prev) => (prev < spaceImages.length - 1 ? prev + 1 : 0))}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/50 hover:bg-amber-500 rounded-full flex items-center justify-center text-white transition-colors backdrop-blur-sm z-20"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
                
                {/* Indicators */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                  {spaceImages.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentSpaceImgIndex(idx)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        idx === currentSpaceImgIndex ? 'bg-amber-500 w-6' : 'bg-white/50 hover:bg-white'
                      }`}
                    />
                  ))}
                </div>
              </div>
              </div>
            </div>

            <motion.div 
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-16 relative z-10"
            >
              {t.about.features.map((feature, idx) => (
                <motion.div key={idx} variants={fadeUp} className="flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-white font-medium">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                    {feature.title}
                  </div>
                  <span className="text-sm text-neutral-500 pl-3.5">{feature.desc}</span>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services / Menu Section */}
      <section id="services" className="py-8 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-neutral-800 backdrop-blur-2xl rounded-[3rem] shadow-2xl shadow-black/50 border border-white/5 p-8 md:p-16 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-[100px] pointer-events-none" />
            <div className="relative z-10">
              <motion.div 
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-100px" }}
                variants={staggerContainer}
                className="mb-16 text-center flex flex-col items-center"
              >
                <div className="max-w-3xl flex flex-col items-center text-center">
                  <motion.div variants={fadeUp} className="flex items-center justify-center gap-4 mb-4">
                    <div className="h-[1px] w-8 bg-amber-500" />
                    <span className="text-amber-500 font-medium tracking-[0.2em] uppercase text-sm">{t.services.specialties}</span>
                    <div className="h-[1px] w-8 bg-amber-500" />
                  </motion.div>
                  <motion.h2 variants={fadeUp} className="text-4xl sm:text-5xl md:text-5xl lg:text-6xl font-serif font-bold text-white mb-6 flex flex-col sm:flex-row justify-center items-center gap-y-1 sm:gap-y-0 sm:gap-x-3">
                    <span className="text-center">{t.services.title1}</span> 
                    <span className="italic text-neutral-500 text-center">{t.services.title2}</span>
                  </motion.h2>
                  <motion.p variants={fadeUp} className="text-neutral-400 max-w-xl text-lg text-center">
                    {t.services.description}
                  </motion.p>
                </div>
              </motion.div>

          <div className="grid md:grid-cols-12 gap-6">
            {/* Large Feature Card */}
            <motion.div 
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              variants={scaleIn}
              className="md:col-span-8 group relative rounded-3xl overflow-hidden bg-neutral-900 border border-white/5 min-h-[400px] md:min-h-[500px]"
            >
              <img 
                src="/Żeberka jagnięce.jpg" 
                alt="Premium Grilled Meat" 
                className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent" />
              <div className="absolute inset-0 p-8 md:p-12 flex flex-col justify-between md:justify-end">
                <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-amber-500/20 backdrop-blur-md flex items-center justify-center mb-6 border border-amber-500/30">
                  <Utensils className="h-5 w-5 md:h-6 md:w-6 text-amber-400" />
                </div>
                <div>
                  <h3 className="text-xl lg:text-4xl font-serif font-bold text-white mb-2 lg:mb-4">{t.services.meatTitle}</h3>
                  <p className="text-neutral-300 text-sm lg:text-lg max-w-md leading-relaxed">
                    {t.services.meatDesc}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Stacked Cards */}
            <div className="md:col-span-4 flex flex-col gap-6">
              <motion.div 
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                variants={scaleIn}
                className="group relative rounded-3xl overflow-hidden bg-neutral-900 border border-white/5 flex-1 min-h-[320px] p-8 hover:border-amber-500/30 transition-colors duration-500"
              >
                <img 
                  src="/Kanapka Kebab.jpg" 
                  alt="Signature Kebab" 
                  className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent" />
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl group-hover:bg-amber-500/20 transition-colors duration-500" />
                <div className="relative z-10 h-full flex flex-col justify-between">
                  <div className="w-12 h-12 rounded-xl bg-amber-500/20 backdrop-blur-md border border-amber-500/30 flex items-center justify-center mb-6">
                    <ChefHat className="h-5 w-5 text-amber-400" />
                  </div>
                  <div>
                    <h3 className="text-xl lg:text-2xl font-serif font-bold text-white mb-2 lg:mb-3">{t.services.kebabTitle}</h3>
                    <p className="text-neutral-300 text-sm lg:text-base">
                      {t.services.kebabDesc}
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.div 
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                variants={scaleIn}
                className="group relative rounded-3xl overflow-hidden bg-neutral-900 border border-white/5 flex-1 min-h-[320px] p-8 hover:border-orange-500/30 transition-colors duration-500"
              >
                <img 
                  src="https://restaumatic-production.imgix.net/uploads/accounts/23439/media_library/a9584d36-20fd-41e7-a2c1-afb08dee195d.jpg?auto=compress%2Cformat&blur=0&crop=focalpoint&fit=max&fp-x=0.5&fp-y=0.5&h=auto&rect=0%2C0%2C2000%2C1154&w=1920" 
                  alt="Authentic Falafel" 
                  className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-orange-500/10 rounded-full blur-3xl group-hover:bg-orange-500/20 transition-colors duration-500" />
                <div className="relative z-10 h-full flex flex-col justify-between">
                  <div className="w-12 h-12 rounded-xl bg-orange-500/20 backdrop-blur-md border border-orange-500/30 flex items-center justify-center mb-6">
                    <Star className="h-5 w-5 text-orange-400" />
                  </div>
                  <div>
                    <h3 className="text-xl lg:text-2xl font-serif font-bold text-white mb-2 lg:mb-3">{t.services.falafelTitle}</h3>
                    <p className="text-neutral-300 text-sm lg:text-base">
                      {t.services.falafelDesc}
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
            {/* Breakfast */}
            <motion.div 
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              variants={scaleIn}
              className="group relative rounded-3xl overflow-hidden bg-neutral-900 border border-white/5 p-8 hover:border-amber-500/30 transition-colors duration-500 min-h-[320px] flex flex-col justify-end"
            >
              <img 
                src="/Shakshuka.jpg" 
                alt="Traditional Breakfast" 
                className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent" />
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl group-hover:bg-amber-500/20 transition-colors duration-500" />
              <div className="relative z-10 h-full flex flex-col justify-between">
                <div className="w-12 h-12 rounded-xl bg-amber-500/20 backdrop-blur-md border border-amber-500/30 flex items-center justify-center mb-6">
                  <Coffee className="h-5 w-5 text-amber-400" />
                </div>
                <div>
                  <h3 className="text-xl font-serif font-bold text-white mb-2">{t.services.breakfastTitle}</h3>
                  <p className="text-neutral-300 text-sm">
                    {t.services.breakfastDesc}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Appetizers */}
            <motion.div 
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              variants={scaleIn}
              className="group relative rounded-3xl overflow-hidden bg-neutral-900 border border-white/5 p-8 hover:border-orange-500/30 transition-colors duration-500 min-h-[320px] flex flex-col justify-end"
            >
              <img 
                src="/Hummus.jpg" 
                alt="Meze & Appetizers" 
                className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent" />
              <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-3xl group-hover:bg-orange-500/20 transition-colors duration-500" />
              <div className="relative z-10 h-full flex flex-col justify-between">
                <div className="w-12 h-12 rounded-xl bg-orange-500/20 backdrop-blur-md border border-orange-500/30 flex items-center justify-center mb-6">
                  <Salad className="h-5 w-5 text-orange-400" />
                </div>
                <div>
                  <h3 className="text-xl font-serif font-bold text-white mb-2">{t.services.appetizersTitle}</h3>
                  <p className="text-neutral-300 text-sm">
                    {t.services.appetizersDesc}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Pide */}
            <motion.div 
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              variants={scaleIn}
              className="group relative rounded-3xl overflow-hidden bg-neutral-900 border border-white/5 p-8 hover:border-amber-500/30 transition-colors duration-500 min-h-[320px] flex flex-col justify-end"
            >
              <img 
                src="/Pide z salami.jpg" 
                alt="Pide (Turkish Pizza)" 
                className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent" />
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl group-hover:bg-amber-500/20 transition-colors duration-500" />
              <div className="relative z-10 h-full flex flex-col justify-between">
                <div className="w-12 h-12 rounded-xl bg-amber-500/20 backdrop-blur-md border border-amber-500/30 flex items-center justify-center mb-6">
                  <Pizza className="h-5 w-5 text-amber-400" />
                </div>
                <div>
                  <h3 className="text-xl font-serif font-bold text-white mb-2">{t.services.pideTitle}</h3>
                  <p className="text-neutral-300 text-sm">
                    {t.services.pideDesc}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Desserts */}
            <motion.div 
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              variants={scaleIn}
              className="group relative rounded-3xl overflow-hidden bg-neutral-900 border border-white/5 p-8 hover:border-orange-500/30 transition-colors duration-500 min-h-[320px] flex flex-col justify-end"
            >
              <img 
                src="/Baklawa czekoladowa.jpg" 
                alt="Sweet Desserts" 
                className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent" />
              <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-3xl group-hover:bg-orange-500/20 transition-colors duration-500" />
              <div className="relative z-10 h-full flex flex-col justify-between">
                <div className="w-12 h-12 rounded-xl bg-orange-500/20 backdrop-blur-md border border-orange-500/30 flex items-center justify-center mb-6">
                  <Cake className="h-5 w-5 text-orange-400" />
                </div>
                <div>
                  <h3 className="text-xl font-serif font-bold text-white mb-2">{t.services.dessertsTitle}</h3>
                  <p className="text-neutral-300 text-sm">
                    {t.services.dessertsDesc}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section id="gallery" className="py-8 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-neutral-800 backdrop-blur-2xl rounded-[3rem] shadow-2xl shadow-black/50 border border-white/5 p-8 md:p-16 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-[100px] pointer-events-none" />
            <div className="relative z-10">
              <motion.div 
                initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="mb-16 text-center flex flex-col items-center"
          >
            <motion.div variants={fadeUp} className="flex items-center gap-4 mb-4">
              <div className="h-[1px] w-8 bg-amber-500" />
              <span className="text-amber-500 font-medium tracking-[0.2em] uppercase text-sm">{t.gallery.subtitle}</span>
              <div className="h-[1px] w-8 bg-amber-500" />
            </motion.div>
            <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl font-serif font-bold text-white flex flex-col sm:flex-row justify-center items-center gap-y-1 sm:gap-y-0 sm:gap-x-3">
              <span className="text-center">{t.gallery.title1}</span> 
              <span className="italic text-neutral-500 text-center">{t.gallery.title2}</span>
            </motion.h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              "/gallery (1).jpg",
              "/gallery (2).jpg",
              "/gallery (3).jpg",
              "/gallery (4).jpg",
              "/gallery (5).jpg",
              "/gallery (6).jpg",
              "/gallery (7).jpg",
              "/gallery (8).jpg",
              "/gallery (9).jpg",
              "/gallery (10).jpg",
              "/gallery (11).jpg",
              "/gallery (12).jpg"
            ].map((src, idx) => (
              <motion.div 
                key={idx}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                variants={scaleIn}
                className="group relative rounded-3xl overflow-hidden bg-neutral-900 border border-white/5 aspect-square"
              >
                <img 
                  src={src} 
                  alt={`Gallery image ${idx + 1}`} 
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-all duration-700"
                  referrerPolicy="no-referrer"
                />
              </motion.div>
            ))}
          </div>
            </div>
          </div>
        </div>
      </section>

      {/* Location & Contact - Glassmorphism */}
      <section id="location" className="py-8 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-neutral-800 backdrop-blur-2xl rounded-[3rem] shadow-2xl shadow-black/50 border border-white/5 p-8 md:p-16 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-[100px] pointer-events-none" />
            
            <div className="max-w-4xl mx-auto relative z-10">
              <motion.div 
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                variants={staggerContainer}
              >
                <div className="flex flex-col items-center text-center">
                  <motion.div variants={fadeUp} className="flex items-center gap-4 mb-4">
                    <div className="h-[1px] w-8 bg-amber-500" />
                    <span className="text-amber-500 font-medium tracking-[0.2em] uppercase text-sm">{t.location.subtitle}</span>
                    <div className="h-[1px] w-8 bg-amber-500" />
                  </motion.div>
                  <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl font-serif font-bold text-white mb-6">
                    {t.location.visitUs}
                  </motion.h2>
                  <motion.p variants={fadeUp} className="text-neutral-400 text-lg mb-12 max-w-xl">
                    {t.location.description}
                  </motion.p>
                </div>

                <div className="space-y-16">
                  {/* Ochota Segment */}
                  <motion.div variants={fadeUp} className="flex flex-col gap-8">
                    <div className="grid sm:grid-cols-2 gap-8 relative z-10">
                      
                      {/* Address */}
                      <div className="flex items-start gap-6 group">
                        <div className="w-12 h-12 rounded-full bg-neutral-800 flex items-center justify-center flex-shrink-0 group-hover:bg-amber-500/20 group-hover:text-amber-400 transition-colors">
                          <MapPin className="h-5 w-5" />
                        </div>
                        <div>
                          <h4 className="text-white font-medium text-lg mb-2">Hamsa Grill Restaurant - {t.order.ochota}</h4>
                          <p className="text-neutral-400 leading-relaxed">
                            {t.order.ochotaAddress.split(',')[0]}<br />
                            {t.order.ochotaAddress.split(',')[1].trim()}<br />
                            {t.order.country}
                          </p>
                          <a 
                            href="https://maps.app.goo.gl/WEbA3kEZM2SJbvtp9" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-amber-500 mt-3 text-sm font-medium hover:text-amber-400 transition-colors"
                          >
                            {t.location.getDirections} <ArrowRight className="h-4 w-4" />
                          </a>
                        </div>
                      </div>

                      {/* Opening Hours */}
                      <div className="flex items-start gap-6 group">
                        <div className="w-12 h-12 rounded-full bg-neutral-800 flex items-center justify-center flex-shrink-0 group-hover:bg-amber-500/20 group-hover:text-amber-400 transition-colors">
                          <Clock className="h-5 w-5" />
                        </div>
                        <div className="w-full">
                          <h4 className="text-white font-medium text-lg mb-4">{t.location.openingHours}</h4>
                          <div className="flex flex-col text-neutral-400 gap-4 sm:gap-2">
                            <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-1 sm:gap-0">
                              <span>{t.location.monSat}</span>
                              <span className="text-white font-medium">{t.location.monSatHours}</span>
                            </div>
                            <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-1 sm:gap-0">
                              <span>{t.location.sunday}</span>
                              <span className="text-white font-medium">{t.location.sundayHours}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                    </div>
                    {/* Rectangle for Ochota */}
                    <div className="bg-gradient-to-br from-amber-500 to-orange-600 p-1 rounded-3xl w-full">
                      <div className="bg-neutral-950 rounded-[22px] p-6 lg:p-8 flex flex-col gap-6 items-center text-center">
                        <div className="flex flex-col gap-2">
                          <h4 className="text-white font-serif text-2xl font-bold">{t.location.readyToOrder}</h4>
                          <p className="text-neutral-400 text-sm">{t.order.ochota} - {t.order.ochotaAddress}</p>
                        </div>
                        <div className="flex w-full flex-col sm:flex-row gap-4">
                          <a href="https://hamsagrillrestaurant.goorder.pl/" target="_blank" rel="noopener noreferrer" className="flex-1 bg-amber-500 text-neutral-950 py-4 px-4 rounded-2xl font-bold flex items-center justify-center hover:bg-amber-400 transition-colors text-sm text-center">
                            {t.order.orderOnline}
                          </a>
                          <a href="tel:+48570706701" className="flex-1 bg-white text-neutral-950 py-3 px-4 rounded-2xl font-bold flex flex-col items-center justify-center hover:bg-neutral-100 transition-colors text-sm text-center">
                            <span>{t.nav.callNow}</span>
                            <span className="text-xs font-medium text-neutral-600 mt-0.5">+48 570 706 701</span>
                          </a>
                          <button onClick={() => { setReservationLocation(t.reservationForm.locationOchota); setIsReservationModalOpen(true); }} className="flex-1 bg-neutral-800 text-white py-4 px-4 rounded-2xl font-bold flex items-center justify-center hover:bg-neutral-700 transition-colors border border-white/10 text-sm text-center line-clamp-1">
                            {t.nav.reservation}
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  {/* Spacer Line */}
                  <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>

                  {/* Mokotow Segment */}
                  <motion.div variants={fadeUp} className="flex flex-col gap-8">
                    <div className="grid sm:grid-cols-2 gap-8 relative z-10">
                      
                      {/* Address */}
                      <div className="flex items-start gap-6 group">
                        <div className="w-12 h-12 rounded-full bg-neutral-800 flex items-center justify-center flex-shrink-0 group-hover:bg-amber-500/20 group-hover:text-amber-400 transition-colors">
                          <MapPin className="h-5 w-5" />
                        </div>
                        <div>
                          <h4 className="text-white font-medium text-lg mb-2">Hamsa Grill - {t.order.mokotow}</h4>
                          <p className="text-neutral-400 leading-relaxed">
                            {t.order.mokotowAddress.split(',')[0]}<br />
                            {t.order.mokotowAddress.split(',')[1].trim()}<br />
                            {t.order.country}
                          </p>
                          <a 
                            href="https://maps.app.goo.gl/WWu88f5Caz8WtwfCA" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-amber-500 mt-3 text-sm font-medium hover:text-amber-400 transition-colors"
                          >
                            {t.location.getDirections} <ArrowRight className="h-4 w-4" />
                          </a>
                        </div>
                      </div>

                      {/* Opening Hours */}
                      <div className="flex items-start gap-6 group">
                        <div className="w-12 h-12 rounded-full bg-neutral-800 flex items-center justify-center flex-shrink-0 group-hover:bg-amber-500/20 group-hover:text-amber-400 transition-colors">
                          <Clock className="h-5 w-5" />
                        </div>
                        <div className="w-full">
                          <h4 className="text-white font-medium text-lg mb-4">{t.location.openingHours}</h4>
                          <div className="flex flex-col text-neutral-400 gap-4 sm:gap-2">
                            <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-1 sm:gap-0">
                              <span>{t.location.monSat}</span>
                              <span className="text-white font-medium">{t.location.monSatHours}</span>
                            </div>
                            <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-1 sm:gap-0">
                              <span>{t.location.sunday}</span>
                              <span className="text-white font-medium">{t.location.sundayHours}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                    </div>
                    {/* Rectangle for Mokotow */}
                    <div className="bg-gradient-to-br from-amber-500 to-orange-600 p-1 rounded-3xl w-full">
                      <div className="bg-neutral-950 rounded-[22px] p-6 lg:p-8 flex flex-col gap-6 items-center text-center">
                        <div className="flex flex-col gap-2">
                          <h4 className="text-white font-serif text-2xl font-bold">{t.location.readyToOrder}</h4>
                          <p className="text-neutral-400 text-sm">{t.order.mokotow} - {t.order.mokotowAddress}</p>
                        </div>
                        <div className="flex w-full flex-col sm:flex-row gap-4">
                          <a href="https://www.hamsagrill.pl/restauracja/hamsa-grill" target="_blank" rel="noopener noreferrer" className="flex-1 bg-amber-500 text-neutral-950 py-4 px-4 rounded-2xl font-bold flex items-center justify-center hover:bg-amber-400 transition-colors text-sm text-center">
                            {t.order.orderOnline}
                          </a>
                          <a href="tel:+48224156789" className="flex-1 bg-white text-neutral-950 py-3 px-4 rounded-2xl font-bold flex flex-col items-center justify-center hover:bg-neutral-100 transition-colors text-sm text-center">
                            <span>{t.nav.callNow}</span>
                            <span className="text-xs font-medium text-neutral-600 mt-0.5">+48 22 41 56789</span>
                          </a>
                          <button onClick={() => { setReservationLocation(t.reservationForm.locationMokotow); setIsReservationModalOpen(true); }} className="flex-1 bg-neutral-800 text-white py-4 px-4 rounded-2xl font-bold flex items-center justify-center hover:bg-neutral-700 transition-colors border border-white/10 text-sm text-center line-clamp-1">
                            {t.nav.reservation}
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>






      {/* Instagram Section */}
      <section className="pt-8 pb-16 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-neutral-800 backdrop-blur-2xl rounded-[3rem] shadow-2xl shadow-black/50 border border-white/5 p-8 md:p-16 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-[100px] pointer-events-none" />
            <div className="relative z-10 text-center">
              <motion.div 
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-100px" }}
                variants={staggerContainer}
                className="flex flex-col items-center"
              >
                <motion.div variants={fadeUp} className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-amber-500 to-orange-600 p-[2px] mb-6">
                  <div className="w-full h-full bg-neutral-900 rounded-[22px] flex items-center justify-center">
                    <Instagram className="h-8 w-8 text-amber-500" />
                  </div>
                </motion.div>
                <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl font-serif font-bold text-white mb-4 flex flex-col sm:flex-row justify-center items-center gap-y-1 sm:gap-y-0 sm:gap-x-3">
                  <span className="text-center">{t.instagram.title}</span> 
                  <span className="italic text-neutral-500 text-center">{t.instagram.subtitle}</span>
                </motion.h2>
                <motion.p variants={fadeUp} className="text-neutral-400 max-w-2xl mx-auto text-lg mb-10">
                  {t.instagram.description}
                </motion.p>
                <motion.a 
                  variants={fadeUp} 
                  href="https://www.instagram.com/hamsagrillwarsaw/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-medium text-white border border-amber-500/50 hover:bg-amber-500 hover:text-neutral-950 transition-all duration-300"
                >
                  <Instagram className="h-5 w-5" /> {t.instagram.followBtn}
                </motion.a>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Space Image Modal */}
      <AnimatePresence>
        {selectedSpaceImg && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedSpaceImg(null)}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-neutral-950/90 backdrop-blur-sm cursor-zoom-out"
          >
            <motion.img
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              src={selectedSpaceImg}
              alt="Enlarged view"
              className="max-w-[90vw] max-h-[90vh] object-contain rounded-2xl shadow-2xl"
              onClick={(e: React.MouseEvent) => e.stopPropagation()}
            />
            
            {/* Modal Carousel Controls */}
            <button 
              onClick={(e: React.MouseEvent) => {
                e.stopPropagation();
                const currentIndex = spaceImages.indexOf(selectedSpaceImg);
                if (currentIndex > -1) {
                  const newIndex = currentIndex > 0 ? currentIndex - 1 : spaceImages.length - 1;
                  setSelectedSpaceImg(spaceImages[newIndex]);
                }
              }}
              className="absolute left-6 md:left-12 top-1/2 -translate-y-1/2 w-12 h-12 md:w-16 md:h-16 bg-black/50 hover:bg-amber-500 rounded-full flex items-center justify-center text-white transition-colors backdrop-blur-sm z-50 cursor-pointer"
            >
              <ChevronLeft className="h-6 w-6 md:h-8 md:w-8" />
            </button>
            <button 
              onClick={(e: React.MouseEvent) => {
                e.stopPropagation();
                const currentIndex = spaceImages.indexOf(selectedSpaceImg);
                if (currentIndex > -1) {
                  const newIndex = currentIndex < spaceImages.length - 1 ? currentIndex + 1 : 0;
                  setSelectedSpaceImg(spaceImages[newIndex]);
                }
              }}
              className="absolute right-6 md:right-12 top-1/2 -translate-y-1/2 w-12 h-12 md:w-16 md:h-16 bg-black/50 hover:bg-amber-500 rounded-full flex items-center justify-center text-white transition-colors backdrop-blur-sm z-50 cursor-pointer"
            >
              <ChevronRight className="h-6 w-6 md:h-8 md:w-8" />
            </button>

            <button
              onClick={() => setSelectedSpaceImg(null)}
              className="absolute top-6 right-6 text-white/70 hover:text-white bg-black/50 hover:bg-amber-500 p-3 rounded-full transition-colors z-50 cursor-pointer"
            >
              <X className="h-6 w-6" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Order Online Popup Modal */}
      <AnimatePresence>
        {isOrderModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-neutral-950/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-neutral-900 border border-white/10 rounded-3xl p-6 md:p-8 w-full max-w-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
              
              <button
                onClick={() => setIsOrderModalOpen(false)}
                className="absolute top-3 right-3 text-neutral-400 hover:text-white transition-colors z-20 bg-neutral-800/50 p-2 rounded-full"
              >
                <X className="h-5 w-5" />
              </button>

              <h3 className="text-2xl font-serif font-bold text-white mb-6 text-center relative z-10">
                {t.order.selectLocation}
              </h3>

              <div className="grid sm:grid-cols-2 gap-4 relative z-10">
                <div className="group rounded-2xl overflow-hidden bg-neutral-950/50 border border-white/5 p-6 hover:border-amber-500/30 transition-colors flex flex-col items-center text-center">
                  <div className="w-12 h-12 rounded-xl bg-neutral-800 flex items-center justify-center mb-4 border border-white/5 group-hover:border-amber-500/30 transition-colors">
                    <MapPin className="h-6 w-6 text-amber-400" />
                  </div>
                  <h4 className="text-xl font-serif font-bold text-white mb-2">{t.order.ochota}</h4>
                  <p className="text-neutral-400 text-xs mb-6 px-4">
                    {t.order.ochotaAddress.split(',')[0]}<br />
                    {t.order.ochotaAddress.split(',')[1].trim()}<br />
                    <span className="block mt-1 text-neutral-500">(pick-up, dine in)</span>
                  </p>
                  <a href="https://hamsagrillrestaurant.goorder.pl/" target="_blank" rel="noopener noreferrer" className="w-full mt-auto py-3 rounded-full font-medium text-white border border-amber-500/50 hover:bg-amber-500 hover:text-neutral-950 transition-all text-sm flex items-center justify-center gap-2">
                    {t.order.orderOnline} <ArrowRight className="h-4 w-4" />
                  </a>
                </div>

                <div className="group rounded-2xl overflow-hidden bg-neutral-950/50 border border-white/5 p-6 hover:border-orange-500/30 transition-colors flex flex-col items-center text-center">
                  <div className="w-12 h-12 rounded-xl bg-neutral-800 flex items-center justify-center mb-4 border border-white/5 group-hover:border-orange-500/30 transition-colors">
                    <MapPin className="h-6 w-6 text-orange-400" />
                  </div>
                  <h4 className="text-xl font-serif font-bold text-white mb-2">{t.order.mokotow}</h4>
                  <p className="text-neutral-400 text-xs mb-6 px-4">
                    {t.order.mokotowAddress.split(',')[0]}<br />
                    {t.order.mokotowAddress.split(',')[1].trim()}<br />
                    <span className="block mt-1 text-neutral-500">(pick-up, delivery)</span>
                  </p>
                  <a href="https://www.hamsagrill.pl/restauracja/hamsa-grill" target="_blank" rel="noopener noreferrer" className="w-full mt-auto py-3 rounded-full font-medium text-white border border-orange-500/50 hover:bg-orange-500 hover:text-neutral-950 transition-all text-sm flex items-center justify-center gap-2">
                    {t.order.orderOnline} <ArrowRight className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Call Now Popup Modal */}
      <AnimatePresence>
        {isCallModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-neutral-950/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-neutral-900 border border-white/10 rounded-3xl p-6 md:p-8 w-full max-w-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
              
              <button
                onClick={() => setIsCallModalOpen(false)}
                className="absolute top-3 right-3 text-neutral-400 hover:text-white transition-colors z-20 bg-neutral-800/50 p-2 rounded-full"
              >
                <X className="h-5 w-5" />
              </button>

              <h3 className="text-2xl font-serif font-bold text-white mb-6 text-center relative z-10">
                {t.order.selectLocation}
              </h3>

              <div className="grid sm:grid-cols-2 gap-4 relative z-10">
                <div className="group rounded-2xl overflow-hidden bg-neutral-950/50 border border-white/5 p-6 hover:border-amber-500/30 transition-colors flex flex-col items-center text-center">
                  <div className="w-12 h-12 rounded-xl bg-neutral-800 flex items-center justify-center mb-4 border border-white/5 group-hover:border-amber-500/30 transition-colors">
                    <MapPin className="h-6 w-6 text-amber-400" />
                  </div>
                  <h4 className="text-xl font-serif font-bold text-white mb-2">{t.order.ochota}</h4>
                  <p className="text-neutral-400 text-xs mb-6 px-4">
                    {t.order.ochotaAddress.split(',')[0]}<br />
                    {t.order.ochotaAddress.split(',')[1].trim()}<br />
                    <span className="block mt-1 text-neutral-500">(pick-up, dine in)</span>
                  </p>
                  <a href="tel:+48570706701" className="w-full mt-auto py-3 rounded-full font-bold text-neutral-950 bg-white hover:bg-neutral-100 transition-all text-sm flex flex-col items-center justify-center">
                    <span>{t.order.callNow}</span>
                    <span className="text-xs font-medium text-neutral-600 mt-0.5">+48 570 706 701</span>
                  </a>
                </div>

                <div className="group rounded-2xl overflow-hidden bg-neutral-950/50 border border-white/5 p-6 hover:border-orange-500/30 transition-colors flex flex-col items-center text-center">
                  <div className="w-12 h-12 rounded-xl bg-neutral-800 flex items-center justify-center mb-4 border border-white/5 group-hover:border-orange-500/30 transition-colors">
                    <MapPin className="h-6 w-6 text-orange-400" />
                  </div>
                  <h4 className="text-xl font-serif font-bold text-white mb-2">{t.order.mokotow}</h4>
                  <p className="text-neutral-400 text-xs mb-6 px-4">
                    {t.order.mokotowAddress.split(',')[0]}<br />
                    {t.order.mokotowAddress.split(',')[1].trim()}<br />
                    <span className="block mt-1 text-neutral-500">(pick-up, delivery)</span>
                  </p>
                  <a href="tel:+48224156789" className="w-full mt-auto py-3 rounded-full font-bold text-neutral-950 bg-white hover:bg-neutral-100 transition-all text-sm flex flex-col items-center justify-center">
                    <span>{t.order.callNow}</span>
                    <span className="text-xs font-medium text-neutral-600 mt-0.5">+48 22 41 56789</span>
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reservation Modal */}
      <AnimatePresence>
        {isReservationModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-neutral-950/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-neutral-900 border border-white/10 rounded-3xl p-6 md:p-8 w-full max-w-md relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
              
              <button
                onClick={() => setIsReservationModalOpen(false)}
                className="absolute top-4 right-4 text-neutral-400 hover:text-white transition-colors"
              >
                <X className="h-6 w-6" />
              </button>

              <h3 className="text-2xl font-serif font-bold text-white mb-6">
                {t.reservationForm.title}
              </h3>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  const location = formData.get('location');
                  const name = formData.get('name');
                  const phone = formData.get('phone');
                  const date = formData.get('date');
                  const hour = formData.get('hour');
                  const minute = formData.get('minute');
                  const time = `${hour}:${minute}`;
                  const guests = formData.get('guests');
                  const comments = formData.get('comments');
                  
                  let body = t.reservationForm.emailBody;
                  body = body.replace(/{location}/g, location as string);
                  body = body.replace(/{name}/g, name as string);
                  body = body.replace(/{phone}/g, phone as string);
                  body = body.replace(/{date}/g, date as string);
                  body = body.replace(/{time}/g, time as string);
                  body = body.replace(/{guests}/g, guests as string);
                  body = body.replace(/{comments}/g, (comments as string) || '-');

                  const mailtoLink = `mailto:kontakt@hamsagrill.com.pl?subject=${encodeURIComponent(t.reservationForm.emailSubject)}&body=${body}`;
                  window.location.href = mailtoLink;
                  setIsReservationModalOpen(false);
                }}
                className="space-y-4 relative z-10"
              >
                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-neutral-400 mb-1">
                    {t.reservationForm.location}
                  </label>
                  <select
                    id="location"
                    name="location"
                    required
                    value={reservationLocation}
                    onChange={(e) => setReservationLocation(e.target.value)}
                    className="w-full bg-neutral-950/50 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-amber-500/50 transition-colors appearance-none"
                  >
                    <option value="" disabled>{t.reservationForm.locationPlaceholder}</option>
                    <option value={t.reservationForm.locationOchota}>{t.reservationForm.locationOchota}</option>
                    <option value={t.reservationForm.locationMokotow}>{t.reservationForm.locationMokotow}</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-neutral-400 mb-1">
                    {t.reservationForm.name}
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    className="w-full bg-neutral-950/50 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-amber-500/50 transition-colors"
                  />
                </div>

                <div className="grid grid-cols-[3fr_2fr] sm:grid-cols-2 gap-4">
                  <div className="min-w-0">
                    <label htmlFor="phone" className="block text-sm font-medium text-neutral-400 mb-1 truncate">
                      {t.reservationForm.phone}
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      required
                      pattern="[\+]{0,1}[0-9\s\-]{9,15}"
                      title={lang === 'pl' ? "Wprowadź poprawny numer telefonu (np. +48 123 456 789)" : "Please enter a valid phone number (e.g., +48 123 456 789)"}
                      className="w-full bg-neutral-950/50 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-amber-500/50 transition-colors"
                    />
                  </div>
                  <div className="min-w-0">
                    <label htmlFor="guests" className="block text-sm font-medium text-neutral-400 mb-1 truncate">
                      {t.reservationForm.guests}*
                    </label>
                    <input
                      type="number"
                      id="guests"
                      name="guests"
                      min="1"
                      max={reservationLocation === t.reservationForm.locationMokotow ? 24 : 45}
                      required
                      className="w-full bg-neutral-950/50 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-amber-500/50 transition-colors"
                    />
                  </div>
                  <div className="min-w-0">
                    <label htmlFor="date" className="block text-sm font-medium text-neutral-400 mb-1 truncate">
                      {t.reservationForm.date}
                    </label>
                    <input
                      type="date"
                      id="date"
                      name="date"
                      required
                      min={todayStr}
                      value={reservationDate}
                      onChange={(e) => {
                        setReservationDate(e.target.value);
                        setReservationHour('');
                        setReservationMinute('');
                      }}
                      className="w-full min-w-0 bg-neutral-950/50 border border-white/10 rounded-xl px-2 sm:px-4 py-2 text-white focus:outline-none focus:border-amber-500/50 transition-colors [color-scheme:dark]"
                    />
                  </div>
                  <div className="min-w-0">
                    <label htmlFor="time" className="block text-sm font-medium text-neutral-400 mb-1 truncate">
                      {t.reservationForm.time}
                    </label>
                    <div className="flex gap-1 sm:gap-2 items-center min-w-0">
                      <select
                        name="hour"
                        required
                        value={reservationHour}
                        onChange={(e) => {
                          setReservationHour(e.target.value);
                          setReservationMinute(''); // Reset minute when hour changes to ensure validation
                        }}
                        className="flex-1 min-w-0 bg-neutral-950/50 border border-white/10 rounded-xl px-2 sm:px-4 py-2 text-sm sm:text-base text-white focus:outline-none focus:border-amber-500/50 transition-colors appearance-none"
                      >
                        <option value="" disabled>--</option>
                        {availableHours.map((h) => (
                          <option key={h} value={h}>{h}</option>
                        ))}
                      </select>
                      <span className="text-white font-bold flex-shrink-0">:</span>
                      <select
                        name="minute"
                        required
                        value={reservationMinute}
                        onChange={(e) => setReservationMinute(e.target.value)}
                        className="flex-1 min-w-0 bg-neutral-950/50 border border-white/10 rounded-xl px-2 sm:px-4 py-2 text-sm sm:text-base text-white focus:outline-none focus:border-amber-500/50 transition-colors appearance-none"
                      >
                        <option value="" disabled>--</option>
                        {availableMinutes.map((m) => (
                          <option key={m} value={m}>{m}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div>
                  <label htmlFor="comments" className="block text-sm font-medium text-neutral-400 mb-1">
                    {t.reservationForm.comments}
                  </label>
                  <textarea
                    id="comments"
                    name="comments"
                    rows={2}
                    className="w-full bg-neutral-950/50 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-amber-500/50 transition-colors resize-none"
                  />
                  <p className="text-[11px] sm:text-xs text-neutral-400 mt-2">
                    {t.reservationForm.serviceChargeNote}
                  </p>
                </div>

                <div className="pt-2 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setIsReservationModalOpen(false)}
                    className="flex-1 px-4 py-3 rounded-xl font-medium text-neutral-400 hover:text-white hover:bg-white/5 transition-colors"
                  >
                    {t.reservationForm.cancel}
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-3 bg-amber-500 text-neutral-950 rounded-xl font-medium hover:bg-amber-400 transition-colors"
                  >
                    {t.reservationForm.submit}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
    </>
  );
}
