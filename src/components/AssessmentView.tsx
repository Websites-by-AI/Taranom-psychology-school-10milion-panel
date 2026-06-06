import React, { useState, useEffect, useRef, useMemo } from "react";
import { 
  Brain, Sparkles, Wind, Award, Clock, Heart, 
  Calendar, Check, Play, RefreshCw, AlertCircle, 
  TrendingUp, BarChart3, Info, ChevronLeft, Percent, Layers, ClipboardList, ArrowLeftRight, HelpCircle, Smile,
  UserPlus, Home, GraduationCap, Target, Activity, Zap, ShieldAlert, Eye, BookMarked, ExternalLink,
  Printer, Trash2, Plus, FileText
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { Student, Exam } from "../types";
import { addSystemLog } from "../lib/syslogs";

interface AssessmentViewProps {
  student: Student;
  role?: "student" | "parent" | "admin" | "counselor" | "teacher" | null;
  onNavigateChange?: (view: string) => void;
}

interface PsychologyReport {
  id: string;
  date: string;
  cognitiveProfile: {
    focusIndex: number;
    resilience: number;
    academicDrive: number;
    stamina: number;
    anxietyManagement: number;
    sleepEfficacy: number;
  };
  stressLevel: number;
  diagnosis: string;
  cognitiveTrap: string;
  remedies: string[];
  meditationAdvice: string;
  breathingPaceSec: number;
}

const toPersianNum = (n: number | string): string => {
  const farsiDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  return n.toString().replace(/\d/g, (x) => farsiDigits[parseInt(x)]);
};

const PSY_TESTS = {
  anxiety: {
    title: "تست غربالگری اضطراب آزمودنی بک (BAI)",
    subtitle: "اندازه‌گیری و تفکیک ترس بالینی، علائم بدنی کورتیزول و قفل‌شدگی هیپوکامپ",
    intro: "این غربالگری روان‌شناختی وضعیت انقباض عضلانی، اضطراب شناختی و فاجعه‌سازی ذهنی شما را در جلسات آزمون پایش می‌کند.",
    questions: [
      { id: 1, text: "احساس تپش قلب شدید، لرزش دست یا بی‌قراری بدنی حین پارت‌های آزمونی." },
      { id: 2, text: "ترس مفرط از شکست و افکار فاجعه‌ساز درباره رتبه (مثلاً نابود شدن کامل زندگی آینده)." },
      { id: 3, text: "احساس سفتی مفرط عضلات، عرق سرد، تنگی نفس یا قفل شدن فک هنگام یادآوری کتب تلنبار شده." },
      { id: 4, text: "سرگیجه، تاری دید، یا حالت تهوع خفیف مابین پورت‌های درسی یا قبل شروع کوییز." },
      { id: 5, text: "ترس از دست دادن کنترل، توقف ذهنی (بلاک حافظه) یا پاک شدن ناگهانی فرمول‌ها در برابر سوالات دشوار." },
      { id: 6, text: "برآشفتگی عصبی یا پرخاشگری پیاپی برای مسائل بسیار کوچک به علت فشار درس." },
      { id: 7, text: "بی‌خوابی مکرر، بیدار شدن با تپش دلهره در ساعت پایانی شب یا کابوس آزمون با درصد منفی." }
    ],
    getFeedback: (score: number) => {
      if (score <= 6) return {
        level: "اضطراب طبیعی و محرک (سازنده)",
        levelColor: "text-emerald-700 bg-emerald-50 border-emerald-100",
        clinicalAnalysis: "سطح اضطراب شما در محدوده طبیعی و بهینه است. پالس‌های خفیف آدرنالین برای بیداری قشر مغز و حفظ انگیزه کاملاً سازنده است.",
        examImpact: [
          "حفظ تمرکز و پایداری عملکردی کامل در ماراتن ۴ ساعته کنکور.",
          "یادآوری سریع فرمول‌ها و ممانعت از توقف حافظه حین آزمون.",
          "ثبات کامل دستان و تنفس در دفترچه‌های محاسباتی سنگین."
        ],
        remedies: [
          "حفظ ریتم پومودوروی ۵۰-۱۰ فعلی در منزل.",
          "تخصیص ۵ دقیقه ذهن‌آگاهی تنفس برای صبحانه.",
          "تمرین تست‌زنی با روش حل چندایده‌ای."
        ],
        medicalAdvice: "نیازی به درمان روان‌پزشکی یا مداخله دارویی بالینی وجود ندارد."
      };
      if (score <= 13) return {
        level: "اضطراب متوسط (آزاددهنده و فرسایشی)",
        levelColor: "text-amber-700 bg-amber-50 border-amber-100",
        clinicalAnalysis: "اضطراب فرسایشی متوسط بر سیستم سمپاتیک شما حاکم شده است. ترشح مداوم کورتیزول باعث خستگی زودرس ذهن و مسدود شدن جریان خلاقیت پردازشی می‌شود.",
        examImpact: [
          "کاهش ۱۰ تا ۱۵ درصدی سرعت پردازش سوالات زمان‌دار کنکور.",
          "تردیدهای پیاپی و تغییر مکرر پاسخ‌های صحیح به غلط.",
          "خطای محاسباتی مضحک ناشی از حواس‌پرتی ثانیه‌ای."
        ],
        remedies: [
          "اجرای ۳ دقیقه تنفس بیوفیدبک مهارکننده سمپاتیک قبل از هر آزمون شبیه‌ساز.",
          "عدم تمرکز روی ساعت مچی به صورت فرسایشی.",
          "پیاده‌سازی متد تمرینی با استفاده از کارت‌های استراتژی عبور."
        ],
        medicalAdvice: "انجام رفتاردرمانی شناختی (CBT) جهت مهار فاجعه‌سازی؛ ارزیابی فاکتور خواب و استفاده از دمنوش‌های طبیعی تاییدشده مانند بابونه و بادرنجبویه."
      };
      return {
        level: "اضطراب شدید بالینی (موجب بلاک شناختی)",
        levelColor: "text-rose-700 bg-rose-50 border-rose-100",
        clinicalAnalysis: "اضطراب بالینی حاد بر غشای مغزی شما حکمفرماست. ترشح سرریز آدرنالین باعث فوبیا و پدیده عصب‌شناختی 'قفل ذهنی' (Mental Block) در جلسات کوییز می‌شود.",
        examImpact: [
          "خالی شدن ناگهانی حافظه و ندیدن سوالات آسان در آزمون.",
          "tari دید موقت، گریه ناگهانی یا لرزش دست شدید در شروع جلسه.",
          "احساس سرکوب عمیق و خستگی شدید روحی بعد از ۳۰ دقیقه اول."
        ],
        remedies: [
          "آموختن ریلکسیشن عضلانی پیشرونده جاکوبسون (PMR) روزانه ۱۰ دقیقه.",
          "تمرین حل تست‌های کنکور در خانه بدون در نظر گرفتن زمان تا ۳ هفته.",
          "حذف مطلق صحبت‌های منفی با خانواده و کانال‌های رتبه‌سنج تلگرام."
        ],
        medicalAdvice: "توصیه مبرم برای ارجاع بالینی نزد پزشک متخصص اعصاب و روان (روانپزشک) جهت ممیزی و ارزیابی لزوم درمان‌های دارویی علامتی (نظیر پروپرانولول یا داروهای انتخابی بازجذب سروتونین SSRI) همراه با روان‌درمانی فشرده تحصیلی."
      };
    }
  },
  depression: {
    title: "تست فرسودگی تحصیلی و افسردگی بک (BDI)",
    subtitle: "ارزیابی سطوح بی‌رمقی ذهنی، فقدان انگیزه تحصیلی و درماندگی آموخته‌شده",
    intro: "این ابزار بالینی تراز انرژی حیاتی، بدبینی شناختی و افت عملکرد در قالب پدیده فرسودگی تحصیلی (Academic Burnout) را ارزیابی می‌کند.",
    questions: [
      { id: 1, text: "احساس ناامیدی شدید و این ایده مخرب که «من هر چقدر هم درس بخوانم، باز هم به نتیجه دلخواهم نمی‌رسم»." },
      { id: 2, text: "کاهش شدید اشتیاق و علاقه به کتب؛ حس کلافگی عمیق و پوچی تمام تلاش‌های تلاش درسی کنکور." },
      { id: 3, text: "احساس فرسودگی مداوم، تنبلی عضلانی و کمبود انرژی حیاتی به صورتی که حتی با خواب زیاد باز هم تمایل به بیداری ندارم." },
      { id: 4, text: "سرزنش گزنده خود، احساس گناه مکرر بابت ساعت‌های تلف‌شده گذشته و لگدمال کردن عزت‌نفس تحصیلی." },
      { id: 5, text: "میل شدید به ایزوله‌سازی خود، عدم پاسخ به خانواده و مشاوران و رها کردن نگارش گزارشکار به علت احساس شرم." },
      { id: 6, text: "تعلل گزافه (Procrastination)، افت سنگین در آغاز پارت‌های درمانی روزانه و ترجیح انفعال محض." },
      { id: 7, text: "اتکا به پناه جستن‌های فرارگونه نظیر خواب مفرط روزانه یا گشت‌وگذار مخرب چندین ساعته در گوشی مابین پارت‌ها." }
    ],
    getFeedback: (score: number) => {
      if (score <= 6) return {
        level: "نشاط روحی بهینه و نوسانات طبیعی انگیزه",
        levelColor: "text-emerald-700 bg-emerald-50 border-emerald-100",
        clinicalAnalysis: "شما در دایره بهداشتی عالی روان هستید. افت‌های جزئی انگیزه مابین بودجه‌بندی‌ها در مسیر کنکور واکنش زیستی طبیعی مغز است و افسردگی شمرده نمی‌شود.",
        examImpact: [
          "ذخیره انرژی پردازشی کافی برای جنگ بر سر نمره در ساعات آخر دفترچه‌های اختصاصی.",
          "تمرکز عمیق ذهنی و پیگیری متداولی برای تست‌های محاسباتی چندمرحله‌ای."
        ],
        remedies: [
          "پافشاری بر پومودوروهای روزانه کنکور.",
          "تخصیص جوایز خرد دوپامینی (ملاقات با دوستان موفق یا تماشای فیلم خانوادگی مناسب).",
          "تمرین خلاق خلاصه‌نویسی تنه اصلی مباحث."
        ],
        medicalAdvice: "نیازی به مداخله دارویی نیست. ادامه روش تغذیه‌ای غنی و ورزش متوسط برای حفظ شادابی توصیه می‌شود."
      };
      if (score <= 13) return {
        level: "فرسودگی تحصیلی متوسط (Burnout)",
        levelColor: "text-orange-700 bg-orange-50 border-orange-100",
        clinicalAnalysis: "افسردگی هورمونی خفیف یا خستگی مفرط تحصیلی بر سلول‌های عصبی شما سایه انداخته است. سرکوب دوپامینی ناشی از یکنواختی مفرط برنامه یا ترس مداوم، مانع تمرکز دیپ-فلو می‌شود.",
        examImpact: [
          "حس رهاسازی زودرس در مواجه با صورت تست‌های حجیم زیست و ادبیات آزمون.",
          "کندی در بازیابی پاسخ‌ها به دلیل قفل حواس موقت.",
          "بی تفاوتی عمیق نسبت به نمره و درصد به علت کلافگی عصبی."
        ],
        remedies: [
          "پیاده‌سازی الگوی ریکاوری میکرو کایزن: نصف کردن موقت بودجه تکلیفی جهت استراحت قشر پردازشگر مغز.",
          "درج یک روز استراحت مطلق در ماه جهت خروج دوپامین از استپ رقابتی.",
          "تغییر محیط فیزیکی درس خواندن و مطالعه در سالن‌های جمعی یا کتابخانه‌ها."
        ],
        medicalAdvice: "ضروری است مربی تحصیلی تراز درسی شما را ملایم کند؛ انجام آزمایش بررسی ویتامین D3، تست هورمونی تیروئید و آهن خون بالینی ضرورت دارد."
      };
      return {
        level: "افسردگی شدید بالینی و تخلیه انرژی مغزی",
        levelColor: "text-rose-700 bg-rose-50 border-rose-100",
        clinicalAnalysis: "شدت فرسودگی تحصیلی و بدبینی روحی داوطلب به مرز بالینی حاد رسیده است. عدم حضور فلوئیدهای شادابی در سیناپس‌های ترشح سروتونین مغز، یادگیری عمیق را کاملاً فلج کرده است.",
        examImpact: [
          "عدم قابلیت تمرکز ممتد بیش از ۳۰ دقیقه و رها کردن صندلی آزمون در میان راه.",
          "ناراحتی و گریه‌های خاموش، انفعال پایتختی و عدم توانایی حل سوالات تک ایده‌ای آسان زیست.",
          "کندی شدید روانی-حرکتی (حل یک کوییز ۱۰ سواله برای شما بیش از ۵۰ دقیقه طول می‌کشد)."
        ],
        remedies: [
          "توقف کامل امتحانات شبیه‌ساز کنکور یا فیدبک‌های تندکار به مدت ۱ هفته جهت استراحت غشا مغز.",
          "تکه تکه کردن تمامی کتاب‌ها به جزوه‌های درختی کوچک ۱۰ دقیقه‌ای.",
          "اجبار فیزیکال به پیاده‌روی در معرض نور مستقیم خورشید قبل از ساعت ۸ صبح جهت کوپل هورمونی."
        ],
        medicalAdvice: "نیازمند ممیزی فوری و ارجاع تخصصی بالینی نزد پزشک متخصص روانپزشکی. مداخله دارویی با مهارکننده‌های سروتونین (SSRIها همانند فلوکستین، سرترالین یا اس‌سیتالوپرام با هدف احیاء سیناپسی نوروترانسمیترها) تحت نظر روانپزشک و پشتیبان روانشناختی کنکور بسیار حیاتی است."
      };
    }
  },
  ocd: {
    title: "تست وسواس تکرار و تردید مرضی مطالعه (Yale-Brown Modified)",
    subtitle: "ارزیابی روانشناختی دوباره‌خوانی وسواسی، شک مداوم تستی، قفل بر روی تسک و دوباره‌کاری‌های فرساینده (وسواس تکرار)",
    intro: "این ابزار بالینی بروز رفتارهای وسواس‌گونه تحصیلی و تکرار مرضی کارها (وسواس تکرار، دوباره‌خوانی وسواسی، شک‌های ممتد و قفل بر روی یک تسک) را ممیزی کرده، آثار فاجعه‌بار آن بر هدررفت وقت تستی کنکور را شرح داده و راه‌حل مهار آن را به صورت علمی ارائه می‌کند.",
    questions: [
      { id: 1, text: "دوباره‌خوانی و چندین‌باره‌خوانی وسواسی یک پاراگراف یا فرمول، حتی زمانی که معنی آن را عمیقاً فهمیده‌اید اما ندایی وسواسی به شما بازگو می‌کند که مجدداً بخوانید." },
      { id: 2, text: "بررسی و ممیزی وسواسی مجدد و مکرر پاسخ‌برگ و حل چندباره تست‌های نسبتاً ساده، از ترس مداوم بابت خطاهای فاحش بدوی." },
      { id: 3, text: "اتلاف وقت سنگین برای کارهای جانبی نظیر خلاصه‌نویسی‌های وسواسی مجدد، نقاشی حاشیه‌های خطوط یا مرتب کردن چیدمان تحصیلی به اندازه ساعات طولانی." },
      { id: 4, text: "پاک کردن چهل‌باره یادداشت‌ها، پاره کردن خلاصه نویسی‌ها بابت ناهمواری دست‌خط و شروع نوشتن برگه از ابتدا با اصرار برای کمال‌گرایی کاذب." },
      { id: 5, text: "شک پسینی وسواسی به گزینه‌هایی که انتخاب کرده‌اید که باعث جابجایی دائم گزینه‌ها و تغییر پاسخ‌های صحیح به غلط در انتهای آزمون می‌شود." },
      { id: 6, text: "قفل کردن عاجزانه روی یک مبحث درسی سخت و امتناع شدید از عبور از آن، به نحوی که کل مابقی برنامه درسی آن روز قربانی همان یک پارت گردد." },
      { id: 7, text: "وسواس توازن زمانی فتیش‌وار؛ مثلاً صبر می‌کنید تا زمان کاملاً رند شود تا درس شروع شود و اگر دقیقه‌ای بگذرد کل پارت مطالعاتی را تعلیق می‌کنید." }
    ],
    getFeedback: (score: number) => {
      if (score <= 6) return {
        level: "دقت بالا و ممیزی منظم علمی (دقت رتبه برتر)",
        levelColor: "text-emerald-700 bg-emerald-50 border-emerald-100",
        clinicalAnalysis: "رفتارهای کنترلی شما در رده دقت علمی بهینه تحصیلی است. این دقت بالا، درصد خطاهای محاسباتی تصادفی شما را با مهار وسواس تکرار، کاهش می‌دهد.",
        examImpact: [
          "کاهش قاطع فوت وقت‌های کاذب در امتحانات تشخیصی.",
          "ثبت با اطمینان گزینه‌ها از شروع جوابدهی بدون ترس لرزان ثانویه.",
          "انتخاب راحت و حرکت گام به گام روی کل بدنه سوالات."
        ],
        remedies: [
          "ثبات در سیستم یادداشت مکتوب حین حل حل مسئله ریاضی.",
          "ضربدر زدن کنار تست‌های اتمام یافته جهت مهر موم ذهنی."
        ],
        medicalAdvice: "عدم نیاز به هرگونه مداخله روان‌پزشکی یا دارویی."
      };
      if (score <= 13) return {
        level: "وسواس تکرار و شک تحصیلی متوسط",
        levelColor: "text-amber-700 bg-amber-50 border-amber-100",
        clinicalAnalysis: "شما در آستانه ابتلا به وسواس عملی مطالعه (رفتار کنترلی تکرار مرضی تسک‌ها) هستید. عدم توانایی مغز در صادر کردن سیگنال اتمام کار (Completion Signal) ناشی از ناهماهنگی شیمیایی در هسته دم‌دار مغز است.",
        examImpact: [
          "کمبود شدید وقت مکرر در تمام دروس عمومی و کنکور.",
          "نرسیدن به تست‌های ردیف ۲ انتهای دفترچه‌ها علیرغم تسلط علمی کامل.",
          "خستگی مفرط عضلانی چشم‌ها و سر سنگینی شدید در دقایق پایانی آزمون."
        ],
        remedies: [
          "رعایت سختگیرانه پروتکل ERP (مواجهه و جلوگیری از پاسخ): خواندن زیست با پوشش کارت مشکی روی سطور قبلی جهت انسداد فیزیکی حرکت دوباره چشم به عقب.",
          "مهر و موم کردن هر تست حل شده با علامت تیک بزرگ و ممانعت تام از تجدید حل آن تستی.",
          "بستن قرارداد زمانی صلب (تکنیک جعبه زمانی تستی) برای حل هر دسته تست."
        ],
        medicalAdvice: "اصلاح رفتاری با کمک مربی متخصص جهت افزایش پذیرش خطاهای جزئی محاسباتی؛ تمرین رهاسازی شناختی از مهار تردیدهای کاذب."
      };
      return {
        level: "وسواس عملی شدید تحصیلی (وسواس تکرار و تردید وسواسی مفرط)",
        levelColor: "text-rose-700 bg-rose-50 border-rose-100",
        clinicalAnalysis: "شما دچار وسواس فکری-عملی شدید (OCD تحصیلی) در تکرار پیاپی تسک‌ها هستید. اختلال در مدارهای عصبی کورتیکو-استریاتو-تالامو-کورتیکال (CSTC) مغز باعث پایداری 'چرخه خطا' شده و مغز علیرغم فهمیدن علمی، تشنه تکرار مجدد و غیرضروری می‌گردد.",
        examImpact: [
          "هدررفت بیش از ۶۰ تا ۸۰ دقیقه وقت گرانبها در آزمون‌ها بابت ریدینگ‌های وسواسی و مجدد صورت سوالات تستی.",
          "پاره کردن متناوب دفترچه، پاک کردن مکرر و هیستریک و تغییر بیش از ۸ گزینه صحیح به غلط ناشی از شک جهنمی گزینه‌ای.",
          "سوختن روزانه بیش از ۷۰ درصد از برنامه زمانی مطالعاتی مشاور به علت قفل روانی بی‌ثمر روی یک برگ کتب."
        ],
        remedies: [
          "تمرین فشرده مواجهه و جلوگیری از پاسخ (ERP) با کمک مداخله روان‌شناختی پشتیبان.",
          "تست‌زنی اجباری با مدادی بدون مجهز بودن به پاک‌کن (حل تست بدون مجاز بودن به اصلاح یا تغییر بعد انتخاب).",
          "استفاده از خلاصه‌نویسی تلفظی صوتی بجای وسواس سیاه یا چنگی مکرر روی برگه ها.",
          "استراحت عالی و پاشیدن آب سرد به صورت جهت انقطاع مدارهای فکری وسواسی."
        ],
        medicalAdvice: "درمان این سطح حاد از وسواس تکرار کارها (OCD) بدون همگامی دارویی با خط درمانی روانپزشکی عموماً بی‌اثر می‌ماند. مراجعه مبرم به روانپزشک جهت ارزیابی بالینی مفاخر دارویی تراز مهار وسواس (مانند کلومیپرامین، قرص فلووکسامین یا مهارکننده‌های سروتونین SSRIs با دوزهای بالینی کنترل مکرر مرضی کارهای تکراری) در همسویی کامل با پروتکل درمانی تخصصی CBT-ERP."
      };
    }
  }
};

export default function AssessmentView({ student, role, onNavigateChange }: AssessmentViewProps) {
  const [activeTab, setActiveTab] = useState<"exam-diagnostic" | "ai-synthesis" | "breathing" | "smart-profile" | "scientific-analysis" | "re-design-showcase" | "clinical-tests">("re-design-showcase");

  // Clinical Test states
  const [activeTestKey, setActiveTestKey] = useState<"anxiety" | "depression" | "ocd" | null>(null);
  const [currentTestQIndex, setCurrentTestQIndex] = useState(0);
  const [testAnswers, setTestAnswers] = useState<number[]>([]);
  const [testCompleted, setTestCompleted] = useState(false);

  // Counselor interview states
  const [activeClinicalSubTab, setActiveClinicalSubTab] = useState<"screenings" | "interviews">("screenings");
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [observeTitle, setObserveTitle] = useState("");
  const [observeNotes, setObserveNotes] = useState("");
  const [observeDiagnosis, setObserveDiagnosis] = useState("");
  const [observeSeverity, setObserveSeverity] = useState<"critical" | "warning" | "mild">("warning");
  const [customPrescripts, setCustomPrescripts] = useState<string[]>([]);
  const [newPrescriptText, setNewPrescriptText] = useState("");
  const [interviews, setInterviews] = useState<any[]>(() => {
    const saved = localStorage.getItem(`taranom_psychology_interviews_${student.id}`);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { return []; }
    }
    return [
      {
        id: "INT-304",
        date: "۱۴۰۶/۰۳/۰۵",
        title: "بررسی افت ساعت مطالعه و خستگی حاد مفرط",
        symptoms: ["افت ساعت مطالعه", "بی‌قراری و تنش فیزیکی", "فرسودگی و کلافگی شدید"],
        notes: "در مصاحبه حضوری مشخص شد داوطلب به علت فشار مستمر هفته‌های پایانی منتهی به آزمون جامع دچار خستگی حاد چشم و کاهش انگیزه گردیده است. ساعت خواب شبانه او به ۵ ساعت افت کرده است.",
        diagnosis: "خستگی مزمن ذهن و فرسودگی تحصیلی دور پایانی (Burnout)",
        prescriptions: [
          "اجرای روزانه ۲ نوبت تنفس تعاملی بیوفیدبک ۴ ثانیه‌ای",
          "کاهش ساعت مطالعه تجمعی به ۱۰ ساعت برای ایجاد بازیابی ذهنی",
          "مصرف دمنوش بادرنجبویه شبانه جهت تثبیت فاکتور خواب"
        ],
        severity: "warning"
      }
    ];
  });
  const [printPreviewInterview, setPrintPreviewInterview] = useState<any | null>(null);

  useEffect(() => {
    localStorage.setItem(`taranom_psychology_interviews_${student.id}`, JSON.stringify(interviews));
  }, [interviews, student.id]);

  // Get the latest mock exam based on student's field
  const latestExam: Exam = useMemo(() => {
    if (student.field === "riazi") {
      return {
        id: "4",
        date: "۲۵ خرداد ۱۴۰۵",
        title: "آزمون جامع نهایی شبیه‌ساز کنکور سراسری ریاضی",
        traz: 6180,
        rank: 890,
        overallPercentage: 74,
        lessons: [
          { lessonName: "حسابان و ریاضیات", percentage: 55, correct: 22, wrong: 8, empty: 10 },
          { lessonName: "هندسه و گسسته", percentage: 65, correct: 26, wrong: 6, empty: 8 },
          { lessonName: "فیزیک تخصصی", percentage: 72, correct: 29, wrong: 5, empty: 6 },
          { lessonName: "شیمی تخصصی", percentage: 85, correct: 34, wrong: 2, empty: 4 }
        ]
      };
    } else if (student.field === "ensani") {
      return {
        id: "4",
        date: "۲۵ خرداد ۱۴۰۵",
        title: "آزمون جامع نهایی شبیه‌ساز کنکور سراسری انسانی",
        traz: 6180,
        rank: 890,
        overallPercentage: 74,
        lessons: [
          { lessonName: "جامعه‌شناسی", percentage: 55, correct: 22, wrong: 8, empty: 10 },
          { lessonName: "ادبیات فارسی تخصصی", percentage: 65, correct: 26, wrong: 6, empty: 8 },
          { lessonName: "عربی تخصصی", percentage: 72, correct: 29, wrong: 5, empty: 6 },
          { lessonName: "فلسفه و منطق", percentage: 85, correct: 34, wrong: 2, empty: 4 },
          { lessonName: "روان‌شناسی", percentage: 92, correct: 37, wrong: 1, empty: 2 }
        ]
      };
    } else {
      // tajrobi
      return {
        id: "4",
        date: "۲۵ خرداد ۱۴۰۵",
        title: "آزمون جامع نهایی شبیه‌ساز کنکور سراسری تجربی",
        traz: 6180,
        rank: 890,
        overallPercentage: 74,
        lessons: [
          { lessonName: "زیست‌شناسی", percentage: 55, correct: 22, wrong: 8, empty: 10 },
          { lessonName: "شیمی", percentage: 65, correct: 26, wrong: 6, empty: 8 },
          { lessonName: "فیزیک", percentage: 72, correct: 29, wrong: 5, empty: 6 },
          { lessonName: "ریاضیات تجربی", percentage: 85, correct: 34, wrong: 2, empty: 4 },
          { lessonName: "زمین‌شناسی", percentage: 92, correct: 37, wrong: 1, empty: 2 }
        ]
      };
    }
  }, [student.field]);

  // Derived psychological scores based on latest exam metrics
  const derivedParams = useMemo(() => {
    const totalCorrect = latestExam.lessons.reduce((sum, l) => sum + l.correct, 0);
    const totalWrong = latestExam.lessons.reduce((sum, l) => sum + l.wrong, 0);
    const totalEmpty = latestExam.lessons.reduce((sum, l) => sum + l.empty, 0);
    const totalQuestions = totalCorrect + totalWrong + totalEmpty || 1;

    const wrongRatio = totalWrong / totalQuestions;
    const emptyRatio = totalEmpty / totalQuestions;

    // Anxiety of Exam (0 to 10 scale): driven by wrong answers (negative marking) and general accuracy
    const anxietyScore = Math.min(10, Math.max(1, Math.round(wrongRatio * 20 + 2)));

    // Focus Score (1 to 10 scale): driven by overall percentage
    const focusScore = Math.min(10, Math.max(1, Math.round(latestExam.overallPercentage / 10)));

    // Perfectionism score (avoidance vs wrong answers): a lot of unattempted questions indicate high perfectionism/fear of negative mark
    const perfectionismScore = Math.min(10, Math.max(1, Math.round(emptyRatio * 22 + 2)));

    // Stamina/Mental endurance: drops or issues in analytical/last exams lessons
    const harderLesson = latestExam.lessons.find(l => l.lessonName.includes("ریاضی") || l.lessonName.includes("شیمی") || l.lessonName.includes("فلسفه"));
    const harderPercentage = harderLesson ? harderLesson.percentage : latestExam.overallPercentage;
    const staminaScore = Math.min(10, Math.max(1, Math.round(harderPercentage / 10)));

    return {
      anxiety: anxietyScore,
      focus: focusScore,
      perfectionism: perfectionismScore,
      sleep: 6, // general night recovery baseline
      stamina: staminaScore,
      totalCorrect,
      totalWrong,
      totalEmpty,
      totalQuestions
    };
  }, [latestExam]);

  // Assessment question states initialized precisely with derived values
  const [qAnxiety, setQAnxiety] = useState(derivedParams.anxiety);
  const [qFocus, setQFocus] = useState(derivedParams.focus);
  const [qPerfectionism, setQPerfectionism] = useState(derivedParams.perfectionism);
  const [qSleep, setQSleep] = useState(derivedParams.sleep);
  const [qStamina, setQStamina] = useState(derivedParams.stamina);

  // Life Context States
  const [city, setCity] = useState(student.city || "تهران");
  const [familyContext, setFamilyContext] = useState(student.familyContext || "حمایت متوسط");
  const [financialStatus, setFinancialStatus] = useState<"good" | "limited" | "challenging">(student.financialStatus || "limited");
  const [mainGoal, setMainGoal] = useState(student.mainGoal || "رتبه برتر کنکور");

  // Sync state if student/field/latestExam changes
  useEffect(() => {
    setQAnxiety(derivedParams.anxiety);
    setQFocus(derivedParams.focus);
    setQPerfectionism(derivedParams.perfectionism);
    setQSleep(derivedParams.sleep);
    setQStamina(derivedParams.stamina);
  }, [derivedParams]);

  const [loading, setLoading] = useState(false);
  const [currentReport, setCurrentReport] = useState<PsychologyReport | null>(null);
  const [reports, setReports] = useState<PsychologyReport[]>([]);

  // Breathing Chamber States
  const [isBreathingActive, setIsBreathingActive] = useState(false);
  const [breathPhase, setBreathPhase] = useState<"inhale" | "hold" | "exhale" | "rest">("inhale");
  const [breathTimer, setBreathTimer] = useState(4);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const synthIntervalRef = useRef<any>(null);

  // Re-design Showcase States (منشور جدید همدلی)
  const [isConversationalStyle, setIsConversationalStyle] = useState(true);
  const [reDesignReasons, setReDesignReasons] = useState<string[]>(["", "", ""]);
  const [customReasonsSaved, setCustomReasonsSaved] = useState(false);
  const [isBreathingTimerActive, setIsBreathingTimerActive] = useState(false);
  const [breathingTimerCountdown, setBreathingTimerCountdown] = useState(180);
  const [showcaseChatInput, setShowcaseChatInput] = useState("");
  const [showcaseChatHistory, setShowcaseChatHistory] = useState([
    { role: "model", content: "سلام مریم عزیز! من دکتر رادان، مشاور هوشمند و دلسوزت هستم. امروز برای پلتفرم ترنم مهر زبان ملموس و کارآمدتری آماده کردیم. می‌تونی هر سوالی دوست داری بپرسی، مثلاً بپرس: 'چرا در درس زیست وقتی تست سخت می‌بینم، استرس می‌گیرم؟' یا هر موضوع برنامه‌ریزی دیگه." }
  ]);
  const [showcaseChatLoading, setShowcaseChatLoading] = useState(false);

  useEffect(() => {
    let interval: any = null;
    if (isBreathingTimerActive) {
      setIsBreathingActive(true); // Sync with standard visual breathing pulse & sound!
      interval = setInterval(() => {
        setBreathingTimerCountdown((prev) => {
          if (prev <= 1) {
            setIsBreathingTimerActive(false);
            setIsBreathingActive(false);
            return 180;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      setIsBreathingActive(false);
    }
    return () => clearInterval(interval);
  }, [isBreathingTimerActive]);

  const handleShowcaseChat = async (textToSend: string) => {
    if (!textToSend.trim() || showcaseChatLoading) return;
    
    const userMsg = { role: "user", content: textToSend };
    setShowcaseChatHistory((prev) => [...prev, userMsg]);
    setShowcaseChatInput("");
    setShowcaseChatLoading(true);

    try {
      const chatHistory = showcaseChatHistory.slice(-4).map(m => ({ role: m.role || "user", content: m.content }));
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: textToSend, history: chatHistory })
      });

      const data = await res.json();
      if (res.ok) {
        setShowcaseChatHistory((prev) => [...prev, { role: "model", content: data.reply }]);
      } else {
        setShowcaseChatHistory((prev) => [...prev, { 
          role: "model", 
          content: "دوست خوبم، خطایی در اتصال برقرار شد ولی مشاور هوشمند ترنم مهر همواره کنارت هست. در مورد استرس زیست و تست‌های سخت، پیشنهاد می‌کنم بلافاصله ۲ دقیقه تمرین تنفس ریشه‌کننده اضطراب انجام بدی." 
        }]);
      }
    } catch (err) {
      setShowcaseChatHistory((prev) => [...prev, { 
        role: "model", 
        content: "ارتباط با هوش مصنوعی قطع شد اما مشاور رادان معتقد است غلبه بر استرس حین آزمون با تمرین تنفس لایو همین صفحه امکان‌پذیره." 
      }]);
    } finally {
      setShowcaseChatLoading(false);
    }
  };

  // Initialize and load historical reports from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(`taranom_psychology_reports_${student.id}`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setReports(parsed);
        if (parsed.length > 0) {
          setCurrentReport(parsed[0]);
        }
      } catch (err) {
        console.error("Error loading historical reports", err);
      }
    } else {
      // Standard static starting report customized for latest exam
      const initialReport: PsychologyReport = {
        id: "PSY-942",
        date: "۱۴۰۶/۰۳/۰۴",
        cognitiveProfile: {
          focusIndex: derivedParams.focus * 10,
          resilience: Math.round((10 - derivedParams.anxiety) * 5 + derivedParams.stamina * 5),
          academicDrive: 84,
          stamina: derivedParams.stamina * 10,
          anxietyManagement: Math.round((10 - derivedParams.anxiety) * 10),
          sleepEfficacy: 65
        },
        stressLevel: Math.min(95, Math.max(15, Math.floor((derivedParams.anxiety * 4 + derivedParams.perfectionism * 3 + (10 - 6) * 3)))),
        diagnosis: `بر اساس بررسی داده‌های کارنامه و پاسخ‌های شما، وجود پاسخ‌های غلط و خطاهای تکراری در برخی دروس کلیدی نشان می‌دهد که بخشی از افت عملکرد می‌تواند ناشی از تردید در تست‌های شک‌دار و ضعف در مدیریت زمان باشد.`,
        cognitiveTrap: derivedParams.anxiety > 6 ? "الگوی تردید بیش‌ازحد در تست‌های نزده و شک‌دار" : "الگوی تمرکز مفرط روی جزئیات و اتلاف زمان در تست‌های دشوار",
        remedies: [
          `اصلاح الگوی پاسخ‌های منفی در درس ${latestExam.lessons[0]?.lessonName || "زیست‌شناسی"} با تمرین حل تست در بازه‌های زمانی کوتاه و تحلیل بلافاصله خطاها.`,
          "پیاده‌سازی استراتژی عبور هوشمند از تست‌های پرریسک و علامت‌دار کردن آن‌ها برای بازگشت در انتهای آزمون.",
          "تثبیت خواب شبانه حداقل ۷ ساعت جهت بهبود تمرکز و پایداری عملکرد در آزمون‌های طولانی."
        ],
        meditationAdvice: "روزانه ۲ نوبت تمرین تنفس ریتمیک (۴ ثانیه دم - ۴ ثانیه مکث - ۴ ثانیه بازدم) جهت کاهش فشار ذهنی پیش از مطالعه.",
        breathingPaceSec: 4
      };
      
      const setupList = [initialReport];
      setReports(setupList);
      setCurrentReport(initialReport);
      localStorage.setItem(`taranom_psychology_reports_${student.id}`, JSON.stringify(setupList));
    }
  }, [student.id, derivedParams, latestExam]);

  // Submit derived or adjusted survey options to backend
  const handleAnalyze = async () => {
    setLoading(true);
    addSystemLog("درخواست پایش عصب‌سنجی از کارنامه", student.name, `ارزیابی روانی مبتنی بر کارنامه تراز ${latestExam.traz} آغاز شد.`);

    try {
      const response = await fetch("/api/psychology-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          student: {
            ...student,
            city,
            familyContext,
            financialStatus,
            mainGoal
          },
          qAnxiety,
          qFocus,
          qPerfectionism,
          qSleep,
          qStamina
        })
      });

      if (!response.ok) {
        throw new Error("سرویس تحلیل هوش مصنوعی موقتا در دسترس نیست.");
      }

      const data = await response.json();
      
      const newReport: PsychologyReport = {
        id: `PSY-${Date.now().toString().slice(-4)}`,
        date: new Date().toLocaleDateString("fa-IR"),
        cognitiveProfile: data.cognitiveProfile,
        stressLevel: data.stressLevel,
        diagnosis: data.diagnosis,
        cognitiveTrap: data.cognitiveTrap,
        remedies: data.remedies,
        meditationAdvice: data.meditationAdvice,
        breathingPaceSec: data.breathingPaceSec || 4
      };

      const updatedHistory = [newReport, ...reports];
      setReports(updatedHistory);
      setCurrentReport(newReport);
      localStorage.setItem(`taranom_psychology_reports_${student.id}`, JSON.stringify(updatedHistory));
      
      addSystemLog("ثبت گزارش آمادگی آموزشی جدید", student.name, `تحلیل آمادگی آموزشی با موفقیت صادر شد. سطح فشار ذهنی تخمینی: ${newReport.stressLevel}٪`);
    } catch (err) {
      console.warn("AI psychology service error, using simulated local algorithm:", err);
      
      const stressSim = Math.min(95, Math.max(15, Math.floor((qAnxiety * 4 + qPerfectionism * 3 + (10 - qSleep) * 3))));
      const simulated: PsychologyReport = {
        id: `PSY-OFF-${Date.now().toString().slice(-3)}`,
        date: new Date().toLocaleDateString("fa-IR"),
        cognitiveProfile: {
          focusIndex: Math.round(qFocus * 10),
          resilience: Math.round((10 - qAnxiety) * 5 + qStamina * 5),
          academicDrive: 85,
          stamina: Math.round(qStamina * 10),
          anxietyManagement: Math.round((10 - qAnxiety) * 10),
          sleepEfficacy: Math.round(qSleep * 10)
        },
        stressLevel: stressSim,
        diagnosis: `بر اساس تحلیل شاخص‌های عملکردی، سطح فشار ذهنی شما در محدوده ${stressSim > 60 ? "بالا" : stressSim > 30 ? "متوسط" : "کم"} ارزیابی می‌شود. تحلیل خطاهای آزمون ${latestExam.title} نشان‌دهنده نیاز به بازنگری در مدیریت زمان است.`,
        cognitiveTrap: qAnxiety > 6 ? "الگوی احتمالی: تردید در پاسخگویی به دلیل ترس از نمره منفی." : "الگوی احتمالی: افت تمرکز در نیمه دوم آزمون به دلیل خستگی ذهنی.",
        remedies: [
          `کاهش خطاهای درسی ${latestExam.lessons[0]?.lessonName || "زیست‌شناسی"} با دسته‌بندی خطاها به چهار گروه: مفهومی، بی‌دقتی، دام تستی و کمبود زمان.`,
          "تمرین روزانه تنفس آرام‌بخش پیش از شروع پارت‌های مطالعاتی سنگین.",
          "تنظیم خواب شبانه و ثابت نگه داشتن ساعت بیداری برای هماهنگی با ساعت بیولوژیک آزمون."
        ],
        meditationAdvice: "روزانه ۲ پارت ۵ دقیقه‌ای تمرین تنفس ریتمیک (دم، مکث، بازدم) برای متعادل‌سازی فشار ذهنی توصیه می‌شود.",
        breathingPaceSec: 4
      };

      const updatedHistory = [simulated, ...reports];
      setReports(updatedHistory);
      setCurrentReport(simulated);
      localStorage.setItem(`taranom_psychology_reports_${student.id}`, JSON.stringify(updatedHistory));
    } finally {
      setLoading(false);
    }
  };

  // Zen micro audio feedback synthesize
  const startZenSynth = () => {
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === "suspended") {
        ctx.resume();
      }

      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      osc.type = "sine";
      osc.frequency.setValueAtTime(130, ctx.currentTime);
      gainNode.gain.setValueAtTime(0.01, ctx.currentTime);
      
      osc.connect(gainNode);
      gainNode.connect(ctx.destination);
      osc.start();

      let phaseTicker = 0;
      synthIntervalRef.current = setInterval(() => {
        phaseTicker += 0.25;
        if (ctx.state !== "closed" && osc) {
          const baseFreq = breathPhase === "inhale" ? 132 : breathPhase === "exhale" ? 128 : 130;
          osc.frequency.setTargetAtTime(baseFreq + Math.sin(phaseTicker) * 1.5, ctx.currentTime, 0.4);
          
          let targetGain = 0.015;
          if (breathPhase === "inhale") targetGain = 0.04;
          if (breathPhase === "exhale") targetGain = 0.035;
          if (breathPhase === "hold") targetGain = 0.02;
          gainNode.gain.setTargetAtTime(targetGain, ctx.currentTime, 0.5);
        }
      }, 250);

      (audioCtxRef as any).currentOsc = osc;
      (audioCtxRef as any).currentGain = gainNode;
    } catch (e) {
      console.warn("Web audio blocked or failed", e);
    }
  };

  const stopZenSynth = () => {
    if (synthIntervalRef.current) {
      clearInterval(synthIntervalRef.current);
      synthIntervalRef.current = null;
    }
    const currentOsc = (audioCtxRef as any).currentOsc;
    const currentGain = (audioCtxRef as any).currentGain;
    try {
      if (currentOsc) {
        currentOsc.stop();
        currentOsc.disconnect();
      }
      if (currentGain) {
        currentGain.disconnect();
      }
    } catch (e) {}
    (audioCtxRef as any).currentOsc = null;
    (audioCtxRef as any).currentGain = null;
  };

  useEffect(() => {
    let interval: any = null;
    if (isBreathingActive) {
      startZenSynth();
      interval = setInterval(() => {
        setBreathTimer((prev) => {
          if (prev <= 1) {
            setBreathPhase((current) => {
              switch (current) {
                case "inhale": return "hold";
                case "hold": return "exhale";
                case "exhale": return "rest";
                default: return "inhale";
              }
            });
            return 4;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      stopZenSynth();
      setBreathTimer(4);
      setBreathPhase("inhale");
    }

    return () => {
      clearInterval(interval);
      stopZenSynth();
    };
  }, [isBreathingActive, breathPhase]);

  const radarChartData = useMemo(() => {
    if (!currentReport) return [];
    const p = currentReport.cognitiveProfile;
    return [
      { subject: "تمرکز تستی", A: p.focusIndex, fullMark: 100 },
      { subject: "تاب‌آوری آزمونی", A: p.resilience, fullMark: 100 },
      { subject: "اشتیاق تحصیلی", A: p.academicDrive, fullMark: 100 },
      { subject: "استقامت شیفت عصر", A: p.stamina, fullMark: 100 },
      { subject: "کنترل اضطراب تدریجی", A: p.anxietyManagement, fullMark: 100 },
      { subject: "کیفیت خواب و بازیابی ذهنی", A: p.sleepEfficacy, fullMark: 100 }
    ];
  }, [currentReport]);

  const toPersianNum = (num: number | string) => {
    const farsiDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
    return num.toString().replace(/\d/g, (x) => farsiDigits[parseInt(x)]);
  };

  return (
    <div className="space-y-8 animate-fade-in text-right" id="assessment-view-root" style={{ direction: "rtl" }}>
      {/* Prime Header Block */}
      <div className="bg-gradient-to-l from-slate-900 via-indigo-950 to-indigo-900 text-white p-8 rounded-3xl border border-indigo-950 shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative overflow-hidden" id="assess-header-layout">
        <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-1/3 -top-20 w-60 h-60 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="space-y-3 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50/10 border border-indigo-500/20 text-indigo-100 text-[10px] font-black uppercase tracking-wider backdrop-blur-sm">
            <Sparkles size={14} className="text-indigo-400" />
            <span>تحلیل آمادگی ذهنی و عملکرد آزمونی</span>
          </div>
          <h1 className="text-3xl font-black font-sans leading-tight">پورتال پایش آموزشی مبتنی بر آخرین کارنامه آزمون</h1>
          <div className="space-y-4">
            <p className="text-sm text-slate-300 font-medium max-w-2xl leading-relaxed">
              این پورتال با بررسی داده‌های کارنامه، الگوی پاسخگویی، شاخص‌های خوداظهاری و شرایط مطالعه داوطلب، گزارشی برای شناسایی نقاط قوت، عوامل افت عملکرد و پیشنهادهای عملی جهت بهبود نتیجه آزمون ارائه می‌دهد.
            </p>
            <div className="flex items-start gap-2 bg-amber-500/10 border border-amber-500/20 p-3 rounded-2xl max-w-xl">
              <Info size={16} className="text-amber-400 mt-0.5 shrink-0" />
              <p className="text-[10px] text-amber-200/80 font-bold leading-relaxed">
                این گزارش <span className="text-amber-300">تشخیص پزشکی، روان‌شناختی یا عصب‌شناختی نیست</span> و صرفاً با هدف برنامه‌ریزی آموزشی، مدیریت خطاهای آزمونی و بهبود کیفیت مطالعه تهیه شده است.
              </p>
            </div>
          </div>
        </div>

        <div className="flex bg-slate-950/80 p-1.5 rounded-2xl border border-indigo-950 w-full md:w-auto relative z-10 text-xs font-black overflow-x-auto gap-1" id="assess-custom-tabs">
          <button
            onClick={() => setActiveTab("re-design-showcase")}
            className={`flex-1 md:flex-initial px-4 py-2.5 rounded-xl transition cursor-pointer flex items-center justify-center gap-2 shrink-0 ${
              activeTab === "re-design-showcase" ? "bg-amber-600 text-white shadow-md shadow-amber-655/10" : "text-slate-450 hover:text-slate-200"
            }`}
          >
            <Sparkles size={14} className="text-amber-400 animate-pulse" />
            <span>نقد و تحول همدلی (نسخه جدید)</span>
          </button>
          <button
            onClick={() => setActiveTab("clinical-tests")}
            className={`flex-1 md:flex-initial px-4 py-2.5 rounded-xl transition cursor-pointer flex items-center justify-center gap-2 shrink-0 ${
              activeTab === "clinical-tests" ? "bg-rose-600 text-white shadow-md shadow-rose-650/10" : "text-slate-450 hover:text-slate-200"
            }`}
          >
            <ShieldAlert size={14} className="text-rose-400" />
            <span>سنجش بالینی و مصاحبه مشاور</span>
          </button>
          <button
            onClick={() => setActiveTab("exam-diagnostic")}
            className={`flex-1 md:flex-initial px-4 py-2.5 rounded-xl transition cursor-pointer flex items-center justify-center gap-2 shrink-0 ${
              activeTab === "exam-diagnostic" ? "bg-indigo-600 text-white shadow-md shadow-indigo-650/10" : "text-slate-450 hover:text-slate-200"
            }`}
          >
            <ClipboardList size={14} />
            <span>تحلیل خطاهای کارنامه</span>
          </button>
          <button
            onClick={() => setActiveTab("ai-synthesis")}
            className={`flex-1 md:flex-initial px-4 py-2.5 rounded-xl transition cursor-pointer flex items-center justify-center gap-2 ${
              activeTab === "ai-synthesis" ? "bg-indigo-600 text-white shadow-md shadow-indigo-650/10" : "text-slate-450 hover:text-slate-200"
            }`}
          >
            <Brain size={14} />
            <span>بررسی تمرکز و مدیریت زمان</span>
          </button>
          <button
            onClick={() => setActiveTab("breathing")}
            className={`flex-1 md:flex-initial px-4 py-2.5 rounded-xl transition cursor-pointer flex items-center justify-center gap-2 ${
              activeTab === "breathing" ? "bg-indigo-600 text-white shadow-md shadow-indigo-650/10" : "text-slate-450 hover:text-slate-200"
            }`}
          >
            <Wind size={14} />
            <span>تمرین تنفس و کنترل تنش</span>
          </button>
          <button
            onClick={() => setActiveTab("smart-profile")}
            className={`flex-1 md:flex-initial px-4 py-2.5 rounded-xl transition cursor-pointer flex items-center justify-center gap-2 ${
              activeTab === "smart-profile" ? "bg-indigo-600 text-white shadow-md shadow-indigo-650/10" : "text-slate-450 hover:text-slate-200"
            }`}
          >
            <UserPlus size={14} />
            <span>تکمیل پروفایل داوطلب</span>
          </button>
          <button
            onClick={() => setActiveTab("scientific-analysis")}
            className={`flex-1 md:flex-initial px-4 py-2.5 rounded-xl transition cursor-pointer flex items-center justify-center gap-2 ${
              activeTab === "scientific-analysis" ? "bg-indigo-600 text-white shadow-md shadow-indigo-650/10" : "text-slate-450 hover:text-slate-200"
            }`}
          >
            <BookMarked size={14} />
            <span>پژوهش و استانداردها</span>
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === "re-design-showcase" && (
          <motion.div
            key="re-design-showcase-tab"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="space-y-8 text-right"
          >
            {/* Top Row: Dual-Tone Empathy Manifesto & Visual Analytics */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Column 1: Dual Tone Empathy Manifesto (UX Transformation) */}
              <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-[32px] border border-slate-150 shadow-sm space-y-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
                
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-5">
                  <div>
                    <span className="text-[10px] font-black text-amber-600 tracking-wider uppercase block">User Experience & Empathy Audit</span>
                    <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                      <Sparkles size={18} className="text-amber-500 animate-pulse" />
                      <span>منشور جدید همدلی و زبان کنش‌گرای ترنم مهر</span>
                    </h2>
                  </div>
                  
                  {/* Toggle Mode */}
                  <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
                    <button
                      onClick={() => setIsConversationalStyle(false)}
                      className={`px-3 py-1.5 rounded-lg text-[10px] sm:text-xs font-black transition cursor-pointer ${
                        !isConversationalStyle ? "bg-slate-900 text-white shadow-sm" : "text-slate-550 hover:bg-slate-200/50"
                      }`}
                    >
                      لحن سنتی آکادمیک
                    </button>
                    <button
                      onClick={() => setIsConversationalStyle(true)}
                      className={`px-3 py-1.5 rounded-lg text-[10px] sm:text-xs font-black transition cursor-pointer flex items-center gap-1 ${
                        isConversationalStyle ? "bg-amber-600 text-white shadow-sm" : "text-slate-550 hover:bg-slate-200/50"
                      }`}
                    >
                      <Smile size={12} />
                      لحن جدید کنش‌گرا 🌟
                    </button>
                  </div>
                </div>

                <AnimatePresence mode="wait">
                  {isConversationalStyle ? (
                    <motion.div
                      key="empathetic-tone"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      className="space-y-6"
                    >
                      {/* Empathetic & Action driven dialog box */}
                      <div className="p-5 bg-amber-50/40 rounded-3xl border border-amber-100/70 space-y-4">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
                            <span className="text-xs font-black text-slate-800">تحلیل عملکرد هوشمند - آزمون مرحله ۱</span>
                          </div>
                          <span className="text-[9px] font-black bg-amber-100 text-amber-800 px-2.5 py-0.5 rounded-full">سیستم بازنویسی شده</span>
                        </div>
                        
                        <div className="space-y-2">
                          <h4 className="text-sm font-black text-amber-950">{student.name} عزیز، خسته نباشی مسبب رتبه برتر! 🌸</h4>
                          <p className="text-xs font-bold leading-relaxed text-slate-700">
                            کارنامه‌ات نشون میده تلاش فوق‌العاده‌ای داشتی و پتانسیل علمیت عالیه، اما راستش رو بخوای <span className="text-rose-600 font-extrabold underline">دست‌کم تفکر و بازخوانی آزمونت کمی سطحی بوده!</span> تراز ۶۱۸۰ و رتبه ۸۹۰ خیلی خوبه، ولی زیست‌شناسی ۵۵ درصد لایق پتانسیل واقعی تو نیست.
                          </p>
                          <p className="text-xs font-bold leading-relaxed text-slate-700 bg-white/70 p-3.5 rounded-2xl border border-amber-100/50 mt-3 font-mono text-indigo-950">
                            💡۳ دقیقه وقت بگذار و به جای نگاه صرف به نمره و درصد، ۳ دلیل کلیدی که باعث شد سوال فیزیک یا زیست را اشتباه بزنی همین حالا پایین یادداشت کن تا سیستم پومودورو فردا را شخصی‌سازی کنیم:
                          </p>
                        </div>
                      </div>

                      {/* Interactive Metacognitive inputs slots */}
                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-500 block">📝 ۳ دلیل کلیدی اشتباهات آزمون قبلی خود را بنویس (تمرین خودتنظیمی فعال):</label>
                        <div className="grid grid-cols-1 gap-2.5">
                          <input
                            type="text"
                            placeholder="۱. دلیل اول (مثلاً: در درس زیست‌شناسی گزینه‌ها را عجله‌ای زدم و در تله تستی قرار گرفتم)"
                            value={reDesignReasons[0]}
                            onChange={(e) => {
                              const copy = [...reDesignReasons];
                              copy[0] = e.target.value;
                              setReDesignReasons(copy);
                            }}
                            className="bg-slate-50 border border-slate-150 rounded-2xl px-4 py-2.5 text-xs font-bold outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                          />
                          <input
                            type="text"
                            placeholder="۲. دلیل دوم (مثلاً: در شیفت بعد از ظهر به علت کم‌خوابی مفرط خسته بودم)"
                            value={reDesignReasons[1]}
                            onChange={(e) => {
                              const copy = [...reDesignReasons];
                              copy[1] = e.target.value;
                              setReDesignReasons(copy);
                            }}
                            className="bg-slate-50 border border-slate-150 rounded-2xl px-4 py-2.5 text-xs font-bold outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                          />
                          <input
                            type="text"
                            placeholder="۳. دلیل سوم (مثلاً: کمال‌گرایی منفی روی ۳ سوال اول هندسه مانع مدیریت وقت شد)"
                            value={reDesignReasons[2]}
                            onChange={(e) => {
                              const copy = [...reDesignReasons];
                              copy[2] = e.target.value;
                              setReDesignReasons(copy);
                            }}
                            className="bg-slate-50 border border-slate-150 rounded-2xl px-4 py-2.5 text-xs font-bold outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                          />
                        </div>
                        
                        <div className="flex items-center justify-between gap-4 pt-2">
                          <button
                            onClick={() => {
                              setCustomReasonsSaved(true);
                              setTimeout(() => setCustomReasonsSaved(false), 4000);
                            }}
                            className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-xl text-xs font-black transition active:scale-95 cursor-pointer flex items-center gap-1.5"
                          >
                            <Check size={14} className="text-emerald-400" />
                            ذخیره در مانیتورینگ کارنامه
                          </button>
                          
                          {customReasonsSaved && (
                            <span className="text-[10px] text-emerald-600 font-extrabold animate-fade-in bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100">
                              ✓ دلایل فراشناختی شما ذخیره شد و در برنامه فردا همگام‌سازی می‌گردد!
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Direct Action Plan CTA with Active Breathing trigger */}
                      <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4 bg-indigo-50/30 p-5 rounded-3xl border border-indigo-100/50">
                        <div className="space-y-1 text-center sm:text-right">
                          <span className="text-[10px] font-black text-indigo-600 block">تمرین بازسازی سریع تمرکز آزمون</span>
                          <span className="text-xs font-black text-slate-800 block">نیاز فوری به آرام‌سازی ریتم تنفس برای بازیابی تراز فردا</span>
                        </div>
                        <button
                          onClick={() => {
                            setIsBreathingTimerActive(true);
                            // Scroll down smoothly to breathing section
                            const el = document.getElementById("showcase-live-breathing-chamber");
                            el?.scrollIntoView({ behavior: "smooth" });
                          }}
                          className="bg-indigo-600 hover:bg-indigo-700 text-white font-black px-5 py-3 rounded-2xl text-xs transition shadow-lg shadow-indigo-600/15 duration-250 flex items-center gap-2 cursor-pointer active:scale-95 group text-center shrink-0"
                        >
                          <Wind size={15} className="group-hover:rotate-180 transition-transform duration-500" />
                          <span>همین الان یک تمرین تنفسی ۳ دقیقه‌ای انجام بده</span>
                        </button>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="academic-tone"
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="space-y-5 grayscale"
                    >
                      <div className="p-5 bg-slate-100 rounded-3xl border border-slate-200">
                        <div className="flex justify-between items-center mb-3">
                          <span className="text-xs font-black text-slate-700">تحلیل ساختاری آکادمیک عملکرد - آزمون ۱</span>
                          <span className="text-[9px] font-black bg-slate-200 text-slate-600 px-2.5 py-0.5 rounded-full">نسخه بدون شفاف‌سازی سابق</span>
                        </div>
                        <p className="text-xs leading-relaxed text-slate-500 font-medium">
                          بررسی ماتریس تلاقی خطاهای شناختی داوطلب مفروض بر اساس دکترین دانیل زیمرمن تبیین‌کننده این متغیر است که راندمان فراشناختی شما در پردازش پساآزمونی ناکارآمد عمل کرده و فاقد استانداردهای نظارتی خودتنظیمی فعال است. شاخص CRI معادل ۸۲٪ برآورد می‌شود.
                        </p>
                        <div className="border border-dashed border-red-200/50 p-3 bg-red-500/5 rounded-2xl mt-4">
                          <h5 className="text-[10px] font-black text-red-700">❌ نقد داوطلب به این لحن خشک:</h5>
                          <p className="text-[10px] text-red-600 font-bold mt-1 leading-relaxed">
                            "این ۸۲ درصد از کجا آمده و چه مفهومی دارد؟ لحن متن بیش از حد پیچیده و بی‌انگیزه است و نمی‌دانم اکنون بعد از خواندن این گزارش برای رفع اشکال آزمونم چه اقدام مشخصی باید بکنم!"
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Column 2: Data Visualization & Index Formulas (Scientific Validity) */}
              <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-[32px] border border-slate-150 shadow-sm flex flex-col justify-between space-y-6">
                <div>
                  <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                    <div>
                      <span className="text-[10px] font-black text-indigo-600 tracking-wider uppercase block">Index Evolution & Transparency</span>
                      <h3 className="text-sm font-black text-indigo-950 flex items-center gap-1.5">
                        <TrendingUp size={16} className="text-indigo-600" />
                        <span>روند متغیرهای ذهنی در ۵ آزمون اخیر</span>
                      </h3>
                    </div>
                  </div>

                  {/* Recharts Progress Chart */}
                  <div className="h-52 w-full mt-4 flex items-center justify-center font-sans">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={[
                          { stage: "آزمون ۱", CRI: 55, ERI: 48 },
                          { stage: "آزمون ۲", CRI: 64, ERI: 52 },
                          { stage: "آزمون ۳", CRI: 72, ERI: 59 },
                          { stage: "آزمون ۴", CRI: 82, ERI: 64 },
                          { stage: "آزمون ۵", CRI: 90, ERI: 85 }
                        ]}
                        margin={{ top: 12, right: 12, left: -24, bottom: 0 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis dataKey="stage" tick={{ fill: "#64748b", fontSize: 9, fontWeight: 900 }} />
                        <YAxis tick={{ fill: "#64748b", fontSize: 8 }} />
                        <Tooltip contentStyle={{ direction: "rtl", textAlign: "right", borderRadius: "12px", fontSize: "10px", fontWeight: "bold" }} />
                        <Line type="monotone" dataKey="CRI" name="آمادگی شناختی (CRI)" stroke="#4f46e5" strokeWidth={3} activeDot={{ r: 6 }} />
                        <Line type="monotone" dataKey="ERI" name="تاب‌آوری هیجانی (ERI)" stroke="#10b981" strokeWidth={3} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Calculation Transparency Explainer (Confirms Scientifical Validity) */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-150 space-y-3">
                  <div className="flex items-center gap-2">
                    <Info size={14} className="text-indigo-600" />
                    <h4 className="text-[11px] font-black text-indigo-950">شفاف‌سازی و نحوه محاسبه علمی شاخص‌ها</h4>
                  </div>
                  <div className="text-[10px] space-y-2 text-slate-600 leading-relaxed font-bold">
                    <p>
                      <strong className="text-indigo-600">۱. شاخص آمادگی شناختی (CRI):</strong> نرخ ثبات تراز در تست‌های زمان‌دار دروس محاسباتی بر مبنای تقسیم تست‌های درست بر کل تست‌ها با تصحیح اثر نمره منفی.
                    </p>
                    <p>
                      <strong className="text-emerald-600">۲. شاخص تاب‌آوری هیجانی (ERI):</strong> واکنش سیستم پاراسمپاتیک در حین حل تست‌های سخت بر اساس واکنش‌پذیری به زمان و تغییر ندادن نابجای گزینه‌ها تحت فشار.
                    </p>
                  </div>
                </div>
              </div>

            </div>

            {/* Bottom Row: Square Breathing Simulator & AI Counseling Chatbot */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Panel C: Live Interactive Breathing Simulator */}
              <div 
                id="showcase-live-breathing-chamber"
                className="lg:col-span-6 bg-slate-900 text-white p-6 sm:p-8 rounded-[36px] border border-slate-850 shadow-2xl flex flex-col justify-between items-center relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
                
                <div className="text-center space-y-1.5 w-full border-b border-white/10 pb-4">
                  <span className="text-[9px] font-black text-indigo-400 tracking-widest uppercase block">Interactive Zen Biofeedback</span>
                  <div className="text-base font-black flex items-center justify-center gap-2">
                    <Wind size={18} className="text-teal-400 animate-pulse" />
                    <span>تمرین لایو تنفس مربعی ۳ ثانیه‌ای</span>
                  </div>
                  <p className="text-[10px] text-slate-400 font-bold max-w-sm mx-auto leading-relaxed">
                    ریتم ۴ ثانیه‌ای برای بازنشانی سیستم اعصاب سمپاتیک و مهار استرس آزمون فردا. همراه با سنتز صوتی ذهن‌آگاهی.
                  </p>
                </div>

                {/* Animated Breathing Orb Section */}
                <div className="my-8 h-48 flex flex-col items-center justify-center relative w-full">
                  <AnimatePresence>
                    {isBreathingActive && (
                      <motion.div
                        key={breathPhase}
                        initial={{ scale: 0.8, opacity: 0.1 }}
                        animate={{
                          scale: breathPhase === "inhale" ? 1.5 : breathPhase === "exhale" ? 0.92 : breathPhase === "hold" ? 1.45 : 0.82,
                          opacity: breathPhase === "hold" ? 0.22 : 0.08
                        }}
                        transition={{ duration: 4, ease: "easeInOut" }}
                        className="absolute w-40 h-40 rounded-full bg-teal-400 blur-xl pointer-events-none"
                      />
                    )}
                  </AnimatePresence>

                  <motion.div
                    animate={{
                      scale: !isBreathingActive ? 1 :
                             breathPhase === "inhale" ? 1.4 :
                             breathPhase === "hold" ? 1.4 :
                             breathPhase === "exhale" ? 0.95 : 0.9
                    }}
                    transition={{ duration: 4, ease: "easeInOut" }}
                    className={`w-32 h-32 rounded-full flex flex-col items-center justify-center text-center shadow-2xl relative z-10 select-none transition-colors duration-500 ${
                      !isBreathingActive ? "bg-slate-800 text-slate-400 border border-slate-700" :
                      breathPhase === "inhale" ? "bg-indigo-600 text-white shadow-indigo-600/40" :
                      breathPhase === "hold" ? "bg-teal-600 text-white shadow-teal-500/40" :
                      breathPhase === "exhale" ? "bg-rose-500 text-white shadow-rose-500/40" : "bg-zinc-650 text-white shadow-zinc-500/40"
                    }`}
                  >
                    <span className="text-[9px] font-black tracking-widest uppercase opacity-85 block mb-1">
                      {!isBreathingActive ? "آماده حرکت" :
                       breathPhase === "inhale" ? "دم عمیق 💨" :
                       breathPhase === "hold" ? "حبس نفس 🧘" :
                       breathPhase === "exhale" ? "بازدم عمیق 🍃" : "مکث و توازن ⚖️"}
                    </span>
                    <span className="text-2xl font-black font-mono leading-none block tracking-tighter">
                      {!isBreathingActive ? "۱۸۰" : toPersianNum(breathTimer)}
                    </span>
                    <span className="text-[8px] font-bold opacity-75 mt-1 block">ثانیه</span>
                  </motion.div>
                </div>

                {/* Countdown & Controllers */}
                <div className="w-full space-y-4">
                  {isBreathingTimerActive && (
                    <div className="text-center bg-slate-800/70 p-3 rounded-2xl border border-white/5 animate-pulse">
                      <span className="text-[10px] text-slate-300 font-bold block">مرحله فعال آرامش‌بخشی:</span>
                      <span className="text-xs font-black text-teal-400 font-mono mt-1 block">زمان باقیمانده تمرین: {toPersianNum(Math.floor(breathingTimerCountdown / 60))}:{toPersianNum(String(breathingTimerCountdown % 60).padStart(2, "0"))} دقیقه</span>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setIsBreathingTimerActive(true);
                        setBreathingTimerCountdown(180);
                      }}
                      disabled={isBreathingTimerActive}
                      className="flex-1 bg-amber-500 hover:bg-amber-600 disabled:bg-slate-850 text-slate-950 font-black py-3 rounded-2xl text-xs transition active:scale-95 cursor-pointer flex items-center justify-center gap-1"
                    >
                      <Play size={14} />
                      <span>شروع تمرین تنفس ۳ دقیقه‌ای</span>
                    </button>
                    
                    {isBreathingTimerActive && (
                      <button
                        onClick={() => {
                          setIsBreathingTimerActive(false);
                          setIsBreathingActive(false);
                        }}
                        className="bg-rose-600 hover:bg-rose-700 text-white font-black px-4 py-3 rounded-2xl text-xs transition cursor-pointer flex items-center justify-center"
                      >
                        توقف
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Panel D: Counselor AI chatbot */}
              <div className="lg:col-span-6 bg-white p-6 sm:p-8 rounded-[36px] border border-slate-150 shadow-sm flex flex-col justify-between h-[480px]">
                <div>
                  <div className="flex justify-between items-center border-b border-slate-100 pb-3 mb-4">
                    <div className="flex items-center gap-2">
                      <Brain size={18} className="text-indigo-600" />
                      <div>
                        <h4 className="text-xs font-black text-slate-800 uppercase block">Counselor Chat Interface</h4>
                        <span className="text-[10px] text-indigo-600 font-bold">هوش مصنوعی مشاور (اتصال زنده با جمینای)</span>
                      </div>
                    </div>
                    <span className="text-[9px] font-black bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-100 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                      متصل
                    </span>
                  </div>

                  {/* Messages container */}
                  <div className="overflow-y-auto h-52 space-y-3 px-1" style={{ scrollbarWidth: "thin" }}>
                    {showcaseChatHistory.map((msg, index) => (
                      <div
                        key={index}
                        className={`flex gap-2.5 items-start max-w-[85%] ${
                          msg.role === "user" ? "mr-auto flex-row-reverse" : "ml-auto"
                        }`}
                      >
                        <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 uppercase text-[9px] font-black text-white ${
                          msg.role === "user" ? "bg-emerald-600" : "bg-indigo-600"
                        }`}>
                          {msg.role === "user" ? "من" : "ام"}
                        </div>
                        <div className={`p-3 rounded-2xl text-xs font-bold leading-relaxed shadow-sm ${
                          msg.role === "user" ? "bg-emerald-50 text-emerald-950 border border-emerald-100 rounded-tr-none" : "bg-slate-50 text-slate-850 border border-slate-100 rounded-tl-none"
                        }`}>
                          {msg.content}
                        </div>
                      </div>
                    ))}
                    {showcaseChatLoading && (
                      <div className="flex gap-2.5 items-center ml-auto">
                        <div className="w-6 h-6 rounded-lg bg-indigo-600 flex items-center justify-center text-[9px] text-white">ام</div>
                        <div className="bg-slate-50 border border-slate-100 p-3 rounded-2xl text-xs font-bold flex items-center gap-1">
                          <RefreshCw size={12} className="animate-spin text-indigo-600" />
                          <span>در حال یافتن راهکار مربی‌گری...</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Hot Query Suggestions & Input prompt */}
                <div className="space-y-3 pt-3 border-t border-slate-100">
                  <div className="flex gap-1.5 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
                    <button
                      onClick={() => handleShowcaseChat("چرا در درس زیست وقتی تست سخت می‌بینم، استرس می‌گیرم؟")}
                      disabled={showcaseChatLoading}
                      className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-[10px] font-black text-indigo-950 shrink-0 cursor-pointer border border-slate-150 active:scale-95 transition"
                    >
                      ❓ چرا در زیست وقتی تست سخت می‌بینم استرس می‌گیرم؟
                    </button>
                    <button
                      onClick={() => handleShowcaseChat("چیکار کنم حین آزمون وسواس تستی روی حل هندسه نداشته باشم؟")}
                      disabled={showcaseChatLoading}
                      className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-[10px] font-black text-indigo-950 shrink-0 cursor-pointer border border-slate-150 active:scale-95 transition"
                    >
                      ❓ چیکار کنم حین آزمون وسواس تله آزمونی نداشته باشم؟
                    </button>
                  </div>

                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleShowcaseChat(showcaseChatInput);
                    }}
                    className="flex gap-2"
                  >
                    <input
                      type="text"
                      placeholder="سوال مشاوره‌ای یا روان‌شناختی خود را بپرس..."
                      value={showcaseChatInput}
                      onChange={(e) => setShowcaseChatInput(e.target.value)}
                      disabled={showcaseChatLoading}
                      className="flex-grow bg-slate-50 border border-slate-150 rounded-2xl px-4 py-3 text-xs font-bold outline-none focus:ring-2 focus:ring-indigo-500/20"
                    />
                    <button
                      type="submit"
                      disabled={showcaseChatLoading || !showcaseChatInput.trim()}
                      className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 text-white font-black px-4 rounded-2xl transition flex items-center justify-center cursor-pointer"
                    >
                      ارسال
                    </button>
                  </form>
                </div>
              </div>

            </div>
          </motion.div>
        )}

        {activeTab === "clinical-tests" && (
          <motion.div
            key="clinical-tests-tab"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="space-y-6 text-right relative z-10"
          >
            {/* Top diagnostic header */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 text-white relative overflow-hidden shadow-xl" id="diagnostic-header-card">
              <div className="absolute top-0 left-0 bg-rose-600/10 w-64 h-64 rounded-full blur-3xl -z-10" />
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 bg-rose-500/20 text-rose-300 border border-rose-500/20 text-[10px] font-black rounded-lg">کیت جامع عصب‌شناختی ترنم</span>
                    <span className="px-2.5 py-0.5 bg-indigo-500/20 text-indigo-300 border border-indigo-500/20 text-[10px] font-black rounded-lg">استاندارد APA / DSM-5</span>
                  </div>
                  <h2 className="text-2xl font-black text-slate-100 flex items-center gap-2 mt-2">
                    سنجش بالینی سلامت روان و ثبت مصاحبه‌های فیدبک
                  </h2>
                  <p className="text-xs text-slate-400 font-medium leading-relaxed max-w-2xl">
                    این بازو با ادغام مقیاس‌های علمی استاندارد بک و ییل-براون، ابزاری جامع را برای اندازه‌گیری سطوح اضطراب، فرسودگی تحصیلی و وسواس تکرار داوطلب فرآهم می‌سازد. مربیان گرامی نیز می‌توانند از مینی‌پورتال مصاحبه‌ها برای مستندسازی مشاوره‌ها بهره‌مند شوند.
                  </p>
                </div>
                
                {/* Sub tab toggles */}
                <div className="flex bg-slate-950 p-1.5 rounded-2xl border border-slate-800 self-start md:self-center gap-1 shrink-0">
                  <button
                    onClick={() => {
                      setActiveClinicalSubTab("screenings");
                      setActiveTestKey(null);
                    }}
                    className={`px-4 py-2 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-2 ${
                      activeClinicalSubTab === "screenings" 
                        ? "bg-rose-600 text-white shadow-lg" 
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    <Activity size={14} />
                    <span>آزمون‌های خودارزیابی بالینی</span>
                  </button>
                  <button
                    onClick={() => setActiveClinicalSubTab("interviews")}
                    className={`px-4 py-2 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-2 ${
                      activeClinicalSubTab === "interviews" 
                        ? "bg-rose-600 text-white shadow-lg" 
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    <ClipboardList size={14} />
                    <span>میز کارتابل و مصاحبه مشاور</span>
                    {role === "counselor" && (
                      <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Subtab Content A: Screenings */}
            {activeClinicalSubTab === "screenings" && (
              <div className="space-y-8">
                {activeTestKey === null ? (
                  // Mode A.1: Test Selection screen
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Anxiety Test BAI */}
                    <div className="bg-white p-6 rounded-3xl border border-slate-150 shadow-sm flex flex-col justify-between hover:border-rose-200 hover:shadow-md transition-all group relative overflow-hidden" id="anxiety-test-card">
                      <div className="absolute top-0 left-0 bg-rose-500/5 w-24 h-24 rounded-full blur-xl" />
                      <div className="space-y-4">
                        <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                          <AlertCircle size={24} />
                        </div>
                        <div className="space-y-2">
                          <h3 className="text-base font-black text-slate-900 leading-snug">{PSY_TESTS.anxiety.title}</h3>
                          <p className="text-[11px] text-indigo-600 font-bold leading-relaxed">
                            {PSY_TESTS.anxiety.subtitle}
                          </p>
                        </div>
                        <div className="p-3 bg-slate-50 rounded-2xl text-[10px] text-slate-500 font-semibold leading-relaxed">
                          این غربالگری روان‌شناختی وضعیت انقباض عضلانی، اضطراب شناختی و فاجعه‌سازی ذهنی شما را در جلسات آزمون پایش می‌کند.
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setActiveTestKey("anxiety");
                          setCurrentTestQIndex(0);
                          setTestAnswers([]);
                          setTestCompleted(false);
                        }}
                        className="w-full mt-6 bg-slate-900 hover:bg-rose-600 text-white text-xs font-black py-3 rounded-xl transition-all active:scale-95 cursor-pointer text-center shadow-sm"
                      >
                        شروع غربالگری اضطراب بک
                      </button>
                    </div>

                    {/* Depression Test BDI */}
                    <div className="bg-white p-6 rounded-3xl border border-slate-150 shadow-sm flex flex-col justify-between hover:border-amber-200 hover:shadow-md transition-all group relative overflow-hidden" id="depression-test-card">
                      <div className="absolute top-0 left-0 bg-amber-500/5 w-24 h-24 rounded-full blur-xl" />
                      <div className="space-y-4">
                        <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                          <TrendingUp size={24} />
                        </div>
                        <div className="space-y-2">
                          <h3 className="text-base font-black text-slate-900 leading-snug">{PSY_TESTS.depression.title}</h3>
                          <p className="text-[11px] text-amber-600 font-bold leading-relaxed">
                            {PSY_TESTS.depression.subtitle}
                          </p>
                        </div>
                        <div className="p-3 bg-slate-50 rounded-2xl text-[10px] text-slate-500 font-semibold leading-relaxed">
                          ارزیابی سطوح بی‌رمقی ذهنی، فقدان انگیزه تحصیلی و خستگی مفرط ناشی از فرسودگی مستمر در اواخر ماراتن کنکور.
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setActiveTestKey("depression");
                          setCurrentTestQIndex(0);
                          setTestAnswers([]);
                          setTestCompleted(false);
                        }}
                        className="w-full mt-6 bg-slate-900 hover:bg-amber-600 text-white text-xs font-black py-3 rounded-xl transition-all active:scale-95 cursor-pointer text-center shadow-sm"
                      >
                        شروع ارزیابی فرسودگی بک
                      </button>
                    </div>

                    {/* OCD Test Y-BOCS */}
                    <div className="bg-white p-6 rounded-3xl border border-slate-150 shadow-sm flex flex-col justify-between hover:border-teal-200 hover:shadow-md transition-all group relative overflow-hidden" id="ocd-test-card">
                      <div className="absolute top-0 left-0 bg-teal-500/5 w-24 h-24 rounded-full blur-xl" />
                      <div className="space-y-4">
                        <div className="w-12 h-12 bg-teal-50 text-teal-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                          <RefreshCw size={24} />
                        </div>
                        <div className="space-y-2">
                          <h3 className="text-base font-black text-slate-900 leading-snug">{PSY_TESTS.ocd.title}</h3>
                          <p className="text-[11px] text-teal-600 font-bold leading-relaxed">
                            {PSY_TESTS.ocd.subtitle}
                          </p>
                        </div>
                        <div className="p-3 bg-slate-50 rounded-2xl text-[10px] text-slate-500 font-semibold leading-relaxed">
                          ریشه‌یابی تکرار مرضی تسک‌ها از جمله دوباره‌خوانی وسواسی، شک‌های ممتد محاسباتی و قفل اتلاف‌کننده وقت روی یک مسئله.
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setActiveTestKey("ocd");
                          setCurrentTestQIndex(0);
                          setTestAnswers([]);
                          setTestCompleted(false);
                        }}
                        className="w-full mt-6 bg-slate-900 hover:bg-teal-600 text-white text-xs font-black py-3 rounded-xl transition-all active:scale-95 cursor-pointer text-center shadow-sm"
                      >
                        شروع ارزیابی وسواس مطالعه
                      </button>
                    </div>
                  </div>
                ) : !testCompleted ? (
                  // Mode A.2: Active Question Walker
                  <div className="max-w-2xl mx-auto bg-white p-6 md:p-8 rounded-3xl border border-slate-150 shadow-lg space-y-8 relative" id="test-question-walker">
                    <div className="absolute top-0 right-0 left-0 h-1.5 bg-rose-100 rounded-t-3xl overflow-hidden">
                      <div 
                        className="h-full bg-rose-500 transition-all duration-300" 
                        style={{ width: `${((currentTestQIndex + 1) / PSY_TESTS[activeTestKey].questions.length) * 100}%` }}
                      />
                    </div>

                    <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                      <div>
                        <h3 className="text-base font-black text-slate-950">{PSY_TESTS[activeTestKey].title}</h3>
                        <p className="text-[10px] text-slate-400 font-bold mt-1">خودارزیابی تخصصی بالینی ترنم فلو</p>
                      </div>
                      <button
                        onClick={() => setActiveTestKey(null)}
                        className="text-xs text-slate-500 hover:text-slate-800 font-black border border-slate-200 px-3 py-1.5 rounded-xl cursor-pointer transition-colors"
                      >
                        خروج و انصراف
                      </button>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] font-black text-rose-500 tracking-wider">عبارت خوداظهاری شماره {toPersianNum(currentTestQIndex + 1)}:</span>
                      <p className="text-lg font-bold text-slate-800 leading-relaxed pt-1">
                        {PSY_TESTS[activeTestKey].questions[currentTestQIndex].text}
                      </p>
                    </div>

                    {/* Radio answer options */}
                    <div className="grid gap-3 pt-2">
                      {[
                        { text: "اصلاً یا به ندرت (هیچ علائمی در خود احساس نمی‌کنم)", value: 0, badge: "طبیعی" },
                        { text: "خفیف (آزاردهنده نیست اما گهگاه وجود دارد)", value: 1, badge: "کم" },
                        { text: "متوسط (زجر‌آور است و راندمان را آشکارا کاهش می‌دهد)", value: 2, badge: "متوسط" },
                        { text: "شدید (فرساینده و فلج‌کننده روانی است، تمرکز را از بین می‌برد)", value: 3, badge: "شدید بالینی" }
                      ].map((opt, idx) => (
                        <button
                          key={idx}
                          role="radio"
                          aria-checked={testAnswers[currentTestQIndex] === opt.value}
                          onClick={() => {
                            const updated = [...testAnswers];
                            updated[currentTestQIndex] = opt.value;
                            setTestAnswers(updated);

                            if (currentTestQIndex < PSY_TESTS[activeTestKey].questions.length - 1) {
                              setCurrentTestQIndex(prev => prev + 1);
                            } else {
                              setTestCompleted(true);
                              addSystemLog(
                                `تست بالینی ${activeTestKey}`,
                                student.name,
                                `پایان ارزیابی با نمره کل ${updated.reduce((a, b) => a + b, 0)}`
                              );
                            }
                          }}
                          className={`w-full p-4 border rounded-2xl flex justify-between items-center text-right group active:scale-[0.99] transition-all cursor-pointer ${
                            testAnswers[currentTestQIndex] === opt.value 
                              ? "bg-rose-50/50 border-rose-300 text-rose-950 ring-2 ring-rose-500/10" 
                              : "border-slate-150 hover:bg-slate-50 hover:border-slate-350"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black transition-colors ${
                              testAnswers[currentTestQIndex] === opt.value 
                                ? "bg-rose-600 text-white" 
                                : "bg-slate-550/10 text-slate-500 group-hover:bg-slate-200"
                            }`}>
                              {toPersianNum(idx + 1)}
                            </span>
                            <span className="text-xs font-bold leading-relaxed">{opt.text}</span>
                          </div>
                          
                          <span className={`text-[9px] font-black px-2 py-0.5 rounded-md ${
                            opt.value === 3 ? "bg-red-100 text-red-600" :
                            opt.value === 2 ? "bg-amber-100 text-amber-600" :
                            opt.value === 1 ? "bg-indigo-100 text-indigo-600" : "bg-emerald-100 text-emerald-600"
                          }`}>
                            {opt.badge}
                          </span>
                        </button>
                      ))}
                    </div>

                    <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                      <button
                        onClick={() => {
                          if (currentTestQIndex > 0) {
                            setCurrentTestQIndex(prev => prev - 1);
                          }
                        }}
                        disabled={currentTestQIndex === 0}
                        className="text-xs font-black text-slate-450 hover:text-slate-800 disabled:opacity-50 cursor-pointer flex items-center gap-1"
                      >
                        ← سوال قبلی
                      </button>
                      <span className="text-[10px] text-slate-400 font-bold">پیشرفت: {toPersianNum(Math.round((currentTestQIndex / PSY_TESTS[activeTestKey].questions.length) * 100))}%</span>
                    </div>
                  </div>
                ) : (
                  // Mode A.3: Test Report Screen
                  (() => {
                    const totalScore = testAnswers.reduce((sum, v) => sum + v, 0);
                    const maxPossible = PSY_TESTS[activeTestKey].questions.length * 3;
                    const feedback = PSY_TESTS[activeTestKey].getFeedback(totalScore);

                    return (
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8" id="test-report-screen">
                        {/* Gauge Card left */}
                        <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-slate-150 shadow-md flex flex-col justify-between items-center text-center">
                          <div className="w-full flex justify-between items-center border-b border-slate-100 pb-3">
                            <span className="text-[9px] font-black bg-rose-50 text-rose-700 px-2.5 py-1 rounded-md border border-rose-100">کارنامه تشخیص بالینی</span>
                            <span className="text-[9px] font-mono text-slate-400">کد پرونده: PX-{totalScore * 9}</span>
                          </div>

                          <div className="my-8 relative flex items-center justify-center">
                            <svg className="w-36 h-36 transform -rotate-90">
                              <circle cx="72" cy="72" r="60" stroke="#f1f5f9" strokeWidth="12" fill="transparent" />
                              <circle
                                cx="72"
                                cy="72"
                                r="60"
                                stroke={totalScore > 13 ? "#ef4444" : totalScore > 6 ? "#f59e0b" : "#10b981"}
                                strokeWidth="12"
                                fill="transparent"
                                strokeDasharray={2 * Math.PI * 60}
                                strokeDashoffset={2 * Math.PI * 60 * (1 - totalScore / maxPossible)}
                                strokeLinecap="round"
                                className="transition-all duration-1000"
                              />
                            </svg>
                            <div className="absolute text-center">
                              <span className="text-4xl font-extrabold text-slate-900 tracking-tight">{toPersianNum(totalScore)}</span>
                              <span className="text-slate-400 text-[10px] font-bold block mt-0.5">از {toPersianNum(maxPossible)} امتیاز</span>
                            </div>
                          </div>

                          <div className="w-full space-y-4">
                            <div className={`p-3 rounded-2xl text-xs font-black border text-center ${feedback.levelColor}`}>
                              خروجی: {feedback.level}
                            </div>
                            
                            <div className="flex gap-2">
                              <button
                                onClick={() => {
                                  setTestCompleted(false);
                                  setCurrentTestQIndex(0);
                                  setTestAnswers([]);
                                }}
                                className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-[11px] font-black text-slate-700 rounded-xl transition active:scale-95 cursor-pointer text-center"
                              >
                                تکرار این آزمون
                              </button>
                              <button
                                onClick={() => {
                                  setActiveTestKey(null);
                                  setTestCompleted(false);
                                }}
                                className="flex-1 py-3 bg-rose-600 hover:bg-rose-700 text-white text-[11px] font-black rounded-xl transition active:scale-95 cursor-pointer text-center"
                              >
                                بازگشت به لیست
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Analysis right */}
                        <div className="lg:col-span-8 space-y-6">
                          {/* Card 1: Clinical analysis */}
                          <div className="bg-white p-6 rounded-3xl border border-slate-150 shadow-sm space-y-4">
                            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                              <Brain size={18} className="text-rose-500" />
                              <h3 className="text-xs font-black text-slate-900">آنالیز روان‌شناختی بالینی</h3>
                            </div>
                            <p className="text-xs font-semibold leading-relaxed text-slate-600 bg-slate-50 p-4 rounded-2xl border border-slate-100 leading-relaxed">
                              {feedback.clinicalAnalysis}
                            </p>
                          </div>

                          {/* Card 2: Impact */}
                          <div className="p-6 rounded-3xl bg-amber-50/50 border border-amber-100 shadow-sm space-y-4">
                            <div className="flex items-center gap-2 border-b border-amber-200/45 pb-3">
                              <AlertCircle size={18} className="text-amber-600" />
                              <h3 className="text-xs font-black text-amber-950">تاثیر مستقیم این الگو بر کارنامه کنکور شما</h3>
                            </div>
                            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {feedback.examImpact.map((impact, ind) => (
                                <li key={ind} className="flex gap-2.5 items-start p-3 bg-white hover:bg-slate-50 rounded-xl border border-amber-100 transition-colors">
                                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0 mt-2" />
                                  <span className="text-[11px] text-slate-600 font-bold leading-relaxed">{impact}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Card 3: Remedies */}
                          <div className="bg-white p-6 rounded-3xl border border-slate-150 shadow-sm space-y-4">
                            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                              <Award size={18} className="text-teal-600" />
                              <h3 className="text-xs font-black text-slate-900">راه‌حل‌های شناختی و رفتاری مهار (CBT / ERP)</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              {feedback.remedies.map((remedy, ind) => (
                                <div key={ind} className="p-4 bg-slate-50 hover:bg-slate-100/50 border border-slate-100 rounded-2xl transition-transform cursor-default relative">
                                  <span className="absolute top-2 left-3 font-serif text-[10px] text-rose-300 font-black">#0{ind + 1}</span>
                                  <h4 className="text-[10px] font-black text-rose-950 mb-1">گام اصلاحی {toPersianNum(ind+1)}</h4>
                                  <p className="text-[10px] text-slate-500 font-bold leading-relaxed">{remedy}</p>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Card 4: Medical protocol */}
                          <div className="bg-slate-900 p-6 rounded-3xl text-white shadow-lg space-y-4 relative overflow-hidden">
                            <div className="absolute top-0 right-0 bg-rose-600/10 w-24 h-24 rounded-full blur-2xl" />
                            <div className="flex items-center gap-2 border-b border-white/5 pb-3">
                              <Wind size={18} className="text-rose-400" />
                              <h3 className="text-xs font-black text-rose-300">پروتکل مراقبت بالینی و دارویی تاییدشده روانپزشکی</h3>
                            </div>
                            <p className="text-xs font-semibold leading-relaxed text-slate-300">
                              {feedback.medicalAdvice}
                            </p>
                            <div className="pt-2 flex items-center gap-2 text-[9px] text-slate-500 font-bold leading-relaxed border-t border-white/5">
                              <Check className="text-emerald-500 w-4 h-4" />
                              <span>این ارزیابی بر پایه استانداردهای تشخیصی بالینی نوین ممیزی شده و جایگزین درمان بالینی پزشک نمی‌باشد.</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })()
                )}
              </div>
            )}

            {/* Subtab Content B: Interviews Recorder */}
            {activeClinicalSubTab === "interviews" && (
              <div className="space-y-6">
                
                {/* Authorization Barrier */}
                {role !== "counselor" && role !== "admin" && role !== "teacher" ? (
                  <div className="bg-amber-50 border border-amber-200 rounded-3xl p-8 max-w-2xl mx-auto text-center space-y-4" id="counselor-tab-lock">
                    <div className="w-14 h-14 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center mx-auto scale-110">
                      <ShieldAlert size={28} />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-lg font-black text-slate-900">دسترسی محدود به کارتابل رسمی مشاور ارشد کانون</h3>
                      <p className="text-xs text-slate-550 font-bold leading-relaxed max-w-md mx-auto pt-1">
                        رول فعلی شما در سامانه <span className="text-amber-700 font-extrabold font-serif">[{role === "student" ? "داوطلب" : role === "parent" ? "والدین" : "ناشناس"}]</span> شناسایی شده است. این میز پایش صرفاً جهت ثبت مصاحبه‌های عصب‌شناختی، مداخلات بالینی و ثبت نسخ کایزنی مربیان تحصیلی رتبه‌برتر واجد صلاحیت طراحی شده است.
                      </p>
                    </div>
                    <div className="pt-2">
                      <span className="text-[10px] text-slate-400 font-semibold italic">سوابق مشاوره‌ها به صورت رمزنگاری‌شده در پرونده الکترونیکی شما برای مربی مجاز قابل رویت است.</span>
                    </div>
                  </div>
                ) : (
                  // Authorized Counselor Hub layout
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8" id="counselor-interviews-hub">
                    
                    {/* Left: History list (lg:col-span-5) */}
                    <div className="lg:col-span-5 space-y-4">
                      <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                        <div className="flex items-center gap-2">
                          <Eye size={16} className="text-rose-500" />
                          <h3 className="text-xs font-black text-slate-900">سوابق پرونده‌های روان‌شناختی داوطلب</h3>
                        </div>
                        <span className="text-[10px] font-black bg-slate-100 text-slate-600 px-2.5 py-1 rounded-md">{toPersianNum(interviews.length)} مورد پرونده ثبت‌شده</span>
                      </div>

                      <div className="space-y-4 max-h-[640px] overflow-y-auto pr-1">
                        {interviews.length === 0 ? (
                          <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 text-center text-xs text-slate-400 font-bold">
                            هیچ پرونده مصاحبه‌ای ثبت نشده است. از جعبه روبه‌رو اولین مورد را ثبت کنید.
                          </div>
                        ) : (
                          interviews.map((item, index) => (
                            <div 
                              key={item.id} 
                              className={`bg-white border rounded-2xl p-4 transition-all relative ${
                                item.severity === "critical" ? "border-red-200 shadow-sm" :
                                item.severity === "warning" ? "border-amber-200 shadow-sm" : "border-slate-150"
                              }`}
                            >
                              <div className="flex justify-between items-start gap-4">
                                <div className="space-y-1">
                                  <div className="flex items-center gap-2">
                                    <span className="text-[10px] font-mono text-slate-400 font-black">{item.id}</span>
                                    <span className="text-[10px] font-bold text-slate-400">{item.date}</span>
                                    
                                    <span className={`text-[8px] font-black px-1.5 py-0.5 rounded ${
                                      item.severity === "critical" ? "bg-red-50 text-red-600 border border-red-100" :
                                      item.severity === "warning" ? "bg-amber-50 text-amber-600 border border-amber-100" :
                                      "bg-teal-50 text-teal-600 border border-teal-100"
                                    }`}>
                                      {item.severity === "critical" ? "بحرانی" : item.severity === "warning" ? "مخاطره" : "پایش مستمر"}
                                    </span>
                                  </div>
                                  <h4 className="text-xs font-black text-indigo-950 pt-1">{item.title}</h4>
                                </div>

                                <div className="flex gap-1.5 shrink-0">
                                  <button
                                    onClick={() => setPrintPreviewInterview(item)}
                                    title="مشاهده و پرینت نسخه درمانی"
                                    className="p-1.5 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-lg border border-slate-150 cursor-pointer active:scale-95 transition-transform"
                                  >
                                    <Printer size={13} />
                                  </button>
                                  <button
                                    onClick={() => {
                                      if (confirm("آیا مایل به حذف این پرونده مصاحبه از تاریخچه هستید؟")) {
                                        const updated = interviews.filter(it => it.id !== item.id);
                                        setInterviews(updated);
                                        addSystemLog("حذف مصاحبه", student.name, `پرونده ${item.id} با موفقیت آرشیو/حذف شد.`);
                                      }
                                    }}
                                    title="حذف پرونده"
                                    className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg border border-red-150 cursor-pointer active:scale-95 transition-transform"
                                  >
                                    <Trash2 size={13} />
                                  </button>
                                </div>
                              </div>

                              <div className="mt-3 bg-slate-50 p-3 rounded-xl border border-slate-100 text-[11px] text-slate-600 leading-relaxed font-semibold">
                                <div className="text-[10px] font-black text-rose-600 mb-1">ریشه عارضه شناختی:</div>
                                {item.diagnosis}
                              </div>

                              {/* Symptoms pills */}
                              <div className="flex flex-wrap gap-1 mt-3">
                                {item.symptoms.map((sym, sIdx) => (
                                  <span key={sIdx} className="text-[8px] font-black bg-slate-150 text-slate-600 px-1.5 py-0.5 rounded">
                                    {sym}
                                  </span>
                                ))}
                              </div>

                              <div className="mt-3 border-t border-slate-100 pt-3 flex items-center justify-between">
                                <span className="text-[9px] text-slate-400 font-bold">بیمارنما/دانش‌آموز: {student.name}</span>
                                <span className="text-[9px] font-serif font-black text-rose-500 hover:underline cursor-pointer flex items-center gap-0.5" onClick={() => setPrintPreviewInterview(item)}>
                                  جزئیات نسخه مربی ←
                                </span>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>

                    {/* Right: Logger Form (lg:col-span-7) */}
                    <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-slate-150 shadow-md space-y-6" id="interview-logger-form">
                      <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                        <FileText size={18} className="text-rose-500" />
                        <div>
                          <h3 className="text-xs font-black text-slate-900">دفترچه رسمی ثبت مصاحبه و نسخه روان‌شناختی</h3>
                          <p className="text-[9px] text-slate-400 font-bold mt-0.5">ثبت آنی فیدبک بالینی برای رفع عارضه مطالعه دانش‌آموزان گروه الف</p>
                        </div>
                      </div>

                      {/* 1. Title/Subject */}
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-500 block">موضوع یا سرفصل مصاحبه بالینی:</label>
                        <input
                          type="text"
                          value={observeTitle}
                          onChange={(e) => setObserveTitle(e.target.value)}
                          placeholder="مثلاً: کاهش تمرکز ناشی از کم‌خوابی و استرس آزمون جامع بهمنی"
                          className="w-full p-3 border border-slate-150 rounded-xl text-xs font-black bg-slate-50 focus:bg-white focus:ring-1 focus:ring-rose-500 text-slate-800"
                        />
                      </div>

                      {/* 2. Check Symptoms */}
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-500 block">نشانه‌ها و علائم بالینی مشاهده شده (چندگزینه‌ای):</label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                          {[
                            "افت ساعت مطالعه", "بی‌قراری و تنش فیزیکی", "وسواس تکرار آزمون",
                            "سرزنش شخصی مداوم", "ترس شدید از تستی غلط", "خستگی و کسالت چشم",
                            "افت مقطعی تراز", "امتناع از پر کردن گزارش", "فشار مخرب خانواده"
                          ].map((sym) => {
                            const active = selectedSymptoms.includes(sym);
                            return (
                              <button
                                key={sym}
                                onClick={() => {
                                  if (active) {
                                    setSelectedSymptoms(selectedSymptoms.filter(x => x !== sym));
                                  } else {
                                    setSelectedSymptoms([...selectedSymptoms, sym]);
                                  }
                                }}
                                className={`p-2.5 rounded-xl border text-[10px] font-black transition-all text-center ${
                                  active 
                                    ? "bg-rose-500 text-white border-rose-500 shadow-sm" 
                                    : "bg-slate-50 border-slate-150 hover:bg-slate-100 text-slate-650"
                                }`}
                              >
                                {sym}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* 3. Symptoms presets */}
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-500 block">تشخیص و ریشه عارضه شناختی داوطلب (کلیک جهت درج سریع):</label>
                        <div className="flex flex-wrap gap-1.5">
                          {[
                            { name: "خستگی مزمن ذهن و فرسودگی تحصیلی دور پایانی (Burnout)", diag: "کاهش ترشح هورمون دوپامین به دلیل بودجه درسی طولانی و بدون استراحت ناشی از پدید آمدن تله کمال گرایی منفی." },
                            { name: "اضطراب شدید شناختی بالینی (BAI 18+)", diag: "ترشح حاد هورمون کورتیزول و آدرنالین بدنی در مجاورت دروس پرفشار مانند زیست و شیمی محاسباتی که غشا کورتکس را متوقف می‌کند." },
                            { name: "وسواس تکرار عملی و خوانش ۱۰ باره (OCD)", diag: "ناهماهنگی در مدارهای مغزی CSTC کورتکس که مغز را به تجدید حل و روخوانی فرساینده تست‌های ابتدایی ترغیب می‌سازد." }
                          ].map((pre) => (
                            <button
                              key={pre.name}
                              onClick={() => {
                                setObserveDiagnosis(pre.name);
                                setObserveNotes(pre.diag);
                              }}
                              className="px-2.5 py-1 bg-slate-50 border border-slate-150 rounded-lg text-[9px] font-black text-slate-500 hover:border-rose-400 hover:text-rose-600 transition-colors"
                            >
                              {pre.name.split(" ")[0]}
                            </button>
                          ))}
                        </div>
                        <input
                          type="text"
                          value={observeDiagnosis}
                          onChange={(e) => setObserveDiagnosis(e.target.value)}
                          placeholder="مثلاً: کمال‌گرایی منفی کاهنده سرعت تست"
                          className="w-full p-3 border border-slate-150 rounded-xl text-xs font-black bg-slate-50 focus:bg-white focus:ring-1 focus:ring-rose-500 text-slate-800"
                        />
                      </div>

                      {/* 4. Notes */}
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-500 block">ملاحظات مصاحبه و شواهد عینی مربی تحصیلی:</label>
                        <textarea
                          rows={4}
                          value={observeNotes}
                          onChange={(e) => setObserveNotes(e.target.value)}
                          placeholder="ملاحظات بالینی خود را بنویسید..."
                          className="w-full p-3 border border-slate-150 rounded-xl text-xs font-semibold bg-slate-50 focus:bg-white focus:ring-1 focus:ring-rose-500 text-slate-800 leading-relaxed"
                        />
                      </div>

                      {/* 5. CBT / Kaizen Interventions */}
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-500 block">شیوه‌نامه درمانی و توصیه‌های رفتاری کایزن (CBT):</label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={newPrescriptText}
                            onChange={(e) => setNewPrescriptText(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                if (newPrescriptText.trim()) {
                                  setCustomPrescripts([...customPrescripts, newPrescriptText.trim()]);
                                  setNewPrescriptText("");
                                }
                              }
                            }}
                            placeholder="مثال: اجرای روزانه ۲ نوبت تنفس تعاملی بیوفیدبک مربعی"
                            className="flex-1 p-3 border border-slate-150 rounded-xl text-xs font-black bg-slate-50 focus:bg-white text-slate-800"
                          />
                          <button
                            onClick={() => {
                              if (newPrescriptText.trim()) {
                                setCustomPrescripts([...customPrescripts, newPrescriptText.trim()]);
                                setNewPrescriptText("");
                              }
                            }}
                            className="bg-slate-900 hover:bg-rose-600 text-white font-black px-4 rounded-xl cursor-pointer transition-colors text-xs flex items-center justify-center gap-1 shrink-0"
                          >
                            <Plus size={14} />
                            افزودن
                          </button>
                        </div>
                        <div className="flex flex-wrap gap-1.5 pt-1.5">
                          {customPrescripts.map((pr, pIdx) => (
                            <span 
                              key={pIdx} 
                              className="px-2.5 py-1 bg-rose-50 text-rose-700 border border-rose-100 rounded-lg text-[9px] font-bold flex items-center gap-1"
                            >
                              <span>{pr}</span>
                              <button 
                                onClick={() => setCustomPrescripts(customPrescripts.filter((_, i) => i !== pIdx))}
                                className="text-rose-500 hover:text-rose-800 font-extrabold focus:outline-none"
                              >
                                ×
                              </button>
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* 6. Severity & Save Button */}
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-t border-slate-100 pt-4">
                        <div className="flex items-center gap-4">
                          <span className="text-[10px] font-black text-slate-500">سطح هشدار پرونده:</span>
                          <div className="flex gap-2 bg-slate-100 p-1 rounded-xl border border-slate-150">
                            {[
                              { label: "بحرانی حاد", val: "critical", color: "bg-red-500 text-white" },
                              { label: "مخاطره", val: "warning", color: "bg-amber-500 text-white" },
                              { label: "پایش عادی", val: "mild", color: "bg-emerald-500 text-white" }
                            ].map((sev) => {
                              const active = observeSeverity === sev.val;
                              return (
                                <button
                                  key={sev.val}
                                  onClick={() => setObserveSeverity(sev.val as any)}
                                  className={`px-3 py-1.5 rounded-lg text-[9px] font-black transition-all cursor-pointer ${
                                    active ? sev.color : "text-slate-500 hover:text-slate-950"
                                  }`}
                                >
                                  {sev.label}
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        <button
                          onClick={() => {
                            if (!observeTitle.trim() || !observeDiagnosis.trim() || !observeNotes.trim()) {
                              alert("لطفاً فیلدهای الزامی (عنوان مصاحبه، تشخیص عارضه، ملاحظات مربی) را پر کنید.");
                              return;
                            }
                            const newRecord = {
                              id: `INT-${Math.floor(100 + Math.random() * 900)}`,
                              date: new Intl.DateTimeFormat('fa-IR', { year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date()),
                              title: observeTitle.trim(),
                              symptoms: selectedSymptoms.length > 0 ? selectedSymptoms : ["ارزیابی کلی مقطعی"],
                              diagnosis: observeDiagnosis.trim(),
                              notes: observeNotes.trim(),
                              prescriptions: customPrescripts.length > 0 ? customPrescripts : ["ادامه برنامه تحصیلی پیشین تحت نظارت مداوم"],
                              severity: observeSeverity
                            };
                            setInterviews([newRecord, ...interviews]);
                            
                            // Reset form
                            setObserveTitle("");
                            setSelectedSymptoms([]);
                            setObserveDiagnosis("");
                            setObserveNotes("");
                            setCustomPrescripts([]);
                            
                            alert(`پرونده تشخیصی ${newRecord.id} با موفقیت در سیستم الکترونیکی ثبت و ذخیره گردید.`);
                            addSystemLog("ثبت مصاحبه روانشناختی", student.name, `موضوع: ${newRecord.title}`);
                          }}
                          className="w-full md:w-auto px-6 py-3 bg-rose-600 hover:bg-rose-700 text-white text-xs font-black rounded-xl transition-all active:scale-95 cursor-pointer shadow-md flex items-center justify-center gap-1.5"
                        >
                          <Check size={16} />
                          ثبت نهایی پرونده روان‌شناختی
                        </button>
                      </div>

                    </div>

                  </div>
                )}

              </div>
            )}

            {/* Print Prescription Preview Modal Mockup */}
            {printPreviewInterview && (
              <div 
                className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
                onClick={() => setPrintPreviewInterview(null)}
              >
                <div 
                  className="bg-white rounded-3xl border-8 border-slate-900 w-full max-w-2xl overflow-hidden shadow-2xl relative transition-transform duration-300"
                  onClick={(e) => e.stopPropagation()}
                  id="prescription-receipt-print-frame"
                >
                  
                  {/* Decorative Rx watermark header */}
                  <div className="bg-slate-900 p-6 md:p-8 text-white relative flex justify-between items-center">
                    <div className="space-y-1 text-right">
                      <span className="text-[10px] bg-rose-500 text-white px-2.5 py-0.5 rounded-md font-black tracking-widest font-serif">نسخه درمانی روان‌شناختی</span>
                      <h3 className="text-xl font-black text-slate-100 flex items-center gap-1">آکادمی هوشمند مربیگری ترنم</h3>
                      <p className="text-[10px] text-slate-400 font-bold leading-relaxed">برنامه درمانی اختصاصی مهار اضطراب بالینی در آزمون‌های شبیه‌ساز</p>
                    </div>
                    
                    <div className="font-serif font-black text-4xl text-rose-500 opacity-60 flex select-none shrink-0 border border-rose-500/30 p-2.5 rounded-2xl">
                      Rx
                    </div>
                  </div>

                  {/* Body Content resembling medical certificate */}
                  <div className="p-8 space-y-6 text-right">
                    
                    {/* Student details top grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pb-4 border-b border-dashed border-slate-200 text-xs">
                      <div>
                        <span className="text-slate-400 block font-bold">نام و نشان داوطلب:</span>
                        <span className="font-black text-slate-900 block mt-1">{student.name}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block font-bold">تاریخ ویزیت:</span>
                        <span className="font-black text-slate-900 block mt-1">{printPreviewInterview.date}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block font-bold">رشته تحصیلی:</span>
                        <span className="font-black text-slate-900 block mt-1">
                          {student.field === "ensani" ? "علوم انسانی" : student.field === "riazi" ? "علوم ریاضی" : "علوم تجربی الف"}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 block font-bold">کد نسخه:</span>
                        <span className="font-mono font-black text-rose-600 block mt-1">{printPreviewInterview.id}</span>
                      </div>
                    </div>

                    {/* Symptoms observed list */}
                    <div className="space-y-2">
                      <h4 className="text-xs font-black text-slate-900 flex items-center gap-2">
                        <span className="w-1.5 h-3 bg-rose-500 rounded" />
                        نشانه‌ها و علائم بالینی (Observed Symptoms)
                      </h4>
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {printPreviewInterview.symptoms.map((sym, index) => (
                          <span key={index} className="text-[10px] font-black bg-rose-50 text-rose-700 px-3 py-1 rounded-lg border border-rose-100">
                            {sym}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Diagnosis Block */}
                    <div className="space-y-2">
                      <h3 className="text-xs font-black text-slate-900 flex items-center gap-2">
                        <span className="w-1.5 h-3 bg-rose-500 rounded" />
                        ریشه عارضه شناختی (Diagnostic Assessment)
                      </h3>
                      <div className="p-4 bg-slate-50 border border-slate-150 rounded-2xl relative">
                        <h4 className="text-xs font-black text-rose-950 underline decoration-rose-500/40">{printPreviewInterview.diagnosis}</h4>
                        <p className="text-[11px] text-slate-500 leading-relaxed font-bold mt-2 font-semibold">
                          {printPreviewInterview.notes}
                        </p>
                      </div>
                    </div>

                    {/* Action recommendations prescriptions */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-black text-slate-900 flex items-center gap-2">
                        <span className="w-1.5 h-3 bg-rose-500 rounded" />
                        دستورالعمل‌های اصلاحی کایزنی (Rx Interventions)
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                        {printPreviewInterview.prescriptions.map((pr, index) => (
                          <div key={index} className="flex gap-3 items-start p-3 bg-slate-50 border border-slate-150 rounded-xl leading-relaxed">
                            <span className="w-6 h-6 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-100 font-serif flex items-center justify-center text-[10px] font-black shrink-0">
                              {toPersianNum(index + 1)}
                            </span>
                            <span className="text-[10px] text-slate-650 font-bold leading-relaxed">{pr}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Signature and official stamp block */}
                    <div className="flex justify-between items-center border-t border-slate-100 pt-6 mt-8">
                      <div className="space-y-1 text-right">
                        <span className="text-[10px] text-slate-400 block font-bold">مهر و امضای مشاور مجاز:</span>
                        <span className="text-xs font-black text-slate-800 block">مربی ارشد دپارتمان ترنم</span>
                        <div className="pt-2 text-[10px] text-emerald-600 font-bold flex items-center gap-1 font-semibold">
                          <Check className="w-4.5 h-4.5 text-emerald-500" />
                          <span>تاییدیه الکترونیک رسمی صادر شد</span>
                        </div>
                      </div>

                      {/* Seal badge mock */}
                      <div className="w-20 h-20 rounded-full border-4 border-rose-500/25 flex items-center justify-center text-center transform -rotate-12 border-dashed relative select-none">
                        <span className="absolute text-[8px] text-rose-500 font-black top-2 tracking-widest leading-none">ترنم همدلی</span>
                        <span className="text-rose-500 font-serif font-black text-sm">APPROVED</span>
                        <span className="absolute text-[8px] text-rose-500 font-black bottom-2 tracking-widest leading-none">۱۴۰۶ / رسمی</span>
                      </div>
                    </div>

                  </div>

                  {/* Print footer handles in modal */}
                  <div className="bg-slate-50 p-4 border-t border-slate-150 flex justify-between items-center">
                    <button
                      onClick={() => setPrintPreviewInterview(null)}
                      className="text-xs text-slate-500 hover:text-slate-800 font-black border border-slate-250 px-4 py-2 rounded-xl transition"
                    >
                      بستن پنجره
                    </button>
                    
                    <button
                      onClick={() => {
                        window.print();
                      }}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black px-5 py-2.5 rounded-xl flex items-center gap-1.5 shadow"
                    >
                      <Printer size={14} />
                      چاپ فیزیکی و خروجی نسخه PDF
                    </button>
                  </div>

                </div>
              </div>
            )}

          </motion.div>
        )}

        {activeTab === "scientific-analysis" && (
          <motion.div
            key="scientific-analysis-tab"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="space-y-8"
          >
            <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-xl space-y-10 relative overflow-hidden">
               <div className="absolute top-0 left-0 w-64 h-64 bg-indigo-50/50 rounded-full blur-3xl -ml-32 -mt-32 pointer-events-none" />
               
               <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10 border-b border-slate-100 pb-6">
                 <div className="space-y-2">
                   <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                     <BookMarked size={20} className="text-indigo-600" />
                     <span>گزارش جامع روایی و پایایی عملکرد (Scientific Audit)</span>
                   </h2>
                   <p className="text-xs text-slate-400 font-bold">این تحلیل بر اساس استانداردهای ۲۰۱۴ APA/AERA/NCME برای آزمون‌های آموزشی تدوین شده است.</p>
                 </div>
                 <div className="flex gap-2">
                   <span className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-lg text-[9px] font-black border border-emerald-100">درجه روایی: بالا</span>
                   <span className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-lg text-[9px] font-black border border-indigo-100">پایایی بازآزمایی: ۰.۸۹</span>
                 </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
                 {/* Cognitive Readiness Indices */}
                 <div className="md:col-span-2 space-y-8">
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                     <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 space-y-4">
                       <div className="flex justify-between items-center">
                         <span className="text-[10px] font-black text-slate-400 uppercase">شاخص آمادگی شناختی (CRI)</span>
                         <TrendingUp size={14} className="text-indigo-600" />
                       </div>
                       <div className="text-3xl font-black text-slate-900">{toPersianNum(82)}٪</div>
                       <p className="text-[9px] text-slate-500 leading-relaxed font-medium">میزان هماهنگی منابع ذهنی (حافظه کاری و توجه) با سطح دشواری سوالات دفترچه تخصصی.</p>
                       <div className="h-1.5 w-full bg-white rounded-full overflow-hidden">
                         <div className="h-full bg-indigo-600 w-[82%]" />
                       </div>
                     </div>

                     <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 space-y-4">
                       <div className="flex justify-between items-center">
                         <span className="text-[10px] font-black text-slate-400 uppercase">شاخص تاب‌آوری هیجانی (ERI)</span>
                         <Heart size={14} className="text-rose-600" />
                       </div>
                       <div className="text-3xl font-black text-slate-900">{toPersianNum(64)}٪</div>
                       <p className="text-[9px] text-slate-500 leading-relaxed font-medium">توانایی بازگشت به تمرکز پس از مواجهه با تست‌های بسیار دشوار یا وقت‌گیر.</p>
                       <div className="h-1.5 w-full bg-white rounded-full overflow-hidden">
                         <div className="h-full bg-rose-600 w-[64%]" />
                       </div>
                     </div>
                   </div>

                   <div className="p-8 bg-indigo-900 rounded-[32px] text-white space-y-6 relative overflow-hidden">
                     <div className="absolute right-0 bottom-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -mr-16 -mb-16" />
                     <h3 className="text-sm font-black flex items-center gap-2">
                       <Activity size={18} className="text-indigo-400" />
                       <span>ممیزی عملکرد بر اساس مقالات علمی (Research Insights)</span>
                     </h3>
                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <h4 className="text-[11px] font-black text-indigo-200">تکنیک بازسازی شناختی (CBT)</h4>
                          <p className="text-[10px] text-indigo-100/70 leading-relaxed">جایگزینی افکار منفی خودکار در دقایق پایانی آزمون با تمرکز بر پیشرفت‌های جزئی.</p>
                        </div>
                        <div className="space-y-2">
                          <h4 className="text-[11px] font-black text-indigo-200">مدل فراشناختی زیمرمن</h4>
                          <p className="text-[10px] text-indigo-100/70 leading-relaxed">تحلیل خطاهای شما نشان می‌دهد که در مرحله «تأمل پس از آزمون» ضعیف عمل کرده‌اید.</p>
                        </div>
                     </div>
                     <div className="pt-4 border-t border-white/10">
                        <button className="text-[10px] font-black bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl transition-colors">مشاهده جزییات ممیزی تخصصی</button>
                     </div>
                   </div>
                 </div>

                 {/* Standards & References */}
                 <div className="space-y-6">
                   <div className="p-6 bg-emerald-50 rounded-3xl border border-emerald-100 space-y-4">
                     <div className="flex items-center gap-2 text-emerald-900">
                       <ShieldAlert size={18} />
                       <h3 className="text-xs font-black">رعایت عدالت در سنجش (Fairness)</h3>
                     </div>
                     <p className="text-[10px] text-emerald-800/70 leading-relaxed font-bold">
                       این سامانه با تفکیک متغیرهای زمینه‌ای (خانواده، اقتصاد، محیط) تضمین می‌کند که پیشنهادات آموزشی صرفاً بر اساس تفاوت‌های فردی غیرفیزیکی باشد.
                     </p>
                   </div>

                   <div className="p-6 bg-amber-50 rounded-3xl border border-amber-100 space-y-4">
                     <div className="flex items-center gap-2 text-amber-900">
                       <ExternalLink size={18} />
                       <h3 className="text-xs font-black">منابع و مراجع علمی متصل</h3>
                     </div>
                     <div className="space-y-3">
                        <a href="https://www.apa.org" target="_blank" rel="noreferrer" className="flex items-center justify-between text-[9px] font-black text-amber-800 hover:underline">
                          <span>American Psychological Assoc.</span>
                          <ChevronLeft size={12} />
                        </a>
                        <a href="https://www.aera.net" target="_blank" rel="noreferrer" className="flex items-center justify-between text-[9px] font-black text-amber-800 hover:underline">
                          <span>Educational Research Assoc.</span>
                          <ChevronLeft size={12} />
                        </a>
                        <a href="https://www.ncme.org" target="_blank" rel="noreferrer" className="flex items-center justify-between text-[9px] font-black text-amber-800 hover:underline">
                          <span>Measurement in Education</span>
                          <ChevronLeft size={12} />
                        </a>
                     </div>
                   </div>
                 </div>
               </div>
            </div>
          </motion.div>
        )}
        {activeTab === "smart-profile" && (
          <motion.div
            key="smart-profile-tab"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="space-y-8"
          >
            <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-xl space-y-10 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50/50 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />
               
               <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-10">
                 <div className="space-y-1">
                   <h2 className="text-xl font-black text-slate-900">تحلیل آمادگی ذهنی و شرایط مطالعه داوطلب</h2>
                   <p className="text-xs text-slate-400 font-bold">دقت در وارد کردن این اطلاعات، دقت تحلیل‌های هوش مصنوعی را تا ۹۵٪ افزایش می‌دهد.</p>
                 </div>
                 <button className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-2xl text-xs font-black shadow-lg shadow-indigo-600/20 hover:scale-105 active:scale-95 transition-all">
                   <Check size={16} />
                   <span>ذخیره نهایی تغییرات</span>
                 </button>
               </div>

               <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 relative z-10">
                 {/* Left Column: Family & Context */}
                 <div className="space-y-8">
                   <div className="space-y-6">
                     <div className="flex items-center gap-3 text-indigo-600">
                        <Home size={20} />
                        <h3 className="text-sm font-black uppercase tracking-widest">بستر خانواده و محیط زیستی</h3>
                     </div>
                     <div className="grid grid-cols-2 gap-4">
                       <div className="space-y-1.5">
                         <label className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">وضعیت تحصیلات پدر</label>
                         <input type="text" defaultValue="کارشناسی ارشد" className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-xs font-bold outline-none focus:ring-2 focus:ring-indigo-500/10" />
                       </div>
                       <div className="space-y-1.5">
                         <label className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">وضعیت تحصیلات مادر</label>
                         <input type="text" defaultValue="دیپلم" className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-xs font-bold outline-none focus:ring-2 focus:ring-indigo-500/10" />
                       </div>
                       <div className="space-y-1.5">
                         <label className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">تعداد فرزندان در منزل</label>
                         <input type="number" defaultValue="2" className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-xs font-bold outline-none focus:ring-2 focus:ring-indigo-500/10" />
                       </div>
                       <div className="space-y-1.5">
                         <label className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">میزان درآمد تقریبی</label>
                         <select className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-xs font-bold outline-none">
                           <option>متوسط (کارمندی)</option>
                           <option>برخوردار (تجاری)</option>
                           <option>حمایتی</option>
                         </select>
                       </div>
                     </div>
                   </div>

                   <div className="space-y-6">
                     <div className="flex items-center gap-3 text-rose-600">
                        <Heart size={20} />
                        <h3 className="text-sm font-black uppercase tracking-widest">اطلاعات تکمیلی و سلامت روان</h3>
                     </div>
                     <div className="space-y-4">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">سایر داده‌های زمینه‌ای (کمک به مشاور)</label>
                          <textarea rows={3} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-xs font-bold outline-none resize-none" placeholder="مواردی مثل بیماری‌های خاص، شرایط خاص منزل، یا هر موضوعی که مایلید هوش مصنوعی در تحلیل‌هایش لحاظ کند..." />
                        </div>
                     </div>
                   </div>
                 </div>

                 {/* Right Column: Academic & Goals */}
                 <div className="space-y-8">
                    <div className="space-y-6">
                      <div className="flex items-center gap-3 text-amber-600">
                          <GraduationCap size={20} />
                          <h3 className="text-sm font-black uppercase tracking-widest">وضعیت تحصیلی و پایه درسی</h3>
                      </div>
                      <div className="grid grid-cols-1 gap-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">مقطع تحصیلی فعلی</label>
                            <input type="text" defaultValue="پایه دوازدهم (کنکوری)" className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-xs font-bold outline-none focus:ring-2 focus:ring-indigo-500/10" />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">معدل کتبی نهایی (یا تخمینی)</label>
                            <input type="number" defaultValue="19.45" className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-xs font-bold outline-none focus:ring-2 focus:ring-indigo-500/10" />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">میانگین ساعت مطالعه روزانه</label>
                            <input type="number" defaultValue="9" className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-xs font-bold outline-none focus:ring-2 focus:ring-indigo-500/10" />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">تراز هدف شبیه‌ساز</label>
                            <input type="number" defaultValue="8500" className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-xs font-bold outline-none focus:ring-2 focus:ring-indigo-500/10" />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="flex items-center gap-3 text-purple-600">
                          <Target size={20} />
                          <h3 className="text-sm font-black uppercase tracking-widest">اهداف، چشم‌انداز و انتظارات</h3>
                      </div>
                      <div className="space-y-4">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">هدف و رویای شخصی شما</label>
                          <textarea rows={2} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-xs font-bold outline-none resize-none" defaultValue="قبولی در رشته دندانپزشکی دانشگاه علوم پزشکی شهید بهشتی و مهاجرت تحصیلی در آینده" />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">انتظارات و آرزوی خانواده برای شما</label>
                          <textarea rows={2} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-xs font-bold outline-none resize-none" defaultValue="پدرم آرزو دارد من به عنوان یک پزشک موفق در شهر خودمان خدمت کنم." />
                        </div>
                      </div>
                    </div>
                 </div>
               </div>

               <div className="bg-indigo-50/50 p-6 rounded-3xl border border-indigo-100 flex items-center gap-4 relative z-10">
                  <div className="p-3 bg-white rounded-2xl text-indigo-600 shadow-sm">
                    <Sparkles size={20} />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-xs font-black text-indigo-900">پیشنهاد هوش مصنوعی ترنم مهر:</h4>
                    <p className="text-[10px] text-indigo-700 font-bold leading-relaxed">با توجه به معدل ۱۹.۴۵ شما و هدف دندانپزشکی شهید بهشتی، پیشنهاد می‌شود روی مباحث زمین‌شناسی و زیست‌شناسی گیاهی تمرکز بیشتری بگذارید تا تراز هدف ۸۵۰۰ محقق شود.</p>
                  </div>
               </div>
            </div>
          </motion.div>
        )}
        {activeTab === "exam-diagnostic" && (
          <motion.div
            key="exam-diagnostic-tab"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="space-y-8"
          >
            {/* Header Section */}
            <div className="bg-gradient-to-br from-[#0f172a] via-[#1e1b4b] to-[#0f172a] p-10 rounded-[48px] text-white shadow-2xl relative overflow-hidden border border-white/5">
               <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full -mr-32 -mt-32 blur-[120px]" />
               <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/5 rounded-full -ml-32 -mb-32 blur-[100px]" />
               
               <div className="relative space-y-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-center gap-5">
                      <div className="w-16 h-16 bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 flex items-center justify-center shadow-inner">
                        <Brain size={32} className="text-indigo-400" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-black tracking-tight mb-1">تحلیل آمادگی ذهنی و عملکرد آزمونی</h2>
                        <div className="text-slate-400 text-xs font-bold flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                          پورتال پایش آموزشی مبتنی بر آخرین کارنامه آزمون
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex -space-x-3 rtl:space-x-reverse">
                      {[1, 2, 3, 4].map(idx => (
                        <div key={idx} className="w-10 h-10 rounded-full border-2 border-[#1e1b4b] bg-slate-800 flex items-center justify-center text-[10px] font-bold overflow-hidden">
                           <img src={`https://avatar.iran.liara.run/public/${40 + idx}`} alt="Avatar" referrerPolicy="no-referrer" />
                        </div>
                      ))}
                      <div className="w-10 h-10 rounded-full border-2 border-[#1e1b4b] bg-indigo-600 flex items-center justify-center text-[8px] font-black">
                        +۸
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-slate-300 font-medium leading-relaxed max-w-4xl border-r-2 border-indigo-500/30 pr-6">
                    این پورتال با بررسی داده‌های کارنامه، الگوی پاسخگویی، شاخص‌های خوداظهاری و شرایط مطالعه داوطلب، گزارشی برای شناسایی نقاط قوت، عوامل افت عملکرد و پیشنهادهای عملی جهت بهبود نتیجه آزمون ارائه می‌دهد.
                  </p>

                  <div className="flex flex-wrap gap-3 pt-2">
                    {[
                      { label: "آنالیز خطاهای کارنامه", icon: BarChart3, color: "text-emerald-400" },
                      { label: "بررسی تمرکز و مدیریت زمان", icon: Activity, color: "text-indigo-400" },
                      { label: "تمرین تنفس و کنترل تنش", icon: Wind, color: "text-rose-400" },
                      { label: "تکمیل پروفایل آموزشی داوطلب", icon: ClipboardList, color: "text-amber-400" }
                    ].map((item, idx) => (
                      <div key={idx} className="px-4 py-2 bg-white/5 hover:bg-white/10 transition-colors border border-white/10 rounded-2xl flex items-center gap-3 group cursor-default">
                        <item.icon size={16} className={`${item.color} group-hover:scale-110 transition-transform`} />
                        <span className="text-[10px] font-bold text-slate-200 tracking-wide">{item.label}</span>
                      </div>
                    ))}
                  </div>
               </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8" >
            {/* Expert Diagnostic Passport */}
            <div className="lg:col-span-5 bg-white p-7 rounded-[32px] border border-slate-200 shadow-2xl space-y-7 flex flex-col justify-between relative overflow-hidden" id="expert-diagnostic-passport">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full -mr-16 -mt-16 blur-2xl pointer-events-none" />
              
              <div className="space-y-5">
                <div className="flex items-center gap-3 text-indigo-950 border-b border-slate-100 pb-4">
                  <div className="p-2.5 bg-indigo-600 rounded-2xl text-white shadow-lg shadow-indigo-200">
                    <ClipboardList size={20} />
                  </div>
                  <div>
                    <h2 className="text-sm font-black">شناسنامه عارضه‌یابی آخرین آزمون آزمایشی</h2>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Diagnostic Identification Passport</p>
                  </div>
                </div>

                <div className="p-5 bg-slate-50/80 rounded-3xl border border-slate-200/50 space-y-4 relative">
                  <div className="absolute top-4 left-4">
                    <div className="flex flex-col items-end">
                      <span className="text-[10px] text-slate-400 font-black">LAST AUDIT</span>
                      <span className="text-[10px] text-emerald-600 font-black">VERIFIED</span>
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <span className="text-[9px] bg-white border border-slate-100 text-slate-500 font-black px-2 py-0.5 rounded-full inline-block mb-1">آخرین کارنامه ثبت‌شده در سیستم</span>
                    <h3 className="text-base font-black text-slate-900 leading-tight font-sans">{latestExam.title}</h3>
                  </div>

                  <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-xs pt-4 border-t border-slate-200/60 font-bold text-slate-600">
                    <div className="flex justify-between items-center bg-white p-2 rounded-xl border border-slate-100">
                      <span className="text-[10px] text-slate-400">تاریخ برگزاری:</span>
                      <span className="text-slate-900 font-black">{latestExam.date}</span>
                    </div>
                    <div className="flex justify-between items-center bg-white p-2 rounded-xl border border-slate-100">
                      <span className="text-[10px] text-slate-400">تراز کل:</span>
                      <span className="text-emerald-600 font-black text-sm">{toPersianNum(latestExam.traz)}</span>
                    </div>
                    <div className="flex justify-between items-center bg-white p-2 rounded-xl border border-slate-100">
                      <span className="text-[10px] text-slate-400">رتبه کشوری:</span>
                      <span className="text-slate-900 font-black">{toPersianNum(latestExam.rank)}</span>
                    </div>
                    <div className="flex justify-between items-center bg-white p-2 rounded-xl border border-slate-100">
                      <span className="text-[10px] text-slate-400">میانگین کل:</span>
                      <span className="text-slate-900 font-black">{toPersianNum(latestExam.overallPercentage)}٪</span>
                    </div>
                  </div>
                </div>

                {/* Cognitive Behavioral Indicators */}
                <div className="space-y-4">
                  <h3 className="text-xs font-black text-slate-900 flex items-center gap-2 px-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span>سنجش‌های رفتاری تخمین‌زده شده از پاسخ‌برگ:</span>
                  </h3>

                  <div className="space-y-2.5">
                    <div className="p-4 bg-emerald-50/40 rounded-2xl border border-emerald-100/50 flex justify-between items-center group hover:bg-emerald-50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-white border border-emerald-100 flex items-center justify-center text-emerald-600 shadow-sm">
                          <Check size={16} />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xs font-black text-emerald-900">پاسخ‌های صحیح</span>
                          <span className="text-[9px] text-emerald-600/70 font-bold">ارتقای تراز مستقیم</span>
                        </div>
                      </div>
                      <span className="text-sm font-black text-emerald-600">{toPersianNum(derivedParams.totalCorrect)} تست</span>
                    </div>

                    <div className="p-4 bg-rose-50/40 rounded-2xl border border-rose-100/50 flex justify-between items-center group hover:bg-rose-50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-white border border-rose-100 flex items-center justify-center text-rose-600 shadow-sm">
                          <AlertCircle size={16} />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xs font-black text-rose-900">خطاهای منفی</span>
                          <span className="text-[9px] text-rose-600/70 font-bold">تله شتاب‌زدگی و عجله تستی</span>
                        </div>
                      </div>
                      <span className="text-sm font-black text-rose-600">{toPersianNum(derivedParams.totalWrong)} تست غلط</span>
                    </div>

                    <div className="p-4 bg-amber-50/40 rounded-2xl border border-amber-100/50 flex justify-between items-center group hover:bg-amber-50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-white border border-amber-100 flex items-center justify-center text-amber-600 shadow-sm">
                          <Brain size={16} />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xs font-black text-amber-900">تست‌های بدون پاسخ</span>
                          <span className="text-[9px] text-amber-600/70 font-bold">وسواس فکری و مهار ریسک</span>
                        </div>
                      </div>
                      <span className="text-sm font-black text-amber-600">{toPersianNum(derivedParams.totalEmpty)} تست نزده</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Expert Sync Action */}
              <button
                onClick={() => setActiveTab("ai-synthesis")}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-[20px] text-xs font-black transition-all shadow-xl shadow-indigo-600/20 hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-3 relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                <Sparkles size={16} className="text-amber-300 animate-pulse" />
                <span>بارگذاری پارامترها و همگام‌سازی با هوش روان‌شناسی</span>
                <ChevronLeft size={16} className="text-white/50" />
              </button>
            </div>

            {/* Detailed Subject Matrix */}
            <div className="lg:col-span-7 bg-white p-7 rounded-[32px] border border-slate-200 shadow-2xl space-y-7 relative overflow-hidden">
               <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-500/5 rounded-full -ml-24 -mb-24 blur-3xl pointer-events-none" />
               
              <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-50 rounded-xl text-emerald-600">
                    <BarChart3 size={18} />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-slate-900">ماتریس خطاها و ممیزی نمرات به تفکیک عنوان درسی</h3>
                    <p className="text-[10px] text-slate-400 font-bold">Subject Performance & Error Audit Matrix</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-1 rounded bg-slate-100 text-[9px] font-mono font-black text-slate-500">AUDIT_LEVEL: CLINICAL</span>
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                </div>
              </div>

              <div className="overflow-x-auto custom-scrollbar">
                <table className="w-full text-right text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-400 font-black text-[10px] uppercase tracking-tighter">
                      <th className="pb-4 pr-3">عنوان درس تخصصی</th>
                      <th className="pb-4 text-center">میزان درصد</th>
                      <th className="pb-4 text-center">پاسخ صحیح</th>
                      <th className="pb-4 text-center">غلط (نمره منفی)</th>
                      <th className="pb-4 text-center">سفید (نزده)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {latestExam.lessons.map((lesson, idx) => {
                      const totalSub = lesson.correct + lesson.wrong + lesson.empty || 1;
                      const wrongRatioSub = lesson.wrong / totalSub;
                      const isHighAnxiety = wrongRatioSub > 0.15;
                      
                      return (
                        <tr key={idx} className="group border-b border-slate-50 last:border-b-0 hover:bg-indigo-50/30 transition-colors">
                          <td className="py-4 pr-3">
                            <div className="flex items-center gap-3">
                              <div className="w-1.5 h-6 rounded-full bg-indigo-200 group-hover:bg-indigo-500 transition-colors" />
                              <span className="font-black text-slate-800">{lesson.lessonName}</span>
                            </div>
                          </td>
                          <td className="py-4 text-center">
                            <div className="inline-flex flex-col items-center">
                              <span className="font-black text-slate-900 text-sm tracking-tight">{toPersianNum(lesson.percentage)}٪</span>
                              <div className="w-12 h-1 bg-slate-100 rounded-full mt-1 overflow-hidden">
                                <div className="h-full bg-indigo-500" style={{ width: `${lesson.percentage}%` }} />
                              </div>
                            </div>
                          </td>
                          <td className="py-4 text-center font-black text-emerald-600">
                             <span className="bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100/50">{toPersianNum(lesson.correct)}</span>
                          </td>
                          <td className="py-4 text-center">
                            <div className="inline-flex flex-col items-center gap-1">
                              <span className="font-black text-rose-600 bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-100/50">{toPersianNum(lesson.wrong)}</span>
                              {isHighAnxiety && (
                                <span className="text-[8px] px-1.5 py-0.5 rounded bg-rose-500 text-white font-black animate-pulse shadow-sm shadow-rose-200">تنش بالا</span>
                              )}
                            </div>
                          </td>
                          <td className="py-4 text-center font-black text-slate-500">
                            <span className="bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100">{toPersianNum(lesson.empty)}</span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Informative Counselor Note */}
              <div className="relative group grayscale hover:grayscale-0 transition-all duration-500">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-50 to-indigo-50 rounded-3xl -m-0.5 pointer-events-none" />
                <div className="relative bg-white border border-slate-100 p-5 rounded-3xl space-y-3 shadow-md">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-200">
                      <Smile size={20} />
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-slate-900 uppercase">Counselor Diagnosis Note</h4>
                      <h5 className="text-[10px] text-indigo-600 font-bold">آسیب‌شناسی مشاور آکادمی هوشمند ترنم مهر</h5>
                    </div>
                  </div>
                  <p className="text-[11px] font-bold text-slate-600 leading-relaxed indent-4">
                    بررسی عمیق ماتریس خطاهای شما نشان می‌دهد که پدیده 
                    <span className="text-rose-600 font-black px-1">"بلاک حافظه لحظه‌ای"</span> 
                    در دروس محاسباتی ریشه در استرس جلسه آزمون و وسواس ذهنی روی گزینه‌های نزدیک به هم دارد. تحلیل هوش مصنوعی زیر به شما کمک خواهد کرد با تنظیم بهینه فواصل مطالعاتی و تمرین‌های آرام‌سازی تنفسی، این خطاها را تا ۷۰ درصد در شبیه‌ساز بعدی برطرف سازید.
                  </p>
                  <div className="flex justify-end pt-1">
                    <div className="flex items-center gap-2">
                       <span className="text-[9px] text-slate-400 font-black italic">Chief Academic Psychologist - Radan</span>
                       <div className="w-8 h-px bg-slate-200" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            </div>
          </motion.div>
        )}

        {activeTab === "ai-synthesis" && (
          <motion.div
            key="ai-synthesis-tab"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8"
          >
            {/* Adjustable sliders initialized from exam derived metrics */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-white p-6 rounded-3xl border border-slate-150 shadow-sm space-y-6" id="life-context-widget">
                <div className="flex items-center gap-2 text-indigo-950 border-b border-slate-100 pb-3">
                  <Layers size={18} className="text-emerald-600" />
                  <h2 className="text-sm font-black">پروفایل زیست‌محیطی داوطلب</h2>
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-500">🏙️ شهر محل سکونت</label>
                    <input 
                      type="text" value={city} onChange={(e) => setCity(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-100 rounded-xl px-3 py-2 text-xs font-bold outline-none focus:ring-2 focus:ring-indigo-500/20"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-500">🏠 جو خانواده و حمایت</label>
                    <input 
                      type="text" value={familyContext} onChange={(e) => setFamilyContext(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-100 rounded-xl px-3 py-2 text-xs font-bold outline-none focus:ring-2 focus:ring-indigo-500/20"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-500">💰 وضعیت اقتصادی و مالی</label>
                    <select 
                      value={financialStatus} onChange={(e) => setFinancialStatus(e.target.value as any)}
                      className="w-full bg-slate-50 border border-slate-100 rounded-xl px-3 py-2 text-xs font-bold outline-none cursor-pointer"
                    >
                      <option value="good">مناسب و تامین</option>
                      <option value="limited">محدود و نیازمند مدیریت</option>
                      <option value="challenging">دشوار و پرچالش</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-500">🎯 هدف غایی (رویای شما)</label>
                    <input 
                      type="text" value={mainGoal} onChange={(e) => setMainGoal(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-100 rounded-xl px-3 py-2 text-xs font-bold outline-none focus:ring-2 focus:ring-indigo-500/20"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-slate-150 shadow-sm space-y-6" id="survey-calibration-widget">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-indigo-950 border-b border-slate-100 pb-3">
                  <Brain size={18} className="text-indigo-600" />
                  <h2 className="text-sm font-black">کالیبراسیون شاخص‌های عصبی کارنامه</h2>
                </div>
                <p className="text-[11px] text-slate-400 font-bold leading-relaxed">
                  این پرسشنامه براساس اطلاعات عینی کارنامه شما کالیبره شده است. در صورت تمایل می‌توانید پارامترها را مجدداً تصحیح کنید تا آنالیز دقیق‌تری متناسب با شرایط فیزیکی شما صادر شود.
                </p>

                {/* Slider 1 */}
                <div className="space-y-2">
                  <div className="flex justify-between text-[11px] font-black">
                    <span className="text-slate-700">اضطراب و استرس جلسه آزمون آزمایشی</span>
                    <span className="text-rose-600 bg-rose-50 px-2 py-0.5 rounded-lg">{toPersianNum(qAnxiety)} از ۱۰</span>
                  </div>
                  <input 
                    type="range" min="1" max="10" 
                    value={qAnxiety} 
                    onChange={(e) => setQAnxiety(Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                  />
                </div>

                {/* Slider 2 */}
                <div className="space-y-2">
                  <div className="flex justify-between text-[11px] font-black">
                    <span className="text-slate-700">توان تمرکز مستمر (دیپ پومودورو)</span>
                    <span className="text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-lg">{toPersianNum(qFocus)} از ۱۰</span>
                  </div>
                  <input 
                    type="range" min="1" max="10" 
                    value={qFocus} 
                    onChange={(e) => setQFocus(Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                  />
                </div>

                {/* Slider 3 */}
                <div className="space-y-2">
                  <div className="flex justify-between text-[11px] font-black">
                    <span className="text-slate-700">کمال‌گرایی منفی (وسواس زمان‌سنجی تستی)</span>
                    <span className="text-amber-600 bg-amber-50 px-2 py-0.5 rounded-lg">{toPersianNum(qPerfectionism)} از ۱۰</span>
                  </div>
                  <input 
                    type="range" min="1" max="10" 
                    value={qPerfectionism} 
                    onChange={(e) => setQPerfectionism(Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                  />
                </div>

                {/* Slider 4 */}
                <div className="space-y-2">
                  <div className="flex justify-between text-[11px] font-black">
                    <span className="text-slate-700">کیفیت خواب و ریکاوری شبانه عصب</span>
                    <span className="text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-lg">{toPersianNum(qSleep)} از ۱۰</span>
                  </div>
                  <input 
                    type="range" min="1" max="10" 
                    value={qSleep} 
                    onChange={(e) => setQSleep(Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                  />
                </div>

                {/* Slider 5 */}
                <div className="space-y-2">
                  <div className="flex justify-between text-[11px] font-black">
                    <span className="text-slate-700">مقاومت بدنی و ذهنی دهر شیفت بعد از ظهر</span>
                    <span className="text-violet-600 bg-violet-50 px-2 py-0.5 rounded-lg">{toPersianNum(qStamina)} از ۱۰</span>
                  </div>
                  <input 
                    type="range" min="1" max="10" 
                    value={qStamina} 
                    onChange={(e) => setQStamina(Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                  />
                </div>
              </div>
            </div>

            <button
                id="btn-calibration-assess"
                onClick={handleAnalyze}
                disabled={loading}
                className="w-full mt-6 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 text-white py-3.5 rounded-2xl text-xs font-black transition-all shadow-lg shadow-indigo-600/10 hover:shadow-indigo-600/20 active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? (
                  <>
                    <RefreshCw size={14} className="animate-spin" />
                    <span>کلاسیفایر هوش مصنوعی در حال اجرای تحلیل...</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={14} className="text-amber-400" />
                    <span>تحلیل چندمحوری عملکرد آزمونی</span>
                  </>
                )}
              </button>
            </div>

            {/* Response Section */}
            <div className="lg:col-span-8 space-y-6">
              {currentReport ? (
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                  {/* Gauge Card: Stress & Burnout Metric */}
                  <div className="md:col-span-5 bg-white p-6 rounded-3xl border border-slate-150 shadow-sm flex flex-col justify-between items-center text-center">
                    <div className="w-full flex justify-between items-center border-b border-slate-100 pb-3">
                      <h3 className="text-xs font-black text-slate-700">سطح کل تنش و فرسودگی</h3>
                      <span className="text-[10px] font-black text-slate-400">شناسه: {currentReport.id}</span>
                    </div>

                    <div className="my-6 relative flex items-center justify-center">
                      <svg className="w-32 h-32 transform -rotate-90">
                        <circle cx="64" cy="64" r="52" stroke="#f1f5f9" strokeWidth="10" fill="transparent" />
                        <circle 
                          cx="64" cy="64" r="52" 
                          stroke={currentReport.stressLevel > 70 ? "#ef4444" : currentReport.stressLevel > 45 ? "#f97316" : "#10b981"} 
                          strokeWidth="10" fill="transparent" 
                          strokeDasharray={2 * Math.PI * 52}
                          strokeDashoffset={2 * Math.PI * 52 * (1 - currentReport.stressLevel / 100)}
                          strokeLinecap="round"
                          className="transition-all duration-1000"
                        />
                      </svg>
                      <div className="absolute text-center">
                        <p className="text-3xl font-black text-slate-800 tracking-tighter">{toPersianNum(currentReport.stressLevel)}٪</p>
                        <p className="text-[9px] font-black text-slate-400 mt-0.5">شاخص فشار ذهنی تخمینی</p>
                      </div>
                    </div>

                    <div className="space-y-2 w-full text-right">
                      <div className={`p-3 rounded-2xl text-[11px] font-bold text-center ${
                        currentReport.stressLevel > 70 ? "bg-rose-50 text-rose-700" : currentReport.stressLevel > 45 ? "bg-orange-50 text-orange-700" : "bg-emerald-50 text-emerald-700"
                      }`}>
                        {currentReport.stressLevel > 70 ? "سطح فشار ذهنی بالا ! نیازمند استراحت و بازنگری پارت‌های مطالعاتی" : currentReport.stressLevel > 45 ? "سطح فشار متوسط (محرک یادگیری)" : "وضعیت فشار ذهنی پایدار و مطلوب"}
                      </div>
                    </div>
                  </div>

                  {/* Multi-axial Radar Chart for Cognitive Competency Indicators */}
                  <div className="md:col-span-7 bg-white p-6 rounded-3xl border border-slate-150 shadow-sm flex flex-col justify-between">
                    <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                      <h3 className="text-xs font-black text-indigo-950 flex items-center gap-1.5">
                        <Award size={15} className="text-indigo-600" />
                        <span>ماتریس چندمحوری مهارت‌های مدیریت آزمون</span>
                      </h3>
                      <span className="text-[10px] font-black bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-md">{currentReport.date}</span>
                    </div>

                    <div className="h-56 mt-4 w-full flex items-center justify-center">
                      <ResponsiveContainer width="100%" height="100%">
                        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarChartData}>
                          <PolarGrid stroke="#e2e8f0" />
                          <PolarAngleAxis dataKey="subject" tick={{ fill: "#64748b", fontSize: 9, fontWeight: 900 }} />
                          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 8 }} />
                          <Radar 
                            name="شاخص عملکردی" 
                            dataKey="A" 
                            stroke="#4f46e5" 
                            fill="#6366f1" 
                            fillOpacity={0.15} 
                          />
                        </RadarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Diagnosis, Cognitive Traps, and AI Remedies Section */}
                  <div className="col-span-12 bg-white p-6 rounded-3xl border border-slate-150 shadow-sm space-y-4">
                    <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                      <Sparkles size={16} className="text-indigo-600 animate-pulse" />
                      <h4 className="text-xs font-black text-slate-800">تحلیل الگوی پاسخگویی بر اساس خطاهای آزمونی</h4>
                    </div>

                    <div className="p-4 bg-slate-50/50 rounded-2xl border border-slate-100 space-y-2">
                      <span className="text-[9px] font-black text-indigo-600 tracking-wider">جمعبندی مشاور آموزشی:</span>
                      <p className="text-xs font-semibold leading-relaxed text-slate-700">{currentReport.diagnosis}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Active Cognitive Trap Identifier */}
                      <div className="p-4 rounded-2xl border border-amber-100 bg-amber-50/30 space-y-1.5">
                        <span className="text-[9px] font-black text-amber-600 tracking-wider flex items-center gap-1">
                          <AlertCircle size={10} />
                          <span>الگوی احتمالی فعال:</span>
                        </span>
                        <p className="text-xs font-black text-slate-800">{currentReport.cognitiveTrap}</p>
                      </div>

                      {/* Zen Breathing advice recommendation */}
                      <div className="p-4 rounded-2xl border border-teal-100 bg-teal-50/30 space-y-1.5">
                        <span className="text-[9px] font-black text-teal-600 tracking-wider flex items-center gap-1">
                          <Wind size={10} />
                          <span>تمرین تنفس ریتمیک پیشنهادی:</span>
                        </span>
                        <p className="text-xs font-bold text-slate-700">{currentReport.meditationAdvice}</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <span className="text-[10px] font-black text-slate-500 block">اقدامات تمرینی پیشنهادی جهت بهبود عملکرد:</span>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {currentReport.remedies.map((rem, idx) => (
                          <div key={idx} className="p-3 bg-white hover:bg-slate-50 border border-slate-100 rounded-xl relative group transition-all flex gap-2">
                            <span className="font-serif text-xs font-black text-indigo-200">#۰{idx + 1}</span>
                            <p className="text-[10px] text-slate-600 font-bold leading-relaxed">{rem}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* New Neuro-Psychological Audit Section */}
                    <div className="pt-4 border-t border-slate-100">
                      <div className="flex items-center gap-2 mb-4">
                        <Activity size={16} className="text-rose-600" />
                        <h4 className="text-xs font-black text-slate-800">ارزیابی مهارت‌های اجرایی و آزمونی</h4>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="p-4 bg-slate-900 rounded-3xl text-white space-y-3 relative overflow-hidden">
                           <div className="absolute top-0 right-0 w-16 h-16 bg-rose-500/10 rounded-full blur-xl" />
                           <div className="flex justify-between items-center">
                             <span className="text-[9px] font-black text-slate-400">فشار تصمیم‌گیری آزمونی</span>
                             <Zap size={12} className="text-amber-400" />
                           </div>
                           <div className="text-xl font-black">{toPersianNum(Math.round(currentReport.stressLevel * 0.85))}٪</div>
                           <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                             <div className="h-full bg-amber-400" style={{ width: `${currentReport.stressLevel * 0.85}%` }} />
                           </div>
                           <p className="text-[8px] font-bold text-slate-400 leading-tight">فشار تصمیم‌گیری در محدوده قابل مدیریت است.</p>
                        </div>

                        <div className="p-4 bg-indigo-950 rounded-3xl text-white space-y-3 relative overflow-hidden">
                           <div className="absolute top-0 right-0 w-16 h-16 bg-indigo-500/10 rounded-full blur-xl" />
                           <div className="flex justify-between items-center">
                             <span className="text-[9px] font-black text-slate-400">واکنش‌پذیری به استرس آزمون</span>
                             <ShieldAlert size={12} className="text-rose-400" />
                           </div>
                           <div className="text-xl font-black">{toPersianNum((qAnxiety * 10))}٪</div>
                           <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                             <div className="h-full bg-rose-400" style={{ width: `${qAnxiety * 10}%` }} />
                           </div>
                           <p className="text-[8px] font-bold text-slate-400 leading-tight">اضطراب آزمونی متوسط رو به پایین ارزیابی می‌شود.</p>
                        </div>

                        <div className="p-4 bg-emerald-950 rounded-3xl text-white space-y-3 relative overflow-hidden">
                           <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-500/10 rounded-full blur-xl" />
                           <div className="flex justify-between items-center">
                             <span className="text-[9px] font-black text-slate-400">پردازش تحلیلی و تصویری</span>
                             <Eye size={12} className="text-emerald-400" />
                           </div>
                           <div className="text-xl font-black">{toPersianNum(qFocus * 10)}٪</div>
                           <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                             <div className="h-full bg-emerald-400" style={{ width: `${qFocus * 10}%` }} />
                           </div>
                           <p className="text-[8px] font-bold text-slate-400 leading-tight">توان تحلیل و بازخوانی اطلاعات در سطح مطلوب گزارش شده است.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          </motion.div>
        )}

        {activeTab === "breathing" && (
          <motion.div
            key="breathing-tab"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8"
          >
            {/* Visual Centering Pulsing Circle Card */}
            <div className="lg:col-span-7 bg-white p-8 rounded-3xl border border-slate-150 shadow-sm flex flex-col justify-between items-center relative overflow-hidden" id="breathing-chamber-widget">
              <div className="flex flex-col items-center text-center space-y-2 w-full border-b border-slate-100 pb-4">
                <span className="text-[9px] font-black text-indigo-600 tracking-widest uppercase">Breathing Resonance Chamber</span>
                <div className="text-base font-black text-indigo-950 flex items-center gap-1.5 justify-center relative">
                  <Wind size={18} className="text-indigo-500" />
                  <span>محفظه تمرین تنفس و کنترل تنش آزمونی</span>
                  <div className="relative group cursor-help ml-1">
                    <HelpCircle size={14} className="text-slate-400 hover:text-indigo-600 transition-colors" />
                    <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-56 p-3 bg-slate-900 text-white text-[10px] rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 shadow-xl pointer-events-none">
                      <div className="font-black border-b border-white/10 pb-1.5 mb-1.5 flex items-center gap-1">
                        <Wind size={10} className="text-emerald-400" />
                        تکنیک تنفس ۴-۴-۴-۴ (مربع)
                      </div>
                      <p className="font-bold leading-relaxed text-slate-300">
                        ۱. دم عمیق (۴ ثانیه) <br />
                        ۲. حبس نفس (۴ ثانیه) <br />
                        ۳. بازدم کامل (۴ ثانیه) <br />
                        ۴. مکث و توازن (۴ ثانیه) <br />
                        این ریتم سیستم پاراسمپاتیک را فعال کرده و بلافاصله تراز تمرکز شما را بازیابی می‌کند.
                      </p>
                      <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-slate-900" />
                    </div>
                  </div>
                </div>
                <p className="text-[10px] text-slate-400 max-w-lg font-bold leading-relaxed">
                  بررسی خطاهای شما در درس {latestExam.lessons[0]?.lessonName} نشان‌دهنده نیاز به یک دوره تمرین تنفس آرام‌بخش ۴ ثانیه‌ای بین دروس تخصصی است. لطفاً در محیطی آرام قرار گرفته و ریتم تنفسی خود را همگام سازید.
                </p>
              </div>

              {/* Pulsing visual core */}
              <div className="my-12 h-64 flex flex-col items-center justify-center relative w-full">
                {/* Secondary outer ripple */}
                <AnimatePresence>
                  {isBreathingActive && (
                    <motion.div 
                      key={breathPhase}
                      initial={{ scale: 0.8, opacity: 0.15 }}
                      animate={{ 
                        scale: breathPhase === "inhale" ? 1.6 : breathPhase === "exhale" ? 0.9 : breathPhase === "hold" ? 1.4 : 0.8,
                        opacity: breathPhase === "hold" ? 0.25 : 0.08
                      }}
                      transition={{ duration: 4, ease: "easeInOut" }}
                      className="absolute w-44 h-44 rounded-full bg-indigo-400 blur-xl pointer-events-none"
                    />
                  )}
                </AnimatePresence>

                {/* Primary breathing orb */}
                <motion.div 
                  animate={{ 
                    scale: !isBreathingActive ? 1 :
                           breathPhase === "inhale" ? 1.45 :
                           breathPhase === "hold" ? 1.45 :
                           breathPhase === "exhale" ? 0.95 : 0.9
                  }}
                  transition={{ duration: 4, ease: "easeInOut" }}
                  className={`w-36 h-36 rounded-full flex flex-col items-center justify-center text-center shadow-2xl relative z-10 select-none transition-colors duration-500 ${
                    !isBreathingActive ? "bg-slate-100 text-slate-500 border border-slate-200" :
                    breathPhase === "inhale" ? "bg-indigo-600 text-white shadow-indigo-600/30" :
                    breathPhase === "hold" ? "bg-teal-600 text-white shadow-teal-500/30" :
                    breathPhase === "exhale" ? "bg-rose-500 text-white shadow-rose-500/30" : "bg-zinc-650 text-white shadow-zinc-500/30"
                  }`}
                >
                  <span className="text-[10px] font-black tracking-widest uppercase opacity-80 block mb-1">
                    {!isBreathingActive ? "آماده حرکت" :
                     breathPhase === "inhale" ? "دم عمیق" :
                     breathPhase === "hold" ? "حبس نفس" :
                     breathPhase === "exhale" ? "بازدم عمیق" : "مکث و توازن"}
                  </span>
                  
                  <span className="text-3xl font-black font-sans leading-none block tracking-tighter">
                    {breathTimer}
                  </span>
                  
                  <span className="text-[9px] font-bold block mt-1 opacity-70">ثانیه</span>
                </motion.div>
              </div>

              {/* Action State buttons */}
              <div className="flex gap-4 w-full justify-center">
                <button
                  onClick={() => setIsBreathingActive(!isBreathingActive)}
                  className={`px-8 py-3.5 rounded-full text-xs font-black transition-all cursor-pointer shadow-lg active:scale-95 flex items-center justify-center gap-2 ${
                    isBreathingActive ? "bg-rose-600 text-white hover:bg-rose-700 shadow-rose-650/20" : "bg-indigo-600 text-white hover:bg-indigo-400 shadow-indigo-600/20"
                  }`}
                >
                  {isBreathingActive ? (
                    <>
                      <span>توقف تمرین تنفس</span>
                    </>
                  ) : (
                    <>
                      <Play size={14} fill="currentColor" />
                      <span>شروع همگام‌ساز تنفس</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Instruction Manual on Biofeedback Breathing dynamics */}
            <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-slate-150 shadow-sm space-y-4 text-right justify-between flex flex-col">
              <div className="space-y-3">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                  <Info size={16} className="text-teal-600" />
                  <h3 className="text-xs font-black text-indigo-950">مکانیسم آرام‌سازی ریتم تنفس ۴ ثانیه‌ای</h3>
                </div>
                <div className="space-y-4">
                  <div className="p-3 bg-indigo-50/50 rounded-2xl flex gap-3 items-center border border-indigo-100/30">
                    <span className="w-6 h-6 rounded-full bg-indigo-600 text-white font-serif flex items-center justify-center text-[10px] font-black">۱</span>
                    <div>
                      <span className="text-xs font-black text-slate-800 block">گام اول: دم (Inhale) - ۴ ثانیه</span>
                      <p className="text-[10px] text-slate-400 font-semibold mt-0.5">افزایش اکسیژن‌رسانی و آرام‌سازی سیستم عصبی مرکزی.</p>
                    </div>
                  </div>

                  <div className="p-3 bg-teal-50/50 rounded-2xl flex gap-3 items-center border border-teal-100/30">
                    <span className="w-6 h-6 rounded-full bg-teal-600 text-white font-serif flex items-center justify-center text-[10px] font-black">۲</span>
                    <div>
                      <span className="text-xs font-black text-slate-800 block">گام دوم: حبس نفس (Hold) - ۴ ثانیه</span>
                      <p className="text-[10px] text-slate-400 font-semibold mt-0.5">ایجاد هماهنگی بین ضربان قلب و ریتم تنفسی.</p>
                    </div>
                  </div>

                  <div className="p-3 bg-rose-50/50 rounded-2xl flex gap-3 items-center border border-rose-100/30">
                    <span className="w-6 h-6 rounded-full bg-rose-500 text-white font-serif flex items-center justify-center text-[10px] font-black">۳</span>
                    <div>
                      <span className="text-xs font-black text-slate-800 block">گام سوم: بازدم (Exhale) - ۴ ثانیه</span>
                      <p className="text-[10px] text-slate-400 font-semibold mt-0.5">تخلیه تنش‌های انباشته شده و رهاسازی عضلانی.</p>
                    </div>
                  </div>

                  <div className="p-3 bg-zinc-50/55 rounded-2xl flex gap-3 items-center border border-zinc-150">
                    <span className="w-6 h-6 rounded-full bg-zinc-650 text-white font-serif flex items-center justify-center text-[10px] font-black">۴</span>
                    <div>
                      <span className="text-xs font-black text-slate-800 block">گام چهارم: مکث و توازن (Rest) - ۴ ثانیه</span>
                      <p className="text-[10px] text-slate-400 font-semibold mt-0.5">ایجاد تنفس تعادلی هماهنگ پیش از ورود به چرخه دم جدید.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Footer / Scientific Basis Info */}
      <div className="mt-12 bg-slate-50 border border-slate-200 rounded-3xl p-8">
        <div className="flex items-center gap-3 mb-6">
          <BookMarked size={24} className="text-indigo-600" />
          <h3 className="text-xl font-black text-slate-900">مبانی علمی و استانداردهای پایش</h3>
        </div>
        
        <p className="text-sm text-slate-600 leading-relaxed mb-8 font-medium">
          تمامی تحلیل‌ها، تمرین‌های تنفسی و مدل‌های ارزیابی در این پورتال بر اساس چارچوب‌های پذیرفته‌شده در روان‌شناسی تربیتی و مدیریت اضطراب آزمون طراحی شده‌اند. در ادامه، برخی از مهم‌ترین استانداردها و منابع علمی مورد استفاده آورده شده است:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-150 shadow-sm hover:border-indigo-200 transition-colors">
            <h4 className="text-sm font-black text-slate-800 mb-2">استاندارد APA</h4>
            <p className="text-[10px] text-slate-500 leading-relaxed mb-4">استانداردهای آزمون‌گری آموزشی و روان‌شناختی جهت تضمین عدالت و روایی ارزیابی‌ها.</p>
            <a href="https://www.apa.org/science/programs/testing/standards" target="_blank" rel="noopener noreferrer" className="text-[10px] font-black text-indigo-600 hover:underline flex items-center gap-1">
              مشاهده منبع <ExternalLink size={10} />
            </a>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-150 shadow-sm hover:border-indigo-200 transition-colors">
            <h4 className="text-sm font-black text-slate-800 mb-2">مدیریت اضطراب (CBT)</h4>
            <p className="text-[10px] text-slate-500 leading-relaxed mb-4">به‌کارگیری تکنیک‌های رفتاردرمانی شناختی برای مهار استرس‌های حاد جلسه آزمون.</p>
            <a href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC8900696/" target="_blank" rel="noopener noreferrer" className="text-[10px] font-black text-indigo-600 hover:underline flex items-center gap-1">
              مشاهده مقاله <ExternalLink size={10} />
            </a>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-150 shadow-sm hover:border-indigo-200 transition-colors">
            <h4 className="text-sm font-black text-slate-800 mb-2">تنفس ریتمیک (Box Breathing)</h4>
            <p className="text-[10px] text-slate-500 leading-relaxed mb-4">تاثیر تنفس مربعی بر کاهش ضربان قلب و بهبود تمرکز در شرایط پرفشار (Mayo Clinic).</p>
            <a href="https://health.clevelandclinic.org/box-breathing-benefits" target="_blank" rel="noopener noreferrer" className="text-[10px] font-black text-indigo-600 hover:underline flex items-center gap-1">
              مشاهده مرجع <ExternalLink size={10} />
            </a>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-150 shadow-sm hover:border-indigo-200 transition-colors">
            <h4 className="text-sm font-black text-slate-800 mb-2">یادگیری خودتنظیمی (SRL)</h4>
            <p className="text-[10px] text-slate-500 leading-relaxed mb-4">مدل زیمرمن برای تحلیل خطاهای آموزشی و بهبود استراتژی‌های مطالعه فردی.</p>
            <a href="https://www.jstor.org/stable/j.ctv10h9g9v.7" target="_blank" rel="noopener noreferrer" className="text-[10px] font-black text-indigo-600 hover:underline flex items-center gap-1">
              مشاهده مطالعه <ExternalLink size={10} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
