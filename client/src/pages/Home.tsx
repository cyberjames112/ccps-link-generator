/*
 * CCPS 家慶佳業 — 業務專屬連結生成器
 * Design: Corporate Luxury — Dark Immersive Dashboard
 * Colors: Deep charcoal navy bg, gold accents, glassmorphism cards
 * Fonts: Cormorant Garamond (brand), DM Sans (UI), Noto Sans TC (Chinese), Space Mono (URLs)
 */

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  Copy,
  ExternalLink,
  Share2,
  Check,
  User,
  MessageCircle,
  Building2,
  Sparkles,
  ChevronDown,
  Mail,
  Info,
} from "lucide-react";

// Background art stays on CDN; building thumbs are served from public/images
// via Vite BASE_URL so they work in dev (/) and on GH Pages (/ccps-link-generator/).
const HERO_BG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663123178525/6UoSeyiBpge75ajqFvTqTL/hero-bg-KYX7F4hVrytB9VhNx7dqbf.webp";
const PATTERN_BG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663123178525/6UoSeyiBpge75ajqFvTqTL/pattern-bg-SdwTmXNVFACZnS3CgzPZmh.webp";
const GOLDEN_CROWN_IMG = `${import.meta.env.BASE_URL}images/golden-crown-thumb.jpg`;
const PAPYRUS_NK_IMG = `${import.meta.env.BASE_URL}images/papyrus-thumb.jpg`;
const OXLEY_IMG = `${import.meta.env.BASE_URL}images/oxley-thumb.jpg`;

interface Property {
  id: string;
  name: string;
  nameCn: string;
  baseUrl: string;
  image: string;
  description: string;
  tags: string[];
}

const PROPERTIES: Property[] = [
  {
    id: "golden-crown",
    name: "Golden Crown Residence",
    nameCn: "金悅公寓",
    baseUrl: "https://golden-crown-residence-production.up.railway.app/",
    image: GOLDEN_CROWN_IMG,
    description: "馬來西亞唯一雙捷運站共構住宅，60層樓，490戶",
    tags: ["99年地契", "2026.08 交屋", "雙捷運共構"],
  },
  {
    id: "papyrus-nk",
    name: "Papyrus @ North Kiara",
    nameCn: "Papyrus NK",
    baseUrl: "https://papyrus-north-kiara-production.up.railway.app/",
    image: PAPYRUS_NK_IMG,
    description: "吉隆坡永久產權豪宅，V字型雙塔，城市綠洲中的奢華居所",
    tags: ["永久產權", "最後8戶", "低密度住宅"],
  },
  {
    id: "oxley-so-sofitel",
    name: "Oxley Tower · SO/ Sofitel KL",
    nameCn: "Oxley Tower",
    baseUrl: "https://cyberjames112.github.io/oxley-so-sofitel/",
    image: OXLEY_IMG,
    description: "吉隆坡 KLCC 永久地契品牌住宅，SO/ Sofitel 進駐，77 樓無邊際泳池",
    tags: ["永久產權", "已完工拎包入住", "KLCC 雙子星地段"],
  },
  {
    id: "booking",
    name: "CCPS Inspection Tour",
    nameCn: "報名考察團",
    baseUrl: "https://ccps-presentation-production.up.railway.app/b/mnuunqzn",
    image: PATTERN_BG,
    description: "直接報名 CCPS 考察團，親臨建案現場",
    tags: ["專業導覽", "實地考察", "線上報名"],
  },
];

function generateLink(baseUrl: string, agentName: string, lineId: string, email?: string): string {
  const params = new URLSearchParams({
    agent: agentName,
    line: lineId,
  });
  if (email) {
    params.append("email", email);
  }
  return `${baseUrl}?${params.toString()}`;
}

