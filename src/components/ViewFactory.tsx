import React from "react";
import { Student } from "../types";

// Import all system view components dynamically managed by the Factory
import WelcomeTourPortal from "./WelcomeTourPortal";
import DashboardView from "./DashboardView";
import ManovaDashboard from "./ManovaDashboard";
import ReportCardView from "./ReportCardView";
import StudyPlanView from "./StudyPlanView";
import CounselorView from "./CounselorView";
import ProgressView from "./ProgressView";
import TestTrapsView from "./TestTrapsView";
import CustomQuizGenerator from "./CustomQuizGenerator";
import AssessmentView from "./AssessmentView";
import MetacognitionLabView from "./MetacognitionLabView";
import CounselingAdvisorView from "./CounselingAdvisorView";
import HistoricalDatabaseView from "./HistoricalDatabaseView";
import AdminView from "./AdminView";
import ParentsView from "./ParentsView";
import CounselorDashboardView from "./CounselorDashboardView";
import TeacherDashboardView from "./TeacherDashboardView";

export type RoleType = "student" | "parent" | "admin" | "counselor" | "teacher";

export interface ViewFactoryProps {
  view: string;
  role: RoleType;
  student: Student;
  onNavigate: (target: string) => void;
  onSwitchRole: (newRole: RoleType) => void;
  onUpdateStudent: (updatedStudent: Student) => void;
  onUpdateBrand: () => void;
}

/**
 * Access Control Specification for and secure view routing
 */
export const ALLOWED_VIEWS_BY_ROLE: Record<RoleType, string[]> = {
  student: [
    "welcome", "dashboard", "manova", "report", "schedule", "counselor", 
    "progress", "traps", "quiz", "psychology", "metacognition", "counseling", 
    "historical-db", "shop", "blog", "contact"
  ],
  parent: [
    "welcome", "parents", "manova", "report", "psychology", "counseling", 
    "historical-db", "shop", "blog", "contact"
  ],
  admin: [
    "welcome", "admin", "manova", "shop", "blog", "contact"
  ],
  counselor: [
    "welcome", "counselor-dashboard", "manova", "report", "psychology", 
    "counselor-chat", "traps", "shop", "blog", "contact"
  ],
  teacher: [
    "welcome", "teacher-dashboard", "report", "traps", "shop", "blog", "contact"
  ]
};

/**
 * ViewFactory Component
 * Standardized presentation, responsive transition layout, and modular integration of panels.
 */
