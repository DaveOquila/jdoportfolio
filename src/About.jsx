import { useEffect, useRef, useState } from "react";
import Cover from "./assets/Cover.png";

// =====================================================
// ANIMATED ELEMENT
// =====================================================

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
        ${visible
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

// =====================================================
// ABOUT
// =====================================================

function About() {
  return (
    <section
      id="about"
      className="relative overflow-hidden bg-black text-white"
    >

      {/* ================= ABOUT CONTENT ================= */}
      <div className="px-7 pt-6 pb-10 sm:px-10 sm:pt-8 sm:pb-12 lg:px-16 lg:pt-10 lg:pb-14">
        <div className="grid items-center gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-10">

          {/* ================= LEFT CONTENT ================= */}
          <div className="relative text-center lg:pl-10 lg:text-left">

            {/* ================= SECTION LABEL ================= */}
            <Reveal direction="up" delay={0}>
              <div className="mb-5 flex items-center justify-center gap-3 lg:justify-start">

                <span className="text-[10px] tracking-[0.18em] text-white/40 lg:text-[11px]">
                  01
                </span>

                <span className="h-px w-6 bg-white/30" />

                <span className="text-[10px] uppercase tracking-[0.18em] text-white/45 lg:text-[11px]">
                  ABOUT ME
                </span>

              </div>
            </Reveal>

            {/* ================= HEADING ================= */}
            <div className="overflow-hidden">
              <Reveal direction="up" delay={100}>
                <h2 className="text-[42px] font-medium leading-[0.95] tracking-tight sm:text-[52px] lg:text-[68px] xl:text-[74px]">
                  HI, I'M DAVE.
                </h2>
              </Reveal>
            </div>

            {/* ================= SUBTITLE ================= */}
            <Reveal direction="up" delay={200}>
              <p className="mt-3 text-[10px] uppercase tracking-[0.13em] text-white/70 sm:text-[11px] lg:text-[13px]">
                CREATOR. DESIGNER. DEVELOPER. RIDER.
              </p>
            </Reveal>

            {/* ================= DIVIDER ================= */}
            <Reveal direction="none" delay={300}>
              <div className="mx-auto mt-5 h-px w-full max-w-75 bg-white/10 lg:mx-0 lg:max-w-125" />
            </Reveal>

            {/* ================= DESCRIPTION ================= */}
            <Reveal direction="up" delay={400}>
              <div className="mx-auto mt-5 max-w-130 space-y-4 text-[13px] leading-[1.7] text-white/55 sm:text-[14px] lg:mx-0 lg:max-w-145 lg:text-[15px]">

                <p>
                  I'm a multidisciplinary creator who builds ideas through
                  creativity, technology, and storytelling. I craft visuals,
                  design digital experiences, and develop solutions that connect
                  brands with people.
                </p>

                <p>
                  When I'm not creating, you'll find me on two wheels —
                  chasing new roads, moments, and perspectives.
                </p>

              </div>
            </Reveal>

            {/* ================= CTA ================= */}
            <Reveal direction="up" delay={550}>
              <a
                href="#portfolio"
                className="group mt-6 inline-flex items-center gap-6 rounded-full border border-white/30 px-6 py-3 text-[10px] tracking-[0.12em] text-white transition-all duration-300 hover:border-white hover:bg-white hover:text-black lg:text-[11px]"
              >
                <span>GET TO KNOW ME</span>

                <span className="text-sm transition-transform duration-300 group-hover:translate-x-1">
                  ↗
                </span>
              </a>
            </Reveal>

          </div>

          {/* ================= RIGHT IMAGE ================= */}
          <Reveal
            direction="right"
            delay={250}
            className="flex justify-center lg:justify-end"
          >
            <div
              className="
                relative
                h-75
                w-full
                max-w-100
                overflow-hidden
                sm:h-87.5
                sm:max-w-112.5
                lg:h-95
                lg:max-w-125
              "
            >

              {/* ================= SOFT RADIAL MASK ================= */}
              <div
                className="absolute inset-0"
                style={{
                  WebkitMaskImage:
                    "radial-gradient(ellipse 50% 50% at center, black 35%, transparent 100%)",
                  maskImage:
                    "radial-gradient(ellipse 50% 50% at center, black 35%, transparent 100%)",
                }}
              >

                {/* ================= BLACK & WHITE IMAGE ================= */}
                <img
                  src={Cover}
                  alt="Dave Oquila"
                  className="
                    h-full
                    w-full
                    object-cover
                    object-center
                    grayscale
                    animate-[aboutImage_1.2s_cubic-bezier(0.22,1,0.36,1)_both]
                  "
                />

                {/* ================= CINEMATIC VIGNETTE ================= */}
                <div
                  className="pointer-events-none absolute inset-0"
                  style={{
                    background: `
                      radial-gradient(
                        ellipse at center,
                        transparent 30%,
                        rgba(0, 0, 0, 0.15) 55%,
                        rgba(0, 0, 0, 0.7) 80%,
                        #000 100%
                      )
                    `,
                  }}
                />

              </div>
            </div>
          </Reveal>

        </div>
      </div>

      {/* ================= CUSTOM ANIMATIONS ================= */}
      <style>{`

        @keyframes aboutImage {
          0% {
            opacity: 0;
            transform: scale(1.04);
          }

          100% {
            opacity: 1;
            transform: scale(1);
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

    </section>
  );
}

export default About;