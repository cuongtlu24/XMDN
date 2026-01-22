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

// ===== CSV parser =====
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

  // Smooth scroll for in-page anchors
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

  // Set browser tab title = tên doanh nghiệp
  useEffect(() => {
    if (!data?.name) return;
    document.title = data.name;
  }, [data?.name]);

  const heroImage =
    data.image?.length > 5
      ? data.image
      : pickFallback(typeof window !== "undefined" ? window.location.hostname : "site");

  const nav = [
    { t: "TRANG CHỦ", h: "#home" },
    { t: "TỔNG QUAN", h: "#tongquan" },
    { t: "VỊ TRÍ", h: "#vitri" },
    { t: "TIỆN ÍCH", h: "#tienich" },
    { t: "GIÁ TRỊ ĐẦU TƯ", h: "#giatridautu" },
    { t: "PHÁP LÝ", h: "#phaply" },
    { t: "ĐĂNG KÝ", h: "#dangky" },
    { t: "LIÊN HỆ", h: "#lienhe" },
  ];

  return (
    <div className="min-h-screen text-white" style={{ background: bg, color: "white" }}>
      {/* ===== HEADER (thoáng + giống style mẫu hơn) ===== */}
      <header className="sticky top-0 z-[100] border-b border-white/10 backdrop-blur bg-[#052c24]/95">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-5 md:py-6 flex items-center justify-between gap-6">
          {/* Left: Brand */}
          <div className="min-w-0">
            <div className="flex items-center gap-3 min-w-0">
              <span className="hidden sm:inline-flex px-3 py-1 rounded-full border border-white/10 bg-[#031d18]/60 text-[10px] font-black uppercase tracking-[4px] text-white/80">
                XÁC MINH
              </span>

              <h1
                className="font-black text-lg md:text-xl uppercase tracking-[3px] truncate"
                style={{ color: gold }}
                title={data.name}
              >
                {data.name}
              </h1>
            </div>

            <div className="mt-1 text-[11px] md:text-sm font-extrabold uppercase tracking-widest text-white/80">
              Document: <span style={{ color: gold }}>{data.document}</span>
            </div>
          </div>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-10 xl:gap-12 text-[12px] font-black uppercase tracking-widest">
            {nav.map((x) => (
              <a key={x.h} href={x.h} className="text-white/80 hover:text-white transition">
                {x.t}
              </a>
            ))}

            <a
              href="#dangky"
              className="px-6 py-3 rounded-2xl shadow-xl hover:scale-[1.03] transition font-black"
              style={{ background: gold, color: "white" }} // chữ trắng
            >
              ĐĂNG KÝ
            </a>
          </nav>

          {/* Mobile */}
          <button
            className="lg:hidden p-2 rounded-xl border border-white/10 hover:bg-white/5 transition"
            onClick={() => setMobile((v) => !v)}
            aria-label="Menu"
          >
            {mobile ? <X /> : <Menu />}
          </button>
        </div>

        {mobile && (
          <div className="lg:hidden border-t border-white/10 bg-[#052c24]">
            <div className="max-w-7xl mx-auto px-4 py-4 grid grid-cols-2 gap-4">
              {nav.map((x) => (
                <a
                  key={x.h}
                  href={x.h}
                  className="px-3 py-3 rounded-xl border border-white/10 text-[11px] font-black uppercase tracking-widest text-white/85 hover:bg-white/5 transition"
                >
                  {x.t}
                </a>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* ===== HERO ===== */}
      <section id="home" className="max-w-7xl mx-auto px-4 md:px-6 pt-10 md:pt-14">
        <div className="relative rounded-[32px] overflow-hidden border border-white/10 shadow-2xl">
          <img src={heroImage} alt="hero" className="w-full h-[520px] object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#052c24] via-[#052c24]/10 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-8 md:p-12">
            <div className="max-w-4xl">
              <div className="inline-flex items-center gap-2 px-3 py-2 rounded-2xl border border-white/10 bg-[#031d18]/55">
                <CheckCircle2 size={18} style={{ color: gold }} />
                <span className="text-[11px] font-black uppercase tracking-[4px] text-white/85">
                  Xác minh doanh nghiệp
                </span>
              </div>

              <h1 className="mt-5 text-5xl md:text-7xl font-black uppercase leading-[1.15] tracking-tight">
                STAR HILLS <span style={{ color: gold }}>LỘC AN</span>
              </h1>

              <h2 className="mt-2 text-2xl md:text-3xl font-extrabold text-white/85 leading-snug">
                Khu nhà vườn sinh thái
              </h2>

              <p className="mt-4 text-white/90 max-w-3xl leading-relaxed text-base md:text-lg">
                Sự xuất hiện của Star Hills tại Lộc An sẽ tiên phong cho xu hướng Second Home,
                kiến tạo trở thành khu nhà vườn sinh thái lí tưởng, cho phép chủ nhân tận hưởng
                không khí xanh, bền vững an cư và đầu tư cho tương lai.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <a
                  href="#dangky"
                  className="px-8 py-4 rounded-2xl font-black uppercase tracking-widest shadow-2xl hover:scale-[1.02] transition text-center"
                  style={{ background: gold, color: "white" }} // chữ trắng
                >
                  NHẬN BÁO GIÁ
                </a>

                <a
                  href="#lienhe"
                  className="px-8 py-4 rounded-2xl font-black uppercase tracking-widest border border-white/15 hover:bg-white/5 transition text-center"
                >
                  LIÊN HỆ
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

   {/* ===== TỔNG QUAN ===== */}
      <section id="tongquan" className="max-w-7xl mx-auto px-4 md:px-6 py-16 md:py-20">
        <h3 className="text-3xl md:text-4xl font-black uppercase tracking-[4px]">
          Thông tin <span style={{ color: gold }}>tổng quan</span>
        </h3>
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="rounded-[28px] border border-white/10 bg-white/5 p-6 hover:bg-white/10 transition shadow-lg">
            <div className="font-black uppercase tracking-widest text-sm" style={{ color: gold }}>
              Nội dung
            </div>
            <div className="mt-4 text-white/90 text-base leading-relaxed space-y-2">
              <div>• Vị trí: Lộc An, Bảo Lâm, Lâm Đồng</div>
              <div>• Tên dự án: Star Hills Lộc An</div>
              <div>• Diện tích đa dạng: 5×20, 6×20, 6×21…</div>
              <div>• Pháp lý: Sổ hồng sẵn công chứng ngay</div>
            </div>
          </div>
          <div className="rounded-[28px] border border-white/10 bg-white/5 p-6 lg:col-span-2 hover:bg-white/10 transition shadow-lg">
            <div className="text-sm font-black uppercase tracking-widest text-white/70">
              TÂM ĐIỂM ĐẦU TƯ
            </div>
            <div className="mt-2 text-3xl md:text-4xl font-black uppercase leading-tight">
              SINH LỜI <span style={{ color: gold }}>VƯỢT BẬC</span>
            </div>
            <p className="mt-4 text-white/90 text-base leading-relaxed">
              Star Hills Lộc An nằm tại vị trí đắc địa, gần như tiếp giáp TP. Bảo Lộc – một trong các địa phương phát triển hàng đầu tại tỉnh Lâm Đồng.
            </p>
            <a
              href="#dangky"
              className="inline-flex mt-6 px-8 py-3 rounded-2xl font-black uppercase tracking-widest shadow-xl hover:scale-[1.02] transition"
              style={{ background: gold, color: bg }}
            >
              NHẬN BÁO GIÁ
            </a>
          </div>
        </div>
        <div className="mt-8">
          <img
            src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1800&auto=format&fit=crop"
            alt="Real estate overview"
            className="w-full h-auto rounded-[32px] border border-white/10 shadow-2xl"
          />
        </div>
      </section>

      {/* ===== VỊ TRÍ ===== */}
      <section id="vitri" className="max-w-7xl mx-auto px-4 md:px-6 py-16 md:py-20">
        <div className="text-center">
          <h3 className="text-4xl font-black uppercase tracking-[8px]" style={{ color: gold }}>
            VỊ TRÍ DỰ ÁN
          </h3>
          <p className="mt-3 text-white/90 text-base leading-relaxed max-w-3xl mx-auto">
            Star Hills Lộc An nằm tại vị trí đắc địa, gần như tiếp giáp TP. Bảo Lộc – một trong các địa phương phát triển hàng đầu tại tỉnh Lâm Đồng.
          </p>
        </div>
        <div className="mt-10 rounded-[32px] overflow-hidden border border-white/10 shadow-2xl">
          <img
            src="https://images.unsplash.com/photo-1578852549159-4d4e7c2e3e4c?q=80&w=1800&auto=format&fit=crop"
            alt="Map of Star Hills Lộc An"
            className="w-full h-auto object-cover"
          />
        </div>
      </section>

      {/* ===== TIỆN ÍCH ===== */}
      <section id="tienich" className="max-w-7xl mx-auto px-4 md:px-6 py-16 md:py-20">
        <div className="text-center">
          <h3 className="text-4xl font-black uppercase tracking-[8px]" style={{ color: gold }}>
            TIỆN ÍCH NGOẠI KHU
          </h3>
          <p className="mt-3 text-white/90 text-base leading-relaxed">
            Bố cục rõ ràng, ngắn gọn và hấp dẫn.
          </p>
        </div>
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            { title: "Hệ thống giao thông đồng bộ", desc: "Kết nối vùng thuận tiện di chuyển.", img: "https://images.unsplash.com/photo-1449965408869-eaa3f4f1d205?q=80&w=1800&auto=format&fit=crop" },
            { title: "Khu du lịch", desc: "Phát triển dịch vụ du lịch sinh thái.", img: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1800&auto=format&fit=crop" },
            { title: "Khu dân cư", desc: "Dân cư hiện hữu, tiện ích liền kề.", img: "https://images.unsplash.com/photo-1526772662000-3f88f10405ff?q=80&w=1800&auto=format&fit=crop" },
          ].map((it, idx) => (
            <div
              key={idx}
              className="rounded-[28px] border border-white/10 bg-white/5 p-6 hover:bg-white/[0.07] transition shadow-lg flex flex-col gap-4"
            >
              <img src={it.img} alt={it.title} className="w-full h-40 object-cover rounded-xl" />
              <div className="text-xl font-black uppercase">{it.title}</div>
              <div className="text-white/90 text-base leading-relaxed">{it.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== PHÁP LÝ ===== */}
      <section id="phaply" className="max-w-7xl mx-auto px-4 md:px-6 py-16 md:py-20">
        <div className="text-center">
          <h3 className="text-4xl font-black uppercase tracking-[8px]" style={{ color: gold }}>
            PHÁP LÝ ĐẦY ĐỦ
          </h3>
        </div>
        <div className="mt-10 rounded-[32px] border border-white/10 p-6 bg-white/5 shadow-2xl">
          <p className="text-white/90 text-base leading-relaxed">
            Dự án đã có sổ hồng riêng, công chứng ngay. Chủ đầu tư uy tín, minh bạch, đảm bảo quyền lợi khách hàng.
          </p>
        </div>
      </section>

      {/* ===== ĐĂNG KÝ ===== */}
      <section id="dangky" className="max-w-7xl mx-auto px-4 md:px-6 py-16 md:py-20">
        <div className="text-center">
          <h3 className="text-4xl font-black uppercase tracking-[8px]" style={{ color: gold }}>
            ĐĂNG KÝ NHẬN BÁO GIÁ
          </h3>
        </div>
        <form className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
          <input type="text" placeholder="Họ và tên" className="w-full px-4 py-3 rounded-2xl bg-[#052c24]/80 border border-white/20 outline-none focus:border-white/40 text-sm transition" />
          <input type="text" placeholder="Số điện thoại" className="w-full px-4 py-3 rounded-2xl bg-[#052c24]/80 border border-white/20 outline-none focus:border-white/40 text-sm transition" />
          <input type="text" placeholder="Email" className="w-full px-4 py-3 rounded-2xl bg-[#052c24]/80 border border-white/20 outline-none focus:border-white/40 text-sm transition sm:col-span-2" />
          <button
            type="submit"
            className="px-6 py-3 rounded-2xl font-black uppercase tracking-widest shadow-xl hover:scale-[1.02] transition bg-gold text-[#052c24] sm:col-span-2"
            style={{ background: gold, color: bg }}
          >
            GỬI ĐĂNG KÝ
          </button>
        </form>
      </section>


      {/* ===== FOOTER (giống style mẫu hơn) ===== */}
      <footer className="border-t border-white/10 bg-[#031d18]">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-10 md:py-14">
          <div className="text-center">
            <div className="text-sm md:text-base font-black uppercase tracking-widest text-white/70">
              THÔNG TIN LIÊN HỆ
            </div>
            <h2 className="mt-2 font-black text-3xl md:text-4xl uppercase tracking-widest" style={{ color: gold }}>
              {data.name}
            </h2>
          </div>

          <div className="mt-10 grid gap-8 md:grid-cols-3">
            {/* Menu */}
            <div className="space-y-3">
              <div className="text-[12px] font-black uppercase tracking-widest text-white/60">Về chúng tôi</div>
              <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm font-extrabold text-white/80">
                {nav.map((x) => (
                  <a key={x.h} href={x.h} className="hover:text-white transition">
                    {x.t}
                  </a>
                ))}
              </div>
            </div>

            {/* Hotline */}
            <div className="space-y-3">
              <div className="text-[12px] font-black uppercase tracking-widest text-white/60">Hotline</div>
              <div className="flex items-center gap-3 text-white/85">
                <Phone size={18} style={{ color: gold }} />
                <span className="text-base font-extrabold">{data.phone}</span>
              </div>
            </div>

            {/* Address + Document */}
            <div className="space-y-3">
              <div className="text-[12px] font-black uppercase tracking-widest text-white/60">Thông tin</div>

              <div className="flex items-start gap-3 text-white/85">
                <MapPin size={18} style={{ color: gold }} className="mt-0.5" />
                <div className="text-sm leading-relaxed">{data.address}</div>
              </div>

              <div className="text-sm font-extrabold text-white/80 uppercase tracking-widest">
                Document: <span style={{ color: gold }}>{data.document}</span>
              </div>
            </div>
          </div>

          <div className="mt-10 pt-8 border-t border-white/10 text-center text-xs md:text-sm text-white/70 font-black uppercase tracking-widest">
            © {new Date().getFullYear()} HỆ THỐNG XÁC MINH DOANH NGHIỆP
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
