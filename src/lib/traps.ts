import { TestTrap } from "../types";

export const getTestTraps = (field: string = "tajrobi", studentId?: string): TestTrap[] => {
  const storageKey = studentId ? `taranom_test_traps_${studentId}` : `taranom_test_traps_${field}`;
  const saved = localStorage.getItem(storageKey);
  if (!saved) {
    if (field === "riazi") {
      return [
        {
          id: "TRAP-1",
          questionTitle: "محاسبه سرعت متوسط در حرکت با شتاب غیرثابت",
          subject: "فیزیک تخصصی",
          category: "اشتباه_محاسباتی",
          trapType: "تله فرمول میانگین حسابی",
          correctAnswer: "تقسیم جابجایی کل بر زمان کل (نه میانگین متجانس سرعت‌ها)",
          userMistake: "سرعت اولیه و ثانویه را جمع کرده و تقسیم بر دو کردم در حالی که شتاب ثابت نبود.",
          educationalNote: "فرمول (v1 + v2)/2 فقط و فقط زمانی صادق است که شتاب حرکت ثابت باشد. در شتاب‌های متغیر باید انتگرال‌گیری یا سطح زیر نمودار محاسبه شود.",
          importance: "high",
          createdAt: "۱۴۰۶/۰۳/۰۹"
        },
        {
          id: "TRAP-2",
          questionTitle: "همگرایی مبهم حد در بی‌نهایت",
          subject: "حسابان و ریاضیات",
          category: "مفهومی",
          trapType: "تله حد ابهام بی‌نهایت منهای بی‌نهایت",
          correctAnswer: "باید با مخرج‌ مشترک‌گیری، گویا کردن یا هم‌ارزی نیوتون ابهام رفع شود.",
          userMistake: "حاصل حد بی‌نهایت منهای بی‌نهایت را فوراً صفر منظور کردم.",
          educationalNote: "همیشه قبل از نسبت دادن جواب حد، نوع ابهام ریاضی را به کمک فاکتورگیری یا رفع ابهام مشخص کنید.",
          importance: "medium",
          createdAt: "۱۴۰۶/۰۳/۰۹"
        }
      ];
    } else if (field === "ensani") {
      return [
        {
          id: "TRAP-1",
          questionTitle: "تشخیص نوع اختیارهای وزنی در شعر عروضی",
          subject: "ادبیات فارسی تخصصی",
          category: "مفهومی",
          trapType: "تله تقطیع هجای کشیده",
          correctAnswer: "هجای کشیده در انتهای هر مصراع همواره معادل هجای بلند محسوب می‌شود.",
          userMistake: "هجای کشیده پایان مصراع را به صورت هجای کوتاه یا کشیده تقطیع کردم.",
          educationalNote: "در قاعده عروض فارسی، طول هجا در انتهای مصراع‌ها آزاد است و هجاهای کشیده همیشه به هجای بلند تبدیل می‌شوند.",
          importance: "high",
          createdAt: "۱۴۰۶/۰۳/۰۹"
        },
        {
          id: "TRAP-2",
          questionTitle: "تشخیص نقش نحوی منادا در ترجمه عربی",
          subject: "عربی تخصصی",
          category: "مفهومی",
          trapType: "تله اعراب منادای مضاف",
          correctAnswer: "منادای مضاف همواره منصوب است و باید اعراب فتحه یا معادل آن بگیرد.",
          userMistake: "منادای مضاف را به صورت مرفوع ترجمه و اعراب‌گذاری کردم.",
          educationalNote: "منادا در صورتی که مضاف واقع شود منصوب است (مانند یا تلمیذَ المدرسه) و نباید با منادای مفرد علم اشتباه شود.",
          importance: "medium",
          createdAt: "۱۴۰۶/۰۳/۰۹"
        }
      ];
    } else {
      // tajrobi
      return [
        {
          id: "TRAP-1",
          questionTitle: "محاسبه سرعت متوسط در حرکت با شتاب غیرثابت",
          subject: "فیزیک تخصصی",
          category: "اشتباه_محاسباتی",
          trapType: "تله فرمول میانگین حسابی",
          correctAnswer: "تقسیم جابجایی کل بر زمان کل (نه میانگین متجانس سرعت‌ها)",
          userMistake: "سرعت اولیه و ثانویه را جمع کرده و تقسیم بر دو کردم در حالی که شتاب ثابت نبود.",
          educationalNote: "فرمول (v1 + v2)/2 فقط و فقط زمانی صادق است که شتاب حرکت ثابت باشد. در شتاب‌های متغیر باید انتگرال‌گیری یا سطح زیر نمودار محاسبه شود.",
          importance: "high",
          createdAt: "۱۴۰۶/۰۳/۰۹"
        },
        {
          id: "TRAP-2",
          questionTitle: "ماهیت ساختاری غشای سلولی اندامک‌ها",
          subject: "زیست‌شناسی",
          category: "مفهومی",
          trapType: "تله غشای دو لایه لپیدی",
          correctAnswer: "ریبوزوم فاقد غشا است اما راکیزه (میتوکندری) غشای دو لایه دارد",
          userMistake: "ریبوزوم را تک غشایی تلقی کردم.",
          educationalNote: "توجه شود که ریبوزوم و سانتریول از ساختارهای بدون غشا در سلول‌های یوکاریوتی هستند و نباید در محاسبات تعداد لایه‌های فسفولیپیدی وارد شوند.",
          importance: "medium",
          createdAt: "۱۴۰۶/۰۳/۰۹"
        }
      ];
    }
  }
  try {
    return JSON.parse(saved);
  } catch (e) {
    return [];
  }
};

export const saveTestTrap = (trap: Omit<TestTrap, "id" | "createdAt">, field: string = "tajrobi", studentId?: string) => {
  const storageKey = studentId ? `taranom_test_traps_${studentId}` : `taranom_test_traps_${field}`;
  const traps = getTestTraps(field, studentId);
  const newTrap: TestTrap = {
    ...trap,
    id: `TRAP-${Date.now()}`,
    createdAt: new Date().toLocaleDateString("fa-IR")
  };
  localStorage.setItem(storageKey, JSON.stringify([newTrap, ...traps]));
  return newTrap;
};

export const deleteTestTrap = (id: string, field: string = "tajrobi", studentId?: string) => {
  const storageKey = studentId ? `taranom_test_traps_${studentId}` : `taranom_test_traps_${field}`;
  const traps = getTestTraps(field, studentId);
  const filtered = traps.filter(t => t.id !== id);
  localStorage.setItem(storageKey, JSON.stringify(filtered));
};
