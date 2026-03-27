"use client";
import { useState, useEffect } from "react";

const ORDERS = [
  { name: "Ana Lima",  item: "Açaí 500ml — Granola",     total: "R$ 28,00", time: "agora", initials: "AL", color: "#16A34A" },
  { name: "Carlos M.", item: "Pizza Grande — Calabresa",  total: "R$ 56,00", time: "2min",  initials: "CM", color: "#2563EB" },
  { name: "Julia S.",  item: "Brigadeiro Gourmet ×4",     total: "R$ 32,00", time: "5min",  initials: "JS", color: "#9333EA" },
  { name: "Pedro R.",  item: "Combo Açaí + Suco",         total: "R$ 44,00", time: "8min",  initials: "PR", color: "#D97706" },
];

const FEATURES = [
  { title: "Catálogo personalizado",     desc: "Logo, cores e banner com a identidade da sua marca.",
    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg> },
  { title: "Produtos com variações", desc: "Tamanhos, sabores, cores — cada um com seu preço.",
    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg> },
  { title: "Carrinho inteligente",   desc: "Seus clientes montam o pedido com facilidade.",
    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg> },
  { title: "Pedido por WhatsApp",    desc: "Receba os detalhes do pedido direto no seu WhatsApp.",
    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg> },
  { title: "Painel completo",        desc: "Gerencie produtos, pedidos e métricas em um só lugar.",
    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg> },
  { title: "100% responsivo",        desc: "Funciona perfeitamente no celular e no computador.",
    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg> },
];

const FAQ = [
  { q: "Preciso pagar para começar?",              a: "Não. Você testa o sistema na prática, cria sua página, adiciona produtos e recebe pedidos — sem custo inicial." },
  { q: "Quanto tempo leva para criar meu catálogo?", a: "Menos de 2 minutos. Basta fazer o cadastro, escolher o nome e você já pode começar a adicionar produtos." },
  { q: "Como meus clientes fazem pedidos?",        a: "Acessam o link do seu catálogo, navegam pelos produtos, adicionam ao carrinho e finalizam. Você recebe no painel e pode encaminhar ao WhatsApp." },
  { q: "Posso personalizar a aparência do catálogo?",  a: "Sim. Logo, cores da marca e banners — tudo para o catálogo ter a cara do seu negócio." },
  { q: "Funciona no celular?",                     a: "Perfeitamente. Tanto o catálogo público quanto o painel admin são 100% responsivos e funcionam muito bem em smartphones e tablets." },
  { q: "Posso ter produtos com variações?",        a: "Sim. Tamanhos, sabores, cores — cada variação pode ter seu próprio preço. Perfeito para catálogos de alimentos, roupas e muito mais." },
  { q: "Tem limite de produtos ou pedidos?",       a: "Não. Adicione quantos produtos quiser e receba quantos pedidos vierem — sem restrições artificiais." },
  { q: "Como funciona a integração com WhatsApp?", a: "Ao confirmar um pedido, o sistema gera a mensagem formatada com todos os dados e abre direto no WhatsApp do dono do catálogo." },
  { q: "Por que não usar só o WhatsApp?", a: "WhatsApp é ótimo pra conversar. Mas pra receber pedido vira bagunça: áudio, print, mensagem que some. Com o sistema de pedidos, seu cliente acessa o link, monta o carrinho, e você recebe tudo certinho — ainda no WhatsApp, mas organizado." },
  { q: "Quanto custa depois do período grátis?", a: "Durante o teste é 100% gratuito, sem cartão. Depois, o plano tem um valor acessível pra qualquer pequeno negócio. Você decide se quer continuar só depois de testar — sem compromisso." },
  { q: "Preciso de site, domínio ou técnico?", a: "Não. É só criar a conta, configurar seu catálogo e compartilhar o link. Nada de programador, hospedagem ou domínio." },
];

const STEPS = [
  { num: "01", title: "Configure seu catálogo",     desc: "Cadastre-se, escolha o nome e personalize com logo e cores. Menos de 2 minutos para estar no ar.",
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg> },
  { num: "02", title: "Cadastre seus produtos", desc: "Fotos, preços e variações como tamanho, sabor ou cor. Organize tudo por categorias.",
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg> },
  { num: "03", title: "Receba pedidos",         desc: "Clientes acessam pelo link, montam o carrinho e finalizam. Você recebe no painel e no WhatsApp.",
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg> },
];

const STATS = [
  { value: "500+", label: "Lojas ativas",          icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg> },
  { value: "50K+", label: "Pedidos por mês",        icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg> },
  { value: "10K+", label: "Produtos cadastrados",   icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg> },
  { value: "2min", label: "Para estar no ar",       icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> },
];

// ── Sub-components ──────────────────────────────────────────────

