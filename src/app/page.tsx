"use client";
import { useEffect, useState } from "react";
import { Phone, MapPin, Building2, CheckCircle, Globe, Home, Info, ShoppingBag, FileText } from "lucide-react";

export default function Page() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const hostname = window.location.hostname;
        const sub = hostname.split(".")[0].toLowerCase();
        // Link CSV Google Sheets của bạn
        const SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQmi6oayoemKBJXEWi4pkVHDsm166ap0XCwbopYrukBQnwj2gERseGlDnJVBrtciHwKEFj5bTqFLGiQ/pub?output=csv"; 

        const res = await fetch(SHEET_URL);
        const arrayBuffer = await res.arrayBuffer();
        const text = new TextDecoder('utf-8').decode(arrayBuffer);
        
        const rows = text.split("\n").map(row => row.split(","));
        const match = rows.find(r => r[0]?.trim().toLowerCase() === sub);
        
        if (match) {
          setData({ 
            name: match[1], 
            address: match[2], 
            phone: match[3],
            document: match[5] || "B20250065510", // Lấy Document từ cột F
            image: match[4]?.trim() 
          });
        }
      } catch (e) { console.error("Lỗi dữ liệu"); }
    };
    fetchData();
  }, []);

  if (!data) return <div className="p-20 text-center font-bold">Đang tải dữ liệu doanh nghiệp...</div>;

  return (
    <div className="min-h-screen bg-[#052c24] text-white font-sans selection:bg-yellow-500">
      
      {/* 1. HEADER GHIM CỐ ĐỊNH (Sticky) */}
      <header className="sticky top-0 z-50 bg-[#c4a52e] shadow-xl border-b border-yellow-600">
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-col">
            <h1 className="text-xl md:text-2xl font-black text-[#052c24] uppercase truncate">
              {data.name}
            </h1>
            <div className="bg-[#052c24] text-[#c4a52e] inline-block px-2 py-0.5 rounded text-sm font-bold w-fit">
              Document: {data.document}
            </div>
          </div>
          
          <nav className="hidden md:flex items-center gap-6 text-[#052c24] font-bold text-sm uppercase">
            <a href="#" className="hover:text-white transition">Tiện ích</a>
            <a href="#" className="hover:text-white transition">Giá trị đầu tư</a>
            <a href="#" className="hover:text-white transition">Pháp lý</a>
            <button className="bg-[#052c24] text-white px-4 py-2 rounded shadow-lg hover:opacity-90 transition">
              ĐĂNG KÝ
            </button>
          </nav>
        </div>
      </header>

      {/* 2. NỘI DUNG CHÍNH (Body) */}
      <main className="max-w-7xl mx-auto px-4 py-10">
        <div className="relative group rounded-3xl overflow-hidden shadow-2xl border border-[#c4a52e]/30">
          <img 
            src={data.image || "https://images.unsplash.com/photo-1541913057-087093557e0d?auto=format&fit=crop&q=80&w=2000"} 
            className="w-full h-[500px] object-cover transition duration-700 group-hover:scale-105" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#052c24] via-transparent to-transparent opacity-90" />
          <div className="absolute bottom-10 left-10 right-10">
            <h2 className="text-4xl md:text-6xl font-black mb-4 leading-tight uppercase">
              Hệ thống giao thông <br/><span className="text-[#c4a52e]">đồng bộ</span>
            </h2>
          </div>
        </div>

        {/* Khối Pháp lý - Tương tự mẫu */}
        <section className="mt-20 text-center">
          <h3 className="text-3xl font-black text-[#c4a52e] uppercase mb-10 tracking-widest">
            PHÁP LÝ ĐẦY ĐỦ
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="bg-[#0b3d33] p-8 rounded-2xl border border-[#c4a52e]/20 text-left">
              <ul className="space-y-4 text-gray-300 italic">
                <li>• Phát triển đô thị sinh thái xanh bền vững...</li>
                <li>• Chú trọng phát triển các khu chức năng công nghiệp...</li>
                <li>• UBND huyện phê duyệt chỉ tiêu sử dụng đất cao nhất...</li>
              </ul>
            </div>
            <div className="bg-[#c4a52e] p-1 rounded-2xl shadow-2xl">
              <div className="bg-white p-4 rounded-xl">
                 <img src="https://img.vietnamfinance.vn/upload/news/vungnv/2021/10/22/so-hong.jpg" className="w-full rounded" />
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* 3. FOOTER THÔNG TIN LIÊN HỆ */}
      <footer className="bg-[#031d18] border-t border-[#c4a52e]/30 py-16 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="md:col-span-1">
            <h4 className="text-[#c4a52e] text-2xl font-black mb-6 uppercase">{data.name}</h4>
            <p className="text-gray-400 text-sm leading-relaxed italic">
              Cung cấp giải pháp minh bạch thông tin doanh nghiệp hàng đầu tại khu vực.
            </p>
          </div>

          <div>
            <h5 className="font-black mb-6 uppercase text-[#c4a52e]">Về chúng tôi</h5>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex items-center gap-2 hover:text-white cursor-pointer"><Home size={16}/> Trang chủ</li>
              <li className="flex items-center gap-2 hover:text-white cursor-pointer"><Info size={16}/> Giới thiệu</li>
              <li className="flex items-center gap-2 hover:text-white cursor-pointer"><ShoppingBag size={16}/> Cửa hàng</li>
              <li className="flex items-center gap-2 hover:text-white cursor-pointer"><FileText size={16}/> Bài viết</li>
            </ul>
          </div>

          <div className="md:col-span-2 space-y-4 bg-[#052c24] p-6 rounded-2xl border border-[#c4a52e]/10">
            <h5 className="font-black mb-2 uppercase text-[#c4a52e]">Thông tin liên hệ</h5>
            <div className="flex items-center gap-3">
              <Phone className="text-[#c4a52e]" size={20} />
              <span className="text-xl font-black text-white">HOTLINE: {data.phone}</span>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="text-[#c4a52e] shrink-0" size={20} />
              <span className="text-gray-300">Address: {data.address}</span>
            </div>
            <div className="flex items-center gap-3 pt-4 border-t border-white/5">
              <div className="bg-[#c4a52e] text-[#052c24] px-3 py-1 rounded-md font-black text-sm">
                DOCUMENT: {data.document}
              </div>
            </div>
          </div>
        </div>
        <div className="text-center mt-16 text-gray-600 text-[10px] tracking-tighter">
          © 2026 HỆ THỐNG XÁC MINH DOANH NGHIỆP - TẤT CẢ QUYỀN ĐƯỢC BẢO LƯU
        </div>
      </footer>

      {/* Nút Đăng ký bay lơ lửng */}
      <button className="fixed bottom-6 right-6 bg-red-600 text-white p-4 rounded-full shadow-2xl hover:scale-110 transition z-50 font-black text-xs uppercase animate-pulse">
        Đăng ký nhận thông tin
      </button>

    </div>
  );
}
