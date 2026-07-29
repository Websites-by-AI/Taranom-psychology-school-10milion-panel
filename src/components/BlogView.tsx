import React, { useMemo, useState } from "react";
import { BLOG_ARTICLES, BlogArticle, BlogArticleSection, findArticle } from "../data/blogArticles";

// ثابت نگه داشتن کلاس‌های Tailwind (بدون ساخت رشته‌ای در runtime)
const ACCENTS: Record<
  BlogArticle["accent"],
  { gradient: string; badge: string; text: string; hoverText: string; ring: string; callout: string }
> = {
  indigo: {
    gradient: "from-indigo-500 to-violet-600",
    badge: "bg-indigo-50 text-indigo-700 border-indigo-100",
    text: "text-indigo-600",
    hoverText: "group-hover:text-indigo-600",
    ring: "ring-indigo-100",
    callout: "bg-indigo-50/70 border-indigo-200 text-indigo-900",
  },
  emerald: {
    gradient: "from-emerald-500 to-teal-600",
    badge: "bg-emerald-50 text-emerald-700 border-emerald-100",
    text: "text-emerald-600",
    hoverText: "group-hover:text-emerald-600",
    ring: "ring-emerald-100",
    callout: "bg-emerald-50/70 border-emerald-200 text-emerald-900",
  },
  amber: {
    gradient: "from-amber-500 to-orange-600",
    badge: "bg-amber-50 text-amber-700 border-amber-100",
    text: "text-amber-600",
    hoverText: "group-hover:text-amber-600",
    ring: "ring-amber-100",
    callout: "bg-amber-50/70 border-amber-200 text-amber-900",
  },
  rose: {
    gradient: "from-rose-500 to-pink-600",
    badge: "bg-rose-50 text-rose-700 border-rose-100",
    text: "text-rose-600",
    hoverText: "group-hover:text-rose-600",
    ring: "ring-rose-100",
    callout: "bg-rose-50/70 border-rose-200 text-rose-900",
  },
  sky: {
    gradient: "from-sky-500 to-cyan-600",
    badge: "bg-sky-50 text-sky-700 border-sky-100",
    text: "text-sky-600",
    hoverText: "group-hover:text-sky-600",
    ring: "ring-sky-100",
    callout: "bg-sky-50/70 border-sky-200 text-sky-900",
  },
};

interface BlogViewProps {
  onNavigate?: (target: string) => void;
}

