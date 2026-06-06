import React, { useState } from "react";
import { 
  Users, Sparkles, BookOpen, HeartPulse, Brain, Plus, Calendar, 
  Settings, Database, Compass, CheckCircle2, ChevronLeft, 
  HelpCircle, UserCheck, GraduationCap, AlertCircle, ClipboardList, FileSpreadsheet, Target,
  BookMarked, PenTool, Lightbulb, TrendingUp, Presentation, ArrowLeftRight
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Student } from "../types";
import { BRAND_CONFIG } from "../constants";

const STUDENTS_UNDER_TEACHER: Student[] = [
  { 
    id: "1", 
    name: "مریم حسینی", 
    code: "9812405", 
    field: "tajrobi", 
    grade: "رتبه فرضی ۴۷ کشوری - تراز ۱۰/۴۵۰",
    city: "تهران",
    age: 18,
    academicProfile: {
      studyHoursPerDay: 11,
      educationLevel: "پایه دوازدهم",
      currentGpa: 19.8,
      targetGpa: 20.0,
      currentTraz: 10450,
      targetTraz: 11200
    },
    parentalContext: {
      fatherAlive: true,
      motherAlive: true,
      childrenCount: 2,
      fatherEducation: "کارشناسی ارشد (مهندسی)",
      motherEducation: "دکتری (پزشک عمومی)",
      householdIncome: "excellent",
      familySupportLevel: "high"
    },
    goals: {
      studentVision: "قبولی در رشته پزشکی دانشگاه علوم پزشکی تهران",
      familyExpectation: "تحصیل در مدارج عالی پزشکی تخصصی"
    },
    familyContext: "محیط خانه آرام و حامی؛ داوطلب اتاق مطالعه مستقل دارد و نظارت مستمر انجام می‌شود.",
    additionalNotes: "نیاز تجمعي به پایش تله‌های تستی زیست‌شناسی تخصصی و مهار استرس آزمون در دقایق پایانی دارد."
  },
  { 
    id: "2", 
    name: "علیرضا رضایی", 
    code: "9786431", 
    field: "riazi", 
    grade: "رتبه فرضی ۲۴ کشوری - تراز ۱۰/۱۲۰",
    city: "مشهد",
    age: 17,
    academicProfile: {
      studyHoursPerDay: 10,
      educationLevel: "پایه یازدهم متمم کنکور",
      currentGpa: 19.45,
      targetGpa: 19.9,
      currentTraz: 10120,
      targetTraz: 10800
    },
    parentalContext: {
      fatherAlive: true,
      motherAlive: true,
      childrenCount: 1,
      fatherEducation: "دیپلم (آزاد)",
      motherEducation: "کارشناسی (فرهنگی)",
      householdIncome: "mid",
      familySupportLevel: "medium"
    },
    goals: {
      studentVision: "مهندسی کامپیوتر دانشگاه صنعتی شریف",
      familyExpectation: "ورود مستقیم به بازار کار فناوری اطلاعات"
    },
    familyContext: "حمایت عالی مادری؛ استرس کلی متوسط است اما نیاز به افزایش ساعت مطالعه دارد.",
    additionalNotes: "ضعف اندک در مباحث هندسه پایه و حسابان گزارش شده است."
  },
  { 
    id: "3", 
    name: "امیرمحمد اکبری", 
    code: "9921477", 
    field: "ensani", 
    grade: "رتبه فرضی ۱۲ کشوری - تراز ۹/۹۵۰",
    city: "اصفهان",
    age: 18,
    academicProfile: {
      studyHoursPerDay: 9,
      educationLevel: "پایه دوازدهم",
      currentGpa: 19.2,
      targetGpa: 19.8,
      currentTraz: 9950,
      targetTraz: 10400
    },
    parentalContext: {
      fatherAlive: true,
      motherAlive: true,
      childrenCount: 3,
      fatherEducation: "کارشناسی (کارمند)",
      motherEducation: "دیپلم (خانه دار)",
      householdIncome: "mid",
      familySupportLevel: "high"
    },
    goals: {
      studentVision: "رشته حقوق دانشگاه تهران",
      familyExpectation: "قبولی در دانشگاه‌های تراز اول پایتخت برای حقوق"
    },
    familyContext: "محیط خانه پرجمعیت اما صمیمی؛ تمرکز بالا است و نوسان تراز کمی دارد.",
    additionalNotes: "نیاز به تقویت عروض فشرده و تندخوانی دروس تخصصی دارد."
  }
];

