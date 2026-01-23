// "use client";

// import gsap from "gsap";
// import { useGSAP } from "@gsap/react";
// import { useRef, useState } from "react";
// import { useArticles } from "@/context/ArticlesContext";

// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faBars, faXmark } from "@fortawesome/free-solid-svg-icons";
// import Link from "next/link";

// const Navbar = () => {
//   const navbarContainerRef = useRef<HTMLDivElement>(null);
//   const navbarLogoContainerRef = useRef<HTMLDivElement>(null);
//   const navRef = useRef<HTMLAnchorElement>(null);
//   const hamburgerMenuDimmedBgRef = useRef<HTMLDivElement>(null);
//   const hamburgerMenuLinksContainerRef = useRef<HTMLDivElement>(null);
//   const hamburgerIconRef = useRef<HTMLDivElement>(null);

//   const [isMenuOpen, setIsMenuOpen] = useState(false);

//   const { categoryTree, selectedCategory, setSelectedCategory } = useArticles();

//   /* ---------------- RESPONSIVE CONFIG ---------------- */

//   const navConfig = useRef<{
//     from: gsap.TweenVars;
//     to: gsap.TweenVars;
//     minHeight: number;
//   }>({
//     from: {},
//     to: {},
//     minHeight: 80,
//   });

//   /* ---------------- MATCH MEDIA ---------------- */

//   useGSAP(() => {
//     const mm = gsap.matchMedia();

//     mm.add("(max-width: 1024px)", () => {
//       navConfig.current = {
//         from: {
//           position: "absolute",
//           left: "50%",
//           top: "50%",
//           xPercent: -50,
//           yPercent: -50,
//           color: "white",
//         },
//         to: {
//           position: "fixed",
//           left: 40,
//           top: 27,
//           xPercent: 0,
//           yPercent: 0,
//           color: "black",
//         },
//         minHeight: 64,
//       };
//     });

//     mm.add("(min-width: 1024px)", () => {
//       navConfig.current = {
//         from: {
//           position: "absolute",
//           left: "50%",
//           top: "50%",
//           xPercent: -50,
//           yPercent: -50,
//           color: "white",
//         },
//         to: {
//           position: "fixed",
//           left: 40,
//           top: 20,
//           xPercent: 0,
//           yPercent: 0,
//           color: "black",
//         },
//         minHeight: 80,
//       };
//     });

//     return () => mm.revert();
//   }, []);

//   /* ---------------- ANIMATION ---------------- */

//   useGSAP(() => {
//     const { from, to, minHeight } = navConfig.current;

//     gsap
//       .timeline({ delay: 1.2 })
//       .fromTo(navRef.current, from, {
//         ...to,
//         duration: 0.5,
//         ease: "power1.inOut",
//       })
//       .to(navbarContainerRef.current, { minHeight })
//       .to(navbarLogoContainerRef.current, { autoAlpha: 1 });
//   }, []);

//   /* ---------------- HAMBURGER MENU ANIMATION ---------------- */

//   useGSAP(() => {
//     // Set initial state - menu hidden
//     gsap.set(hamburgerMenuDimmedBgRef.current, {
//       autoAlpha: 0,
//       pointerEvents: "none",
//     });
//     gsap.set(hamburgerMenuLinksContainerRef.current, {
//       x: "100%",
//     });
//   }, []);

//   const toggleMenu = () => {
//     const tl = gsap.timeline();

//     if (!isMenuOpen) {
//       // Opening animation
//       tl.to(hamburgerIconRef.current, {
//         rotation: 180,
//         duration: 0.3,
//         ease: "power2.inOut",
//       })
//         .to(
//           hamburgerMenuDimmedBgRef.current,
//           {
//             autoAlpha: 1,
//             pointerEvents: "auto",
//             duration: 0.3,
//           },
//           "<",
//         )
//         .to(
//           hamburgerMenuLinksContainerRef.current,
//           {
//             x: "0%",
//             duration: 0.4,
//             ease: "power2.out",
//           },
//           "<0.1",
//         );
//     } else {
//       // Closing animation
//       tl.to(hamburgerIconRef.current, {
//         rotation: 0,
//         duration: 0.3,
//         ease: "power2.inOut",
//       })
//         .to(
//           hamburgerMenuLinksContainerRef.current,
//           {
//             x: "100%",
//             duration: 0.3,
//             ease: "power2.in",
//           },
//           "<",
//         )
//         .to(
//           hamburgerMenuDimmedBgRef.current,
//           {
//             autoAlpha: 0,
//             pointerEvents: "none",
//             duration: 0.3,
//           },
//           "<0.1",
//         );
//     }