// ─── Copy Button Component ───
function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success("已複製連結！", {
        description: "連結已複製到剪貼簿",
        duration: 2000,
      });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const textarea = document.createElement("textarea");
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      toast.success("已複製連結！");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 bg-[#D4A853] text-[#0B1120] hover:bg-[#E0B96A] hover:shadow-[0_0_20px_rgba(212,168,83,0.3)] active:scale-95"
    >
      {copied ? (
        <>
          <Check className="w-4 h-4" />
          <span>已複製</span>
        </>
      ) : (
        <>
          <Copy className="w-4 h-4" />
          <span>複製連結</span>
        </>
      )}
    </button>
  );
}

// ─── Share Button Component ───
function ShareButton({ url, title }: { url: string; title: string }) {
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          await navigator.clipboard.writeText(url);
          toast.success("已複製連結！");
        }
      }
    } else {
      await navigator.clipboard.writeText(url);
      toast.success("已複製連結！", {
        description: "您的裝置不支援分享功能，已複製到剪貼簿",
      });
    }
  };

  return (
    <button
      onClick={handleShare}
      className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 border border-[#D4A853]/30 text-[#D4A853] hover:bg-[#D4A853]/10 hover:border-[#D4A853]/50 active:scale-95"
    >
      <Share2 className="w-4 h-4" />
      <span>分享</span>
    </button>
  );
}

