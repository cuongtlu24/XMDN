"use client";
import { useEffect, useState } from "react";
import { Phone, MapPin, Menu, X, CheckCircle2 } from "lucide-react";

type BizData = {
  name: string;
  address: string;
  document: string;
  phone: string;
  image?: string;
};

// ===== SLUG chuẩn hoá =====
function slugify(s: string) {
  return (s || "")
    .trim()
    .toLowerCase()
    .replace(/^\ufeff/, "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]/g, "");
}

// ===== CSV parser: xử lý dấu phẩy trong "..." =====
function parseCsvLine(line: string): string[] {
  const out: string[] = [];
  let cur = "";
  let inQ = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQ && line[i + 1] === '"') {
        cur += '"';
        i++;
      } else inQ = !inQ;
      continue;
    }
    if (ch === "," && !inQ) {
      out.push(cur.trim());
      cur = "";
      continue;
    }
    cur += ch;
  }
  out.push(cur.trim());
  return out;
}

function parseCsv(text: string) {
  return text
    .replace(/\r/g, "")
    .split("\n")
    .map((x) => x.trim())
    .filter(Boolean)
    .map(parseCsvLine);
}

// ===== ẢNH fallback =====
const FALLBACKS = [
  "https://images.unsplash.com/photo-1526772662000-3f88f10405ff?q=80&w=1800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=1800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1800&auto=format&fit=crop",
];

function pickFallback(key: string) {
  const s = slugify(key);
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return FALLBACKS[h % FALLBACKS.length];
}

