import React, { useState } from 'react';
import { 
  Sparkles, User, Users, Brain, Target, 
  ArrowLeft, Activity, HelpCircle, CheckCircle,
  Zap, Phone, Globe, Mail, Clock, Award,
  Star, LayoutGrid, Fingerprint, Building2, BarChart3, Home, LayoutDashboard,
  ShoppingBag, BookOpen, MessageCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
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
  const [showConsultationForm, setShowConsultationForm] = useState(false);

  // FAQ/Knowledge Base Tabs
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);

  // Reservation Form State
  const [studentName, setStudentName] = useState("");
  const [studentPhone, setStudentPhone] = useState("");
  const [fieldOfStudy, setFieldOfStudy] = useState("تجربی");
  const [challengeMsg, setChallengeMsg] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

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
    <div className="min-h-screen bg-white text-slate-900 font-sans text-right selection:bg-indigo-100 selection:text-indigo-900 relative overflow-x-hidden" style={{ direction: 'rtl' }} id="welcome-portal-root">
      
      {/* 🔮 Background Mesh Orbs (Enhanced Visual Depth) */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute -top-[10%] -right-[5%] w-[40%] h-[40%] bg-indigo-50/50 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute top-[20%] -left-[10%] w-[30%] h-[30%] bg-blue-50/40 rounded-full blur-[100px]" />
        <div className="absolute -bottom-[5%] right-[20%] w-[35%] h-[35%] bg-violet-50/30 rounded-full blur-[110px] animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* 🚀 Dynamic Floating Header */}
      <header className="sticky top-0 z-50 transition-all duration-500" id="welcome-sticky-nav">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="bg-white/70 backdrop-blur-xl border border-slate-200/50 rounded-3xl shadow-sm hover:shadow-md transition-all duration-300 px-4 sm:px-6 h-16 flex items-center justify-between">
            
            <div className="flex items-center gap-8">
              {/* Elegant Brand Identity */}
              <div className="flex items-center gap-3 group cursor-pointer">
                <div className="p-2 bg-indigo-600 text-white rounded-2xl shadow-lg shadow-indigo-200 group-hover:scale-110 transition-transform duration-500">
                  <Sparkles size={20} className="animate-pulse" />
                </div>
                <div className="space-y-0.5">
                  <h1 className="text-sm font-black text-slate-900 tracking-tight leading-none">ترنم همدلی</h1>
                  <span className="text-[10px] text-indigo-600 font-extrabold tracking-widest block">همراه گام‌به‌گام در مسیر یادگیری</span>
                </div>
              </div>

              {/* Enhanced Links */}
              <nav className="hidden lg:flex items-center gap-1 text-[11px] font-black text-slate-500">
                {[
                  { id: "hero", label: "خانه", icon: Home },
                  { id: "features", label: "قابلیت‌ها", icon: Zap },
                  { id: "plans", label: "خدمات", icon: LayoutGrid },
                  { id: "shop", label: "فروشگاه", icon: ShoppingBag },
                  { id: "blog", label: "وبلاگ", icon: BookOpen },
                  { id: "faq", label: "تماس با ما", icon: MessageCircle },
                ].map((link) => (
                  <a 
                    key={link.id}
                    href={`#${link.id}`} 
                    className="px-4 py-2 rounded-xl hover:bg-slate-100/50 hover:text-indigo-600 transition-all active:scale-95 flex items-center gap-1.5"
                  >
                    <link.icon size={13} className="text-indigo-400 group-hover:text-indigo-600" />
                    <span>{link.label}</span>
                  </a>
                ))}
              </nav>
            </div>

            <div className="flex items-center gap-3">
              <button 
                onClick={() => onNavigate("login")} 
                className="bg-slate-900 hover:bg-indigo-600 text-white text-[11px] font-black px-6 py-2.5 rounded-2xl transition-all duration-300 active:scale-95 shadow-lg shadow-slate-200 hover:shadow-indigo-200 cursor-pointer flex items-center gap-2"
              >
                <span>ورود به سامانه</span>
                <ArrowLeft size={14} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* 🚀 Premium Hero Section */}
      <section className="relative pt-12 pb-24 md:pt-20 md:pb-28" id="hero">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center text-center space-y-12">
            
            {/* AI Status Badge */}
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2.5 px-5 py-2 bg-white border border-indigo-100 text-indigo-700 rounded-full text-[10px] font-black shadow-sm ring-4 ring-indigo-50/30"
            >
              <div className="flex items-center gap-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-600"></span>
                </span>
                <span>هوش مصنوعی فعال — Gemini 2.0 Flash</span>
              </div>
            </motion.div>

            {/* Main Heading with Dynamic Typography */}
            <div className="space-y-8 max-w-5xl">
              <motion.h1 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-5xl md:text-7xl lg:text-8xl font-black text-slate-900 leading-[1.1] tracking-tight"
              >
                با هم به <br />
                <span className="relative inline-block mt-4">
                  <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-indigo-700 via-violet-600 to-indigo-700">قبولی برسیم ❤️</span>
                  <div className="absolute -bottom-3 left-0 w-full h-5 bg-indigo-100/60 -rotate-1 -z-10 rounded-full blur-md" />
                </span>
              </motion.h1>

              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                viewport={{ once: true }}
                className="text-lg md:text-2xl text-slate-600 font-bold max-w-3xl leading-relaxed mx-auto"
              >
                معلم خصوصی هوشمندِ تو که ۲۴ ساعته کنارت هست. <br className="hidden md:block" />
                درس‌ها رو برات ساده می‌کنیم، با هم برنامه می‌ریزیم و هر جا خسته شدی، بهت دل و جرات می‌دیم.
              </motion.p>
            </div>

            {/* Premium CTAs */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              viewport={{ once: true }}
              className="flex flex-col sm:flex-row gap-6 pt-4"
            >
              <button 
                onClick={() => onNavigate("login")}
                className="group px-12 py-6 bg-indigo-600 hover:bg-slate-900 text-white font-heavy rounded-[2.5rem] shadow-2xl shadow-indigo-200 hover:shadow-slate-300 transition-all duration-500 active:scale-95 flex items-center justify-center gap-4 overflow-hidden relative"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                <span className="text-lg">رایگان شروع کنیم</span>
                <ArrowLeft size={24} className="group-hover:-translate-x-2 transition-transform" />
              </button>
              <button 
                className="px-12 py-6 bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 font-heavy rounded-[2.5rem] transition-all shadow-xl shadow-slate-100 active:scale-95 flex items-center justify-center gap-3"
              >
                <HelpCircle size={22} className="text-indigo-500" />
                <span className="text-lg">ببینیم چطور کار می‌کنه</span>
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              viewport={{ once: true }}
              className="flex flex-col items-center gap-4 pt-4"
            >
              <p className="text-[11px] text-slate-400 font-bold flex items-center gap-2">
                <CheckCircle size={14} className="text-emerald-500" />
                <span>بدون تبلیغات مزاحم — فقط تمرکز روی آینده‌ی تو</span>
              </p>
              <div className="flex items-center gap-2 px-4 py-1.5 bg-slate-50 rounded-full border border-slate-100">
                <Users size={12} className="text-indigo-400" />
                <span className="text-[10px] text-slate-500 font-black">بیش از ۱۰,۰۰۰ دانش‌آموز امسال با ما همراه شدند</span>
              </div>
            </motion.div>

            {/* Floating Trust Bar */}
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              viewport={{ once: true }}
              className="w-full max-w-5xl pt-16"
            >
              <div className="bg-white/60 backdrop-blur-2xl border border-white/80 rounded-[3.5rem] p-6 md:p-10 grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-12 shadow-xl shadow-slate-100/50">
                <StatItem icon={<Users size={20} />} label="همسفران مسیر یادگیری" value="+۱۰,۰۰۰" />
                <StatItem icon={<Building2 size={20} />} label="مراکز علمی همراه" value="+۵۰۰" />
                <StatItem icon={<Award size={20} />} label="تعهد به کیفیت" value="تجربه برتر" />
                <StatItem icon={<Fingerprint size={20} />} label="دقت در تحلیل" value="آگاهی کامل" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 💎 Section 2: Smart Tools (Bento Grid Style) */}
      <section className="py-24 relative overflow-hidden" id="features">
        {/* Decorative background elements for this section */}
        <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-indigo-50/30 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-[40%] h-[40%] bg-violet-50/20 rounded-full blur-[100px] translate-y-1/4 -translate-x-1/4" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col items-center text-center space-y-6 mb-24 max-w-4xl mx-auto">
            <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-5 py-2 rounded-full border border-indigo-100 uppercase tracking-[0.2em] leading-none mb-2">
              Our Compassion
            </span>
            <h2 className="text-4xl md:text-6xl font-black text-slate-900 leading-[1.2] tracking-tight">همراهی هوشمند <br /><span className="text-transparent bg-clip-text bg-gradient-to-l from-indigo-600 to-indigo-400">در کنار یادگیری شما</span></h2>
            <div className="w-24 h-1.5 bg-indigo-600/10 rounded-full mt-4" />
            <p className="text-lg md:text-xl text-slate-500 font-bold max-w-3xl leading-relaxed mt-6">
              ما در کنار شما هستیم تا با پایش مداوم و همدلی، چالش‌های مسیر تحصیلی را به فرصت‌هایی برای رشد و آرامش تبدیل کنیم.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-6 lg:grid-cols-12 gap-6">
            <BentoCard 
              className="md:col-span-3 lg:col-span-4"
              color="indigo"
              icon={<Brain size={24} />}
              title="دستیار شخصی و صبور"
              desc="دیگه لازم نیست بین هزارتا منبع گم بشی. معلم هوشمندت بر اساسِ خودِ تو، بهترین راه رو پیدا می‌کنه."
              badge="صمیمانه"
            />
            <BentoCard 
              className="md:col-span-3 lg:col-span-8"
              color="violet"
              icon={<BarChart3 size={24} />}
              title="خودشناسی تحصیلی با مانوا"
              desc="ببین کجاها واقعاً وقتت تلف می‌شه و کدوم ساعت‌ها بیشترین بازدهی رو داری. ما بهت کمک می‌کنیم خودت رو بهتر بشناسی تا هوشمندانه‌تر تلاش کنی."
              image="https://images.unsplash.com/photo-1551288049-bbbda536639a?auto=format&fit=crop&q=80&w=800"
            />
            <BentoCard 
              className="md:col-span-6 lg:col-span-4"
              color="emerald"
              icon={<Target size={24} />}
              title="حلِ چالش‌های تستی"
              desc="هر تستی که اشتباه می‌زنی، یه فرصته. ما تله‌هایی که طراح‌ها برات گذاشتن رو برات کالبدشکافی می‌کنیم."
            />
            <BentoCard 
              className="md:col-span-3 lg:col-span-4"
              color="rose"
              icon={<Activity size={24} />}
              title="آرامش و سلامتِ ذهن"
              desc="کنکور فقط درس نیست. ما حواسمون به سطح استرس و خستگی‌ت هست تا همیشه با انرژیِ خوب درس بخونی."
            />
            <BentoCard 
              className="md:col-span-3 lg:col-span-4"
              color="amber"
              icon={<LayoutDashboard size={24} />}
              title="برنامه‌ریزی که باهات راه میاد"
              desc="برنامه‌ای که خشک نیست! اگه یه روز خسته بودی، باهات هماهنگ می‌شه تا هیچ‌وقت احساس عقب‌موندگی نکنی."
            />
          </div>
        </div>
      </section>

      {/* 🤝 Section 3: For Groups (SaaS Layers) */}
      <section className="py-24 bg-slate-50 relative overflow-hidden" id="plans">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-20">
          
          <div className="max-w-2xl mx-auto space-y-4">
            <h2 className="text-3xl md:text-4xl font-black text-slate-900">همراه شما در تمام سطوح</h2>
            <p className="text-slate-500 font-bold">از فرد تا بزرگترین آکادمی‌های آموزشی ایران</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            <PlanCard 
              title="همراهی در یادگیری"
              price="شروع منعطف"
              features={["مشاور همراه محدود", "داشبورد پایه خودشناسی", "تحلیل تله‌های درسی", "همگامی روزانه"]}
              btnText="شناخت بیشتر"
              icon={<User size={24} />}
              onNavigate={() => onNavigate("login")}
            />
            <PlanCard 
              recommended
              title="همیار خانواده و مربی"
              price="اشتراک همدلی"
              features={["مشاور همراه نامحدود", "آنالیز عمیق فراشناختی", "داشبورد مشترک خانواده", "راهنمای اختصاصی"]}
              btnText="همگام شدن با کایزن"
              icon={<Zap size={24} />}
              onNavigate={() => handleDemoLogin("1", "student", "مریم حسینی", "دوازدهم تجربی")}
            />
            <PlanCard 
              title="آکادمی‌ و مدارس"
              price="پلن سازمانی"
              features={["اتصال به سایت وردپرس شما", "داشبورد مرکزی مدیر", "مدیریت ۵۰۰+ دانش‌آموز", "برندینگ اختصاصی"]}
              btnText="مشاوره همکاری"
              icon={<Building2 size={24} />}
              onNavigate={() => handleDemoLogin("admin", "admin", "مدیر سیستم", "مدیر آکادمی")}
            />
          </div>
        </div>
      </section>

      {/* 💬 Section 4: Elegant Testimonials */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
             <div className="lg:col-span-5 space-y-8">
                <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-4 py-1.5 rounded-full border border-indigo-100 uppercase tracking-widest leading-none">
                  Success Stories
                </span>
                <h2 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight">صدای همسفرانی که <br /> این راه را <span className="text-indigo-600">پشت سر گذاشتند</span></h2>
                <p className="text-base text-slate-500 font-bold leading-relaxed">
                  بیش از ۱۰ هزار دانش‌آموز مثلِ تو امسال توانستند با اعتماد به نفس بیشتری در این مسیر قدم بردارند.
                </p>
                <div className="flex -space-x-3 rtl:space-x-reverse pt-4">
                   {[1,2,3,4,5].map(i => (
                     <div key={i} className="w-12 h-12 rounded-full border-4 border-white bg-slate-100 overflow-hidden shadow-sm">
                       <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=user${i}`} alt="user" className="w-full h-full object-cover" />
                     </div>
                   ))}
                   <div className="w-12 h-12 rounded-full border-4 border-white bg-indigo-600 flex items-center justify-center text-white text-[10px] font-black">
                     +10k
                   </div>
                </div>
             </div>
             
             <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
                <TestimonialCardCompact 
                  quote="ترنم همدلی برای من فراتر از یک اپلیکیشن بود؛ مثل یک برادر بزرگتر که همیشه مراقب بود عقب نیفتم."
                  name="سارا احمدی"
                  rank="رتبه ۱۵۸ تجربی"
                />
                <TestimonialCardCompact 
                  className="sm:mt-8"
                  quote="داشبورد والدین مانوا باعث شد خانواده‌ام به جای استرس دادن، من را در مسیر کنکور حمایت کنند."
                  name="علی رضایی"
                  rank="رتبه ۸۲ ریاضی"
                />
             </div>
           </div>
        </div>
      </section>

      {/* 🏫 Section 5: Trust Banner (Schools/Institutions) */}
      <section className="py-16 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-12">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">همکاران و مراکز علمی همراه</p>
          <div className="flex flex-wrap justify-center items-center gap-12 opacity-50 grayscale hover:opacity-100 transition-all duration-700">
             <div className="flex items-center gap-2 font-black text-xl text-slate-400"><Building2 size={24} /> <span>دبیرستان ماندگار البرز</span></div>
             <div className="flex items-center gap-2 font-black text-xl text-slate-400"><Building2 size={24} /> <span>کانون فرهنگی آموزش</span></div>
             <div className="flex items-center gap-2 font-black text-xl text-slate-400"><Building2 size={24} /> <span>مدرسه فرزانگان</span></div>
             <div className="flex items-center gap-2 font-black text-xl text-slate-400"><Building2 size={24} /> <span>علامه حلی</span></div>
          </div>
        </div>
      </section>

      {/* 🛒 Section 6: Marketplace & Blog Preview (New) */}
      <section className="py-24 bg-slate-50/50 relative border-y border-slate-100" id="shop">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-20">
            {/* Shop Preview */}
            <div className="lg:w-1/2 space-y-12">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-indigo-600">
                  <ShoppingBag size={20} />
                  <span className="text-[10px] font-black uppercase tracking-widest bg-indigo-50 px-3 py-1 rounded-lg">فروشگاه ترنم همدلی</span>
                </div>
                <h2 className="text-4xl font-black text-slate-900 leading-tight">منابع آموزشی <br /> دست‌چین شده</h2>
                <p className="text-base text-slate-500 font-bold leading-relaxed max-w-md">بسته‌های مکمل یادگیری و ابزارهای فیزیکی کایزن برای ارتقای کیفیت مطالعه شما.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                {[
                  { title: "بسته کارت‌های یادگیری عمیق", price: "۱۴۰,۰۰۰ تومان", img: "https://images.unsplash.com/photo-1544640808-32ca72ac7f67?auto=format&fit=crop&q=80&w=400" },
                  { title: "دفتر برنامه‌ریزی کایزنی", price: "۹۵,۰۰۰ تومان", img: "https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&q=80&w=400" }
                ].map((item, idx) => (
                  <div key={idx} className="group cursor-pointer">
                    <div className="aspect-[4/5] rounded-[2.5rem] overflow-hidden mb-5 relative shadow-lg shadow-slate-200/50">
                      <img src={item.img} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </div>
                    <h4 className="text-base font-black text-slate-800 px-2">{item.title}</h4>
                    <p className="text-sm text-indigo-600 font-black mt-2 px-2">{item.price}</p>
                  </div>
                ))}
              </div>
              <button className="text-xs font-black text-slate-900 flex items-center gap-3 hover:gap-4 transition-all px-2 py-4 group">
                <span className="border-b-2 border-indigo-200 group-hover:border-indigo-600 transition-colors pb-1">مشاهده همه محصولات فروشگاه</span>
                <ArrowLeft size={18} className="text-indigo-600" />
              </button>
            </div>

            {/* Blog Preview */}
            <div className="lg:w-1/2 space-y-12" id="blog">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-indigo-600">
                  <BookOpen size={20} />
                  <span className="text-[10px] font-black uppercase tracking-widest bg-indigo-50 px-3 py-1 rounded-lg">مجله آموزشی و مربیگری</span>
                </div>
                <h2 className="text-4xl font-black text-slate-900 leading-tight">یادداشت‌های <br /> مربی همدل</h2>
                <p className="text-base text-slate-500 font-bold leading-relaxed max-w-md">آخرین یافته‌های روان‌شناسی یادگیری و تکنیک‌های نوین مدیریت استرس کنکور.</p>
              </div>

              <div className="space-y-6">
                {[
                  { title: "چگونه با تکنیک ۲۰ دقیقه‌ای به تمرکز عمیق برسیم؟", date: "۲۴ خرداد ۱۴۰۵", time: "۵ دقیقه مطالعه", category: "تمرکز" },
                  { title: "نقش خواب در تثبیت آموخته‌های روزانه برای داوطلبان تجربی", date: "۲۱ خرداد ۱۴۰۵", time: "۷ دقیقه مطالعه", category: "سلامت" },
                  { title: "مدیریت اضطراب در جلسات آزمون‌های آزمایشی", date: "۱۸ خرداد ۱۴۰۵", time: "۴ دقیقه مطالعه", category: "روانشناسی" }
                ].map((post, idx) => (
                  <div key={idx} className="p-8 bg-white rounded-[2rem] border border-slate-100 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-500/5 transition-all cursor-pointer group relative overflow-hidden">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-[10px] font-black text-indigo-500 bg-indigo-50 px-3 py-1 rounded-full">{post.category}</span>
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] font-black text-slate-400">{post.date}</span>
                        <div className="w-1 h-1 rounded-full bg-slate-200" />
                        <span className="text-[10px] font-black text-slate-400">{post.time}</span>
                      </div>
                    </div>
                    <h4 className="text-lg font-black text-slate-800 group-hover:text-indigo-600 transition-colors leading-relaxed">{post.title}</h4>
                    <div className="absolute right-0 top-0 w-1.5 h-full bg-indigo-600 scale-y-0 group-hover:scale-y-100 transition-transform origin-top duration-500" />
                  </div>
                ))}
              </div>
              <button className="text-xs font-black text-slate-900 flex items-center gap-3 hover:gap-4 transition-all px-2 py-4 group">
                <span className="border-b-2 border-indigo-200 group-hover:border-indigo-600 transition-colors pb-1">ورود به وبلاگ آموزشی</span>
                <ArrowLeft size={18} className="text-indigo-600" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 🛒 Section 6: Marketplace & Blog Preview (New) */}
      <section className="py-24 bg-white relative" id="shop">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-16">
            {/* Shop Preview */}
            <div className="lg:w-1/2 space-y-10">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-indigo-600">
                  <ShoppingBag size={20} />
                  <span className="text-[10px] font-black uppercase tracking-widest">فروشگاه ترنم همدلی</span>
                </div>
                <h2 className="text-3xl font-black text-slate-900">منابع آموزشی دست‌چین شده</h2>
                <p className="text-sm text-slate-500 font-bold leading-relaxed">بسته‌های مکمل یادگیری و ابزارهای فیزیکی کایزن برای ارتقای کیفیت مطالعه شما.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[
                  { title: "بسته کارت‌های یادگیری عمیق", price: "۱۴۰,۰۰۰ تومان", img: "https://images.unsplash.com/photo-1544640808-32ca72ac7f67?auto=format&fit=crop&q=80&w=400" },
                  { title: "دفتر برنامه‌ریزی کایزنی", price: "۹۵,۰۰۰ تومان", img: "https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&q=80&w=400" }
                ].map((item, idx) => (
                  <div key={idx} className="group cursor-pointer">
                    <div className="aspect-[4/3] rounded-3xl overflow-hidden mb-4 relative">
                      <img src={item.img} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                      <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors" />
                    </div>
                    <h4 className="text-sm font-black text-slate-800">{item.title}</h4>
                    <p className="text-xs text-indigo-600 font-bold mt-1">{item.price}</p>
                  </div>
                ))}
              </div>
              <button className="text-xs font-black text-slate-900 flex items-center gap-2 hover:gap-3 transition-all">
                <span>مشاهده همه محصولات</span>
                <ArrowLeft size={16} />
              </button>
            </div>

            {/* Blog Preview */}
            <div className="lg:w-1/2 space-y-10" id="blog">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-indigo-600">
                  <BookOpen size={20} />
                  <span className="text-[10px] font-black uppercase tracking-widest">مجله آموزشی و مربیگری</span>
                </div>
                <h2 className="text-3xl font-black text-slate-900">یادداشت‌های مربی همدل</h2>
                <p className="text-sm text-slate-500 font-bold leading-relaxed">آخرین یافته‌های روان‌شناسی یادگیری و تکنیک‌های نوین مدیریت استرس کنکور.</p>
              </div>

              <div className="space-y-6">
                {[
                  { title: "چگونه با تکنیک ۲۰ دقیقه‌ای به تمرکز عمیق برسیم؟", date: "۲۴ خرداد ۱۴۰۵", time: "۵ دقیقه مطالعه" },
                  { title: "نقش خواب در تثبیت آموخته‌های روزانه برای داوطلبان تجربی", date: "۲۱ خرداد ۱۴۰۵", time: "۷ دقیقه مطالعه" },
                  { title: "مدیریت اضطراب در جلسات آزمون‌های آزمایشی", date: "۱۸ خرداد ۱۴۰۵", time: "۴ دقیقه مطالعه" }
                ].map((post, idx) => (
                  <div key={idx} className="p-6 bg-slate-50 rounded-3xl border border-slate-100 hover:border-indigo-200 transition-all cursor-pointer group">
                    <div className="flex justify-between items-start mb-3">
                      <span className="text-[9px] font-black text-slate-400">{post.date}</span>
                      <span className="text-[9px] font-black text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded-lg">{post.time}</span>
                    </div>
                    <h4 className="text-sm font-black text-slate-800 group-hover:text-indigo-600 transition-colors">{post.title}</h4>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 🚀 Ready to Start Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="bg-slate-900 rounded-[3rem] p-8 md:p-16 text-center space-y-8 relative overflow-hidden">
          {/* Decorative circles */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-violet-600/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
          
          <div className="relative z-10 space-y-6">
            <h2 className="text-3xl md:text-5xl font-black text-white">آغاز مسیری آگاهانه و سرشار از همدلی</h2>
            <p className="text-slate-400 font-bold text-base md:text-lg max-w-2xl mx-auto">
              همین حالا به جمع همسفران ترنم همدلی بپیوندید و با آرامش خاطر گام در راه یادگیری بگذارید.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <button 
                onClick={() => onNavigate("login")}
                className="px-10 py-5 bg-indigo-600 hover:bg-indigo-500 text-white font-heavy rounded-2xl shadow-xl shadow-indigo-600/20 transition-all active:scale-95"
              >
                همراهم باش
              </button>
              <button className="px-10 py-5 bg-white/10 hover:bg-white/20 text-white border border-white/10 font-heavy rounded-2xl transition-all active:scale-95">
                رزرو وقت مشاوره حضوری
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 👣 Modern Multi-column Footer */}
      <footer className="bg-slate-900 pt-20 pb-12 overflow-hidden relative text-white" id="contact">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-16 text-right">
            
            <div className="lg:col-span-4 space-y-8">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-indigo-600 text-white rounded-2xl shadow-xl shadow-indigo-600/20">
                  <Sparkles size={24} />
                </div>
                <h2 className="text-2xl font-black tracking-tight">ترنم همدلی</h2>
              </div>
              <p className="text-sm text-slate-400 font-bold leading-relaxed max-w-sm text-justify">
                ما پلی میان تکنولوژی و همدلی ساخته‌ایم. رسالت ما در ترنم همدلی، تبدیل کردن مسیر پرفشار آموزش به راهی هموار و سرشار از خودشناسی است.
              </p>
              <div className="flex items-center gap-5 pt-4">
                 <FooterIcon icon={<Globe size={20} />} />
                 <FooterIcon icon={<Mail size={20} />} />
                 <FooterIcon icon={<Phone size={20} />} />
              </div>
            </div>

            <div className="lg:col-span-2 lg:col-start-6 space-y-6">
              <h3 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest bg-indigo-500/5 inline-block px-3 py-1 rounded-lg">پلتفرم</h3>
              <nav className="flex flex-col gap-4 text-xs text-slate-400 font-bold">
                <a href="#hero" className="hover:text-indigo-400 transition-colors">پیشواز و خانه</a>
                <a href="#features" className="hover:text-indigo-400 transition-colors">مسیریابی هوشمند</a>
                <a href="#plans" className="hover:text-indigo-400 transition-colors">همراهی ویژه</a>
                <a href="#contact" className="hover:text-indigo-400 transition-colors">همدلی با ما</a>
              </nav>
            </div>

            <div className="lg:col-span-2 space-y-6">
              <h3 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest bg-indigo-500/5 inline-block px-3 py-1 rounded-lg">همراهان</h3>
              <nav className="flex flex-col gap-4 text-xs text-slate-400 font-bold">
                <span className="hover:text-indigo-400 cursor-pointer">مشاور هوشمند</span>
                <span className="hover:text-indigo-400 cursor-pointer">تحلیل مانوا</span>
                <span className="hover:text-indigo-400 cursor-pointer">پایش مستمر</span>
                <span className="hover:text-indigo-400 cursor-pointer">راهنمای یادگیری</span>
              </nav>
            </div>

            <div className="lg:col-span-4 space-y-8 bg-white/5 p-10 rounded-[2.5rem] border border-white/10 backdrop-blur-sm">
               <h3 className="text-sm font-black text-white">در مسیر رشد، همراه هم باشیم</h3>
               <p className="text-xs text-slate-400 font-bold leading-relaxed">
                 آخرین یادداشت‌های مربیگری و تحلیل‌های آموزشی را مستقیم در صندوق پستی‌تان دریافت کنید.
               </p>
               <div className="flex gap-3">
                  <input 
                    type="email" 
                    placeholder="نشانی رایانامه شما..." 
                    className="flex-grow bg-white/5 border border-white/10 rounded-2xl px-5 py-3 text-xs focus:ring-2 focus:ring-indigo-500/40 outline-none transition-all placeholder:text-slate-500"
                  />
                  <button className="bg-indigo-600 text-white px-6 py-3 rounded-2xl text-xs font-black shadow-lg shadow-indigo-600/10 hover:bg-white hover:text-slate-900 transition-all duration-300">تایید</button>
               </div>
            </div>

          </div>

          <div className="pt-12 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-8">
            <p className="text-[11px] text-slate-500 font-bold">© ۱۴۰۵ تمامی حقوق برای آکادمی ترنم همدلی محفوظ است.</p>
            <div className="flex items-center gap-6">
               <div className="flex gap-6 text-[11px] text-slate-500 font-bold">
                 <span className="hover:text-white cursor-pointer transition-colors">حریم خصوصی</span>
                 <span className="hover:text-white cursor-pointer transition-colors">شرایط همراهی</span>
               </div>
               <div className="w-px h-5 bg-white/10 mx-2" />
               <p className="text-white/30 font-black text-[10px] tracking-[0.2em] uppercase">Built with heart & AI</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

// --- High-Fidelity UI Components ---

function BentoCard({ icon, title, desc, className, color, badge, image }: { 
  icon: React.ReactNode, 
  title: string, 
  desc: string, 
  className?: string, 
  color: string, 
  badge?: string,
  image?: string
}) {
  const colors = {
    indigo: "bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white",
    violet: "bg-violet-50 text-violet-600 group-hover:bg-violet-600 group-hover:text-white",
    emerald: "bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white",
    rose: "bg-rose-50 text-rose-600 group-hover:bg-rose-600 group-hover:text-white",
    amber: "bg-amber-50 text-amber-600 group-hover:bg-amber-600 group-hover:text-white",
  };

  return (
    <motion.div 
      whileHover={{ y: -8 }}
      className={`group bg-white p-10 rounded-[3rem] border border-slate-200/60 hover:border-indigo-200 shadow-sm hover:shadow-3xl hover:shadow-indigo-500/10 transition-all duration-700 overflow-hidden relative flex flex-col justify-between min-h-[340px] ${className}`}
    >
      <div className="relative z-10 space-y-8">
        <div className="flex items-center justify-between">
          <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center transition-all duration-700 shadow-inner ${colors[color as keyof typeof colors]}`}>
            {icon}
          </div>
          {badge && <span className="text-[10px] font-black px-3.5 py-1.5 bg-slate-900 text-white rounded-full tracking-wider shadow-lg">{badge}</span>}
        </div>
        <div className="space-y-5">
          <h3 className="text-2xl font-black text-slate-900 group-hover:text-indigo-600 transition-colors duration-500">{title}</h3>
          <p className="text-sm text-slate-500 font-bold leading-relaxed">{desc}</p>
        </div>
      </div>
      
      {image && (
        <div className="absolute bottom-0 left-0 right-0 h-1/2 opacity-5 group-hover:opacity-100 transition-all duration-1000">
           <img src={image} alt="feature" className="w-full h-full object-cover scale-125 group-hover:scale-100 transition-transform duration-1000" />
           <div className="absolute inset-0 bg-gradient-to-t from-white via-white/80 to-transparent" />
        </div>
      )}

      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-indigo-500/0 via-transparent to-indigo-500/0 group-hover:from-indigo-500/[0.03] group-hover:to-indigo-500/[0.05] transition-all duration-700 pointer-events-none" />
    </motion.div>
  );
}

function StatItem({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) {
  return (
    <div className="flex flex-col items-center lg:items-end lg:flex-row gap-4 px-2 py-4 group cursor-default">
      <div className="w-14 h-14 bg-indigo-50/50 rounded-2xl flex items-center justify-center text-indigo-600 shrink-0 group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500 shadow-sm">
        {icon}
      </div>
      <div className="text-center lg:text-right space-y-1">
        <div className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight leading-none">{value}</div>
        <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{label}</div>
      </div>
    </div>
  );
}

function PlanCard({ title, price, features, btnText, icon, recommended, onNavigate }: { 
  title: string, 
  price: string, 
  features: string[], 
  btnText: string, 
  icon: React.ReactNode,
  recommended?: boolean,
  onNavigate?: () => void
}) {
  return (
    <motion.div 
      whileHover={{ y: -10 }}
      className={`p-10 rounded-[3rem] border transition-all duration-500 flex flex-col text-right h-full ${
        recommended 
          ? 'bg-slate-900 text-white border-slate-800 shadow-2xl relative shadow-indigo-500/20' 
          : 'bg-white text-slate-900 border-slate-150 shadow-lg shadow-slate-100 hover:shadow-xl'
      }`}
    >
      {recommended && (
        <div className="absolute -top-4 right-10 px-4 py-1.5 bg-indigo-600 text-white text-[10px] font-black rounded-full shadow-lg">
          پیشنهاد ویژه
        </div>
      )}
      <div className="space-y-6 mb-10 flex-grow">
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${recommended ? 'bg-indigo-600 text-white' : 'bg-indigo-50 text-indigo-600'}`}>
          {icon}
        </div>
        <div>
          <h3 className="text-xl font-black">{title}</h3>
          <div className="text-2xl font-black mt-1 mb-2">{price}</div>
          <div className={`h-1 w-8 rounded-full ${recommended ? 'bg-indigo-500' : 'bg-indigo-100'}`} />
        </div>
        <ul className="space-y-4">
          {features.map((f, i) => (
            <li key={i} className="flex items-center gap-3 text-xs font-bold">
              <CheckCircle size={14} className={recommended ? 'text-indigo-400' : 'text-emerald-500'} />
              <span className={recommended ? 'text-slate-300' : 'text-slate-600'}>{f}</span>
            </li>
          ))}
        </ul>
      </div>
      <button 
        onClick={onNavigate}
        className={`w-full py-4 rounded-2xl font-heavy text-xs transition-all active:scale-95 shadow-md cursor-pointer ${
        recommended 
          ? 'bg-indigo-600 hover:bg-white hover:text-slate-900 text-white' 
          : 'bg-slate-900 hover:bg-indigo-600 text-white'
      }`}>
        {btnText}
      </button>
    </motion.div>
  );
}

function TestimonialCardCompact({ quote, name, rank, className }: { quote: string, name: string, rank: string, className?: string }) {
  return (
    <motion.div 
      whileHover={{ scale: 1.02 }}
      className={`bg-white p-8 rounded-[2.5rem] border border-slate-150 shadow-sm hover:shadow-xl transition-all duration-500 text-right space-y-6 ${className}`}
    >
      <div className="flex gap-1 text-amber-500">
        {[1,2,3,4,5].map(i => <Star key={i} size={10} fill="currentColor" />)}
      </div>
      <p className="text-sm text-slate-600 font-bold leading-relaxed italic">"{quote}"</p>
      <div className="flex items-center gap-4 pt-6 border-t border-slate-50">
        <div className="w-12 h-12 rounded-2xl bg-indigo-50 p-0.5 overflow-hidden">
           <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`} alt={name} className="w-full h-full object-cover" />
        </div>
        <div>
          <h4 className="text-base font-black text-slate-900 leading-none">{name}</h4>
          <p className="text-[10px] text-indigo-600 font-extrabold mt-2 underline decoration-indigo-200 underline-offset-4">{rank}</p>
        </div>
      </div>
    </motion.div>
  );
}

function FooterIcon({ icon }: { icon: React.ReactNode }) {
  return (
    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:bg-white hover:shadow-md transition-all cursor-pointer border border-slate-100">
      {icon}
    </div>
  );
}

