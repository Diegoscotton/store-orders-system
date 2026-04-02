"use client";

import { motion, AnimatePresence, useScroll, useSpring } from "framer-motion";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Package, ShoppingCart, MessageCircle, BarChart3,
  CheckCircle2, XCircle, ArrowRight, ChevronDown,
  Palette, Globe, Layers, Menu, X, Store, LayoutDashboard,
  Cake, Coffee, Aperture, Navigation, Briefcase, Play,
} from "lucide-react";

// ─── Motion config ────────────────────────────────────────────────────────────
const E: [number, number, number, number] = [0.16, 1, 0.3, 1];
const BASE = { duration: 0.75, ease: E };
const fadeUp   = { hidden: { opacity: 0, y: 28 },   visible: { opacity: 1, y: 0,  transition: BASE } };
const fadeLeft  = { hidden: { opacity: 0, x: -36 }, visible: { opacity: 1, x: 0,  transition: BASE } };
const fadeRight = { hidden: { opacity: 0, x: 36 },  visible: { opacity: 1, x: 0,  transition: BASE } };
const stg = (delay = 0.1, dc = 0) => ({ hidden: {}, visible: { transition: { staggerChildren: delay, delayChildren: dc } } });

// ─── Image paths — mova para /public/mockups/ conforme instruções ─────────────
const IMG = {
  desktopDashboard: "/mockups/desktop-dashboard.png",
  desktopCatalogo:  "/mockups/desktop-catalogo.png",
};

// ─── FAQ data ─────────────────────────────────────────────────────────────────
const FAQ = [
  { q: "Preciso pagar para começar?",               a: "Não. Você tem 30 dias para testar sem cartão de crédito e sem compromisso. Só começa a pagar se decidir continuar." },
  { q: "Quanto tempo leva para criar meu catálogo?", a: "Em torno de 2 minutos. Você cria sua conta, dá um nome ao catálogo, cadastra seus produtos e já tem um link para compartilhar." },
  { q: "Como meus clientes fazem pedidos?",          a: "Eles acessam o link do seu catálogo, escolhem os produtos, montam o carrinho e finalizam. Você recebe o pedido no painel e, se quiser, também no WhatsApp." },
  { q: "Posso personalizar a aparência?",            a: "Sim. Você pode adicionar logo, escolher a cor principal e adicionar banners. O catálogo fica com a identidade da sua marca." },
  { q: "Funciona no celular?",                       a: "Funciona perfeitamente. Tanto o catálogo para seus clientes quanto o painel foram feitos pensando no uso no celular." },
  { q: "Posso ter produtos com variações?",          a: "Sim. Variações como tamanho, sabor, cor — cada uma com seu próprio preço. O cliente escolhe na hora de adicionar ao carrinho." },
  { q: "Tem limite de produtos ou pedidos?",         a: "Não há limite. Você pode cadastrar quantos produtos quiser e receber quantos pedidos precisar." },
  { q: "Como funciona a integração com WhatsApp?",   a: "Quando o cliente finaliza o pedido, ele é redirecionado ao WhatsApp com uma mensagem já formatada com todos os detalhes." },
  { q: "Por que não usar só o WhatsApp?",            a: "WhatsApp é ótimo para conversar, mas péssimo para organizar pedido. Aqui cada pedido tem número, status e fica registrado — sem sumir na conversa." },
  { q: "Quanto custa depois do período grátis?",     a: "Depois dos 30 dias, você decide se quer continuar. Entramos em contato via WhatsApp para fechar a assinatura." },
  { q: "Preciso de site, domínio ou técnico?",       a: "Não. Tudo já está pronto. Você só precisa criar a conta e começar a usar. Sem instalar nada, sem configurar servidor." },
];

// ─── Categorias para o carrossel ──────────────────────────────────────────────
const CATS = [
  { label: "Confeitaria", icon: Cake, images: ["/categories/01_Bolo_Cenoura_Coberto.jpg", "/categories/02_Torta_Limao_Merengada.jpg", "/categories/03_Pao_de_Mel_Embalado.jpg"] },
  { label: "Doceria", icon: Coffee, images: ["/categories/04_Doces_Gourmet_Caixa_A.jpg", "/categories/04_Doces_Gourmet_Caixa_B.jpg", "/categories/05_Doce_de_Coco_Caseiro.jpg"] },
  { label: "Artesanato", icon: Aperture, images: ["/categories/08_Tapete_Croche_Colorido.jpg", "/categories/07_Cachecol_Trico_Pronto.jpg", "/categories/09_Boneca_Pano_Artesanal.jpg"] },
  { label: "Gastronomia", icon: Navigation, images: ["/categories/10_Marmita_Feijoada_Completa.jpg", "/categories/11_Pizza_Artesanal_Pronta.jpg", "/categories/12_Massa_ao_Sugo_Prata.jpg"] },
];

