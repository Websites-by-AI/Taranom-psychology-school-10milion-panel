import React, { useState } from 'react';
import { 
  Sparkles, Shield, User, Users, GraduationCap, LayoutDashboard, Brain, Target, 
  Settings, ArrowLeft, Terminal, Activity, HelpCircle, FileText, CheckCircle,
  Database, UserPlus, Info, Zap, Phone, MapPin, Globe, Mail, Calendar, Search, BookOpen, Clock, Heart, Award
} from 'lucide-react';
import { BRAND_CONFIG } from '../constants';
import { Student } from '../types';

interface WelcomeTourPortalProps {
  currentRole: string;
  onNavigate: (view: string) => void;
  onSwitchRole: (role: "student" | "parent" | "admin" | "counselor" | "teacher") => void;
}

export default function WelcomeTourPortal({ currentRole, onNavigate, onSwitchRole }: WelcomeTourPortalProps) {
  // Simulator State
  const [currentTraza, setCurrentTraza] = useState<number>(6200);
  const [studyHours, setStudyHours] = useState<number>(7.5);
  const [trapAccuracy, setTrapAccuracy] = useState<number>(45);

  // Character Toggle State
  const [characterTab, setCharacterTab] = useState<"student" | "staff">("student");

  // FAQ/Knowledge Base Tabs
  const [faqTab, setFaqTab] = useState<"faq" | "notes">("faq");
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);
  const [expandedTactic, setExpandedTactic] = useState<string | null>("t1");

  // Reservation Form State
  const [studentName, setStudentName] = useState("");
  const [studentPhone, setStudentPhone] = useState("");
  const [fieldOfStudy, setFieldOfStudy] = useState("تجربی");
  const [challengeMsg, setChallengeMsg] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Calculated variables for the Live Simulator
  const hourFactor = (studyHours - 4) * 85; 
  const accuracyFactor = (trapAccuracy - 20) * 11;
  const levelUpScore = Math.max(50, Math.round(hourFactor + accuracyFactor - 120));
  const simulatedUpgradedTraza = Math.min(9850, currentTraza + levelUpScore);

  // Interactive advice based on the calculated upgraded score
  let admissionChanceText = "";
  if (simulatedUpgradedTraza < 5600) {
    admissionChanceText = "دانشگاه‌های آزاد محلی یا دوره‌های خودگردان شهریه‌پرداز ⚡ نیاز مبرم به مربیگری منظم برای ساختن عادت گام‌به‌گام کایزنی.";
  } else if (simulatedUpgradedTraza >= 5600 && simulatedUpgradedTraza < 6800) {
    admissionChanceText = "دانشگاه‌های دولتی سراسری متوسط یا رشته‌های پیراپزشکی ظرفیت مازاد ⚡ تراز اولیه خوبی است، ولی پتانسیل شما بسیار بالاتر از این است! مربیگری کایزنی و پایش زنده ضعف‌ها شما را از فرسودگی نجات داده و تراز شما را صعودی می‌کند.";
  } else if (simulatedUpgradedTraza >= 6805 && simulatedUpgradedTraza < 7800) {
    admissionChanceText = "مهندسی‌های تاپ تهران، فیزیوتراپی سراسری یا داروسازی شهرهای برتر کشور 🩺 تراز فوق العاده است! عادات خودپنداره شما کالیبره شده و با کمی مهار تله‌های گزینه‌ای زیست و شیمی رتبه ۳ رقمی در دسترس است.";
  } else {
    admissionChanceText = "قبولی تضمینی پزشکی دانشگاه تهران، دندان‌پزشکی شهید بهشتی یا مهندسی کامپیوتر شریف 🩺 شگفت‌انگیز! شما کدهای تله‌گذاری طراحان را به کل رمزگشایی کرده‌اید و آماده حماسه‌آفرینی هستید.";
  }

  // Handle simulated Quick Demo Login
  const handleDemoLogin = (studentId: string, roleType: "student" | "parent" | "admin" | "counselor" | "teacher", name: string, grade: string) => {
    localStorage.setItem("arateb_student_profile_name", name);
    localStorage.setItem("arateb_student_profile_grade", grade);
    onSwitchRole(roleType);
    
    if (roleType === "student") {
      onNavigate("dashboard");
    } else if (roleType === "counselor") {
      onNavigate("counselor-dashboard");
    } else if (roleType === "parent") {
      onNavigate("manova");
    } else {
      onNavigate("admin");
    }
  };

  const submitConsultation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName || !studentPhone) return;
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setStudentName("");
      setStudentPhone("");
      setChallengeMsg("");
    }, 4000);
  };

  // Convert numbers to Persian characters visually
  const toPersianNum = (num: number | string) => {
    const persianDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
    return num.toString().replace(/\d/g, (x) => persianDigits[parseInt(x)]);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans text-right pb-16 selection:bg-indigo-150 relative" style={{ direction: 'rtl' }} id="welcome-portal-root">
      
      {/* Dynamic Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-sm" id="welcome-sticky-nav">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          <div className="flex items-center gap-6">
            {/* Elegant Brand Identity */}
            <div className="flex items-center gap-2">
              <div className="p-2 bg-gradient-to-tr from-indigo-600 to-indigo-800 text-white rounded-xl shadow-md">
                <Sparkles size={18} className="animate-pulse" />
              </div>
              <div className="space-y-0.5">
                <h1 className="text-xs sm:text-sm font-black text-slate-900 tracking-tight">آکادمی هوشمند ترنم همدلی</h1>
                <span className="text-[9px] text-indigo-600 font-extrabold tracking-widest block">دستیار تخصصی موفقیت در کنکور سراسری</span>
              </div>
            </div>

            {/* Links scroll anchors */}
            <nav className="hidden lg:flex items-center gap-1.5 text-xs font-black text-slate-500">
              <a href="#welcome-hero" className="px-3 py-1.5 rounded-lg hover:bg-slate-100 hover:text-slate-900 transition-all font-bold">پیشواز صفحه اول</a>
              <a href="#character-select" className="px-3 py-1.5 rounded-lg hover:bg-slate-100 hover:text-slate-900 transition-all font-bold">نقش‌های آماده و دمو</a>
              <a href="#feature-map-section" className="px-3 py-1.5 rounded-lg hover:bg-slate-100 hover:text-slate-900 transition-all font-bold">آشنایی با قابلیت‌ها</a>
              <a href="#faq-knowledge-hall" className="px-3 py-1.5 rounded-lg hover:bg-slate-100 hover:text-slate-900 transition-all font-bold">دانشنامه و یادداشت‌ها</a>
              <a href="#consultation-reserve" className="px-3 py-1.5 rounded-lg hover:bg-slate-100 hover:text-slate-900 transition-all font-bold">پشتیبانی و همیاری</a>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={() => onNavigate("login")} 
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black px-4 py-2 rounded-xl transition-all active:scale-95 shadow-md shadow-indigo-150 cursor-pointer"
            >
              ثبت‌نام و ورود اعضا
            </button>
          </div>
        </div>
      </header>

      {/* 🚀 Section 1: HERO CONTAINER (ورود سریع داوطلب / اولیا) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-10" id="welcome-hero">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Hero Slogan & Welcome Card */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-10 rounded-[32px] border border-slate-150 shadow-sm relative overflow-hidden space-y-6">
            <div className="absolute top-0 left-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-[60px] pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-[60px] pointer-events-none" />
            
            <div className="space-y-3.5 relative z-10">
              <span className="inline-flex items-center gap-1.5 bg-indigo-50 text-indigo-700 font-extrabold text-[10px] px-3.5 py-1.5 rounded-lg border border-indigo-100">
                <Sparkles size={12} className="text-amber-500 fill-amber-500 animate-pulse" />
                سامانه هدایت فوق‌هوشمند تحصیلی و سنجش فراشناخت
              </span>
              
              <h2 className="text-xl sm:text-3xl font-black text-slate-900 leading-tight">
                ورود سریع داوطلب / اولیا
              </h2>
              <h3 className="text-sm sm:text-base font-black text-indigo-700 leading-relaxed">
                🚀 به باشگاه مهار تله‌های تستی و افزایش تراز کنکور خوش آمدید!
              </h3>
              
              <h4 className="text-xs sm:text-sm font-extrabold text-slate-800 leading-relaxed pt-1">
                با برنامه‌ریزی کایزنی و عیب‌یابی استرس، تراز کنکور خودت رو لول‌آپ کن! 🎯
              </h4>

              <p className="text-xs text-slate-500 leading-relaxed font-semibold text-justify">
                دیگه نیازی به برنامه‌های فشرده و خسته کننده نیست. به جمع داوطلبان ترنم مهر بپیوند، تله‌های طراحان کنکور را رمزگشایی کن و در خانه فضایی پر از آرامش به دور از تنش‌های تراز بساز. با استفاده از ماژول‌های متصل پایین می‌توانید فوراً وارد هر پرتابل به صورت دمو شوید.
              </p>
            </div>

            {/* Quick Action Buttons per User request */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 relative z-10">
              <a 
                href="#character-select"
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-heavy text-xs px-4 py-3 rounded-xl shadow-sm text-center transition-all cursor-pointer hover:shadow-indigo-100 flex items-center justify-center gap-1.5"
              >
                <span>شروع فوری (رایگان با دمو)</span>
              </a>
              <a 
                href="#consultation-reserve"
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 font-heavy text-xs px-4 py-3 rounded-xl text-center transition-all cursor-pointer"
              >
                پیش‌ثبت‌نام و مشاوره
              </a>
              <a 
                href="#feature-map-section"
                className="bg-emerald-50 hover:bg-emerald-100 text-emerald-850 border border-emerald-150 font-heavy text-xs px-4 py-3 rounded-xl text-center transition-all cursor-pointer"
              >
                آزمایشگاه سنجش مهار تله
              </a>
            </div>

            <div className="pt-4 border-t border-slate-50 flex items-center justify-between text-[10px] text-slate-400 font-extrabold">
              <span className="flex items-center gap-1">
                <CheckCircle size={12} className="text-emerald-500" />
                سیستم مدیریت تله‌های کنکور فعال و متصل است
              </span>
              <span>کیت لایو کایزن نسخه ۴.۲</span>
            </div>
          </div>

          {/* 📊 Interactive KAYZEN UPGRADE SIMULATOR KIT */}
          <div className="lg:col-span-5 bg-gradient-to-br from-indigo-950 to-slate-900 border border-indigo-900 rounded-[32px] p-6 text-white shadow-xl space-y-6">
            <div className="space-y-1.5 border-b border-indigo-900/60 pb-3">
              <span className="bg-indigo-850 text-indigo-300 font-black text-[9px] px-2.5 py-1 rounded-md inline-block">
                شبیه‌ساز ارتقای علمی رتبه‌بندی علمی
              </span>
              <h3 className="text-sm font-black text-white">کیت شبیه‌ساز ارتقای علمی طراز تحصیلی</h3>
              <p className="text-[10px] text-slate-300 font-medium leading-relaxed">
                تغییرات عادات روزانه را اعمال کنید تا تأثیر آن در هدف نهایی را زنده ببینید!
              </p>
            </div>

            {/* Sliders Container */}
            <div className="space-y-4">
              
              {/* Slider 1: Current Traza */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs font-black">
                  <span className="text-slate-350">تراز فعلی شما در آزمون‌های گذشته:</span>
                  <span className="text-amber-400 font-mono text-xs">{toPersianNum(currentTraza)}</span>
                </div>
                <input 
                  type="range"
                  min="4000"
                  max="9500"
                  step="100"
                  value={currentTraza}
                  onChange={(e) => setCurrentTraza(Number(e.target.value))}
                  className="w-full accent-indigo-500 h-1 bg-slate-800 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[9px] text-slate-400 font-extrabold">
                  <span>{toPersianNum("۴,۰۰۰ (حداقل)")}</span>
                  <span>{toPersianNum("۹,۵۰۰ (تراز بالا)")}</span>
                </div>
              </div>

              {/* Slider 2: Study Hours */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs font-black">
                  <span className="text-slate-350">هدف ساعت مطالعه روزانه (روش کایزن):</span>
                  <span className="text-indigo-300 font-mono text-xs">{toPersianNum(studyHours)} ساعت متمرکز</span>
                </div>
                <input 
                  type="range"
                  min="4"
                  max="13"
                  step="0.5"
                  value={studyHours}
                  onChange={(e) => setStudyHours(Number(e.target.value))}
                  className="w-full accent-indigo-500 h-1 bg-slate-800 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[9px] text-slate-400 font-extrabold">
                  <span>{toPersianNum("۴ ساعت (شروع گام اول)")}</span>
                  <span>{toPersianNum("۱۳ ساعت (برنامه پایداری فشرده)")}</span>
                </div>
              </div>

              {/* Slider 3: Accuracy */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs font-black">
                  <span className="text-slate-350">دقت پاسخگویی و مهار خطاهای گزینه‌ای:</span>
                  <span className="text-emerald-400 font-mono text-xs">{toPersianNum(trapAccuracy)}٪ خنثی‌سازی تله‌ها</span>
                </div>
                <input 
                  type="range"
                  min="20"
                  max="95"
                  step="5"
                  value={trapAccuracy}
                  onChange={(e) => setTrapAccuracy(Number(e.target.value))}
                  className="w-full accent-emerald-500 h-1 bg-slate-800 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[9px] text-slate-400 font-extrabold">
                  <span>{toPersianNum("۲۰٪ (پر بی‌دقت)")}</span>
                  <span>{toPersianNum("۹۵٪ (حرفه‌ای بدون اشتباه تله)")}</span>
                </div>
              </div>

            </div>

            {/* Dynamics Projection output board */}
            <div className="bg-slate-950/80 p-4.5 rounded-2xl border border-indigo-900 space-y-3">
              <span className="text-[10px] text-indigo-400 font-extrabold block">برآورد شانس قبولی دانشگاه سراسری شما:</span>
              <p className="text-[11px] text-slate-200 leading-relaxed font-bold">
                {admissionChanceText}
              </p>

              {/* Maryam Hosseini Portal output box */}
              <div className="pt-3.5 mt-3 border-t border-slate-900 space-y-3">
                <div className="bg-gradient-to-l from-indigo-900/30 to-transparent p-2.5 rounded-xl border-r-2 border-indigo-500 flex justify-between items-center">
                  <div className="space-y-0.5">
                    <span className="text-[9px] text-indigo-300 font-black block">خروجی پورتال تحلیلی مریم حسینی</span>
                    <strong className="text-xs text-white block">داشبورد زنده دانش‌آموز</strong>
                  </div>
                  <span className="bg-indigo-900 border border-indigo-800 text-indigo-300 font-black text-[9px] px-2 py-0.5 rounded-md">
                    موازنه فعال کایزن
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="bg-slate-900 p-2 rounded-xl">
                    <span className="text-[8px] text-slate-450 font-bold block">تعادل روزانه کایزن</span>
                    <strong className="text-[11px] text-indigo-300 font-black">{toPersianNum(studyHours)} ساعت درسی</strong>
                  </div>
                  <div className="bg-slate-900 p-2 rounded-xl">
                    <span className="text-[8px] text-slate-450 font-bold block">میزان تسلط بر تله‌ها</span>
                    <strong className="text-[11px] text-emerald-400 font-black">{toPersianNum(trapAccuracy)}٪ دقت بیوفیدبک</strong>
                  </div>
                  <div className="bg-indigo-950 border border-indigo-900 p-2 rounded-xl">
                    <span className="text-[8px] text-amber-400 font-bold block">تراز شبیه‌سازی‌شده</span>
                    <strong className="text-[11px] text-amber-300 font-black">{toPersianNum(simulatedUpgradedTraza)}</strong>
                    <span className="text-[7px] text-emerald-400 font-black block">({toPersianNum(`+${levelUpScore}`)} لول‌آپ)</span>
                  </div>
                </div>

                <div className="text-[8px] text-center text-slate-400 font-bold block">تراز رشد یافته ترنم مهر</div>

                <button 
                  onClick={() => handleDemoLogin("guest", "student", "مریم حسینی", "دوازدهم تجربی - تراز فرضی ۶۸۲۰")}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-heavy text-xs py-2 rounded-xl transition-all flex items-center justify-center gap-1 cursor-pointer active:scale-95"
                >
                  <span>ورود به پورتال هوشمند دانش‌آموز</span>
                  <ArrowLeft size={12} className="rotate-180" />
                </button>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 🎯 Section 2: CHARACTER SELECT (لابی انتخابی نقش‌ها) */}
      <section className="bg-white border-y border-slate-100 py-10" id="character-select">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-right">
            <div className="space-y-1">
              <h2 className="text-base font-black text-slate-900 flex items-center justify-center md:justify-start gap-1.5">
                <Award className="text-indigo-600 animate-bounce" size={18} />
                <span>🎯 لابی انتخابی نقش‌ها (Character Select)</span>
              </h2>
              <p className="text-xs text-slate-500 font-bold">
                نقش دلخواهت را برای تجربه ماجراجویی کنکور انتخاب کن!
              </p>
            </div>

            {/* Toggle buttons to switch perspective */}
            <div className="bg-slate-100 p-1 rounded-xl flex items-center gap-1 border border-slate-200">
              <button 
                onClick={() => setCharacterTab("student")}
                className={`px-4 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer ${characterTab === "student" ? "bg-indigo-600 text-white shadow-sm" : "text-slate-650 hover:text-slate-900"}`}
              >
                👩‍🎓 دانش‌آموزان کنکوری
              </button>
              <button 
                onClick={() => setCharacterTab("staff")}
                className={`px-4 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer ${characterTab === "staff" ? "bg-indigo-600 text-white shadow-sm" : "text-slate-650 hover:text-slate-900"}`}
              >
                👨‍🏫 مشاوران و اولیا
              </button>
            </div>
          </div>

          <p className="text-xs text-slate-400 font-extrabold text-center md:text-right">
            داوطلبان، مشاورین یا دبیران؟ دکمه بالا را تغییر دهید و روی یکی از نقش‌های آماده زیر کلیک کنید تا بلافاصله بدون ثبت‌نام وارد محیط شگفت‌انگیز پلتفرم شوید!
          </p>

          {/* Character selection Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            
            {characterTab === "student" ? (
              <>
                {/* Maryam Hosseini Card */}
                <div className="bg-slate-50 rounded-2xl p-6 border border-slate-150 hover:border-indigo-300 transition-all duration-300 relative group flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2.5">
                        <div className="p-2.5 bg-indigo-50 text-indigo-700 rounded-xl">
                          <User size={18} />
                        </div>
                        <div className="space-y-0.5">
                          <strong className="text-sm font-black text-slate-900">مریم حسینی</strong>
                          <span className="text-[10px] text-indigo-600 font-bold block">رشته علوم تجربی دوازدهم</span>
                        </div>
                      </div>
                      <span className="bg-emerald-50 text-emerald-700 text-[9px] font-black px-2 py-0.5 rounded-md">تراز هدف: پزشکی تهران 🩺</span>
                    </div>

                    <p className="text-xs text-slate-550 leading-relaxed font-semibold">
                      دیدن برنامه‌ریزی کایزن، قفل‌شکنی تله‌های کنکور، نمودارهای لول‌آپ عاطفی و بیوفیدبک استرس به سبک بازی‌های فکری!
                    </p>
                  </div>
                  
                  <div className="pt-4 mt-4 border-t border-slate-200/60 flex justify-between items-center">
                    <span className="text-[9px] text-slate-400 font-bold">پسته کایزن فعال</span>
                    <button 
                      onClick={() => handleDemoLogin("1", "student", "مریم حسینی", "دوازدهم تجربی - تراز فرضی ۶۸۲۰")}
                      className="bg-indigo-600 hover:bg-slate-900 group-hover:bg-indigo-700 text-white font-heavy text-xs px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1 active:scale-95"
                    >
                      <span>ورود به عنوان دانش‌آموز کنکوری</span>
                    </button>
                  </div>
                </div>

                {/* Sina Rahmani Card */}
                <div className="bg-slate-50 rounded-2xl p-6 border border-slate-150 hover:border-violet-300 transition-all duration-300 relative group flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2.5">
                        <div className="p-2.5 bg-violet-50 text-violet-700 rounded-xl">
                          <User size={18} />
                        </div>
                        <div className="space-y-0.5">
                          <strong className="text-sm font-black text-slate-900">رضا کریمی</strong>
                          <span className="text-[10px] text-violet-600 font-bold block">داوطلب ریاضی فیزیک</span>
                        </div>
                      </div>
                      <span className="bg-violet-50 text-violet-700 text-[9px] font-black px-2 py-0.5 rounded-md">برنامه نویسی شریف 💻</span>
                    </div>

                    <p className="text-xs text-slate-550 leading-relaxed font-semibold">
                      تحلیل خطاهای تکراری دفترچه سوال حسابان و فیزیک کنکور به همراه نمودارهای پایداری و رفع افت انگیزه تحصیلی.
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-200/60 flex justify-between items-center">
                    <span className="text-[9px] text-slate-400 font-bold">ساعت مطالعه متمکز دمو</span>
                    <button 
                      onClick={() => handleDemoLogin("2", "student", "رضا کریمی", "دوازدهم ریاضی - تراز فرضی ۷۱۰۰")}
                      className="bg-slate-900 hover:bg-slate-800 text-white font-heavy text-xs px-4 py-2 rounded-xl transition-all cursor-pointer active:scale-95"
                    >
                      <span>ورود زنده به ماژول / انتخاب کاراکتر</span>
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* Dr. Mehran Kamali Card */}
                <div className="bg-slate-50 rounded-2xl p-6 border border-slate-150 hover:border-emerald-300 transition-all duration-300 relative group flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2.5">
                        <div className="p-2.5 bg-emerald-50 text-emerald-700 rounded-xl">
                          <Users size={18} />
                        </div>
                        <div className="space-y-0.5">
                          <strong className="text-sm font-black text-slate-900">دکتر مهران کمالی</strong>
                          <span className="text-[10px] text-emerald-600 font-bold block">مشاور ارشد تحصیلی کایزن</span>
                        </div>
                      </div>
                      <span className="bg-amber-50 text-amber-700 text-[9px] font-black px-2 py-0.5 rounded-md">نظارت بر رادار سلامت مراجعین</span>
                    </div>

                    <p className="text-xs text-slate-550 leading-relaxed font-semibold">
                      پنل مشاور مجهز به رادار استرس، نمودارهای خستگی و مداخلات مستقیم هوشمند برای کنترل بحران‌های عاطفی کنکور.
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-200/60 flex justify-between items-center">
                    <span className="text-[9px] text-slate-400 font-bold">میزکار مانیتورینگ مربی</span>
                    <button 
                      onClick={() => handleDemoLogin("admin", "counselor", "کمالی", "مشاور کایزن")}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-heavy text-xs px-4 py-2 rounded-xl transition-all cursor-pointer active:scale-95"
                    >
                      <span>ورود زنده به پرتال مربیان</span>
                    </button>
                  </div>
                </div>

                {/* Parents (Manova Dashboard) */}
                <div className="bg-slate-50 rounded-2xl p-6 border border-slate-150 hover:border-amber-300 transition-all duration-300 relative group flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2.5">
                        <div className="p-2.5 bg-amber-50 text-amber-700 rounded-xl">
                          <Heart size={18} className="text-amber-600" />
                        </div>
                        <div className="space-y-0.5">
                          <strong className="text-sm font-black text-slate-900">والدین مریم (خانواده ناظر)</strong>
                          <span className="text-[10px] text-amber-600 font-bold block">سیستم کاهش پالس اضطراب خانه</span>
                        </div>
                      </div>
                      <span className="bg-teal-50 text-teal-700 text-[9px] font-black px-2 py-0.5 rounded-md">پشتیبانی عاطفی بدون جروبحث</span>
                    </div>

                    <p className="text-xs text-slate-550 leading-relaxed font-semibold">
                      پایش ساعت مطالعه زنده و دریافت مستقیم هشدارهای بیوفیدبک بدون ایجاد تنورت تنظیمی برای داوطلبان کنکور.
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-200/60 flex justify-between items-center">
                    <span className="text-[9px] text-slate-400 font-bold">دسترسی موازنه خانواده</span>
                    <button 
                      onClick={() => handleDemoLogin("guest_parent", "parent", "آقای حسینی", "مهر اولیا")}
                      className="bg-amber-600 hover:bg-amber-700 text-white font-heavy text-xs px-4 py-2 rounded-xl transition-all cursor-pointer active:scale-95"
                    >
                      <span>ورود غیرمزاحم اولیا (مانوا)</span>
                    </button>
                  </div>
                </div>
              </>
            )}

          </div>

        </div>
      </section>

      {/* 🧭 Section 3: FEATURE INTERACTIVE MAP (نقشه امکانات قفل‌شکن و تعاملی ما) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10" id="feature-map-section">
        <div className="text-center space-y-2 mb-8">
          <span className="text-[10px] bg-indigo-50 text-indigo-700 font-black px-2.5 py-1 rounded inline-block">
            🧭 نقشه امکانات قفل‌شکن و تعاملی ما
          </span>
          <h2 className="text-base sm:text-lg font-black text-slate-900">
            ویژگی‌های هوشمند و رفیق کنکوری شما
          </h2>
          <p className="text-xs text-slate-450 font-bold">
            با ضربه زدن روی هر ماژول، ترفند فوق‌هوشمند تحصیلی و نحوه عملکرد آن را با انیمیشن درجا باز کنید!
          </p>
        </div>

        {/* Dynamic Accordion Interactive Map */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Tactic 1 */}
          <div 
            onClick={() => setExpandedTactic("t1")}
            className={`p-5 rounded-2xl border transition-all duration-300 cursor-pointer ${expandedTactic === "t1" ? "bg-white border-indigo-500 shadow-md" : "bg-white border-slate-150 hover:border-slate-300"}`}
          >
            <div className="flex items-center justify-between">
              <span className="p-2 bg-indigo-50 text-indigo-600 rounded-xl font-black text-xs">۱</span>
              <span className="text-[10px] text-indigo-500 font-bold">آزمون‌ساز</span>
            </div>
            <h4 className="text-xs font-black text-slate-900 mt-2">🧠 آزمون‌ساز هوشمند و ضد تله تستی</h4>
            
            {expandedTactic === "t1" ? (
              <p className="text-[11px] text-slate-500 leading-relaxed font-bold mt-2 animate-fade-in text-justify">
                تولیدکننده لایو سوالات متصل به زیست و فیزیک با ردیابی کدهای فراشناختی و تخصیص مستقیم تگ‌های اصالت گوگل. زمان استنتاج بر حسب میلی‌ثانیه زیر برگه ممهور می‌شود.
              </p>
            ) : (
              <span className="text-[9px] text-indigo-600 font-bold mt-2 block">کلیک کنید برای نمایش انیمیشن ویژگی...</span>
            )}
          </div>

          {/* Tactic 2 */}
          <div 
            onClick={() => setExpandedTactic("t2")}
            className={`p-5 rounded-2xl border transition-all duration-300 cursor-pointer ${expandedTactic === "t2" ? "bg-white border-violet-500 shadow-md" : "bg-white border-slate-150 hover:border-slate-300"}`}
          >
            <div className="flex items-center justify-between">
              <span className="p-2 bg-violet-50 text-violet-600 rounded-xl font-black text-xs">۲</span>
              <span className="text-[10px] text-violet-500 font-bold">عیب‌یاب روانی</span>
            </div>
            <h4 className="text-xs font-black text-slate-900 mt-2">🧬 پنل پایش اضطراب و لول‌آپ عاطفی</h4>
            
            {expandedTactic === "t2" ? (
              <p className="text-[11px] text-slate-500 leading-relaxed font-bold mt-2 animate-fade-in text-justify">
                دیگر نیاز به کدهای پیچیده روان‌سنجی نیست. چت‌بات بیوفیدبک سلامت عاطفی، نمودار اضطراب داوطلبان را رسم کرده و موازنه روزانه مطالعه را آرام‌آرام کالیبره می‌کند.
              </p>
            ) : (
              <span className="text-[9px] text-violet-600 font-bold mt-2 block">کلیک کنید برای نمایش انیمیشن ویژگی...</span>
            )}
          </div>

          {/* Tactic 3 */}
          <div 
            onClick={() => setExpandedTactic("t3")}
            className={`p-5 rounded-2xl border transition-all duration-300 cursor-pointer ${expandedTactic === "t3" ? "bg-white border-emerald-500 shadow-md" : "bg-white border-slate-150 hover:border-slate-300"}`}
          >
            <div className="flex items-center justify-between">
              <span className="p-2 bg-emerald-50 text-emerald-600 rounded-xl font-black text-xs">۳</span>
              <span className="text-[10px] text-emerald-500 font-bold">کایزن پایدار</span>
            </div>
            <h4 className="text-xs font-black text-slate-900 mt-2">🔋 رادار کایزن و برنامه مطالعه پایدار</h4>
            
            {expandedTactic === "t3" ? (
              <p className="text-[11px] text-slate-500 leading-relaxed font-bold mt-2 animate-fade-in text-justify">
                متد علمی که به داوطلبان کمک می‌کند خستگی تستی را با اضافه کردن تدریجی ساعات تمرکز کتب‌شناختی درمان کنند. به دور از فشارهای بی‌دلیل کنکوری.
              </p>
            ) : (
              <span className="text-[9px] text-emerald-600 font-bold mt-2 block">کلیک کنید برای نمایش انیمیشن ویژگی...</span>
            )}
          </div>

          {/* Tactic 4 */}
          <div 
            onClick={() => setExpandedTactic("t4")}
            className={`p-5 rounded-2xl border transition-all duration-300 cursor-pointer ${expandedTactic === "t4" ? "bg-white border-amber-500 shadow-md" : "bg-white border-slate-150 hover:border-slate-300"}`}
          >
            <div className="flex items-center justify-between">
              <span className="p-2 bg-amber-50 text-amber-600 rounded-xl font-black text-xs">۴</span>
              <span className="text-[10px] text-amber-500 font-bold">اولیا (مانوا)</span>
            </div>
            <h4 className="text-xs font-black text-slate-900 mt-2">🕵️ پورتال نظارت غیرمزاحم اولیا (مانوا)</h4>
            
            {expandedTactic === "t4" ? (
              <p className="text-[11px] text-slate-500 leading-relaxed font-bold mt-2 animate-fade-in text-justify">
                سیستم با همگام‌سازی ساده، نمودار تراز فعال را برای والدین ترسیم می‌کند تا از هرگونه تنش بی‌مورد تحصیلی جلوگیری شود و تعامل صمیمانه برقرار گردد.
              </p>
            ) : (
              <span className="text-[9px] text-amber-600 font-bold mt-2 block">کلیک کنید برای نمایش انیمیشن ویژگی...</span>
            )}
          </div>

        </div>
      </section>

      {/* 💡 Section 4: KNOWLEDGE BASE / FAQ (تالار دانشنامه و عیب‌یابی کنکور) */}
      <section className="bg-slate-100/60 border-y border-slate-200/50 py-12" id="faq-knowledge-hall">
        <div className="max-w-5xl mx-auto px-4 space-y-6">
          <div className="text-center space-y-1.5">
            <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center justify-center gap-1.5">
              <BookOpen className="text-indigo-600" size={18} />
              <span>💡 تالار دانشنامه و عیب‌یابی کنکور</span>
            </h2>
            <p className="text-xs text-slate-500 font-bold">
              پاسخ به چالش‌ها و یادداشت‌های طلایی ارتقای تراز
            </p>
          </div>

          {/* Navigation Tabs */}
          <div className="flex justify-center gap-2">
            <button 
              onClick={() => setFaqTab("faq")}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-colors cursor-pointer ${faqTab === "faq" ? "bg-indigo-600 text-white" : "bg-white border border-slate-200 text-slate-650 hover:bg-slate-50"}`}
            >
              💬 پرسش‌های متداول
            </button>
            <button 
              onClick={() => setFaqTab("notes")}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-colors cursor-pointer ${faqTab === "notes" ? "bg-indigo-600 text-white" : "bg-white border border-slate-200 text-slate-650 hover:bg-slate-50"}`}
            >
              📰 یادداشت‌های طلایی کنکور
            </button>
          </div>

          <p className="text-[11px] text-slate-400 font-extrabold text-center">
            از بین تب‌های بالا انتخاب کنید تا پاسخ مستقیم یا مقاله مرتبط باز شود
          </p>

          {/* Tab contents */}
          <div className="bg-white rounded-2xl border border-slate-150 p-5 space-y-4">
            {faqTab === "faq" ? (
              <div className="space-y-3">
                {/* Q1 */}
                <div className="border-b border-slate-50 pb-3">
                  <button 
                    onClick={() => setExpandedFaq(expandedFaq === 0 ? null : 0)}
                    className="w-full text-right font-black text-xs text-slate-900 flex justify-between items-center py-2 focus:outline-none"
                  >
                    <span>من یک دانش‌آموز خسته از ساعت‌های هوای شدید هستم، آیا کایزن واقعاً برای من جواب می‌دهد؟</span>
                    <span className="text-indigo-600 font-mono font-bold text-xs">{expandedFaq === 0 ? "−" : "+"}</span>
                  </button>
                  {expandedFaq === 0 && (
                    <p className="text-xs text-slate-600 leading-relaxed font-semibold mt-2 animate-fade-in pr-2">
                      کاملاً! برنامه‌ریزی سنتی اصرار دارد از فردا روزی ۱۲ ساعت درس بخوانید که نهایتاً بعد از چند روز فرسوده می‌شوید. متد کایزن با افزایش تدریجی ۱۵ دقیقه‌ای و تمرکز روی پایداری گام‌به‌گام با بیوفیدبک، لذت مطالعه را بدون قفل کردن ذهن برایتان فراهم می‌سازد.
                    </p>
                  )}
                </div>

                {/* Q2 */}
                <div className="border-b border-slate-50 pb-3">
                  <button 
                    onClick={() => setExpandedFaq(expandedFaq === 1 ? null : 1)}
                    className="w-full text-right font-black text-xs text-slate-900 flex justify-between items-center py-2 focus:outline-none"
                  >
                    <span>ماژول عیب‌یاب تله تستی چطور از بی‌دقتی‌های همیشگی من در محاسبات جلوگیری می‌کند؟</span>
                    <span className="text-indigo-600 font-mono font-bold text-xs">{expandedFaq === 1 ? "−" : "+"}</span>
                  </button>
                  {expandedFaq === 1 && (
                    <p className="text-xs text-slate-600 leading-relaxed font-semibold mt-2 animate-fade-in pr-2">
                      این سیستم تست‌های استاندارد سراسری را کالیبره کرده و اشتباهاتی مثل ضرب اشتباه علائم ریاضی یا کلمات کلیدی گمراه‌کننده طراح کنپور را در بانک سوالات به صورت رنگی به شما یادآوری کرده تا ذهن شما واکسینه و هوشیار باقی بماند.
                    </p>
                  )}
                </div>

                {/* Q3 */}
                <div>
                  <button 
                    onClick={() => setExpandedFaq(expandedFaq === 2 ? null : 2)}
                    className="w-full text-right font-black text-xs text-slate-900 flex justify-between items-center py-2 focus:outline-none"
                  >
                    <span>پورتال والدین چطور به آرامش روانی من در خانه کمک می‌کند؟</span>
                    <span className="text-indigo-600 font-mono font-bold text-xs">{expandedFaq === 2 ? "−" : "+"}</span>
                  </button>
                  {expandedFaq === 2 && (
                    <p className="text-xs text-slate-600 leading-relaxed font-semibold mt-2 animate-fade-in pr-2">
                      پدر و مادرها با ورود به پنل، تلاش‌های مستمر شما را رصد می‌کنند و بدون تنش فیزیکی یا رفتارهای فرساینده، در جریان رشد ساعات مطالعه شما قرار گرفته و با آرامش در کنار شما ایستادگی می‌کنند.
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-4 text-xs font-semibold leading-relaxed text-slate-600 text-justify">
                <div className="bg-amber-50/50 p-4 rounded-xl border border-amber-100 text-amber-950 font-black">
                  📌 تحلیل‌های فراشناختی آزمون‌ها بر اساس تست‌های استاندارد سراسری کالیبره شده است.
                </div>
                <p>
                  یادداشت طلایی ۱: زیست شناسی را بر اساس کلمات قید گذاری شده طراح بررسی کنید. قیدهای تله‌دار مثل «جملگی»، «اکثر قریب به اتفاق» همواره ذهن پر استرس داوطلب را به دام می‌اندازند. مربی کایزن این کار را با عیب‌یابی منظم لایت‌باکس‌های هوش مصنوعی ساده کرده است.
                </p>
                <p>
                  یادداشت طلایی ۲: کارهای روزمره را به کارهای کوچک تر خرد کنید. اگر یک فصل بزرگ زمین‌شناسی دارید، اول ۱۰ سوال کوتاه جهت سنجش بگیرید تا استروئید مغزی برای خواندن به کار آید!
                </p>
              </div>
            )}
          </div>

        </div>
      </section>

      {/* 💼 Section 5: REQUEST FORM / CONSULTATION (رزرو مشاوره و برنامه‌ریزی کایزن) */}
      <section className="max-w-4xl mx-auto px-4 py-12" id="consultation-reserve">
        <div className="bg-white rounded-3xl border border-slate-150 p-6 sm:p-10 shadow-sm space-y-6">
          
          <div className="text-center space-y-1.5 border-b border-slate-50 pb-4">
            <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center justify-center gap-1.5">
              <Mail className="text-indigo-600" size={18} />
              <span>رزرو مشاوره و برنامه‌ریزی کایزن</span>
            </h2>
            <p className="text-xs text-slate-500 font-black">
              برنامه‌ریزی لول‌آپ با مشاوران ترنم مهر
            </p>
            <p className="text-[10px] text-slate-450 font-semibold p-1">
              مشخصات و بیشترین چالش‌های درسی خود را اینجا نام ببرید تا پشتیبان ارشد جهت کمک اختصاصی با شما مکالمه کند.
            </p>
          </div>

          <form onSubmit={submitConsultation} className="space-y-4">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5 text-right">
                <label className="text-[10px] font-black text-slate-500 block">نام گرانبهای متقاضی (دانش‌آموز یا والد):</label>
                <input 
                  type="text" 
                  required
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  placeholder="مانند: حسین کریمی"
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-white text-xs font-black focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="space-y-1.5 text-right">
                <label className="text-[10px] font-black text-slate-500 block">شماره همراه شما:</label>
                <input 
                  type="text" 
                  required
                  value={studentPhone}
                  onChange={(e) => setStudentPhone(e.target.value)}
                  placeholder="۰۹۱۲۳۴۵۶۷۸۹"
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-white text-xs font-black font-sans focus:outline-none focus:ring-1 focus:ring-indigo-500 tracking-wider"
                />
              </div>
            </div>

            <div className="space-y-1.5 text-right">
              <label className="text-[10px] font-black text-slate-500 block">شاخه کنکوری:</label>
              <select 
                value={fieldOfStudy}
                onChange={(e) => setFieldOfStudy(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-white text-xs font-black focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value="تجربی">علوم تجربی</option>
                <option value="ریاضی">ریاضی و فیزیک</option>
                <option value="انسانی">علوم انسانی</option>
              </select>
            </div>

            <div className="space-y-1.5 text-right">
              <label className="text-[10px] font-black text-slate-500 block">بزرگترین مشکل درسی شما چیست؟</label>
              <textarea 
                rows={3}
                value={challengeMsg}
                onChange={(e) => setChallengeMsg(e.target.value)}
                placeholder="مثال: بی‌دقتی در جواب دادن، خستگی بعد از ۴ ساعت مطالعه، ناامیدی..."
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-white text-xs font-black focus:outline-none focus:ring-1 focus:ring-indigo-500 leading-relaxed"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitted}
              className="w-full bg-indigo-600 hover:bg-slate-950 text-white font-heavy text-xs py-3 rounded-xl transition-all shadow-md active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-75"
            >
              {isSubmitted ? (
                <>
                  <CheckCircle size={14} className="text-emerald-400 animate-pulse" />
                  <span>درخواست با موفقیت در صف پشتیبانی ثبت شد! تماس تا ساعاتی دیگر...</span>
                </>
              ) : (
                <span>ثبت درخواست مشاوره و مربیگری</span>
              )}
            </button>

          </form>

        </div>
      </section>

      {/* 📍 Section 6: BRANCH ADDRESS & CONTACTS */}
      <section className="bg-slate-100 border-t border-slate-200/50 py-10" id="branch-locations">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Real information cards */}
            <div className="bg-white p-6 rounded-2xl border border-slate-150 shadow-sm space-y-4">
              <h4 className="text-xs font-black text-indigo-900 flex items-center gap-1.5">
                <MapPin size={16} />
                <span>📍 نشانی دپارتمان ترنم مهر</span>
              </h4>
              
              <p className="text-xs text-slate-600 font-semibold leading-relaxed">
                آتلیه و لابراتوار مشاوره تحصیلی و همبستگی خانواده در قلب پایتخت واقع گردیده است.
              </p>

              <div className="space-y-2.5 text-xs text-slate-700 font-semibold border-t border-slate-50 pt-3">
                <div className="space-y-0.5">
                  <span className="text-slate-450 block text-[10px]">موقعیت دفتر مرکزی:</span>
                  <p className="text-slate-900">تهران، میدان انقلاب اسلامی، خیابان کارگر شمالی، مجاورت کانون شتابدهی علمی، طبقه ۳، واحد ۱۲</p>
                </div>

                <div className="space-y-0.5">
                  <span className="text-slate-450 block text-[10px]">شماره هماهنگی و مشاوره:</span>
                  <p className="text-indigo-600 font-sans tracking-tight">
                    روابط عمومی آکادمی: <span className="font-extrabold text-slate-900 mr-0.5">۰۲۱-۸۸۲۲۴۴۰۰</span> | سامانه پیامکی همیاری کنکور: <span className="font-extrabold text-slate-900 mr-0.5">۱۰۰۰۸۸۲۲۴۴۰۰</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Stylized Visual map wrapper */}
            <div className="bg-white p-6 rounded-2xl border border-slate-150 shadow-sm flex flex-col justify-between space-y-3">
              <div className="space-y-0.5">
                <span className="text-[10px] text-slate-400 font-bold block">محدوده میدان انقلاب و کارگر شمالی</span>
                <strong className="text-xs text-slate-800 block">مرکز خدمات سنجش کایزنی ترنم همدلی</strong>
              </div>

              {/* Graphical vector styled representation of city map */}
              <div className="bg-gradient-to-tr from-slate-50 to-indigo-50/50 h-28 rounded-xl border border-slate-150 flex items-center justify-center p-3 relative overflow-hidden">
                <div className="absolute inset-0 opacity-15" style={{ backgroundImage: "radial-gradient(#4f46e5 1.5px, transparent 1.5px)", backgroundSize: "16px 16px" }} />
                <div className="bg-white py-1 px-3.5 rounded-full border border-indigo-200/60 text-[10px] font-black text-indigo-700 shadow-sm flex items-center gap-1.5 relative z-10 animate-pulse">
                  <MapPin size={11} className="text-red-500 animate-bounce" />
                  <span>محدوده دانشگاه تهران و خیابان کارگر شمالی</span>
                </div>
              </div>

              <p className="text-[9px] text-amber-600 font-black text-center">
                پذیرش حضوری صرفاً با فیش دعوت‌نامه و رزرو مقدور است
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* 🚀 Sticky/Clean Footer matching user prompt exactly */}
      <footer className="bg-slate-950 text-white pt-10 pb-6 border-t border-slate-900" id="main-portal-footer">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 border-b border-slate-800/60 pb-8">
            <div className="md:col-span-6 space-y-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-indigo-600 rounded-lg text-white">
                  <Sparkles size={14} />
                </div>
                <strong className="text-sm font-black text-white">آکادمی هوشمند ترنم همدلی</strong>
              </div>
              <p className="text-xs text-slate-405 leading-relaxed font-bold max-w-lg text-justify">
                دستیار آمادگی، رفع خطاهای بی‌دقتی و برقراری ارتباط صمیمانه با اولیا بدون تنش‌های مخرب دوره کنکور سراسری. ما در ترنم مهر تلاش می‌کنیم ذهن شما را در بالاترین حالت پایداری عاطفی و آمادگی درسی نگه داریم.
              </p>
            </div>

            {/* Menu Nav lists */}
            <div className="md:col-span-3 space-y-2.5">
              <span className="text-[10px] text-slate-400 font-black block tracking-wider">منو ناوبری</span>
              <ul className="text-xs text-slate-300 space-y-2 font-bold">
                <li><a href="#welcome-hero" className="hover:text-white transition-colors">پیشواز صفحه اول</a></li>
                <li><a href="#character-select" className="hover:text-white transition-colors">نقش‌های آماده و دمو</a></li>
                <li><a href="#feature-map-section" className="hover:text-white transition-colors">آشنایی با قابلیت‌ها</a></li>
                <li><a href="#faq-knowledge-hall" className="hover:text-white transition-colors">دانشنامه و یادداشت‌ها</a></li>
                <li><a href="#consultation-reserve" className="hover:text-white transition-colors">پشتیبانی و همیاری</a></li>
              </ul>
            </div>

            {/* Support and telephone */}
            <div className="md:col-span-3 space-y-2.5 text-xs text-slate-300 font-bold">
              <span className="text-[10px] text-slate-400 font-black block tracking-wider">پشتیبانی و همیاری</span>
              <p className="flex items-center gap-1.5">
                <Phone size={12} className="text-indigo-400" />
                <span>تلفن روابط عمومی: <span className="font-sans font-extrabold text-white">021-88224400</span></span>
              </p>
              <p className="text-slate-400 leading-relaxed block text-[11px]">
                بلوار کشاورز دپارتمان فناوری‌های مربیگری علمی. تمام قابلیت‌های دانش‌آموزی کاملاً شبیه‌سازی گردیده‌اند.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-450 font-extrabold gap-4">
            <p className="text-center sm:text-right">
              © ۱۴۰۵ آکادمی تخصصی علمی ترنم همدلی. تمامی حقوق محفوظ است.
            </p>
            <p className="text-indigo-400 font-black tracking-wider shadow-sm px-3.5 py-1 rounded bg-slate-900 border border-slate-800">
              طراحی بر پایه روانشناسی فراشناختی کنکور
            </p>
          </div>

        </div>
      </footer>

    </div>
  );
}