export default function ViewFactory({
  view,
  role,
  student,
  onNavigate,
  onSwitchRole,
  onUpdateStudent,
  onUpdateBrand
}: ViewFactoryProps) {
  
  // 1. Role-based view authorization verification guard
  const isAllowed = ALLOWED_VIEWS_BY_ROLE[role]?.includes(view);
  
  if (!isAllowed) {
    return (
      <div 
        id="view-factory-access-denied"
        className="p-8 text-center bg-white border border-rose-200 rounded-3xl space-y-4 max-w-2xl mx-auto shadow-md animate-fade-in"
        style={{ direction: "rtl" }}
      >
        <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto ring-8 ring-rose-50">
          <span className="text-2xl">⚠️</span>
        </div>
        <div>
          <h4 className="text-base font-black text-slate-900">عدم دسترسی مجاز مانیتورینگ</h4>
          <p className="text-xs text-slate-500 mt-2 leading-relaxed">
            کاربر با نقش گرامی <span className="font-extrabold text-indigo-650">«{role}»</span>، مجوز دسترسی مستقیم به صفحه <span className="font-extrabold text-slate-800">«{view}»</span> را در این سس دپارتمنت ندارد.
          </p>
        </div>
        <button
          onClick={() => onNavigate("welcome")}
          className="bg-slate-900 text-white text-xs font-black px-5 py-2.5 rounded-xl hover:bg-slate-800 transition active:scale-95"
        >
          بازگشت به پیشخوان معرفی کایزن
        </button>
      </div>
    );
  }

  // 2. Map and Render requested views
  switch (view) {
    case "welcome":
      return (
        <WelcomeTourPortal 
          currentRole={role} 
          onNavigate={onNavigate} 
          onSwitchRole={(newRole) => onSwitchRole(newRole as RoleType)} 
        />
      );
    
    case "dashboard":
      return <DashboardView student={student} onNavigate={onNavigate} />;
    
    case "manova":
      return <ManovaDashboard student={student} onNavigate={onNavigate} />;
    
    case "report":
      // Supports dynamic page redirection
      return <ReportCardView student={student} onNavigate={onNavigate} />;
    
    case "schedule":
      return <StudyPlanView student={student} onNavigate={onNavigate} />;
    
    case "counselor":
    case "counselor-chat":
      return <CounselorView student={student} onNavigate={onNavigate} />;
    
    case "progress":
      return <ProgressView />;
    
    case "traps":
      return <TestTrapsView student={student} />;
    
    case "quiz":
      return <CustomQuizGenerator student={student} />;
    
    case "psychology":
      return <AssessmentView role={role} student={student} onNavigateChange={onNavigate} />;
    
    case "metacognition":
      return <MetacognitionLabView student={student} />;
    
    case "counseling":
      return <CounselingAdvisorView student={student} />;
    
    case "historical-db":
      return <HistoricalDatabaseView student={student} />;
    
    case "admin":
      return <AdminView student={student} onUpdateBrand={onUpdateBrand} />;
    
    case "parents":
      return <ParentsView student={student} />;
    
    case "counselor-dashboard":
      return (
        <CounselorDashboardView 
          student={student} 
          onNavigate={onNavigate} 
          onUpdateStudent={onUpdateStudent} 
        />
      );
    
    case "teacher-dashboard":
      return (
        <TeacherDashboardView 
          student={student} 
          onNavigate={onNavigate} 
          onUpdateStudent={onUpdateStudent} 
        />
      );

    case "shop":
      return (
        <div className="p-12 text-center bg-white border border-slate-100 rounded-[2.5rem] shadow-xl space-y-8 animate-in fade-in zoom-in-95 duration-500 RTL" style={{ direction: 'rtl' }}>
          <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto shadow-inner ring-4 ring-indigo-50/50">
             <span className="text-4xl animate-bounce">🛍️</span>
          </div>
          <div className="space-y-3">
             <h2 className="text-3xl font-black text-slate-900">فروشگاه ابزارهای کایزن</h2>
             <p className="text-sm text-slate-500 font-bold max-w-md mx-auto leading-relaxed">
               به زودی مجموعه کاملی از دفترهای برنامه‌ریزی، اشتراک‌های ویژه تحلیل آزمون و کتاب‌های نایاب در این بخش قرار می‌گیرد.
             </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
             {["کتاب‌های تخصصی", "اشتراک نقره‌ای", "دوره مربیگری"].map((item, i) => (
                <div key={i} className="p-6 bg-slate-50 border border-slate-100 rounded-2xl hover:border-indigo-200 transition-all cursor-pointer group">
                   <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center mb-3 group-hover:bg-indigo-600 group-hover:text-white transition-colors shadow-sm">
                      <span className="text-lg">⭐</span>
                   </div>
                   <h4 className="text-xs font-black text-slate-850 mb-1">{item}</h4>
                   <span className="text-[10px] text-slate-400 font-bold">به زودی...</span>
                </div>
             ))}
          </div>
          <button onClick={() => onNavigate("welcome")} className="text-indigo-600 text-xs font-black hover:underline">بازگشت به پیشخوان</button>
        </div>
      );

    case "blog":
      return (
        <div className="p-12 text-center bg-white border border-slate-100 rounded-[2.5rem] shadow-xl space-y-8 animate-in fade-in zoom-in-95 duration-500 RTL" style={{ direction: 'rtl' }}>
          <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto shadow-inner ring-4 ring-emerald-50/50">
             <span className="text-4xl">✍️</span>
          </div>
          <div className="space-y-3">
             <h2 className="text-3xl font-black text-slate-900">وبلاگ تحلیلی و آموزشی</h2>
             <p className="text-sm text-slate-500 font-bold max-w-md mx-auto leading-relaxed">
               آخرین مقالات مربوط به روانشناسی کنکور، مدیریت زمان و تکنیک‌های تست‌زنی سرعتی را اینجا بخوانید.
             </p>
          </div>
          <div className="space-y-4 max-w-3xl mx-auto">
             {[1, 2, 3].map(i => (
                <div key={i} className="flex items-center gap-6 p-5 hover:bg-slate-50 rounded-2xl transition-all border border-transparent hover:border-slate-100 text-right cursor-pointer">
                   <div className="w-32 h-20 bg-slate-100 rounded-xl shrink-0 overflow-hidden relative">
                      <div className="absolute inset-0 bg-gradient-to-tr from-slate-200 to-transparent" />
                   </div>
                   <div className="space-y-2">
                      <h4 className="text-sm font-black text-slate-900">چگونه در آزمون‌های جامع تراز خود را ۱۰٪ افزایش دهیم؟</h4>
                      <p className="text-[11px] text-slate-400 font-bold">منتشر شده در ۲۴ خرداد ۱۴۰۵ • زمان مطالعه: ۵ دقیقه</p>
                   </div>
                </div>
             ))}
          </div>
          <button onClick={() => onNavigate("welcome")} className="text-emerald-600 text-xs font-black hover:underline">بازگشت به پیشخوان</button>
        </div>
      );

    case "contact":
      return (
        <div className="p-12 text-center bg-white border border-slate-100 rounded-[2.5rem] shadow-xl space-y-8 animate-in fade-in zoom-in-95 duration-500 RTL" style={{ direction: 'rtl' }}>
          <div className="w-20 h-20 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mx-auto shadow-inner ring-4 ring-amber-50/50">
             <span className="text-4xl">📞</span>
          </div>
          <div className="space-y-3">
             <h2 className="text-3xl font-black text-slate-900">مرکز همدلی و پشتیبانی</h2>
             <p className="text-sm text-slate-500 font-bold max-w-md mx-auto leading-relaxed">
               تیم پشتیبانی ما ۲۴ ساعته برای پاسخ به سوالات شما و حل مشکلات فنی در کنار شماست.
             </p>
          </div>
          <div className="max-w-xl mx-auto p-8 bg-slate-50 rounded-3xl border border-slate-100 text-right space-y-4">
             <div className="space-y-1.5">
                <label className="text-[11px] font-black text-slate-500 mr-2">موضوع پیام</label>
                <input type="text" className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs focus:ring-2 focus:ring-amber-500/20 outline-none transition-all" placeholder="مثلاً: سوال در مورد پنل والدین" />
             </div>
             <div className="space-y-1.5">
                <label className="text-[11px] font-black text-slate-500 mr-2">شرح پیام شما</label>
                <textarea className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs focus:ring-2 focus:ring-amber-500/20 outline-none transition-all min-h-[120px]" placeholder="پیام خود را اینجا بنویسید..." />
             </div>
             <button className="w-full bg-slate-900 text-white py-4 rounded-xl text-xs font-black hover:bg-slate-800 transition active:scale-[0.98] shadow-lg shadow-slate-200">ارسال پیام به تیم فنی</button>
          </div>
          <button onClick={() => onNavigate("welcome")} className="text-amber-600 text-xs font-black hover:underline">بازگشت به پیشخوان</button>
        </div>
      );
    
    default:
      return (
        <div 
          id="view-factory-missing-route"
          className="p-8 text-center bg-white border border-slate-200 rounded-3xl space-y-2"
          style={{ direction: "rtl" }}
        >
          <span className="text-xl">⚙️</span>
          <h4 className="text-xs font-black text-slate-800">صفحه یافت نگردید</h4>
          <p className="text-[10px] text-slate-400">شناسه صفحه نامعتبر است: {view}</p>
        </div>
      );
  }
}
