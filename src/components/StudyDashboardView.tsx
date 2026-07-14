import React, { useState, useEffect, useRef } from "react";
import { Student } from "../types";
import { 
  BookOpen, Target, Volume2, VolumeX, BarChart3, Clock, Brain, Compass, 
  Sparkles, CheckCircle2, ChevronDown, Award, Play, Pause, RotateCcw, 
  Flame, Search, Filter, Check, HelpCircle, AlertTriangle
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface StudyDashboardProps {
  student: Student;
  onNavigate: (target: string) => void;
}

export default function StudyDashboardView({ student }: StudyDashboardProps) {
  const [activeAmbiance, setActiveAmbiance] = useState<string | null>(null);
  const [volume, setVolume] = useState<number>(0.4);
  const [selectedField, setSelectedField] = useState<"experimental" | "mathematics">("experimental");
  const [activeTab, setActiveTab] = useState<"stats" | "psychology">("stats");
  const [expandedTip, setExpandedTip] = useState<number | null>(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [bookletFilter, setBookletFilter] = useState<string>("all");

  // --- Pomodoro Timer States ---
  const [timerMode, setTimerMode] = useState<"focus" | "break">("focus");
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes default
  const [timerRunning, setTimerRunning] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Web Audio API refs for local ambient noise synthesis
  const audioCtxRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const oscillatorsRef = useRef<any[]>([]);
  const noiseNodeRef = useRef<any>(null);

  // Stop all synthesized audio
  const stopAllAudio = () => {
    oscillatorsRef.current.forEach(osc => {
      try { osc.stop(); } catch(e){}
    });
    oscillatorsRef.current = [];

    if (noiseNodeRef.current) {
      try { noiseNodeRef.current.stop(); } catch(e){}
      noiseNodeRef.current = null;
    }
  };

  // Web Audio API synthesizer for offline ambient sound environments
  const playAmbiance = (type: string) => {
    stopAllAudio();

    if (activeAmbiance === type) {
      setActiveAmbiance(null);
      return;
    }

    setActiveAmbiance(type);

    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(volume * 0.3, ctx.currentTime);
      masterGain.connect(ctx.destination);
      gainNodeRef.current = masterGain;

      if (type === "alpha") {
        // Binaural beat for deep focus (Alpha wave ~10Hz difference)
        const oscL = ctx.createOscillator();
        const oscR = ctx.createOscillator();
        const pannerL = ctx.createStereoPanner ? ctx.createStereoPanner() : null;
        const pannerR = ctx.createStereoPanner ? ctx.createStereoPanner() : null;

        oscL.type = "sine";
        oscL.frequency.setValueAtTime(200, ctx.currentTime); // 200 Hz
        
        oscR.type = "sine";
        oscR.frequency.setValueAtTime(210, ctx.currentTime); // 210 Hz (10Hz difference)

        if (pannerL && pannerR) {
          pannerL.pan.setValueAtTime(-1, ctx.currentTime);
          pannerR.pan.setValueAtTime(1, ctx.currentTime);
          oscL.connect(pannerL).connect(masterGain);
          oscR.connect(pannerR).connect(masterGain);
        } else {
          oscL.connect(masterGain);
          oscR.connect(masterGain);
        }

        oscL.start();
        oscR.start();
        oscillatorsRef.current = [oscL, oscR];

        // Add a soft modulating LFO for cosmetic sweeping
        const lfo = ctx.createOscillator();
        const lfoGain = ctx.createGain();
        lfo.frequency.setValueAtTime(0.2, ctx.currentTime); // 0.2 Hz sweeping
        lfoGain.gain.setValueAtTime(15, ctx.currentTime);
        lfo.connect(lfoGain).connect(oscL.frequency);
        lfo.start();
        oscillatorsRef.current.push(lfo);

      } else if (type === "rain") {
        // Synthesizing a soothing rustle of rain / pink noise
        const bufferSize = ctx.sampleRate * 2;
        const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        
        let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          // Pink noise filter approximation
          b0 = 0.99886 * b0 + white * 0.0555179;
          b1 = 0.99332 * b1 + white * 0.0750759;
          b2 = 0.96900 * b2 + white * 0.1538520;
          b3 = 0.86650 * b3 + white * 0.3104856;
          b4 = 0.55000 * b4 + white * 0.5329522;
          b5 = -0.7616 * b5 - white * 0.0168980;
          output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
          output[i] *= 0.11; // rescue master volume
          b6 = white * 0.115926;
        }

        const whiteNoise = ctx.createBufferSource();
        whiteNoise.buffer = noiseBuffer;
        whiteNoise.loop = true;

        // Low-pass filter for thunder/deep rain feeling
        const filter = ctx.createBiquadFilter();
        filter.type = "lowpass";
        filter.frequency.setValueAtTime(800, ctx.currentTime);

        whiteNoise.connect(filter).connect(masterGain);
        whiteNoise.start();
        noiseNodeRef.current = whiteNoise;

      } else if (type === "cosmic") {
        // Atmospheric deep meditative space pad
        const baseFreqs = [110, 165, 220, 330];
        baseFreqs.forEach(freq => {
          const osc = ctx.createOscillator();
          const filter = ctx.createBiquadFilter();
          const gain = ctx.createGain();

          osc.type = "triangle";
          osc.frequency.setValueAtTime(freq, ctx.currentTime);

          filter.type = "lowpass";
          filter.frequency.setValueAtTime(400, ctx.currentTime);
          filter.Q.setValueAtTime(3, ctx.currentTime);

          // Add subtle filter sweep with independent LFOs
          const filterLfo = ctx.createOscillator();
          const filterLfoGain = ctx.createGain();
          filterLfo.frequency.setValueAtTime(0.1 + Math.random() * 0.15, ctx.currentTime);
          filterLfoGain.gain.setValueAtTime(200, ctx.currentTime);
          filterLfo.connect(filterLfoGain).connect(filter.frequency);
          
          gain.gain.setValueAtTime(0.15, ctx.currentTime);

          osc.connect(filter).connect(gain).connect(masterGain);
          
          osc.start();
          filterLfo.start();
          
          oscillatorsRef.current.push(osc, filterLfo);
        });
      }
    } catch (e) {
      console.error("Failed to play synthesized ambiance:", e);
    }
  };

  // Sync volume change
  useEffect(() => {
    if (gainNodeRef.current && audioCtxRef.current) {
      gainNodeRef.current.gain.setValueAtTime(volume * 0.3, audioCtxRef.current.currentTime);
    }
  }, [volume]);

  // Pomodoro Logic
  useEffect(() => {
    if (timerRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            // Beep sound finished
            playCompletionBeep();
            // Switch mode
            const nextMode = timerMode === "focus" ? "break" : "focus";
            setTimerMode(nextMode);
            return nextMode === "focus" ? 25 * 60 : 5 * 60;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [timerRunning, timerMode]);

  const playCompletionBeep = () => {
    try {
      const ctx = audioCtxRef.current || new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = "sine";
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);
      osc.start();
      osc.stop(ctx.currentTime + 0.85);
    } catch (e) {}
  };

  const toggleTimer = () => setTimerRunning(!timerRunning);
  const resetTimer = () => {
    setTimerRunning(false);
    setTimeLeft(timerMode === "focus" ? 25 * 60 : 5 * 60);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopAllAudio();
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Comprehensive Konkur Stats
  const experimentalStats = [
    { id: "bio", subject: "زیست‌شناسی", questions: 45, timeMin: 45, avgSeconds: 60, difficulty: "بسیار بالا", trapRate: "۹۵٪", book: "دفترچه شماره ۲", color: "border-emerald-500 text-emerald-700 bg-emerald-50/50" },
    { id: "chem", subject: "شیمی", questions: 35, timeMin: 35, avgSeconds: 60, difficulty: "بالا (استوکیومتری)", trapRate: "۹۰٪", book: "دفترچه شماره ۲", color: "border-blue-500 text-blue-700 bg-blue-50/50" },
    { id: "math_exp", subject: "ریاضیات تجربی", questions: 30, timeMin: 47, avgSeconds: 94, difficulty: "بسیار بالا", trapRate: "۸۵٪", book: "دفترچه شماره ۱", color: "border-indigo-500 text-indigo-700 bg-indigo-50/50" },
    { id: "phys_exp", subject: "فیزیک تجربی", questions: 30, timeMin: 37, avgSeconds: 74, difficulty: "متوسط به بالا", trapRate: "۷۵٪", book: "دفترچه شماره ۱", color: "border-purple-500 text-purple-700 bg-purple-50/50" },
    { id: "geo", subject: "زمین‌شناسی", questions: 15, timeMin: 15, avgSeconds: 60, difficulty: "متوسط (حفظی)", trapRate: "۳۰٪", book: "دفترچه شماره ۳", color: "border-amber-500 text-amber-700 bg-amber-50/50" },
  ];

  const mathematicsStats = [
    { id: "calc", subject: "حسابان و ریاضیات پایه", questions: 40, timeMin: 50, avgSeconds: 75, difficulty: "بسیار بالا", trapRate: "۹۲٪", book: "دفترچه شماره ۱", color: "border-indigo-500 text-indigo-700 bg-indigo-50/50" },
    { id: "geom", subject: "هندسه و ریاضیات گسسته", questions: 40, timeMin: 60, avgSeconds: 90, difficulty: "بسیار بالا", trapRate: "۸۸٪", book: "دفترچه شماره ۱", color: "border-emerald-500 text-emerald-700 bg-emerald-50/50" },
    { id: "phys_math", subject: "فیزیک ریاضی", questions: 35, timeMin: 45, avgSeconds: 77, difficulty: "بالا", trapRate: "۸۰٪", book: "دفترچه شماره ۲", color: "border-purple-500 text-purple-700 bg-purple-50/50" },
    { id: "chem_math", subject: "شیمی ریاضی", questions: 30, timeMin: 30, avgSeconds: 60, difficulty: "متوسط به بالا", trapRate: "۷۰٪", book: "دفترچه شماره ۲", color: "border-blue-500 text-blue-700 bg-blue-50/50" },
  ];

  const psychoTips = [
    {
      title: "🧠 مدیریت استرس با تنفس عمیق",
      content: "استرس حین آزمون باعث کاهش تمرکز و قفل شدن ذهن می‌شود. قبل از شروع هر درس، ۳ نفس عمیق بکشید. تمرین مکرر این کار در خانه به شما کمک می‌کند تا در جلسه آزمون آرامش خود را حفظ کنید."
    },
    {
      title: "🎯 مدیریت زمان با تکنیک ضربدر و منها",
      content: "تمام زمان یک درس را تا ثانیه آخر مصرف نکنید. سوالات را به سه دسته تقسیم کنید: آسان (حل بلافاصله)، وقت‌گیر (علامت ضربدر) و خیلی سخت (علامت منها). دور اول فقط به سوالات آسان پاسخ دهید."
    },
    {
      title: "⚖️ دقت در کلمات کلیدی سوالات",
      content: "طراحان سوالات معمولاً از کلماتی مانند 'همه'، 'هیچ‌کدام'، 'همواره' و 'به‌جز' برای به اشتباه انداختن شما استفاده می‌کنند. همیشه تمام گزینه‌ها را با دقت بخوانید، حتی اگر فکر می‌کنید گزینه اول درست است."
    },
    {
      title: "🌌 شبیه‌سازی شرایط واقعی آزمون",
      content: "همیشه در سکوت مطلق مطالعه نکنید! در جلسه کنکور، صداهای مختلفی مانند صدای سرفه، ورق زدن کاغذ و حرکت مراقب وجود دارد. سعی کنید گاهی در محیط‌های کمی شلوغ‌تر تست بزنید تا به این شرایط عادت کنید."
    }
  ];

  const activeStats = selectedField === "experimental" ? experimentalStats : mathematicsStats;

  // Filter & Search subjects
  const filteredStats = activeStats.filter(stat => {
    const matchesSearch = stat.subject.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          stat.difficulty.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesBooklet = bookletFilter === "all" || stat.book.includes(bookletFilter);
    return matchesSearch && matchesBooklet;
  });

  return (
    <div className="p-4 md:p-8 space-y-8 animate-in fade-in duration-500 bg-slate-50 min-h-screen text-right" dir="rtl">
      
      {/* Pristine Modern Title Panel */}
      <div className="bg-white border border-slate-200/80 p-6 md:p-8 rounded-3xl shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6" id="study-header-card">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="bg-indigo-50 border border-indigo-150 text-indigo-700 text-[10px] font-black px-3 py-1 rounded-full flex items-center gap-1">
              <Sparkles size={11} className="text-indigo-600" />
              <span>پرتال اختصاصی داوطلبان</span>
            </span>
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <BookOpen className="text-indigo-600" size={30} />
            میز مطالعه و مربیگری
          </h2>
          <p className="text-xs md:text-sm text-slate-500 font-bold max-w-3xl leading-relaxed">
            ابزارهای برنامه‌ریزی، زمان‌سنج مطالعه و نکات مشاوره‌ای برای پیشرفت پیوسته شما.
          </p>
        </div>
      </div>

      {/* Grid: 1. Sleek Pomodoro & Audio Focus Dock (Left) | 2. Target Goal Dashboard (Right) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-stretch">
        
        {/* Sleek Pomodoro & Audio Focus Dock */}
        <div className="xl:col-span-8 bg-white border border-slate-200/80 p-6 rounded-3xl shadow-xs flex flex-col justify-between gap-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 divide-y md:divide-y-0 md:divide-x md:divide-x-reverse divide-slate-100">
            
            {/* Focus Audio Player Section */}
            <div className="space-y-4 pb-4 md:pb-0">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg">
                  <Volume2 size={16} />
                </div>
                <div>
                  <h3 className="text-xs font-black text-slate-900">صداهای پس‌زمینه تمرکز</h3>
                  <p className="text-[10px] text-slate-400 font-bold">پخش صداهای آرام‌بخش برای افزایش تمرکز</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <button 
                  onClick={() => playAmbiance("alpha")}
                  className={`p-3 rounded-2xl text-[10px] font-black flex flex-col items-center gap-2 transition-all cursor-pointer ${
                    activeAmbiance === "alpha" 
                      ? 'bg-slate-900 text-white shadow-md' 
                      : 'bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-750'
                  }`}
                >
                  <Brain size={16} className={activeAmbiance === "alpha" ? "text-indigo-400" : "text-indigo-600"} />
                  امواج آلفا
                </button>
                <button 
                  onClick={() => playAmbiance("rain")}
                  className={`p-3 rounded-2xl text-[10px] font-black flex flex-col items-center gap-2 transition-all cursor-pointer ${
                    activeAmbiance === "rain" 
                      ? 'bg-slate-900 text-white shadow-md' 
                      : 'bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-750'
                  }`}
                >
                  <Sparkles size={16} className={activeAmbiance === "rain" ? "text-amber-400" : "text-amber-600"} />
                  صدای باران
                </button>
                <button 
                  onClick={() => playAmbiance("cosmic")}
                  className={`p-3 rounded-2xl text-[10px] font-black flex flex-col items-center gap-2 transition-all cursor-pointer ${
                    activeAmbiance === "cosmic" 
                      ? 'bg-slate-900 text-white shadow-md' 
                      : 'bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-750'
                  }`}
                >
                  <VolumeX size={16} className={activeAmbiance === "cosmic" ? "text-emerald-400" : "text-emerald-600"} />
                  صدای محیط
                </button>
              </div>

              {/* Volume Slider */}
              <div className="space-y-1 bg-slate-50 p-3 rounded-xl border border-slate-150">
                <div className="flex justify-between text-[9.5px] font-black text-slate-500">
                  <span>بلندی صدا</span>
                  <span className="text-slate-800">{Math.round(volume * 100)}٪</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="1" 
                  step="0.05" 
                  value={volume} 
                  onChange={(e) => setVolume(parseFloat(e.target.value))}
                  className="w-full accent-slate-900 h-1 bg-slate-200 rounded-lg cursor-pointer" 
                />
              </div>
            </div>

            {/* Pomodoro Timer Section */}
            <div className="space-y-4 pt-4 md:pt-0 md:pr-6 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-rose-50 text-rose-600 rounded-lg">
                    <Clock size={16} />
                  </div>
                  <div>
                    <h3 className="text-xs font-black text-slate-900">زمان‌سنج مطالعه (پومودورو)</h3>
                    <p className="text-[10px] text-slate-400 font-bold">۲۵ دقیقه مطالعه و ۵ دقیقه استراحت</p>
                  </div>
                </div>

                <div className="flex gap-1">
                  <span className={`text-[9px] px-2 py-0.5 rounded-full font-black ${
                    timerMode === "focus" ? "bg-rose-50 border border-rose-100 text-rose-700" : "bg-emerald-50 border border-emerald-100 text-emerald-700"
                  }`}>
                    {timerMode === "focus" ? "زمان مطالعه" : "زمان استراحت"}
                  </span>
                </div>
              </div>

              {/* Timer UI Display */}
              <div className="flex items-center justify-center gap-4 bg-slate-50 border border-slate-150 rounded-2xl p-4">
                <div className="text-3xl font-black text-slate-900 font-mono tracking-wider">
                  {formatTime(timeLeft)}
                </div>

                <div className="flex items-center gap-1">
                  <button 
                    onClick={toggleTimer}
                    className={`p-2 rounded-xl transition cursor-pointer ${
                      timerRunning ? "bg-amber-100 text-amber-900 hover:bg-amber-200" : "bg-slate-900 text-white hover:bg-slate-850"
                    }`}
                  >
                    {timerRunning ? <Pause size={14} /> : <Play size={14} />}
                  </button>
                  <button 
                    onClick={resetTimer}
                    className="p-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl transition cursor-pointer"
                  >
                    <RotateCcw size={14} />
                  </button>
                </div>
              </div>

              <p className="text-[10px] text-slate-500 font-semibold leading-relaxed text-center">
                از این زمان‌سنج برای مدیریت بهتر زمان مطالعه و استراحت خود استفاده کنید.
              </p>
            </div>

          </div>
        </div>

        {/* Target Goal Dashboard */}
        <div className="xl:col-span-4 bg-gradient-to-br from-slate-900 via-slate-950 to-indigo-950 text-white p-6 rounded-3xl shadow-sm border border-slate-850 flex flex-col justify-between gap-5 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
          
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-2.5 py-1 rounded-full border border-indigo-500/30 font-black">خلاصه آزمون</span>
              <Target size={16} className="text-amber-400" />
            </div>
            <h3 className="text-xs font-black text-amber-400">زمان‌بندی کلی کنکور</h3>
          </div>

          <div className="space-y-3.5 divide-y divide-white/5">
            <div className="flex justify-between items-center text-[11px] pt-1">
              <span className="opacity-70">زمان کل آزمون:</span>
              <span className="font-black text-white">
                {selectedField === "experimental" ? "۱۸۰ دقیقه" : "۱۸۵ دقیقه"}
              </span>
            </div>
            <div className="flex justify-between items-center text-[11px] pt-2">
              <span className="opacity-70">تعداد سوالات:</span>
              <span className="font-black text-white">
                {selectedField === "experimental" ? "۱۵۵ تست" : "۱۴۵ تست"}
              </span>
            </div>
            <div className="flex justify-between items-center text-[11px] pt-2">
              <span className="opacity-70">میانگین زمان هر سوال:</span>
              <span className="font-black text-amber-300">حدود ۶۸ ثانیه</span>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 p-3 rounded-xl space-y-2">
            <div className="flex justify-between text-[10px] font-black text-indigo-300">
              <span>میزان آمادگی شما</span>
              <span>۷۲٪ (خوب)</span>
            </div>
            <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
              <div className="bg-emerald-400 h-full rounded-full" style={{ width: "72%" }} />
            </div>
          </div>
        </div>

      </div>

      {/* Main Tabs Navigation */}
      <div className="flex gap-2 border-b border-slate-200 pb-px">
        <button
          onClick={() => setActiveTab("stats")}
          className={`pb-3 px-5 text-xs font-black border-b-2 transition-all cursor-pointer ${
            activeTab === "stats" 
              ? 'border-indigo-600 text-indigo-700 font-extrabold' 
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          📋 زمان‌بندی و بودجه‌بندی دروس
        </button>
        <button
          onClick={() => setActiveTab("psychology")}
          className={`pb-3 px-5 text-xs font-black border-b-2 transition-all cursor-pointer ${
            activeTab === "psychology" 
              ? 'border-indigo-600 text-indigo-700 font-extrabold' 
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          🧠 نکات مشاوره‌ای و کنترل استرس
        </button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === "stats" && (
          <motion.div 
            key="stats"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {/* Field Toggle Button & Search Row */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200">
              
              <div className="flex items-center gap-3">
                <span className="text-xs font-black text-slate-600 shrink-0">رشته تحصیلی خود را انتخاب کنید:</span>
                <div className="bg-slate-100 p-1 rounded-xl border border-slate-200 inline-flex">
                  <button
                    onClick={() => setSelectedField("experimental")}
                    className={`px-4 py-1.5 rounded-lg text-xs font-black transition cursor-pointer ${selectedField === "experimental" ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
                  >
                    علوم تجربی
                  </button>
                  <button
                    onClick={() => setSelectedField("mathematics")}
                    className={`px-4 py-1.5 rounded-lg text-xs font-black transition cursor-pointer ${selectedField === "mathematics" ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
                  >
                    ریاضی و فیزیک
                  </button>
                </div>
              </div>

              {/* Dynamic Filters */}
              <div className="flex flex-wrap items-center gap-2">
                
                {/* Search Box */}
                <div className="relative">
                  <Search size={14} className="absolute right-3 top-2.5 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="جستجوی درس..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-slate-50 border border-slate-200 rounded-xl pr-9 pl-3 py-1.5 text-xs font-bold text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500 w-[180px]"
                  />
                </div>

                {/* Booklet Filter */}
                <select 
                  value={bookletFilter} 
                  onChange={(e) => setBookletFilter(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-black text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
                >
                  <option value="all">همه دفترچه‌ها</option>
                  <option value="دفترچه شماره ۱">دفترچه شماره ۱</option>
                  <option value="دفترچه شماره ۲">دفترچه شماره ۲</option>
                  <option value="دفترچه شماره ۳">دفترچه شماره ۳</option>
                </select>

              </div>
            </div>

            {/* Immersive Grid of Subject Budgeting Cards */}
            {filteredStats.length === 0 ? (
              <div className="p-12 text-center bg-white border border-slate-200 rounded-3xl space-y-3">
                <HelpCircle className="mx-auto text-slate-350" size={36} />
                <h4 className="text-xs font-black text-slate-800">هیچ درسی با مشخصات وارد شده پیدا نشد!</h4>
                <p className="text-[10.5px] text-slate-500 font-bold">لطفاً عبارت جستجو یا فیلتر دفترچه را تغییر دهید.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredStats.map((stat, idx) => (
                  <motion.div 
                    key={stat.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.04 }}
                    className="bg-white rounded-3xl border border-slate-200 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden relative group"
                  >
                    {/* Visual left colored bar indicator based on difficulty */}
                    <div className="absolute top-0 right-0 w-1.5 h-full bg-slate-200 group-hover:bg-indigo-600 transition-colors" />

                    <div className="p-5 pr-6 space-y-4">
                      {/* Card Header */}
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <h4 className="font-black text-slate-800 text-sm flex items-center gap-2">
                            {stat.subject}
                          </h4>
                          <span className="inline-block text-[9.5px] font-black text-slate-500 bg-slate-50 border border-slate-150 px-2 py-0.5 rounded-md">
                            {stat.book}
                          </span>
                        </div>
                        <div className={`text-[9px] font-black px-2 py-1 rounded-md border ${stat.color}`}>
                          {stat.difficulty}
                        </div>
                      </div>

                      {/* Main Metrics inside Subject */}
                      <div className="grid grid-cols-2 gap-2.5 pt-2">
                        <div className="bg-slate-50/50 p-2.5 rounded-xl border border-slate-150/60 text-right space-y-0.5">
                          <span className="block text-[8.5px] font-black text-slate-400">تعداد کل سوالات</span>
                          <span className="text-xs font-black text-slate-850">{stat.questions} تست کنکور</span>
                        </div>
                        <div className="bg-slate-50/50 p-2.5 rounded-xl border border-slate-150/60 text-right space-y-0.5">
                          <span className="block text-[8.5px] font-black text-slate-400">زمان پیشنهادی کل</span>
                          <span className="text-xs font-black text-amber-600">{stat.timeMin} دقیقه</span>
                        </div>
                      </div>

                      {/* Bottom Alert/Warning Info Bar */}
                      <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-150/80 flex items-center justify-between text-[10px] font-bold">
                        <span className="text-slate-500">میزان دشواری (درصد خطا):</span>
                        <span className="text-rose-600 font-black">{stat.trapRate}</span>
                      </div>
                    </div>

                    {/* Quick Guide Interactive Area */}
                    <div className="bg-slate-50/80 border-t border-slate-150/60 px-5 py-3 flex justify-between items-center text-[10px] font-black text-indigo-600 pr-6">
                      <span className="flex items-center gap-1">
                        <Clock size={12} />
                        <span>زمان پیشنهادی هر سوال: {stat.avgSeconds} ثانیه</span>
                      </span>
                    </div>

                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {activeTab === "psychology" && (
          <motion.div 
            key="psychology"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            <div className="bg-white p-6 rounded-3xl border border-slate-200 space-y-3">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Brain className="text-indigo-600" size={20} />
                نکات مشاوره‌ای: چگونه در جلسه کنکور موفق‌تر عمل کنیم؟
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed font-bold">
                بسیاری از اشتباهات در جلسه آزمون به دلیل استرس و عدم مدیریت زمان رخ می‌دهند. با مطالعه نکات زیر، آمادگی ذهنی خود را افزایش دهید:
              </p>
            </div>

            <div className="space-y-3">
              {psychoTips.map((tip, idx) => (
                <div 
                  key={idx}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden transition-all shadow-2xs hover:border-slate-300"
                >
                  <button
                    onClick={() => setExpandedTip(expandedTip === idx ? null : idx)}
                    className="w-full p-5 flex justify-between items-center text-right font-black text-xs md:text-sm text-slate-800 hover:bg-slate-50 transition-all cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <CheckCircle2 size={16} className={expandedTip === idx ? "text-indigo-600" : "text-slate-400"} />
                      {tip.title}
                    </span>
                    <ChevronDown size={18} className={`text-slate-400 transition-transform duration-200 ${expandedTip === idx ? 'rotate-180' : ''}`} />
                  </button>

                  <AnimatePresence initial={false}>
                    {expandedTip === idx && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                      >
                        <div className="p-5 pt-0 border-t border-slate-100 text-xs md:text-sm leading-relaxed text-slate-600 font-bold bg-slate-50/50 pr-11">
                          {tip.content}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
