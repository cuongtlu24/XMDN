"use client";

import { useEffect, useState } from "react";
import { Phone, MapPin, Building2, Menu, X, CheckCircle2 } from "lucide-react";

type BizData = {
  name: string;
  address: string;
  document: string;
  phone: string;
  image?: string;
};

// ===== Helpers =====
function slugify(s: string) {
  return (s || "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]/g, "");
}

function parseCsvLine(line: string): string[] {
  const out: string[] = [];
  let cur = "", inQ = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQ && line[i + 1] === '"') { cur += '"'; i++; } else inQ = !inQ;
      continue;
    }
    if (ch === "," && !inQ) { out.push(cur.trim()); cur = ""; continue; }
    cur += ch;
  }
  out.push(cur.trim());
  return out;
}

function parseCsv(text: string) {
  return text.replace(/\r/g, "").split("\n").map(x => x.trim()).filter(Boolean).map(parseCsvLine);
}

// ===== Fallback images =====
const FALLBACKS = [
  "https://images.unsplash.com/photo-1526772662000-3f88f10405ff?q=80&w=1800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=1800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1800&auto=format&fit=crop",
];
function pickFallback(key: string) {
  let h = 0;
  const s = slugify(key);
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return FALLBACKS[h % FALLBACKS.length];
}

// ===== Hook fetch data =====
function useBizData(sheetUrl: string) {
  const [data, setData] = useState<BizData | null>(null);

  useEffect(() => {
    const run = async () => {
      try {
        const host = window.location.hostname.toLowerCase();
        let sub = host.split(".")[0];
        if (sub === "www") sub = host.split(".")[1] || "";
        const wanted = slugify(sub);

        const res = await fetch(sheetUrl, { cache: "no-store" });
        const text = await res.text();
        const rows = parseCsv(text);
        const match = rows.find(r => slugify(r[0] || "") === wanted);
        if (match) setData({ name: match[1] || "", address: match[2] || "", document: match[3] || "", phone: match[4] || "", image: (match[5] || "").trim() });
        else setData(null);
      } catch { setData(null); }
    };
    run();
  }, [sheetUrl]);

  return data;
}

