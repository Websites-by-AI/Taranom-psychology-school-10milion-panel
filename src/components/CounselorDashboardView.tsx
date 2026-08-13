import React, { useState } from "react";
import { 
  Users, Sparkles, BookOpen, HeartPulse, Brain, Plus, Calendar, 
  Settings, Database, Compass, CheckCircle2, ChevronLeft, 
  HelpCircle, UserCheck, GraduationCap, AlertCircle, ClipboardList, FileSpreadsheet, Target,
  Edit2, Shield, Award, Briefcase, MapPin, Clock, Send
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Student } from "../types";
import { BRAND_CONFIG } from "../constants";
import { getCounselorProfile, saveCounselorProfile, CounselorProfile, getProfileMetadata, getHydratedStudent } from "../lib/userProfiles";

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
  const studentsUnderSupervision = getSupervisedStudents();
  const [activeStudent, setActiveStudent] = useState<Student>(() => {
    return getHydratedStudent(student);
  });
  
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
  
  // Custom manual study planner builder states for counselor
  const [customPlanTitle, setCustomPlanTitle] = useState("برنامه جبرانی تخصصی عارضه‌یابی");
  const [customPlanMorning, setCustomPlanMorning] = useState("مطالعه عمیق مباحث آسیب‌دیده کارنامه (۴ ساعت)");
  const [customPlanAfternoon, setCustomPlanAfternoon] = useState("حل ۴۰ تست زمان‌دار تله‌دار و ثبت در دفتر اشتباهات");
  const [customPlanTargetQ, setCustomPlanTargetQ] = useState(45);
  const [planSuccessMsg, setPlanSuccessMsg] = useState("");

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

  const [severity, setSeverity] = useState<"critical" | "warning" | "mild">("warning");
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

  const handlePublishManualPlan = (e: React.FormEvent) => {
    e.preventDefault();
    const planPayload = {
      title: customPlanTitle,
      morning: customPlanMorning,
      afternoon: customPlanAfternoon,
      targetQ: customPlanTargetQ,
      counselorName: counselorProfile.name,
      updatedAt: new Date().toISOString()
    };
    try {
      localStorage.setItem(`taranom_manual_study_plan_${activeStudent.id}`, JSON.stringify(planPayload));
      setPlanSuccessMsg(`✅ برنامه دستی جدید برای داوطلب '${activeStudent.name}' با موفقیت تدوین و مستقیماً بر روی پنل او اعمال شد!`);
      setTimeout(() => setPlanSuccessMsg(""), 4000);
    } catch {
      alert("خطا در ذخیره‌سازی برنامه دستی.");
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

          {/* Background Info */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-sm font-black text-slate-800 flex items-center gap-2">
              <Database size={16} className="text-amber-500" />
              <span>پیشینه خانوادگی و جو عاطفی منزل</span>
            </h3>
            <div className="space-y-3 text-xs">
              <div className="p-3.5 bg-slate-50 rounded-2xl space-y-2 border border-slate-150">
                <div className="flex justify-between font-bold text-slate-600">
                  <span>کانون حیات والدین:</span>
                  <span className="text-slate-900 font-black">
                    {activeStudent.parentalContext?.fatherAlive ? "سایه پدر برقرار" : "فقدان همدم پدر"} | {activeStudent.parentalContext?.motherAlive ? "سایه مادر مستدام" : "فقدان مادر گرامی"}
                  </span>
                </div>
                <div className="flex justify-between font-bold text-slate-600">
                  <span>تمکن مالی خانواده:</span>
                  <span className="bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded text-[10px] font-black">
                    {activeStudent.parentalContext?.householdIncome === "excellent" ? "بسیار عالی" : "متوسط به بالا"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* LEFT COLUMN: Active Assessment & Manual Plan Builder Form */}
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

          {/* 📝 FORM FOR MANUAL STUDY PLAN CREATION & REWRITE */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="space-y-1">
                <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <ClipboardList size={20} className="text-indigo-600" />
                  <span>فرم تدوین و بازنویسی دستی برنامه مطالعاتی برای {activeStudent.name}</span>
                </h3>
                <p className="text-xs text-slate-500 font-bold">بر اساس کارنامه، درصد دروس و درخواست بازبینی دانش‌آموز، برنامه جدید را بازنویسی کنید.</p>
              </div>
            </div>

            {planSuccessMsg && (
              <div className="p-4 bg-emerald-50 text-emerald-900 rounded-2xl border border-emerald-200 text-xs font-black text-center animate-fade-in">
                {planSuccessMsg}
              </div>
            )}

            <form onSubmit={handlePublishManualPlan} className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-xs font-black text-slate-700 block">عنوان برنامه مطالعاتی / هدر هفتگی:</label>
                <input 
                  type="text"
                  required
                  value={customPlanTitle}
                  onChange={e => setCustomPlanTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs font-bold text-slate-800 focus:outline-none focus:border-indigo-600"
                  placeholder="مثال: نقشه راه فشرده رفع اشکال زیست‌شناسی و ریاضی"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-700 block">پارت شیفت صبح (مفاهیم و کتاب درسی):</label>
                  <input 
                    type="text"
                    required
                    value={customPlanMorning}
                    onChange={e => setCustomPlanMorning(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs font-bold text-slate-800 focus:outline-none focus:border-indigo-600"
                    placeholder="مثال: مطالعه ژنتیک و حل تست‌های مکرر"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-700 block">پارت شیفت عصر (تست‌زنی و تحلیل غلط‌ها):</label>
                  <input 
                    type="text"
                    required
                    value={customPlanAfternoon}
                    onChange={e => setCustomPlanAfternoon(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs font-bold text-slate-800 focus:outline-none focus:border-indigo-600"
                    placeholder="مثال: تحلیل ۵۰ تست تله‌دار + ثبت در دفتر اشتباهات"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-700 block">تعداد تست هدف هفتگی:</label>
                  <input 
                    type="number"
                    required
                    value={customPlanTargetQ}
                    onChange={e => setCustomPlanTargetQ(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs font-bold text-slate-800 focus:outline-none focus:border-indigo-600 font-mono"
                  />
                </div>

                <div className="flex items-end">
                  <button 
                    type="submit"
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs py-3.5 px-6 rounded-xl shadow-lg shadow-indigo-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Send size={15} />
                    <span>انتشار و ارسال برنامه جدید به پورتال داوطلب</span>
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* Counselor Advice Editor */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <h3 className="text-sm font-black text-slate-800 flex items-center gap-2">
                <ClipboardList size={18} className="text-indigo-600" />
                <span>ثبت ارزیابی علمی و توصیه‌نامه کایزن مشاور</span>
              </h3>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">توصیه راهبردی مربی برای داوطلب:</label>
                <textarea
                  value={customAdvisorComment}
                  onChange={(e) => setCustomAdvisorComment(e.target.value)}
                  rows={4}
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-350 leading-relaxed"
                />
              </div>

              <div className="pt-2">
                <button
                  onClick={handleSaveComment}
                  className="w-full md:w-auto px-6 py-3 bg-slate-900 hover:bg-slate-950 text-white rounded-xl text-xs font-black transition shadow-md cursor-pointer flex items-center gap-2"
                >
                  <CheckCircle2 size={16} />
                  <span>ثبت و ارسال ارزیابی</span>
                </button>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