export default function BlogView({ onNavigate }: BlogViewProps) {
  // Deep-link support: صفحه اول یا سایر ماژول‌ها می‌توانند قبل از ناوبری به وبلاگ
  // یک slug در localStorage قرار دهند تا همان مقاله مستقیم باز شود.
  const [activeSlug, setActiveSlug] = useState<string | null>(() => {
    try {
      const pending = localStorage.getItem("taranom_blog_pending_slug");
      if (pending) {
        localStorage.removeItem("taranom_blog_pending_slug");
        if (findArticle(pending)) return pending;
      }
    } catch (e) {}
    return null;
  });
  const [categoryFilter, setCategoryFilter] = useState<string>("همه");

  const categories = useMemo(
    () => ["همه", ...Array.from(new Set(BLOG_ARTICLES.map((a) => a.category)))],
    []
  );
  const filtered = useMemo(
    () => (categoryFilter === "همه" ? BLOG_ARTICLES : BLOG_ARTICLES.filter((a) => a.category === categoryFilter)),
    [categoryFilter]
  );

  const active = activeSlug ? findArticle(activeSlug) : undefined;

  // -------------------------------------- Reading view (تک مقاله)
  if (active) {
    const acc = ACCENTS[active.accent];
    const related = BLOG_ARTICLES.filter((a) => a.slug !== active.slug).slice(0, 3);
    return (
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8" style={{ direction: "rtl" }}>
        <button
          onClick={() => { setActiveSlug(null); window.scrollTo({ top: 0, behavior: "smooth" }); }}
          className="inline-flex items-center gap-2 text-xs font-black text-slate-500 hover:text-slate-800 bg-white border border-slate-200 rounded-full px-4 py-2 shadow-sm transition"
        >
          → بازگشت به همه مقالات
        </button>

        <article className="max-w-3xl mx-auto bg-white border border-slate-100 rounded-[2.5rem] shadow-xl overflow-hidden">
          <div className={`h-44 bg-gradient-to-tr ${acc.gradient} flex items-center justify-center relative`}>
            <span className="text-7xl drop-shadow-lg">{active.emoji}</span>
            <span className="absolute top-5 right-6 text-[10px] font-black text-white/90 bg-white/15 backdrop-blur px-3 py-1.5 rounded-full border border-white/25">
              {active.category}
            </span>
          </div>

          <div className="p-6 sm:p-10 space-y-7">
            <header className="space-y-3 border-b border-slate-100 pb-6">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 leading-relaxed">{active.title}</h1>
              <div className="flex flex-wrap items-center gap-3 text-[10px] font-bold text-slate-400">
                <span>📅 {active.date}</span>
                <span>⏱️ زمان مطالعه: {active.readMinutes} دقیقه</span>
                <span className={`border px-2 py-0.5 rounded-full ${acc.badge}`}>{active.category}</span>
              </div>
              <p className="text-xs text-slate-500 font-bold leading-7 text-right">{active.excerpt}</p>
            </header>

            {active.sections.map((sec, i) => (
              <section key={i} className="space-y-3">
                {sec.heading && (
                  <h2 className={`text-base font-black ${acc.text} flex items-center gap-2`}>
                    <span className={`w-1.5 h-6 rounded-full bg-gradient-to-b ${acc.gradient}`} />
                    {sec.heading}
                  </h2>
                )}
                {(sec.paragraphs || []).map((p, j) => (
                  <p key={j} className="text-[13px] text-slate-600 font-bold leading-9 text-right">{p}</p>
                ))}
                {sec.list && (
                  <ul className="space-y-2.5">
                    {sec.list.map((item, j) => (
                      <li key={j} className="flex items-start gap-2.5 text-[12px] text-slate-600 font-bold leading-7">
                        <span className={`mt-1.5 w-2 h-2 rounded-full shrink-0 bg-gradient-to-br ${acc.gradient}`} />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                )}
                {sec.callout && (
                  <div className={`border-r-4 rounded-2xl p-4 space-y-1.5 ${acc.callout}`}>
                    <p className="text-[11px] font-black">💡 {sec.callout.title}</p>
                    <p className="text-[12px] font-bold leading-7">{sec.callout.text}</p>
                  </div>
                )}
              </section>
            ))}

            <footer className="border-t border-slate-100 pt-5 space-y-3">
              <div className="flex flex-wrap gap-2">
                {active.keywords.map((k) => (
                  <span key={k} className="text-[9px] font-black bg-slate-50 text-slate-400 border border-slate-100 px-2.5 py-1 rounded-full">#{k}</span>
                ))}
              </div>
              <p className="text-[10px] text-slate-400 font-bold text-center pt-1">
                تیم مشاوره آکادمی ترنم همدلی — همراه گام‌به‌گام در مسیر یادگیری شما ❤️
              </p>
            </footer>
          </div>
        </article>

        {/* Related */}
        <div className="max-w-3xl mx-auto space-y-3">
          <h3 className="text-sm font-black text-slate-800 pr-1">مقالات مرتبط</h3>
          <div className="grid sm:grid-cols-3 gap-3">
            {related.map((a) => (
              <button
                key={a.slug}
                onClick={() => { setActiveSlug(a.slug); window.scrollTo({ top: 0 }); }}
                className="text-right bg-white border border-slate-100 rounded-2xl p-4 hover:-translate-y-0.5 hover:shadow-lg transition group space-y-2"
              >
                <span className="text-2xl">{a.emoji}</span>
                <p className="text-[11px] font-black text-slate-800 leading-5 group-hover:text-indigo-600 line-clamp-2">{a.title}</p>
                <p className="text-[9px] font-bold text-slate-400">{a.category} • ⏱️ {a.readMinutes} دقیقه</p>
              </button>
            ))}
          </div>
        </div>

        {onNavigate && (
          <div className="text-center">
            <button onClick={() => onNavigate("welcome")} className="text-emerald-600 text-xs font-black hover:underline">
              بازگشت به پیشخوان
            </button>
          </div>
        )}
      </div>
    );
  }

  // -------------------------------------- Listing view (صفحه اصلی بلاگ)
  return (
    <div className="animate-in fade-in zoom-in-95 duration-500 space-y-8" style={{ direction: "rtl" }}>
      {/* Header */}
      <div className="text-center bg-white border border-slate-100 rounded-[2.5rem] shadow-xl p-8 sm:p-10 space-y-4">
        <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto shadow-inner ring-4 ring-emerald-50/50">
          <span className="text-3xl">✍️</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900">وبلاگ آموزشی ترنم همدلی</h1>
        <p className="text-xs sm:text-sm text-slate-500 font-bold max-w-lg mx-auto leading-relaxed">
          مقالات تخصصی مشاوره‌ای درباره روش مطالعه علمی، روانشناسی آزمون، تحلیل کارنامه و برنامه‌ریزی کایزن — هر مقاله بر پایه پژوهش‌های یادگیری و تجربه فنی مشاوران کنکور نوشته شده است.
        </p>
        <div className="flex flex-wrap justify-center gap-2 pt-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`text-[11px] font-black px-4 py-2 rounded-full border transition ${
                categoryFilter === cat
                  ? "bg-slate-900 text-white border-slate-900 shadow-lg"
                  : "bg-white text-slate-500 border-slate-200 hover:border-slate-400"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Featured (first article) */}
      {filtered.length > 0 && (
        <ArticleCard article={filtered[0]} featured onOpen={() => setActiveSlug(filtered[0].slug)} />
      )}

      {/* Grid */}
      <div className="grid sm:grid-cols-2 gap-5">
        {filtered.slice(1).map((a) => (
          <React.Fragment key={a.slug}>
            <ArticleCard article={a} onOpen={() => setActiveSlug(a.slug)} />
          </React.Fragment>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-xs font-black text-slate-400 py-10">مقاله‌ای در این دسته‌بندی یافت نشد.</p>
      )}

      {onNavigate && (
        <div className="text-center">
          <button onClick={() => onNavigate("welcome")} className="text-emerald-600 text-xs font-black hover:underline">
            بازگشت به پیشخوان
          </button>
        </div>
      )}
    </div>
  );
}

function ArticleCard({
  article,
  featured = false,
  onOpen,
}: {
  article: BlogArticle;
  featured?: boolean;
  onOpen: () => void;
}) {
  const acc = ACCENTS[article.accent];
  return (
    <button
      onClick={onOpen}
      className={`w-full text-right bg-white border border-slate-100 rounded-[2rem] shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all overflow-hidden group ${
        featured ? "sm:flex" : "flex flex-col"
      }`}
    >
      <div className={`bg-gradient-to-tr ${acc.gradient} flex items-center justify-center relative shrink-0 ${featured ? "sm:w-64 h-36 sm:h-auto" : "h-32"}`}>
        <span className={featured ? "text-6xl" : "text-4xl"}>{article.emoji}</span>
        <span className="absolute top-4 right-4 text-[9px] font-black text-white/90 bg-white/15 backdrop-blur px-2.5 py-1 rounded-full border border-white/25">
          {article.category}
        </span>
        {featured && (
          <span className="absolute top-4 left-4 text-[9px] font-black bg-amber-400 text-amber-950 px-2.5 py-1 rounded-full">⭐ منتخب سردبیر</span>
        )}
      </div>
      <div className="p-6 space-y-3 flex-1">
        <h3 className={`font-black text-slate-900 ${acc.hoverText} transition-colors leading-6 ${featured ? "text-base" : "text-[13px]"}`}>
          {article.title}
        </h3>
        <p className="text-[11px] text-slate-500 font-bold leading-6 line-clamp-3">{article.excerpt}</p>
        <div className="flex items-center justify-between pt-2 border-t border-slate-50 text-[9px] font-black text-slate-400">
          <span>📅 {article.date}</span>
          <span>⏱️ {article.readMinutes} دقیقه مطالعه</span>
          <span className={acc.text}>ادامه مطلب ←</span>
        </div>
      </div>
    </button>
  );
}