const CAROUSEL_SLIDES = [
  ["/categories/01_Bolo_Cenoura_Coberto.jpg", "/categories/04_Doces_Gourmet_Caixa_A.jpg", "/categories/08_Tapete_Croche_Colorido.jpg", "/categories/10_Marmita_Feijoada_Completa.jpg"],
  ["/categories/02_Torta_Limao_Merengada.jpg", "/categories/04_Doces_Gourmet_Caixa_B.jpg", "/categories/07_Cachecol_Trico_Pronto.jpg", "/categories/11_Pizza_Artesanal_Pronta.jpg"],
  ["/categories/03_Pao_de_Mel_Embalado.jpg", "/categories/05_Doce_de_Coco_Caseiro.jpg", "/categories/09_Boneca_Pano_Artesanal.jpg", "/categories/12_Massa_ao_Sugo_Prata.jpg"],
];

const TRUST = ["30 dias para testar", "Sem cartão", "Pronto em 2 minutos"];

// ─── Scroll Progress ───────────────────────────────────────────────────────────
function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });
  return <motion.div className="fixed top-0 left-0 right-0 h-[2px] bg-[#639922] origin-left z-50" style={{ scaleX }} />;
}

// ─── Navbar ───────────────────────────────────────────────────────────────────
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen]         = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const navLinks = [
    { href: "#como-funciona", label: "Como funciona" },
    { href: "#funcionalidades", label: "Funcionalidades" },
    { href: "#faq",            label: "FAQ" },
    { href: "/demo",           label: "Ver demo" },
  ];

  return (
    <motion.nav
      initial={{ y: -72, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.9, ease: E }}
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
        scrolled ? "bg-white/90 backdrop-blur-lg border-b border-slate-200/80 shadow-sm" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-[#639922] rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
              <Store className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg text-slate-900 tracking-tight">
              Sistema de Pedidos Fosfo
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map(({ href, label }) => (
              <a key={label} href={href} className="text-sm text-slate-600 hover:text-slate-900 transition-colors">{label}</a>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <Link href="/login" className="text-sm text-slate-600 hover:text-slate-900 transition-colors px-3 py-2">Entrar</Link>
            <Link href="/register" className="text-sm font-semibold bg-[#639922] hover:bg-[#527a1c] text-white px-4 py-2 rounded-lg transition-all duration-200 hover:shadow-md hover:shadow-[#639922]/20">
              Criar meu catálogo grátis
            </Link>
          </div>

          <button onClick={() => setOpen(!open)} className="md:hidden p-2 text-slate-700 rounded-lg hover:bg-slate-100 transition-colors">
            <AnimatePresence mode="wait" initial={false}>
              {open
                ? <motion.span key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}><X className="w-5 h-5" /></motion.span>
                : <motion.span key="m" initial={{ rotate: 90, opacity: 0 }}  animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}><Menu className="w-5 h-5" /></motion.span>
              }
            </AnimatePresence>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35, ease: E }}
            className="md:hidden bg-white/95 backdrop-blur-lg border-b border-slate-200 overflow-hidden"
          >
            <div className="px-4 py-5 flex flex-col gap-4">
              {navLinks.map(({ href, label }) => 
                href.startsWith('#') ? (
                  <a 
                    key={label} 
                    href={href} 
                    className="text-slate-700 font-medium" 
                    onClick={(e) => {
                      e.preventDefault();
                      setOpen(false);
                      setTimeout(() => {
                        const element = document.querySelector(href);
                        if (element) {
                          const offset = 80;
                          const elementPosition = element.getBoundingClientRect().top;
                          const offsetPosition = elementPosition + window.pageYOffset - offset;
                          window.scrollTo({
                            top: offsetPosition,
                            behavior: 'smooth'
                          });
                        }
                      }, 100);
                    }}
                  >
                    {label}
                  </a>
                ) : (
                  <Link 
                    key={label} 
                    href={href} 
                    className="text-slate-700 font-medium"
                    onClick={() => setOpen(false)}
                  >
                    {label}
                  </Link>
                )
              )}
              <hr className="border-slate-100" />
              <Link href="/login" className="text-slate-700" onClick={() => setOpen(false)}>Entrar</Link>
              <Link href="/register" className="font-semibold bg-[#639922] text-white px-4 py-2.5 rounded-xl text-center" onClick={() => setOpen(false)}>
                Criar meu catálogo grátis
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}

