import React from 'react';
import { Download, Smartphone, Apple, Monitor, CheckCircle2, Shield, Zap, ArrowRight, ExternalLink } from 'lucide-react';
import { BRAND_CONFIG } from '../constants';

export default function MobileDownloadView({ onNavigate }: { onNavigate: (target: string) => void }) {
  // Direct APK download link (pointing to the compiled production build / stable APK asset in repo / release)
  const apkDownloadUrl = "https://github.com/Websites-by-AI/Taranom-psychology-school-10milion-panel/raw/main/public/downloads/taranom-mehr-v2.4.0.apk";
  const pwaUrl = "https://hamdeltar.ir";

  return (
    <div className="min-h-screen bg-slate-950 text-white py-16 px-6 RTL" style={{ direction: 'rtl' }}>
      <div className="max-w-5xl mx-auto space-y-16">
        
        {/* Header Hero */}
        <div className="text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-xs font-black text-indigo-400">
            <Smartphone size={14} />
            <span>لینک‌های مستقیم دانلود اپلیکیشن موبایل</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight">
            دانلود اپلیکیشن <span className="text-indigo-400">{BRAND_CONFIG.name}</span>
          </h1>
          <p className="text-slate-400 text-sm md:text-base max-w-2xl mx-auto font-medium leading-relaxed">
            نسخه‌های رسمی اندروید و iOS اپلیکیشن ترنم همدلی آماده دانلود هستند. با نصب اپلیکیشن، همیشه به مشاور هوش مصنوعی و آزمون‌های تله‌های تستی دسترسی خواهید داشت.
          </p>
        </div>

        {/* Download Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Android Card */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-900/80 border border-slate-800 rounded-[32px] p-8 space-y-6 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
                <Smartphone size={32} />
              </div>
              <div>
                <h3 className="text-xl font-black text-white">نسخه اندروید (APK)</h3>
                <p className="text-xs text-slate-400 font-bold mt-1">نسخه ۲.۴.۰ — حجم: ۱۵.۲ مگابایت</p>
              </div>
            </div>

            <ul className="space-y-3 text-xs text-slate-300 font-bold">
              <li className="flex items-center gap-2.5">
                <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                <span>دسترسی آفلاین به خلاصه‌های درسی و تله‌های تستی</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                <span>نوتیفیکیشن هوشمند پومودورو و یادآوری پارت‌های مطالعاتی</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                <span>سازگار با تمامی گوشی‌ها و تبلت‌های اندروید (۸ به بالا)</span>
              </li>
            </ul>

            <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row gap-3">
              <a 
                href={apkDownloadUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs py-4 px-6 rounded-2xl transition-all shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 text-center"
              >
                <Download size={16} />
                <span>دانلود مستقیم فایل APK اندروید</span>
              </a>
            </div>
            <div className="text-[10px] text-slate-500 font-mono text-center">
              لینک مستقیم: {apkDownloadUrl}
            </div>
          </div>

          {/* iOS / PWA Card */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-900/80 border border-slate-800 rounded-[32px] p-8 space-y-6 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center border border-indigo-500/20">
                <Apple size={32} />
              </div>
              <div>
                <h3 className="text-xl font-black text-white">نسخه آیفون و آیپد (iOS)</h3>
                <p className="text-xs text-slate-400 font-bold mt-1">نسخه وب‌اپلیکیشن پیشرفته (PWA)</p>
              </div>
            </div>

            <ul className="space-y-3 text-xs text-slate-300 font-bold">
              <li className="flex items-center gap-2.5">
                <CheckCircle2 size={16} className="text-indigo-400 shrink-0" />
                <span>بدون نیاز به اپ‌استور — اجرا مستقیم از مرورگر Safari</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 size={16} className="text-indigo-400 shrink-0" />
                <span>قابلیت افزودن به صفحه اصلی آیفون (Add to Home Screen)</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 size={16} className="text-indigo-400 shrink-0" />
                <span>همگام‌سازی لحظه‌ای با دیتابیس ابری D1</span>
              </li>
            </ul>

            <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row gap-3">
              <a 
                href={pwaUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs py-4 px-6 rounded-2xl transition-all shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2 text-center"
              >
                <ExternalLink size={16} />
                <span>باز کردن نسخه وب‌اپلیکیشن iOS</span>
              </a>
            </div>
            <div className="text-[10px] text-slate-500 font-mono text-center">
              آدرس دسترسی: {pwaUrl}
            </div>
          </div>

        </div>

        {/* Back Button */}
        <div className="text-center pt-4">
          <button 
            onClick={() => onNavigate("welcome")}
            className="inline-flex items-center gap-2 text-indigo-400 hover:text-indigo-300 text-xs font-black transition-all bg-indigo-950/50 border border-indigo-800/50 px-6 py-3 rounded-2xl"
          >
            <ArrowRight size={14} />
            <span>بازگشت به پیشخوان اصلی سامانه</span>
          </button>
        </div>

      </div>
    </div>
  );
}
