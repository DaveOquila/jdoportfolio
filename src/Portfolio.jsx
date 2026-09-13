import { useEffect, useRef, useState } from "react";

const GOOGLE_DRIVE_API =
  "https://script.google.com/macros/s/AKfycbyipFgAjiMuZr2Oy3RjTBpcjDe7dz9NhlSRo0kS1CW_rbD0AI1v4cKz8v6g5Q2b4tcsgg/exec";

const filters = [
  "ALL",
  "VIDEO",
  "PHOTO",
  "BRANDING",
  "DIGITAL",
  "UI/UX",
];

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

    if (
      window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches
    ) {
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
// PORTFOLIO
// =====================================================

function Portfolio() {

  const [activeFilter, setActiveFilter] =
    useState("ALL");

  const [projects, setProjects] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState(false);

  const [selectedProject, setSelectedProject] =
    useState(null);

  const [currentMediaIndex, setCurrentMediaIndex] =
    useState(0);

  const [currentPage, setCurrentPage] =
    useState(1);


  // ===================================================
  // FETCH GOOGLE DRIVE API
  // ===================================================

  useEffect(() => {

    const fetchProjects = async () => {

      try {

        setLoading(true);
        setError(false);

        const response =
          await fetch(
            GOOGLE_DRIVE_API,
            {
              method: "GET",
              cache: "no-store",
            }
          );

        if (!response.ok) {
          throw new Error(
            `API HTTP Error: ${response.status}`
          );
        }

        const data =
          await response.json();

        console.log(
          "Portfolio API:",
          data
        );

        if (!data.success) {

          throw new Error(
            data.error ||
            "API returned an error"
          );

        }

        setProjects(
          Array.isArray(
            data.projects
          )
            ? data.projects
            : []
        );

      } catch (err) {

        console.error(
          "Portfolio API Error:",
          err
        );

        setError(true);

      } finally {

        setLoading(false);

      }

    };

    fetchProjects();

  }, []);


  // ===================================================
  // NORMALIZE PROJECT MEDIA
  //
  // Supports:
  //
  // 1. Normal image project
  // 2. Normal video project
  // 3. Image collection
  // 4. Video collection
  // 5. Mixed image/video collection
  // ===================================================

  const getProjectMedia = (
    project
  ) => {

    if (!project) {
      return [];
    }


    // =================================================
    // NEW API FORMAT
    // =================================================

    if (
      Array.isArray(
        project.images
      ) &&
      project.images.length > 0
    ) {

      return project.images;

    }


    // =================================================
    // NORMAL VIDEO PROJECT
    // =================================================

    if (
      project.mediaType ===
        "video" ||
      project.type?.toUpperCase() ===
        "VIDEO"
    ) {

      return [

        {

          id:
            project.id,

          title:
            project.title,

          name:
            project.title,

          type:
            "video",

          mediaType:
            "video",

          thumbnail:
            project.thumbnail ||
            "",

          image:
            project.thumbnail ||
            "",

          previewUrl:
            project.previewUrl ||
            "",

          driveUrl:
            project.driveUrl ||
            "",

        }

      ];

    }


    // =================================================
    // NORMAL IMAGE PROJECT
    // =================================================

    if (
      project.image ||
      project.thumbnail
    ) {

      return [

        {

          id:
            project.id,

          title:
            project.title,

          name:
            project.title,

          type:
            "image",

          mediaType:
            "image",

          image:
            project.image ||
            project.thumbnail ||
            "",

          thumbnail:
            project.thumbnail ||
            project.image ||
            "",

          previewUrl:
            project.previewUrl ||
            "",

          driveUrl:
            project.driveUrl ||
            "",

        }

      ];

    }


    return [];

  };


  // ===================================================
  // CHECK VIDEO MEDIA
  // ===================================================

  const isVideoMedia = (
    media
  ) => {

    if (!media) {
      return false;
    }

    return (
      media.mediaType?.toLowerCase() ===
        "video" ||
      media.type?.toLowerCase() ===
        "video"
    );

  };


  // ===================================================
  // CHECK IF PROJECT IS VIDEO
  //
  // A project is VIDEO if:
  //
  // - project itself is VIDEO
  // - OR every media item is VIDEO
  //
  // Mixed collections remain collections.
  // ===================================================

  const isVideoProject = (
    project
  ) => {

    if (!project) {
      return false;
    }

    const media =
      getProjectMedia(project);

    if (
      media.length === 0
    ) {
      return false;
    }

    return media.every(
      (item) =>
        isVideoMedia(item)
    );

  };


  // ===================================================
  // CHECK COLLECTION
  // ===================================================

  const isCollection = (
    project
  ) => {

    if (!project) {
      return false;
    }


    if (
      project.mediaType ===
        "collection"
    ) {
      return true;
    }


    if (
      project.type?.toLowerCase() ===
        "collection"
    ) {
      return true;
    }


    const media =
      getProjectMedia(project);


    return media.length > 1;

  };


  // ===================================================
  // GET CARD IMAGE
  //
  // For a collection:
  // first image/video thumbnail is used.
  // ===================================================

  const getCardImage = (
    project
  ) => {

    const media =
      getProjectMedia(project);


    if (
      media.length > 0
    ) {

      const first =
        media[0];


      return (
        first.thumbnail ||
        first.image ||
        ""
      );

    }


    return (
      project?.thumbnail ||
      project?.image ||
      ""
    );

  };


  // ===================================================
  // GET MEDIA PREVIEW
  // ===================================================

  const getMediaPreview = (
    media
  ) => {

    if (!media) {
      return "";
    }

    return (
      media.image ||
      media.thumbnail ||
      media.previewUrl ||
      ""
    );

  };


  // ===================================================
  // GET VIDEO PREVIEW
  // ===================================================

  const getVideoPreview = (
    media
  ) => {

    if (!media) {
      return "";
    }

    return (
      media.previewUrl ||
      ""
    );

  };


  // ===================================================
  // FILTER PROJECTS
  // ===================================================

  const filteredProjects =
    projects.filter(
      (project) => {

        const category =
          project.category
            ?.toUpperCase() ||
          "";

        const type =
          project.type
            ?.toUpperCase() ||
          "";

        const mediaType =
          project.mediaType
            ?.toLowerCase() ||
          "";


        if (
          activeFilter ===
          "ALL"
        ) {

          return true;

        }


        if (
          activeFilter ===
          "VIDEO"
        ) {

          if (
            type === "VIDEO" ||
            mediaType ===
              "video"
          ) {

            return true;

          }


          const media =
            getProjectMedia(
              project
            );


          return (
            media.length > 0 &&
            media.every(
              (item) =>
                isVideoMedia(item)
            )
          );

        }


        if (
          activeFilter ===
          "PHOTO"
        ) {

          return (
            type === "PHOTO" ||
            category === "PHOTO"
          );

        }


        if (
          activeFilter ===
          "BRANDING"
        ) {

          return (
            type ===
              "BRANDING" ||
            category ===
              "BRANDING"
          );

        }


        if (
          activeFilter ===
          "DIGITAL"
        ) {

          return (
            type ===
              "DIGITAL" ||
            category ===
              "DIGITAL"
          );

        }


        if (
          activeFilter ===
          "UI/UX"
        ) {

          return (
            type ===
              "UI/UX" ||
            type ===
              "UIUX" ||
            category ===
              "UI/UX" ||
            category ===
              "UIUX"
          );

        }


        return (
          category ===
            activeFilter ||
          type ===
            activeFilter
        );

      }
    );


  // ===================================================
  // PAGINATION
  // ===================================================

  const totalPages =
    Math.max(
      1,
      Math.ceil(
        filteredProjects.length /
          PROJECTS_PER_PAGE
      )
    );


  const safeCurrentPage =
    Math.min(
      currentPage,
      totalPages
    );


  const startIndex =
    (safeCurrentPage - 1) *
    PROJECTS_PER_PAGE;


  const paginatedProjects =
    filteredProjects.slice(
      startIndex,
      startIndex +
        PROJECTS_PER_PAGE
    );


  // ===================================================
  // CHANGE FILTER
  // ===================================================

  const handleFilterChange =
    (filter) => {

      setActiveFilter(
        filter
      );

      setCurrentPage(1);

    };


  // ===================================================
  // CHANGE PAGE
  // ===================================================

  const handlePageChange =
    (page) => {

      if (
        page < 1 ||
        page > totalPages
      ) {

        return;

      }


      setCurrentPage(
        page
      );


      document
        .getElementById(
          "portfolio"
        )
        ?.scrollIntoView({
          behavior:
            "smooth",
          block:
            "start",
        });

    };


  // ===================================================
  // IMAGE ERROR FALLBACK
  // ===================================================

  const handleImageError =
    (
      event,
      media,
      project
    ) => {

      const element =
        event.currentTarget;


      const stage =
        Number(
          element.dataset
            .fallbackStage ||
          "0"
        );


      // -------------------------------------------------
      // FALLBACK 1
      // -------------------------------------------------

      if (
        stage === 0 &&
        media?.thumbnail &&
        element.src !==
          media.thumbnail
      ) {

        element.dataset
          .fallbackStage =
          "1";

        element.src =
          media.thumbnail;

        return;

      }


      // -------------------------------------------------
      // FALLBACK 2
      // -------------------------------------------------

      if (
        stage <= 1 &&
        media?.image &&
        element.src !==
          media.image
      ) {

        element.dataset
          .fallbackStage =
          "2";

        element.src =
          media.image;

        return;

      }


      // -------------------------------------------------
      // FALLBACK 3
      // -------------------------------------------------

      if (
        stage <= 2 &&
        media?.id
      ) {

        element.dataset
          .fallbackStage =
          "3";

        element.src =
          `https://drive.google.com/thumbnail?id=${media.id}&sz=w2000`;

        return;

      }


      // -------------------------------------------------
      // FALLBACK 4
      // -------------------------------------------------

      if (
        stage <= 3 &&
        project?.id
      ) {

        element.dataset
          .fallbackStage =
          "4";

        element.src =
          `https://drive.google.com/thumbnail?id=${project.id}&sz=w2000`;

        return;

      }


      element.style.display =
        "none";

    };


  // ===================================================
  // OPEN PROJECT
  // ===================================================

  const openProject =
    (
      project,
      mediaIndex = 0
    ) => {

      setSelectedProject(
        project
      );

      setCurrentMediaIndex(
        mediaIndex
      );

      document.body.style.overflow =
        "hidden";

    };


  // ===================================================
  // CLOSE PROJECT
  // ===================================================

  const closeProject =
    () => {

      setSelectedProject(
        null
      );

      setCurrentMediaIndex(
        0
      );

      document.body.style.overflow =
        "";

    };


  // ===================================================
  // SELECTED PROJECT MEDIA
  // ===================================================

  const selectedMedia =
    getProjectMedia(
      selectedProject
    );


  // ===================================================
  // NEXT MEDIA
  // ===================================================

  const nextMedia =
    () => {

      if (
        selectedMedia.length <=
        1
      ) {

        return;

      }


      setCurrentMediaIndex(
        (previous) =>
          (
            previous + 1
          ) %
          selectedMedia.length
      );

    };


  // ===================================================
  // PREVIOUS MEDIA
  // ===================================================

  const previousMedia =
    () => {

      if (
        selectedMedia.length <=
        1
      ) {

        return;

      }


      setCurrentMediaIndex(
        (previous) =>
          (
            previous -
            1 +
            selectedMedia.length
          ) %
          selectedMedia.length
      );

    };


  // ===================================================
  // SELECT MEDIA
  // ===================================================

  const selectMedia =
    (index) => {

      setCurrentMediaIndex(
        index
      );

    };


  // ===================================================
  // CLEANUP
  // ===================================================

  useEffect(() => {

    return () => {

      document.body.style.overflow =
        "";

    };

  }, []);


  // ===================================================
  // KEYBOARD CONTROLS
  // ===================================================

  useEffect(() => {

    const handleKeyDown =
      (event) => {

        if (
          !selectedProject
        ) {

          return;

        }


        if (
          event.key ===
          "Escape"
        ) {

          closeProject();

        }


        if (
          event.key ===
          "ArrowRight"
        ) {

          nextMedia();

        }


        if (
          event.key ===
          "ArrowLeft"
        ) {

          previousMedia();

        }

      };


    window.addEventListener(
      "keydown",
      handleKeyDown
    );


    return () => {

      window.removeEventListener(
        "keydown",
        handleKeyDown
      );

    };

  }, [
    selectedProject,
    selectedMedia.length,
  ]);


  // ===================================================
  // RENDER
  // ===================================================

  return (

    <section
      id="portfolio"
      className="
        relative
        w-full
        bg-black
        text-white
      "
    >

      <div
        className="
          mx-auto
          w-full
          max-w-[1800px]
          px-6
          py-10
          sm:px-10
          lg:px-16
          lg:py-14
        "
      >

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="mb-8">

          <Reveal
            direction="up"
            delay={0}
          >

            <div
              className="
                mb-5
                flex
                items-center
                gap-3
              "
            >

              <span
                className="
                  text-[10px]
                  tracking-[0.18em]
                  text-white/40
                  lg:text-[11px]
                "
              >
                02
              </span>

              <span
                className="
                  h-px
                  w-6
                  bg-white/30
                "
              />

              <span
                className="
                  text-[10px]
                  uppercase
                  tracking-[0.18em]
                  text-white/45
                  lg:text-[11px]
                "
              >
                PORTFOLIO
              </span>

            </div>

          </Reveal>


          <div
            className="
              flex
              flex-col
              gap-6
              lg:flex-row
              lg:items-end
              lg:justify-between
            "
          >

            <Reveal
              direction="up"
              delay={100}
            >

              <div>

                <h2
                  className="
                    text-[42px]
                    font-medium
                    leading-[0.95]
                    tracking-tight
                    sm:text-[52px]
                    lg:text-[68px]
                    xl:text-[74px]
                  "
                >
                  SELECTED WORK
                </h2>


                <p
                  className="
                    mt-3
                    max-w-112.5
                    text-[11px]
                    leading-[1.6]
                    text-white/50
                    sm:text-[12px]
                    lg:text-[13px]
                  "
                >
                  A collection of visuals,
                  digital experiences,
                  stories, and ideas
                  I&apos;ve created along
                  the way.
                </p>

              </div>

            </Reveal>


            <Reveal
              direction="up"
              delay={200}
            >

              <div
                className="
                  flex
                  flex-wrap
                  gap-x-5
                  gap-y-4
                  lg:justify-end
                "
              >

                {filters.map(
                  (filter) => (

                    <button
                      key={filter}
                      type="button"
                      onClick={() =>
                        handleFilterChange(
                          filter
                        )
                      }
                      className={`
                        relative
                        text-[9px]
                        tracking-[0.14em]
                        transition-all
                        duration-300
                        sm:text-[10px]
                        ${
                          activeFilter ===
                          filter
                            ? "text-white"
                            : "text-white/35 hover:text-white/80"
                        }
                      `}
                    >

                      {filter}

                      {activeFilter ===
                        filter && (

                        <span
                          className="
                            absolute
                            -bottom-2
                            left-0
                            h-px
                            w-full
                            bg-white
                          "
                        />

                      )}

                    </button>

                  )
                )}

              </div>

            </Reveal>

          </div>


          <Reveal
            direction="none"
            delay={300}
          >

            <div
              className="
                mt-6
                h-px
                w-full
                bg-white/10
              "
            />

          </Reveal>

        </div>


        {/* =================================================
            LOADING
        ================================================= */}

        {loading && (

          <Reveal
            direction="up"
            delay={0}
          >

            <div
              className="
                flex
                min-h-125
                items-center
                justify-center
              "
            >

              <p
                className="
                  text-[10px]
                  tracking-[0.2em]
                  text-white/40
                "
              >
                LOADING PROJECTS...
              </p>

            </div>

          </Reveal>

        )}


        {/* =================================================
            ERROR
        ================================================= */}

        {!loading &&
          error && (

            <Reveal
              direction="up"
              delay={0}
            >

              <div
                className="
                  flex
                  min-h-125
                  items-center
                  justify-center
                "
              >

                <div className="text-center">

                  <p
                    className="
                      text-[10px]
                      tracking-[0.2em]
                      text-white/50
                    "
                  >
                    UNABLE TO LOAD
                    PORTFOLIO
                  </p>


                  <p
                    className="
                      mt-3
                      text-[9px]
                      tracking-[0.15em]
                      text-white/30
                    "
                  >
                    PLEASE CHECK YOUR
                    API CONNECTION
                  </p>

                </div>

              </div>

            </Reveal>

          )}


        {/* =================================================
            EMPTY
        ================================================= */}

        {!loading &&
          !error &&
          filteredProjects.length ===
            0 && (

            <Reveal
              direction="up"
              delay={0}
            >

              <div
                className="
                  flex
                  min-h-100
                  items-center
                  justify-center
                "
              >

                <p
                  className="
                    text-[10px]
                    tracking-[0.15em]
                    text-white/40
                  "
                >
                  NO PROJECTS FOUND
                </p>

              </div>

            </Reveal>

          )}


        {/* =================================================
            PROJECT GRID
        ================================================= */}

        {!loading &&
          !error &&
          paginatedProjects.length >
            0 && (

            <div
              className="
                columns-1
                gap-4
                sm:columns-2
                lg:columns-3
                xl:columns-4
              "
            >

              {paginatedProjects.map(
                (
                  project,
                  index
                ) => {

                  const projectMedia =
                    getProjectMedia(
                      project
                    );


                  const projectIsVideo =
                    isVideoProject(
                      project
                    );


                  const projectIsCollection =
                    isCollection(
                      project
                    );


                  const mediaCount =
                    projectMedia.length;


                  return (

                    <Reveal
                      key={
                        project.id
                      }
                      direction="up"
                      delay={Math.min(
                        index * 80,
                        560
                      )}
                      className="
                        mb-4
                        w-full
                        break-inside-avoid
                      "
                    >

                      <article
                        onClick={() =>
                          openProject(
                            project
                          )
                        }
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

                        {/* =================================================
                            PROJECT IMAGE
                        ================================================= */}

                        <div
                          className="
                            relative
                            w-full
                            overflow-hidden
                            bg-[#080808]
                          "
                        >

                          <img
                            src={
                              getCardImage(
                                project
                              )
                            }
                            alt={
                              project.title
                            }
                            loading="lazy"
                            onError={(
                              event
                            ) =>
                              handleImageError(
                                event,
                                projectMedia[0] ||
                                  project,
                                project
                              )
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


                          <div
                            className="
                              pointer-events-none
                              absolute
                              inset-0
                              bg-black/10
                              transition-all
                              duration-500
                              group-hover:bg-black/0
                            "
                          />


                          {/* =================================================
                              COLLECTION LABEL
                          ================================================= */}

                          {projectIsCollection && (

                            <div
                              className="
                                absolute
                                right-3
                                top-3
                                z-10
                                border
                                border-white/20
                                bg-black/75
                                px-2
                                py-1
                                backdrop-blur-sm
                              "
                            >

                              <span
                                className="
                                  text-[8px]
                                  tracking-[0.12em]
                                  text-white/80
                                "
                              >
                                COLLECTION
                              </span>

                            </div>

                          )}


                          {/* =================================================
                              MEDIA COUNT
                          ================================================= */}

                          {projectIsCollection &&
                            mediaCount >
                              1 && (

                            <div
                              className="
                                absolute
                                bottom-3
                                right-3
                                z-10
                                border
                                border-white/20
                                bg-black/70
                                px-2
                                py-1
                                backdrop-blur-sm
                              "
                            >

                              <span
                                className="
                                  text-[8px]
                                  tracking-[0.12em]
                                  text-white/80
                                "
                              >
                                {mediaCount}{" "}
                                MEDIA
                              </span>

                            </div>

                          )}


                          {/* =================================================
                              VIDEO LABEL
                          ================================================= */}

                          {projectIsVideo && (

                            <>

                              <div
                                className="
                                  absolute
                                  left-3
                                  top-3
                                  z-10
                                  flex
                                  items-center
                                  gap-2
                                "
                              >

                                <span
                                  className="
                                    h-1.5
                                    w-1.5
                                    rounded-full
                                    bg-white
                                  "
                                />

                                <span
                                  className="
                                    text-[8px]
                                    tracking-[0.14em]
                                    text-white/80
                                  "
                                >
                                  VIDEO
                                </span>

                              </div>


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

                            </>

                          )}


                          {/* =================================================
                              COLLECTION OPEN ICON
                          ================================================= */}

                          {projectIsCollection && (

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
                                text-[12px]
                                text-white
                                backdrop-blur-sm
                                transition-all
                                duration-300
                                group-hover:scale-110
                                group-hover:bg-white
                                group-hover:text-black
                              "
                            >
                              ↗
                            </div>

                          )}

                        </div>


                        {/* =================================================
                            PROJECT INFO
                        ================================================= */}

                        <div
                          className="
                            flex
                            min-h-17
                            items-center
                            justify-between
                            gap-4
                            border-t
                            border-white/10
                            px-4
                            py-3
                          "
                        >

                          <div
                            className="
                              min-w-0
                            "
                          >

                            <h3
                              className="
                                truncate
                                text-[9px]
                                font-medium
                                tracking-[0.08em]
                                text-white/90
                                sm:text-[10px]
                              "
                            >
                              {
                                project.title
                              }
                            </h3>


                            <p
                              className="
                                mt-1
                                truncate
                                text-[8px]
                                tracking-[0.04em]
                                text-white/40
                                sm:text-[9px]
                              "
                            >
                              {
                                project.category
                              }

                              {" — "}

                              {
                                project.year ||
                                ""
                              }

                              {projectIsCollection && (
                                <>
                                  {" — "}
                                  {
                                    mediaCount
                                  }
                                  {" MEDIA"}
                                </>
                              )}

                            </p>

                          </div>


                          <span
                            className="
                              shrink-0
                              text-[12px]
                              text-white/40
                              transition-all
                              duration-300
                              group-hover:-translate-y-1
                              group-hover:translate-x-1
                              group-hover:text-white
                            "
                          >
                            ↗
                          </span>

                        </div>

                      </article>

                    </Reveal>

                  );

                }
              )}

            </div>

          )}


        {/* =================================================
            PROJECT COUNT
        ================================================= */}

        {!loading &&
          !error &&
          filteredProjects.length >
            0 && (

            <Reveal
              direction="up"
              delay={100}
            >

              <div
                className="
                  mt-6
                  flex
                  justify-between
                  text-[9px]
                  tracking-[0.14em]
                  text-white/30
                  sm:text-[10px]
                "
              >

                <span>

                  SHOWING{" "}

                  {startIndex + 1}

                  –

                  {Math.min(
                    startIndex +
                      PROJECTS_PER_PAGE,
                    filteredProjects.length
                  )}

                  {" OF "}

                  {
                    filteredProjects.length
                  }

                </span>


                <span>

                  PAGE{" "}

                  {
                    safeCurrentPage
                  }

                  {" OF "}

                  {
                    totalPages
                  }

                </span>

              </div>

            </Reveal>

          )}


        {/* =================================================
            PAGINATION
        ================================================= */}

        {!loading &&
          !error &&
          totalPages > 1 && (

            <Reveal
              direction="up"
              delay={150}
            >

              <div
                className="
                  mt-8
                  flex
                  flex-wrap
                  items-center
                  justify-center
                  gap-3
                  border-t
                  border-white/10
                  pt-8
                "
              >

                <button
                  type="button"
                  disabled={
                    safeCurrentPage ===
                    1
                  }
                  onClick={() =>
                    handlePageChange(
                      safeCurrentPage -
                        1
                    )
                  }
                  className="
                    px-3
                    py-2
                    text-[9px]
                    tracking-[0.14em]
                    text-white/50
                    transition
                    hover:text-white
                    disabled:cursor-not-allowed
                    disabled:opacity-20
                  "
                >
                  ← PREVIOUS
                </button>


                <div
                  className="
                    flex
                    gap-2
                  "
                >

                  {Array.from(
                    {
                      length:
                        totalPages,
                    },
                    (_, index) =>
                      index + 1
                  ).map(
                    (page) => (

                      <button
                        key={page}
                        type="button"
                        onClick={() =>
                          handlePageChange(
                            page
                          )
                        }
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
                            safeCurrentPage ===
                            page
                              ? "border-white bg-white text-black"
                              : "border-white/10 text-white/40 hover:border-white/40 hover:text-white"
                          }
                        `}
                      >
                        {page}
                      </button>

                    )
                  )}

                </div>


                <button
                  type="button"
                  disabled={
                    safeCurrentPage ===
                    totalPages
                  }
                  onClick={() =>
                    handlePageChange(
                      safeCurrentPage +
                        1
                    )
                  }
                  className="
                    px-3
                    py-2
                    text-[9px]
                    tracking-[0.14em]
                    text-white/50
                    transition
                    hover:text-white
                    disabled:cursor-not-allowed
                    disabled:opacity-20
                  "
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
            p-3
            backdrop-blur-md
            sm:p-4
            animate-[modalFade_300ms_ease-out_both]
          "
        >

          {/* BACKDROP */}

          <div
            className="
              absolute
              inset-0
            "
            onClick={
              closeProject
            }
          />


          {/* MODAL */}

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
              shadow-2xl
              animate-[modalUp_500ms_cubic-bezier(0.22,1,0.36,1)_both]
            "
          >

            {/* =================================================
                CLOSE
            ================================================= */}

            <button
              type="button"
              onClick={
                closeProject
              }
              aria-label="Close project"
              className="
                absolute
                right-3
                top-3
                z-50
                flex
                h-10
                w-10
                items-center
                justify-center
                border
                border-white/20
                bg-black/80
                text-white
                backdrop-blur-sm
                transition-all
                duration-300
                hover:bg-white
                hover:text-black
                sm:right-4
                sm:top-4
              "
            >
              ✕
            </button>


            {/* =================================================
                COLLECTION / MEDIA VIEWER
            ================================================= */}

            <div
              className="
                relative
                flex
                min-h-0
                flex-1
                items-center
                justify-center
                overflow-hidden
                bg-[#050505]
              "
            >

              {/* =================================================
                  CURRENT MEDIA
              ================================================= */}

              {selectedMedia.length >
                0 &&
                selectedMedia[
                  currentMediaIndex
                ] && (

                <div
                  key={
                    selectedMedia[
                      currentMediaIndex
                    ].id ||
                    currentMediaIndex
                  }
                  className="
                    flex
                    h-full
                    w-full
                    items-center
                    justify-center
                    animate-[imageReveal_400ms_ease-out_both]
                  "
                >

                  {isVideoMedia(
                    selectedMedia[
                      currentMediaIndex
                    ]
                  ) ? (

                    /* =================================================
                       VIDEO
                    ================================================= */

                    getVideoPreview(
                      selectedMedia[
                        currentMediaIndex
                      ]
                    ) ? (

                      <iframe
                        src={
                          getVideoPreview(
                            selectedMedia[
                              currentMediaIndex
                            ]
                          )
                        }
                        title={
                          selectedMedia[
                            currentMediaIndex
                          ].title ||
                          selectedProject.title
                        }
                        className="
                          h-[70vh]
                          w-full
                          border-0
                          sm:h-[72vh]
                        "
                        allow="
                          autoplay;
                          fullscreen;
                          picture-in-picture
                        "
                        allowFullScreen
                      />

                    ) : (

                      <div
                        className="
                          flex
                          h-[50vh]
                          items-center
                          justify-center
                        "
                      >

                        <p
                          className="
                            text-[10px]
                            tracking-[0.15em]
                            text-white/40
                          "
                        >
                          VIDEO PREVIEW
                          UNAVAILABLE
                        </p>

                      </div>

                    )

                  ) : (

                    /* =================================================
                       IMAGE
                    ================================================= */

                    <img
                      src={
                        getMediaPreview(
                          selectedMedia[
                            currentMediaIndex
                          ]
                        )
                      }
                      alt={
                        selectedMedia[
                          currentMediaIndex
                        ].title ||
                        selectedProject.title
                      }
                      onError={(
                        event
                      ) =>
                        handleImageError(
                          event,
                          selectedMedia[
                            currentMediaIndex
                          ],
                          selectedProject
                        )
                      }
                      className="
                        max-h-[70vh]
                        max-w-[94%]
                        object-contain
                        sm:max-h-[72vh]
                      "
                    />

                  )}

                </div>

              )}


              {/* =================================================
                  PREVIOUS
              ================================================= */}

              {selectedMedia.length >
                1 && (

                <button
                  type="button"
                  onClick={
                    previousMedia
                  }
                  aria-label="Previous media"
                  className="
                    absolute
                    left-3
                    top-1/2
                    z-30
                    flex
                    h-10
                    w-10
                    -translate-y-1/2
                    items-center
                    justify-center
                    border
                    border-white/20
                    bg-black/70
                    text-white
                    backdrop-blur-sm
                    transition-all
                    duration-300
                    hover:border-white
                    hover:bg-white
                    hover:text-black
                    sm:left-5
                    sm:h-12
                    sm:w-12
                  "
                >
                  ←
                </button>

              )}


              {/* =================================================
                  NEXT
              ================================================= */}

              {selectedMedia.length >
                1 && (

                <button
                  type="button"
                  onClick={
                    nextMedia
                  }
                  aria-label="Next media"
                  className="
                    absolute
                    right-3
                    top-1/2
                    z-30
                    flex
                    h-10
                    w-10
                    -translate-y-1/2
                    items-center
                    justify-center
                    border
                    border-white/20
                    bg-black/70
                    text-white
                    backdrop-blur-sm
                    transition-all
                    duration-300
                    hover:border-white
                    hover:bg-white
                    hover:text-black
                    sm:right-5
                    sm:h-12
                    sm:w-12
                  "
                >
                  →
                </button>

              )}


              {/* =================================================
                  COUNTER
              ================================================= */}

              {selectedMedia.length >
                0 && (

                <div
                  className="
                    absolute
                    bottom-4
                    left-1/2
                    z-30
                    -translate-x-1/2
                    border
                    border-white/10
                    bg-black/70
                    px-3
                    py-1.5
                    backdrop-blur-sm
                  "
                >

                  <span
                    className="
                      text-[9px]
                      tracking-[0.16em]
                      text-white/70
                    "
                  >

                    {
                      String(
                        currentMediaIndex +
                          1
                      ).padStart(
                        2,
                        "0"
                      )
                    }

                    {" / "}

                    {
                      String(
                        selectedMedia.length
                      ).padStart(
                        2,
                        "0"
                      )
                    }

                  </span>

                </div>

              )}

            </div>


            {/* =================================================
                THUMBNAIL STRIP
            ================================================= */}

            {selectedMedia.length >
              1 && (

              <div
                className="
                  border-t
                  border-white/10
                  bg-black
                  px-4
                  py-3
                "
              >

                <div
                  className="
                    flex
                    gap-2
                    overflow-x-auto
                    pb-1
                  "
                >

                  {selectedMedia.map(
                    (
                      media,
                      index
                    ) => (

                      <button
                        key={
                          media.id ||
                          index
                        }
                        type="button"
                        onClick={() =>
                          selectMedia(
                            index
                          )
                        }
                        className={`
                          group
                          relative
                          h-14
                          w-20
                          shrink-0
                          overflow-hidden
                          border
                          transition-all
                          duration-300
                          sm:h-16
                          sm:w-24
                          ${
                            currentMediaIndex ===
                            index
                              ? "border-white"
                              : "border-white/10 opacity-50 hover:border-white/40 hover:opacity-100"
                          }
                        `}
                      >

                        <img
                          src={
                            media.thumbnail ||
                            media.image ||
                            ""
                          }
                          alt={
                            media.title ||
                            `${selectedProject.title} ${
                              index + 1
                            }`
                          }
                          loading="lazy"
                          className="
                            h-full
                            w-full
                            object-cover
                            transition-transform
                            duration-300
                            group-hover:scale-105
                          "
                        />


                        {/* VIDEO INDICATOR */}

                        {isVideoMedia(
                          media
                        ) && (

                          <span
                            className="
                              absolute
                              inset-0
                              flex
                              items-center
                              justify-center
                              bg-black/30
                              text-[10px]
                              text-white
                            "
                          >
                            ▶
                          </span>

                        )}


                        {/* ACTIVE BORDER */}

                        {currentMediaIndex ===
                          index && (

                          <span
                            className="
                              pointer-events-none
                              absolute
                              inset-0
                              border
                              border-white
                            "
                          />

                        )}

                      </button>

                    )
                  )}

                </div>

              </div>

            )}


            {/* =================================================
                PROJECT INFORMATION
            ================================================= */}

            <div
              className="
                border-t
                border-white/10
                px-5
                py-5
                sm:px-6
              "
            >

              <div
                className="
                  flex
                  flex-col
                  gap-4
                  sm:flex-row
                  sm:items-end
                  sm:justify-between
                "
              >

                <div
                  className="
                    min-w-0
                  "
                >

                  <p
                    className="
                      text-[9px]
                      tracking-[0.16em]
                      text-white/35
                    "
                  >
                    {
                      isCollection(
                        selectedProject
                      )
                        ? "PROJECT COLLECTION"
                        : selectedProject.type
                    }
                  </p>


                  <h3
                    className="
                      mt-2
                      truncate
                      text-[12px]
                      tracking-[0.08em]
                      text-white
                      sm:text-[14px]
                    "
                  >
                    {
                      selectedProject.title
                    }
                  </h3>


                  <p
                    className="
                      mt-2
                      text-[10px]
                      text-white/40
                    "
                  >

                    {
                      selectedProject.category
                    }

                    {selectedProject.year && (
                      <>
                        {" — "}
                        {
                          selectedProject.year
                        }
                      </>
                    )}

                    {selectedMedia.length >
                      0 && (
                      <>
                        {" — "}
                        {
                          selectedMedia.length
                        }
                        {" MEDIA"}
                      </>
                    )}

                  </p>

                </div>


                {/* =================================================
                    OPEN DRIVE
                ================================================= */}

                {selectedProject.driveUrl && (

                  <a
                    href={
                      selectedProject.driveUrl
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="
                      inline-flex
                      shrink-0
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
          ANIMATIONS
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
            transform:
              translateY(20px)
              scale(0.98);
          }

          100% {
            opacity: 1;
            transform:
              translateY(0)
              scale(1);
          }

        }


        @keyframes imageReveal {

          0% {
            opacity: 0;
            transform:
              scale(0.98);
          }

          100% {
            opacity: 1;
            transform:
              scale(1);
          }

        }


        @media (
          prefers-reduced-motion: reduce
        ) {

          *,
          *::before,
          *::after {

            animation-duration:
              0.01ms !important;

            animation-iteration-count:
              1 !important;

            transition-duration:
              0.01ms !important;

            scroll-behavior:
              auto !important;

          }

        }

      `}</style>

    </section>

  );

}


export default Portfolio;