import React, { useEffect, useRef, useState } from "react";

function Reveal({
  children,
  direction = "up",
  delay = 0,
  duration = 700,
  className = "",
}) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVisible(true);
      return;
    }

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
    up: "translate-y-6",
    down: "-translate-y-6",
    left: "-translate-x-6",
    right: "translate-x-6",
    none: "",
  };

  return (
    <div
      ref={ref}
      className={`
        ${className}
        transition-all
        ease-[cubic-bezier(0.22,1,0.36,1)]
        ${
          visible
            ? "translate-x-0 translate-y-0 opacity-100"
            : `${directions[direction]} opacity-0`
        }
      `}
      style={{
        transitionDuration: `${duration}ms`,
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

function Contact() {
  return (
    <section
      id="contact"
      className="relative overflow-hidden bg-black text-white"
    >
      {/* ================= CONTACT CONTENT ================= */}
      <div className="px-7 pt-6 pb-10 sm:px-10 sm:pt-8 sm:pb-12 lg:px-16 lg:pt-10 lg:pb-14">
        <div className="grid items-center gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-10">
          
          {/* ================= LEFT SIDE ================= */}
          <div className="relative text-center lg:pl-10 lg:text-left">

            {/* Section Label */}
            <Reveal direction="up" delay={0}>
              <div className="mb-5 flex items-center justify-center gap-3 lg:justify-start">
                <span className="text-[10px] tracking-[0.18em] text-white/40 lg:text-[11px]">
                  03
                </span>

                <span className="h-px w-6 bg-white/30" />

                <span className="text-[10px] uppercase tracking-[0.18em] text-white/45 lg:text-[11px]">
                  CONTACT ME
                </span>
              </div>
            </Reveal>

            {/* Heading */}
            <Reveal direction="up" delay={100}>
              <h2 className="text-[42px] font-medium leading-[0.95] tracking-tight sm:text-[52px] lg:text-[68px] xl:text-[74px]">
                LET&apos;S TALK.
              </h2>
            </Reveal>

            {/* Subtitle */}
            <Reveal direction="up" delay={200}>
              <p className="mt-3 text-[10px] uppercase tracking-[0.13em] text-white/70 sm:text-[11px] lg:text-[13px]">
                LET&apos;S CREATE SOMETHING TOGETHER.
              </p>
            </Reveal>

            {/* Divider */}
            <Reveal direction="none" delay={300}>
              <div className="mx-auto mt-5 h-px w-full max-w-75 bg-white/10 lg:mx-0 lg:max-w-125" />
            </Reveal>

            {/* Description */}
            <Reveal direction="up" delay={400}>
              <div className="mx-auto mt-5 max-w-130 text-[13px] leading-[1.7] text-white/55 sm:text-[14px] lg:mx-0 lg:max-w-145 lg:text-[15px]">
                <p>
                  Have a project, idea, or collaboration in mind? I&apos;d love
                  to hear about it. Send me a message and let&apos;s build
                  something meaningful together.
                </p>
              </div>
            </Reveal>

            {/* Contact Form */}
            <Reveal direction="up" delay={500}>
              <form className="mx-auto mt-6 max-w-130 space-y-4 lg:mx-0 lg:max-w-145">
                
                <input
                  type="text"
                  placeholder="YOUR NAME"
                  className="w-full border-b border-white/15 bg-transparent py-3 text-[11px] tracking-[0.13em] text-white outline-none transition-all duration-300 placeholder:text-white/35 focus:border-white/60 sm:text-[12px]"
                />

                <input
                  type="email"
                  placeholder="YOUR EMAIL"
                  className="w-full border-b border-white/15 bg-transparent py-3 text-[11px] tracking-[0.13em] text-white outline-none transition-all duration-300 placeholder:text-white/35 focus:border-white/60 sm:text-[12px]"
                />

                <textarea
                  rows="3"
                  placeholder="TELL ME ABOUT YOUR PROJECT..."
                  className="w-full resize-none border-b border-white/15 bg-transparent py-3 text-[11px] tracking-[0.13em] text-white outline-none transition-all duration-300 placeholder:text-white/35 focus:border-white/60 sm:text-[12px]"
                />

                <button
                  type="submit"
                  className="group mt-3 inline-flex items-center gap-6 rounded-full border border-white/30 px-6 py-3 text-[10px] tracking-[0.12em] text-white transition-all duration-300 hover:border-white hover:bg-white hover:text-black lg:text-[11px]"
                >
                  <span>SEND MESSAGE</span>

                  <span className="text-sm transition-transform duration-300 group-hover:translate-x-1">
                    ↗
                  </span>
                </button>
              </form>
            </Reveal>
          </div>

          {/* ================= RIGHT SIDE ================= */}
          <Reveal direction="right" delay={250}>
            <div className="flex justify-center lg:justify-end">
              <div className="w-full max-w-100 sm:max-w-112.5 lg:max-w-125">

                {/* Connect Heading */}
                <Reveal direction="up" delay={350}>
                  <div className="mb-5 flex items-center justify-center gap-3 lg:justify-start">
                    <span className="text-[10px] uppercase tracking-[0.18em] text-white/45 lg:text-[11px]">
                      CONNECT WITH ME
                    </span>
                  </div>
                </Reveal>

                {/* Social Links */}
                <div className="border-t border-white/10">

                  {/* Instagram */}
                  <Reveal direction="right" delay={400}>
                    <a
                      href="https://www.instagram.com/wtcthecmbk/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center justify-between border-b border-white/10 py-5 text-[13px] tracking-[0.13em] text-white/70 transition-all duration-300 hover:text-white sm:text-[14px] lg:text-[15px]"
                    >
                      <span>INSTAGRAM</span>

                      <span className="text-sm transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1">
                        ↗
                      </span>
                    </a>
                  </Reveal>

                  {/* Facebook */}
                  <Reveal direction="right" delay={480}>
                    <a
                      href="https://www.facebook.com/DaveOquila"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center justify-between border-b border-white/10 py-5 text-[13px] tracking-[0.13em] text-white/70 transition-all duration-300 hover:text-white sm:text-[14px] lg:text-[15px]"
                    >
                      <span>FACEBOOK</span>

                      <span className="text-sm transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1">
                        ↗
                      </span>
                    </a>
                  </Reveal>

                  {/* LinkedIn */}
                  <Reveal direction="right" delay={560}>
                    <a
                      href="https://www.linkedin.com/in/jdoquila/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center justify-between border-b border-white/10 py-5 text-[13px] tracking-[0.13em] text-white/70 transition-all duration-300 hover:text-white sm:text-[14px] lg:text-[15px]"
                    >
                      <span>LINKEDIN</span>

                      <span className="text-sm transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1">
                        ↗
                      </span>
                    </a>
                  </Reveal>

                  {/* Mobile Number */}
                  <Reveal direction="right" delay={640}>
                    <a
                      href="tel:+639983000240"
                      className="group flex items-center justify-between border-b border-white/10 py-5 text-[13px] tracking-[0.13em] text-white/70 transition-all duration-300 hover:text-white sm:text-[14px] lg:text-[15px]"
                    >
                      <span>(+63) 998-300-0240</span>

                      <span className="text-sm transition-transform duration-300 group-hover:translate-x-1">
                        ↗
                      </span>
                    </a>
                  </Reveal>
                </div>

                {/* Availability */}
                <Reveal direction="up" delay={720}>
                  <div className="mt-6 text-center lg:text-left">
                    <p className="text-[10px] uppercase leading-[1.7] tracking-[0.13em] text-white/40 sm:text-[11px]">
                      CURRENTLY AVAILABLE FOR FREELANCE,
                      <br />
                      COLLABORATIONS &amp; CREATIVE PROJECTS.
                    </p>
                  </div>
                </Reveal>

              </div>
            </div>
          </Reveal>
        </div>

        {/* ================= FOOTER DIVIDER ================= */}
        <Reveal direction="none" delay={200}>
          <div className="mx-auto mt-10 h-px w-full bg-white/10" />
        </Reveal>

        {/* ================= FOOTER ================= */}
        <Reveal direction="up" delay={300}>
          <div className="flex flex-col items-center justify-between gap-4 pt-6 text-center sm:flex-row sm:text-left">
            
            <p className="text-[9px] uppercase tracking-[0.14em] text-white/35 sm:text-[10px]">
              © 2026 DAVE OQUILA. ALL RIGHTS RESERVED.
            </p>

            <p className="text-[9px] uppercase tracking-[0.14em] text-white/35 sm:text-[10px]">
              CREATIVE • RIDER • BUILDER
            </p>

          </div>
        </Reveal>
      </div>
    </section>
  );
}

export default Contact;