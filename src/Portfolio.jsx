import { useEffect, useRef, useState } from "react";

// =====================================================
// GOOGLE APPS SCRIPT API
// =====================================================

const GOOGLE_DRIVE_API =
  "https://script.google.com/macros/s/AKfycbyipFgAjiMuZr2Oy3RjTBpcjDe7dz9NhlSRo0kS1CW_rbD0AI1v4cKz8v6g5Q2b4tcsgg/exec";

// =====================================================
// FILTERS
// =====================================================

const filters = [
  "ALL",
  "VIDEO",
  "PHOTO",
  "BRANDING",
  "DIGITAL",
  "UI/UX",
];

// =====================================================
// PAGINATION
// =====================================================

const PROJECTS_PER_PAGE = 10;

// =====================================================
// REVEAL ANIMATION
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
        threshold: 0.08,
        rootMargin: "0px 0px -40px 0px",
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

// =====================================================
// PORTFOLIO COMPONENT
// =====================================================

function Portfolio() {
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  // =====================================================
  // FETCH PROJECTS
  // =====================================================

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        setError(false);

        const response = await fetch(GOOGLE_DRIVE_API);

        if (!response.ok) {
          throw new Error("Failed to load portfolio");
        }

        const data = await response.json();

        if (!data.success) {
          throw new Error("API returned an error");
        }

        setProjects(data.projects || []);
      } catch (err) {
        console.error("Portfolio Error:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // =====================================================
  // CHECK IF VIDEO
  // =====================================================

  const isVideo = (project) => {
    return (
      project.mediaType?.toLowerCase() === "video" ||
      project.type?.toUpperCase() === "VIDEO"
    );
  };

  // =====================================================
  // FILTER PROJECTS
  // =====================================================

  const filteredProjects = projects.filter((project) => {
    const category = project.category?.toUpperCase() || "";
    const type = project.type?.toUpperCase() || "";
    const mediaType = project.mediaType?.toLowerCase() || "";

    if (activeFilter === "ALL") {
      return true;
    }

    if (activeFilter === "VIDEO") {
      return type === "VIDEO" || mediaType === "video";
    }

    if (activeFilter === "PHOTO") {
      return type === "PHOTO" || mediaType === "image";
    }

    return category === activeFilter || type === activeFilter;
  });

  // =====================================================
  // PAGINATION
  // =====================================================

  const totalPages = Math.max(
    1,
    Math.ceil(filteredProjects.length / PROJECTS_PER_PAGE)
  );

  const safeCurrentPage = Math.min(currentPage, totalPages);

  const startIndex =
    (safeCurrentPage - 1) * PROJECTS_PER_PAGE;

  const paginatedProjects = filteredProjects.slice(
    startIndex,
    startIndex + PROJECTS_PER_PAGE
  );

  // =====================================================
  // FILTER CHANGE
  // =====================================================

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
    setCurrentPage(1);
  };

  // =====================================================
  // PAGE CHANGE
  // =====================================================

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;

    setCurrentPage(page);

    document.getElementById("portfolio")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  // =====================================================
  // GET MEDIA SOURCE
  // =====================================================

  const getMediaSource = (project, size = 1600) => {
    if (project.thumbnail) {
      return project.thumbnail;
    }

    if (project.image) {
      return project.image;
    }

    if (project.id) {
      return `https://drive.google.com/thumbnail?id=${project.id}&sz=w${size}`;
    }

    return "";
  };

  // =====================================================
  // GET MODAL MEDIA SOURCE
  // =====================================================

  const getModalImageSource = (project) => {
    if (!project) return "";

    // Use the exact same source priority as the portfolio card
    if (project.thumbnail) {
      return project.thumbnail;
    }

    if (project.image) {
      return project.image;
    }

    if (project.id) {
      return `https://drive.google.com/thumbnail?id=${project.id}&sz=w2000`;
    }

    return "";
  };

  // =====================================================
  // IMAGE FALLBACK
  // =====================================================

  const handleImageError = (event, project) => {
    const imageElement = event.currentTarget;

    const fallbackStage =
      Number(imageElement.dataset.fallbackStage || "0");

    // -----------------------------------------------------
    // FALLBACK 1
    // -----------------------------------------------------

    if (fallbackStage === 0 && project.image) {
      imageElement.dataset.fallbackStage = "1";

      if (imageElement.src !== project.image) {
        imageElement.src = project.image;
        return;
      }
    }

    // -----------------------------------------------------
    // FALLBACK 2
    // -----------------------------------------------------

    if (fallbackStage <= 1 && project.id) {
      imageElement.dataset.fallbackStage = "2";

      imageElement.src = `https://drive.google.com/thumbnail?id=${project.id}&sz=w2000`;
      return;
    }

    // -----------------------------------------------------
    // FINAL FALLBACK
    // -----------------------------------------------------

    imageElement.dataset.fallbackStage = "3";
    imageElement.style.display = "none";
  };

  // =====================================================
  // OPEN PROJECT MODAL
  // =====================================================

  const openProject = (project) => {
    setSelectedProject(project);

    // Prevent the background page from scrolling
    document.body.style.overflow = "hidden";
  };

  // =====================================================
  // CLOSE PROJECT MODAL
  // =====================================================

  const closeProject = () => {
    setSelectedProject(null);

    // Restore page scrolling
    document.body.style.overflow = "";
  };

  // =====================================================
  // CLEANUP BODY SCROLL
  // =====================================================

  useEffect(() => {
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  // =====================================================
  // ESCAPE KEY
  // =====================================================

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape" && selectedProject) {
        closeProject();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedProject]);

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <section
      id="portfolio"
      className="relative w-full bg-black text-white"
    >
      {/* =====================================================
          FIXED PAGE CONTAINER
      ===================================================== */}

      <div className="mx-auto w-full max-w-[1800px] px-6 py-10 sm:px-10 lg:px-16 lg:py-14">

        {/* =====================================================
            HEADER
        ===================================================== */}

        <div className="mb-8">

          {/* SECTION LABEL */}

          <Reveal direction="up" delay={0}>
            <div className="mb-5 flex items-center gap-3">
              <span className="text-[10px] tracking-[0.18em] text-white/40 lg:text-[11px]">
                02
              </span>

              <span className="h-px w-6 bg-white/30" />

              <span className="text-[10px] uppercase tracking-[0.18em] text-white/45 lg:text-[11px]">
                PORTFOLIO
              </span>
            </div>
          </Reveal>

          {/* TITLE + FILTERS */}

          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">

            {/* TITLE */}

            <Reveal direction="up" delay={100}>
              <div>
                <h2 className="text-[42px] font-medium leading-[0.95] tracking-tight sm:text-[52px] lg:text-[68px] xl:text-[74px]">
                  SELECTED WORK
                </h2>

                <p className="mt-3 max-w-112.5 text-[11px] leading-[1.6] text-white/50 sm:text-[12px] lg:text-[13px]">
                  A collection of visuals, digital experiences, stories,
                  and ideas I&apos;ve created along the way.
                </p>
              </div>
            </Reveal>

            {/* FILTERS */}

            <Reveal direction="up" delay={200}>
              <div className="flex flex-wrap gap-x-5 gap-y-4 lg:justify-end">
                {filters.map((filter) => (
                  <button
                    key={filter}
                    type="button"
                    onClick={() => handleFilterChange(filter)}
                    className={`
                      relative
                      text-[9px]
                      tracking-[0.14em]
                      transition-all
                      duration-300
                      sm:text-[10px]
                      ${
                        activeFilter === filter
                          ? "text-white"
                          : "text-white/35 hover:text-white/80"
                      }
                    `}
                  >
                    {filter}

                    {activeFilter === filter && (
                      <span className="absolute -bottom-2 left-0 h-px w-full bg-white" />
                    )}
                  </button>
                ))}
              </div>
            </Reveal>
          </div>

          {/* DIVIDER */}

          <Reveal direction="none" delay={300}>
            <div className="mt-6 h-px w-full bg-white/10" />
          </Reveal>
        </div>

        {/* =====================================================
            LOADING
        ===================================================== */}

        {loading && (
          <Reveal direction="up" delay={0}>
            <div className="flex min-h-125 items-center justify-center">
              <p className="text-[10px] tracking-[0.2em] text-white/40">
                LOADING PROJECTS...
              </p>
            </div>
          </Reveal>
        )}

        {/* =====================================================
            ERROR
        ===================================================== */}

        {!loading && error && (
          <Reveal direction="up" delay={0}>
            <div className="flex min-h-125 items-center justify-center">
              <div className="text-center">
                <p className="text-[10px] tracking-[0.2em] text-white/50">
                  UNABLE TO LOAD PORTFOLIO
                </p>

                <p className="mt-3 text-[9px] tracking-[0.15em] text-white/30">
                  PLEASE CHECK YOUR API CONNECTION
                </p>
              </div>
            </div>
          </Reveal>
        )}

        {/* =====================================================
            EMPTY
        ===================================================== */}

        {!loading &&
          !error &&
          filteredProjects.length === 0 && (
            <Reveal direction="up" delay={0}>
              <div className="flex min-h-100 items-center justify-center">
                <p className="text-[10px] tracking-[0.15em] text-white/40">
                  NO PROJECTS FOUND
                </p>
              </div>
            </Reveal>
          )}

        {/* =====================================================
            PORTFOLIO GRID
        ===================================================== */}

        {!loading &&
          !error &&
          paginatedProjects.length > 0 && (
            <div
              className="
                columns-1
                gap-4
                sm:columns-2
                lg:columns-3
                xl:columns-4
              "
            >
              {paginatedProjects.map((project, index) => {
                const projectIsVideo = isVideo(project);

                return (
                  <Reveal
                    key={project.id}
                    direction="up"
                    delay={Math.min(index * 80, 560)}
                    className="mb-4 w-full break-inside-avoid"
                  >
                    <article
                      onClick={() => openProject(project)}
                      className="
                        group
                        w-full
                        cursor-pointer
                        overflow-hidden
                        border
                        border-white/10
                        bg-[#050505]
                        transition-all
                        duration-500
                        hover:border-white/30
                      "
                    >
                      {/* MEDIA */}

                      <div className="relative w-full overflow-hidden bg-[#080808]">
                        <img
                          src={getMediaSource(project)}
                          alt={project.title}
                          loading="lazy"
                          onError={(event) =>
                            handleImageError(event, project)
                          }
                          className="
                            block
                            h-auto
                            w-full
                            grayscale
                            opacity-80
                            transition-all
                            duration-700
                            group-hover:scale-[1.02]
                            group-hover:grayscale-0
                            group-hover:opacity-100
                          "
                        />

                        {/* OVERLAY */}

                        <div className="pointer-events-none absolute inset-0 bg-black/10 transition-all duration-500 group-hover:bg-black/0" />

                        {/* VIDEO LABEL */}

                        {projectIsVideo && (
                          <div className="absolute left-3 top-3 z-10 flex items-center gap-2">
                            <span className="h-1.5 w-1.5 rounded-full bg-white" />

                            <span className="text-[8px] tracking-[0.14em] text-white/80">
                              VIDEO
                            </span>

                            {project.orientation && (
                              <span className="text-[8px] tracking-wide text-white/50">
                                {project.orientation.toUpperCase()}
                              </span>
                            )}
                          </div>
                        )}

                        {/* PLAY BUTTON */}

                        {projectIsVideo && (
                          <div
                            className="
                              absolute
                              left-1/2
                              top-1/2
                              z-10
                              flex
                              h-11
                              w-11
                              -translate-x-1/2
                              -translate-y-1/2
                              items-center
                              justify-center
                              rounded-full
                              border
                              border-white/30
                              bg-black/60
                              text-[11px]
                              text-white
                              backdrop-blur-sm
                              transition-all
                              duration-300
                              group-hover:scale-110
                              group-hover:bg-white
                              group-hover:text-black
                            "
                          >
                            ▶
                          </div>
                        )}
                      </div>

                      {/* PROJECT INFO */}

                      <div className="flex min-h-17 items-center justify-between gap-4 border-t border-white/10 px-4 py-3">
                        <div className="min-w-0">
                          <h3 className="truncate text-[9px] font-medium tracking-[0.08em] text-white/90 sm:text-[10px]">
                            {project.title}
                          </h3>

                          <p className="mt-1 truncate text-[8px] tracking-[0.04em] text-white/40 sm:text-[9px]">
                            {project.category} — {project.year}
                          </p>
                        </div>

                        <span className="shrink-0 text-[12px] text-white/40 transition-all duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-white">
                          ↗
                        </span>
                      </div>
                    </article>
                  </Reveal>
                );
              })}
            </div>
          )}

        {/* =====================================================
            PROJECT COUNT
        ===================================================== */}

        {!loading &&
          !error &&
          filteredProjects.length > 0 && (
            <Reveal direction="up" delay={100}>
              <div className="mt-6 flex justify-between text-[9px] tracking-[0.14em] text-white/30 sm:text-[10px]">
                <span>
                  SHOWING {startIndex + 1}–
                  {Math.min(
                    startIndex + PROJECTS_PER_PAGE,
                    filteredProjects.length
                  )}{" "}
                  OF {filteredProjects.length}
                </span>

                <span>
                  PAGE {safeCurrentPage} OF {totalPages}
                </span>
              </div>
            </Reveal>
          )}

        {/* =====================================================
            PAGINATION
        ===================================================== */}

        {!loading && !error && totalPages > 1 && (
          <Reveal direction="up" delay={150}>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3 border-t border-white/10 pt-8">

              {/* PREVIOUS */}

              <button
                type="button"
                disabled={safeCurrentPage === 1}
                onClick={() =>
                  handlePageChange(safeCurrentPage - 1)
                }
                className="px-3 py-2 text-[9px] tracking-[0.14em] text-white/50 transition hover:text-white disabled:cursor-not-allowed disabled:opacity-20"
              >
                ← PREVIOUS
              </button>

              {/* PAGE NUMBERS */}

              <div className="flex gap-2">
                {Array.from(
                  { length: totalPages },
                  (_, index) => index + 1
                ).map((page) => (
                  <button
                    key={page}
                    type="button"
                    onClick={() => handlePageChange(page)}
                    className={`
                      flex
                      h-9
                      w-9
                      items-center
                      justify-center
                      border
                      text-[9px]
                      transition-all
                      duration-300
                      ${
                        safeCurrentPage === page
                          ? "border-white bg-white text-black"
                          : "border-white/10 text-white/40 hover:border-white/40 hover:text-white"
                      }
                    `}
                  >
                    {page}
                  </button>
                ))}
              </div>

              {/* NEXT */}

              <button
                type="button"
                disabled={safeCurrentPage === totalPages}
                onClick={() =>
                  handlePageChange(safeCurrentPage + 1)
                }
                className="px-3 py-2 text-[9px] tracking-[0.14em] text-white/50 transition hover:text-white disabled:cursor-not-allowed disabled:opacity-20"
              >
                NEXT →
              </button>
            </div>
          </Reveal>
        )}
      </div>

      {/* =====================================================
          PROJECT MODAL
      ===================================================== */}

      {selectedProject && (
        <div
          className="
            fixed
            inset-0
            z-[999]
            flex
            items-center
            justify-center
            bg-black/95
            p-4
            backdrop-blur-md
            animate-[modalFade_300ms_ease-out_both]
          "
        >
          {/* CLICK OUTSIDE */}

          <div
            className="absolute inset-0"
            onClick={closeProject}
          />

          {/* MODAL CONTENT */}

          <div
            className="
              relative
              z-10
              flex
              max-h-[95vh]
              w-full
              max-w-7xl
              flex-col
              overflow-hidden
              border
              border-white/10
              bg-black
              animate-[modalUp_500ms_cubic-bezier(0.22,1,0.36,1)_both]
            "
          >
            {/* CLOSE BUTTON */}

            <button
              type="button"
              onClick={closeProject}
              className="
                absolute
                right-4
                top-4
                z-30
                flex
                h-10
                w-10
                items-center
                justify-center
                border
                border-white/20
                bg-black/80
                text-white
                transition-all
                duration-300
                hover:bg-white
                hover:text-black
              "
            >
              ✕
            </button>

            {/* =====================================================
                MODAL MEDIA
            ===================================================== */}

            {isVideo(selectedProject) ? (
              <div className="flex min-h-75 items-center justify-center bg-[#050505]">
                {selectedProject.previewUrl ? (
                  <iframe
                    src={selectedProject.previewUrl}
                    title={selectedProject.title}
                    className="h-[75vh] w-full border-0"
                    allow="autoplay; fullscreen"
                    allowFullScreen
                  />
                ) : (
                  <div className="flex h-[50vh] items-center justify-center">
                    <p className="text-[10px] tracking-[0.15em] text-white/40">
                      VIDEO PREVIEW UNAVAILABLE
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex min-h-75 max-h-[80vh] items-center justify-center overflow-auto bg-[#050505] p-4 sm:p-6">
                <img
                  src={getModalImageSource(selectedProject)}
                  alt={selectedProject.title}
                  onError={(event) =>
                    handleImageError(event, selectedProject)
                  }
                  className="
                    block
                    max-h-[75vh]
                    max-w-full
                    object-contain
                    opacity-0
                    animate-[imageReveal_500ms_ease-out_150ms_forwards]
                  "
                />
              </div>
            )}

            {/* =====================================================
                DETAILS
            ===================================================== */}

            <div className="border-t border-white/10 px-5 py-5 sm:px-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

                <div>
                  <p className="text-[9px] tracking-[0.16em] text-white/35">
                    {selectedProject.type}
                  </p>

                  <h3 className="mt-2 text-[12px] tracking-[0.08em] text-white sm:text-[14px]">
                    {selectedProject.title}
                  </h3>

                  <p className="mt-2 text-[10px] text-white/40">
                    {selectedProject.category} —{" "}
                    {selectedProject.year}
                  </p>
                </div>

                {selectedProject.driveUrl && (
                  <a
                    href={selectedProject.driveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="
                      inline-flex
                      items-center
                      text-[9px]
                      tracking-[0.14em]
                      text-white/50
                      transition-colors
                      hover:text-white
                    "
                  >
                    OPEN IN DRIVE ↗
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================
          CUSTOM ANIMATIONS
      ===================================================== */}

      <style>{`
        @keyframes modalFade {
          0% {
            opacity: 0;
          }

          100% {
            opacity: 1;
          }
        }

        @keyframes modalUp {
          0% {
            opacity: 0;
            transform: translateY(20px) scale(0.98);
          }

          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes imageReveal {
          0% {
            opacity: 0;
            transform: scale(0.98);
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

export default Portfolio;