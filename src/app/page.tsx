"use client";
import { useEffect, useState } from "react";
import { Phone, MapPin, Building2, CheckCircle, Home, Info, ShoppingBag, FileText } from "lucide-react";

export default function Page() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const sub = window.location.hostname.split(".")[0].toLowerCase();
        // Giữ nguyên link CSV của bạn
        const SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQmi6oayoemKBJXEWi4pkVHDsm166ap0XCwbopYrukBQnwj2gERseGlDnJVBrtciHwKEFj5bTqFLGiQ/pub?gid=0&single=true&output=csv"; 

        const res = await fetch(SHEET_URL);
        const arrayBuffer = await res.arrayBuffer();
        const text = new TextDecoder('utf-8').decode(arrayBuffer); // Sửa lỗi font tiếng Việt
        
        const rows = text.split("\n").map(row => row.split(","));
        const match = rows.find(r => r[0]?.trim().toLowerCase() === sub);
        
        if (match) {
          setData({ 
            name: match[1], 
            address: match[2], 
            document: match[3], // Cột D
            phone: match[4],    // Cột E
            image: match[5]?.trim() // Cột F
          });
        }
      } catch (e) { console.error("Lỗi tải dữ liệu"); }
    };
    fetchData();
  }, []);

  if (!data) return <div className="min-h-screen flex items-center justify-center bg-[#052c24] text-white italic">Đang tải dữ liệu doanh nghiệp...</div>;

  return (
    <div className="min-h-screen bg-[#052c24] text-white font-sans">
      
      {/* 1. HEADER GHIM CỐ ĐỊNH (STICKY) */}
      <header className="sticky top-0 z-[100] bg-[#c4a52e] shadow-2xl">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-col border-l-4 border-[#052c24] pl-4">
            <h1 className="text-2xl md:text-3xl font-black text-[#052c24] uppercase leading-none">
              {data.name}
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="bg-[#052c24] text-[#c4a52e] px-2 py-0.5 text-[10px] font-black rounded uppercase">Document</span>
              <span className="text-[#052c24] font-bold text-sm tracking-widest">{data.document}</span>
            </div>
          </div>
          <nav className="hidden lg:flex items-center gap-8 text-[#052c24] font-black text-xs uppercase tracking-widest">
            <a href="#" className="hover:opacity-60 transition">Tiện ích</a>
            <a href="#" className="hover:opacity-60 transition">Giá trị đầu tư</a>
            <a href="#" className="hover:opacity-60 transition">Pháp lý</a>
            <button className="bg-[#052c24] text-white px-6 py-2 rounded-md font-black hover:scale-105 transition shadow-lg">ĐĂNG KÝ</button>
          </nav>
        </div>
      </header>

      {/* 2. NỘI DUNG CHÍNH */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="relative rounded-[40px] overflow-hidden border-2 border-[#c4a52e]/30 shadow-2xl group">
          <img src={data.image} className="w-full h-[500px] object-cover transition duration-700 group-hover:scale-105" alt="Main" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#052c24] via-transparent to-transparent opacity-90" />
          <div className="absolute bottom-10 left-10 right-10">
             <h2 className="text-4xl md:text-6xl font-black uppercase mb-2">Hệ thống giao thông <span className="text-[#c4a52e]">đồng bộ</span></h2>
          </div>
        </div>

        {/* Khối Pháp lý */}
        <section className="mt-24 text-center">
          <h3 className="text-3xl font-black text-[#c4a52e] mb-16 tracking-[10px] uppercase border-b-2 border-[#c4a52e]/20 pb-4 inline-block">Pháp lý đầy đủ</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 text-left">
            <div className="space-y-6 text-gray-300 italic text-lg border-l-2 border-[#c4a52e]/30 pl-8">
              <p>• Phát triển đô thị sinh thái xanh bền vững...</p>
              <p>• Chú trọng các khu chức năng công nghiệp, thương mại...</p>
              <p>• UBND huyện phê duyệt chỉ tiêu sử dụng đất cao nhất...</p>
              <p>• Xây dựng các dự án hạ tầng mang tính chiến lược...</p>
            </div>
            <div className="bg-[#c4a52e] p-2 rounded-3xl shadow-2xl">
              <img src="https://img.vietnamfinance.vn/upload/news/vungnv/2021/10/22/so-hong.jpg" className="rounded-2xl w-full" alt="Legal" />
            </div>
          </div>
        </section>
      </main>

      {/* 3. FOOTER */}
      <footer className="bg-[#031d18] border-t border-[#c4a52e]/20 pt-20 pb-10 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-16">
          <div className="space-y-6">
            <h4 className="text-[#c4a52e] text-2xl font-black uppercase tracking-tight">{data.name}</h4>
            <p className="text-gray-500 text-sm italic leading-relaxed">
              Cung cấp giải pháp minh bạch thông tin doanh nghiệp hàng đầu tại khu vực.
            </p>
          </div>

          <div className="space-y-6">
            <h5 className="font-black text-[#c4a52e] uppercase text-sm tracking-widest">Về chúng tôi</h5>
            <div className="grid grid-cols-2 gap-4 text-sm text-gray-400">
              <span className="flex items-center gap-2 hover:text-white transition cursor-pointer"><Home size={14}/> Trang chủ</span>
              <span className="flex items-center gap-2 hover:text-white transition cursor-pointer"><Info size={14}/> Giới thiệu</span>
              <span className="flex items-center gap-2 hover:text-white transition cursor-pointer"><ShoppingBag size={14}/> Cửa hàng</span>
              <span className="flex items-center gap-2 hover:text-white transition cursor-pointer"><FileText size={14}/> Bài viết</span>
            </div>
          </div>

          <div className="bg-[#052c24] p-8 rounded-3xl border border-[#c4a52e]/10 space-y-6">
            <h5 className="font-black text-[#c4a52e] uppercase text-sm tracking-widest">Thông tin liên hệ</h5>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="bg-[#c4a52e] p-2 rounded-full text-[#052c24] shadow-lg"><Phone size={18} /></div>
                <span className="text-lg font-black tracking-tighter">HOTLINE: {data.phone}</span>
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-[#c4a52e] p-2 rounded-full text-[#052c24] mt-1 shadow-lg shrink-0"><MapPin size={18} /></div>
                <span className="text-gray-400 text-sm leading-snug">Address: {data.address}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="text-center mt-20 text-[10px] text-gray-600 uppercase tracking-[5px]">
          © 2026 HỆ THỐNG XÁC MINH DOANH NGHIỆP - ALL RIGHTS RESERVED
        </div>
      </footer>

      {/* Floating Button */}
      <button className="fixed bottom-6 right-6 bg-red-600 text-white px-6 py-4 rounded-full font-black shadow-2xl hover:scale-110 transition z-50 text-[10px] uppercase tracking-widest">
        Đăng ký nhận thông tin
      </button>

    </div>
  );
}
