import React, { useState, useEffect } from "react";
import { Users, UserPlus, RefreshCw, GraduationCap, Home, TrendingUp, Search, Database } from "lucide-react";
import { Student } from "../../types";

interface StudentManagementProps {
  studentsDbList: Student[];
  isRegistering: boolean;
  setIsRegistering: (val: boolean) => void;
  newStudent: Partial<Student>;
  setNewStudent: (val: any) => void;
  onSaveNewStudent: () => void;
  onDeleteStudent: (id: string, name: string) => void;
  onEditStudent: (st: Student) => void;
}

const toPersianNum = (n: number | string): string => {
  const farsiDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  return n.toString().replace(/\d/g, (x) => farsiDigits[parseInt(x)]);
};

export default function StudentManagement({
  studentsDbList, isRegistering, setIsRegistering,
  newStudent, setNewStudent, onSaveNewStudent,
  onDeleteStudent, onEditStudent
}: StudentManagementProps) {
  const [dbUsers, setDbUsers] = useState<any[]>([]);
  const [loadingDb, setLoadingDb] = useState(false);

  useEffect(() => {
    setLoadingDb(true);
    fetch("/api/auth/list")
      .then(res => res.json())
      .then(data => {
        if (data && data.users) {
          setDbUsers(data.users);
        }
      })
      .catch(err => console.warn("Could not fetch database users:", err))
      .finally(() => setLoadingDb(false));
  }, []);

  return (
    <div className="space-y-8" id="admin-tab-students">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-4">
        <div className="space-y-1">
          <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
            <Users size={18} className="text-blue-600" />
            <span>مدیریت شناسنامه داوطلبان کنکور</span>
          </h3>
          <p className="text-[10px] text-slate-500 font-bold">بایگانی هوشمند و مانیتورینگ متمرکز ثبت‌نام‌های جدید دیتابیس</p>
        </div>
        <button 
          onClick={() => setIsRegistering(!isRegistering)}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-2xl text-xs font-black transition-all ${
            isRegistering ? "bg-rose-50 text-rose-600 border border-rose-100" : "bg-blue-950 text-white shadow-lg shadow-blue-900/10"
          }`}
        >
          {isRegistering ? <RefreshCw size={14} /> : <UserPlus size={16} />}
          <span>{isRegistering ? "انصراف" : "ثبت‌نام داوطلب جدید"}</span>
        </button>
      </div>

      {isRegistering && (
        <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-500">نام کامل داوطلب</label>
              <input type="text" value={newStudent.name || ""} onChange={e => setNewStudent({...newStudent, name: e.target.value})} className="w-full bg-white border border-slate-150 rounded-xl px-4 py-2 text-xs font-bold" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-500">موبایل / کد ملی</label>
              <input type="text" value={newStudent.code || ""} onChange={e => setNewStudent({...newStudent, code: e.target.value})} className="w-full bg-white border border-slate-150 rounded-xl px-4 py-2 text-xs font-bold" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-500">رشته کنکور</label>
              <select value={newStudent.field || "tajrobi"} onChange={e => setNewStudent({...newStudent, field: e.target.value})} className="w-full bg-white border border-slate-150 rounded-xl px-4 py-2 text-xs font-bold">
                <option value="tajrobi">تجربی</option>
                <option value="riazi">ریاضی</option>
                <option value="ensani">انسانی</option>
              </select>
            </div>
            <button onClick={onSaveNewStudent} className="md:mt-6 bg-blue-900 text-white py-2 rounded-xl text-xs font-black shadow-lg">ثبت نهایی داوطلب</button>
          </div>
        </div>
      )}

      {/* Database Users Section */}
      <div className="space-y-4">
        <h4 className="text-xs font-black text-slate-800 flex items-center gap-2">
          <Database size={14} className="text-indigo-600" />
          <span>کاربران ثبت‌نام‌شده در پایگاه داده ابری (D1 Database)</span>
          <span className="text-[10px] px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded-full font-mono">{dbUsers.length} نفر</span>
        </h4>

        {loadingDb ? (
          <div className="p-8 text-center text-xs text-slate-400 font-bold">در حال بارگذاری لیست کاربران دیتابیس...</div>
        ) : dbUsers.length === 0 ? (
          <div className="p-6 text-center text-xs text-slate-400 font-bold bg-slate-50 rounded-2xl border border-dashed border-slate-200">
            هنوز کاربری در دیتابیس ثبت نشده است.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {dbUsers.map(u => (
              <div key={u.id} className="bg-white p-5 rounded-[28px] border border-indigo-100 shadow-sm hover:shadow-md transition-all relative overflow-hidden group">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-700 flex items-center justify-center text-sm font-black font-mono">
                      {u.name ? u.name.charAt(0) : "ک"}
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-slate-900">{u.name || "کاربر مهمان"}</h4>
                      <p className="text-[10px] text-indigo-600 font-bold font-mono">{u.mobile || u.email || "بدون شماره"}</p>
                    </div>
                  </div>
                  <span className="text-[9px] font-black px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-lg">ثبت‌نام ابری</span>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-50 text-[10px] font-bold text-slate-600">
                  <div>رشته: <span className="text-indigo-950 font-black">{u.field === "tajrobi" ? "تجربی" : u.field === "riazi" ? "ریاضی" : "انسانی"}</span></div>
                  <div>شهر: <span className="text-slate-800">{u.city || "ثبت نشده"}</span></div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="pt-6 border-t border-slate-100 space-y-4">
        <h4 className="text-xs font-black text-slate-800">سایر داوطلبان بایگانی محلی</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {studentsDbList.map(st => (
            <div key={st.id} className="bg-white p-5 rounded-[28px] border border-slate-150 shadow-sm hover:shadow-md transition-all relative overflow-hidden group">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center text-sm font-black">
                    {st.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-slate-900">{st.name}</h4>
                    <p className="text-[10px] text-slate-400 font-bold">{st.code}</p>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-slate-50">
                <div className="text-center p-2 bg-slate-50 rounded-xl">
                  <span className="block text-[8px] text-slate-400 font-black mb-1">تراز فعلی</span>
                  <span className="block text-xs font-black text-indigo-950 font-mono">{toPersianNum(st.academicProfile?.currentTraz || 0)}</span>
                </div>
                <div className="text-center p-2 bg-slate-50 rounded-xl">
                  <span className="block text-[8px] text-slate-400 font-black mb-1">رشته</span>
                  <span className="block text-[9px] font-black text-indigo-600">{st.field === "tajrobi" ? "تجربی" : "ریاضی"}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