//     setIsMenuOpen(!isMenuOpen);
//   };

//   /* ---------------- INTERACTION ---------------- */

//   const handleCategoryClick = (category: string) => {
//     setSelectedCategory(selectedCategory === category ? null : category);
//     // Close menu on mobile after selection
//     if (isMenuOpen) {
//       toggleMenu();
//     }
//   };

//   /* ---------------- RENDER ---------------- */

//   console.log("category", categoryTree);

//   return (
//     <div
//       ref={navbarContainerRef}
//       className="fixed top-0 w-full h-full z-99 select-none"
//     >
//       <div
//         ref={navbarLogoContainerRef}
//         className="absolute top-0 left-0 w-full opacity-0 bg-background pt-8 pb-4 flex flex-col gap-2 min-h-16 lg:min-h-20 max-md:hidden"
//       >
//         <div className="uppercase text-sm mx-auto inline-flex items-center justify-center gap-20 max-lg:gap-12">
//           {categoryTree.map((cat, index) => (
//             <div
//               key={index}
//               onClick={() => handleCategoryClick(cat.category)}
//               className={`cursor-pointer transition-colors duration-200 ${
//                 selectedCategory === cat.category
//                   ? "text-black font-semibold"
//                   : "text-neutral-600 hover:text-black"
//               }`}
//             >
//               {cat.category}
//             </div>
//           ))}
//         </div>
//         <div className="flex justify-center items-center gap-20 text-sm">
//           {categoryTree.map((cat) =>
//             cat.children?.map((child, index) => (
//               <div key={index}>{child.category}</div>
//             )),
//           )}
//         </div>
//       </div>

//       <Link
//         ref={navRef}
//         href={`/`}
//         className="absolute text-4xl max-lg:text-2xl font-bold"
//       >
//         LOGO
//       </Link>

//       {/* Hamburger menu */}
//       <div className="fixed top-0 right-0 w-20 h-16 flex items-end justify-center md:hidden z-50">
//         <div
//           ref={hamburgerIconRef}
//           onClick={toggleMenu}
//           className="cursor-pointer mb-2"
//         >
//           <FontAwesomeIcon icon={isMenuOpen ? faXmark : faBars} size="xl" />
//         </div>
//       </div>

//       <div
//         ref={hamburgerMenuDimmedBgRef}
//         onClick={toggleMenu}
//         className="fixed top-16 bottom-0 w-full right-0 bg-black/40 md:hidden"
//       />
//       <div
//         ref={hamburgerMenuLinksContainerRef}
//         className="fixed right-0 bottom-0 top-16 w-80 bg-background flex flex-col gap-8 items-center py-10 md:hidden shadow-lg"
//       >
//         {categoryTree.map((cat, index) => (
//           <div
//             key={index}
//             onClick={() => handleCategoryClick(cat.category)}
//             className={`text-lg cursor-pointer transition-colors duration-200 ${
//               selectedCategory === cat.category
//                 ? "text-black font-semibold"
//                 : "text-neutral-600 hover:text-black"
//             }`}
//           >
//             {cat.category}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Navbar;

// -------------------------------------------------------------------

"use client";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useRef, useState, useMemo } from "react";
import { useArticles } from "@/context/ArticlesContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faXmark } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { CategoryWithChildren } from "@/lib/categoryTreeWithChildren";

