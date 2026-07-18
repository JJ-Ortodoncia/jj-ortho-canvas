import logo from "@/assets/logo.png";
import specialist from "@/assets/specialist.png";
import team from "@/assets/team.png";
import { createFileRoute } from "@tanstack/react-router";
import {
  ArrowRight,
  ArrowUpRight,
  Baby,
  Calendar,
  CheckCircle2,
  ChevronDown,
  Clock,
  Droplets,
  Facebook,
  Gem,
  HeartHandshake,
  Instagram,
  Layers,
  Mail,
  MapPin,
  Menu,
  MessageCircle,
  Microscope,
  Phone,
  ShieldCheck,
  Smile,
  Sparkles,
  Star,
  Stethoscope,
  Wrench,
  X
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

export const Route = createFileRoute("/")({
  component: LandingPage,
  head: () => ({
    meta: [
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
});

// ----- Editable site config (single source of truth) -----
const SITE = {
  name: "JJ Ortodoncia",
  whatsapp: "573164288506", // <- editable
  phoneDisplay: "+57 316 4288506",
  email: "citas@jjortodoncia.com",
  address: "Calle 20N # 8-34 Edificio el Cedro, Local 103",
  city: "Popayán, Cauca, Colombia",
  hours: "Lun a Vie: 8:00 a.m. – 6:00 p.m.  ·  Sáb: 9:00 a.m. – 1:00 p.m.",
  mapsQuery: "Odontologia+jj+popayan",
  socials: {
    instagram: "#",
    facebook: "#",
  },
  stats: [
    { value: 15, suffix: "+", label: "Años de experiencia" },
    { value: 3200, suffix: "+", label: "Pacientes atendidos" },
    { value: 100, suffix: "%", label: "Tratamientos personalizados" },
    { value: 24, suffix: "/7", label: "Acompañamiento profesional" },
  ],
};

const waLink = (text = "Hola, quiero agendar una valoración en JJ Ortodoncia") =>
  `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(text)}`;

const trackClick = (label: string) => {
  // Prepared for Google Analytics / Meta Pixel
  // @ts-expect-error - gtag/fbq global
  if (typeof window !== "undefined" && window.gtag) window.gtag("event", "click", { event_label: label });
  // @ts-expect-error - fbq global
  if (typeof window !== "undefined" && window.fbq) window.fbq("trackCustom", label);
};

// ----- Reusable UI -----
function BtnPrimary({
  children,
  href,
  onClick,
  className = "",
}: {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  className?: string;
}) {
  const cls =
    "group inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-soft)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary-dark hover:shadow-[var(--shadow-glow)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary " +
    className;
  if (href)
    return (
      <a href={href} onClick={onClick} className={cls}>
        {children}
      </a>
    );
  return (
    <button onClick={onClick} className={cls}>
      {children}
    </button>
  );
}

function BtnGhost({
  children,
  href,
  onClick,
  className = "",
}: {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  className?: string;
}) {
  const cls =
    "inline-flex items-center justify-center gap-2 rounded-full border border-primary/20 bg-white px-6 py-3.5 text-sm font-semibold text-primary-dark transition-all duration-300 hover:-translate-y-0.5 hover:border-primary hover:bg-primary-soft " +
    className;
  if (href)
    return (
      <a href={href} target="_blank" rel="noreferrer" onClick={onClick} className={cls}>
        {children}
      </a>
    );
  return (
    <button onClick={onClick} className={cls}>
      {children}
    </button>
  );
}

function Chip({ children, tone = "primary" }: { children: React.ReactNode; tone?: "primary" | "lime" | "yellow" | "purple" }) {
  const tones: Record<string, string> = {
    primary: "bg-primary-soft text-primary-dark",
    lime: "bg-[color-mix(in_oklab,var(--lime)_25%,white)] text-[color-mix(in_oklab,var(--lime)_60%,black)]",
    yellow: "bg-[color-mix(in_oklab,var(--yellow)_30%,white)] text-[color-mix(in_oklab,var(--yellow)_35%,black)]",
    purple: "bg-[color-mix(in_oklab,var(--purple)_18%,white)] text-purple",
  };
  return (
    <span className={`inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-semibold ${tones[tone]}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
      {children}
    </span>
  );
}

// Animated counter
function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const [n, setN] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);
  useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting && !started.current) {
            started.current = true;
            const dur = 1400;
            const start = performance.now();
            const tick = (t: number) => {
              const p = Math.min(1, (t - start) / dur);
              setN(Math.floor(p * to));
              if (p < 1) requestAnimationFrame(tick);
              else setN(to);
            };
            requestAnimationFrame(tick);
          }
        });
      },
      { threshold: 0.3 },
    );
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, [to]);
  return (
    <span ref={ref} className="tabular-nums">
      {n.toLocaleString("es-CO")}
      {suffix}
    </span>
  );
}

// Reveal on scroll
function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(
      ([e]) => e.isIntersecting && setVisible(true),
      { threshold: 0.15 },
    );
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-700 ease-out ${visible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"}`}
    >
      {children}
    </div>
  );
}

// ----- Header -----
function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 12);
    on();
    window.addEventListener("scroll", on);
    return () => window.removeEventListener("scroll", on);
  }, []);
  const links = [
    { href: "#inicio", label: "Inicio" },
    { href: "#tratamientos", label: "Tratamientos" },
    { href: "#equipo", label: "Especialistas" },
    { href: "#clinica", label: "Nuestra clínica" },
    { href: "#faq", label: "Preguntas frecuentes" },
    { href: "#contacto", label: "Contacto" },
  ];
  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${scrolled ? "bg-white/85 backdrop-blur-md shadow-[0_2px_20px_-8px_rgba(12,78,115,0.15)]" : "bg-transparent"}`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <a href="#inicio" className="flex min-w-0 items-center gap-2.5">
          <img src={logo} alt="JJ Ortodoncia logo" className="h-11 w-11 shrink-0 rounded-full" />
          <div className="flex min-w-0 flex-col leading-tight">
            <span className="truncate font-display text-base font-extrabold text-primary-dark">JJ Ortodoncia</span>
            <span className="hidden truncate text-[11px] text-muted-foreground sm:block">Ortodoncia especializada</span>
          </div>
        </a>
        <nav className="hidden items-center gap-1 lg:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="rounded-full px-3.5 py-2 text-sm font-medium text-foreground/80 transition-colors hover:bg-primary-soft hover:text-primary-dark"
            >
              {l.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <BtnPrimary
            href="#contacto"
            onClick={() => trackClick("header_agendar")}
            className="hidden sm:inline-flex"
          >
            <Calendar className="h-4 w-4" /> Agenda tu valoración
          </BtnPrimary>
          <a
            href={waLink()}
            onClick={() => trackClick("header_whatsapp")}
            target="_blank"
            rel="noreferrer"
            aria-label="Escribir por WhatsApp"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-whatsapp text-white shadow-[var(--shadow-soft)] transition-transform hover:-translate-y-0.5 lg:hidden"
          >
            <MessageCircle className="h-5 w-5" />
          </a>
          <button
            aria-label="Abrir menú"
            onClick={() => setOpen((v) => !v)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border bg-white text-primary-dark lg:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>
      {open && (
        <div className="lg:hidden">
          <div className="mx-4 mb-4 rounded-3xl border border-border bg-white p-3 shadow-lg">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="block rounded-2xl px-4 py-3 text-sm font-medium text-foreground/85 hover:bg-primary-soft"
              >
                {l.label}
              </a>
            ))}
            <BtnPrimary href="#contacto" className="mt-2 w-full" onClick={() => setOpen(false)}>
              <Calendar className="h-4 w-4" /> Agenda tu valoración
            </BtnPrimary>
          </div>
        </div>
      )}
    </header>
  );
}

// ----- Hero -----
function Hero() {
  return (
    <section id="inicio" className="relative overflow-hidden pt-24 pb-14 sm:pt-32 sm:pb-20 lg:pt-36 lg:pb-24">
      {/* Background shapes */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-24 -left-24 h-[420px] w-[420px] rounded-full bg-primary-soft blur-3xl" />
        <div className="absolute right-[-80px] top-40 h-[320px] w-[320px] blob bg-[color-mix(in_oklab,var(--lime)_35%,white)] opacity-60 blur-2xl" />
        <div className="absolute bottom-0 left-1/3 h-[260px] w-[260px] rounded-full bg-[color-mix(in_oklab,var(--yellow)_35%,white)] opacity-50 blur-3xl" />
      </div>

      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-4 sm:gap-12 sm:px-6 lg:grid-cols-2 lg:gap-8 lg:px-8">
        <Reveal>
          <div className="max-w-xl">
            <Chip>Ortodoncia y odontología especializada</Chip>
            <h1 className="mt-5 font-display text-[2rem] font-extrabold leading-[1.08] text-primary-dark sm:text-5xl lg:text-6xl">
              Tu sonrisa merece un tratamiento{" "}
              <span className="smile-underline">diseñado para ti</span>
            </h1>
            <p className="mt-5 text-base leading-relaxed text-muted-foreground sm:text-lg">
              Te acompañamos con tratamientos especializados, atención cercana y soluciones pensadas
              para mejorar tu sonrisa, tu salud y tu confianza.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <BtnPrimary href="#contacto" onClick={() => trackClick("hero_agendar")}>
                <Calendar className="h-4 w-4" /> Agenda tu valoración
              </BtnPrimary>
              <BtnGhost href={waLink()} onClick={() => trackClick("hero_whatsapp")}>
                <MessageCircle className="h-4 w-4 text-whatsapp" /> Hablar por WhatsApp
              </BtnGhost>
            </div>
            <ul className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary" /> Valoración personalizada</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary" /> Atención especializada</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary" /> Planes claros</li>
            </ul>
          </div>
        </Reveal>

        {/* Right composition */}
        <Reveal delay={150}>
          <div className="relative mx-auto aspect-square w-full max-w-[520px]">
            {/* Big blob backdrop */}
            <div className="absolute inset-4 blob bg-gradient-to-br from-primary to-primary-dark shadow-[var(--shadow-glow)]" />
            {/* Color accents */}
            <div className="absolute -left-4 top-10 h-24 w-24 rounded-3xl bg-[var(--lime)] rotate-6 shadow-lg" />
            <div className="absolute -right-2 bottom-16 h-20 w-20 rounded-full bg-[var(--yellow)] shadow-lg" />
            <div className="absolute right-10 top-0 h-14 w-14 rounded-2xl bg-purple/90 shadow-lg" />
            {/* Photo */}
            <img
              src={specialist}
              alt="Especialista de JJ Ortodoncia"
              className="absolute inset-0 h-full w-full object-contain drop-shadow-[0_25px_35px_rgba(12,78,115,0.35)]"
            />
            {/* Floating cards */}
            <div className="animate-float-slow absolute -left-6 top-1/3 flex items-center gap-2 rounded-2xl bg-white/95 px-3.5 py-2.5 shadow-lg backdrop-blur">
              <span className="grid h-8 w-8 place-items-center rounded-full bg-primary-soft text-primary"><HeartHandshake className="h-4 w-4" /></span>
              <span className="text-xs font-semibold text-primary-dark">Atención personalizada</span>
            </div>
            <div className="animate-float-slow absolute -right-2 top-6 flex items-center gap-2 rounded-2xl bg-white/95 px-3.5 py-2.5 shadow-lg backdrop-blur" style={{ animationDelay: "1.5s" }}>
              <span className="grid h-8 w-8 place-items-center rounded-full bg-[color-mix(in_oklab,var(--lime)_30%,white)] text-[color-mix(in_oklab,var(--lime)_50%,black)]"><Sparkles className="h-4 w-4" /></span>
              <span className="text-xs font-semibold text-primary-dark">Ortodoncia especializada</span>
            </div>
            <div className="animate-float-slow absolute bottom-2 left-6 flex items-center gap-2 rounded-2xl bg-white/95 px-3.5 py-2.5 shadow-lg backdrop-blur" style={{ animationDelay: "3s" }}>
              <span className="grid h-8 w-8 place-items-center rounded-full bg-[color-mix(in_oklab,var(--yellow)_35%,white)] text-[color-mix(in_oklab,var(--yellow)_35%,black)]"><Smile className="h-4 w-4" /></span>
              <span className="text-xs font-semibold text-primary-dark">Sonrisas que se sienten bien</span>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ----- Stats strip -----
function StatsStrip() {
  return (
    <section aria-label="Indicadores" className="relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-3 rounded-[2rem] bg-gradient-to-br from-primary to-primary-dark p-6 text-primary-foreground shadow-[var(--shadow-glow)] sm:grid-cols-4 sm:gap-6 sm:p-8">
          {SITE.stats.map((s, i) => (
            <div key={i} className="text-center">
              <div className="font-display text-3xl font-extrabold sm:text-4xl">
                <Counter to={s.value} suffix={s.suffix} />
              </div>
              <div className="mt-1 text-xs font-medium opacity-85 sm:text-sm">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ----- Treatments -----
const treatments = [
  { icon: Layers, title: "Ortodoncia convencional", desc: "Brackets metálicos eficaces para corregir la posición dental.", tone: "primary" },
  { icon: Gem, title: "Ortodoncia estética", desc: "Brackets cerámicos discretos, resultados igual de sólidos.", tone: "purple" },
  { icon: Sparkles, title: "Alineadores transparentes", desc: "Solución removible, cómoda y prácticamente invisible.", tone: "lime" },
  { icon: ShieldCheck, title: "Odontología preventiva", desc: "Cuidamos tu salud oral antes de que aparezcan los problemas.", tone: "yellow" },
  { icon: Smile, title: "Diseño de sonrisa", desc: "Planificamos una sonrisa armónica pensada para tu rostro.", tone: "primary" },
  { icon: Droplets, title: "Limpieza y cuidado oral", desc: "Profilaxis y hábitos que mantienen tu boca sana.", tone: "lime" },
  { icon: Wrench, title: "Restauraciones", desc: "Reparamos y recuperamos la función de tus dientes.", tone: "yellow" },
  { icon: Stethoscope, title: "Atención odontológica integral", desc: "Un equipo, todas las especialidades bajo un mismo techo.", tone: "purple" },
] as const;

const toneMap: Record<string, { chip: string; ring: string; icon: string }> = {
  primary: { chip: "bg-primary-soft", ring: "ring-primary/20", icon: "text-primary" },
  lime: { chip: "bg-[color-mix(in_oklab,var(--lime)_25%,white)]", ring: "ring-[color-mix(in_oklab,var(--lime)_40%,transparent)]", icon: "text-[color-mix(in_oklab,var(--lime)_45%,black)]" },
  yellow: { chip: "bg-[color-mix(in_oklab,var(--yellow)_30%,white)]", ring: "ring-[color-mix(in_oklab,var(--yellow)_45%,transparent)]", icon: "text-[color-mix(in_oklab,var(--yellow)_35%,black)]" },
  purple: { chip: "bg-[color-mix(in_oklab,var(--purple)_18%,white)]", ring: "ring-purple/20", icon: "text-purple" },
};

function Treatments() {
  return (
    <section id="tratamientos" className="relative py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <Chip tone="lime">Tratamientos</Chip>
            <h2 className="mt-4 font-display text-3xl font-extrabold text-primary-dark sm:text-4xl lg:text-5xl">
              Tratamientos para cada etapa de tu sonrisa
            </h2>
            <p className="mt-4 text-muted-foreground">
              Evaluamos tus necesidades y creamos un plan de tratamiento claro, cómodo y personalizado.
            </p>
          </div>
        </Reveal>
        <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {treatments.map((t, i) => {
            const tone = toneMap[t.tone];
            const Icon = t.icon;
            return (
              <Reveal key={t.title} delay={i * 60}>
                <a
                  href="#contacto"
                  className={`group relative flex h-full flex-col justify-between overflow-hidden rounded-3xl border border-border bg-white p-6 ring-1 ${tone.ring} transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-soft)]`}
                >
                  <div
                    aria-hidden
                    className={`pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full opacity-0 transition-opacity duration-500 group-hover:opacity-100 ${tone.chip}`}
                  />
                  <div className="relative">
                    <span className={`inline-grid h-12 w-12 place-items-center rounded-2xl ${tone.chip} ${tone.icon} transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110`}>
                      <Icon className="h-6 w-6" strokeWidth={1.6} />
                    </span>
                    <h3 className="mt-5 font-display text-lg font-bold text-primary-dark">{t.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{t.desc}</p>
                  </div>
                  <span className="relative mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition-all group-hover:gap-2.5">
                    Conocer tratamiento <ArrowUpRight className="h-4 w-4" />
                  </span>
                </a>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ----- Differentiators -----
function Differentiators() {
  const items = [
    "Valoración completa antes de iniciar.",
    "Explicación clara de cada etapa.",
    "Tratamientos adaptados a cada paciente.",
    "Seguimiento cercano.",
    "Tecnología aplicada al diagnóstico.",
    "Ambiente profesional y humano.",
  ];
  return (
    <section id="clinica" className="relative overflow-hidden bg-primary-soft/40 py-16 sm:py-20 lg:py-24">
      <div aria-hidden className="absolute -left-32 top-10 h-72 w-72 rounded-full bg-[color-mix(in_oklab,var(--yellow)_25%,white)] opacity-60 blur-3xl" />
      <div aria-hidden className="absolute -right-24 bottom-0 h-80 w-80 blob bg-[color-mix(in_oklab,var(--lime)_25%,white)] opacity-50 blur-3xl" />
      <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-start gap-10 px-4 sm:px-6 lg:grid-cols-12 lg:gap-16 lg:px-8">
        <div className="lg:col-span-5">
          <Reveal>
            <Chip tone="purple">Nuestro enfoque</Chip>
            <h2 className="mt-4 font-display text-3xl font-extrabold leading-[1.1] text-primary-dark sm:text-4xl md:text-5xl lg:text-[3.25rem] xl:text-6xl">
              No tratamos dientes.{" "}
              <span className="smile-underline">Tratamos personas.</span>
            </h2>
            <p className="mt-5 max-w-prose text-base text-muted-foreground sm:mt-6 sm:text-lg">
              Cada sonrisa cuenta una historia diferente. La escuchamos antes de proponer un plan.
            </p>
          </Reveal>
        </div>
        <div className="lg:col-span-7">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {items.map((t, i) => (
              <Reveal key={t} delay={i * 70}>
                <div className="flex h-full items-start gap-3 rounded-3xl bg-white p-5 shadow-[0_10px_30px_-20px_rgba(12,78,115,0.35)]">
                  <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground">
                    <CheckCircle2 className="h-5 w-5" />
                  </span>
                  <p className="text-sm font-medium text-foreground/90 sm:text-base">{t}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>

    </section>
  );
}

// ----- Team -----
function Team() {
  const profiles = [
    {
      name: "Dr. Jose Hurtado",
      specialty: "Ortodoncista Especialista",
      desc: "Enfocado en tratamientos personalizados y planificación de sonrisas.",
    },

  ];
  return (
    <section id="equipo" className="relative py-24">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-14 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
        <Reveal>
          <div className="relative mx-auto aspect-[5/4] w-full max-w-[560px]">
            <div className="absolute inset-2 blob-2 bg-gradient-to-br from-[color-mix(in_oklab,var(--purple)_75%,white)] via-primary to-[color-mix(in_oklab,var(--lime)_50%,var(--primary))]" />
            <div className="absolute -right-4 top-6 h-16 w-16 rounded-full bg-[var(--yellow)] shadow-lg" />
            <div className="absolute -left-6 bottom-10 h-20 w-20 rounded-3xl bg-[var(--lime)] rotate-12 shadow-lg" />
            <img src={team} alt="Equipo JJ Ortodoncia" className="absolute inset-0 h-full w-full object-contain drop-shadow-2xl" />
          </div>
        </Reveal>
        <div>
          <Reveal>
            <Chip tone="yellow">Nuestro equipo</Chip>
            <h2 className="mt-4 font-display text-3xl font-extrabold text-primary-dark sm:text-4xl lg:text-5xl">
              Especialistas que te acompañan de verdad
            </h2>
            <p className="mt-4 text-muted-foreground">
              Creemos que un buen tratamiento empieza cuando el paciente entiende, confía y se siente acompañado.
            </p>
          </Reveal>
          <div className="mt-8 grid grid-cols-1 gap-4">
            {profiles.map((p, i) => (
              <Reveal key={p.name} delay={i * 100}>
                <article className="group flex items-start gap-4 rounded-3xl border border-border bg-white p-5 transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-soft)]">
                  <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-primary-soft font-display text-xl font-extrabold text-primary-dark">
                    {p.name.split(" ").slice(-2).map((s) => s[0]).join("")}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-display text-lg font-bold text-primary-dark">{p.name}</h3>
                    <p className="text-sm font-semibold text-primary">{p.specialty}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{p.desc}</p>
                    <p className="mt-1 text-xs text-muted-foreground/80">{p.credentials}</p>
                  </div>
                  <ArrowUpRight className="h-5 w-5 shrink-0 text-primary transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ----- Process -----
function Process() {
  const steps = [
    { n: "01", t: "Agenda tu valoración", d: "Elige la fecha que mejor se ajuste a ti." },
    { n: "02", t: "Realizamos un diagnóstico", d: "Analizamos tu caso con detalle y tecnología." },
    { n: "03", t: "Diseñamos tu plan", d: "Recibirás una propuesta clara, personalizada y honesta." },
    { n: "04", t: "Iniciamos y acompañamos", d: "Seguimiento cercano en cada etapa de tu evolución." },
  ];
  return (
    <section className="relative overflow-hidden py-24">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-1/2 hidden -translate-y-1/2 lg:block">
        <svg viewBox="0 0 1200 120" fill="none" className="mx-auto w-full max-w-6xl">
          <path
            d="M20 90 C 200 10, 400 130, 600 70 S 1000 10, 1180 80"
            stroke="url(#g)"
            strokeWidth="3"
            strokeDasharray="6 8"
            strokeLinecap="round"
          />
          <defs>
            <linearGradient id="g" x1="0" x2="1">
              <stop offset="0" stopColor="oklch(0.62 0.13 235)" />
              <stop offset="1" stopColor="oklch(0.83 0.19 125)" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <Chip>Cómo trabajamos</Chip>
            <h2 className="mt-4 font-display text-3xl font-extrabold text-primary-dark sm:text-4xl lg:text-5xl">
              Así empieza tu nueva sonrisa
            </h2>
          </div>
        </Reveal>
        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <Reveal key={s.n} delay={i * 100}>
              <div
                className={`relative rounded-3xl border border-border bg-white p-6 shadow-[0_10px_30px_-24px_rgba(12,78,115,0.4)] ${i % 2 ? "lg:translate-y-8" : ""}`}
              >
                <span className="font-display text-4xl font-extrabold text-primary/25">{s.n}</span>
                <h3 className="mt-2 font-display text-lg font-bold text-primary-dark">{s.t}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{s.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}


// ----- Testimonials -----
function Testimonials() {
  const items = [
    { name: "María P.", t: "Ortodoncia estética", c: "Me sentí acompañada en cada control. El plan fue muy claro desde el inicio.", r: 5 },
    { name: "Andrés G.", t: "Alineadores transparentes", c: "La experiencia fue cómoda y los resultados se notan. Volvería sin dudar.", r: 5 },
    { name: "Laura V.", t: "Diseño de sonrisa", c: "Explicaron todo con paciencia. Hoy sonrío con mucha más confianza.", r: 5 },
    { name: "Camilo R.", t: "Ortodoncia convencional", c: "Excelente trato humano, siempre resolvieron mis dudas al momento.", r: 5 },
  ];
  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <Chip tone="yellow">Testimonios · contenido editable</Chip>
            <h2 className="mt-4 font-display text-3xl font-extrabold text-primary-dark sm:text-4xl lg:text-5xl">
              Lo que nuestros pacientes recuerdan de su experiencia
            </h2>
          </div>
        </Reveal>
        <div className="mt-12 -mx-4 overflow-x-auto px-4 pb-4">
          <div className="flex snap-x snap-mandatory gap-5">
            {items.map((it, i) => (
              <Reveal key={i} delay={i * 80}>
                <article className="w-[85vw] max-w-sm shrink-0 snap-center rounded-3xl border border-border bg-white p-6 shadow-[0_10px_30px_-24px_rgba(12,78,115,0.4)] sm:w-[360px]">
                  <div className="flex items-center gap-3">
                    <div className="grid h-11 w-11 place-items-center rounded-full bg-primary-soft font-display text-lg font-extrabold text-primary-dark">
                      {it.name[0]}
                    </div>
                    <div>
                      <p className="font-semibold text-primary-dark">{it.name}</p>
                      <p className="text-xs text-muted-foreground">{it.t}</p>
                    </div>
                  </div>
                  <div className="mt-3 flex gap-0.5 text-[var(--yellow)]">
                    {Array.from({ length: it.r }).map((_, k) => (
                      <Star key={k} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-foreground/85">"{it.c}"</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ----- Blog / education -----
function Blog() {
  const posts = [
    { t: "¿Cuándo es recomendable iniciar ortodoncia?", d: "Señales clave para saber si es el momento adecuado.", icon: Baby, tone: "lime" as const },
    { t: "Alineadores transparentes: lo que debes saber", d: "Ventajas, cuidados y expectativas realistas.", icon: Sparkles, tone: "primary" as const },
    { t: "Cómo cuidar tus dientes durante ortodoncia", d: "Rutina, alimentación y hábitos que marcan diferencia.", icon: Microscope, tone: "purple" as const },
  ];
  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
            <div className="max-w-xl">
              <Chip tone="lime">Consejos</Chip>
              <h2 className="mt-4 font-display text-3xl font-extrabold text-primary-dark sm:text-4xl">
                Información clara para cuidar tu sonrisa
              </h2>
            </div>
            <BtnGhost href="#" onClick={() => trackClick("blog_ver_mas")}>
              Ver consejos de salud oral <ArrowRight className="h-4 w-4" />
            </BtnGhost>
          </div>
        </Reveal>
        <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-3">
          {posts.map((p, i) => {
            const tone = toneMap[p.tone];
            const Icon = p.icon;
            return (
              <Reveal key={p.t} delay={i * 100}>
                <a href="#" className="group block h-full overflow-hidden rounded-3xl border border-border bg-white transition-all hover:-translate-y-1 hover:shadow-[var(--shadow-soft)]">
                  <div className={`relative h-40 ${tone.chip}`}>
                    <div className="absolute inset-0 grid place-items-center">
                      <Icon className={`h-14 w-14 ${tone.icon}`} strokeWidth={1.4} />
                    </div>
                    <div className="absolute -bottom-6 left-6 h-12 w-12 rounded-full bg-white shadow-md" />
                  </div>
                  <div className="p-6">
                    <h3 className="font-display text-lg font-bold text-primary-dark">{p.t}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{p.d}</p>
                    <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition-all group-hover:gap-2.5">
                      Leer más <ArrowUpRight className="h-4 w-4" />
                    </span>
                  </div>
                </a>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ----- FAQ -----
function FAQ() {
  const items = [
    { q: "¿Cuánto dura un tratamiento de ortodoncia?", a: "Depende de cada caso, pero suele estar entre 12 y 24 meses. En la valoración recibirás una estimación clara." },
    { q: "¿La valoración tiene costo?", a: "Consúltanos por WhatsApp para conocer las condiciones vigentes de la valoración inicial." },
    { q: "¿Qué tipo de ortodoncia es mejor para mí?", a: "Cada tipo tiene ventajas. En la valoración te recomendamos la opción que mejor se adapta a tu caso y estilo de vida." },
    { q: "¿Los alineadores sirven para todos los pacientes?", a: "Son una excelente alternativa en muchos casos, pero no en todos. Evaluamos si son adecuados para ti." },
    { q: "¿Puedo financiar mi tratamiento?", a: "Sí, contamos con planes de pago flexibles. Te contamos las opciones durante la valoración." },
    { q: "¿Cada cuánto debo asistir a control?", a: "Habitualmente cada 4 a 6 semanas, según la etapa y el tipo de tratamiento." },
    { q: "¿Atienden niños y adultos?", a: "Sí, atendemos pacientes de todas las edades con enfoques adaptados a cada etapa." },
    { q: "¿Cómo agendo una cita?", a: "Escríbenos por WhatsApp o completa el formulario de contacto y te confirmamos disponibilidad." },
  ];
  return (
    <section id="faq" className="relative overflow-hidden py-24">
      <div aria-hidden className="absolute -right-24 top-10 h-72 w-72 rounded-full bg-primary-soft blur-3xl" />
      <div className="relative mx-auto grid max-w-7xl grid-cols-1 gap-12 px-4 sm:px-6 lg:grid-cols-12 lg:gap-16 lg:px-8">
        <div className="lg:col-span-4">
          <Reveal>
            <Chip>Preguntas frecuentes</Chip>
            <h2 className="mt-4 font-display text-3xl font-extrabold text-primary-dark sm:text-4xl">
              Resolvemos tus <span className="smile-underline">dudas</span>
            </h2>
            <p className="mt-4 text-muted-foreground">
              Si no encuentras la respuesta que buscas, escríbenos por WhatsApp.
            </p>
            <BtnGhost href={waLink()} className="mt-6" onClick={() => trackClick("faq_whatsapp")}>
              <MessageCircle className="h-4 w-4 text-whatsapp" /> Escribir por WhatsApp
            </BtnGhost>
          </Reveal>
        </div>
        <div className="lg:col-span-8">
          <div className="divide-y divide-border overflow-hidden rounded-3xl border border-border bg-white">
            {items.map((it, i) => (
              <details key={i} className="group">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-5 text-left transition-colors hover:bg-primary-soft/40 sm:px-6">
                  <span className="font-display text-base font-semibold text-primary-dark sm:text-lg">{it.q}</span>
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-primary-soft text-primary transition-transform group-open:rotate-180">
                    <ChevronDown className="h-4 w-4" />
                  </span>
                </summary>
                <div className="px-5 pb-5 text-sm leading-relaxed text-muted-foreground sm:px-6">{it.a}</div>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ----- Final CTA -----
function FinalCTA() {
  return (
    <section className="relative overflow-hidden bg-primary-dark py-24 text-primary-foreground">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -left-20 -top-16 h-80 w-80 rounded-full bg-primary/60 blur-3xl" />
        <div className="absolute right-0 top-1/3 h-64 w-64 blob bg-[color-mix(in_oklab,var(--lime)_60%,var(--primary-dark))] opacity-70 blur-2xl" />
        <div className="absolute -bottom-10 left-1/3 h-64 w-64 rounded-full bg-[color-mix(in_oklab,var(--yellow)_50%,var(--primary-dark))] opacity-70 blur-3xl" />
      </div>
      <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-4 sm:px-6 lg:grid-cols-12 lg:px-8">
        <div className="lg:col-span-7">
          <Chip tone="yellow">Empieza hoy</Chip>
          <h2 className="mt-4 font-display text-3xl font-extrabold leading-[1.05] sm:text-4xl lg:text-5xl">
            El mejor momento para empezar a cuidar tu sonrisa es hoy
          </h2>
          <p className="mt-4 max-w-2xl text-primary-foreground/85">
            Agenda una valoración y recibe una orientación personalizada para conocer el tratamiento
            más adecuado para ti.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href="#contacto"
              onClick={() => trackClick("cta_final_agendar")}
              className="inline-flex items-center gap-2 rounded-full bg-[var(--yellow)] px-6 py-3.5 text-sm font-semibold text-primary-dark shadow-lg transition-transform hover:-translate-y-0.5"
            >
              <Calendar className="h-4 w-4" /> Agendar valoración
            </a>
            <a
              href={waLink()}
              target="_blank"
              rel="noreferrer"
              onClick={() => trackClick("cta_final_whatsapp")}
              className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/30 bg-white/10 px-6 py-3.5 text-sm font-semibold text-primary-foreground backdrop-blur transition-colors hover:bg-white/20"
            >
              <MessageCircle className="h-4 w-4" /> Escribir por WhatsApp
            </a>
          </div>
        </div>
        <div className="lg:col-span-5">
          <div className="relative mx-auto aspect-square w-full max-w-[420px]">
            <div className="absolute inset-4 blob-2 bg-gradient-to-br from-[var(--lime)] via-primary to-purple opacity-90" />
            <img src={team} alt="Equipo JJ Ortodoncia" className="absolute inset-0 h-full w-full object-contain drop-shadow-2xl" />
          </div>
        </div>
      </div>
    </section>
  );
}

// ----- Contact -----
function Contact() {
  const [sent, setSent] = useState(false);
  return (
    <section id="contacto" className="py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
          <Reveal>
            <div>
              <Chip>Contacto</Chip>
              <h2 className="mt-4 font-display text-3xl font-extrabold text-primary-dark sm:text-4xl">
                Estamos listos para atenderte
              </h2>
              <p className="mt-4 text-muted-foreground">
                Escríbenos, llámanos o visítanos. Con gusto resolvemos tus dudas.
              </p>
              <ul className="mt-8 space-y-4 text-sm">
                <li className="flex items-start gap-3">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-primary-soft text-primary"><MapPin className="h-5 w-5" /></span>
                  <div>
                    <p className="font-semibold text-primary-dark">Dirección</p>
                    <p className="text-muted-foreground">{SITE.address} · {SITE.city}</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-primary-soft text-primary"><Phone className="h-5 w-5" /></span>
                  <div>
                    <p className="font-semibold text-primary-dark">Teléfono / WhatsApp</p>
                    <p className="text-muted-foreground">{SITE.phoneDisplay}</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-primary-soft text-primary"><Mail className="h-5 w-5" /></span>
                  <div>
                    <p className="font-semibold text-primary-dark">Correo</p>
                    <p className="text-muted-foreground">{SITE.email}</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-primary-soft text-primary"><Clock className="h-5 w-5" /></span>
                  <div>
                    <p className="font-semibold text-primary-dark">Horarios</p>
                    <p className="text-muted-foreground">{SITE.hours}</p>
                  </div>
                </li>
              </ul>
              <div className="mt-8 overflow-hidden rounded-3xl border border-border">
                <iframe
                  title="Mapa JJ Ortodoncia"
                  src={`https://www.google.com/maps?q=${encodeURIComponent(SITE.mapsQuery)}&output=embed`}
                  className="h-64 w-full"
                  loading="lazy"
                />
              </div>
            </div>
          </Reveal>
          <Reveal delay={120}>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                trackClick("form_valoracion");
                setSent(true);
              }}
              className="rounded-3xl border border-border bg-white p-6 shadow-[var(--shadow-soft)] sm:p-8"
            >
              {sent ? (
                <div className="grid place-items-center py-16 text-center">
                  <span className="grid h-14 w-14 place-items-center rounded-full bg-primary text-primary-foreground">
                    <CheckCircle2 className="h-7 w-7" />
                  </span>
                  <h3 className="mt-4 font-display text-2xl font-bold text-primary-dark">¡Gracias! Recibimos tu solicitud</h3>
                  <p className="mt-2 max-w-sm text-sm text-muted-foreground">
                    Nuestro equipo te contactará muy pronto para coordinar tu valoración.
                  </p>
                </div>
              ) : (
                <>
                  <h3 className="font-display text-xl font-bold text-primary-dark">Solicita tu valoración</h3>
                  <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <Field label="Nombre" name="name" required />
                    <Field label="Teléfono" name="phone" type="tel" required />
                    <Field label="Correo" name="email" type="email" required className="sm:col-span-2" />
                    <div className="sm:col-span-2">
                      <label className="mb-1.5 block text-xs font-semibold text-primary-dark">Tratamiento de interés</label>
                      <select
                        required
                        className="w-full rounded-2xl border border-input bg-background px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                      >
                        <option value="">Selecciona una opción</option>
                        {treatments.map((t) => (
                          <option key={t.title}>{t.title}</option>
                        ))}
                        <option>No estoy seguro / Otro</option>
                      </select>
                    </div>
                    <div className="sm:col-span-2">
                      <label className="mb-1.5 block text-xs font-semibold text-primary-dark">Mensaje</label>
                      <textarea
                        rows={4}
                        className="w-full resize-none rounded-2xl border border-input bg-background px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                        placeholder="Cuéntanos brevemente qué necesitas"
                      />
                    </div>
                    <label className="flex items-start gap-3 text-xs text-muted-foreground sm:col-span-2">
                      <input type="checkbox" required className="mt-0.5 h-4 w-4 accent-[color:var(--primary)]" />
                      <span>Autorizo el tratamiento de mis datos personales de acuerdo con la política de la clínica.</span>
                    </label>
                  </div>
                  <BtnPrimary className="mt-6 w-full">
                    <Calendar className="h-4 w-4" /> Solicitar valoración
                  </BtnPrimary>
                </>
              )}
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  className = "",
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  className?: string;
}) {
  return (
    <div className={className}>
      <label htmlFor={name} className="mb-1.5 block text-xs font-semibold text-primary-dark">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        className="w-full rounded-2xl border border-input bg-background px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
      />
    </div>
  );
}

