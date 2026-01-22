"use client";
import { useEffect, useState } from "react";
import { Phone, MapPin, Building2, Globe } from "lucide-react";

export default function Home() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const sub = window.location.hostname.split(".")[0];
        // DÁN LINK CSV CỦA BẠN VÀO DƯỚI ĐÂY
        const SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQmi6oayoemKBJXEWi4pkVHDsm166ap0XCwbopYrukBQnwj2gERseGlDnJVBrtciHwKEFj5bTqFLGiQ/pub?output=csv"; 

        const res = await fetch(SHEET_URL);
        const text = await res.text();
        const rows = text.split("\n").map(row => row.split(","));
        const match = rows.find(r => r[0]?.trim().toLowerCase() === sub.toLowerCase());
        
        if (match) {
          setData({ name: match[1], address: match[2], phone: match[3] });
        }
      } catch (e) {
        console.error("Lỗi tải dữ liệu");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="flex h-screen items-center justify-center font-sans">Đang tải dữ liệu doanh nghiệp...</div>;
  if (!data) return <div className="flex h-screen items-center justify-center text-red-500 font-bold">404 - Không tìm thấy thông tin doanh nghiệp này</div>;

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Header giống mẫu xmdn */}
      <header className="bg-blue-700 text-white p-6 shadow-lg text-center">
        <Building2 className="w-12 h-12 mx-auto mb-2" />
        <h1 className="text-2xl md:text-3xl font-bold uppercase tracking-wide">{data.name}</h1>
      </header>

      <main className="max-w-4xl mx-auto p-6 mt-8">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-8 space-y-8">
            <div className="flex items-start gap-4">
              <div className="bg-blue-100 p-3 rounded-full text-blue-700"><MapPin /></div>
              <div>
                <h3 className="font-bold text-slate-500 uppercase text-sm tracking-widest">Địa chỉ trụ sở</h3>
                <p className="text-xl mt-1">{data.address}</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-green-100 p-3 rounded-full text-green-700"><Phone /></div>
              <div>
                <h3 className="font-bold text-slate-500 uppercase text-sm tracking-widest">Hotline hỗ trợ</h3>
                <p className="text-3xl font-black text-green-600 mt-1">{data.phone}</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-purple-100 p-3 rounded-full text-purple-700"><Globe /></div>
              <div>
                <h3 className="font-bold text-slate-500 uppercase text-sm tracking-widest">Trạng thái</h3>
                <p className="text-xl mt-1 text-blue-600 font-medium italic underline">Đã xác minh trên hệ thống</p>
              </div>
            </div>
          </div>
        </div>
        
        <footer className="text-center mt-12 text-slate-400 text-sm">
          © 2026 Hệ thống Tra cứu Thông tin Doanh nghiệp - {data.name}
        </footer>
      </main>
    </div>
  );
}
