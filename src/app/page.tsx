"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Phone,
  MapPin,
  Building2,
  CheckCircle2,
  Menu,
  X,
  Banknote,
  ShieldCheck,
  BadgeCheck,
  Users,
  Route,
  Landmark,
} from "lucide-react";

type BizData = {
  name: string;
  address: string;
  document: string;
  phone: string;
  image?: string;
};

function slugifySubdomain(input: string) {
  return (input || "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]/g, "");
}

/**
 * CSV parser tối giản nhưng xử lý được dấu phẩy trong chuỗi có dấu quote:
 * ví dụ: a,"b,c",d  -> ["a","b,c","d"]
 */
function parseCsvLine(line: string): string[] {
  const out: string[] = [];
  let cur = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];

    if (ch === '"') {
      // xử lý "" -> "
      if (inQuotes && line[i + 1] === '"') {
        cur += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (ch === "," && !inQuotes) {
      out.push(cur);
      cur = "";
      continue;
    }

    cur += ch;
  }

  out.push(cur);
  return out.map((s) => s.trim());
}

function parseCsv(text: string): string[][] {
  const lines = text
    .replace(/\r/g, "")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  return lines.map(parseCsvLine);
}

export default function Page() {
  const [data, setData] = useState<BizData | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const SHEET_URL = useMemo(
    () =>
      "https://docs.google.com/spreadsheets/d/e/2PACX-1vQmi6oayoemKBJXEWi4pkVHDsm166ap0XCwbopYrukBQnwj2gERseGlDnJVBrtciHwKEFj5bTqFLGiQ/pub?gid=0&single=true&output=csv",
    []
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const host = window.location.hostname.toLowerCase();
        const sub = host.split(".")[0];
        const normalizedSub = slugifySubdomain(sub);

        const res = await fetch(SHEET_URL, { cache: "no-store" });
        const arrayBuffer = await res.arrayBuffer();
        const text = new TextDecoder("utf-8").decode(arrayBuffer);

        const rows = parseCsv(text);

        // Sheet format:
        // A: subdomain | B: name | C: address | D: document | E: phone | F: image
        const match = rows.find((r) => slugifySubdomain(r[0] || "") === normalizedSub);

        if (match) {
          setData({
            name: match[1] || "",
            address: match[2] || "",
            document: match[3] || "",
            phone: match[4] || "",
            image: (match[5] || "").trim(),
          });
        } else {
          setData(null);
        }
      } catch (e) {
        console.error("Lỗi tải dữ liệu", e);
        setData(null);
      }
    };

    fetchData();
  }, [SHEET_URL]);

  // Smooth scroll for anchor links
  useEffect(() => {
    const handler = (e: any) => {
      const a = e.target?.closest?.("a[href^='#']");
      if (!a) return;
      const href = a.getAttribute("href");
      if (!href) return;
      const el = document.querySelector(href) as HTMLElement | null;
      if (!el) return;

      e.preventDefault();
      setMobileOpen(false);
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  const bgMain = "#052c24";
  const gold = "#c4a52e";

  const heroImage =
    data?.image ||
    "https://images.unsplash.com/photo-1526772662000-3f88f10405ff?q=80&w=1800&auto=format&fit=crop";

  const navItems = [
    { label: "TRANG CHỦ", href: "#home" },
    { label: "TỔNG QUAN", href: "#tongquan" },
    { label: "VỊ TRÍ", href: "#vitri" },
    { label: "TIỆN ÍCH", href: "#tienich" },
    { label: "GIÁ TRỊ ĐẦU TƯ", href: "#giatri" },
    { label: "PHÁP LÝ", href: "#phaply" },
    { label: "ĐĂNG KÝ", href: "#dangky" },
    { label: "LIÊN HỆ", href: "#lienhe" },
  ];

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#052c24] text-white italic px-6 text-center">
        Không tìm thấy dữ liệu doanh nghiệp theo subdomain.
        <br />
        Vui lòng kiểm tra lại dòng trong Google Sheet.
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white" style={{ background: bgMain }}>
      {/* ===== HEADER STICKY (GIỐNG WEB MẪU) ===== */}
      <header className="sticky top-0 z-[100] border-b border-white/10 backdrop-blur bg-[#052c24]/95">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div
              className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0"
              style={{ background: gold, color: bgMain }}
            >
              <Building2 />
            </div>
            <div className="leading-tight">
              <div className="font-black text-base md:text-lg uppercase tracking-wide">
                {data.name}
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span
                  className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase"
                  style={{ background: gold, color: bgMain }}
                >
                  Document
                </span>
                <span className="text-white/80 text-xs font-semibold tracking-widest">
                  {data.document}
                </span>
              </div>
            </div>
          </div>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-6 text-[11px] font-black uppercase tracking-widest">
            {navItems.map((it) => (
              <a
                key={it.href}
                href={it.href}
                className="text-white/80 hover:text-white transition"
              >
                {it.label}
              </a>
            ))}
            <a
              href="#dangky"
              className="px-5 py-2 rounded-xl shadow-xl hover:scale-[1.03] transition font-black"
              style={{ background: gold, color: bgMain }}
            >
              ĐĂNG KÝ
            </a>
          </nav>

          {/* Mobile button */}
          <button
            className="lg:hidden p-2 rounded-xl border border-white/10 hover:bg-white/5 transition"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Menu"
          >
            {mobileOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile dropdown */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-white/10 bg-[#052c24]">
            <div className="max-w-7xl mx-auto px-4 py-3 grid grid-cols-2 gap-2">
              {navItems.map((it) => (
                <a
                  key={it.href}
                  href={it.href}
                  className="px-3 py-2 rounded-xl border border-white/10 text-[11px] font-black uppercase tracking-widest text-white/85 hover:bg-white/5 transition"
                >
                  {it.label}
                </a>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* ===== HERO ===== */}
      <section id="home" className="max-w-7xl mx-auto px-4 md:px-6 pt-10 md:pt-14">
        <div className="relative rounded-[32px] overflow-hidden border border-white/10 shadow-2xl">
          <img
            src={heroImage}
            alt="hero"
            className="w-full h-[520px] object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#052c24] via-[#052c24]/15 to-transparent" />

          <div className="absolute inset-x-0 bottom-0 p-8 md:p-12">
            <div className="max-w-4xl">
              <div
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-white/10 text-[10px] font-black uppercase tracking-[6px]"
                style={{ background: "rgba(3,29,24,.55)" }}
              >
                <CheckCircle2 size={16} style={{ color: gold }} />
                Xác minh doanh nghiệp
              </div>

              <h1 className="mt-5 text-4xl md:text-6xl font-black uppercase leading-[1.05]">
                STAR HILLS <span style={{ color: gold }}>LỘC AN</span>
              </h1>
              <h2 className="mt-2 text-xl md:text-2xl font-extrabold text-white/85">
                Khu nhà vườn sinh thái
              </h2>

              <p className="mt-4 text-white/75 max-w-3xl leading-relaxed">
                Sự xuất hiện của Star Hills tại Lộc An sẽ tiên phong cho xu hướng
                Second Home, kiến tạo trở thành khu nhà vườn sinh thái lí tưởng,
                cho phép chủ nhân tận hưởng không khí xanh, bền vững an cư và đầu
                tư cho tương lai.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <a
                  href="#dangky"
                  className="px-7 py-4 rounded-2xl font-black uppercase tracking-widest shadow-2xl hover:scale-[1.02] transition text-center"
                  style={{ background: gold, color: bgMain }}
                >
                  NHẬN BÁO GIÁ
                </a>
                <a
                  href="#lienhe"
                  className="px-7 py-4 rounded-2xl font-black uppercase tracking-widest border border-white/15 hover:bg-white/5 transition text-center"
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
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h3 className="text-2xl md:text-3xl font-black uppercase tracking-[6px]">
              Thông tin <span style={{ color: gold }}>tổng quan</span>
            </h3>
            <p className="mt-2 text-white/65 italic">
              Nội dung giữ nguyên như mẫu, chỉ thay tên công ty / địa chỉ / SĐT.
            </p>
          </div>

          <a
            href="#dangky"
            className="px-6 py-3 rounded-2xl font-black uppercase tracking-widest shadow-xl hover:scale-[1.02] transition"
            style={{ background: gold, color: bgMain }}
          >
            NHẬN BÁO GIÁ
          </a>
        </div>

        <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="rounded-[28px] border border-white/10 bg-white/5 p-7">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-2xl flex items-center justify-center"
                style={{ background: gold, color: bgMain }}
              >
                <Landmark />
              </div>
              <div className="font-black uppercase tracking-widest text-sm" style={{ color: gold }}>
                Thông tin
              </div>
            </div>

            <div className="mt-6 space-y-3 text-white/80">
              <div className="flex gap-3">
                <span className="text-white/55">•</span>
                <span>Vị trí: Lộc An, Bảo Lâm, Lâm Đồng</span>
              </div>
              <div className="flex gap-3">
                <span className="text-white/55">•</span>
                <span>Tên dự án: Star Hills Lộc An</span>
              </div>
              <div className="flex gap-3">
                <span className="text-white/55">•</span>
                <span>Diện tích đa dạng: 5×20, 6×20, 6×21…</span>
              </div>
              <div className="flex gap-3">
                <span className="text-white/55">•</span>
                <span>Pháp lý: Sổ hồng sẵn công chứng ngay</span>
              </div>
            </div>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-white/5 p-7 lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="text-sm font-black uppercase tracking-widest text-white/75">
                  TÂM ĐIỂM ĐẦU TƯ
                </div>
                <div className="text-2xl md:text-3xl font-black uppercase">
                  SINH LỜI <span style={{ color: gold }}>VƯỢT BẬC</span>
                </div>
                <p className="text-white/75 leading-relaxed">
                  Star Hills Lộc An nằm tại vị trí đắc địa, gần như tiếp giáp TP.
                  Bảo Lộc – một trong các địa phương phát triển hàng đầu tại tỉnh
                  Lâm Đồng. Trong thời gian tới thị trường BĐS nơi đây có nhiều
                  lợi thế để gia tăng giá trị.
                </p>
                <p className="text-white/75 leading-relaxed">
                  Khu nhà vườn sinh thái nằm trong khu dân cư hiện hữu với nhiều
                  tiện ích liền kề, thích hợp an cư nghỉ dưỡng và đầu tư.
                </p>
              </div>

              <div className="rounded-[24px] overflow-hidden border border-white/10">
                <img
                  src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1200&auto=format&fit=crop"
                  alt="overview"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== VỊ TRÍ ===== */}
      <section id="vitri" className="max-w-7xl mx-auto px-4 md:px-6 pb-16 md:pb-20">
        <div className="rounded-[32px] border border-white/10 bg-white/5 p-7 md:p-10">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center"
              style={{ background: gold, color: bgMain }}
            >
              <MapPin />
            </div>
            <h3 className="text-2xl md:text-3xl font-black uppercase tracking-widest">
              Vị trí <span style={{ color: gold }}>đắc địa</span>
            </h3>
          </div>

          <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="text-white/80 leading-relaxed">
              <p>
                Khu vực có hạ tầng kết nối vùng thuận tiện, đón đầu xu hướng Second Home
                và tiềm năng tăng trưởng dài hạn.
              </p>

              <div className="mt-6 rounded-[24px] border border-white/10 bg-[#031d18]/40 p-6">
                <div className="flex items-start gap-4">
                  <div
                    className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0"
                    style={{ background: gold, color: bgMain }}
                  >
                    <Route />
                  </div>
                  <div>
                    <div className="font-black uppercase tracking-widest text-sm" style={{ color: gold }}>
                      Địa chỉ doanh nghiệp
                    </div>
                    <div className="mt-2 text-white/75 text-sm leading-snug">
                      {data.address}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-[24px] overflow-hidden border border-white/10">
              <iframe
                title="map"
                className="w-full h-[320px] md:h-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                src={`https://www.google.com/maps?q=${encodeURIComponent(
                  data.address
                )}&output=embed`}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ===== TIỆN ÍCH ===== */}
      <section id="tienich" className="max-w-7xl mx-auto px-4 md:px-6 pb-16 md:pb-20">
        <div className="text-center">
          <h3 className="text-3xl font-black uppercase tracking-[10px]" style={{ color: gold }}>
            TIỆN ÍCH NGOẠI KHU
          </h3>
          <p className="mt-3 text-white/70 italic">
            Đáp ứng đầy đủ – giống bố cục web mẫu.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { icon: Route, title: "Hệ thống giao thông", desc: "Kết nối vùng đồng bộ, thuận tiện di chuyển." },
            { icon: Landmark, title: "Khu du lịch", desc: "Tiềm năng phát triển dịch vụ, du lịch sinh thái." },
            { icon: Users, title: "Khu dân cư", desc: "Dân cư hiện hữu, tiện ích liền kề đầy đủ." },
          ].map((it, idx) => (
            <div
              key={idx}
              className="rounded-[28px] border border-white/10 bg-white/5 p-7 hover:bg-white/[0.07] transition"
            >
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center"
                style={{ background: gold, color: bgMain }}
              >
                <it.icon />
              </div>
              <div className="mt-5 text-xl font-black uppercase">{it.title}</div>
              <div className="mt-2 text-white/70 text-sm leading-relaxed">{it.desc}</div>
            </div>
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <a
            href="#dangky"
            className="px-8 py-4 rounded-2xl font-black uppercase tracking-widest shadow-2xl hover:scale-[1.02] transition"
            style={{ background: gold, color: bgMain }}
          >
            NHẬN BÁO GIÁ
          </a>
        </div>
      </section>

      {/* ===== GIÁ TRỊ ĐẦU TƯ ===== */}
      <section id="giatri" className="max-w-7xl mx-auto px-4 md:px-6 pb-16 md:pb-20">
        <div className="rounded-[32px] border border-white/10 bg-white/5 p-7 md:p-10">
          <div className="text-center">
            <h3 className="text-3xl md:text-4xl font-black uppercase">
              TIỀM NĂNG <span style={{ color: gold }}>ĐẦU TƯ</span> VÀ AN CƯ
            </h3>
          </div>

          <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4 text-white/75 leading-relaxed">
              {[
                "Bảo Lâm – 1 trong 4 vùng kinh tế trọng điểm tỉnh Lâm Đồng.",
                "Lộc An sáp nhập vào TP. Bảo Lộc.",
                "Phát triển đô thị sinh thái mới: du lịch sinh thái rừng, thác, hồ; du lịch văn hóa…",
                "Chú trọng phát triển các đô thị chức năng công nghiệp, thương mại dịch vụ.",
                "Đề nghị phê duyệt chỉ tiêu sử dụng “đất ở” theo mức cao nhất giai đoạn 2021-2030.",
                "Xây dựng dự án hạ tầng chiến lược: nâng cấp quốc lộ, kết nối cao tốc…",
              ].map((t, i) => (
                <div key={i} className="flex gap-3">
                  <CheckCircle2 size={18} style={{ color: gold }} className="mt-0.5 shrink-0" />
                  <span>{t}</span>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { icon: BadgeCheck, title: "Sổ hồng riêng" },
                { icon: Banknote, title: "Hỗ trợ ngân hàng" },
                { icon: ShieldCheck, title: "Công chứng sang tên ngay" },
                { icon: Users, title: "Dân cư hiện hữu" },
              ].map((it, idx) => (
                <div
                  key={idx}
                  className="rounded-[26px] border border-white/10 bg-[#031d18]/45 p-6"
                >
                  <div
                    className="w-11 h-11 rounded-2xl flex items-center justify-center"
                    style={{ background: gold, color: bgMain }}
                  >
                    <it.icon />
                  </div>
                  <div className="mt-4 font-black uppercase">{it.title}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-10 flex justify-center">
            <a
              href="#dangky"
              className="px-8 py-4 rounded-2xl font-black uppercase tracking-widest shadow-2xl hover:scale-[1.02] transition"
              style={{ background: gold, color: bgMain }}
            >
              NHẬN BÁO GIÁ
            </a>
          </div>
        </div>
      </section>

      {/* ===== PHÁP LÝ ===== */}
      <section id="phaply" className="max-w-7xl mx-auto px-4 md:px-6 pb-16 md:pb-20">
        <div className="text-center">
          <h3
            className="text-3xl font-black uppercase tracking-[10px] inline-block pb-4 border-b"
            style={{ color: gold, borderColor: "rgba(196,165,46,.25)" }}
          >
            PHÁP LÝ ĐẦY ĐỦ
          </h3>
        </div>

        <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <div className="space-y-5 text-white/75 leading-relaxed border-l-2 pl-7 italic"
               style={{ borderColor: "rgba(196,165,46,.25)" }}>
            <p>• Sổ hồng riêng</p>
            <p>• Công chứng sang tên ngay</p>
            <p>• Hỗ trợ ngân hàng</p>
            <p>• Pháp lý minh bạch, thông tin rõ ràng</p>

            <a
              href="#dangky"
              className="inline-flex px-8 py-4 rounded-2xl font-black uppercase tracking-widest shadow-2xl hover:scale-[1.02] transition not-italic"
              style={{ background: gold, color: bgMain }}
            >
              NHẬN BÁO GIÁ
            </a>
          </div>

          <div className="rounded-[28px] p-2 shadow-2xl" style={{ background: gold }}>
            <img
              src="https://img.vietnamfinance.vn/upload/news/vungnv/2021/10/22/so-hong.jpg"
              className="rounded-[22px] w-full"
              alt="Legal"
            />
          </div>
        </div>
      </section>

      {/* ===== ĐĂNG KÝ (FORM) ===== */}
      <section id="dangky" className="max-w-7xl mx-auto px-4 md:px-6 pb-16 md:pb-20">
        <div className="rounded-[36px] border border-white/10 bg-[#031d18]/50 p-8 md:p-12">
          <div className="text-center">
            <h3 className="text-3xl md:text-4xl font-black uppercase">
              Đăng ký <span style={{ color: gold }}>nhận thông tin</span>
            </h3>
            <p className="mt-4 text-white/70 leading-relaxed max-w-3xl mx-auto">
              Xin chân thành cám ơn Quý khách đã quan tâm. Để biết thêm thông tin chi tiết,
              Quý khách vui lòng liên hệ trực tiếp hoặc để lại thông tin theo mẫu bên dưới.
              Chúng tôi sẽ hồi âm trong thời gian sớm nhất.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-8">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setSubmitted(true);
                setTimeout(() => setSubmitted(false), 2200);
              }}
              className="rounded-[28px] border border-white/10 bg-white/5 p-7"
            >
              <div className="text-sm font-black uppercase tracking-widest" style={{ color: gold }}>
                GỬI THÔNG TIN
              </div>

              <div className="mt-5 space-y-4">
                <input
                  className="w-full px-4 py-3 rounded-2xl bg-[#052c24] border border-white/10 outline-none focus:border-white/25 text-sm"
                  placeholder="Họ và tên"
                  required
                />
                <input
                  className="w-full px-4 py-3 rounded-2xl bg-[#052c24] border border-white/10 outline-none focus:border-white/25 text-sm"
                  placeholder="Số điện thoại"
                  required
                />
                <input
                  className="w-full px-4 py-3 rounded-2xl bg-[#052c24] border border-white/10 outline-none focus:border-white/25 text-sm"
                  placeholder="Email"
                />
                <textarea
                  className="w-full px-4 py-3 rounded-2xl bg-[#052c24] border border-white/10 outline-none focus:border-white/25 text-sm min-h-[120px]"
                  placeholder="Nội dung quan tâm..."
                />
              </div>

              <button
                type="submit"
                className="mt-6 w-full px-8 py-4 rounded-2xl font-black uppercase tracking-widest shadow-2xl hover:scale-[1.01] transition"
                style={{ background: gold, color: bgMain }}
              >
                ĐĂNG KÝ
              </button>

              <p className="mt-5 text-[12px] text-white/55 leading-relaxed">
                Chúng tôi đặc biệt cẩn trọng trong việc chuẩn bị các nội dung trên website này.
                Mọi thông tin/hình ảnh mang tính chất tham khảo.
              </p>
            </form>

            <div id="lienhe" className="rounded-[28px] border border-white/10 bg-white/5 p-7">
              <div className="text-sm font-black uppercase tracking-widest" style={{ color: gold }}>
                THÔNG TIN LIÊN HỆ
              </div>

              <div className="mt-6 space-y-5">
                <div className="flex items-start gap-4">
                  <div
                    className="p-2 rounded-full shadow-lg"
                    style={{ background: gold, color: bgMain }}
                  >
                    <Phone size={18} />
                  </div>
                  <div>
                    <div className="text-[11px] font-black uppercase tracking-widest text-white/70">
                      HOTLINE
                    </div>
                    <div className="text-lg font-black tracking-tight">
                      {data.phone}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div
                    className="p-2 rounded-full shadow-lg mt-0.5"
                    style={{ background: gold, color: bgMain }}
                  >
                    <MapPin size={18} />
                  </div>
                  <div>
                    <div className="text-[11px] font-black uppercase tracking-widest text-white/70">
                      ADDRESS
                    </div>
                    <div className="text-sm text-white/75 leading-snug">
                      {data.address}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div
                    className="p-2 rounded-full shadow-lg mt-0.5"
                    style={{ background: gold, color: bgMain }}
                  >
                    <CheckCircle2 size={18} />
                  </div>
                  <div>
                    <div className="text-[11px] font-black uppercase tracking-widest text-white/70">
                      DOCUMENT
                    </div>
                    <div className="text-sm text-white/75 leading-snug">
                      {data.document}
                    </div>
                  </div>
                </div>

                <div className="pt-3">
                  <a
                    href="#home"
                    className="inline-flex px-7 py-4 rounded-2xl font-black uppercase tracking-widest border border-white/15 hover:bg-white/5 transition"
                  >
                    VỀ TRANG CHỦ
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Toast */}
          {submitted && (
            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[200]">
              <div className="px-6 py-3 rounded-2xl shadow-2xl border border-white/10 bg-[#031d18] text-white/90 text-sm font-bold">
                ✅ Gửi thành công! Chúng tôi sẽ liên hệ sớm.
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="bg-[#031d18] border-t border-white/10 pt-14 pb-10 px-4 md:px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="space-y-4">
            <div className="text-2xl font-black uppercase" style={{ color: gold }}>
              {data.name}
            </div>
            <p className="text-white/55 text-sm italic leading-relaxed">
              Cung cấp giải pháp minh bạch thông tin doanh nghiệp hàng đầu tại khu vực.
            </p>
          </div>

          <div className="space-y-3">
            <div className="text-[12px] font-black uppercase tracking-widest" style={{ color: gold }}>
              Về chúng tôi
            </div>
            <div className="grid grid-cols-2 gap-2 text-[13px] text-white/65">
              {navItems.slice(0, 6).map((it) => (
                <a
                  key={it.href}
                  href={it.href}
                  className="px-3 py-2 rounded-xl border border-white/10 hover:bg-white/5 transition"
                >
                  {it.label}
                </a>
              ))}
            </div>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-[#052c24] p-7 space-y-4">
            <div className="text-[12px] font-black uppercase tracking-widest" style={{ color: gold }}>
              Thông tin liên hệ
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full" style={{ background: gold, color: bgMain }}>
                <Phone size={18} />
              </div>
              <div className="font-black">HOTLINE: {data.phone}</div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 rounded-full mt-0.5" style={{ background: gold, color: bgMain }}>
                <MapPin size={18} />
              </div>
              <div className="text-white/70 text-sm leading-snug">
                Address: {data.address}
              </div>
            </div>

            <div className="text-white/65 text-sm">
              Document: <span className="font-black text-white/80">{data.document}</span>
            </div>
          </div>
        </div>

        <div className="text-center mt-14 text-[10px] text-white/40 uppercase tracking-[5px]">
          © 2026 HỆ THỐNG XÁC MINH DOANH NGHIỆP - ALL RIGHTS RESERVED
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