// ─── Hero: Device mockup com UI interna ──────────────────────────────────────
function HeroMockup() {
  const [phase, setPhase] = useState(0);
  const [cardIndex, setCardIndex] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 1600);
    const t2 = setTimeout(() => setPhase(2), 3300);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCardIndex((prev) => (prev + 1) % 3);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const cardContents = [
    { name: "Ana Lima", initials: "AL", item: "Açaí 500ml — Granola", price: "R$ 28,00" },
    { name: "Carlos M.", initials: "CM", item: "Combo Família", price: "R$ 89,00" },
    { name: "Julia S.", initials: "JS", item: "Brigadeiro ×6", price: "R$ 36,00" },
  ];

  const currentCard = cardContents[cardIndex];

  return (
    <div className="relative w-full max-w-[280px] mx-auto lg:mx-0">
      {/* Background decorativo com blur e elementos flutuantes */}
      <div className="absolute inset-0 -m-32 pointer-events-none overflow-visible">
        {/* Círculos decorativos com blur */}
        <motion.div 
          className="absolute top-10 -left-16 w-40 h-40 rounded-full bg-[#639922]/20 blur-3xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.3, 0.2] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute -top-8 right-8 w-32 h-32 rounded-full bg-blue-400/15 blur-2xl"
          animate={{ scale: [1, 1.3, 1], opacity: [0.15, 0.25, 0.15] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />
        <motion.div 
          className="absolute bottom-20 -right-12 w-36 h-36 rounded-full bg-purple-400/15 blur-3xl"
          animate={{ scale: [1, 1.15, 1], opacity: [0.15, 0.2, 0.15] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />
        <motion.div 
          className="absolute -bottom-10 left-12 w-28 h-28 rounded-full bg-[#639922]/15 blur-2xl"
          animate={{ scale: [1, 1.25, 1], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 3 }}
        />
        
        {/* Linhas diagonais sutis */}
        <svg className="absolute inset-0 w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="diagonals" width="60" height="60" patternUnits="userSpaceOnUse" patternTransform="rotate(-45)">
              <line x1="0" y1="0" x2="0" y2="60" stroke="#639922" strokeWidth="0.5" opacity="0.3" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#diagonals)" />
        </svg>
      </div>

      {/* Card "47 Pedidos hoje" — top-left, bem afastado */}
      <motion.div
        initial={{ opacity: 0, y: 12, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: E, delay: 0.3 }}
        className="absolute top-8 -left-32 z-20 bg-white rounded-2xl shadow-xl border border-slate-100 p-3 w-36"
      >
        <div className="flex items-center gap-2 mb-1">
          <div className="w-2 h-2 rounded-full bg-[#639922] animate-pulse" />
          <span className="text-[9px] font-semibold text-slate-600">Pedidos hoje</span>
        </div>
        <p className="text-3xl font-black text-slate-900 leading-none">47</p>
      </motion.div>

      {/* Card de notificação — top-right, mais à direita e acima, phase 1, alterna conteúdo */}
      <AnimatePresence mode="wait">
        {phase >= 1 && (
          <motion.div
            key={cardIndex}
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.4, ease: E }}
            className="absolute -top-4 -right-28 z-20 bg-white rounded-2xl shadow-xl border border-slate-100 p-3 w-48"
          >
            <div className="flex items-start gap-2">
              <div className="w-8 h-8 bg-[#639922]/15 rounded-full flex items-center justify-center text-[11px] font-black text-[#639922] flex-shrink-0">
                {currentCard.initials}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1 mb-0.5">
                  <span className="text-[11px] font-bold text-slate-800">{currentCard.name}</span>
                  <span className="text-[9px] text-slate-400 flex-shrink-0">agora</span>
                </div>
                <p className="text-[10px] text-slate-500">{currentCard.item}</p>
                <p className="text-[11px] font-bold text-[#639922] mt-1">{currentCard.price}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Card WhatsApp — bottom-left, mais afastado, phase 2 */}
      <AnimatePresence>
        {phase >= 2 && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.55, ease: E }}
            className="absolute bottom-16 -left-24 z-20 bg-white rounded-2xl shadow-xl border border-slate-100 p-3 w-56"
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                <MessageCircle className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="text-[11px] font-semibold text-slate-700">WhatsApp</span>
              <span className="text-[9px] text-slate-400 ml-auto">Mensagem automática</span>
            </div>
            <div className="bg-[#dcf8c6] rounded-xl px-3 py-2.5 text-[10px] leading-relaxed text-slate-700 space-y-1">
              <p>🧾 <strong>Novo Pedido #047</strong></p>
              <p>👤 Ana Lima · (51) 99999-8888</p>
              <p className="pt-1">• 1× Açaí 500ml — R$22,00</p>
              <p>• 1× Granola extra — R$6,00</p>
              <p className="pt-1">💰 <strong>Total: R$ 28,00</strong></p>
            </div>
            <div className="flex justify-end mt-1.5">
              <span className="text-[9px] text-slate-400">✓✓ Entregue</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Device frame (celular) - proporções realistas de smartphone */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: E, delay: 0.1 }}
        className="relative z-10 w-full"
      >
        {/* Shell do device - aspect ratio 9:19.5 típico de smartphones */}
        <div className="relative bg-slate-900 rounded-[2.5rem] shadow-2xl p-2.5 mx-auto" style={{ width: '280px', height: '580px' }}>
          {/* Notch */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-5 bg-slate-900 rounded-b-2xl z-10" />
          
          {/* Tela interna */}
          <div className="relative bg-white rounded-[2rem] overflow-hidden h-full">
            {/* Header verde */}
            <div className="bg-[#639922] px-4 pt-7 pb-3">
              <p className="text-xs font-black text-white tracking-widest">AÇAÍ CENTRAL</p>
              <p className="text-[10px] text-white/80 mt-1">Olá! O que vai querer? 👋</p>
            </div>

            {/* Tabs */}
            <div className="flex gap-1.5 px-4 py-3 bg-slate-50 border-b border-slate-100">
              {["Todos", "Açaí", "Combos", "Bebidas"].map((c, i) => (
                <span key={c} className={`text-[9px] px-2.5 py-1 rounded-full font-medium transition-colors ${i === 0 ? "bg-[#639922] text-white" : "bg-white text-slate-600 border border-slate-200"}`}>
                  {c}
                </span>
              ))}
            </div>

            {/* Lista de produtos */}
            <div className="px-4 py-3 space-y-2 bg-white">
              {[
                { emoji: "🍇", name: "Açaí 500ml", price: "R$ 22,00", badge: "Popular" },
                { emoji: "🍕", name: "Combo Família", price: "R$ 89,00", badge: null },
                { emoji: "🍫", name: "Brigadeiro ×6", price: "R$ 36,00", badge: "Novo" },
              ].map(({ emoji, name, price, badge }) => (
                <div key={name} className="flex items-center justify-between bg-slate-50 rounded-xl px-3 py-2 border border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="text-base leading-none">{emoji}</span>
                    <div>
                      <p className="text-[10px] font-semibold text-slate-800 flex items-center gap-1.5">
                        {name}
                        {badge && <span className="text-[7px] font-bold bg-[#639922]/10 text-[#639922] px-1.5 py-0.5 rounded uppercase tracking-wide">{badge}</span>}
                      </p>
                      <p className="text-[10px] font-bold text-[#639922] mt-0.5">{price}</p>
                    </div>
                  </div>
                  <button className="w-5 h-5 bg-[#639922] text-white rounded-full text-xs flex items-center justify-center font-bold flex-shrink-0 hover:bg-[#527a1c] transition-colors">+</button>
                </div>
              ))}
            </div>

            {/* Barra carrinho */}
            <div className="mx-4 mb-4 bg-[#639922] rounded-xl px-3 py-2.5 flex items-center justify-between shadow-lg">
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-3.5 h-3.5 text-white" />
                <span className="text-white text-[10px] font-semibold">Ver carrinho</span>
              </div>
              <span className="text-white/80 text-[9px] font-medium">2 itens</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Carrossel de categorias com pills Lucide e 4 imagens por slide ──────────
function CategoryCarousel() {
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setActiveSlide((p) => (p + 1) % CAROUSEL_SLIDES.length), 4000);
    return () => clearInterval(t);
  }, []);

  const currentSlide = CAROUSEL_SLIDES[activeSlide];
  const categoryLabels = ["Confeitaria", "Doceria", "Artesanato", "Gastronomia"];

  return (
    <div>
      {/* Pills estáticos com ícones Lucide */}
      <div className="flex flex-wrap gap-2 justify-center mb-8">
        {CATS.map((c) => {
          const Icon = c.icon;
          return (
            <div
              key={c.label}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium border border-slate-200 bg-white text-slate-600"
            >
              <Icon className="w-4 h-4" />
              {c.label}
            </div>
          );
        })}
        <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium border border-slate-200 bg-white text-slate-600">
          <Briefcase className="w-4 h-4" />
          Pequenos negócios
        </div>
      </div>

      {/* Grid 4 colunas — carrossel de imagens */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeSlide}
          initial={{ opacity: 0, x: 22 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -22 }}
          transition={{ duration: 0.45, ease: E }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-3"
        >
          {currentSlide.map((src, i) => (
            <motion.div
              key={src}
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: i * 0.07, ease: E }}
              whileHover={{ scale: 1.04, zIndex: 10 }}
              className="relative aspect-square rounded-xl overflow-hidden bg-slate-100 cursor-pointer"
            >
              <Image src={src} alt={categoryLabels[i]} fill className="object-cover" />
              <div className="absolute inset-0 bg-black/0 hover:bg-black/8 transition-colors duration-300" />
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>

      {/* Dots indicadores */}
      <div className="flex justify-center items-center gap-2 mt-7">
        {CAROUSEL_SLIDES.map((_, i) => (
          <motion.button
            key={i}
            onClick={() => setActiveSlide(i)}
            className="h-1.5 rounded-full bg-[#639922] cursor-pointer"
            animate={{ width: i === activeSlide ? 24 : 8, opacity: i === activeSlide ? 1 : 0.3 }}
            transition={{ duration: 0.3, ease: E }}
          />
        ))}
      </div>
    </div>
  );
}

// ─── FAQ item ─────────────────────────────────────────────────────────────────
function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div variants={fadeUp} className="border border-slate-200 rounded-xl overflow-hidden bg-white">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-slate-50/80 transition-colors duration-200"
      >
        <span className="font-medium text-slate-800 pr-5 text-sm leading-snug">{q}</span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.3, ease: E }} className="text-slate-400 flex-shrink-0">
          <ChevronDown className="w-4 h-4" />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: E }}
            className="overflow-hidden"
          >
            <p className="px-5 pb-4 pt-2 text-slate-500 text-sm leading-relaxed border-t border-slate-100">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Section header ───────────────────────────────────────────────────────────
