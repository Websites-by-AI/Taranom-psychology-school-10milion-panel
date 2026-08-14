import React, { useState, useEffect } from "react";
import { 
  Users, Sparkles, BookOpen, HeartPulse, Brain, Plus, Calendar, 
  Settings, Database, Compass, CheckCircle2, ChevronLeft, 
  HelpCircle, UserCheck, GraduationCap, AlertCircle, ClipboardList, FileSpreadsheet, Target,
  Edit2, Shield, Award, Briefcase, MapPin, Clock, Send
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Student } from "../types";
import { BRAND_CONFIG } from "../constants";
import { saveCounselorProfile, CounselorProfile, getProfileMetadata, getHydratedStudent } from "../lib/userProfiles";
import { loadStudyPlan, saveStudyPlan } from "../lib/studyPlans";

const getSupervisedStudents = (): Student[] => {
  const baseStudents = [
    { id: "1", name: "مریم حسینی", code: "9812405", field: "tajrobi" as const },
    { id: "2", name: "علیرضا رضایی", code: "9786431", field: "riazi" as const },
    { id: "3", name: "امیرمحمد اکبری", code: "9921477", field: "ensani" as const }
  ];

  let newlyRegistered: Student[] = [];
  try {
    const data = localStorage.getItem("arateb_new_registrations");
    if (data) {
      newlyRegistered = JSON.parse(data);
    }
  } catch (e) {
    console.error(e);
  }

  const all = [...baseStudents];
  newlyRegistered.forEach(ns => {
    if (!all.some(s => s.id === ns.id || s.code === ns.code)) {
      all.push({
        id: ns.id,
        name: ns.name,
        code: ns.code,
        field: ns.field
      });
    }
  });

  return all.map(s => getHydratedStudent(s));
};

interface CounselorDashboardViewProps {
  student: Student;
  onNavigate: (view: any) => void;
  onUpdateStudent?: (updated: Student) => void;
}