// ===== Components =====
const Header = ({ data }: { data: BizData }) => {
  const [mobile, setMobile] = useState(false);
  const gold = "#c4a52e", bg = "#052c24";
  const nav = [
    { t: "TRANG CHỦ", h: "#home" },
    { t: "TỔNG QUAN", h: "#tongquan" },
    { t: "TIỆN ÍCH", h: "#tienich" },
    { t: "PHÁP LÝ", h: "#phaply" },
    { t: "ĐĂNG KÝ", h: "#dangky" },
    { t: "LIÊN HỆ", h: "#lienhe" },
  ];

  // smooth scroll
  useEffect(() => {
    const handler = (e: any) => {
      const a = e.target?.closest?.("a[href^='#']");
      if (!a) return;
      const el = document.querySelector(a.getAttribute("href")!);
      if (!el) return;
      e.preventDefault();
      setMobile(false);
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  return (
    <header className="sticky top-0 z-[100] border-b border-white/10 backdrop-blur bg-[#052c24]/95">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex items-center justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0">
          <div className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0" style={{ background: gold, color: bg }}>
            <Building2 />
          </div>
          <div className="min-w-0">
            <div className="font-black text-base md:text-lg uppercase tracking-wide truncate">{data.name}</div>
            <div className="flex items-center gap-2 mt-1">
              <span className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase" style={{ background: gold, color: bg }}>Document</span>
              <span className="text-white/80 text-xs font-semibold tracking-wider truncate">{data.document}</span>
            </div>
          </div>
        </div>

        {/* Desktop */}
        <nav className="hidden lg:flex items-center gap-6 text-[11px] font-black uppercase tracking-widest">
          {nav.map(x => <a key={x.h} href={x.h} className="text-white/80 hover:text-white transition">{x.t}</a>)}
          <a href="#dangky" className="px-5 py-2 rounded-xl shadow-xl hover:scale-[1.03] transition font-black" style={{ background: gold, color: bg }}>ĐĂNG KÝ</a>
        </nav>

        {/* Mobile */}
        <button className="lg:hidden p-2 rounded-xl border border-white/10 hover:bg-white/5 transition" onClick={() => setMobile(v => !v)}>
          {mobile ? <X /> : <Menu />}
        </button>
      </div>

      {mobile && (
        <div className="lg:hidden border-t border-white/10 bg-[#052c24]">
          <div className="max-w-7xl mx-auto px-4 py-3 grid grid-cols-2 gap-2">
            {nav.map(x => (
              <a key={x.h} href={x.h} className="px-3 py-2 rounded-xl border border-white/10 text-[11px] font-black uppercase tracking-widest text-white/85 hover:bg-white/5 transition">{x.t}</a>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};

const Hero = ({ data }: { data: BizData }) => {
  const gold = "#c4a52e", bg = "#052c24";
  const heroImage = data.image?.length > 5 ? data.image : pickFallback(window.location.hostname);

  return (
    <section id="home" className="max-w-7xl mx-auto px-4 md:px-6 pt-10 md:pt-14">
      <div className="relative rounded-[32px] overflow-hidden border border-white/10 shadow-2xl">
        <img src={heroImage} alt="hero" className="w-full h-[60vh] object-cover" loading="lazy" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#052c24] via-[#052c24]/10 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-8 md:p-12">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 px-3 py-2 rounded-2xl border border-white/10 bg-[#031d18]/55">
              <CheckCircle2 size={18} style={{ color: gold }} />
              <span className="text-[11px] font-black uppercase tracking-[4px] text-white/85">Xác minh doanh nghiệp</span>
            </div>
            <h1 className="mt-5 text-4xl md:text-6xl font-black uppercase leading-[1.08]">
              STAR HILLS <span style={{ color: gold }}>LỘC AN</span>
            </h1>
            <h2 className="mt-2 text-xl md:text-2xl font-extrabold text-white/85 leading-snug">Khu nhà vườn sinh thái</h2>
            <p className="mt-4 text-white/75 max-w-3xl leading-relaxed text-sm md:text-base">
              Sự xuất hiện của Star Hills tại Lộc An sẽ tiên phong cho xu hướng Second Home, kiến tạo khu nhà vườn sinh thái lí tưởng.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <a href="#dangky" className="px-7 py-4 rounded-2xl font-black uppercase tracking-widest shadow-2xl hover:scale-[1.02] transition text-center" style={{ background: gold, color: bg }}>NHẬN BÁO GIÁ</a>
              <a href="#lienhe" className="px-7 py-4 rounded-2xl font-black uppercase tracking-widest border border-white/15 hover:bg-white/5 transition text-center">LIÊN HỆ</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// ===== Sections: Overview, Amenities, Legal =====
const Overview = () => {
  const gold = "#c4a52e";
  return (
    <section id="tongquan" className="max-w-7xl mx-auto px-4 md:px-6 py-16 md:py-20">
      <h3 className="text-2xl md:text-3xl font-black uppercase tracking-[4px]">
        Thông tin <span style={{ color: gold }}>tổng quan</span>
      </h3>
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="rounded-[28px] border border-white/10 bg-white/5 p-7">
          <div className="font-black uppercase tracking-widest text-sm" style={{ color: gold }}>Nội dung</div>
          <div className="mt-4 text-white/75 text-sm leading-relaxed">
            • Vị trí: Lộc An, Bảo Lâm, Lâm Đồng <br />
            • Tên dự án: Star Hills Lộc An <br />
            • Diện tích đa dạng: 5×20, 6×20, 6×21… <br />
            • Pháp lý: Sổ hồng sẵn công chứng ngay
          </div>
        </div>
        <div className="rounded-[28px] border border-white/10 bg-white/5 p-7 lg:col-span-2">
          <div className="text-xs font-black uppercase tracking-widest text-white/70">TÂM ĐIỂM ĐẦU TƯ</div>
          <div className="mt-2 text-2xl md:text-3xl font-black uppercase leading-tight">SINH LỜI <span style={{ color: gold }}>VƯỢT BẬC</span></div>
          <p className="mt-4 text-white/75 text-sm leading-relaxed">
            Star Hills Lộc An nằm tại vị trí đắc địa, gần như tiếp giáp TP. Bảo Lộc – địa phương phát triển hàng đầu tỉnh Lâm Đồng.
          </p>
          <a href="#dangky" className="inline-flex mt-6 px-7 py-3 rounded-2xl font-black uppercase tracking-widest shadow-xl hover:scale-[1.02] transition" style={{ background: gold, color: "#052c24" }}>NHẬN BÁO GIÁ</a>
        </div>
      </div>
    </section>
  );
};

const Amenities = () => {
  const gold = "#c4a52e";
  const items = [
    { title: "Hệ thống giao thông đồng bộ", desc: "Kết nối vùng thuận tiện di chuyển." },
    { title: "Khu du lịch", desc: "Phát triển dịch vụ du lịch sinh thái." },
    { title: "Khu dân cư", desc: "Dân cư hiện hữu, tiện ích liền kề." },
  ];
  return (
    <section id="tienich" className="max-w-7xl mx-auto px-4 md:px-6 pb-16 md:pb-20">
      <div className="text-center">
        <h3 className="text-3xl font-black uppercase tracking-[8px]" style={{ color: gold }}>TIỆN ÍCH NGOẠI KHU</h3>
        <p className="mt-3 text-white/70 italic text-sm">Bố cục gọn, không trùng lặp.</p>
      </div>
      <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((it, idx) => (
          <div key={idx} className="rounded-[28px] border border-white/10 bg-white/5 p-7 hover:bg-white/[0.07] transition">
            <div className="text-lg font-black uppercase">{it.title}</div>
            <div className="mt-2 text-white/70 text-sm leading-relaxed">{it.desc}</div>
          </div>
        ))}
      </div>
    </section>
  );
};

const Legal = () => {
  const gold = "#c4a52e";
  return (
    <section id="phaply" className="max-w-7xl mx-auto px-4 md:px-6 pb-16 md:pb-20">
      <div className="text-center">
        <h3 className="text-3xl font-black uppercase tracking-[8px]" style={{ color: gold }}>PHÁP LÝ ĐẦY ĐỦ</h3>
      </div>
      <div className="mt-10 rounded-[32px] border border-white/10 bg-white/5 p-8 md:p-10">
        <div className="text-white/75 text-sm leading-relaxed space-y-2 italic">
          <div>• Sổ hồng riêng</div>
          <div>• Công chứng sang tên ngay</div>
          <div>• Hỗ trợ ngân hàng</div>
        </div>
      </div>
    </section>
  );
};

// ===== Contact Form =====
const ContactForm = ({ data }: { data: BizData }) => {
  const gold = "#c4a52e", bg = "#052c24";
  const [toast, setToast] = useState<string | null>(null);

  return (
    <section id="dangky" className="max-w-7xl mx-auto px-4 md:px-6 pb-16 md:pb-20">
      <div className="rounded-[36px] border border-white/10 bg-[#031d18]/50 p-8 md:p-12">
        <h3 className="text-3xl md:text-4xl font-black uppercase text-center leading-tight">Đăng ký <span style={{ color: gold }}>nhận thông tin</span></h3>
        <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <form onSubmit={e => { e.preventDefault(); setToast("✅ Gửi thành công! Chúng tôi sẽ liên hệ sớm."); setTimeout(() => setToast(null), 4000); }} className="rounded-[28px] border border-white/10 bg-white/5 p-7">
            <input className="w-full px-4 py-3 rounded-2xl bg-[#052c24] border border-white/10 outline-none focus:border-white/25 text-sm" placeholder="Họ và tên" required />
            <div className="h-3" />
            <input className="w-full px-4 py-3 rounded-2xl bg-[#052c24] border border-white/10 outline-none focus:border-white/25 text-sm" placeholder="Số điện thoại" required />
            <div className="h-3" />
            <textarea className="w-full px-4 py-3 rounded-2xl bg-[#052c24] border border-white/10 outline-none focus:border-white/25 text-sm min-h-[110px]" placeholder="Nội dung quan tâm..." />
            <button type="submit" className="mt-5 w-full px-8 py-4 rounded-2xl font-black uppercase tracking-widest shadow-2xl hover:scale-[1.01] transition" style={{ background: gold, color: bg }}>ĐĂNG KÝ</button>
          </form>

          <div id="lienhe" className="rounded-[28px] border border-white/10 bg-white/5 p-7">
            <div className="text-[12px] font-black uppercase tracking-widest" style={{ color: gold }}>THÔNG TIN LIÊN HỆ</div>
            <div className="mt-5 space-y-4">
              <div className="flex items-center gap-3"><div className="p-2 rounded-full" style