function SectionHeader({ eyebrow, title, sub }: { eyebrow: string; title: React.ReactNode; sub?: string }) {
  return (
    <motion.div
      className="text-center mb-14"
      initial="hidden" whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={stg(0.1)}
    >
      <motion.p variants={fadeUp} className="text-xs font-bold text-[#639922] uppercase tracking-[0.18em] mb-3">{eyebrow}</motion.p>
      <motion.h2 variants={fadeUp} className="text-4xl sm:text-5xl font-bold text-slate-900 leading-tight max-w-3xl mx-auto">{title}</motion.h2>
      {sub && <motion.p variants={fadeUp} className="mt-4 text-slate-500 max-w-xl mx-auto leading-relaxed">{sub}</motion.p>}
    </motion.div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 overflow-x-hidden">
      <ScrollProgress />
      <Navbar />

      {/* ══ HERO ══ */}
      <section className="relative min-h-screen flex items-center pt-16 overflow-hidden">
        {/* Mesh orbs */}
        <div className="absolute inset-0 pointer-events-none select-none">
          <motion.div className="absolute -top-40 right-0 w-[680px] h-[680px] rounded-full"
            style={{ background: "radial-gradient(circle, rgba(99,153,34,0.13) 0%, transparent 65%)" }}
            animate={{ y: [0, -28, 0], x: [0, 18, 0] }} transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }} />
          <motion.div className="absolute top-1/2 -left-60 w-[560px] h-[560px] rounded-full"
            style={{ background: "radial-gradient(circle, rgba(132,204,22,0.09) 0%, transparent 65%)" }}
            animate={{ y: [0, 32, 0], x: [0, -12, 0] }} transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 2 }} />
          <motion.div className="absolute bottom-10 right-1/3 w-[440px] h-[440px] rounded-full"
            style={{ background: "radial-gradient(circle, rgba(34,197,94,0.07) 0%, transparent 65%)" }}
            animate={{ y: [0, -22, 0] }} transition={{ duration: 11, repeat: Infinity, ease: "easeInOut", delay: 5 }} />
        </div>
        <div className="absolute inset-0 opacity-[0.025] pointer-events-none"
          style={{ backgroundImage: "radial-gradient(circle, #64748b 1px, transparent 1px)", backgroundSize: "30px 30px" }} />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28 flex flex-col lg:flex-row items-center gap-14 lg:gap-10">
          {/* Copy */}
          <motion.div className="flex-1 text-center lg:text-left max-w-1xl" variants={stg(0.11)} initial="hidden" animate="visible">
            <motion.div variants={fadeUp}>
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-[#639922]/10 text-[#639922] border border-[#639922]/20 mb-7">
                <span className="w-1.5 h-1.5 rounded-full bg-[#639922] animate-pulse" />
                30 dias para testar · sem cartão
              </span>
            </motion.div>

            <motion.h1 variants={fadeUp} className="text-4xl sm:text-5xl lg:text-[3.5rem] font-bold tracking-tight text-slate-900 leading-[1.1] mb-6">
              Seu catálogo online{" "}
              <span className="text-[#639922]">pronto em minutos.</span>
            </motion.h1>

            <motion.p variants={fadeUp} className="text-lg sm:text-xl text-slate-500 leading-relaxed mb-9 max-w-xl mx-auto lg:mx-0">
              Cadastre seus produtos, compartilhe o link e comece a receber pedidos organizados — com carrinho, variações e notificação no WhatsApp.
            </motion.p>

            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start mb-10">
              <Link href="/register" className="group inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#639922] hover:bg-[#527a1c] text-white font-semibold rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-[#639922]/30 hover:-translate-y-0.5 whitespace-nowrap">
                Criar catálogo grátis
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
              <Link href="/demo" className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 font-medium rounded-xl transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 whitespace-nowrap">
                Ver demonstração
                <Play className="w-4 h-4" />
              </Link>
            </motion.div>

            <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-x-6 gap-y-2 justify-center lg:justify-start">
              {TRUST.map((t) => (
                <span key={t} className="flex items-center gap-1.5 text-sm text-slate-400">
                  <CheckCircle2 className="w-4 h-4 text-[#639922]" />
                  {t}
                </span>
              ))}
            </motion.div>
          </motion.div>

          {/* Mockup animado */}
          <motion.div
            className="flex-1 flex justify-center lg:justify-end"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: E, delay: 0.2 }}
          >
            <HeroMockup />
          </motion.div>
        </div>

        <motion.div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-slate-300"
          animate={{ y: [0, 9, 0] }} transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}>
          <ChevronDown className="w-6 h-6" />
        </motion.div>
      </section>

      {/* ══ O PROBLEMA ══ */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="O problema"
            title="WhatsApp para vender é ótimo. Para organizar pedido, nem tanto."
            sub="Pedido que some na conversa. Cliente que muda de ideia. Você que não sabe quanto vendeu no dia."
          />
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* Sem sistema */}
            <motion.div
              initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }} variants={fadeLeft}
              whileHover={{ y: -4 }} transition={{ duration: 0.3, ease: E }}
              className="group relative rounded-2xl border border-red-200 bg-white p-7 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-red-50/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative">
                <div className="flex items-center gap-2 mb-5">
                  <XCircle className="w-5 h-5 text-red-400" />
                  <h3 className="font-bold text-slate-800">Sem o sistema</h3>
                </div>
                <ul className="space-y-3.5">
                  {[
                    { l: "Pedidos perdidos",         s: "sumindo no meio das conversas" },
                    { l: "Zero registro",            s: "quem pediu o quê? Ninguém sabe" },
                    { l: "Retrabalho constante",     s: "preço e variação digitados na mão" },
                    { l: "Sem visão de faturamento", s: "quanto você vendeu hoje?" },
                  ].map(({ l, s }) => (
                    <li key={l} className="flex gap-3 items-start">
                      <XCircle className="w-4 h-4 text-red-300 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-slate-700">{l}</p>
                        <p className="text-xs text-slate-400 mt-0.5">{s}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>

            {/* Com sistema */}
            <motion.div
              initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }} variants={fadeRight}
              whileHover={{ y: -4 }} transition={{ duration: 0.3, ease: E }}
              className="group relative rounded-2xl border border-[#639922]/25 bg-white p-7 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#639922]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative">
                <div className="flex items-center gap-2 mb-5">
                  <CheckCircle2 className="w-5 h-5 text-[#639922]" />
                  <h3 className="font-bold text-slate-800">Com o sistema</h3>
                </div>
                <ul className="space-y-3.5">
                  {[
                    { l: "Tudo numerado e organizado", s: "cada pedido com status e horário" },
                    { l: "Catálogo completo",          s: "cliente escolhe direto, sem erro" },
                    { l: "WhatsApp automático",        s: "notificação pré-formatada no pedido" },
                    { l: "Painel completo",            s: "pedidos, produtos e faturamento do dia" },
                  ].map(({ l, s }) => (
                    <li key={l} className="flex gap-3 items-start">
                      <CheckCircle2 className="w-4 h-4 text-[#639922] flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-slate-700">{l}</p>
                        <p className="text-xs text-slate-400 mt-0.5">{s}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══ COMO FUNCIONA ══ */}
      <section id="como-funciona" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader eyebrow="Como funciona" title="Três passos para começar a receber pedidos" />
          <motion.div className="grid md:grid-cols-3 gap-6" initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} variants={stg(0.14)}>
            {[
              { num: "01", title: "Configure seu catálogo", desc: "Cadastre-se, escolha o nome e personalize com logo e cores. Menos de 2 minutos para estar no ar.", icon: <Palette className="w-4 h-4" /> },
              { num: "02", title: "Cadastre seus produtos", desc: "Fotos, preços e variações como tamanho, sabor ou cor. Organize tudo por categorias.", icon: <Package className="w-4 h-4" /> },
              { num: "03", title: "Receba pedidos",         desc: "Clientes acessam pelo link, montam o carrinho e finalizam. Você recebe no painel e no WhatsApp.", icon: <ShoppingCart className="w-4 h-4" /> },
            ].map(({ num, title, desc, icon }) => (
              <motion.div key={num} variants={fadeUp} whileHover={{ y: -6, scale: 1.01 }} transition={{ duration: 0.3, ease: E }} className="group relative">
                <div className="absolute -inset-px rounded-2xl bg-gradient-to-br from-[#639922]/35 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative rounded-2xl border border-slate-200 bg-white p-8 h-full transition-shadow duration-300 group-hover:shadow-2xl group-hover:shadow-slate-200/70">
                  {/* Número + ícone na mesma linha */}
                  <div className="flex items-center gap-3 mb-5">
                    <span className="text-5xl font-black text-slate-100 leading-none">{num}</span>
                    <div className="w-9 h-9 rounded-xl bg-[#639922]/10 flex items-center justify-center text-[#639922] transition-all duration-300 group-hover:bg-[#639922] group-hover:text-white flex-shrink-0">
                      {icon}
                    </div>
                  </div>
                  <h3 className="font-bold text-lg text-slate-800 mb-2 leading-snug">{title}</h3>
                  <p className="text-slate-500 leading-relaxed text-sm">{desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ══ FUNCIONALIDADES ══ */}
      <section id="funcionalidades" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader eyebrow="Funcionalidades" title="Tudo que você precisa" sub="Pensadas para facilitar sua vida, desde o primeiro produto até o último pedido do dia." />
          <motion.div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4" initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }} variants={stg(0.08)}>
            {[
              { icon: <Palette />,     title: "Catálogo personalizado", desc: "Logo, cores e banner com a identidade da sua marca." },
              { icon: <Layers />,      title: "Produtos com variações",  desc: "Tamanhos, sabores, cores — cada um com seu preço." },
              { icon: <ShoppingCart />,title: "Carrinho inteligente",    desc: "Seus clientes montam o pedido com facilidade." },
              { icon: <MessageCircle />,title: "Pedido por WhatsApp",   desc: "Receba os detalhes do pedido direto no seu WhatsApp." },
              { icon: <BarChart3 />,   title: "Painel completo",        desc: "Gerencie produtos, pedidos e métricas em um só lugar." },
              { icon: <Globe />,       title: "100% responsivo",        desc: "Funciona perfeitamente no celular e no computador." },
            ].map(({ icon, title, desc }) => (
              <motion.div key={title} variants={fadeUp} whileHover={{ scale: 1.02, y: -4 }} transition={{ duration: 0.3, ease: E }} className="group relative">
                <div className="absolute -inset-px rounded-2xl bg-gradient-to-br from-[#639922] via-[#84cc16] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative bg-white rounded-2xl border border-slate-200 p-6 h-full group-hover:border-transparent transition-colors duration-300">
                  <div className="w-10 h-10 rounded-xl bg-[#639922]/10 flex items-center justify-center text-[#639922] mb-4 transition-all duration-300 group-hover:bg-[#639922] group-hover:text-white [&>svg]:w-5 [&>svg]:h-5">
                    {icon}
                  </div>
                  <h3 className="font-bold text-slate-800 mb-1.5">{title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ══ PARA QUEM É ══ */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader eyebrow="Para quem é" title="Feito para pequenos produtores" sub="Confeitarias, docerias, artesãos e empreendedores locais" />
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.7, ease: E }}>
            <CategoryCarousel />
          </motion.div>
          <motion.div className="text-center mt-14" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <p className="text-slate-500 mb-6">
              Centenas de pequenos negócios já estão vendendo online com o{" "}
              <strong className="text-slate-700">Fosfo Pedidos</strong>
            </p>
            <Link href="/register" className="group inline-flex items-center gap-2 px-7 py-3.5 bg-[#639922] hover:bg-[#527a1c] text-white font-semibold rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-[#639922]/25 hover:-translate-y-0.5">
              Criar meu catálogo grátis
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ══ VEJA AO VIVO ══ */}
      <section className="py-24 bg-slate-50 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="Veja ao vivo"
            title="Teste agora, sem cadastro."
            sub="Explore nosso catálogo demo com produtos reais, carrinho funcional e checkout completo. O painel admin também está aberto para você ver como funciona a gestão de pedidos."
          />

          {/* Imagem do dashboard sem gradientes sobrepostos */}
          <motion.div
            className="relative mb-12 mx-auto max-w-3xl"
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.85, ease: E }}
          >
            {/* Sombra colorida por baixo */}
            <div className="absolute -inset-3 rounded-3xl bg-gradient-to-br from-[#639922]/15 to-slate-300/30 blur-xl pointer-events-none" />
            {/* Container */}
            <div className="relative rounded-2xl overflow-hidden border border-slate-200/80 shadow-2xl shadow-slate-900/8">
              {/* Barra browser */}
              <div className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 border-b border-slate-200">
                <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
                <div className="flex-1 mx-3 py-0.5 px-3 bg-white rounded text-[10px] text-slate-400 font-mono border border-slate-200 text-center">fosfo.app/admin</div>
              </div>
              <div className="relative">
                <Image src={IMG.desktopDashboard} alt="Painel administrativo Fosfo" width={1200} height={675} className="w-full" />
              </div>
            </div>
          </motion.div>

          {/* Cards de acesso */}
          <motion.div className="grid sm:grid-cols-2 gap-5 max-w-2xl mx-auto" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stg(0.1)}>
            {[
              { href: "/demo",       icon: <Store className="w-5 h-5" />,         title: "Catálogo público", desc: "Catálogo com variações e carrinho",            cta: "Acessar" },
              { href: "/demo-admin", icon: <LayoutDashboard className="w-5 h-5" />,title: "Painel admin",    desc: "Gestão de pedidos, produtos e métricas",       cta: "Acessar" },
            ].map(({ href, icon, title, desc, cta }) => (
              <motion.div key={href} variants={fadeUp} whileHover={{ y: -5 }} transition={{ duration: 0.3, ease: E }}>
                <Link href={href} className="group flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6 hover:border-[#639922]/30 hover:shadow-xl hover:shadow-slate-200/60 transition-all duration-300">
                  <div className="flex items-start justify-between">
                    <div className="w-11 h-11 rounded-xl bg-[#639922]/10 flex items-center justify-center text-[#639922] group-hover:bg-[#639922] group-hover:text-white transition-all duration-300">
                      {icon}
                    </div>
                    <div className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 group-hover:border-[#639922] group-hover:text-[#639922] group-hover:bg-[#639922]/5 transition-all duration-300">
                      <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                    </div>
                  </div>
                  <div>
                    <p className="font-bold text-slate-800 mb-1">{title}</p>
                    <p className="text-sm text-slate-500">{desc}</p>
                  </div>
                  <span className="text-sm font-semibold text-[#639922]">{cta} →</span>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ══ FAQ ══ */}
      <section id="faq" className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-start">
            {/* Esquerda: título fixo no scroll */}
            <motion.div
              initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} variants={stg(0.1)}
              className="md:sticky md:top-24"
            >
              <motion.p variants={fadeUp} className="text-xs font-bold text-[#639922] uppercase tracking-[0.18em] mb-3">Dúvidas frequentes</motion.p>
              <motion.h2 variants={fadeUp} className="text-4xl sm:text-5xl font-bold text-slate-900 leading-tight mb-5">
                Tudo que você precisa saber antes de começar.
              </motion.h2>
              <motion.p variants={fadeUp} className="text-slate-500 leading-relaxed mb-8">
                Ainda tem dúvidas? Fale com a gente pelo WhatsApp.
              </motion.p>
              <motion.div variants={fadeUp}>
                <Link href="/register" className="group inline-flex items-center gap-2 px-6 py-3 bg-[#639922] hover:bg-[#527a1c] text-white font-semibold rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-[#639922]/25 hover:-translate-y-0.5">
                  Começar grátis
                  <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </motion.div>
            </motion.div>

            {/* Direita: perguntas */}
            <motion.div className="space-y-2" initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }} variants={stg(0.05)}>
              {FAQ.map((item) => <FaqItem key={item.q} q={item.q} a={item.a} />)}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══ CTA FINAL ══ */}
      <section className="py-28 bg-[#111c14] relative overflow-hidden">
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(ellipse, rgba(99,153,34,0.22) 0%, transparent 65%)" }}
          animate={{ scale: [1, 1.08, 1] }} transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="absolute inset-0 opacity-[0.035] pointer-events-none"
          style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "28px 28px" }} />

        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} variants={stg(0.11)}>
            <motion.p variants={fadeUp} className="text-xs font-bold text-[#639922] uppercase tracking-[0.18em] mb-4">30 dias grátis · sem cartão</motion.p>
            <motion.h2 variants={fadeUp} className="text-5xl sm:text-6xl font-bold text-white mb-6 leading-tight">Testa agora. Decide depois.</motion.h2>
            <motion.p variants={fadeUp} className="text-lg text-white/55 mb-10 max-w-lg mx-auto leading-relaxed">
              30 dias sem custo, sem compromisso. Você cria, seus clientes pedem — e você decide se ficou bom.
            </motion.p>
            <motion.div variants={fadeUp}>
              <Link href="/register" className="group inline-flex items-center justify-center gap-2 px-9 py-4 bg-[#639922] hover:bg-[#527a1c] text-white font-bold text-lg rounded-xl transition-all duration-300 hover:shadow-2xl hover:shadow-[#639922]/35 hover:-translate-y-1 mb-5">
                Criar meu catálogo agora
                <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </motion.div>
            <motion.p variants={fadeUp} className="text-sm text-white/35">
              Já tem conta?{" "}
              <Link href="/login" className="text-white/60 hover:text-white underline transition-colors">Entrar</Link>
            </motion.p>
            <motion.div variants={fadeUp} className="flex flex-wrap items-center justify-center gap-x-7 gap-y-2 mt-10">
              {TRUST.map((t) => (
                <span key={t} className="flex items-center gap-1.5 text-sm text-white/40">
                  <CheckCircle2 className="w-4 h-4 text-[#639922]" />{t}
                </span>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ══ FOOTER ══ */}
      <footer className="py-7 bg-[#0c160f] border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-sm text-white/25">Sistema de Pedidos Fosfo · © 2026</p>
          <div className="flex items-center gap-6">
            <Link href="/demo"     className="text-sm text-white/25 hover:text-white/50 transition-colors">Demo</Link>
            <Link href="/login"    className="text-sm text-white/25 hover:text-white/50 transition-colors">Login</Link>
            <Link href="/register" className="text-sm text-white/25 hover:text-white/50 transition-colors">Cadastrar</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