const Navbar = () => {
  const navbarContainerRef = useRef<HTMLDivElement>(null);
  const navbarLogoContainerRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLAnchorElement>(null);
  const hamburgerMenuDimmedBgRef = useRef<HTMLDivElement>(null);
  const hamburgerMenuLinksContainerRef = useRef<HTMLDivElement>(null);
  const hamburgerIconRef = useRef<HTMLDivElement>(null);

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const { categoryTree, selectedCategory, setSelectedCategory } = useArticles();

  /* ---------------- LOGIC (Fixed) ---------------- */

  // REPLACED STATE WITH MEMO:
  // We determine the activeParentId directly from the selectedCategory.
  // No useEffect needed, no re-render loops.
  const activeParentId = useMemo(() => {
    if (!selectedCategory) return null;

    // 1. Is the selected category a Parent?
    const parentMatch = categoryTree.find(
      (c) => c.category === selectedCategory,
    );
    if (parentMatch) return parentMatch.id;

    // 2. Is the selected category a Child?
    const parentOfChild = categoryTree.find((p) =>
      p.children?.some((c) => c.category === selectedCategory),
    );
    if (parentOfChild) return parentOfChild.id;

    return null;
  }, [selectedCategory, categoryTree]);

  // Derived state: Get the list of children to display in Row 2
  const subCategoriesToDisplay = useMemo(() => {
    if (!activeParentId) return [];
    const parent = categoryTree.find((cat) => cat.id === activeParentId);
    return parent?.children || [];
  }, [activeParentId, categoryTree]);

  const handleParentClick = (cat: CategoryWithChildren) => {
    // If clicking the already selected category, toggle it off
    if (selectedCategory === cat.category) {
      setSelectedCategory(null);
    } else {
      setSelectedCategory(cat.category);
    }
  };

  const handleChildClick = (childCategory: string) => {
    setSelectedCategory(childCategory);
  };

  /* ---------------- ANIMATION & RESPONSIVE ---------------- */

  const navConfig = useRef<{
    from: gsap.TweenVars;
    to: gsap.TweenVars;
    height: number;
  }>({
    from: {},
    to: {},
    height: 80,
  });

  useGSAP(() => {
    const mm = gsap.matchMedia();

    mm.add("(max-width: 1024px)", () => {
      navConfig.current = {
        from: {
          position: "absolute",
          left: "50%",
          top: "50%",
          xPercent: -50,
          yPercent: -50,
          color: "white",
        },
        to: {
          position: "fixed",
          left: 40,
          top: 27,
          xPercent: 0,
          yPercent: 0,
          color: "black",
        },
        height: 64,
      };
    });

    mm.add("(min-width: 1024px)", () => {
      navConfig.current = {
        from: {
          position: "absolute",
          left: "50%",
          top: "50%",
          xPercent: -50,
          yPercent: -50,
          color: "white",
        },
        to: {
          position: "fixed",
          left: 40,
          top: 20,
          xPercent: 0,
          yPercent: 0,
          color: "black",
        },
        height: 80,
      };
    });

    return () => mm.revert();
  }, []);

  useGSAP(() => {
    const { from, to, height } = navConfig.current;

    gsap
      .timeline({ delay: 1.2 })
      .fromTo(navRef.current, from, {
        ...to,
        duration: 0.5,
        ease: "power1.inOut",
      })
      .to(navbarContainerRef.current, { height })
      .to(navbarLogoContainerRef.current, { autoAlpha: 1 });
  }, []);

  useGSAP(() => {
    gsap.set(hamburgerMenuDimmedBgRef.current, {
      autoAlpha: 0,
      pointerEvents: "none",
    });
    gsap.set(hamburgerMenuLinksContainerRef.current, {
      x: "100%",
    });
  }, []);

  const toggleMenu = () => {
    const tl = gsap.timeline();

    if (!isMenuOpen) {
      tl.to(hamburgerIconRef.current, {
        rotation: 180,
        duration: 0.3,
        ease: "power2.inOut",
      })
        .to(
          hamburgerMenuDimmedBgRef.current,
          {
            autoAlpha: 1,
            pointerEvents: "auto",
            duration: 0.3,
          },
          "<",
        )
        .to(
          hamburgerMenuLinksContainerRef.current,
          {
            x: "0%",
            duration: 0.4,
            ease: "power2.out",
          },
          "<0.1",
        );
    } else {
      tl.to(hamburgerIconRef.current, {
        rotation: 0,
        duration: 0.3,
        ease: "power2.inOut",
      })
        .to(
          hamburgerMenuLinksContainerRef.current,
          {
            x: "100%",
            duration: 0.3,
            ease: "power2.in",
          },
          "<",
        )
        .to(
          hamburgerMenuDimmedBgRef.current,
          {
            autoAlpha: 0,
            pointerEvents: "none",
            duration: 0.3,
          },
          "<0.1",
        );
    }

    setIsMenuOpen(!isMenuOpen);
  };

  /* ---------------- RENDER ---------------- */

  return (
    <div
      ref={navbarContainerRef}
      className="fixed top-0 w-full h-full z-99 select-none"
    >
      <div
        ref={navbarLogoContainerRef}
        className="absolute top-0 left-0 w-full h-full opacity-0 bg-background pt-8 flex flex-col items-center"
      >
        {/* ROW 1: PARENT CATEGORIES */}
        <div className="uppercase text-sm inline-flex items-center justify-center gap-16 font-medium tracking-wide max-md:hidden">
          {categoryTree.map((cat) => (
            <div
              key={cat.id}
              onClick={() => handleParentClick(cat)}
              className={`cursor-pointer transition-all duration-300 relative ${
                selectedCategory === cat.category || activeParentId === cat.id
                  ? "text-black"
                  : "text-neutral-500 hover:text-black"
              }`}
            >
              {cat.category}
              {/* Optional: Indicator dot */}
              {(selectedCategory === cat.category ||
                activeParentId === cat.id) && (
                <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 bg-black rounded-full" />
              )}
            </div>
          ))}
        </div>

        {/* ROW 2: SUB CATEGORIES */}
        <div
          className={`flex justify-center items-center gap-8 text-xs mt-4 transition-all duration-500 ease-out overflow-hidden max-md:hidden ${
            subCategoriesToDisplay.length > 0
              ? "opacity-100 max-h-10 translate-y-0"
              : "opacity-0 max-h-0 -translate-y-2 pointer-events-none"
          }`}
        >
          {subCategoriesToDisplay.map((child) => (
            <div
              key={child.id}
              onClick={() => handleChildClick(child.category)}
              className={`cursor-pointer transition-colors duration-200 ${
                selectedCategory === child.category
                  ? "text-black font-semibold border-b border-black"
                  : "text-neutral-500 hover:text-black"
              }`}
            >
              {child.category}
            </div>
          ))}
        </div>
      </div>

      <Link
        ref={navRef}
        href={`/`}
        className="absolute text-4xl max-lg:text-2xl font-bold"
      >
        LOGO
      </Link>

      {/* --- MOBILE --- */}
      <div className="fixed top-0 right-0 w-20 h-16 flex items-end justify-center md:hidden z-50">
        <div
          ref={hamburgerIconRef}
          onClick={toggleMenu}
          className="cursor-pointer mb-2"
        >
          <FontAwesomeIcon icon={isMenuOpen ? faXmark : faBars} size="xl" />
        </div>
      </div>

      <div
        ref={hamburgerMenuDimmedBgRef}
        onClick={toggleMenu}
        className="fixed top-16 bottom-0 w-full right-0 bg-black/40 md:hidden"
      />

      <div
        ref={hamburgerMenuLinksContainerRef}
        className="fixed right-0 bottom-0 top-16 w-80 bg-background flex flex-col gap-6 py-10 px-8 overflow-y-auto md:hidden shadow-lg"
      >
        {categoryTree.map((cat) => (
          <div key={cat.id} className="w-full flex flex-col items-center">
            <div
              onClick={() => handleParentClick(cat)}
              className={`text-lg cursor-pointer transition-colors ${
                selectedCategory === cat.category
                  ? "text-black font-semibold"
                  : "text-neutral-600"
              }`}
            >
              {cat.category}
            </div>

            {/* Mobile Accordion Logic - Derived from activeParentId */}
            {cat.children &&
              cat.children.length > 0 &&
              activeParentId === cat.id && (
                <div className="flex flex-col gap-4 mt-4 mb-2 pl-4 border-l-2 border-neutral-100 w-full items-center">
                  {cat.children.map((child) => (
                    <div
                      key={child.id}
                      onClick={() => {
                        handleChildClick(child.category);
                        toggleMenu();
                      }}
                      className={`text-base cursor-pointer ${
                        selectedCategory === child.category
                          ? "text-black font-semibold"
                          : "text-neutral-500"
                      }`}
                    >
                      {child.category}
                    </div>
                  ))}
                </div>
              )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Navbar;
