/**
 * تنظیمات سراسری پلتفرم ترنم همدلی
 * تمام نام‌های تجاری و متن‌های ثابت در این فایل مدیریت می‌شوند.
 */

// Helper to get custom institution values from localStorage dynamically
const getStoredValue = (key: string, defaultValue: string): string => {
  if (typeof window !== "undefined") {
    return localStorage.getItem(key) || defaultValue;
  }
  return defaultValue;
};

export const getInstitutionsList = () => [
  {
    id: "taranom",
    name: getStoredValue("taranom_custom_name_taranom", "ترنم همدلی"),
    fullName: getStoredValue("taranom_custom_fullname_taranom", "آکادمی هوشمند ترنم همدلی"),
    slogan: getStoredValue("taranom_custom_slogan_taranom", "دستیار تخصصی موفقیت در کنکور سراسری"),
    examProvider: getStoredValue("taranom_custom_examp_taranom", "آزمون‌های شبیه‌ساز ترنم همدلی"),
    theme: "indigo"
  },
  {
    id: "gaj",
    name: getStoredValue("taranom_custom_name_gaj", "گاج"),
    fullName: getStoredValue("taranom_custom_fullname_gaj", "انتشارات بین‌المللی گاج"),
    slogan: getStoredValue("taranom_custom_slogan_gaj", "مدرن‌ترین سیستم آزمون‌های آزمایشی"),
    examProvider: getStoredValue("taranom_custom_examp_gaj", "آزمون‌های سراسری گاج"),
    theme: "blue"
  },
  {
    id: "ghalamchi",
    name: getStoredValue("taranom_custom_name_ghalamchi", "قلم‌چی"),
    fullName: getStoredValue("taranom_custom_fullname_ghalamchi", "بنیاد علمی آموزشی قلم‌چی"),
    slogan: getStoredValue("taranom_custom_slogan_ghalamchi", "برنامه‌ریزی و آزمون‌های برنامه‌ای"),
    examProvider: getStoredValue("taranom_custom_examp_ghalamchi", "آزمون‌های راهبردی کانون"),
    theme: "blue"
  }
];

export const INSTITUTIONS = getInstitutionsList();

export let BRAND_CONFIG = { ...INSTITUTIONS[0] };

export const setBrandById = (id: string) => {
  const currentList = getInstitutionsList();
  const brand = currentList.find(i => i.id === id);
  if (brand) {
    BRAND_CONFIG = { ...brand };
  }
};

export const updateCustomBrandData = (id: string, updates: { name?: string; fullName?: string; slogan?: string; examProvider?: string }) => {
  if (typeof window !== "undefined") {
    if (updates.name) localStorage.setItem(`taranom_custom_name_${id}`, updates.name);
    if (updates.fullName) localStorage.setItem(`taranom_custom_fullname_${id}`, updates.fullName);
    if (updates.slogan) localStorage.setItem(`taranom_custom_slogan_${id}`, updates.slogan);
    if (updates.examProvider) localStorage.setItem(`taranom_custom_examp_${id}`, updates.examProvider);
  }
  setBrandById(id);
};

/**
 * تابعی برای جایگذاری نام برند در متن‌ها
 * @param text متنی که قرار است نام برند در آن جای بگیرد
 * @returns متن اصلاح شده
 */
export const withBrand = (text: string) => {
  return text.replace(/چتر دانش/g, BRAND_CONFIG.name);
};
