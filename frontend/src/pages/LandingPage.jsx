import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, ShieldCheck, Users, CheckCircle, ArrowRight, Star, Phone, Mail, MapPin, Clock, Globe } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';

const LandingPage = () => {
  const navigate = useNavigate();
  const { t, language, toggleLanguage } = useLanguage();
  const isTa = language === 'ta';

  return (
    <div className="font-sans bg-gnanam-cream text-gray-900 overflow-x-hidden">
      {/* Header */}
      <header className="flex justify-between items-center gap-2 px-3 py-3 sm:px-6 sm:py-4 md:px-12 md:py-6 bg-white/90 backdrop-blur-md shadow-sm sticky top-0 z-50">
        <h1 className="font-extrabold text-gnanam-red flex items-center gap-1 sm:gap-2 min-w-0">
          <Heart size={20} className="text-gnanam-orange drop-shadow-md sm:w-8 sm:h-8 flex-shrink-0" fill="#CC5500" />
          <span className={`py-1 ${isTa ? 'text-xs sm:text-2xl' : 'text-sm sm:text-2xl pt-1.5'} leading-tight whitespace-normal break-words`}>{t('title')}</span>
        </h1>
        <div className="flex items-center gap-1 sm:gap-4 flex-shrink-0">
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-1.5 text-[10px] sm:text-sm font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg transition-colors border border-gray-200"
          >
            <Globe size={14} className="flex-shrink-0 text-gnanam-orange" />
            <span className="hidden sm:inline">{t('language')}</span>
            <span className="sm:hidden uppercase tracking-wider">{isTa ? 'EN' : 'TA'}</span>
          </button>
          <button
            onClick={() => navigate('/submit')}
            className="bg-gradient-to-r from-gnanam-red to-red-800 text-white px-2.5 py-1.5 sm:px-6 sm:py-2.5 md:px-8 md:py-3 rounded-full font-bold text-[10px] sm:text-base shadow-lg hover:shadow-red-900/50 hover:scale-105 active:scale-95 transition-all duration-300"
          >
            <span className="hidden sm:inline">{t('btn_register')}</span>
            <span className="sm:hidden">{isTa ? 'பதிவு' : 'Register'}</span>
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-[85vh] sm:h-[90vh] flex flex-col items-center justify-center text-center px-4 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="/hero.png"
            alt="Tamil Wedding Couple"
            className="w-full h-full object-cover object-top opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80"></div>
        </div>

        <div className="relative z-10 max-w-5xl mx-auto flex flex-col items-center px-2 pb-12 sm:pb-16 pt-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="mb-4 sm:mb-6 border-b-2 border-gnanam-gold pb-2"
          >
            <span className={`text-gnanam-gold tracking-widest uppercase font-semibold drop-shadow-lg ${isTa ? 'text-xs sm:text-sm' : 'text-xs sm:text-sm md:text-base'}`}>
              {t('hero_subtitle')}
            </span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className={`${isTa ? 'text-2xl sm:text-4xl md:text-5xl lg:text-6xl py-2' : 'text-3xl sm:text-5xl md:text-7xl'} font-extrabold text-white mb-4 sm:mb-6 leading-tight drop-shadow-2xl`}
          >
            {t('hero_title1')} <span className="text-gnanam-gold">{t('hero_title2')}</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className={`${isTa ? 'text-sm sm:text-base md:text-xl max-w-4xl' : 'text-base sm:text-lg md:text-2xl max-w-3xl'} text-gray-200 mb-8 sm:mb-10 drop-shadow-md px-2`}
          >
            {t('hero_desc')}
          </motion.p>
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            onClick={() => navigate('/submit')}
            className="group flex flex-wrap justify-center items-center gap-2 sm:gap-3 bg-gnanam-gold hover:bg-yellow-500 text-red-950 px-5 py-3 sm:px-8 sm:py-4 rounded-3xl sm:rounded-full text-base sm:text-xl font-bold shadow-[0_0_40px_rgba(255,215,0,0.4)] hover:shadow-[0_0_60px_rgba(255,215,0,0.6)] active:scale-95 transition-all duration-300 whitespace-normal leading-tight mx-4 max-w-[95%] sm:max-w-none"
          >
            {t('btn_find_match')}
            <ArrowRight size={22} className="group-hover:translate-x-2 transition-transform hidden sm:block" />
          </motion.button>
        </div>
      </section>

      {/* Trust Stats bar */}
      <section className="bg-gnanam-red text-white py-8 sm:py-12 px-4 sm:px-6 shadow-inner relative z-20 -mt-6 sm:-mt-8 mx-4 sm:mx-auto max-w-6xl rounded-2xl">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 text-center divide-y sm:divide-y-0 sm:divide-x divide-red-800">
          <div className="flex flex-col items-center">
            <h4 className={`${isTa ? 'text-2xl sm:text-3xl mb-0.5' : 'text-3xl sm:text-4xl mb-1 sm:mb-2'} font-black text-gnanam-gold`}>10+</h4>
            <span className={`uppercase tracking-wider font-medium text-red-100 ${isTa ? 'text-[10px] sm:text-xs' : 'text-xs sm:text-sm'}`}>{t('stat_years')}</span>
          </div>
          <div className="flex flex-col items-center pt-6 sm:pt-0">
            <h4 className={`${isTa ? 'text-2xl sm:text-3xl mb-0.5' : 'text-3xl sm:text-4xl mb-1 sm:mb-2'} font-black text-gnanam-gold`}>100+</h4>
            <span className={`uppercase tracking-wider font-medium text-red-100 ${isTa ? 'text-[10px] sm:text-xs' : 'text-xs sm:text-sm'}`}>{t('stat_marriages')}</span>
          </div>
          <div className="flex flex-col items-center pt-6 sm:pt-0">
            <h4 className={`${isTa ? 'text-2xl sm:text-3xl mb-0.5' : 'text-3xl sm:text-4xl mb-1 sm:mb-2'} font-black text-gnanam-gold`}>100%</h4>
            <span className={`uppercase tracking-wider font-medium text-red-100 ${isTa ? 'text-[10px] sm:text-xs' : 'text-xs sm:text-sm'}`}>{t('stat_confidential')}</span>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className={`${isTa ? 'text-2xl sm:text-3xl md:text-4xl' : 'text-3xl sm:text-4xl md:text-5xl'} font-bold text-gnanam-red mb-4`}>{t('why_title')}</h2>
          <div className="w-24 h-1 bg-gnanam-orange mx-auto rounded-full"></div>
        </div>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-10">
          {[
            { icon: <ShieldCheck size={40} className="text-gnanam-orange sm:w-12 sm:h-12" />, title: t('why_privacy_title'), desc: t('why_privacy_desc') },
            { icon: <Users size={40} className="text-gnanam-orange sm:w-12 sm:h-12" />, title: t('why_cultural_title'), desc: t('why_cultural_desc') },
            { icon: <CheckCircle size={40} className="text-gnanam-orange sm:w-12 sm:h-12" />, title: t('why_verified_title'), desc: t('why_verified_desc') }
          ].map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.2 }}
              className="bg-white p-6 sm:p-10 rounded-3xl shadow-xl hover:-translate-y-2 transition-transform duration-300 border-b-4 border-gnanam-gold"
            >
              <div className="bg-orange-50 w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center mb-4 sm:mb-6 shadow-inner">
                {feature.icon}
              </div>
              <h3 className={`${isTa ? 'text-lg sm:text-xl' : 'text-xl sm:text-2xl'} font-bold text-gray-900 mb-3 sm:mb-4`}>{feature.title}</h3>
              <p className={`text-gray-600 leading-relaxed ${isTa ? 'text-xs sm:text-sm' : 'text-sm sm:text-base'}`}>{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Success Stories Split Section */}
      <section className="bg-white py-16 sm:py-24 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gnanam-cream -skew-x-12 origin-top hidden lg:block"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid lg:grid-cols-2 gap-10 sm:gap-16 items-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col gap-4 sm:gap-6"
          >
            <h2 className={`${isTa ? 'text-2xl sm:text-3xl md:text-4xl' : 'text-3xl sm:text-4xl md:text-5xl'} font-extrabold text-gnanam-red leading-tight`}>
              {t('success_title1')} <br /><span className="text-gnanam-orange">{t('success_title2')}</span>
            </h2>
            <p className={`text-gray-700 leading-relaxed mb-4 sm:mb-6 ${isTa ? 'text-sm sm:text-base' : 'text-base sm:text-lg'}`}>
              {t('success_desc')}
            </p>

            <div className="space-y-4 sm:space-y-6">
              {[1].map((i) => (
                <div key={i} className="flex gap-3 sm:gap-4 p-4 sm:p-6 bg-red-50 rounded-2xl border border-red-100">
                  <div className="text-gnanam-gold mt-1 flex-shrink-0"><Star size={20} fill="#FFD700" className="sm:w-6 sm:h-6" /></div>
                  <div>
                    <h5 className="font-bold text-base sm:text-lg mb-1">{t('success_review1_title')}</h5>
                    <p className="text-gray-600 text-xs sm:text-sm italic">{t('success_review1_desc')}</p>
                    <span className="text-xs font-bold text-gray-400 mt-2 block">{t('success_review1_author')}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gnanam-gold rounded-3xl transform translate-x-3 translate-y-3 sm:translate-x-4 sm:translate-y-4"></div>
            <img
              src="/success.png"
              alt="Successful older Tamil couple"
              className="relative z-10 rounded-3xl shadow-2xl w-full h-auto object-cover"
            />
          </motion.div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 bg-gnanam-red text-white relative">
        <div className="absolute inset-0 opacity-10 pattern-grid"></div>
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <h2 className={`${isTa ? 'text-2xl sm:text-3xl md:text-4xl' : 'text-3xl sm:text-4xl md:text-5xl'} font-bold mb-10 sm:mb-16 text-white text-center`}>{t('how_title')}</h2>

          <div className="grid sm:grid-cols-3 gap-8 sm:gap-12 relative">
            <div className="hidden sm:block absolute top-12 left-[15%] right-[15%] h-1 bg-red-800 border-dashed border-t-2 border-red-300"></div>

            {[
              { step: "01", title: t('how_step1_title'), desc: t('how_step1_desc') },
              { step: "02", title: t('how_step2_title'), desc: t('how_step2_desc') },
              { step: "03", title: t('how_step3_title'), desc: t('how_step3_desc') }
            ].map((item, idx) => (
              <div key={idx} className="relative z-10 flex flex-col items-center">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-white text-gnanam-red flex items-center justify-center text-2xl sm:text-3xl font-black shadow-xl mb-4 sm:mb-6 border-4 border-gnanam-gold">
                  {item.step}
                </div>
                <h3 className={`${isTa ? 'text-lg sm:text-xl' : 'text-xl sm:text-2xl'} font-bold mb-3 sm:mb-4`}>{item.title}</h3>
                <p className={`text-red-100 px-2 sm:px-4 ${isTa ? 'text-xs sm:text-sm' : 'text-sm sm:text-base'}`}>{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 sm:mt-16 px-4">
            <button
              onClick={() => navigate('/submit')}
              className="bg-gnanam-gold hover:bg-white text-gnanam-red px-6 py-4 sm:px-10 sm:py-5 rounded-2xl sm:rounded-full text-base sm:text-xl font-bold shadow-xl active:scale-95 transition-all duration-300 w-full sm:w-auto whitespace-normal leading-tight"
            >
              {t('btn_begin')}
            </button>
          </div>
        </div>
      </section>

      {/* Contact Us Section */}
      <section id="contact" className="py-16 sm:py-24 bg-white relative overflow-hidden">
        <div className="absolute -top-20 -left-20 w-72 h-72 bg-gnanam-gold/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-gnanam-red/5 rounded-full blur-3xl"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="text-center mb-12 sm:mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className={`${isTa ? 'text-2xl sm:text-3xl md:text-4xl' : 'text-3xl sm:text-4xl md:text-5xl'} font-bold text-gnanam-red mb-4`}
            >
              {t('contact_title')}
            </motion.h2>
            <div className="w-24 h-1 bg-gnanam-orange mx-auto rounded-full mb-4"></div>
            <p className={`text-gray-600 max-w-2xl mx-auto ${isTa ? 'text-sm sm:text-base' : 'text-base sm:text-lg'}`}>
              {t('contact_desc')}
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 items-stretch">
            {/* Contact Image */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative rounded-3xl overflow-hidden shadow-2xl min-h-[300px] sm:min-h-[400px]"
            >
              <img
                src="/contact.png"
                alt="Our matrimony office"
                className="w-full h-full object-cover absolute inset-0"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
                <p className="text-white text-lg sm:text-xl font-bold drop-shadow-lg">
                  {t('contact_img_title')}
                </p>
                <p className="text-gray-200 text-sm sm:text-base mt-1">
                  {t('contact_img_desc')}
                </p>
              </div>
            </motion.div>

            {/* Contact Details Cards */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex flex-col gap-4 sm:gap-5"
            >
              {[
                {
                  icon: <Phone size={24} className="text-white" />,
                  title: t('contact_call'),
                  detail: "+94 76 910 4096",
                  subDetail: t('contact_call_sub'),
                  bgColor: "bg-gnanam-red",
                  href: "tel:+94769104096"
                },
                {
                  icon: <Mail size={24} className="text-white" />,
                  title: t('contact_email'),
                  detail: "gnanamsmatrimony@gmail.com",
                  subDetail: t('contact_email_sub'),
                  bgColor: "bg-gnanam-orange",
                  href: "mailto:gnanamsmatrimony@gmail.com"
                },
                {
                  icon: <MapPin size={24} className="text-white" />,
                  title: t('contact_visit'),
                  detail: "10/1 Ampalavanar Road, Jaffna",
                  subDetail: t('contact_visit_sub'),
                  bgColor: "bg-yellow-600",
                  href: "#"
                },
                {
                  icon: <Clock size={24} className="text-white" />,
                  title: t('contact_hours'),
                  detail: t('contact_hours_sub1'),
                  subDetail: t('contact_hours_sub2'),
                  bgColor: "bg-green-700",
                  href: "#"
                }
              ].map((item, idx) => (
                <a
                  key={idx}
                  href={item.href}
                  className="flex items-start sm:items-center gap-4 sm:gap-5 bg-gray-50 hover:bg-white p-4 sm:p-5 rounded-2xl border border-gray-100 hover:border-gnanam-gold/50 shadow-sm hover:shadow-lg transition-all duration-300 group cursor-pointer w-full overflow-hidden"
                >
                  <div className={`${item.bgColor} w-10 h-10 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-300 mt-1 sm:mt-0`}>
                    {item.icon}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="text-[10px] sm:text-sm uppercase tracking-wider text-gray-500 font-bold mb-1 leading-tight whitespace-normal">{item.title}</h4>
                    <p className={`font-bold text-gray-900 break-words whitespace-normal leading-tight ${isTa ? 'text-sm sm:text-lg' : 'text-base sm:text-lg'}`}>{item.detail}</p>
                    <p className={`text-gray-500 whitespace-normal mt-1 leading-tight break-words ${isTa ? 'text-xs sm:text-sm' : 'text-xs sm:text-sm'}`}>{item.subDetail}</p>
                  </div>
                </a>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-950 text-gray-400 py-12 sm:py-16 text-center">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col items-center mb-6 sm:mb-8">
            <Heart size={32} className="text-gnanam-red mb-3 sm:mb-4 sm:w-10 sm:h-10" />
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">{t('title')}</h2>
            <p className="text-base sm:text-lg text-gnanam-gold">{t('footer_slogan')}</p>
          </div>

          <div className="w-full h-px bg-gray-800 my-6 sm:my-8"></div>

          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4 text-xs sm:text-sm">
            <p>&copy; {new Date().getFullYear()} {t('footer_rights')}</p>
            <div className="flex gap-4 sm:gap-6">
              <a href="#" className="hover:text-white transition-colors">{t('footer_privacy')}</a>
              <a href="#" className="hover:text-white transition-colors">{t('footer_terms')}</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