interface TeacherDashboardViewProps {
  student: Student;
  onNavigate: (view: any) => void;
  onUpdateStudent?: (updated: Student) => void;
}

export default function TeacherDashboardView({ student, onNavigate, onUpdateStudent }: TeacherDashboardViewProps) {
  const [activeStudent, setActiveStudent] = useState<Student>(student);
  
  // Custom teacher states
  const [targetLevel, setTargetLevel] = useState<"standard" | "hard" | "olympiad">("hard");
  const [prescribedMaterial, setPrescribedMaterial] = useState(() => {
    return localStorage.getItem(`taranom_teacher_prescription_${activeStudent.id}`) || 
           `مطالعه مستمر درسنامه فصل سنتز پروتئین زیست‌شناسی و تمرکز بر جزئیات غشای هسته برای مهار تله‌های زمان‌بر اکیداً پیشنهاد می‌شود.`;
  });

  const handleStudentSwitch = (selected: Student) => {
    setActiveStudent(selected);
    const stored = localStorage.getItem(`taranom_teacher_prescription_${selected.id}`) || 
           `مطالعه مستمر درسنامه فصل سنتز پروتئین زیست‌شناسی و تمرکز بر جزئیات غشای هسته برای مهار تله‌های زمان‌بر اکیداً پیشنهاد می‌شود.`;
    setPrescribedMaterial(stored);
    if (onUpdateStudent) {
      onUpdateStudent(selected);
    }
  };

  const handleSavePrescription = () => {
    localStorage.setItem(`taranom_teacher_prescription_${activeStudent.id}`, prescribedMaterial);
    alert(`توصیه‌نامه درسی و تمرینی دبیر با موفقیت ذخیره گردید و به پورتال آموزشی دانش‌آموز ارسال شد!`);
  };

  return (
    <div className="space-y-8 animate-fade-in text-right" style={{ direction: "rtl" }} id="teacher-portal-hub">
      {/* Banner design */}
      <div className="bg-gradient-to-tr from-slate-900 via-emerald-950 to-indigo-950 rounded-[35px] p-8 text-white relative overflow-hidden shadow-xl border border-white/5">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-[80px]" />
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-black border border-emerald-500/10">
              <Presentation size={12} />
              <span>پورتال تعاملی دبیران و طراحان کنکور</span>
            </span>
            <h1 className="text-2xl md:text-3xl font-black">پنل کنترل آموزشی و تجویز درسی دبیران {BRAND_CONFIG.name}</h1>
            <p className="text-slate-350 text-xs max-w-2xl leading-relaxed">
              بر اساس خطاهای مکرر تستی و سطح علمی داوطلب در شبیه‌ساز آزمون، در این بخش به همکارتان در مسیر یادگیری کایزن کمک کرده و تست‌های هدفمند مباحث مختلف را مستقیم به پورتال دانش‌آموزی او الصاق کنید.
            </p>
          </div>
          <div className="bg-slate-800/40 backdrop-blur-md p-4 rounded-2xl border border-emerald-900/30 text-right min-w-[180px]">
             <span className="text-[9px] text-slate-400 block font-bold mb-1">کد یکتا پرسنلی دبیر</span>
             <span className="text-xs font-black font-mono text-emerald-300">TEACHER_ID_3811</span>
             <div className="h-px bg-slate-700/50 my-2" />
             <span className="text-[10px] text-indigo-300 font-bold block">دپارتمان: طراحی سوالات کایزن</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* RIGHT COLUMN: Student list selection */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <h3 className="text-sm font-black text-slate-800 flex items-center gap-2">
                <Users size={16} className="text-emerald-600" />
                <span>کلاس‌های تحت هدایت علمی شما</span>
              </h3>
              <span className="text-[9px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full font-bold">۳ داوطلب کاندید</span>
            </div>

            <div className="space-y-2">
              {STUDENTS_UNDER_TEACHER.map((st) => {
                const isActive = activeStudent.id === st.id;
                return (
                  <button
                    key={st.id}
                    onClick={() => handleStudentSwitch(st)}
                    className={`w-full text-right p-3.5 rounded-2xl transition duration-150 border flex items-center justify-between group ${
                      isActive 
                        ? "bg-emerald-50/70 border-emerald-300 text-emerald-950 shadow-xs" 
                        : "bg-slate-50 border-transparent hover:bg-slate-100/75 hover:border-slate-300 text-slate-700"
                    }`}
                  >
                    <div>
                      <span className="block text-xs font-black mb-1 group-hover:text-emerald-900 transition-colors">
                        {st.name} 
                        <span className="text-[9px] text-slate-400 font-bold block mt-0.5">پایه درسی: {st.academicProfile?.educationLevel || "یازدهم کنکور"}</span>
                      </span>
                      <span className="text-[10px] block opacity-80 leading-none">{st.grade}</span>
                    </div>
                    {isActive ? (
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                    ) : (
                      <ChevronLeft size={14} className="text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                    )}
                  </button>
                );
              })}
            </div>

            <div className="h-px bg-slate-100 my-2" />
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-150 space-y-2">
              <span className="text-[10px] font-black text-slate-600 block">مشخصه مربی همگام با شما (مشاور):</span>
              <p className="text-[10px] text-slate-500 leading-relaxed font-semibold">
                اطلاعات خانوادگی داوطلب توسط مشاور ارشد در سیستم ثبت شده و تغییرات بلافاصله همگام‌سازی می‌شود.
              </p>
            </div>
          </div>

          {/* Quick info metrics */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-sm font-black text-slate-800 flex items-center gap-2">
              <BookMarked size={16} className="text-indigo-600" />
              <span>اهداف نهایی دانش‌آموز انتخابی</span>
            </h3>

            <div className="space-y-3 text-xs leading-relaxed">
              <div className="p-3 bg-indigo-50/40 rounded-2xl border border-indigo-100">
                <span className="text-[9px] text-indigo-600 font-black block mb-1">دورنمای کنکور داوطلب</span>
                <p className="font-bold text-slate-800">{activeStudent.goals?.studentVision || "رشته قبولی مطلوب"}</p>
              </div>

              <div className="p-3 bg-amber-50/40 rounded-2xl border border-amber-100">
                <span className="text-[9px] text-amber-600 font-black block mb-1">ساعت مطالعه اعلامی مربی مشاور</span>
                <p className="font-bold text-slate-850">{activeStudent.academicProfile?.studyHoursPerDay || 10} ساعت در روز متمم پومودوروهای فشرده</p>
              </div>
            </div>
          </div>
        </div>

        {/* LEFT COLUMN: Main actions and custom teacher assessment prescribed values */}
        <div className="lg:col-span-8 space-y-6">
          {/* Diagnostic overview card */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-sm font-black text-slate-800 flex items-center gap-2">
                <Lightbulb size={18} className="text-emerald-500" />
                <span>تحلیل تشخیصی عملکرد تستی {activeStudent.name}</span>
              </h3>
              <span className="text-[10px] bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full font-black">سازگار با کایزن</span>
            </div>

            <p className="text-slate-600 text-xs leading-relaxed font-semibold">
              بر اساس آخرین داده‌های حاصل از آزمون مستقل زیست‌شناسی، درصدهای داوطلب روی فاکتورهای <span className="text-indigo-600">تله‌های تستی</span>، <span className="text-rose-600">فرسودگی تمرکز</span> و <span className="text-emerald-600">پومودورو</span> به شرح ذیل است:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-150 text-center">
                <span className="text-[9px] text-slate-500 font-bold block mb-1">دقت پاسخ‌گویی</span>
                <span className="text-lg font-black text-emerald-700">۸۷٪</span>
                <span className="text-[9px] text-slate-400 block mt-1">تثبیت مطلوب {BRAND_CONFIG.name}</span>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-150 text-center">
                <span className="text-[9px] text-slate-500 font-bold block mb-1">درصد برخورد با تله‌ها</span>
                <span className="text-lg font-black text-rose-600">۲۲٪</span>
                <span className="text-[9px] text-slate-400 block mt-1">۱۲ تله متداول کالیبره شده</span>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-150 text-center">
                <span className="text-[9px] text-slate-500 font-bold block mb-1">تراز شبیه‌ساز</span>
                <span className="text-lg font-black text-indigo-600 font-mono">{activeStudent.academicProfile?.currentTraz || "نامشخص"}</span>
                <span className="text-[9px] text-slate-400 block mt-1">معدل کایزن درسی</span>
              </div>
            </div>
          </div>

          {/* Teacher Interactive Prescription form */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-sm font-black text-slate-800 flex items-center gap-2">
              <PenTool size={18} className="text-indigo-600" />
              <span>تجویز طرح درس تفصیلی و کایزن هفتگی داوطلب</span>
            </h3>

            <p className="text-[10px] text-slate-400 leading-relaxed font-bold">
               توصیه ارسال شده توسط شما مستقیماً در صفحه خانگی پورتال دانش‌آموز نمایش داده می‌شود و خط مشی مطالعاتی او را بازنویسی می‌کند.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">دستورالعمل‌ها و طرح درس هدفمند دبیر:</label>
                <textarea
                  value={prescribedMaterial}
                  onChange={(e) => setPrescribedMaterial(e.target.value)}
                  rows={4}
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold focus:ring-2 focus:ring-emerald-500 outline-none transition-all placeholder:text-slate-350 leading-relaxed"
                  placeholder="مثال دپارتمان زیست: برای رفع تله‌های تستی زیست لازم است اول جزوه فشرده رونویسی را ۳ مرتبه مرور کرده و تست مبحث چرخه سلولی را با پومودوروی درسی ۲۵ دقیقه‌ای حل کنید..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-slate-600 mb-2">سطح دشواری پیشنهادی برای تست‌های بعدی</label>
                  <select
                    value={targetLevel}
                    onChange={(e: any) => setTargetLevel(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none cursor-pointer hover:bg-slate-100 transition-colors"
                  >
                    <option value="standard">استاندارد (مبتنی بر خط به خط کتاب)</option>
                    <option value="hard">دشوار / تله‌های تستی مفهومی زمان‌بر</option>
                    <option value="olympiad">المپیادی / کالیبراسیون عمیق زیست‌شناسی تخصصی</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-600 mb-2">تعداد تست تخصصی تجویزی در هفته نو</label>
                  <input
                    type="number"
                    defaultValue={120}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none text-center font-mono"
                  />
                </div>
              </div>

              <div>
                <button
                  onClick={handleSavePrescription}
                  className="w-full md:w-auto px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black transition shadow-md hover:shadow-lg active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <CheckCircle2 size={16} />
                  <span>ثبت و ارسال مستقیم به پورتال دانش‌آموز</span>
                </button>
              </div>
            </div>
          </div>

          {/* Quick shortcuts to other interactive modules */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => onNavigate("traps")}
              className="p-5 bg-gradient-to-br from-indigo-50/30 to-white hover:bg-slate-50 rounded-2xl border border-slate-200 transition text-right flex items-center justify-between group active:scale-95"
            >
              <div className="space-y-1">
                <span className="text-xs font-black text-slate-800 block">ورود به بانک تله‌های کالیبره زیست</span>
                <span className="text-[10px] text-slate-500 block">پایش ۱۲ تله متداول عتیق و نوین</span>
              </div>
              <ChevronLeft size={16} className="text-indigo-600 group-hover:translate-x-[-4px] transition-transform" />
            </button>

            <button
              onClick={() => onNavigate("report")}
              className="p-5 bg-gradient-to-br from-emerald-50/20 to-white hover:bg-slate-50 rounded-2xl border border-slate-200 transition text-right flex items-center justify-between group active:scale-95"
            >
              <div className="space-y-1">
                <span className="text-xs font-black text-slate-800 block">بازبینی ممیزی کارنامه مهارتی</span>
                <span className="text-[10px] text-slate-500 block">مشاهده درصدهای آزمون اخیر زیست و عروض</span>
              </div>
              <ChevronLeft size={16} className="text-emerald-600 group-hover:translate-x-[-4px] transition-transform" />
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
