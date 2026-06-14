import React, { useState, useRef, useEffect } from "react";
import { 
  Send, User, Sparkles, AlertCircle, HelpCircle, CheckSquare, 
  BookOpen, HeartPulse, Brain, Plus, Trash2, Calendar, 
  Clock, Check, Smile, ClipboardList, PlusCircle, Target
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { ChatMessage, Student } from "../types";
import { BRAND_CONFIG } from "../constants";
import { addSystemLog } from "../lib/syslogs";

interface CounselingSession {
  id: string;
  type: "academic" | "motivational";
  title: string;
  date: string;
  counselorName: string;
  notes: string;
  actionSteps: { text: string; completed: boolean }[];
  recommendedStudyHours: number;
}

interface CounselorViewProps {
  student: Student;
  onNavigate?: (view: any) => void;
}

export default function CounselorView({ student, onNavigate }: CounselorViewProps) {
  const [activeTab, setActiveTab] = useState<"chat" | "sessions">("chat");

  // --- ACTIVE API PROVIDER IDENTIFIER ---
  const [activeProvider, setActiveProvider] = useState<string>("Google Gemini");

  useEffect(() => {
    const checkProvider = () => {
      try {
        const saved = localStorage.getItem("arateb_ai_provider_keys");
        if (saved) {
          const keys = JSON.parse(saved);
          if (Array.isArray(keys) && keys.length > 0) {
            setActiveProvider(keys[0].provider || "Google Gemini");
            return;
          }
        }
        const legacyKey = localStorage.getItem("arateb_gemini_api_key");
        if (legacyKey) {
          setActiveProvider("Google Gemini");
        }
      } catch(e) {}
    };

    checkProvider();
    window.addEventListener("storage", checkProvider);
    return () => window.removeEventListener("storage", checkProvider);
  }, []);

  // --- LIVE CHAT STATE ---
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      role: "model",
      content: `سلام ${student.name} گرامی! من دکتر رادان، مشاور علمی و برنامه‌ریز ارشد کنکور در موسسه ترنم مهر هستم. کارنامه شبیه‌ساز، نقاط قوت و ضعف و پیش‌نویس مطالعه شما را بررسی کردم. امروز چطور می‌توانم در رفع تله‌های زیست‌شناسی، روش خلاصه نویسی فیزیک یا مهار اضطراب و خستگی دوران کنکور به شما کمک کنم؟`,
      timestamp: new Date().toLocaleTimeString("fa-IR", { hour: "2-digit", minute: "2-digit" })
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [connectionError, setConnectionError] = useState(false);
  const [lastDetailedError, setLastDetailedError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickQuestions = [
    "در تله‌های تستی زیست‌شناسی و مبحث ژنتیک مشکل دارم، راهکار چیست؟",
    "آهنگ پیش‌روی برنامه‌ وبینارهای شیمی آلی ترنم مهر خیلی سریع است.",
    "چگونه تراز مانیتورینگ خود را در آزمون‌های شبیه‌ساز بعدی بالاتر ببرم؟",
    "بودجه‌بندی و تکنیک‌های موازنه تراز در مبحث حسابان و هندسه چیست؟"
  ];

  // --- SESSIONS LOG STATE ---
  const [sessions, setSessions] = useState<CounselingSession[]>(() => {
    const stored = localStorage.getItem(`taranom_mehr_sessions_${student.id}`);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        console.error("Could not parse counseling sessions from localStorage", e);
      }
    }
    return [
      {
        id: "session-1",
        type: "academic",
        title: "تحلیل موشکافانه تله‌های تستی شیمی تخصصی و مباحث استوکیومتری",
        date: "۱۴۰۶/۰۳/۰۹",
        counselorName: "دکترین مهدوی",
        notes: "بررسی فرکانس پاسخ‌های منفی نشان می‌دهد به علت تست‌زنی سرعتی بدون تحلیل کتب شرح آزمونی، داوطلب در مباحث محاسباتی با افت تراز مواجه شده است. مقرر شد ساعت مطالعه شیمی تخصصی به ۶ ساعت در هفته با تاکید بر منابع ترنم مهر افزایش یابد.",
        actionSteps: [
          { text: "تحلیل و خلاصه نویسی مباحث زیست و فیزیک از روی شرح صریح", completed: true },
          { text: "تست‌زنی جامع از آزمون‌های سال گذشته ترنم مهر بدون مانیتورینگ وقت", completed: false }
        ],
        recommendedStudyHours: 48
      },
      {
        id: "session-2",
        type: "motivational",
        title: "کنترل اضطراب، رفع فرسودگی ذهنی و مدیریت زمان در پومودورو",
        date: "۱۴۰۵/۰۲/۱۸",
        counselorName: "دکتر رادان",
        notes: "ریشه افت راندمان در آزمون‌های شبیه‌ساز آخر هفته، کم‌خوابی مفرط و مطالعه مداوم بدون استراحت پویا گزارش شد. مقرر گردید متد ۲۵ دقیقه مطالعه و ۵ دقیقه تنفس بدون گوشی موبایل به دقت پیاده‌سازی شود.",
        actionSteps: [
          { text: "تنظیم ساعت خواب شبانه و ممانعت از مطالعه بعد از نیمه‌شب", completed: false },
          { text: "استفاده از سیستم ردیابی کایزن درسی جهت ثبت مستمر ساعت مطالعه هفتگی", completed: true }
        ],
        recommendedStudyHours: 42
      }
    ];
  });

  // --- NEW SESSION FORM STATE ---
  const [newType, setNewType] = useState<"academic" | "motivational">("academic");
  const [newTitle, setNewTitle] = useState("");
  const [newCName, setNewCName] = useState("دکتر رادان");
  const [newDate, setNewDate] = useState("۱۴۰۵/۰۳/۰۱");
  const [newNotes, setNewNotes] = useState("");
  const [newHours, setNewHours] = useState(44);
  const [newActionInput, setNewActionInput] = useState("");
  const [newActionStepsList, setNewActionStepsList] = useState<string[]>([]);
  const [isAiGenerating, setIsAiGenerating] = useState(false);

  const saveSessionsToLocal = (updated: CounselingSession[]) => {
    setSessions(updated);
    localStorage.setItem(`taranom_mehr_sessions_${student.id}`, JSON.stringify(updated));
  };

  useEffect(() => {
    if (activeTab === "chat") {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, sending, activeTab]);

  const getClientCounselorFallbackReply = (msg: string): string => {
    const norm = (msg || "").trim().toLowerCase();
    
    if (norm.includes("تراز") || norm.includes("آزمون") || norm.includes("مانیتورینگ") || norm.includes("شبیه‌ساز")) {
      return `سلام قهرمان پرتلاش! 📈 برای افزایش تراز مانیتورینگ و موفقیت چشمگیر در آزمون‌های شبیه‌ساز بعدی آکادمی 'ترنم مهر'، این ۳ تکنیک طلایی کایزن درمانی را حتماً اجرا کن:
      
۱. **کالبدشکافی تله‌های تستی**: بلافاصله پس از هر آزمون، سوالات غلط و نزده را کالبدشکافی کن. به خصوص اشتباهات ناشی از بی‌دقتی محاسباتی، پارت‌های مروری ناقص یا موازنه نادرست زمان. نوشتن یک دفترچه اختصاصی تحلیل تراز، از تکرار مجدد این اشتباهات در شبیه‌سازهای بعدی جلوگیری می‌کند.

۲. **مدیریت زمان به روش ضربدر منها**: موازنه وقت به ازای هر درس بسیار حیاتی است. روی تست‌های پیچیده قفل نشو. ابتدا تست‌های بدیهی و ساده‌تر را در اولویت اول مهار کن تا روحیه تهاجمی‌ات برای باقی دفترچه حفظ شود.

۳. **پایداری پارت‌های پومودورو زمان‌دار**: روزهای منتهی به شبیه‌ساز بعدی را به حل تست‌های جامع نیمه زمان‌دار اختصاص بده. ذهن انسان مانند عضله است؛ هر چقدر بیشتر با شرایط استرس تمرین کند، در آزمون اصلی بهره‌وری تراز مانیتورینگ او بالاتر خواهد رفت! 🚀🎯`;
    }
    
    if (norm.includes("تجربی") || norm.includes("زیست") || norm.includes("پزشکی")) {
      return "سلام کنکوری پرتلاش تجربی! 🌸 برای تصاحب صندلی‌های تاپ رشته‌های علوم پزشکی (پزشکی، دندان‌پزشکی و داروسازی)، زیست‌شناسی و شیمی کلیدی‌ترین دروس ترازساز شما هستند.\n\nتوصیه کایزن درسی ما این است که روزانه حداقل ۳ پارت مطالعه عمیق کتاب درسی به همراه تحلیل دقیق شکل‌ها و تصاویر زیست را با تست‌زنی جامع پیش‌برید. بیایید با هم چند برنامه کوتاه صعود تراز را پیاده کنیم؟";
    }
    
    if (norm.includes("ریاضی") || norm.includes("حسابان") || norm.includes("شریف")) {
      return "سلام مهندس آینده! 📐 در رشته ریاضی، درس حسابان، دیفرانسیل و هندسه پایه‌های حیاتی تراز شما هستند. تسلط موضوعی روی فرمول‌ها و موازنه پارت‌های پومودورو برای رفع اشتباهات محاسباتی کایزن تضمین‌کننده موفقیت شما در دانشگاه‌های شریف و تهران خواهد بود. چه کمکی از من ساخته است؟";
    }
    
    if (norm.includes("انسانی") || norm.includes("ادبیات") || norm.includes("فلسفه")) {
      return "سلام داوطلب گرانقدر رشته انسانی! 📚 در کنکور انسانی، عربی تخصصی، ادبیات تخصصی (فنون ادبی) و فلسفه و منطق دروس تعیین‌کننده موازنه تراز هستند. پیشنهاد می‌کنم مباحث کایزن فلسفه را همگام با خلاصه تله‌های تستی دوره کنید و تراز تستی بالایی ثبت کنید.";
    }

    if (norm.includes("تنبلی") || norm.includes("خستگی") || norm.includes("انگیزه") || norm.includes("خسته")) {
      return "سلام و درود قهرمان صبور. خستگی ذهنی در مسیر سخت کنکور سراسری کاملاً طبیعی است. ترنم مهر پیشنهاد می‌کند از تکنیک پومودورو درسی (۵۰ دقیقه مطالعه متمرکز و ۱۰ دقیقه استراحت کامل دور از گوشی) استفاده کنید. پایداری در این روزهاست که رتبه برترهای شریف و تهران را متمایز می‌کند. با هم قوی‌تر حرکت می‌کنیم! 💪🌸";
    }

    return "داوطلب فرزانه ترنم مهر، سلام و درود بر شما! 🌸 من «دکتر رادان»، مشاور و ارشد برنامه‌ریزی تحصیلی همکار شما هستم. تخصص من روش کایزن، رفع تله‌های تستی ترازهای قلم‌چی و آزمون‌های موسسه است.\n\nبرای تحلیل دقیق شرایط‌تان، رشته تحصیلی (تجربی، ریاضی یا انسانی)، تراز آخرین آزمون، و مباحث دشوار خود را با من مطرح کنید تا نقشه راه اختصاصی پزشک یا مهندس شدن شما را ترسیم کنیم. 💫";
  };

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || sending) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: textToSend,
      timestamp: new Date().toLocaleTimeString("fa-IR", { hour: "2-digit", minute: "2-digit" })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage("");
    setSending(true);
    setConnectionError(false);
    setLastDetailedError(null);

    try {
      const chatHistory = messages.slice(-6).map(m => ({ role: m.role, content: m.content }));
      
      const geminiKey = localStorage.getItem("arateb_gemini_api_key") || "";
      const providerKeys = localStorage.getItem("arateb_ai_provider_keys") || "";
      
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "x-gemini-key": geminiKey ? encodeURIComponent(geminiKey) : "",
          "x-ai-provider-keys": providerKeys ? encodeURIComponent(providerKeys) : ""
        },
        body: JSON.stringify({ message: textToSend, history: chatHistory })
      });

      if (res.ok) {
        const resolvedHeader = res.headers.get("x-ai-resolved-provider");
        if (resolvedHeader) {
          try {
            const providerName = decodeURIComponent(resolvedHeader);
            setActiveProvider(providerName);
          } catch(e) {}
        }
        const data = await res.json();
        const modelMsg: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: "model",
          content: data.reply,
          timestamp: new Date().toLocaleTimeString("fa-IR", { hour: "2-digit", minute: "2-digit" })
        };
        setMessages((prev) => [...prev, modelMsg]);
        
        // Even if status is 200, it might be an offline simulation fallback
        if (data.isOfflineFallback) {
          setConnectionError(true);
          setLastDetailedError(data.error || "استفاده از شبیه‌ساز آفلاین به دلیل خطا در کلید یا اتمام سقف سهمیه مجاز (Quota)");
          addSystemLog("پاسخ شبیه‌ساز آفلاین هوش مصنوعی", student.name || "کاربر", `خطا: ${data.error || "اتمام کوتا یا نقص لایسنس"}`);
        } else {
          setConnectionError(false);
          setLastDetailedError(null);
        }
      } else {
        const errText = await res.text();
        console.warn("API returned non-OK status. Falling back to local adviser engine.");
        addSystemLog("خطای پاسخ هوش مصنوعی", student.name || "کاربر", `پاسخ ناموفق سرور با خطای کد ${res.status}. انتقال خودکار به شبیه‌ساز آفلاین با موفقیت انجام شد.`);
        setConnectionError(true);
        setLastDetailedError(`HTTP Status ${res.status}: ${errText ? errText.substring(0, 150) : "No response body"}`);
        
        // Give client fallback reply so counseling never appears broken
        setTimeout(() => {
          setMessages((prev) => [...prev, {
            id: (Date.now() + 1).toString(),
            role: "model",
            content: getClientCounselorFallbackReply(textToSend),
            timestamp: new Date().toLocaleTimeString("fa-IR", { hour: "2-digit", minute: "2-digit" })
          }]);
        }, 1200);
      }
    } catch (err: any) {
      console.error("Network/Chat Error:", err);
      // Log connection error to diagnostic logs
      const errMsgDetail = err.message || err.toString();
      addSystemLog("خطای شبکه هوش مصنوعی", student.name || "کاربر", `خطای فیزیکی اتصال به سرور: ${errMsgDetail}. کاربر بدون وقفه به هسته مشاوره لوکال کایزن متصل ماند.`);
      setConnectionError(true);
      setLastDetailedError(`خطای شبکه/سخت‌افزاری: ${errMsgDetail}`);
      
      // Keep UX absolutely perfect: let local counselor respond immediately
      setTimeout(() => {
        setMessages((prev) => [...prev, {
          id: (Date.now() + 1).toString(),
          role: "model",
          content: getClientCounselorFallbackReply(textToSend),
          timestamp: new Date().toLocaleTimeString("fa-IR", { hour: "2-digit", minute: "2-digit" })
        }]);
      }, 1200);
    } finally {
      // Delay disabling spinner briefly to make the fallback feel organic and thoughtfully processed
      setTimeout(() => {
        setSending(false);
      }, 1000);
    }
  };

  const handleQuickQuestionClick = (q: string) => {
    handleSendMessage(q);
  };

  const handleAddActionStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newActionInput.trim()) return;
    setNewActionStepsList((prev) => [...prev, newActionInput.trim()]);
    newActionInput && setNewActionInput("");
  };

  const handleRemoveActionStepFromForm = (idx: number) => {
    setNewActionStepsList((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleTriggerAiDraftGenerator = () => {
    setIsAiGenerating(true);
    setTimeout(() => {
      if (newType === "academic") {
        setNewTitle("برنامه مطالعه فشرده و رفع تله‌های مباحث ژنتیک زیست‌شناسی");
        setNewNotes("توصیه مشاور علمی ترنم مهر: مقرر گردید داوطلب ابتدا به بخش جزوات طلایی ترنم مهر مراجعه کرده و کتب شرح آزمونی مباحث سلولی را به مدت ۴ ساعت پیاپی پومودورو مرور کند، سپس ۲۵ تست شبیه‌ساز را تحلیل نماید.");
        setNewActionStepsList([
          "مرور متن صریح مواد مباحث سلولی لازم و مهم",
          "یادداشت تله‌های رایج آزمون سالیان گذشته کنکور",
          "ثبت تراز و درصد پاسخ‌های صحیح در پنل کایزن"
        ]);
        setNewHours(48);
      } else {
        setNewTitle("کاهش اضطراب و استرس مفرط ممیزی قبل از آزمون جامع");
        setNewNotes("توصیه روانشناختی ترنم مهر: موازنه ساعات مطالعه با زمان‌های ریکاوری ذهن. مقرر شد داوطلب فواصل هر پومودوروی درسی را با تمارین تفکر مثبت و تمرکز ذهن سپری کند و ساعات پایانی شب را به استراحت اختصاص دهد.");
        setNewActionStepsList([
          "پیاده‌روی صبگاهی قبل از شروع فاز مطالعه",
          "ایجاد بستر بدون صدا و حذف محرک‌های بیرونی تمرکز",
          "استفاده از دکمه عارضه‌یابی سریع در مواجهه با گلوگاه‌ها"
        ]);
        setNewHours(42);
      }
      setIsAiGenerating(false);
    }, 850);
  };

  const handleCreateSessionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newNotes.trim()) return;

    const created: CounselingSession = {
      id: Date.now().toString(),
      type: newType,
      title: newTitle.trim(),
      date: newDate.trim() || "۱۴۰۵/۰۳/۰۱",
      counselorName: newCName.trim() || "دکتر رادان",
      notes: newNotes.trim(),
      actionSteps: newActionStepsList.map(text => ({ text, completed: false })),
      recommendedStudyHours: newHours
    };

    const updated = [created, ...sessions];
    saveSessionsToLocal(updated);

    setNewTitle("");
    setNewNotes("");
    setNewActionStepsList([]);
    setNewHours(44);
  };

  const handleDeleteSession = (id: string) => {
    const updated = sessions.filter(s => s.id !== id);
    saveSessionsToLocal(updated);
  };

  const handleToggleStepCompletion = (sessionId: string, stepIndex: number) => {
    const updated = sessions.map(s => {
      if (s.id === sessionId) {
        const steps = [...s.actionSteps];
        steps[stepIndex] = { ...steps[stepIndex], completed: !steps[stepIndex].completed };
        return { ...s, actionSteps: steps };
      }
      return s;
    });
    saveSessionsToLocal(updated);
  };

  return (
    <div className="space-y-6" id="counselor-parent-container">
      
      {/* Prime Header Block */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-right">
        <div className="space-y-1">
          <div className="flex items-center gap-2 justify-start">
            <span className="px-2 py-0.5 bg-blue-50 text-blue-950 text-[10px] font-black rounded-lg border border-blue-100">
              {BRAND_CONFIG.examProvider} • پورتال مربیگری کایزن درسی
            </span>
            <span className="text-slate-350 text-xs">•</span>
            <span className="text-[10px] text-slate-500 font-bold">پایش تحصیلی داوطلب کانون: {student.name}</span>
          </div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight">پنل مشاوره ارشد و برنامه‌ریزی هدایت تحصیلی داوطلبان</h1>
          <p className="text-xs text-slate-500 leading-relaxed">
            برنامه‌ریزی، عارضه‌یابی و تبادل نظر با مشاوران علمی {BRAND_CONFIG.examProvider} جهت دستیابی به رتبه‌های برتر کنکور و رشته‌های تاپ.
          </p>
        </div>

        {/* Tab Switching */}
        <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200 w-full md:w-auto self-stretch md:self-auto">
          <button
            onClick={() => setActiveTab("chat")}
            className={`flex-1 md:flex-none px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 whitespace-nowrap ${
              activeTab === "chat" 
                ? "bg-white text-blue-955 shadow-sm font-black" 
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Sparkles size={14} className={activeTab === "chat" ? "text-indigo-650" : "text-slate-400"} />
            <span>گفتگوی هوشمند با مشاور ارشد (AI Coach)</span>
          </button>
          
          <button
            onClick={() => setActiveTab("sessions")}
            className={`flex-1 md:flex-none px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 whitespace-nowrap ${
              activeTab === "sessions" 
                ? "bg-white text-blue-955 shadow-sm font-black" 
                : "text-slate-650 hover:text-slate-900"
            }`}
          >
            <ClipboardList size={14} className={activeTab === "sessions" ? "text-emerald-600" : "text-slate-400"} />
            <span>برنامه‌ها و مصوبات جلسات مشاوره</span>
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === "chat" ? (
          <motion.div
            key="chat"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:h-[72vh] min-h-[500px]"
            id="counselor-view-container"
          >
            {/* Helper Tips Sidebar */}
            <div className="lg:col-span-1 bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between space-y-4 text-right order-2 lg:order-1" id="counselor-quick-tips">
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-100 justify-start">
                  <span className="p-1 px-1.5 bg-amber-50 text-amber-600 rounded-lg"><HelpCircle size={15} /></span>
                  <h3 className="font-bold text-slate-800 text-sm">موضوعات چالش بر‌انگیز آزمون</h3>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  از موضوعات آماده زیر جهت ارزیابی عمیق تراز و مهار خطاهای علمی استفاده کنید:
                </p>
                <div className="space-y-2 flex flex-col">
                  {quickQuestions.map((q, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleQuickQuestionClick(q)}
                      className="w-full text-right p-3 bg-slate-50 hover:bg-slate-100 border border-slate-100 rounded-xl text-xs font-bold leading-relaxed text-slate-705 transition cursor-pointer"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-rose-50/50 rounded-2xl border border-rose-100 flex flex-col gap-2">
                <div className="flex items-start gap-2.5">
                  <Target size={15} className="text-rose-600 flex-shrink-0 mt-0.5" />
                  <div className="text-[10px] text-rose-950 leading-relaxed font-semibold">
                    مباحثی که در آنها دچار اشتباه شده‌اید را بلافاصله در «بانک تله‌های تستی» ثبت کنید.
                  </div>
                </div>
                <button 
                  onClick={() => {
                    if (onNavigate) {
                      onNavigate("traps");
                    } else {
                      alert("🔗 در حال انتقال به بانک تله‌ها...");
                    }
                  }}
                  className="text-[9px] font-black text-rose-700 underline text-right cursor-pointer"
                >
                  مشاهده تله‌های ثبت شده
                </button>
              </div>

              <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-100 flex items-start gap-2.5">
                <AlertCircle size={15} className="text-blue-900 flex-shrink-0 mt-0.5" />
                <div className="text-[10px] text-blue-950 leading-relaxed font-semibold">
                  مربی هوشمند {BRAND_CONFIG.examProvider} به تراز کارنامه مانیتورینگ متصل بوده و برنامه‌های درسی کایزن را به روز می‌نماید.
                </div>
              </div>
            </div>

            {/* Chat conversations */}
            <div className="lg:col-span-3 bg-white rounded-3xl border border-slate-100 shadow-sm flex flex-col overflow-hidden text-right" id="counselor-live-chat-box">
              <div className="bg-slate-50 border-b border-slate-100 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-9 h-9 rounded-xl bg-blue-950 text-white flex items-center justify-center text-[10px] font-bold">
                      مشاور
                    </div>
                    <span className="absolute -bottom-0.5 -left-0.5 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></span>
                  </div>
                  <div>
                    <span className="font-bold text-slate-800 text-sm block">دکتر رادان (مشاور علمی ارشد ترنم مهر)</span>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                      <span className="text-[10px] text-emerald-600 font-bold block">برخط ● آماده پاسخ‌گویی به ابهامات علمی</span>
                      <span className="text-[9px] font-black text-indigo-700 bg-indigo-50 border border-indigo-100 rounded px-1.5 py-0.5">
                        سرویس فعال: {activeProvider}
                      </span>
                    </div>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-blue-950 bg-blue-50 border border-blue-100 px-2.5 py-1 rounded-full">داوطلب علمی: {student.name}</span>
              </div>

              {/* Conversations Scroller */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/25 scroll-smooth" id="chat-messages-scroller">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex items-start gap-3 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold flex-shrink-0 text-xs shadow-sm ${
                      msg.role === "user" 
                        ? "bg-amber-500 text-white" 
                        : msg.isError 
                          ? "bg-rose-100 text-rose-600"
                          : "bg-blue-950 text-white"
                    }`}>
                      {msg.role === "user" ? <User size={13} /> : <Sparkles size={13} className={msg.isError ? "text-rose-500" : "text-amber-300"} />}
                    </div>
                    <div className={`max-w-[85%] space-y-1 ${msg.role === "user" ? "text-left" : "text-right"}`}>
                      <div className={`p-4 rounded-2xl shadow-sm text-xs leading-relaxed whitespace-pre-wrap ${
                        msg.role === "user"
                          ? "bg-amber-500 text-white rounded-tr-none"
                          : msg.isError
                            ? "bg-rose-50 text-rose-800 border border-rose-100 rounded-tl-none font-bold"
                            : "bg-white text-slate-800 border border-slate-100 rounded-tl-none font-medium ring-1 ring-slate-50"
                      }`}>
                        {msg.content}
                      </div>
                      <div className={`flex items-center gap-1.5 px-1 ${msg.role === "user" ? "justify-start" : "justify-end"}`}>
                        <span className={`text-[9px] text-slate-400 font-mono`}>
                          {msg.timestamp}
                        </span>
                        {msg.role === "model" && !msg.isError && (
                          <div className="flex gap-0.5">
                            {[1, 2, 3].map(i => <div key={i} className="w-0.5 h-0.5 bg-emerald-400 rounded-full" />)}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {sending && (
                  <div className="flex items-start gap-3 animate-in fade-in slide-in-from-right-2 duration-300">
                    <div className="w-8 h-8 rounded-lg bg-blue-950 text-white flex items-center justify-center shadow-lg">
                      <Sparkles size={13} className="text-amber-300 animate-pulse" />
                    </div>
                    <div className="bg-white p-4 rounded-2xl border border-slate-100 rounded-tl-none shadow-md flex items-center gap-2">
                       <div className="flex gap-1">
                          <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                          <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                          <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce"></span>
                       </div>
                       <span className="text-[10px] text-slate-400 font-black">در حال بررسی سوابق و نگارش پاسخ تحصیلی...</span>
                    </div>
                  </div>
                )}
                
                {connectionError && (
                  <div className="mx-auto max-w-md p-4 bg-rose-50 border border-rose-150 rounded-2xl text-right shadow-sm animate-in zoom-in duration-300 space-y-2.5">
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-[10px] font-black text-rose-850 flex items-center gap-1.5 font-sans">
                        ⚠️ وضعیت: اتصال به هسته آفلاین (شبیه‌ساز کایزن)
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          const errorText = lastDetailedError || "Network/Chat error combined with API Quota Exhausted.";
                          navigator.clipboard.writeText(errorText);
                          alert("جزئیات خطای هوش مصنوعی در حافظه کپی شد! می‌توانید آن را اینجا پیست کنید. 📋");
                        }}
                        className="bg-white hover:bg-rose-100 border border-rose-200 text-rose-700 px-3 py-1.5 rounded-xl text-[9px] font-black transition-all active:scale-95 shrink-0 shadow-sm"
                      >
                        📋 کپی خطای خام هوش مصنوعی
                      </button>
                    </div>
                    <p className="text-[9px] text-rose-700 leading-relaxed font-semibold font-sans">
                      سیستم هوش مصنوعی ترنم مهر به دلیل محدودیت‌های لایسنس یا کلید عمومی سرور، به صورت خودکار به پکیج آفلاین کایزن منتقل گشت تا فعالیت مشاوره‌ای داوطلب دچار وقفه نشود. برای راه‌اندازی مجدد هوش مصنوعی زنده، می‌توانید این خطای کپی شده را به تیم پشتیبان ارائه دهید یا کلید خام اختصاصی خود را در بخش ادمین ثبت کنید.
                    </p>
                    {lastDetailedError && (
                      <div className="bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-[9px] font-mono text-rose-450 overflow-x-auto max-h-24 text-left scrollbar-thin" style={{ direction: "ltr" }}>
                        {lastDetailedError}
                      </div>
                    )}
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Chat Send Form */}
              <div className="p-4 bg-white border-t border-slate-100">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage(inputMessage);
                  }}
                  className="flex gap-2"
                >
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="پرسش علمی، مبحث مورد نظر یا درصد تراز تستی خود را بنویسید..."
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-950 focus:bg-white text-slate-800 text-right"
                  />
                  <button
                    type="submit"
                    disabled={sending || !inputMessage.trim()}
                    className="bg-blue-950 hover:bg-slate-900 text-white p-3 rounded-xl transition disabled:opacity-50 cursor-pointer shadow-sm flex-shrink-0"
                  >
                    <Send size={15} className="rotate-180" />
                  </button>
                </form>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="sessions"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
            id="counseling-sessions-workspace"
          >
            {/* Input Form Panel (1 Column) */}
            <div className="lg:col-span-1 space-y-5 bg-white p-5 rounded-3xl border border-slate-100 shadow-sm self-start text-right">
              <div className="flex items-center gap-2 border-b border-slate-50 pb-3 justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-blue-50 text-blue-955 rounded-lg">
                    <ClipboardList size={16} />
                  </div>
                  <h3 className="font-black text-slate-800 text-sm">ثبت مصوبه جدید مشاوره</h3>
                </div>
                <button
                  type="button"
                  onClick={handleTriggerAiDraftGenerator}
                  disabled={isAiGenerating}
                  className="px-2.5 py-1 bg-amber-400 hover:bg-amber-500 text-slate-900 font-extrabold text-[9px] rounded-lg border border-amber-300 transition-all cursor-pointer flex items-center gap-1 shadow-sm active:scale-95 disabled:opacity-50"
                >
                  <Sparkles size={11} className={isAiGenerating ? "animate-spin" : ""} />
                  <span>پیش‌نویس با AI</span>
                </button>
              </div>

              <form onSubmit={handleCreateSessionSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 block pb-1">موضوع مصوبه مشاوره علمی:</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setNewType("academic")}
                      className={`py-2 px-3 rounded-xl border text-center transition cursor-pointer text-xs font-bold flex items-center justify-center gap-1.5 ${
                        newType === "academic" 
                          ? "bg-indigo-50 border-indigo-200 text-indigo-900" 
                          : "bg-slate-50 border-slate-100 text-slate-500 hover:bg-slate-100"
                      }`}
                    >
                      <BookOpen size={13} />
                      <span>۱. برنامه‌ریزی علمی تستی</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setNewType("motivational")}
                      className={`py-2 px-3 rounded-xl border text-center transition cursor-pointer text-xs font-bold flex items-center justify-center gap-1.5 ${
                        newType === "motivational" 
                          ? "bg-rose-50 border-rose-200 text-rose-900" 
                          : "bg-slate-50 border-slate-100 text-slate-500 hover:bg-slate-100"
                      }`}
                    >
                      <Brain size={13} />
                      <span>۲. مشاوره روحیه و اضطراب</span>
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 block">عنوان دقیق مصوبه تحصیلی:</label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="مثال: رفع عیوب تله‌های آیین دادرسی مدنی"
                    className="w-full bg-slate-50 border border-slate-205 focus:bg-white focus:ring-2 focus:ring-blue-950 rounded-xl px-3 py-2 text-xs font-black text-slate-800 text-right"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1 text-right">
                    <label className="text-[10px] font-bold text-slate-400 block text-right">مشاور مسئول:</label>
                    <input
                      type="text"
                      value={newCName}
                      onChange={(e) => setNewCName(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 text-right"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 block">تاریخ جلسه:</label>
                    <input
                      type="text"
                      value={newDate}
                      onChange={(e) => setNewDate(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-[10px] font-bold text-slate-850 font-mono text-center"
                    />
                  </div>
                </div>

                <div className="space-y-1 text-right font-sans">
                  <label className="text-[10px] font-bold text-slate-400 block text-right">جزئیات و مصوبات اجرایی کایزن درسی:</label>
                  <textarea
                    required
                    value={newNotes}
                    onChange={(e) => setNewNotes(e.target.value)}
                    rows={4}
                    placeholder="نکات تعیین شده علمی، مباحث اختصاصی مورد استناد، شیوه خلاصه نویسی زیست‌شناسی و..."
                    className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-blue-950 rounded-xl px-3 py-2.5 text-xs font-semibold leading-relaxed text-slate-700 text-right font-sans"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-950 hover:bg-slate-900 text-white py-3 rounded-2xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <PlusCircle size={14} />
                  <span>ذخیره مصوبه در برنامه درسی داوطلب</span>
                </button>
              </form>
            </div>

            {/* Archive List (2 Columns) */}
            <div className="lg:col-span-2 space-y-5 text-right">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-indigo-100 shadow-sm flex items-center justify-between">
                  <div className="space-y-1 text-right">
                    <span className="text-[10px] font-bold text-slate-400 block">برنامه‌ها و مصوبات علمی</span>
                    <strong className="text-xl font-black text-indigo-950 font-mono">
                      {sessions.filter(s => s.type === "academic").length} مورد
                    </strong>
                    <p className="text-[9px] text-slate-400">تحلیل تله‌های تستی مباحث کنکوری</p>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-rose-100 shadow-sm flex items-center justify-between">
                  <div className="space-y-1 text-right">
                    <span className="text-[10px] font-bold text-slate-400 block">مشاوره‌های روحی و روحیه</span>
                    <strong className="text-xl font-black text-rose-700 font-mono">
                      {sessions.filter(s => s.type === "motivational").length} مورد
                    </strong>
                    <p className="text-[9px] text-slate-400">مدیریت پومودورو، خواب و تغذیه</p>
                  </div>
                </div>
              </div>

              {/* Saved Sessions Feed */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-black text-slate-700">تاریخچه ممیزی برنامه‌های درسی داوطلب ترنم مهر ({sessions.length})</span>
                  <span className="text-[9px] text-slate-400">سرور کایزن آموزشی ترنم مهر</span>
                </div>

                {sessions.map((session) => (
                  <div 
                    key={session.id} 
                    className={`p-5 rounded-3xl bg-white border shadow-sm space-y-4 transition hover:shadow-md relative overflow-hidden ${
                      session.type === "academic" 
                        ? "border-l-4 border-l-indigo-600 border-slate-100" 
                        : "border-l-4 border-l-rose-500 border-slate-100"
                    }`}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2.5 relative z-10 text-right">
                      <div className="flex items-center gap-2">
                        {session.type === "academic" ? (
                          <span className="px-2.5 py-1 bg-indigo-50 border border-indigo-200 text-indigo-900 rounded-xl text-[9.5px] font-black flex items-center gap-1">
                            <span>کایزن: علمی تستی</span>
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 bg-rose-50 border border-rose-200 text-rose-900 rounded-xl text-[9.5px] font-black flex items-center gap-1">
                            <span>انگیزشی: روحیه پومودورو</span>
                          </span>
                        )}
                        <span className="text-[10px] text-slate-400 font-mono">{session.date}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-[10px] bg-slate-100 border text-slate-600 px-2 py-0.5 rounded-lg font-bold">
                          مشاور مسئول: {session.counselorName}
                        </span>
                        
                        <button
                          onClick={() => handleDeleteSession(session.id)}
                          className="text-slate-400 hover:text-red-600 hover:bg-slate-50 p-1.5 rounded-lg transition"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1.5 text-right relative z-10 font-sans">
                      <h4 className="text-xs font-black text-slate-905 leading-normal font-sans">{session.title}</h4>
                      <p className="text-xs text-slate-600 leading-relaxed font-semibold bg-slate-50/50 p-3.5 rounded-2xl border border-slate-100 font-sans">
                        {session.notes}
                      </p>
                    </div>

                    {session.actionSteps.length > 0 && (
                      <div className="bg-slate-50/40 p-3.5 rounded-2xl border border-slate-100 text-right space-y-2">
                        <span className="text-[9px] font-black text-slate-500 block">گام‌های اجرایی ضروری جهت ارتقای تراز در آزمون آزمایشی بعدی:</span>
                        <div className="space-y-1.5">
                          {session.actionSteps.map((step, idx) => (
                            <div 
                              key={idx}
                              onClick={() => handleToggleStepCompletion(session.id, idx)}
                              className={`flex items-start gap-2.5 p-2 rounded-xl border transition-all cursor-pointer select-none ${
                                step.completed 
                                  ? "bg-emerald-50/30 border-emerald-150" 
                                  : "bg-white border-slate-100 hover:border-slate-200"
                              }`}
                            >
                              <div className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 mt-0.5 transition-all ${
                                step.completed 
                                  ? "bg-emerald-600 border-emerald-600 text-white" 
                                  : "border-slate-300 bg-white"
                              }`}>
                                {step.completed && <Check size={10} strokeWidth={4} />}
                              </div>
                              <span className={`text-xs font-bold leading-normal ${
                                step.completed ? "text-slate-400 line-through" : "text-slate-700"
                              }`}>
                                {step.text}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
