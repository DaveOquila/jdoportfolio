import { useEffect, useRef, useState } from "react";
import Cover from "./assets/Cover.png";
import Logo from "./assets/LOGO.png";
import Resume from "./assets/OQUILA, JOHN DAVID RESUME.pdf";

function Reveal({
  children,
  className = "",
  delay = 0,
  direction = "up",
}) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;

    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(element);
        }
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -30px 0px",
      }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  const directions = {
    up: "translate-y-8",
    down: "-translate-y-5",
    left: "translate-x-8",
    right: "-translate-x-8",
    none: "",
  };

  return (
    <div
      ref={ref}
      className={`
        transform-gpu
        transition-all
        duration-700
        ease-[cubic-bezier(0.22,1,0.36,1)]
        ${
          visible
            ? "translate-x-0 translate-y-0 opacity-100"
            : `${directions[direction]} opacity-0`
        }
        ${className}
      `}
      style={{
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <main className="bg-black text-white">
      {/* ================= HERO / INTRO HEADER ================= */}
      <section
        id="home"
        className="relative h-125 overflow-hidden sm:h-140 md:h-155 lg:h-170"
      >
        {/* ================= BACKGROUND IMAGE ================= */}
        <div
          className="
            absolute
            inset-0
            bg-cover
            bg-center
            animate-[heroImage_1.5s_cubic-bezier(0.22,1,0.36,1)_both]
          "
          style={{
            backgroundImage: `url(${Cover})`,
          }}
        />

        {/* ================= SUBTLE DARK OVERLAY ================= */}
        <div
          className="
            absolute
            inset-0
            bg-black/10
            animate-[fadeIn_1.2s_ease-out_200ms_both]
          "
        />

        {/* ================= LEFT TEXT READABILITY ================= */}
        <div
          className="
            absolute
            inset-0
            animate-[fadeIn_1.4s_ease-out_300ms_both]
          "
          style={{
            background: `
              linear-gradient(
                to right,
                rgba(0,0,0,0.50) 0%,
                rgba(0,0,0,0.20) 45%,
                transparent 75%
              )
            `,
          }}
        />

        {/* ================= SMOOTH BOTTOM FADE ================= */}
        <div
          className="
            absolute
            inset-x-0
            bottom-0
            h-[38%]
            animate-[fadeIn_1.5s_ease-out_400ms_both]
          "
          style={{
            background: `
              linear-gradient(
                to bottom,
                transparent 0%,
                rgba(0,0,0,0.15) 35%,
                rgba(0,0,0,0.50) 70%,
                rgba(0,0,0,0.85) 100%
              )
            `,
          }}
        />

        {/* ================= MAIN CONTENT ================= */}
        <div className="relative z-10 flex h-full flex-col">

          {/* ================= NAVIGATION ================= */}
          <header
            className="
              relative
              z-50
              flex
              w-full
              items-center
              justify-between
              px-7
              py-6
              md:px-10
              lg:px-12
            "
          >
            {/* ================= LEFT SIDE ================= */}
            <div className="flex min-w-0 items-center gap-7 md:gap-8">

              {/* LOGO */}
              <Reveal direction="down" delay={450}>
                <a
                  href="#home"
                  className="
                    block
                    shrink-0
                    transition-opacity
                    duration-300
                    hover:opacity-60
                  "
                >
                  <img
                    src={Logo}
                    alt="Dave Oquila Logo"
                    className="h-8 w-auto object-contain md:h-9"
                  />
                </a>
              </Reveal>

              {/* DESKTOP NAVIGATION */}
              <Reveal direction="down" delay={550}>
                <nav className="hidden items-center gap-6 md:flex lg:gap-8">

                  <a
                    href="#home"
                    className="
                      group
                      relative
                      whitespace-nowrap
                      text-[12px]
                      tracking-[0.18em]
                      text-white/65
                      transition-colors
                      duration-300
                      hover:text-white
                    "
                  >
                    HOME

                    <span
                      className="
                        absolute
                        -bottom-2
                        left-0
                        h-px
                        w-0
                        bg-white
                        transition-all
                        duration-300
                        group-hover:w-full
                      "
                    />
                  </a>

                  <a
                    href="#about"
                    className="
                      group
                      relative
                      whitespace-nowrap
                      text-[12px]
                      tracking-[0.18em]
                      text-white/65
                      transition-colors
                      duration-300
                      hover:text-white
                    "
                  >
                    ABOUT

                    <span
                      className="
                        absolute
                        -bottom-2
                        left-0
                        h-px
                        w-0
                        bg-white
                        transition-all
                        duration-300
                        group-hover:w-full
                      "
                    />
                  </a>

                  <a
                    href="#portfolio"
                    className="
                      group
                      relative
                      whitespace-nowrap
                      text-[12px]
                      tracking-[0.18em]
                      text-white/65
                      transition-colors
                      duration-300
                      hover:text-white
                    "
                  >
                    PORTFOLIO

                    <span
                      className="
                        absolute
                        -bottom-2
                        left-0
                        h-px
                        w-0
                        bg-white
                        transition-all
                        duration-300
                        group-hover:w-full
                      "
                    />
                  </a>

                  <a
                    href="#contact"
                    className="
                      group
                      relative
                      whitespace-nowrap
                      text-[12px]
                      tracking-[0.18em]
                      text-white/65
                      transition-colors
                      duration-300
                      hover:text-white
                    "
                  >
                    CONTACT ME

                    <span
                      className="
                        absolute
                        -bottom-2
                        left-0
                        h-px
                        w-0
                        bg-white
                        transition-all
                        duration-300
                        group-hover:w-full
                      "
                    />
                  </a>

                </nav>
              </Reveal>
            </div>

            {/* ================= RIGHT SIDE ================= */}
            <div
              className="
                ml-auto
                hidden
                shrink-0
                items-center
                gap-5
                md:flex
              "
            >
              {/* LET'S CONNECT */}
              <Reveal direction="down" delay={650}>
                <a
                  href="#contact"
                  className="
                    whitespace-nowrap
                    text-[11px]
                    tracking-wide
                    text-white/70
                    transition-colors
                    duration-300
                    hover:text-white
                  "
                >
                  LET'S CONNECT ↗
                </a>
              </Reveal>

              {/* THEME BUTTON */}
              <Reveal direction="down" delay={700}>
                <button
                  type="button"
                  aria-label="Toggle theme"
                  className="
                    flex
                    h-8
                    w-8
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    border
                    border-white/40
                    text-lg
                    leading-none
                    transition-all
                    duration-300
                    hover:bg-white
                    hover:text-black
                  "
                >
                  ☼
                </button>
              </Reveal>
            </div>

            {/* ================= MOBILE BURGER ================= */}
            <Reveal direction="down" delay={450}>
              <button
                type="button"
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label={menuOpen ? "Close menu" : "Open menu"}
                aria-expanded={menuOpen}
                className="
                  relative
                  z-[60]
                  flex
                  h-10
                  w-10
                  shrink-0
                  items-center
                  justify-center
                  md:hidden
                "
              >
                <span className="relative block h-5 w-6">

                  {/* TOP LINE */}
                  <span
                    className={`
                      absolute
                      left-0
                      top-1/2
                      block
                      h-px
                      w-6
                      origin-center
                      bg-white
                      transition-all
                      duration-300
                      ease-out
                      ${
                        menuOpen
                          ? "rotate-45"
                          : "-translate-y-[4px]"
                      }
                    `}
                  />

                  {/* BOTTOM LINE */}
                  <span
                    className={`
                      absolute
                      left-0
                      top-1/2
                      block
                      h-px
                      w-6
                      origin-center
                      bg-white
                      transition-all
                      duration-300
                      ease-out
                      ${
                        menuOpen
                          ? "-rotate-45"
                          : "translate-y-[4px]"
                      }
                    `}
                  />

                </span>
              </button>
            </Reveal>
          </header>

          {/* ================= MOBILE MENU ================= */}
          <div
            className={`
              fixed
              inset-0
              z-40
              bg-black
              transition-all
              duration-300
              md:hidden
              ${
                menuOpen
                  ? "visible opacity-100"
                  : "pointer-events-none invisible opacity-0"
              }
            `}
          >
            <div className="flex h-full flex-col px-8 pb-10 pt-28">

              <p className="mb-8 text-[10px] tracking-[0.25em] text-white/40">
                MENU
              </p>

              <nav className="flex flex-col">

                <a
                  href="#home"
                  onClick={() => setMenuOpen(false)}
                  className="
                    border-b
                    border-white/10
                    py-5
                    text-2xl
                    tracking-[0.08em]
                    transition-opacity
                    duration-300
                    hover:opacity-60
                  "
                >
                  HOME
                </a>

                <a
                  href="#about"
                  onClick={() => setMenuOpen(false)}
                  className="
                    border-b
                    border-white/10
                    py-5
                    text-2xl
                    tracking-[0.08em]
                    transition-opacity
                    duration-300
                    hover:opacity-60
                  "
                >
                  ABOUT
                </a>

                <a
                  href="#portfolio"
                  onClick={() => setMenuOpen(false)}
                  className="
                    border-b
                    border-white/10
                    py-5
                    text-2xl
                    tracking-[0.08em]
                    transition-opacity
                    duration-300
                    hover:opacity-60
                  "
                >
                  PORTFOLIO
                </a>

                <a
                  href="#contact"
                  onClick={() => setMenuOpen(false)}
                  className="
                    border-b
                    border-white/10
                    py-5
                    text-2xl
                    tracking-[0.08em]
                    transition-opacity
                    duration-300
                    hover:opacity-60
                  "
                >
                  CONTACT ME
                </a>

              </nav>

              <div className="mt-auto">

                <p className="mb-3 text-[10px] tracking-[0.2em] text-white/40">
                  ELSEWHERE
                </p>

                <a
                  href="#contact"
                  onClick={() => setMenuOpen(false)}
                  className="
                    text-sm
                    tracking-wide
                    text-white/70
                    transition
                    hover:text-white
                  "
                >
                  LET'S CONNECT ↗
                </a>

              </div>
            </div>
          </div>

          {/* ================= HERO CONTENT ================= */}
          <div className="mt-auto px-7 pb-8 md:px-10 md:pb-10 lg:px-16 lg:pb-12">

            <div className="grid items-end gap-8 lg:grid-cols-[1.2fr_0.8fr]">

              {/* ================= LEFT CONTENT ================= */}
              <div className="relative pl-8 md:pl-10">

                {/* VERTICAL LINE */}
                <Reveal
                  direction="none"
                  delay={800}
                  className="absolute bottom-0 left-0 top-0"
                >
                  <div className="h-full w-px bg-white/40" />
                </Reveal>

                {/* HEY, I'M */}
                <Reveal direction="up" delay={950}>
                  <p
                    className="
                      mb-3
                      text-[11px]
                      tracking-[0.12em]
                      text-white/80
                      md:text-[13px]
                    "
                  >
                    HEY, I'M
                  </p>
                </Reveal>

                {/* NAME */}
                <div className="overflow-hidden">
                  <Reveal direction="up" delay={1050}>
                    <h1
                      className="
                        whitespace-nowrap
                        text-[46px]
                        font-medium
                        leading-[0.9]
                        tracking-tight
                        sm:text-[60px]
                        md:text-[78px]
                        lg:text-[88px]
                        xl:text-[100px]
                      "
                    >
                      DAVE OQUILA
                    </h1>
                  </Reveal>
                </div>

                {/* ROLE */}
                <Reveal direction="up" delay={1200}>
                  <p
                    className="
                      mt-4
                      text-[11px]
                      font-medium
                      tracking-widest
                      text-white/90
                      sm:text-[13px]
                      md:text-[15px]
                    "
                  >
                    CREATOR
                    <span className="mx-2 md:mx-3">•</span>
                    DESIGNER
                    <span className="mx-2 md:mx-3">•</span>
                    DEVELOPER
                    <span className="mx-2 md:mx-3">•</span>
                    RIDER
                  </p>
                </Reveal>

                {/* DESCRIPTION */}
                <Reveal direction="up" delay={1300}>
                  <p
                    className="
                      mt-4
                      max-w-2xl
                      text-[13px]
                      leading-[1.55]
                      text-white/65
                      md:text-[14px]
                    "
                  >
                    Building ideas through creativity, technology,
                    storytelling &amp; DTC — creating visuals, digital
                    experiences, and meaningful connections between brands
                    and people.
                  </p>
                </Reveal>

                {/* ================= CTA BUTTONS ================= */}
                <Reveal direction="up" delay={1450}>
                  <div className="mt-5 flex flex-wrap items-center gap-3">

                    {/* DOWNLOAD MY CV */}
                    <a
                      href={Resume}
                      download="OQUILA, JOHN DAVID RESUME.pdf"
                      className="
                        inline-flex
                        items-center
                        gap-5
                        rounded-full
                        border
                        border-white/40
                        px-6
                        py-3
                        text-[11px]
                        tracking-wide
                        transition-all
                        duration-300
                        hover:bg-white
                        hover:text-black
                      "
                    >
                      DOWNLOAD MY CV

                      <span className="text-sm">
                        ↗
                      </span>
                    </a>

                    {/* EXPLORE MY WORK */}
                    <a
                      href="#portfolio"
                      className="
                        inline-flex
                        items-center
                        gap-5
                        rounded-full
                        border
                        border-white/25
                        px-6
                        py-3
                        text-[11px]
                        tracking-wide
                        text-white/70
                        transition-all
                        duration-300
                        hover:border-white
                        hover:bg-white
                        hover:text-black
                      "
                    >
                      EXPLORE MY WORK

                      <span className="text-sm">
                        ↗
                      </span>
                    </a>

                  </div>
                </Reveal>

              </div>

              {/* ================= STATS ================= */}
              <Reveal direction="up" delay={1500}>
                <div
                  className="
                    grid
                    grid-cols-3
                    pb-1
                    lg:pb-2
                  "
                >

                  {/* EXPERIENCE */}
                  <div className="px-1 text-center sm:px-3 md:px-5">

                    <div className="text-2xl font-light sm:text-3xl md:text-4xl lg:text-5xl">
                      04+
                    </div>

                    <p
                      className="
                        mt-2
                        text-[7px]
                        leading-[1.4]
                        tracking-[0.08em]
                        text-white/50
                        sm:text-[8px]
                        md:text-[10px]
                      "
                    >
                      YEARS OF
                      <br />
                      EXPERIENCE
                    </p>

                  </div>

                  {/* PROJECTS */}
                  <div
                    className="
                      border-l
                      border-white/20
                      px-1
                      text-center
                      sm:px-3
                      md:px-5
                    "
                  >

                    <div className="text-2xl font-light sm:text-3xl md:text-4xl lg:text-5xl">
                      20+
                    </div>

                    <p
                      className="
                        mt-2
                        text-[7px]
                        leading-[1.4]
                        tracking-[0.08em]
                        text-white/50
                        sm:text-[8px]
                        md:text-[10px]
                      "
                    >
                      PROJECTS
                      <br />
                      COMPLETED
                    </p>

                  </div>

                  {/* MISSION */}
                  <div
                    className="
                      border-l
                      border-white/20
                      px-1
                      text-center
                      sm:px-3
                      md:px-5
                    "
                  >

                    <div className="text-2xl font-light sm:text-3xl md:text-4xl lg:text-5xl">
                      01
                    </div>

                    <p
                      className="
                        mt-2
                        text-[7px]
                        leading-[1.4]
                        tracking-[0.08em]
                        text-white/50
                        sm:text-[8px]
                        md:text-[10px]
                      "
                    >
                      MISSION
                      <br />
                      DELIVER IMPACT
                    </p>

                  </div>

                </div>
              </Reveal>

            </div>
          </div>
        </div>
      </section>

      {/* ================= CUSTOM ANIMATIONS ================= */}
      <style>{`
        @keyframes heroImage {
          0% {
            opacity: 0;
            transform: scale(1.04);
          }

          100% {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes fadeIn {
          0% {
            opacity: 0;
          }

          100% {
            opacity: 1;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          *,
          *::before,
          *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
            scroll-behavior: auto !important;
          }
        }
      `}</style>
    </main>
  );
}

export default App;