// ----- Footer -----
function Footer() {
  return (
    <footer className="bg-primary-dark/95 text-primary-foreground">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 py-16 sm:px-6 lg:grid-cols-4 lg:px-8">
        <div>
          <div className="flex items-center gap-3">
            <img src={logo} alt="JJ Ortodoncia" className="h-12 w-12 rounded-full bg-white p-1" />
            <span className="font-display text-lg font-extrabold">JJ Ortodoncia</span>
          </div>
          <p className="mt-4 text-sm text-primary-foreground/80">
            Ortodoncia y odontología integral con atención cercana, moderna y humana.
          </p>
          <div className="mt-5 flex gap-2">
            <a href={SITE.socials.instagram} aria-label="Instagram" className="grid h-10 w-10 place-items-center rounded-full bg-white/10 transition-colors hover:bg-white/20">
              <Instagram className="h-4 w-4" />
            </a>
            <a href={SITE.socials.facebook} aria-label="Facebook" className="grid h-10 w-10 place-items-center rounded-full bg-white/10 transition-colors hover:bg-white/20">
              <Facebook className="h-4 w-4" />
            </a>
          </div>
        </div>
        <div>
          <h4 className="font-display font-bold">Enlaces</h4>
          <ul className="mt-4 space-y-2 text-sm text-primary-foreground/80">
            <li><a href="#inicio" className="hover:text-white">Inicio</a></li>
            <li><a href="#tratamientos" className="hover:text-white">Tratamientos</a></li>
            <li><a href="#equipo" className="hover:text-white">Especialistas</a></li>
            <li><a href="#faq" className="hover:text-white">Preguntas frecuentes</a></li>
            <li><a href="#contacto" className="hover:text-white">Contacto</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-display font-bold">Tratamientos</h4>
          <ul className="mt-4 space-y-2 text-sm text-primary-foreground/80">
            {treatments.slice(0, 6).map((t) => (
              <li key={t.title}><a href="#tratamientos" className="hover:text-white">{t.title}</a></li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="font-display font-bold">Contacto</h4>
          <ul className="mt-4 space-y-2 text-sm text-primary-foreground/80">
            <li>{SITE.address}</li>
            <li>{SITE.city}</li>
            <li>{SITE.phoneDisplay}</li>
            <li>{SITE.email}</li>
            <li className="text-xs opacity-80">{SITE.hours}</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-3 px-4 py-5 text-xs text-primary-foreground/70 sm:flex-row sm:items-center sm:px-6 lg:px-8">
          <p>© {new Date().getFullYear()} JJ Ortodoncia. Todos los derechos reservados.</p>
          <ul className="flex flex-wrap gap-4">
            <li><a href="#" className="hover:text-white">Política de privacidad</a></li>
            <li><a href="#" className="hover:text-white">Tratamiento de datos</a></li>
            <li><a href="#" className="hover:text-white">Términos y condiciones</a></li>
          </ul>
        </div>
      </div>
    </footer>
  );
}

// ----- Floating actions -----
function FloatingActions() {
  return (
    <>
      <a
        href={waLink()}
        target="_blank"
        rel="noreferrer"
        onClick={() => trackClick("floating_whatsapp")}
        aria-label="Escribir por WhatsApp"
        className="group fixed bottom-5 right-5 z-40 inline-flex h-14 w-14 items-center justify-center rounded-full bg-whatsapp text-white shadow-[0_15px_40px_-10px_rgba(0,0,0,0.35)] transition-transform hover:-translate-y-1 sm:bottom-6 sm:right-6"
      >
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-whatsapp opacity-30" />
        <MessageCircle className="relative h-6 w-6" />
      </a>
      {/* Mobile sticky booking */}
      <a
        href="#contacto"
        onClick={() => trackClick("sticky_agendar")}
        className="fixed inset-x-4 bottom-4 z-30 inline-flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-3.5 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-glow)] sm:hidden"
      >
        <Calendar className="h-4 w-4" /> Agenda tu valoración
      </a>
    </>
  );
}

function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main>
        <Hero />
        <StatsStrip />
        <Treatments />
        <Differentiators />
        <Team />
        <Process />
        
        <Testimonials />
        <Blog />
        <FAQ />
        <FinalCTA />
        <Contact />
      </main>
      <Footer />
      <FloatingActions />
    </div>
  );
}