function PhoneMockup() {
  const products = [
    { emoji: "🍇", name: "Açaí 500ml",    price: "R$ 22,00", badge: "Popular", badgeBg: "#DCFCE7", badgeColor: "#166534" },
    { emoji: "🍕", name: "Combo Família", price: "R$ 89,00", badge: null },
    { emoji: "🍫", name: "Brigadeiro ×6", price: "R$ 36,00", badge: "Novo",    badgeBg: "#FEF9C3", badgeColor: "#854D0E" },
  ];
  return (
    <div style={{ width: 210, flexShrink: 0, background: "#111", borderRadius: 36, padding: 8,
      boxShadow: "0 32px 64px rgba(0,0,0,0.22), 0 0 0 1px rgba(255,255,255,0.07)" }}>
      <div style={{ width: 60, height: 18, background: "#111", borderRadius: 9, margin: "0 auto 6px" }} />
      <div style={{ background: "#fff", borderRadius: 26, overflow: "hidden", minHeight: 400 }}>
        <div style={{ background: "#16A34A", padding: "14px 14px 10px", color: "#fff" }}>
          <div style={{ fontSize: 9, opacity: .7, letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 3 }}>AÇAÍ CENTRAL</div>
          <div style={{ fontWeight: 700, fontSize: 14 }}>Olá! O que vai querer? 👋</div>
        </div>
        <div style={{ display: "flex", gap: 5, padding: "8px 10px 4px" }}>
          {["Todos","Açaí","Combos","Bebidas"].map((c,i) => (
            <div key={c} style={{ fontSize: 9, fontWeight: 600, padding: "3px 8px", borderRadius: 20, flexShrink: 0,
              background: i===0?"#16A34A":"#F3F4F6", color: i===0?"#fff":"#6B7280" }}>{c}</div>
          ))}
        </div>
        <div style={{ padding: "4px 10px", display: "flex", flexDirection: "column", gap: 6 }}>
          {products.map(p => (
            <div key={p.name} style={{ display: "flex", alignItems: "center", gap: 8,
              background: "#F9FAFB", borderRadius: 10, padding: "7px 8px", border: "1px solid #F3F4F6" }}>
              <div style={{ width: 34, height: 34, borderRadius: 9, background: "#DCFCE7",
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>{p.emoji}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 10, fontWeight: 600, color: "#111827" }}>{p.name}</div>
                <div style={{ fontSize: 10, color: "#16A34A", fontWeight: 700 }}>{p.price}</div>
              </div>
              {p.badge && <div style={{ fontSize: 8, fontWeight: 700, padding: "2px 5px", borderRadius: 5,
                background: p.badgeBg, color: p.badgeColor }}>{p.badge}</div>}
              <div style={{ width: 20, height: 20, borderRadius: "50%", background: "#16A34A",
                color: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 14, fontWeight: 700, flexShrink: 0 }}>+</div>
            </div>
          ))}
        </div>
        <div style={{ padding: "8px 10px 14px" }}>
          <div style={{ background: "#16A34A", borderRadius: 10, padding: "9px 12px",
            display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ color: "#fff", fontSize: 10, fontWeight: 700 }}>🛒  Ver carrinho</div>
            <div style={{ background: "rgba(255,255,255,0.2)", color: "#fff", fontSize: 9,
              fontWeight: 700, padding: "2px 6px", borderRadius: 6 }}>2 itens</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function OrderNotification() {
  const [idx, setIdx] = useState(0);
  const [show, setShow] = useState(true);
  useEffect(() => {
    const t = setInterval(() => {
      setShow(false);
      setTimeout(() => { setIdx(i => (i+1) % ORDERS.length); setShow(true); }, 350);
    }, 3000);
    return () => clearInterval(t);
  }, []);
  const o = ORDERS[idx];
  return (
    <div style={{ background: "#fff", borderRadius: 14, padding: "10px 14px", width: 258,
      boxShadow: "0 4px 24px rgba(0,0,0,0.09), 0 0 0 1px rgba(0,0,0,0.05)",
      display: "flex", alignItems: "center", gap: 10,
      opacity: show ? 1 : 0, transform: show ? "translateY(0)" : "translateY(5px)",
      transition: "opacity .3s, transform .3s" }}>
      <div style={{ width: 34, height: 34, borderRadius: "50%", background: o.color+"18",
        color: o.color, display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 10, fontWeight: 800, flexShrink: 0 }}>{o.initials}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: "#111827" }}>{o.name}</span>
          <span style={{ fontSize: 10, color: "#9CA3AF" }}>{o.time}</span>
        </div>
        <div style={{ fontSize: 10, color: "#6B7280", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{o.item}</div>
        <div style={{ fontSize: 10, fontWeight: 700, color: "#16A34A", marginTop: 1 }}>{o.total}</div>
      </div>
    </div>
  );
}

function WhatsAppCard() {
  return (
    <div style={{ background: "#fff", borderRadius: 14, padding: "12px 14px", width: 228,
      boxShadow: "0 4px 24px rgba(0,0,0,0.09), 0 0 0 1px rgba(0,0,0,0.05)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
        <div style={{ width: 26, height: 26, borderRadius: "50%", background: "#dcfce7",
          display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13 }}>💬</div>
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#111827" }}>WhatsApp</div>
          <div style={{ fontSize: 9, color: "#9CA3AF" }}>Mensagem automática</div>
        </div>
      </div>
      <div style={{ background: "#DCF8C6", borderRadius: "10px 10px 2px 10px",
        padding: "8px 10px", fontSize: 9.5, color: "#1a1a1a", lineHeight: 1.6 }}>
        🧾 <b>Novo Pedido #047</b><br />
        👤 Ana Lima · (51) 99999-8888<br /><br />
        • 1× Açaí 500ml — R$ 22,00<br />
        • 1× Granola extra — R$ 6,00<br /><br />
        💰 <b>Total: R$ 28,00</b>
      </div>
      <div style={{ fontSize: 9, color: "#9CA3AF", textAlign: "right", marginTop: 4 }}>✓✓ Entregue</div>
    </div>
  );
}

function StatCard({ value, label }) {
  return (
    <div style={{ background: "#fff", borderRadius: 12, padding: "10px 14px",
      boxShadow: "0 4px 20px rgba(0,0,0,0.07), 0 0 0 1px rgba(0,0,0,0.05)",
      display: "flex", alignItems: "center", gap: 10 }}>
      <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#16A34A", flexShrink: 0 }} />
      <div>
        <div style={{ fontSize: 15, fontWeight: 800, color: "#111827", lineHeight: 1 }}>{value}</div>
        <div style={{ fontSize: 10, color: "#9CA3AF", marginTop: 2 }}>{label}</div>
      </div>
    </div>
  );
}

function TrustPill({ icon, children }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 8,
      fontSize: 13, color: "#374151", fontWeight: 500,
      background: "#fff", border: "1px solid #E5E7EB",
      borderRadius: 100, padding: "6px 14px", whiteSpace: "nowrap" }}>
      {icon}
      {children}
    </span>
  );
}

function CategoryCard({ images }) {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIdx(i => (i+1) % images.length), 4000);
    return () => clearInterval(t);
  }, [images]);
  return (
    <div style={{ borderRadius:16, overflow:"hidden", position:"relative", aspectRatio:"1", background:"#F3F4F6" }}>
      {images.map((src, i) => (
        <img key={src} src={src} alt="" style={{
          position:"absolute", inset:0, width:"100%", height:"100%",
          objectFit:"cover", display:"block",
          opacity: i === idx ? 1 : 0,
          transition:"opacity 0.8s ease",
        }} />
      ))}
    </div>
  );
}

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div onClick={() => setOpen(!open)}
      style={{ borderBottom: "1px solid #F3F4F6", cursor: "pointer" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, padding: "18px 0" }}>
        <span style={{ fontSize: 14.5, fontWeight: 600, color: "#111827", lineHeight: 1.4 }}>{q}</span>
        <span style={{
          width: 26, height: 26, borderRadius: "50%", flexShrink: 0,
          border: open ? "1.5px solid #86EFAC" : "1.5px solid #E5E7EB",
          background: open ? "#F0FDF4" : "transparent",
          display: "inline-flex", alignItems: "center", justifyContent: "center",
          transition: "border-color .2s, background .2s",
        }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
            stroke={open ? "#16A34A" : "#9CA3AF"} strokeWidth="2.5"
            strokeLinecap="round" strokeLinejoin="round"
            style={{ transform: open ? "rotate(180deg)" : "rotate(0)", transition: "transform .22s ease, stroke .2s" }}>
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        </span>
      </div>
      {open && <p style={{ margin: "0 0 16px", fontSize: 13.5, color: "#6B7280", lineHeight: 1.7 }}>{a}</p>}
    </div>
  );
}

