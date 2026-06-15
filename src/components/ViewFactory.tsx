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
    "historical-db"
  ],
  parent: [
    "welcome", "parents", "manova", "report", "psychology", "counseling", 
    "historical-db"
  ],
  admin: [
    "welcome", "admin", "manova"
  ],
  counselor: [
    "welcome", "counselor-dashboard", "manova", "report", "psychology", 
    "counselor-chat", "traps"
  ],
  teacher: [
    "welcome", "teacher-dashboard", "report", "traps"
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