export default function Page() {
  const [data, setData] = useState<BizData | null>(null);
  const [mobile, setMobile] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const SHEET_URL =
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vQmi6oayoemKBJXEWi4pkVHDsm166ap0XCwbopYrukBQnwj2gERseGlDnJVBrtciHwKEFj5dTqFLGiQ/pub?gid=0&single=true&output=csv";

  useEffect(() => {
    const run = async () => {
      try {
        const host = window.location.hostname.toLowerCase();
        let sub = host.split(".")[0];
        if (sub === "www") sub = host.split(".")[1] || "";
        const wanted = slugify(sub);
        const res = await fetch(SHEET_URL, { cache: "no-store" });
        const buf = await res.arrayBuffer();
        const text = new TextDecoder("utf-8").decode(buf);
        const rows = parseCsv(text);
        const match = rows.find((r) => slugify(r[0] || "") === wanted);
        if (match) {
          setData({
            name: match[1] || "",
            address: match[2] || "",
            document: match[3] || "",
            phone: match[4] || "",
            image: (match[5] || "").trim(),
          });
        } else {
          setData({
            name: "Johnson Marketing LLC",
            address: "123 Wall Street, New York",
            document: "B2025034222",
            phone: "0912 345 678",
            image: "",
          });
        }
      } catch (e) {
        console.error(e);
        setData({
          name: "Johnson Marketing LLC",
          address: "123 Wall Street, New York",
          document: "B2025034222",
          phone: "0912 345 678",
          image: "",
        });
      }
    };
    run();
  }, []);

  useEffect(() => {
    const handler = (e: any) => {
      const a = e.target?.closest?.("a[href^='#']");
      if (!a) return;
      const href = a.getAttribute("href");
      const el = document.querySelector(href);
      if (!el) return;
      e.preventDefault();
      setMobile(false);
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  const bg = "#052c24";
  const gold = "#c4a52e";

  if (!data) return null;

  const heroImage =
    data.image?.length > 5 ? data.image : pickFallback(window.location.hostname);

  const nav = [
    { t: "TRANG CHỦ", h: "#home" },
    { t: "TỔNG QUAN", h: "#tongquan" },
    { t: "VỊ TRÍ", h: "#vitri" },
    { t: "TIỆN ÍCH", h: "#tienich" },
    { t: "PHÁP LÝ", h: "#phaply" },
    { t: "ĐĂNG KÝ", h: "#dangky" },
    { t: "LIÊN HỆ", h: "#lienhe" },
  ];

  return (
    <div className="min-h-screen text-white" style={{ background: bg }}>
      {/* ===== HEADER ===== */}
      <header className="sticky top-0 z-[100] border-b border-white/10 backdrop-blur bg-[#052c24]/95">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex items-center justify-between gap-6">
          <div className="flex items-center gap-4 min-w-0 flex-wrap">
            <h1 className="font-black text-2xl md:text-3xl truncate" style={{ color: gold }}>
              {data.name}
            </h1>
            <span className="hidden md:inline text-sm md:text-base font-bold text-white/90">
              Document: {data.document}
            </span>
          </div>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-12 text-sm font-black uppercase tracking-widest">
            {nav.map((x) => (
              <a
                key={x.h}
                href={x.h}
                className="px-3 py-2 rounded-lg hover:bg-white/10 transition text-white font-bold text-sm"
              >
                {x.t}
              </a>
            ))}
            <a
              href="#dangky"
              className="ml-8 px-6 py-2 rounded-xl shadow-xl hover:scale-[1.05] transition font-black"
              style={{ background: gold, color: bg }}
            >
              ĐĂNG KÝ
            </a>
          </nav>

          {/* Mobile toggle */}
          <button
            className="lg:hidden p-2 rounded-xl border border-white/10 hover:bg-white/5 transition"
            onClick={() => setMobile((v) => !v)}
          >
            {mobile ? <X /> : <Menu />}
          </button>
        </div>

        {mobile && (
          <div className="lg:hidden border-t border-white/10 bg-[#052c24]">
            <div className="max-w-7xl mx-auto px-4 py-3 grid grid-cols-1 gap-3">
              {nav.map((x) => (
                <a
                  key={x.h}
                  href={x.h}
                  className="px-3 py-2 rounded-xl border border-white/10 text-[12px] font-black uppercase tracking-widest text-white/90 hover:bg-white/10 transition block text-center"
                >
                  {x.t}
                </a>
              ))}
              <a
                href="#dangky"
                className="mt-2 px-6 py-3 rounded-xl shadow-xl hover:scale-[1.05] transition font-black text-white bg-gold block text-center"
                style={{ background: gold, color: bg }}
              >
                ĐĂNG KÝ
              </a>
            </div>
          </div>
        )}
      </header>

      {/* ===== HERO ===== */}
      <section id="home" className="max-w-7xl mx-auto px-4 md:px-6 pt-10 md:pt-14">
        <div className="relative rounded-[32px] overflow-hidden border border-white/10 shadow-2xl">
          <img src={heroImage} alt="hero" className="w-full h-[520px] object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#052c24] via-[#052c24]/10 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-6 md:p-12 max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-2 rounded-2xl border border-white/10 bg-[#031d18]/60">
              <CheckCircle2 size={18} style={{ color: gold }} />
              <span className="text-[11px] font-black uppercase tracking-[4px] text-white/85">
                Xác minh doanh nghiệp
              </span>
            </div>
            <h1 className="mt-5 text-4xl md:text-6xl font-black uppercase leading-tight">
              {data.name.split(" ")[0]} <span style={{ color: gold }}>{data.name.split(" ")[1]}</span>
            </h1>
            <h2 className="mt-2 text-xl md:text-2xl font-extrabold text-white/85 leading-snug">
              Khu nhà vườn sinh thái
            </h2>
            <p className="mt-4 text-white/90 max-w-3xl leading-relaxed text-base md:text-lg">
              Sự xuất hiện của {data.name} tại {data.address} sẽ tiên phong cho xu hướng Second Home, kiến tạo khu nhà vườn sinh thái lí tưởng, cho phép chủ nhân tận hưởng không khí xanh, bền vững an cư và đầu tư cho tương lai.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row justify-start gap-6 md:gap-10">
              <a
                href="#dangky"
                className="px-8 py-3 rounded-2xl font-black uppercase tracking-widest shadow-2xl hover:scale-[1.03] transition text-center flex-1 sm:flex-none"
                style={{ background: gold, color: bg }}
              >
                NHẬN BÁO GIÁ
              </a>
              <a
                href="#lienhe"
                className="px-8 py-3 rounded-2xl font-black uppercase tracking-widest border border-white/15 hover:bg-white/10 transition text-center flex-1 sm:flex-none"
              >
                LIÊN HỆ
              </a>
            </div>
          </div>
        </div>
      </section>


      {/* ===== Các section khác giữ nguyên, chỉ chỉnh text-white/90 nếu cần ===== */}

      {/* ===== FOOTER ===== */}
      <footer className="border-t border-white/10 py-8 bg-[#031d18]">
        <div className="max-w-7xl mx-auto text-center space-y-4">
          <h2 className="font-black text-4xl uppercase tracking-widest" style={{ color: gold }}>
            {data.name}
          </h2>
          <div className="text-white/90 text-lg font-black uppercase tracking-widest">
            &copy; {new Date().getFullYear()} HỆ THỐNG XÁC MINH DOANH NGHIỆP
          </div>
          <div className="text-white/80 text-base">
            {data.address} | {data.phone} | Document: {data.document}
          </div>
        </div>
      </footer>

      {/* Floating CTA */}
      <a
        href="#dangky"
        className="fixed bottom-6 right-6 z-[150] px-6 py-4 rounded-full font-black shadow-2xl hover:scale-110 transition text-[10px] uppercase tracking-widest"
        style={{ background: "#dc2626", color: "white" }}
      >
        Đăng ký nhận thông tin
      </a>
    </div>
  );
}