// ── Main ────────────────────────────────────────────────────────

export default function FosfoHome() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [platformName, setPlatformName] = useState("Sistema de Pedidos Fosfo");

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    fetch("/api/platform-settings")
      .then((r) => r.json())
      .then((data) => {
        if (data?.platform_name) setPlatformName(data.platform_name);
      })
      .catch(() => {});
  }, []);

  const handleSmoothScroll = (e, targetId) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div style={{ fontFamily: "'DM Sans','Helvetica Neue',sans-serif", background: "#fff", color: "#111827", overflowX: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700;9..40,800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes floatA { 0%,100%{transform:translateY(0) rotate(-0.5deg)} 50%{transform:translateY(-12px) rotate(0.5deg)} }
        @keyframes floatB { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        @keyframes floatC { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        .fade-up { animation: fadeUp .65s ease both; }
        .d1{animation-delay:.05s} .d2{animation-delay:.15s} .d3{animation-delay:.25s} .d4{animation-delay:.35s} .d5{animation-delay:.45s}
        .float-a { animation: floatA 5s ease-in-out infinite; }
        .float-b { animation: floatB 4s ease-in-out infinite .5s; }
        .float-c { animation: floatC 5.5s ease-in-out infinite 1s; }
        .nav-link { font-size:14px; color:#6B7280; font-weight:500; text-decoration:none; transition:color .15s; }
        .nav-link:hover { color:#111827; }
        .btn-green { display:inline-flex; align-items:center; gap:7px; background:#16A34A; color:#fff; font-size:14px; font-weight:600; padding:11px 22px; border-radius:9px; text-decoration:none; border:none; cursor:pointer; transition:background .15s,transform .12s; }
        .btn-green:hover { background:#15803D; transform:translateY(-1px); }
        .btn-outline { display:inline-flex; align-items:center; gap:7px; background:#fff; color:#374151; font-size:14px; font-weight:600; padding:11px 22px; border-radius:9px; text-decoration:none; border:1.5px solid #E5E7EB; cursor:pointer; transition:border-color .15s,background .12s,transform .12s; }
        .btn-outline:hover { border-color:#D1D5DB; background:#F9FAFB; transform:translateY(-1px); }
        .step-card { background:#fff; border:1px solid #E5E7EB; border-radius:16px; padding:32px 24px 36px; position:relative; overflow:hidden; transition:border-color .2s,box-shadow .2s; display:flex; flex-direction:column; align-items:center; text-align:center; }
        .step-card:hover { border-color:#BBF7D0; box-shadow:0 8px 32px rgba(22,163,74,.08); }
        .feat-card { background:#fff; border:1px solid #F3F4F6; border-radius:12px; padding:24px; transition:border-color .2s,box-shadow .2s; }
        .feat-card:hover { border-color:#D1FAE5; box-shadow:0 4px 20px rgba(22,163,74,.07); }
        .demo-row { display:flex; align-items:center; justify-content:space-between; padding:16px 20px; background:#FAFAF9; border:1px solid #F3F4F6; border-radius:12px; text-decoration:none; transition:border-color .15s; cursor:pointer; }
        .demo-row:hover { border-color:#D1FAE5; }
        .section { padding:96px 0; }
        .container { max-width:1100px; margin:0 auto; padding:0 24px; }
        .section-label { font-size:11.5px; font-weight:600; color:#16A34A; letter-spacing:.08em; text-transform:uppercase; margin-bottom:10px; }
        .section-title { font-size:clamp(26px,3vw,34px); font-weight:800; color:#111827; letter-spacing:-.03em; line-height:1.15; }
        @media(max-width:860px){.hero-grid,.demo-grid,.faq-grid{grid-template-columns:1fr!important} .visual-col{display:none!important} .stats-grid{grid-template-columns:repeat(2,1fr)!important} .steps-grid,.feat-grid{grid-template-columns:1fr!important} .demo-text-col,.faq-text-col{text-align:center!important}}
        .mobile-menu-toggle { display: none; }
        @media(max-width:768px){
          .stats-grid{grid-template-columns:repeat(2,1fr)!important}
          .categories-grid{grid-template-columns:repeat(2,1fr)!important}
          .nav-center{display:none!important}
          .nav-desktop-buttons{display:none!important}
          .mobile-menu-toggle{display:block!important}
          .section{padding:48px 0!important}
          .btn-green, .btn-outline{width:100%!important;justify-content:center!important}
          .footer-links{display:none!important}
          .cta-benefits{flex-direction:column!important;align-items:center!important}
        }
        @media(max-width:580px){
          .problem-comparison{grid-template-columns:1fr!important}
        }
        .mobile-menu-overlay { position: fixed; top: 60px; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); opacity: 0; pointer-events: none; transition: opacity 0.3s ease; z-index: 99; }
        .mobile-menu-overlay.open { opacity: 1; pointer-events: auto; }
        .mobile-menu { position: fixed; top: 60px; right: -100%; width: 280px; height: calc(100vh - 60px); background: #fff; box-shadow: -4px 0 24px rgba(0,0,0,0.1); transition: right 0.3s ease; z-index: 100; overflow-y: auto; }
        .mobile-menu.open { right: 0; }
        .mobile-menu-item { display: block; padding: 16px 24px; color: #374151; font-size: 15px; font-weight: 500; text-decoration: none; border-bottom: 1px solid #F3F4F6; transition: background 0.2s; }
        .mobile-menu-item:hover { background: #F9FAFB; }
        .mobile-menu-button { padding: 16px 24px; margin: 16px 24px; }
      `}</style>

      {/* NAVBAR */}
      <nav style={{ position:"fixed", top:0, left:0, right:0, zIndex:100, height:60,
        display:"flex", alignItems:"center", padding:"0 32px",
        background: scrolled ? "rgba(255,255,255,0.92)" : "#fff",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        borderBottom:`1px solid ${scrolled?"rgba(0,0,0,0.07)":"#F3F4F6"}`,
        transition:"background .2s, border-color .2s" }}>
        <div style={{ maxWidth:1100, margin:"0 auto", width:"100%", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <a href="/" style={{ textDecoration:"none", display:"flex", alignItems:"center", gap:9 }}>
            <div style={{ width:32, height:32, borderRadius:9, background:"#111827",
              display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                <polyline points="9 22 9 12 15 12 15 22"/>
              </svg>
            </div>
            <span style={{ fontSize:17, fontWeight:800, color:"#111827", letterSpacing:"-.04em" }}>{platformName}</span>
          </a>
          <div className="nav-center" style={{ display:"flex", gap:28 }}>
            <a href="#como-funciona" className="nav-link">Como funciona</a>
            <a href="#funcionalidades" className="nav-link">Funcionalidades</a>
            <a href="#faq" className="nav-link">FAQ</a>
          </div>
          <div className="nav-desktop-buttons" style={{ display:"flex", alignItems:"center", gap:8 }}>
            <a href="/login" className="nav-link" style={{ padding:"6px 12px", borderRadius:8 }}>Entrar</a>
            <a href="/register" className="btn-green" style={{ fontSize:13, padding:"8px 16px" }}>Criar meu catálogo grátis</a>
          </div>
          <button 
            className="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{ background:"none", border:"none", cursor:"pointer", padding:8 }}
            aria-label="Menu">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              {mobileMenuOpen ? (
                <>
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </>
              ) : (
                <>
                  <line x1="3" y1="12" x2="21" y2="12"/>
                  <line x1="3" y1="6" x2="21" y2="6"/>
                  <line x1="3" y1="18" x2="21" y2="18"/>
                </>
              )}
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div 
        className={`mobile-menu-overlay ${mobileMenuOpen ? 'open' : ''}`}
        onClick={() => setMobileMenuOpen(false)}
      />

      {/* Mobile Menu */}
      <div className={`mobile-menu ${mobileMenuOpen ? 'open' : ''}`}>
        <a href="#como-funciona" className="mobile-menu-item" onClick={(e) => handleSmoothScroll(e, 'como-funciona')}>Como funciona</a>
        <a href="#funcionalidades" className="mobile-menu-item" onClick={(e) => handleSmoothScroll(e, 'funcionalidades')}>Funcionalidades</a>
        <a href="#faq" className="mobile-menu-item" onClick={(e) => handleSmoothScroll(e, 'faq')}>FAQ</a>
        <a href="/demo" className="mobile-menu-item">Ver demo</a>
        <a href="/login" className="mobile-menu-item">Entrar</a>
        <a href="/register" className="btn-green mobile-menu-button" style={{ width:"calc(100% - 48px)", justifyContent:"center" }}>Criar meu catálogo grátis</a>
      </div>

      {/* HERO */}
      <section style={{ paddingTop:60, minHeight:"100vh", display:"flex", alignItems:"center",
        background:"#fff", position:"relative", overflow:"hidden" }}>

        {/* organic contour background */}
        <svg style={{ position:"absolute", right:-20, top:0, height:"100%", width:"62%",
          zIndex:0, pointerEvents:"none" }}
          viewBox="0 0 520 800" xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="xMidYMid slice" fill="none">
          <path d="M 520 720 C 420 690, 340 620, 280 540 C 220 460, 180 370, 160 280 C 148 220, 150 160, 170 100" stroke="#D1FAE5" strokeWidth="1" opacity="1"/>
          <path d="M 520 680 C 430 648, 352 576, 294 492 C 236 408, 196 316, 178 224 C 166 162, 168 100, 190 40" stroke="#BBF7D0" strokeWidth="1" opacity="0.9"/>
          <path d="M 520 636 C 440 602, 364 528, 308 442 C 252 356, 212 262, 196 168 C 184 104, 186 40, 210 -20" stroke="#86EFAC" strokeWidth="0.8" opacity="0.7"/>
          <path d="M 520 592 C 450 556, 376 480, 322 392 C 268 304, 228 208, 214 112 C 202 46, 204 -20, 230 -82" stroke="#4ADE80" strokeWidth="0.7" opacity="0.45"/>
          <path d="M 520 548 C 460 510, 388 432, 336 342 C 284 252, 244 154, 232 56 C 220 -12, 222 -80, 250 -144" stroke="#22C55E" strokeWidth="0.6" opacity="0.25"/>
          <path d="M 520 780 C 410 750, 326 676, 264 590 C 202 504, 160 408, 138 314 C 124 250, 126 186, 148 124" stroke="#D1FAE5" strokeWidth="1.2" opacity="0.8"/>
          <path d="M 520 820 C 400 792, 308 716, 244 628 C 180 540, 136 442, 112 346 C 96 280, 98 214, 122 150" stroke="#BBF7D0" strokeWidth="1" opacity="0.6"/>
          <path d="M 520 860 C 392 834, 292 756, 226 666 C 160 576, 114 476, 88 378 C 70 310, 72 242, 98 176" stroke="#D1FAE5" strokeWidth="1.4" opacity="0.5"/>
          <path d="M 380 800 C 330 762, 270 682, 230 596 C 190 510, 168 410, 158 318 C 150 254, 152 190, 172 128" stroke="#D1FAE5" strokeWidth="1.5" opacity="0.45"/>
          <path d="M 340 800 C 298 760, 248 676, 212 586 C 176 496, 158 394, 150 300 C 143 234, 146 168, 168 104" stroke="#BBF7D0" strokeWidth="1" opacity="0.3"/>
          <path d="M 300 800 C 266 758, 224 670, 192 576 C 160 482, 144 378, 138 282 C 132 214, 136 146, 160 80" stroke="#D1FAE5" strokeWidth="0.8" opacity="0.18"/>
        </svg>
        <div style={{ position:"absolute", left:0, top:0, bottom:0, width:"52%",
          background:"linear-gradient(to right, #fff 65%, transparent 100%)", zIndex:1, pointerEvents:"none" }} />
        <div style={{ position:"absolute", top:0, left:0, right:0, height:120,
          background:"linear-gradient(to bottom, #fff, transparent)", zIndex:1, pointerEvents:"none" }} />
        <div style={{ position:"absolute", bottom:0, left:0, right:0, height:120,
          background:"linear-gradient(to top, #fff, transparent)", zIndex:1, pointerEvents:"none" }} />

        <div className="container" style={{ width:"100%", position:"relative", zIndex:2 }}>
          <div className="hero-grid" style={{ display:"grid", gridTemplateColumns:"1fr 1fr",
            gap:64, alignItems:"center", paddingTop:48, paddingBottom:72 }}>
            <div>
              <div className="fade-up d1" style={{ marginBottom:24 }}>
                <TrustPill>
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <circle cx="5" cy="5" r="3" fill="#16A34A"/>
                    <circle cx="5" cy="5" r="5" stroke="#86EFAC" strokeWidth="1"/>
                  </svg>
                  30 dias para testar · sem cartão
                </TrustPill>
              </div>
              <h1 className="fade-up d2" style={{ fontSize:"clamp(36px,4.5vw,54px)", fontWeight:800,
                color:"#0A0A09", lineHeight:1.08, letterSpacing:"-.03em", marginBottom:20 }}>
                Seu catálogo online{" "}
                <span style={{ color:"#16A34A", position:"relative", display:"inline-block" }}>
                  pronto
                  <svg viewBox="0 0 180 8" fill="none" style={{ position:"absolute", bottom:-4, left:0, width:"100%" }}>
                    <path d="M2 5.5C40 2 80 6.5 178 3" stroke="#BBF7D0" strokeWidth="3" strokeLinecap="round"/>
                  </svg>
                </span>{" "}em minutos.
              </h1>
              <p className="fade-up d3" style={{ fontSize:17, color:"#6B7280", lineHeight:1.65,
                maxWidth:420, marginBottom:36, fontWeight:400 }}>
                Cadastre seus produtos, compartilhe o link e comece a receber pedidos organizados — com carrinho, variações e notificação no WhatsApp.
              </p>
              <div className="fade-up d4" style={{ display:"flex", flexWrap:"wrap", gap:10, marginBottom:32 }}>
                <a href="/register" className="btn-green">
                  Criar meu catálogo grátis
                  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </a>
                <a href="/demo" className="btn-outline">
                  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M10 8l6 4-6 4V8z" fill="currentColor" stroke="none"/></svg>
                  Ver demonstração
                </a>
              </div>
              <div className="fade-up d5" style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
                <TrustPill icon={<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>}>
                  30 dias para testar
                </TrustPill>
                <TrustPill icon={<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>}>
                  Sem cartão
                </TrustPill>
                <TrustPill icon={<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>}>
                  Pronto em 2 minutos
                </TrustPill>
              </div>
            </div>

            <div className="visual-col" style={{ position:"relative", height:580,
              display:"flex", alignItems:"center", justifyContent:"center" }}>
              <div style={{ position:"absolute", width:380, height:380, borderRadius:"50%",
                background:"radial-gradient(circle, #DCFCE7 0%, transparent 70%)", opacity:.6, zIndex:0 }} />
              <div className="float-b" style={{ position:"absolute", top:60, left:-10, zIndex:3 }}>
                <StatCard value="47" label="Pedidos hoje" />
              </div>
              <div className="float-a" style={{ position:"relative", zIndex:2 }}>
                <PhoneMockup />
              </div>
              <div className="float-b" style={{ position:"absolute", top:44, right:-32, zIndex:3 }}>
                <OrderNotification />
              </div>
              <div className="float-c" style={{ position:"absolute", bottom:44, left:-36, zIndex:3 }}>
                <WhatsAppCard />
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="hidden">
      {/* STATS */}
      <section style={{ borderTop:"1px solid #F3F4F6", borderBottom:"1px solid #F3F4F6", background:"#fff" }}>
        <div className="container">
          <div className="stats-grid" style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)" }}>
            {STATS.map((s, i) => (
              <div key={s.label} style={{ padding:"28px 20px", borderRight: i < 3 ? "1px solid #F3F4F6" : "none",
                display:"flex", flexDirection:"column", alignItems:"center", gap:12, textAlign:"center" }}>
                <div style={{ width:38, height:38, borderRadius:10, background:"#F0FDF4",
                  border:"1px solid #BBF7D0", display:"flex", alignItems:"center", justifyContent:"center" }}>
                  {s.icon}
                </div>
                <div>
                  <div style={{ fontSize:26, fontWeight:800, color:"#0A0A09", letterSpacing:"-.04em", lineHeight:1 }}>{s.value}</div>
                  <div style={{ fontSize:12, color:"#9CA3AF", marginTop:3 }}>{s.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      </div>

      {/* O PROBLEMA */}
      <section className="section" style={{ background:"#fff" }}>
        <div className="container">
          <div style={{ textAlign:"center", marginBottom:48 }}>
            <div className="section-label">O problema</div>
            <h2 style={{ fontSize:"clamp(28px,3.2vw,38px)", fontWeight:800, color:"#111827",
              letterSpacing:"-.03em", lineHeight:1.2, marginBottom:16 }}>
              WhatsApp para vender é ótimo.<br />Para organizar pedido, nem tanto.
            </h2>
            <p style={{ fontSize:17, color:"#6B7280", lineHeight:1.65, maxWidth:560, margin:"0 auto" }}>
              Pedido que some na conversa. Cliente que muda de ideia. Você que não sabe quanto vendeu no dia.
            </p>
          </div>
          <div className="problem-comparison" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:24, maxWidth:760, margin:"0 auto" }}>
            {/* Card Esquerdo - Sem o sistema */}
            <div style={{ background:"#fff", border:"1px solid #E5E7EB", borderRadius:12, padding:32, 
              boxShadow:"0 1px 3px rgba(0,0,0,0.05)" }}>
              <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:24 }}>
                <div style={{ width:40, height:40, borderRadius:12, background:"#FEF2F2", border:"1px solid #FEE2E2",
                  display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </div>
                <div style={{ fontSize:13, fontWeight:600, color:"#6B7280", letterSpacing:".02em", textTransform:"uppercase" }}>Sem o sistema</div>
              </div>
              <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
                {[
                  { title:"Pedidos perdidos", desc:"sumindo no meio das conversas" },
                  { title:"Zero registro", desc:"quem pediu o quê? Ninguém sabe" },
                  { title:"Retrabalho constante", desc:"preço e variação digitados na mão" },
                  { title:"Sem visão de faturamento", desc:"quanto você vendeu hoje?" }
                ].map((item, i) => (
                  <div key={i} style={{ display:"flex", gap:12, alignItems:"start" }}>
                    <div style={{ width:18, height:18, borderRadius:"50%", border:"2px solid #FEE2E2",
                      display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, marginTop:2 }}>
                      <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                      </svg>
                    </div>
                    <div>
                      <div style={{ fontSize:14.5, fontWeight:600, color:"#111827", lineHeight:1.4, marginBottom:3 }}>{item.title}</div>
                      <div style={{ fontSize:13.5, color:"#6B7280", lineHeight:1.5 }}>{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Card Direito - Com o sistema */}
            <div style={{ background:"#fff", border:"1px solid #E5E7EB", borderRadius:12, padding:32,
              boxShadow:"0 1px 3px rgba(0,0,0,0.05)" }}>
              <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:24 }}>
                <div style={{ width:40, height:40, borderRadius:12, background:"#F0FDF4", border:"1px solid #DCFCE7",
                  display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </div>
                <div style={{ fontSize:13, fontWeight:600, color:"#6B7280", letterSpacing:".02em", textTransform:"uppercase" }}>Com o sistema</div>
              </div>
              <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
                {[
                  { title:"Tudo numerado e organizado", desc:"cada pedido com status e horário" },
                  { title:"Catálogo completo", desc:"cliente escolhe direto, sem erro" },
                  { title:"WhatsApp automático", desc:"notificação pré-formatada no pedido" },
                  { title:"Painel completo", desc:"pedidos, produtos e faturamento do dia" }
                ].map((item, i) => (
                  <div key={i} style={{ display:"flex", gap:12, alignItems:"start" }}>
                    <div style={{ width:18, height:18, borderRadius:"50%", border:"2px solid #DCFCE7",
                      display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, marginTop:2 }}>
                      <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                    </div>
                    <div>
                      <div style={{ fontSize:14.5, fontWeight:600, color:"#111827", lineHeight:1.4, marginBottom:3 }}>{item.title}</div>
                      <div style={{ fontSize:13.5, color:"#6B7280", lineHeight:1.5 }}>{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* COMO FUNCIONA */}
      <section className="section" id="como-funciona">
        <div className="container">
          <div style={{ textAlign:"center", marginBottom:48 }}>
            <div className="section-label">Como funciona</div>
            <h2 className="section-title">Três passos para começar<br />a receber pedidos</h2>
          </div>
          <div className="steps-grid" style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:14 }}>
            {STEPS.map(s => (
              <div key={s.num} className="step-card">
                <div style={{ position:"relative", width:56, height:56, marginBottom:20 }}>
                  <div style={{ width:56, height:56, borderRadius:14, background:"#F0FDF4",
                    border:"1px solid #BBF7D0", display:"flex", alignItems:"center", justifyContent:"center" }}>
                    {s.icon}
                  </div>
                  <div style={{ position:"absolute", top:-8, right:-8, width:22, height:22, borderRadius:"50%",
                    background:"#111827", border:"2px solid #fff", display:"flex", alignItems:"center",
                    justifyContent:"center", fontSize:9, fontWeight:800, color:"#fff" }}>{s.num}</div>
                </div>
                <h3 style={{ fontSize:16, fontWeight:700, color:"#111827", letterSpacing:"-.02em", marginBottom:8 }}>{s.title}</h3>
                <p style={{ fontSize:13.5, color:"#6B7280", lineHeight:1.7 }}>{s.desc}</p>
              </div>
            ))}
          </div>
          <div style={{ display:"flex", justifyContent:"center", alignItems:"center", gap:8, marginTop:28 }}>
            <div style={{ width:8, height:8, borderRadius:"50%", background:"#16A34A" }} />
            <div style={{ width:40, height:1, background:"#E5E7EB" }} />
            <div style={{ width:8, height:8, borderRadius:"50%", background:"#D1D5DB" }} />
            <div style={{ width:40, height:1, background:"#E5E7EB" }} />
            <div style={{ width:8, height:8, borderRadius:"50%", background:"#D1D5DB" }} />
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="section" id="funcionalidades"
        style={{ background:"#FAFAF9", borderTop:"1px solid #F3F4F6", borderBottom:"1px solid #F3F4F6" }}>
        <div className="container">
          <div style={{ textAlign:"center", marginBottom:48 }}>
            <div className="section-label">Funcionalidades</div>
            <h2 className="section-title">Tudo que você precisa</h2>
            <p style={{ fontSize:16, color:"#6B7280", marginTop:10 }}>Funcionalidades pensadas para facilitar sua vida</p>
          </div>
          <div className="feat-grid" style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:16 }}>
            {FEATURES.map(f => (
              <div key={f.title} className="feat-card">
                <div style={{ width:36, height:36, borderRadius:9, background:"#F0FDF4",
                  border:"1px solid #D1FAE5", display:"flex", alignItems:"center",
                  justifyContent:"center", marginBottom:14 }}>{f.icon}</div>
                <h3 style={{ fontSize:14, fontWeight:700, color:"#111827", marginBottom:6 }}>{f.title}</h3>
                <p style={{ fontSize:13, color:"#6B7280", lineHeight:1.65 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEITO PARA PEQUENOS PRODUTORES */}
      <section className="section" style={{ background:"#fff", borderBottom:"1px solid #F3F4F6" }}>
        <div className="container">
          <div style={{ textAlign:"center", marginBottom:32 }}>
            <div className="section-label">Para quem é</div>
            <h2 className="section-title" style={{ marginBottom:8 }}>Feito para pequenos produtores</h2>
            <p style={{ fontSize:16, color:"#6B7280", marginBottom:24 }}>Confeitarias, docerias, artesãos e empreendedores locais</p>
            <div style={{ display:"flex", justifyContent:"center", flexWrap:"wrap", gap:10 }}>
              {[
                { label:"Confeitaria",      icon:<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20 11H4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-5a2 2 0 0 0-2-2z"/><path d="M12 11V7a4 4 0 0 1 8 0"/><path d="M12 11V7a4 4 0 0 0-8 0"/></svg> },
                { label:"Doceria",          icon:<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg> },
                { label:"Artesanato",       icon:<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8.56 2.75c4.37 6.03 6.02 9.42 8.03 17.72m2.54-15.38c-3.72 4.35-8.94 5.66-16.88 5.85m19.5 1.9c-3.5-.93-6.63-.82-8.94 0-2.58.92-5.01 2.86-7.44 6.32"/></svg> },
                { label:"Gastronomia",      icon:<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 11l19-9-9 19-2-8-8-2z"/></svg> },
                { label:"Pequenos negócios",icon:<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg> },
              ].map(p => (
                <div key={p.label} style={{ display:"inline-flex", alignItems:"center", gap:8,
                  background:"#F3F4F6", borderRadius:100, padding:"7px 16px",
                  fontSize:13, fontWeight:600, color:"#111827" }}>
                  {p.icon}{p.label}
                </div>
              ))}
            </div>
          </div>

          <div className="categories-grid" style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14, marginBottom:40 }}>
            <CategoryCard images={["/categories/01_Bolo_Cenoura_Coberto.jpg","/categories/02_Torta_Limao_Merengada.jpg","/categories/03_Pao_de_Mel_Embalado.jpg"]} />
            <CategoryCard images={["/categories/04_Doces_Gourmet_Caixa_A.jpg","/categories/04_Doces_Gourmet_Caixa_B.jpg","/categories/05_Doce_de_Coco_Caseiro.jpg"]} />
            <CategoryCard images={["/categories/07_Cachecol_Trico_Pronto.jpg","/categories/08_Tapete_Croche_Colorido.jpg","/categories/09_Boneca_Pano_Artesanal.jpg"]} />
            <CategoryCard images={["/categories/10_Marmita_Feijoada_Completa.jpg","/categories/11_Pizza_Artesanal_Pronta.jpg","/categories/12_Massa_ao_Sugo_Prata.jpg"]} />
          </div>

          <div style={{ textAlign:"center" }}>
            <p style={{ fontSize:15, color:"#6B7280", marginBottom:24, lineHeight:1.65 }}>
              Centenas de pequenos negócios já estão vendendo online com o{" "}
              <strong style={{ color:"#111827", fontWeight:700 }}>Fosfo Pedidos</strong>
            </p>
            <a href="/register" className="btn-green">
              Criar meu catálogo grátis
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </a>
          </div>
        </div>
      </section>

      {/* DEMO */}
      <section className="section" style={{ background:"#FAFAF9" }}>
        <div className="container">
          <div className="demo-grid" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:56, alignItems:"center" }}>
            <div className="demo-text-col">
              <div className="section-label">Veja ao vivo</div>
              <h2 style={{ fontSize:"clamp(24px,2.8vw,32px)", fontWeight:800, color:"#111827",
                letterSpacing:"-.03em", lineHeight:1.15, marginBottom:14 }}>Teste agora,<br />sem cadastro.</h2>
              <p style={{ fontSize:15, color:"#6B7280", lineHeight:1.65, marginBottom:0 }}>
                Explore nosso catálogo demo com produtos reais, carrinho funcional e checkout completo. O painel admin também está aberto para você ver como funciona a gestão de pedidos.
              </p>
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
              {[
                { label:"Catálogo público",  desc:"Catálogo com variações e carrinho",        href:"/demo", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg> },
                { label:"Painel admin",  desc:"Gestão de pedidos, produtos e métricas",   href:"/demo-admin", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="9" y1="3" x2="9" y2="21"/></svg> },
              ].map(item => (
                <a key={item.label} href={item.href} style={{
                  display:"flex", alignItems:"center", justifyContent:"space-between",
                  padding:"24px", background:"#fff",
                  border:"2px solid #E5E7EB", borderRadius:16,
                  textDecoration:"none", transition:"all .2s ease",
                  boxShadow:"0 1px 3px rgba(0,0,0,0.05)"
                }}
                  onMouseEnter={e => { 
                    e.currentTarget.style.borderColor="#16A34A"; 
                    e.currentTarget.style.background="#F0FDF4"; 
                    e.currentTarget.style.boxShadow="0 8px 24px rgba(22,163,74,.12)"; 
                    e.currentTarget.style.transform="translateY(-2px)";
                    const btn = e.currentTarget.querySelector('.access-btn');
                    if(btn) { btn.style.background="#16A34A"; btn.style.color="#fff"; }
                  }}
                  onMouseLeave={e => { 
                    e.currentTarget.style.borderColor="#E5E7EB"; 
                    e.currentTarget.style.background="#fff"; 
                    e.currentTarget.style.boxShadow="0 1px 3px rgba(0,0,0,0.05)"; 
                    e.currentTarget.style.transform="translateY(0)";
                    const btn = e.currentTarget.querySelector('.access-btn');
                    if(btn) { btn.style.background="#F0FDF4"; btn.style.color="#16A34A"; }
                  }}>
                  <div style={{ display:"flex", alignItems:"center", gap:14 }}>
                    <div style={{ width:44, height:44, borderRadius:12, background:"#F0FDF4", border:"1px solid #BBF7D0", display:"flex", alignItems:"center", justifyContent:"center", color:"#16A34A" }}>
                      {item.icon}
                    </div>
                    <div>
                      <div style={{ fontSize:15, fontWeight:700, color:"#111827", marginBottom:4 }}>{item.label}</div>
                      <div style={{ fontSize:13, color:"#6B7280" }}>{item.desc}</div>
                    </div>
                  </div>
                  <div className="access-btn" style={{ 
                    display:"inline-flex", alignItems:"center", gap:6,
                    padding:"10px 18px", background:"#F0FDF4", color:"#16A34A",
                    borderRadius:10, fontSize:13, fontWeight:600,
                    transition:"all .2s ease", whiteSpace:"nowrap"
                  }}>
                    Acessar
                    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5"
                      strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section" id="faq"
        style={{ background:"#FAFAF9", borderTop:"1px solid #F3F4F6" }}>
        <div className="container">
          <div className="faq-grid" style={{ display:"grid", gridTemplateColumns:"1fr 1.6fr", gap:80, alignItems:"start" }}>
            <div className="faq-text-col" style={{ position:"sticky", top:80 }}>
              <div className="section-label">Dúvidas frequentes</div>
              <h2 style={{ fontSize:"clamp(22px,2.5vw,28px)", fontWeight:800, color:"#111827",
                letterSpacing:"-.03em", lineHeight:1.2, marginBottom:14 }}>
                Tudo que você precisa saber antes de começar.
              </h2>
              <p style={{ fontSize:13.5, color:"#9CA3AF", lineHeight:1.65 }}>
                Ainda tem dúvidas? Fale com a gente pelo WhatsApp.
              </p>
            </div>
            <div>
              {FAQ.map(item => <FaqItem key={item.q} q={item.q} a={item.a} />)}
            </div>
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="section">
        <div className="container">
          <div style={{ position:"relative", background:"#111c14", borderRadius:20, padding:"72px 32px", 
            overflow:"hidden", textAlign:"center" }}>
            {/* Glow effect */}
            <div style={{ position:"absolute", top:0, left:"50%", transform:"translateX(-50%)", 
              width:600, height:400, background:"radial-gradient(circle, rgba(99,153,34,0.2) 0%, transparent 70%)",
              pointerEvents:"none", zIndex:0 }}></div>
            
            {/* Content */}
            <div style={{ position:"relative", zIndex:1, maxWidth:560, margin:"0 auto" }}>
              {/* Top pill */}
              <div style={{ display:"inline-flex", alignItems:"center", gap:6, background:"rgba(99,153,34,0.18)",
                border:"1px solid rgba(99,153,34,0.4)", borderRadius:99, padding:"6px 14px", marginBottom:24 }}>
                <div style={{ width:5, height:5, borderRadius:"50%", background:"#97C459" }}></div>
                <span style={{ fontSize:12.5, fontWeight:600, color:"#97C459", letterSpacing:".01em" }}>
                  30 dias grátis · sem cartão
                </span>
              </div>

              {/* Headline */}
              <h2 style={{ fontSize:"clamp(32px,4vw,48px)", fontWeight:800, color:"#f0f0ea",
                letterSpacing:"-.03em", lineHeight:1.15, marginBottom:16 }}>
                Testa agora.<br />Decide depois.
              </h2>

              {/* Subtitle */}
              <p style={{ fontSize:17, color:"rgba(240,240,234,0.5)", lineHeight:1.65, marginBottom:32 }}>
                30 dias sem custo, sem compromisso. Você cria, seus clientes pedem — e você decide se ficou bom.
              </p>

              {/* CTA Button */}
              <div style={{ marginBottom:16 }}>
                <a href="/register" style={{ display:"inline-flex", alignItems:"center", gap:8,
                  background:"#639922", color:"#fff", borderRadius:10, padding:"15px 32px",
                  fontSize:15.5, fontWeight:600, textDecoration:"none", transition:"all 0.2s" }}>
                  Criar meu catálogo agora
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </a>
              </div>

              {/* Login link */}
              <p style={{ fontSize:13.5, color:"rgba(240,240,234,0.35)", marginBottom:32 }}>
                Já tem conta? <a href="/login" style={{ color:"rgba(240,240,234,0.5)", textDecoration:"underline", fontWeight:500 }}>Entrar</a>
              </p>

              {/* Bottom pills */}
              <div style={{ display:"flex", justifyContent:"center", flexWrap:"wrap", gap:10 }}>
                <div style={{ display:"flex", alignItems:"center", gap:7, background:"rgba(255,255,255,0.06)",
                  border:"0.5px solid rgba(255,255,255,0.12)", borderRadius:99, padding:"7px 16px" }}>
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#639922" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  <span style={{ fontSize:12, color:"rgba(240,240,234,0.55)", fontWeight:500 }}>30 dias para testar</span>
                </div>
                <div style={{ display:"flex", alignItems:"center", gap:7, background:"rgba(255,255,255,0.06)",
                  border:"0.5px solid rgba(255,255,255,0.12)", borderRadius:99, padding:"7px 16px" }}>
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#639922" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                  </svg>
                  <span style={{ fontSize:12, color:"rgba(240,240,234,0.55)", fontWeight:500 }}>Sem cartão</span>
                </div>
                <div style={{ display:"flex", alignItems:"center", gap:7, background:"rgba(255,255,255,0.06)",
                  border:"0.5px solid rgba(255,255,255,0.12)", borderRadius:99, padding:"7px 16px" }}>
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#639922" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                  </svg>
                  <span style={{ fontSize:12, color:"rgba(240,240,234,0.55)", fontWeight:500 }}>Pronto em 2 minutos</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop:"1px solid #F3F4F6", padding:"24px", background:"#fff" }}>
        <div className="container" style={{ display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:12 }}>
          <div style={{ display:"flex", alignItems:"center", gap:9 }}>
            <div style={{ width:28, height:28, borderRadius:8, background:"#111827",
              display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                <polyline points="9 22 9 12 15 12 15 22"/>
              </svg>
            </div>
            <span style={{ fontSize:14, fontWeight:700, color:"#374151", letterSpacing:"-.03em" }}>{platformName}</span>
            <span style={{ fontSize:13, color:"#D1D5DB", margin:"0 4px" }}>·</span>
            <span style={{ fontSize:13, color:"#9CA3AF" }}>© 2026</span>
          </div>
          <div className="footer-links" style={{ display:"flex", gap:20 }}>
            {[["Demo","/demo"],["Login","/login"],["Cadastrar","/register"]].map(([l,h]) => (
              <a key={l} href={h} style={{ fontSize:13, color:"#9CA3AF", textDecoration:"none" }}>{l}</a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