export default function CounselorDashboardView({ student, onNavigate, onUpdateStudent }: CounselorDashboardViewProps) {
  const [studentsUnderSupervision, setStudentsUnderSupervision] = useState<Student[]>(() => getSupervisedStudents());
  const [activeStudent, setActiveStudent] = useState<Student>(() => getSupervisedStudents()[0]);

  // In production, load real student accounts from D1. Demo/offline mode keeps
  // the local sample list. The API only allows counselor/admin sessions.
  useEffect(() => {
    fetch("/api/auth/list", { credentials: "include", cache: "no-store" })
      .then((res) => res.ok ? res.json() : null)
      .then((data) => {
        if (!Array.isArray(data?.users) || data.users.length === 0) return;
        const remoteStudents = data.users.map((u: any) => getHydratedStudent({
          id: u.id,
          name: u.name,
          code: u.code || u.mobile || u.id,
          field: u.field || "tajrobi",
          grade: u.grade || "دانش‌آموز ثبت‌شده",
          city: u.city,
          age: u.age,
          mobile: u.mobile,
          accountRole: "student",
        }));
        setStudentsUnderSupervision(remoteStudents);
        setActiveStudent((current) => remoteStudents.find((s: Student) => s.id === current.id) || remoteStudents[0]);
      })
      .catch(() => {});
  }, []);
  
  const [counselorProfile, setCounselorProfile] = useState<CounselorProfile>(() => {
    return getProfileMetadata("counselor") as CounselorProfile;
  });
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  
  const [cName, setCName] = useState(counselorProfile.name);
  const [cLicense, setCLicense] = useState(counselorProfile.licenseNumber);
  const [cField, setCField] = useState(counselorProfile.fieldOfStudy);
  const [cExperience, setCExperience] = useState(counselorProfile.experienceYears);
  const [cWorkplace, setCWorkplace] = useState(counselorProfile.workplace);
  const [cWorkHours, setCWorkHours] = useState(counselorProfile.workHours);
  const [cSpecialty, setCSpecialty] = useState(counselorProfile.specialty);
  
  // Custom manual study planner builder states for counselor (Synced with Student View exact schema)
  const [customPlanTitle, setCustomPlanTitle] = useState("نقشه راه و برنامه مهندسی‌شده کایزن بر اساس کارنامه");
  const [morning1, setMorning1] = useState("پارت جبرانی ریاضی (مشتق و تابع) - ۴ ساعت");
  const [afternoon1, setAfternoon1] = useState("حل ۴۰ تست زمان‌دار تله‌دار ریاضی + ثبت در دفتر اشتباهات");
  
  const [morning2, setMorning2] = useState("مطالعه ژنتیک و غشای سلولی زیست‌شناسی - ۴ ساعت");
  const [afternoon2, setAfternoon2] = useState("تحلیل ۵۰ تست تله‌دار زیست‌شناسی کنکور");

  const [morning3, setMorning3] = useState("مرور فرمول‌های فیزیک و شیمی - ۳ ساعت");
  const [afternoon3, setAfternoon3] = useState("تست‌زنی جامع و بررسی پاسخ‌نامه تشریحی");

  const [morning4, setMorning4] = useState("شبیه‌ساز نیمه‌جامع کنکور با رویکرد مدیریت زمان - ۴ ساعت");
  const [afternoon4, setAfternoon4] = useState("تحلیل موشکافانه تراز و تکنیک ضربدر منها");

  const [planSuccessMsg, setPlanSuccessMsg] = useState("");

  // Load every editable day when switching students. Resetting first prevents
  // one student's plan leaking into another student's form.
  useEffect(() => {
    let active = true;
    const defaults = [
      ["پارت جبرانی ریاضی (مشتق و تابع) - ۴ ساعت", "حل ۴۰ تست زمان‌دار تله‌دار ریاضی + ثبت در دفتر اشتباهات"],
      ["مطالعه ژنتیک و غشای سلولی زیست‌شناسی - ۴ ساعت", "تحلیل ۵۰ تست تله‌دار زیست‌شناسی کنکور"],
      ["مرور فرمول‌های فیزیک و شیمی - ۳ ساعت", "تست‌زنی جامع و بررسی پاسخ‌نامه تشریحی"],
      ["شبیه‌ساز نیمه‌جامع کنکور با رویکرد مدیریت زمان - ۴ ساعت", "تحلیل موشکافانه تراز و تکنیک ضربدر منها"],
    ];
    loadStudyPlan(activeStudent.id).then((plan) => {
      if (!active) return;
      const day = (index: number) => plan?.schedule[index];
      setCustomPlanTitle(plan?.title || "نقشه راه و برنامه مهندسی‌شده کایزن بر اساس کارنامه");
      setMorning1(day(0)?.morning || defaults[0][0]); setAfternoon1(day(0)?.afternoon || defaults[0][1]);
      setMorning2(day(1)?.morning || defaults[1][0]); setAfternoon2(day(1)?.afternoon || defaults[1][1]);
      setMorning3(day(2)?.morning || defaults[2][0]); setAfternoon3(day(2)?.afternoon || defaults[2][1]);
      setMorning4(day(3)?.morning || defaults[3][0]); setAfternoon4(day(3)?.afternoon || defaults[3][1]);
    });
    return () => { active = false; };
  }, [activeStudent.id]);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: CounselorProfile = {
      id: counselorProfile.id,
      name: cName,
      licenseNumber: cLicense,
      fieldOfStudy: cField,
      experienceYears: Number(cExperience),
      workplace: cWorkplace,
      workHours: cWorkHours,
      specialty: cSpecialty,
    };
    saveCounselorProfile(updated);
    setCounselorProfile(updated);
    setIsEditingProfile(false);
    alert("کارت عضویت و اطلاعات هویتی مشاور ارشد در سیستم مرکزی با موفقیت به‌روزرسانی شد!");
  };

  const [customAdvisorComment, setCustomAdvisorComment] = useState(() => {
    return localStorage.getItem(`taranom_advisor_comment_${activeStudent.id}`) || 
           "داوطلب کایزن درسی مناسبی دارد؛ اما برای فائق آمدن بر تله‌های مفهومی زیست، افزایش تحلیل پاسخ تشریحی ضروری است.";
  });

  const handleStudentSwitch = (selected: Student) => {
    setActiveStudent(selected);
    const storedComment = localStorage.getItem(`taranom_advisor_comment_${selected.id}`) || 
           "داوطلب کایزن درسی مناسبی دارد؛ اما برای فائق آمدن بر تله‌های مفهومی زیست، افزایش تحلیل پاسخ تشریحی ضروری است.";
    setCustomAdvisorComment(storedComment);
    if (onUpdateStudent) {
      onUpdateStudent(selected);
    }
  };

  const handleSaveComment = () => {
    localStorage.setItem(`taranom_advisor_comment_${activeStudent.id}`, customAdvisorComment);
    alert("توصیه‌نامه و گزارش ارزیابی مشاور با موفقیت ذخیره گردید و به پورتال داوطلب ارسال شد!");
  };

  const handlePublishManualPlan = async (e: React.FormEvent) => {
    e.preventDefault();
    setPlanSuccessMsg("در حال ذخیره و همگام‌سازی برنامه...");
    const planPayload = {
      title: customPlanTitle,
      counselorName: counselorProfile.name,
      updatedAt: new Date().toISOString(),
      warnings: [
        `⚠️ توصیه مشاور (${counselorProfile.name}): برنامه هفتگی شما به صورت اختصاصی بازنویسی و تنظیم شد.`,
        "💡 لطفا تمامی پارت‌های شیفت صبح و عصر زیر را با دقت و متد پومودورو اجرا کنید."
      ],
      schedule: [
        { day: "شنبه", morning: morning1, afternoon: afternoon1, qCount: 40 },
        { day: "یکشنبه", morning: morning2, afternoon: afternoon2, qCount: 50 },
        { day: "دوشنبه", morning: morning3, afternoon: afternoon3, qCount: 40 },
        { day: "سه‌شنبه", morning: morning4, afternoon: afternoon4, qCount: 60 },
        { day: "چهارشنبه", morning: "مرور دروس حفظی و ادبیات اختصاصی - ۳ ساعت", afternoon: "حل تست‌های سطح المپیاد و تله‌های پرتکرار", qCount: 35 },
        { day: "پنجشنبه", morning: "آزمون جامع آزمایشی شبیه‌ساز - ۴ ساعت", afternoon: "تحلیل کارنامه و استراحت بازسازنده ذهن", qCount: 50 },
        { day: "جمعه", morning: "مرور خلاصه‌ها، استراحت و ریکاوری روحی کایزن", afternoon: "ارسال گزارش هفتگی به مشاور و والدین", qCount: 20 },
      ],
      extracurricular: [
        "کارگاه رفع اشکال اضطراری دروس تخصصی (با حضور مشاور)",
        "جلسه مشاوره گروهی مدیریت استرس کنکور"
      ]
    };
    try {
      const result = await saveStudyPlan(activeStudent.id, planPayload);
      setPlanSuccessMsg(result.synced
        ? `✅ برنامه «${activeStudent.name}» در D1 ذخیره شد و اکنون در پنل دانش‌آموز قابل مشاهده است.`
        : `✅ برنامه «${activeStudent.name}» در حالت دمو روی این مرورگر ذخیره شد. برای همگام‌سازی بین دستگاه‌ها با حساب مشاور وارد شوید.`);
      setTimeout(() => setPlanSuccessMsg(""), 7000);
    } catch (error: any) {
      setPlanSuccessMsg("");
      alert(error?.message || "خطا در ذخیره‌سازی برنامه دستی.");
    }
  };

  return (
    <div className="space-y-8 animate-fade-in text-right" style={{ direction: "rtl" }} id="counselor-portal-hub">
      {/* Hero Welcome banner */}
      <div className="bg-gradient-to-tr from-slate-950 via-slate-900 to-indigo-950 rounded-[35px] p-8 text-white relative overflow-hidden shadow-xl border border-white/5">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-[80px]" />
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-3 flex-grow">
            <div className="flex flex-wrap gap-2 items-center">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-black border border-indigo-500/10">
                <UserCheck size={12} />
                <span>پورتال اختصاصی و نظارت مشاوران ارشد</span>
              </span>
              <button 
                onClick={() => setIsEditingProfile(!isEditingProfile)}
                className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-500/20 hover:bg-amber-500/35 text-amber-300 text-[10px] font-black border border-amber-500/20 transition-all cursor-pointer shadow-xs"
              >
                <Edit2 size={10} />
                <span>{isEditingProfile ? "بستن فرم ویرایش" : "ویرایش کارت شناسایی و امضا"}</span>
              </button>
            </div>
            <h1 className="text-2xl md:text-3xl font-black">سلام {counselorProfile.name} گرامی، به اتاق مشاورهٔ کایزن خوش آمدید</h1>
            <p className="text-slate-450 text-xs max-w-2xl leading-relaxed">
              تخصص شما: <span className="text-amber-300 font-bold">{counselorProfile.specialty}</span> | سابقه: <span className="text-emerald-300 font-extrabold">{counselorProfile.experienceYears} سال مربیگری رتبه برترها</span>
            </p>
          </div>
          <div className="bg-slate-800/60 backdrop-blur-md p-5 rounded-2xl border border-slate-700/50 text-right min-w-[240px] shadow-lg self-stretch flex flex-col justify-between">
             <div>
               <span className="text-[10px] text-slate-400 block font-bold mb-1">کد یکتا و تأییدیه نظام مشاور</span>
               <span className="text-xs font-black font-mono text-amber-400 block">{counselorProfile.licenseNumber}</span>
             </div>
             <div className="h-px bg-slate-700/50 my-2" />
             <div className="text-[10px] text-slate-300 font-semibold space-y-1">
               <div className="flex items-center gap-1.5">
                 <Award size={12} className="text-indigo-400 shrink-0" />
                 <span className="truncate">{counselorProfile.fieldOfStudy}</span>
               </div>
               <div className="flex items-center gap-1.5">
                 <MapPin size={12} className="text-emerald-400 shrink-0" />
                 <span className="truncate">{counselorProfile.workplace}</span>
               </div>
             </div>
          </div>
        </div>
      </div>

      {/* Toggleable Profile Editor Row */}
      <AnimatePresence>
        {isEditingProfile && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <form onSubmit={handleSaveProfile} className="bg-indigo-950/40 border border-indigo-900/30 p-6 rounded-[30px] space-y-4 text-white">
              <div className="flex items-center justify-between pb-3 border-b border-indigo-900/40">
                <h3 className="text-sm font-black text-amber-300 flex items-center gap-2">
                  <Shield size={16} />
                  <span>تنظیمات هویتی و ویرایش پروفایل مشاور کایزن (پویای سیستمی)</span>
                </h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">نام و نام خانوادگی مشاور</label>
                  <input
                    type="text"
                    required
                    value={cName}
                    onChange={(e) => setCName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900/80 border border-indigo-800/40 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">شماره نظام روان‌شناختی / مربیگری</label>
                  <input
                    type="text"
                    required
                    value={cLicense}
                    onChange={(e) => setCLicense(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900/80 border border-indigo-800/40 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">رشته و مقطع تحصیلی</label>
                  <input
                    type="text"
                    required
                    value={cField}
                    onChange={(e) => setCField(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900/80 border border-indigo-800/40 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black rounded-xl text-xs transition duration-150 cursor-pointer shadow-md"
                >
                  ذخیره و اعتباردهی به امضا دیجیتال
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* RIGHT COLUMN: Active Student Switcher & Background Data */}
        <div className="lg:col-span-4 space-y-6">
          {/* Student Switcher Card */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <h3 className="text-sm font-black text-slate-800 flex items-center gap-2">
                <Users size={16} className="text-indigo-600" />
                <span>داوطلبان تحت نظارت شما</span>
              </h3>
              <span className="text-[9px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full font-bold">تعداد: {studentsUnderSupervision.length} داوطلب</span>
            </div>

            <div className="space-y-2">
              {studentsUnderSupervision.map((studentItem) => {
                const isActive = activeStudent.id === studentItem.id;
                return (
                  <button
                    key={studentItem.id}
                    onClick={() => handleStudentSwitch(studentItem)}
                    className={`w-full text-right p-3.5 rounded-2xl transition duration-150 border flex items-center justify-between group ${
                      isActive 
                        ? "bg-indigo-50 border-indigo-300 text-indigo-950 shadow-sm" 
                        : "bg-slate-50 border-transparent hover:bg-slate-100/70 hover:border-slate-300 text-slate-700"
                    }`}
                  >
                    <div>
                      <span className="block text-xs font-black mb-1 group-hover:text-indigo-900 transition-colors">
                        {studentItem.name} 
                        <span className="text-[9px] text-slate-400 font-bold block mt-0.5">شناسه: {studentItem.code}</span>
                      </span>
                      <span className="text-[10px] block opacity-80 leading-none">{studentItem.grade}</span>
                    </div>
                    {isActive ? (
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse" />
                    ) : (
                      <ChevronLeft size={14} className="text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* LEFT COLUMN: Active Assessment & Manual Plan Builder Form (Synced with Student View exact schema) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Main stats ribbon of selected student */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-center">
              <span className="text-[9px] text-slate-500 font-black block mb-1">داوطلب فعال</span>
              <span className="text-sm font-black text-indigo-950">{activeStudent.name}</span>
            </div>
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-center">
              <span className="text-[9px] text-slate-500 font-black block mb-1">رشته تخصصی</span>
              <span className="text-sm font-black text-indigo-950">
                {activeStudent.field === "tajrobi" ? "علوم تجربی" : activeStudent.field === "riazi" ? "ریاضی فیزیک" : "علوم انسانی"}
              </span>
            </div>
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-center">
              <span className="text-[9px] text-slate-500 font-black block mb-1">تراز کنونی</span>
              <span className="text-sm font-black font-mono text-emerald-700">{activeStudent.academicProfile?.currentTraz || 7200}</span>
            </div>
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-center">
              <span className="text-[9px] text-slate-500 font-black block mb-1">ساعت مطالعه</span>
              <span className="text-sm font-black font-mono text-amber-600">{activeStudent.academicProfile?.studyHoursPerDay || 10} ساعت</span>
            </div>
          </div>

          {/* 📝 FORM FOR MANUAL STUDY PLAN CREATION & REWRITE (Exact Match with Student Schedule Grid) */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="space-y-1">
                <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <ClipboardList size={20} className="text-indigo-600" />
                  <span>تدوین و بازنویسی جدول برنامه هفتگی برای {activeStudent.name}</span>
                </h3>
                <p className="text-xs text-slate-500 font-bold">این جدول دقیقاً همان ساختاری است که دانش‌آموز در پنل خود تحت عنوان «جدول زمان‌بندی پارت‌های مطالعاتی هفته» مشاهده می‌کند.</p>
              </div>
            </div>

            {planSuccessMsg && (
              <div className="p-4 bg-emerald-50 text-emerald-900 rounded-2xl border border-emerald-200 text-xs font-black text-center animate-fade-in">
                {planSuccessMsg}
              </div>
            )}

            <form onSubmit={handlePublishManualPlan} className="space-y-6">
              <div className="space-y-1.5">
                <label className="text-xs font-black text-slate-700 block">عنوان کلان برنامه مطالعاتی:</label>
                <input 
                  type="text"
                  required
                  value={customPlanTitle}
                  onChange={e => setCustomPlanTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs font-bold text-slate-800 focus:outline-none focus:border-indigo-600"
                />
              </div>

              {/* Day 1 (Saturday) Schedule */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <div className="text-xs font-black text-indigo-950 flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-indigo-600 text-white flex items-center justify-center text-[10px] font-mono">شنبه</div>
                  <span>پارت‌های مطالعاتی روز شنبه</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 mb-1">شیفت اول (صبح):</label>
                    <input 
                      type="text"
                      required
                      value={morning1}
                      onChange={e => setMorning1(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 mb-1">شیفت دوم (عصر):</label>
                    <input 
                      type="text"
                      required
                      value={afternoon1}
                      onChange={e => setAfternoon1(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold"
                    />
                  </div>
                </div>
              </div>

              {/* Day 2 (Sunday) Schedule */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <div className="text-xs font-black text-indigo-950 flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-indigo-600 text-white flex items-center justify-center text-[10px] font-mono">یکشنبه</div>
                  <span>پارت‌های مطالعاتی روز یکشنبه</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 mb-1">شیفت اول (صبح):</label>
                    <input 
                      type="text"
                      required
                      value={morning2}
                      onChange={e => setMorning2(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 mb-1">شیفت دوم (عصر):</label>
                    <input 
                      type="text"
                      required
                      value={afternoon2}
                      onChange={e => setAfternoon2(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold"
                    />
                  </div>
                </div>
              </div>

              {/* Day 3 (Monday) Schedule */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <div className="text-xs font-black text-indigo-950 flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-indigo-600 text-white flex items-center justify-center text-[10px] font-mono">دوشنبه</div>
                  <span>پارت‌های مطالعاتی روز دوشنبه</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 mb-1">شیفت اول (صبح):</label>
                    <input 
                      type="text"
                      required
                      value={morning3}
                      onChange={e => setMorning3(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 mb-1">شیفت دوم (عصر):</label>
                    <input 
                      type="text"
                      required
                      value={afternoon3}
                      onChange={e => setAfternoon3(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold"
                    />
                  </div>
                </div>
              </div>

              {/* Day 4 (Tuesday) Schedule */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <div className="text-xs font-black text-indigo-950 flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-indigo-600 text-white flex items-center justify-center text-[10px] font-mono">سه‌شنبه</div>
                  <span>پارت‌های مطالعاتی روز سه‌شنبه</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 mb-1">شیفت اول (صبح):</label>
                    <input 
                      type="text"
                      required
                      value={morning4}
                      onChange={e => setMorning4(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 mb-1">شیفت دوم (عصر):</label>
                    <input 
                      type="text"
                      required
                      value={afternoon4}
                      onChange={e => setAfternoon4(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold"
                    />
                  </div>
                </div>
              </div>

              <button 
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs py-4 px-6 rounded-2xl shadow-lg shadow-indigo-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send size={15} />
                <span>انتشار و بارگذاری مستقیم برنامه در جدول دانش‌آموز</span>
              </button>
            </form>
          </div>

        </div>

      </div>
    </div>
  );
}
