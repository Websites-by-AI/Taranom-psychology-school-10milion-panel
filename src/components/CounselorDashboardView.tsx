import React, { useState } from "react";
import { 
  Users, Sparkles, BookOpen, HeartPulse, Brain, Plus, Calendar, 
  Settings, Database, Compass, CheckCircle2, ChevronLeft, 
  HelpCircle, UserCheck, GraduationCap, AlertCircle, ClipboardList, FileSpreadsheet, Target,
  Edit2, Shield, Award, Briefcase, MapPin, Clock
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Student } from "../types";
import { BRAND_CONFIG } from "../constants";
import { getCounselorProfile, saveCounselorProfile, CounselorProfile, getProfileMetadata, getHydratedStudent } from "../lib/userProfiles";

// Mock student dynamic generator - dynamically hydrated to prevent static placeholders and support live registrations
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
  // Ensure the active student profile is fully hydrated
  const [activeStudent, setActiveStudent] = useState<Student>(() => {
    return getHydratedStudent(student);
  });
  
  // Counselor custom profile state (derived dynamically using the requested helper function pattern)
  const [counselorProfile, setCounselorProfile] = useState<CounselorProfile>(() => {
    return getProfileMetadata("counselor") as CounselorProfile;
  });
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  
  // Form states for Counselor Profile Settings
  const [cName, setCName] = useState(counselorProfile.name);
  const [cLicense, setCLicense] = useState(counselorProfile.licenseNumber);
  const [cField, setCField] = useState(counselorProfile.fieldOfStudy);
  const [cExperience, setCExperience] = useState(counselorProfile.experienceYears);
  const [cWorkplace, setCWorkplace] = useState(counselorProfile.workplace);
  const [cWorkHours, setCWorkHours] = useState(counselorProfile.workHours);
  const [cSpecialty, setCSpecialty] = useState(counselorProfile.specialty);
  
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

  // Counselor custom diagnostic tools
  const [noteText, setNoteText] = useState("");
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

  const getSeverityBadge = (level: string) => {
    switch (level) {
      case "critical":
        return <span className="px-2 py-0.5 bg-rose-50 text-rose-600 rounded-md text-[10px] font-black">بحرانی / نیازمند مداخله فوری</span>;
      case "warning":
        return <span className="px-2 py-0.5 bg-amber-50 text-amber-600 rounded-md text-[10px] font-black">هشدار / بررسی فرآیند مطالعاتی</span>;
      default:
        return <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded-md text-[10px] font-black">سالم / رشد مستمر</span>;
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
            <p className="text-slate-400 text-[11px] leading-relaxed max-w-2xl">
              ساعات حضور و ویزیت پورتال: <span className="text-slate-200 font-bold font-mono">{counselorProfile.workHours}</span>
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
                <span className="text-[9px] text-slate-350">اطلاعات این فرم به طور خودکار در تمامی پردازش‌ها و کارنامه‌ها اعمال می‌شود</span>
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

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">حوزه تمرکز تخصصی بالینی</label>
                  <input
                    type="text"
                    required
                    value={cSpecialty}
                    onChange={(e) => setCSpecialty(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900/80 border border-indigo-800/40 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">محل کار و دفتر مشاوره فعال</label>
                  <input
                    type="text"
                    required
                    value={cWorkplace}
                    onChange={(e) => setCWorkplace(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900/80 border border-indigo-800/40 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">سابقه کاری موفق علمی (سال)</label>
                  <input
                    type="number"
                    required
                    value={cExperience}
                    onChange={(e) => setCExperience(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-900/80 border border-indigo-800/40 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono text-center"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">ساعات کاری و جدول تقویم حضور</label>
                  <input
                    type="text"
                    required
                    value={cWorkHours}
                    onChange={(e) => setCWorkHours(e.target.value)}
                    placeholder="مثال: روزهای زوج ۹ الی ۱۸"
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
            
            <p className="text-[9px] text-slate-400 leading-relaxed pt-2 border-t border-slate-50">
              با کلیک روی هر داوطلب، پورتال و کارنامه‌ها جهت بازبینی مربی کایزن به نام آن فرد فرموله و کالیبره می‌شود.
            </p>
          </div>

          {/* Moved Personal & Background Info for Counselor */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-sm font-black text-slate-800 flex items-center gap-2">
              <Database size={16} className="text-amber-500" />
              <span>پیشینه خانوادگی و جو عاطفی منزل</span>
            </h3>
            <p className="text-[10px] text-slate-500 leading-relaxed font-bold">
               برخی اطلاعات زیست‌محیطی داوطلب که کلید تشخیص فرسودگی‌های ذهنی و فوبیای آزمون‌های کتبی در اتاق مشاوره مربی کایزن است:
            </p>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 bg-slate-50 rounded-2xl space-y-2 border border-slate-150">
                <div className="flex justify-between font-bold text-slate-600">
                  <span>کانون حیات والدین:</span>
                  <span className="text-slate-900 font-black">
                    {activeStudent.parentalContext?.fatherAlive ? "سایه پدر برقرار" : "فقدان همدم پدر"} | {activeStudent.parentalContext?.motherAlive ? "سایه مادر مستدام" : "فقدان مادر گرامی"}
                  </span>
                </div>
                <div className="flex justify-between font-bold text-slate-600">
                  <span>فرزندان برومند خانه:</span>
                  <span className="text-slate-900 font-black">{activeStudent.parentalContext?.childrenCount} فرزند</span>
                </div>
                <div className="flex justify-between font-bold text-slate-600">
                  <span>سطح تحصیلات پدر:</span>
                  <span className="text-slate-900 font-semibold">{activeStudent.parentalContext?.fatherEducation || "نامشخص"}</span>
                </div>
                <div className="flex justify-between font-bold text-slate-600">
                  <span>سطح تحصیلات مادر:</span>
                  <span className="text-slate-900 font-semibold">{activeStudent.parentalContext?.motherEducation || "نامشخص"}</span>
                </div>
                <div className="flex justify-between font-bold text-slate-600">
                  <span>تمکن مالی خانواده:</span>
                  <span className="bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded text-[10px] font-black">
                    {activeStudent.parentalContext?.householdIncome === "excellent" ? "بسیار عالی" : "متوسط به بالا"}
                  </span>
                </div>
              </div>

              <div>
                <span className="block text-[10px] text-slate-400 font-bold mb-1.5">جو حاکم بر خانواده داوطلب:</span>
                <p className="p-3 bg-amber-50/40 text-amber-900 border border-amber-200/50 rounded-2xl text-[11px] leading-relaxed font-semibold">
                  {activeStudent.familyContext || "محیط خانه آرام و بستر مطالعه به طور کامل توأم با آرامش ذهنی و حامی کایزن مطالعاتی است."}
                </p>
              </div>

              <div className="pt-2">
                <span className="block text-[10px] text-slate-400 font-bold mb-1.5">اهداف و آرمان‌های داوطلب و والدین:</span>
                <div className="bg-slate-50 p-3 rounded-2xl space-y-1.5 border border-slate-150">
                  <div className="text-[10px] leading-relaxed">
                    <strong className="text-slate-800 font-black">رؤیای داوطلب:</strong> <span className="text-slate-600 font-medium">{activeStudent.goals?.studentVision}</span>
                  </div>
                  <div className="text-[10px] leading-relaxed">
                    <strong className="text-slate-800 font-black">انتظار والدین:</strong> <span className="text-slate-600 font-medium">{activeStudent.goals?.familyExpectation}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* LEFT COLUMN: Active Assessment & Action plan parameters */}
        <div className="lg:col-span-8 space-y-6">
          {/* Main stats ribbon of selected student */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-center">
              <span className="text-[9px] text-slate-500 font-black block mb-1">رشته تخصصی</span>
              <span className="text-sm font-black text-indigo-950">
                {activeStudent.field === "tajrobi" ? "علوم تجربی" : activeStudent.field === "riazi" ? "ریاضی فیزیک" : "علوم انسانی"}
              </span>
            </div>
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-center">
              <span className="text-[9px] text-slate-500 font-black block mb-1">تراز به بازی کایزن</span>
              <span className="text-sm font-black font-mono text-emerald-700">{activeStudent.academicProfile?.currentTraz}</span>
            </div>
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-center">
              <span className="text-[9px] text-slate-500 font-black block mb-1">ساعت مطالعه آمل</span>
              <span className="text-sm font-black font-mono text-amber-600">{activeStudent.academicProfile?.studyHoursPerDay} ساعتدرروز</span>
            </div>
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-center">
              <span className="text-[9px] text-slate-500 font-black block mb-1">معدل دیپلم</span>
              <span className="text-sm font-black font-mono text-blue-600">{activeStudent.academicProfile?.currentGpa}</span>
            </div>
          </div>

          {/* Shortcuts from counselor Dashboard */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button 
              onClick={() => onNavigate("traps")}
              className="bg-gradient-to-br from-indigo-50 via-white to-white p-5 rounded-3xl border border-slate-200 shadow-xs hover:border-indigo-400 transition text-right space-y-2 cursor-pointer active:scale-95 flex flex-col justify-between"
            >
              <div className="space-y-1">
                <div className="p-2 bg-indigo-100 text-indigo-700 rounded-xl w-10 h-10 flex items-center justify-center">
                  <Target size={20} />
                </div>
                <h4 className="text-xs font-black text-slate-800 mt-2">کالیبراسیون تله‌های تستی مرجع</h4>
                <p className="text-[10px] text-slate-500 leading-relaxed font-semibold">تحلیل ۱۲ تله متداول کالیبره شده در زیست‌شناسی و عروض فشرده.</p>
              </div>
              <span className="text-[10px] text-indigo-700 font-black flex items-center gap-1 self-end mt-2">
                <span>کنترل و ویرایش تله‌ها</span>
                <ChevronLeft size={12} />
              </span>
            </button>

            <button 
              onClick={() => onNavigate("psychology")}
              className="bg-gradient-to-br from-rose-50 via-white to-white p-5 rounded-3xl border border-slate-200 shadow-xs hover:border-rose-400 transition text-right space-y-1 cursor-pointer active:scale-95 flex flex-col justify-between"
            >
              <div className="space-y-1">
                <div className="p-2 bg-rose-100 text-rose-700 rounded-xl w-10 h-10 flex items-center justify-center">
                  <Brain size={20} />
                </div>
                <h4 className="text-xs font-black text-slate-800 mt-2">عارضه شناختی و رادار استرس</h4>
                <p className="text-[10px] text-slate-500 leading-relaxed font-semibold">پایش فاکتورهای خستگی، فرسودگی ذهنی و نمودار پاسخ ممتد درست/غلط.</p>
              </div>
              <span className="text-[10px] text-rose-700 font-black flex items-center gap-1 self-end mt-2">
                <span>مشاهده رادار استرس</span>
                <ChevronLeft size={12} />
              </span>
            </button>

            <button 
              onClick={() => onNavigate("manova")}
              className="bg-gradient-to-br from-amber-50 via-white to-white p-5 rounded-3xl border border-slate-200 shadow-xs hover:border-amber-400 transition text-right space-y-1 cursor-pointer active:scale-95 flex flex-col justify-between"
            >
              <div className="space-y-1">
                <div className="p-2 bg-amber-100 text-amber-700 rounded-xl w-10 h-10 flex items-center justify-center">
                  <Sparkles size={20} className="text-amber-500" />
                </div>
                <h4 className="text-xs font-black text-slate-800 mt-2">داشبورد هوش مصنوعی مانوآ (SaaS)</h4>
                <p className="text-[10px] text-slate-500 leading-relaxed font-semibold">خروجی هوشمند رفتار کایزن درسی بر اساس وزن کنکور.</p>
              </div>
              <span className="text-[10px] text-amber-700 font-black flex items-center gap-1 self-end mt-2">
                <span>نمایش تحلیل مانوا</span>
                <ChevronLeft size={12} />
              </span>
            </button>
          </div>

          {/* Counselor Advice Editor */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <h3 className="text-sm font-black text-slate-800 flex items-center gap-2">
                <ClipboardList size={18} className="text-indigo-600" />
                <span>ثبت ارزیابی علمی و توصیه‌نامه کایزن مشاور</span>
              </h3>
              <span className="text-[8px] bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full font-black animate-pulse">متصل به پورتال داوطلب</span>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">توصیه راهبردی مربی {BRAND_CONFIG.name} برای داوطلب:</label>
                <textarea
                  value={customAdvisorComment}
                  onChange={(e) => setCustomAdvisorComment(e.target.value)}
                  rows={4}
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-350 leading-relaxed"
                  placeholder="مثال: روش کایزن درسی بدین صورت است که در این هفته باید ۳ پومودورو به مبحث استوکیومتری بیاورید تا تراز به بالای ۷۰۰۰ متمایل گردد..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-slate-600 mb-2">تعیین سطح بحرانی سلامت آموزشی داوطلب</label>
                  <select
                    value={severity}
                    onChange={(e: any) => setSeverity(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none cursor-pointer hover:bg-slate-100 transition-colors"
                  >
                    <option value="mild">رشد مستمر / سالم</option>
                    <option value="warning">مراقبت مستمر / نوسان تراز کایزن</option>
                    <option value="critical">بحرانی / خطر افت تراز فاحش در آزمون شبیه‌ساز</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-600 mb-2">ساعت مطالعه بهینه پیشنهادی مشاور</label>
                  <div className="flex items-center gap-2">
                    <input 
                      type="number"
                      defaultValue={activeStudent.academicProfile?.studyHoursPerDay || 10}
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none text-center font-mono"
                    />
                    <span className="text-xs font-bold text-slate-500 whitespace-nowrap">ساعت در روز</span>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={handleSaveComment}
                  className="w-full md:w-auto px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-black transition shadow-md hover:shadow-lg active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <CheckCircle2 size={16} />
                  <span>ثبت، همگام‌سازی و ارسال توصیه دیجیتال به داوطلب</span>
                </button>
              </div>
            </div>
          </div>

          {/* Quick Active Student Health Check indicators */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-sm font-black text-slate-800 flex items-center gap-2">
              <HeartPulse size={18} className="text-rose-500" />
              <span>سیگنال‌های رفتاری و سلامت تحصیلی داوطلب</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-700">توالی اشتباهات زیست در دور آخر</span>
                  <span className="font-mono text-xs font-black text-rose-600">۵ خطای پیاپی</span>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div className="bg-rose-500 h-2 rounded-full" style={{ width: "70%" }} />
                </div>
                <span className="text-[9px] text-slate-400 block font-semibold">علائم فرسودگی توجه و خستگی چشم مینیاتوری</span>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-700">دقت تمرکز بهینه (بهداشت ذهنی)</span>
                  <span className="font-mono text-xs font-black text-emerald-600">۸۴٪ باثبات</span>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-2 rounded-full" style={{ width: "84%" }} />
                </div>
                <span className="text-[9px] text-slate-400 block font-semibold">بازیابی فکری پس از پومودورو کاملاً مناسب است</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
