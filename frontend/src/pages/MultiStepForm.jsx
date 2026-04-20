import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Check, UploadCloud, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { useLanguage } from '../context/LanguageContext';

const MultiStepForm = () => {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const isTa = language === 'ta';
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '', age: '', gender: 'Male', religion: '', caste: '', location: '',
    education: '', job: '', familyDetails: '', description: '',
    preferences_ageRange: '', preferences_religion: '', preferences_location: '',
    profileImage: null, horoscopeFile: null,
    phone: '', whatsapp: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files.length > 0) {
      setFormData(prev => ({ ...prev, [name]: files[0] }));
    }
  };

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 5));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (currentStep !== 5) return;

    setIsSubmitting(true);

    try {
      const data = new FormData();
      Object.keys(formData).forEach(key => {
        if (key.startsWith('preferences_')) return;
        if (key === 'profileImage' || key === 'horoscopeFile') {
          if (formData[key]) data.append(key, formData[key]);
        } else {
          data.append(key, formData[key]);
        }
      });

      data.append('preferences', JSON.stringify({
        ageRange: formData.preferences_ageRange,
        religion: formData.preferences_religion,
        location: formData.preferences_location
      }));

      await axios.post('http://localhost:5000/api/submissions', data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      toast.success(t('toast_success'));
      setTimeout(() => navigate('/'), 3000);
    } catch (error) {
      toast.error(t('toast_error'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass = "w-full p-3 sm:p-4 rounded-xl border border-gray-300 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-gnanam-orange outline-none shadow-inner transition-all text-sm sm:text-base";
  const labelClass = "block text-xs sm:text-sm mb-1.5 sm:mb-2 font-bold text-gray-700";

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
            <h3 className="text-3xl font-black mb-8 text-gnanam-red flex items-center justify-center gap-3">
              <span className="bg-red-100 p-2 rounded-full"><Heart size={24} className="text-gnanam-red flex-shrink-0" fill="#8B0000" /></span>
              {t('step1_title')}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div><label className={labelClass}>{t('label_name')}</label><input required className={inputClass} name="name" value={formData.name} onChange={handleChange} /></div>
              <div><label className={labelClass}>{t('label_age')}</label><input required type="number" min="18" className={inputClass} name="age" value={formData.age} onChange={handleChange} /></div>
              <div>
                <label className={labelClass}>{t('label_gender')}</label>
                <select className={inputClass} name="gender" value={formData.gender} onChange={handleChange}>
                  <option value="Male">{t('gender_male')}</option>
                  <option value="Female">{t('gender_female')}</option>
                </select>
              </div>
              <div><label className={labelClass}>{t('label_religion')}</label><input required className={inputClass} name="religion" value={formData.religion} onChange={handleChange} /></div>
              <div><label className={labelClass}>{t('label_caste')}</label><input required className={inputClass} name="caste" value={formData.caste} onChange={handleChange} /></div>
              <div><label className={labelClass}>{t('label_location')}</label><input required className={inputClass} name="location" value={formData.location} onChange={handleChange} /></div>
            </div>
          </motion.div>
        );
      case 2:
        return (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
            <h3 className="text-3xl font-black mb-8 text-gnanam-red text-center">{t('step2_title')}</h3>
            <div className="grid grid-cols-1 gap-6">
              <div><label className={labelClass}>{t('label_education')}</label><input required className={inputClass} name="education" value={formData.education} onChange={handleChange} /></div>
              <div><label className={labelClass}>{t('label_job')}</label><input required className={inputClass} name="job" value={formData.job} onChange={handleChange} /></div>
              <div><label className={labelClass}>{t('label_family')}</label><textarea required className={`${inputClass} resize-none h-32`} name="familyDetails" value={formData.familyDetails} onChange={handleChange} placeholder={t('desc_family')} /></div>
              <div><label className={labelClass}>{t('label_about')}</label><textarea required className={`${inputClass} resize-none h-32`} name="description" value={formData.description} onChange={handleChange} placeholder={t('desc_about')} /></div>
            </div>
          </motion.div>
        );
      case 3:
        return (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
            <h3 className="text-3xl font-black mb-8 text-gnanam-red text-center">{t('step4_title')}</h3>
            <div className="grid grid-cols-1 gap-6 max-w-xl mx-auto">
              <div><label className={labelClass}>{t('label_partner_age')}</label><input required className={inputClass} name="preferences_ageRange" value={formData.preferences_ageRange} onChange={handleChange} /></div>
              <div><label className={labelClass}>{t('label_partner_religion')}</label><input required className={inputClass} name="preferences_religion" value={formData.preferences_religion} onChange={handleChange} /></div>
              <div><label className={labelClass}>{t('label_partner_location')}</label><input required className={inputClass} name="preferences_location" value={formData.preferences_location} onChange={handleChange} /></div>
            </div>
          </motion.div>
        );
      case 4:
        return (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6 text-center">
            <h3 className="text-3xl font-black mb-4 text-gnanam-red">{t('step3_title')}</h3>
            <p className="text-md text-gray-500 mb-8 max-w-2xl mx-auto">{t('step3_desc')}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <label htmlFor="profileImageInput" className="border-2 border-dashed border-gnanam-orange bg-orange-50 hover:bg-orange-100 rounded-3xl p-10 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 w-full group shadow-inner">
                <UploadCloud size={56} className="text-gnanam-orange mb-4 group-hover:scale-110 transition-transform duration-300" />
                <span className="font-bold text-xl text-gnanam-red mb-2">{t('upload_profile')}</span>
                <span className="text-gray-500 text-sm px-4">{t('upload_profile_desc')}</span>
                <input id="profileImageInput" type="file" className="hidden" name="profileImage" accept="image/*" onChange={handleFileChange} />
                {formData.profileImage && <p className="mt-6 text-md text-green-800 bg-green-200 px-6 py-2 rounded-full font-bold shadow animate-fade-in-up">{formData.profileImage.name}</p>}
              </label>

              <label htmlFor="horoscopeFileInput" className="border-2 border-dashed border-gnanam-orange bg-orange-50 hover:bg-orange-100 rounded-3xl p-10 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 w-full group shadow-inner">
                <UploadCloud size={56} className="text-gnanam-orange mb-4 group-hover:scale-110 transition-transform duration-300" />
                <span className="font-bold text-xl text-gnanam-red mb-2">{t('upload_horoscope')}</span>
                <span className="text-gray-500 text-sm px-4">{t('upload_horoscope_desc')}</span>
                <input id="horoscopeFileInput" type="file" className="hidden" name="horoscopeFile" accept=".pdf,image/*" onChange={handleFileChange} />
                {formData.horoscopeFile && <p className="mt-6 text-md text-green-800 bg-green-200 px-6 py-2 rounded-full font-bold shadow animate-fade-in-up">{formData.horoscopeFile.name}</p>}
              </label>
            </div>
          </motion.div>
        );
      case 5:
        return (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
            <h3 className="text-3xl font-black mb-8 text-gnanam-red text-center">{t('step5_title')}</h3>
            <div className="grid grid-cols-1 gap-8 max-w-xl mx-auto">
              <div><label className={labelClass}>{t('label_phone')}</label><input required className={inputClass} name="phone" value={formData.phone} onChange={handleChange} /></div>
              <div><label className={labelClass}>{t('label_whatsapp')}</label><input required className={inputClass} name="whatsapp" value={formData.whatsapp} onChange={handleChange} /></div>

              <div className="bg-red-50 p-6 rounded-2xl border border-red-100 text-center mt-4">
                <h4 className="text-lg font-bold text-gnanam-red mb-2">{t('submit_ready')}</h4>
                <p className="text-sm text-gray-600">{t('submit_desc')}</p>
              </div>
            </div>
          </motion.div>
        );
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gnanam-cream to-white py-6 sm:py-12 px-3 sm:px-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-gnanam-gold/10 rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gnanam-red/5 rounded-full blur-3xl -z-10 -translate-x-1/2 translate-y-1/2"></div>

      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-6 sm:mb-10">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-gray-900 group cursor-pointer inline-flex items-center gap-2 sm:gap-3" onClick={() => navigate('/')}>
            {t('form_title')}
          </h2>
          <p className="text-gray-500 mt-1.5 sm:mt-2 font-medium text-sm sm:text-base">{t('form_subtitle')}</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8 sm:mb-12 px-2 sm:px-4">
          <div className="flex justify-between items-center relative max-w-2xl mx-auto">
            <div className="absolute left-0 top-1/2 w-full h-1 sm:h-1.5 bg-gray-200 -z-10 rounded-full"></div>
            <div
              className="absolute left-0 top-1/2 h-1 sm:h-1.5 bg-gradient-to-r from-gnanam-red to-gnanam-orange -z-10 rounded-full transition-all duration-700 ease-in-out"
              style={{ width: `${((currentStep - 1) / 4) * 100}%` }}
            ></div>
            {[1, 2, 3, 4, 5].map(step => (
              <div key={step} className={`w-9 h-9 sm:w-12 sm:h-12 rounded-full flex items-center justify-center font-bold text-sm sm:text-lg shadow-lg transition-all duration-500 ease-in-out ${currentStep >= step ? 'bg-gradient-to-br from-gnanam-red to-gnanam-orange text-white scale-110' : 'bg-white text-gray-400 border-2 sm:border-4 border-gray-100'}`}>
                {currentStep > step ? <Check size={16} strokeWidth={4} /> : step}
              </div>
            ))}
          </div>
        </div>

        {/* Form Container */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden border border-white">
          <form onSubmit={currentStep === 5 ? handleSubmit : (e) => { e.preventDefault(); nextStep(); }}>
            <div className="p-4 sm:p-8 md:p-14 min-h-[400px] sm:min-h-[500px]">
              <AnimatePresence mode="wait">
                {renderStep()}
              </AnimatePresence>
            </div>

            {/* Navigation Buttons */}
            <div className="bg-gray-50/80 backdrop-blur-md p-4 sm:p-8 flex justify-between items-center border-t border-gray-100 gap-2 sm:gap-4">
              <button
                type="button"
                onClick={prevStep}
                className={`flex justify-center items-center gap-1.5 sm:gap-2 px-3 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-full font-bold text-xs sm:text-base transition-all duration-300 active:scale-95 whitespace-nowrap leading-none ${currentStep === 1 ? 'opacity-0 pointer-events-none' : 'text-gray-600 hover:bg-gray-200 hover:text-gray-900 shadow-sm'}`}
              >
                <ArrowLeft size={16} className="sm:w-5 sm:h-5 flex-shrink-0" />
                <span className="sm:hidden">{isTa ? 'பின்' : 'Back'}</span>
                <span className="hidden sm:inline">{t('btn_prev')}</span>
              </button>

              {currentStep < 5 ? (
               <button
                  type="submit"
                  className="flex justify-center items-center gap-1.5 sm:gap-3 bg-gradient-to-r from-gnanam-red to-red-800 hover:from-gnanam-orange hover:to-red-700 text-white px-4 sm:px-10 py-3 sm:py-4 rounded-xl sm:rounded-full font-bold text-xs sm:text-base shadow-xl hover:-translate-y-1 active:scale-95 transition-all duration-300 whitespace-nowrap leading-none flex-1 max-w-[200px] sm:max-w-none"
                >
                  <span className="sm:hidden">{isTa ? 'அடுத்து' : 'Next'}</span>
                  <span className="hidden sm:inline">{t('btn_next')}</span>
                  <ArrowRight size={16} className="sm:w-5 sm:h-5 flex-shrink-0" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex justify-center items-center gap-1.5 sm:gap-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 text-white px-4 sm:px-10 py-3 sm:py-4 rounded-xl sm:rounded-full font-bold text-xs sm:text-base shadow-xl hover:-translate-y-1 active:scale-95 transition-all duration-300 disabled:opacity-70 disabled:hover:translate-y-0 whitespace-nowrap leading-none flex-1 max-w-[200px] sm:max-w-none"
                >
                  {isSubmitting ? t('submit_loading') : (
                    <>
                      <span className="sm:hidden">{isTa ? 'சமர்ப்பிக்க' : 'Submit'}</span>
                      <span className="hidden sm:inline">{t('btn_submit')}</span>
                    </>
                  )}
                  <Check size={16} className="stroke-[3] sm:w-5 sm:h-5 flex-shrink-0" />
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MultiStepForm;