// ─── Property Card Component ───
function PropertyCard({
  property,
  agentName,
  lineId,
  email,
  index,
}: {
  property: Property;
  agentName: string;
  lineId: string;
  email: string;
  index: number;
}) {
  const link = generateLink(property.baseUrl, agentName, lineId, email);
  console.log(`[PropertyCard] ${property.nameCn} preview link:`, link);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="glass-card rounded-xl overflow-hidden group"
    >
      {/* Property Image */}
      <div className="relative h-48 sm:h-56 overflow-hidden">
        <img
          src={property.image}
          alt={property.nameCn}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B1120] via-[#0B1120]/40 to-transparent" />
        <div className="absolute bottom-4 left-5 right-5">
          <h3 className="font-serif text-2xl text-[#F5F0E8] tracking-wide">
            {property.nameCn}
          </h3>
          <p className="text-[#D4A853] text-sm font-mono tracking-wider mt-0.5">
            {property.name}
          </p>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5 space-y-4">
        <p className="text-[#8B95A5] text-sm leading-relaxed">
          {property.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {property.tags.map((tag) => (
            <span
              key={tag}
              className="px-2.5 py-1 text-xs rounded-md bg-[#D4A853]/10 text-[#D4A853] border border-[#D4A853]/20"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Generated URL */}
        <div className="bg-[#0B1120]/60 rounded-lg p-3 border border-[#1E2A45]">
          <p className="text-[#8B95A5] text-xs mb-1.5">您的專屬連結</p>
          <p className="text-[#F5F0E8] text-xs font-mono break-all leading-relaxed select-all">
            {link}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2">
          <CopyButton text={link} />
          <ShareButton url={link} title={`${property.nameCn} - ${agentName} 專屬連結`} />
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 border border-[#2A3550] text-[#8B95A5] hover:text-[#F5F0E8] hover:border-[#3A4A6A] active:scale-95 hover:shadow-[0_0_15px_rgba(212,168,83,0.15)] cursor-pointer"
          >
            <ExternalLink className="w-4 h-4" />
            <span>預覽</span>
          </a>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Main Home Component ───
export default function Home() {
  const [agentName, setAgentName] = useState("");
  const [lineId, setLineId] = useState("");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submittedName, setSubmittedName] = useState("");
  const [submittedLineId, setSubmittedLineId] = useState("");
  const [submittedEmail, setSubmittedEmail] = useState("");
  const resultsRef = useRef<HTMLDivElement>(null);

  // Load from localStorage
  useEffect(() => {
    const savedName = localStorage.getItem("ccps_agent_name");
    const savedLineId = localStorage.getItem("ccps_line_id");
    const savedEmail = localStorage.getItem("ccps_agent_email");
    if (savedName) setAgentName(savedName);
    if (savedLineId) setLineId(savedLineId);
    if (savedEmail) setEmail(savedEmail);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!agentName.trim()) {
      toast.error("請輸入業務姓名");
      return;
    }
    if (!lineId.trim()) {
      toast.error("請輸入 LINE ID");
      return;
    }
    if (!email.trim()) {
      toast.error("請輸入電子郵件");
      return;
    }

    // Save to localStorage
    localStorage.setItem("ccps_agent_name", agentName.trim());
    localStorage.setItem("ccps_line_id", lineId.trim());
    localStorage.setItem("ccps_agent_email", email.trim());

    setSubmittedName(agentName.trim());
    setSubmittedLineId(lineId.trim());
    setSubmittedEmail(email.trim());
    setSubmitted(true);

    // Scroll to results
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 300);
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background layers */}
      <div className="fixed inset-0 bg-[#0B1120]" />
      <div
        className="fixed inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `url(${PATTERN_BG})`,
          backgroundSize: "400px",
          backgroundRepeat: "repeat",
        }}
      />
      <div className="fixed inset-0 bg-gradient-to-b from-[#0B1120] via-transparent to-[#0B1120]/80" />

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <header className="border-b border-[#1E2A45]/60">
          <div className="container py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#D4A853] to-[#B8923A] flex items-center justify-center shadow-lg shadow-[#D4A853]/10">
                <Building2 className="w-5 h-5 text-[#0B1120]" />
              </div>
              <div>
                <h1 className="text-[#F5F0E8] text-base font-semibold tracking-wide">
                  CCPS 家慶佳業
                </h1>
                <p className="text-[#8B95A5] text-xs tracking-wider">
                  業務專屬連結生成器
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="relative py-16 sm:py-24 overflow-hidden">
          <div
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage: `url(${HERO_BG})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0B1120]/60 via-[#0B1120]/40 to-[#0B1120]" />

          <div className="container relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="max-w-2xl"
            >
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-4 h-4 text-[#D4A853]" />
                <span className="text-[#D4A853] text-sm font-medium tracking-wider uppercase">
                  Link Generator
                </span>
              </div>
              <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-[#F5F0E8] leading-tight tracking-wide">
                業務專屬
                <br />
                <span className="gold-shimmer">連結生成器</span>
              </h2>
              <p className="mt-5 text-[#8B95A5] text-base sm:text-lg leading-relaxed max-w-lg">
                輸入您的姓名與 LINE ID，即刻生成各建案的專屬連結。
                客戶點擊連結後，將直接連繫到您的 LINE 帳號。
              </p>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="mt-8 flex items-center gap-2 text-[#8B95A5]/60 text-sm"
              >
                <ChevronDown className="w-4 h-4 animate-bounce" />
                <span>填寫表單開始使用</span>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Form Section */}
        <section className="py-12 sm:py-16">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="max-w-xl mx-auto"
            >
              <form onSubmit={handleSubmit}>
                <div className="glass-card rounded-2xl p-6 sm:p-8 space-y-6">
                  {/* Section title */}
                  <div className="flex items-center gap-3 pb-4 border-b border-[#1E2A45]/60">
                    <div className="w-8 h-8 rounded-lg bg-[#D4A853]/10 flex items-center justify-center">
                      <User className="w-4 h-4 text-[#D4A853]" />
                    </div>
                    <div>
                      <h3 className="text-[#F5F0E8] font-medium">業務資訊</h3>
                      <p className="text-[#8B95A5] text-xs mt-0.5">
                        請輸入您的姓名與 LINE ID
                      </p>
                    </div>
                  </div>

                  {/* Agent Name */}
                  <div className="space-y-2">
                    <label className="text-[#8B95A5] text-sm font-medium flex items-center gap-2">
                      <User className="w-3.5 h-3.5" />
                      業務姓名
                    </label>
                    <input
                      type="text"
                      value={agentName}
                      onChange={(e) => setAgentName(e.target.value)}
                      placeholder="例：王小明"
                      className="w-full px-4 py-3 rounded-lg bg-[#0B1120]/60 border border-[#1E2A45] text-[#F5F0E8] placeholder-[#4A5568] focus:border-[#D4A853]/50 focus:ring-1 focus:ring-[#D4A853]/30 transition-all duration-300 text-sm"
                    />
                  </div>

                  {/* LINE ID */}
                  <div className="space-y-2">
                    <label className="text-[#8B95A5] text-sm font-medium flex items-center gap-2">
                      <MessageCircle className="w-3.5 h-3.5" />
                      LINE ID
                    </label>
                    <input
                      type="text"
                      value={lineId}
                      onChange={(e) => setLineId(e.target.value)}
                      placeholder="例：your_line_id"
                      className="w-full px-4 py-3 rounded-lg bg-[#0B1120]/60 border border-[#1E2A45] text-[#F5F0E8] placeholder-[#4A5568] focus:border-[#D4A853]/50 focus:ring-1 focus:ring-[#D4A853]/30 transition-all duration-300 text-sm font-mono"
                    />
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <label className="text-[#8B95A5] text-sm font-medium flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5" />
                      電子郵件
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="例：your@email.com"
                      className="w-full px-4 py-3 rounded-lg bg-[#0B1120]/60 border border-[#1E2A45] text-[#F5F0E8] placeholder-[#4A5568] focus:border-[#D4A853]/50 focus:ring-1 focus:ring-[#D4A853]/30 transition-all duration-300 text-sm"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-lg bg-gradient-to-r from-[#D4A853] to-[#B8923A] text-[#0B1120] font-semibold text-sm tracking-wider hover:from-[#E0B96A] hover:to-[#C9A04A] transition-all duration-300 hover:shadow-[0_0_30px_rgba(212,168,83,0.25)] active:scale-[0.98] btn-gold-pulse"
                  >
                    生成專屬連結
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        </section>

        {/* Results Section */}
        <AnimatePresence>
          {submitted && (
            <motion.section
              ref={resultsRef}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="py-12 sm:py-16"
            >
              <div className="container">
                {/* Results Header */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="text-center mb-10"
                >
                  <div className="flex items-center justify-center gap-2 mb-3">
                    <div className="h-px w-12 bg-gradient-to-r from-transparent to-[#D4A853]/50" />
                    <Sparkles className="w-4 h-4 text-[#D4A853]" />
                    <div className="h-px w-12 bg-gradient-to-l from-transparent to-[#D4A853]/50" />
                  </div>
                  <h2 className="font-serif text-3xl sm:text-4xl text-[#F5F0E8] tracking-wide">
                    您的專屬建案連結
                  </h2>
                  <p className="mt-3 text-[#8B95A5] text-sm">
                    業務：<span className="text-[#D4A853]">{submittedName}</span>
                    {" "}｜ LINE ID：
                    <span className="text-[#D4A853] font-mono">{submittedLineId}</span>
                  </p>
                </motion.div>

                {/* Property Cards Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-5xl mx-auto">
                  {PROPERTIES.map((property, index) => (
                    <PropertyCard
                      key={property.id}
                      property={property}
                      agentName={submittedName}
                      lineId={submittedLineId}
                      email={submittedEmail}
                      index={index}
                    />
                  ))}
                </div>

                {/* Injection Script Info */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="mt-12 max-w-3xl mx-auto"
                >
                  <div className="glass-card rounded-xl p-6">
                    <h3 className="text-[#D4A853] font-medium text-sm mb-3 flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      使用說明
                    </h3>
                    <div className="space-y-2 text-[#8B95A5] text-sm leading-relaxed">
                      <p>
                        1. 將上方生成的專屬連結分享給客戶
                      </p>
                      <p>
                        2. 客戶點擊連結後，建案網頁上的「我有興趣」LINE 按鈕將自動連結到您的 LINE 帳號
                      </p>
                      <p>
                        3. 當客戶透過「報名考察團」連結提交表單時，您會收到一份統計郵件通知
                      </p>
                      <p>
                        4. 您的姓名、LINE ID 與電子郵件已自動儲存，下次開啟時無需重新輸入
                      </p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        {/* Footer */}
        <footer className="py-8 border-t border-[#1E2A45]/40">
          <div className="container text-center">
            <p className="text-[#4A5568] text-xs tracking-wider">
              &copy; {new Date().getFullYear()} CCPS 家慶佳業. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
