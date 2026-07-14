import React, { useState, useEffect } from "react";
import { 
  Sparkles, Calendar, CheckSquare, Quote, HeartPulse, Clock, ArrowRight
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Student, DailyPlan } from "../types";

interface DashboardViewProps {
  student: Student;
  onNavigate: (view: string) => void;
  onUpdateStudent?: (updatedStudent: Student) => void;
}

export default function DashboardView({ student, onNavigate }: DashboardViewProps) {
  const [quote, setQuote] = useState("یادگیری یک مسیر است، نه یک مسابقه. ما اینجا هستیم تا در هر گام، با آرامش و دقت بیشتری در کنار شما باشیم.");
  const [loadingQuote, setLoadingQuote] = useState(true);
  
  const [streakDays, setStreakDays] = useState<number>(14);
  const [todayTasks, setTodayTasks] = useState<DailyPlan[]>([]);
  const [machineState, setMachineState] = useState<string | null>(null);
  const [hardwareAdvice, setHardwareAdvice] = useState<string>("");

  useEffect(() => {
    let active = true;
    async function fetchQuote() {
      try {
        const res = await fetch("/api/motivational");
        if (res.ok) {
          const data = await res.json();
          if (active && data.quote) {
            setQuote(data.quote);
          }
        }
      } catch (err) {
        console.warn("Could not fetch quote, using fallback.", err);
      } finally {
        if (active) setLoadingQuote(false);
      }
    }
    fetchQuote();
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (student.field === "riazi") {
      setTodayTasks([
        { day: "امروز", morningPlan: "مطالعه دقیق مبحث نظریه اعداد و ترکیبیات", afternoonPlan: "حل تشریحی ۴۰ تست زمان‌دار فیزیک", totalQuestions: 40, completed: false },
        { day: "امروز", morningPlan: "مرور قضیه رول در حسابان", afternoonPlan: "بررسی تست‌های هندسه تحلیلی", totalQuestions: 25, completed: true }
      ]);
    } else if (student.field === "ensani") {
      setTodayTasks([
        { day: "امروز", morningPlan: "تقطیع هجایی و استخراج اختیارهای وزنی", afternoonPlan: "حل تشریحی ۳۰ تست قواعد عربی", totalQuestions: 30, completed: false },
        { day: "امروز", morningPlan: "مرور مبحث مغالطه‌ها در منطق", afternoonPlan: "مطالعه بخش عرضه و تقاضا اقتصاد", totalQuestions: 20, completed: true }
      ]);
    } else {
      setTodayTasks([
        { day: "امروز", morningPlan: "مطالعه دقیق مبحث ژنتیک", afternoonPlan: "حل تشریحی ۵۰ تست استوکیومتری", totalQuestions: 50, completed: false },
        { day: "امروز", morningPlan: "مرور فرمول‌های حرکت‌شناسی", afternoonPlan: "بررسی تست‌های قرابت معنایی", totalQuestions: 25, completed: true }
      ]);
    }
  }, [student.field]);

  const toggleTask = (index: number) => {
    const updated = [...todayTasks];
    updated[index].completed = !updated[index].completed;
    setTodayTasks(updated);
  };

  const completedCount = todayTasks.filter(t => t.completed).length;

  const handleMachineStateChange = (state: string) => {
    setMachineState(state);
    switch (state) {
      case "normal": setHardwareAdvice("شما در بهترین وضعیت تمرکز هستید. زمان خوبی برای مطالعه است."); break;
      case "warm": setHardwareAdvice("کمی خسته شده‌اید. بعد از ۵۰ دقیقه مطالعه، استراحت کنید."); break;
      case "error_risk": setHardwareAdvice("احتمال فراموشی مطالب پایه وجود دارد. مرور سریع مفید است."); break;
      case "optimal": setHardwareAdvice("عالی! آمادگی و انگیزه شما در بالاترین سطح است."); break;
      default: setHardwareAdvice("");
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto" id="dashboard-clean-view">
      
      {/* Header Welcome Card */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-indigo-900 rounded-3xl p-8 relative overflow-hidden text-right shadow-xl shadow-indigo-900/10"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 left-10 w-48 h-48 bg-blue-500/20 rounded-full blur-2xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-xl text-right">
            <h1 className="text-2xl md:text-3xl font-black text-white">
              سلام {student.name} 👋
            </h1>
            <p className="text-sm text-indigo-200 font-bold leading-relaxed">
              {loadingQuote ? "در حال دریافت پیام روز..." : `« ${quote} »`}
            </p>
          </div>
          
          {/* Quick Metrics */}
          <div className="flex gap-4 shrink-0">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 text-center min-w-[120px]">
              <span className="block text-[10px] text-indigo-200 font-black mb-1">روزهای پیوسته</span>
              <span className="block text-3xl font-black text-amber-400 font-mono">{streakDays}</span>
              <span className="block text-[10px] text-indigo-300 mt-1">استریک مطالعه 🚀</span>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Today's Plan */}
        <div className="md:col-span-2 bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-black text-slate-800 flex items-center gap-2">
              <Calendar className="text-indigo-600" size={20} />
              برنامه مطالعاتی امروز
            </h2>
            <span className="text-xs font-bold text-slate-500 bg-slate-50 px-3 py-1 rounded-full">
              {completedCount} از {todayTasks.length} انجام شده
            </span>
          </div>

          <div className="space-y-3">
            {todayTasks.map((task, idx) => (
              <div 
                key={idx}
                onClick={() => toggleTask(idx)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-4 ${
                  task.completed 
                    ? "bg-emerald-50/50 border-emerald-100 opacity-75" 
                    : "bg-white border-slate-200 hover:border-indigo-300 hover:shadow-md"
                }`}
              >
                <div className={`mt-0.5 w-6 h-6 rounded-lg border-2 flex items-center justify-center shrink-0 transition-colors ${
                  task.completed ? "bg-emerald-500 border-emerald-500 text-white" : "border-slate-300 text-transparent"
                }`}>
                  <CheckSquare size={14} />
                </div>
                <div className="space-y-1">
                  <p className={`text-sm font-black transition-colors ${task.completed ? "text-slate-500 line-through" : "text-slate-800"}`}>
                    {task.morningPlan}
                  </p>
                  <p className={`text-xs font-bold ${task.completed ? "text-slate-400" : "text-slate-500"}`}>
                    {task.afternoonPlan}
                  </p>
                </div>
              </div>
            ))}
          </div>
          
          <button 
            onClick={() => onNavigate("schedule")}
            className="mt-6 w-full py-3 bg-slate-50 hover:bg-slate-100 text-indigo-600 font-black text-xs rounded-xl transition flex items-center justify-center gap-2"
          >
            مشاهده برنامه کامل هفته
            <ArrowRight size={14} />
          </button>
        </div>

        {/* Mental Readiness & Quick Actions */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm text-center">
            <h3 className="text-sm font-black text-slate-800 flex items-center gap-2 justify-center mb-4">
              <HeartPulse size={16} className="text-rose-500" />
              وضعیت آمادگی ذهنی
            </h3>
            
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: "optimal", icon: "✨", label: "ایده‌آل" },
                { id: "normal", icon: "⚡", label: "پایدار" },
                { id: "warm", icon: "🌡️", label: "خسته" },
                { id: "error_risk", icon: "⚠️", label: "پریشان" }
              ].map((m) => (
                <button
                  key={m.id}
                  onClick={() => handleMachineStateChange(m.id)}
                  className={`p-3 rounded-xl transition-all border flex flex-col items-center gap-1.5 ${
                    machineState === m.id
                      ? "bg-amber-50 border-amber-200 scale-105"
                      : "bg-slate-50 border-transparent hover:bg-slate-100"
                  }`}
                >
                  <span className="text-xl">{m.icon}</span>
                  <span className="text-[10px] font-black text-slate-600">{m.label}</span>
                </button>
              ))}
            </div>

            <AnimatePresence>
              {machineState && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4"
                >
                  <p className="text-[11px] text-slate-600 leading-relaxed font-bold bg-slate-50 p-3 rounded-xl">
                    {hardwareAdvice}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          <div className="bg-indigo-50 rounded-3xl p-6 border border-indigo-100 shadow-sm flex flex-col items-center text-center space-y-3">
             <div className="w-12 h-12 bg-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200">
               <Sparkles size={24} />
             </div>
             <h3 className="text-sm font-black text-indigo-900">نیاز به تحلیل دقیق‌تر؟</h3>
             <p className="text-[11px] text-indigo-700/80 font-bold">برای مشاهده نمودار پیشرفت، اشتباهات متداول و دریافت راهکارهای هوشمند به کارنامه مراجعه کنید.</p>
             <button 
                onClick={() => onNavigate("report")}
                className="w-full mt-2 py-2.5 bg-indigo-600 text-white font-black text-xs rounded-xl shadow-md hover:bg-indigo-700 transition"
             >
               مشاهده کارنامه جامع
             </button>
          </div>
        </div>
      </div>
      
    </div>
  );
}
