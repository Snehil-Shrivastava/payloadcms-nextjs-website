// "use client";

// import gsap from "gsap";
// import { useGSAP } from "@gsap/react";
// import { useRef } from "react";
// import { useArticles } from "@/context/ArticlesContext";

// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faBars } from "@fortawesome/free-solid-svg-icons";

// const Navbar = () => {
//   const navbarContainerRef = useRef<HTMLDivElement>(null);
//   const navbarLogoContainerRef = useRef<HTMLDivElement>(null);
//   const navRef = useRef<HTMLHeadingElement>(null);
//   const hamburgerMenuDimmedBgRef = useRef<HTMLHeadingElement>(null);
//   const hamburgerMenuLinksContainerRef = useRef<HTMLHeadingElement>(null);

//   const { categories, selectedCategory, setSelectedCategory } = useArticles();

//   /* ---------------- RESPONSIVE CONFIG ---------------- */

//   const navConfig = useRef<{
//     from: gsap.TweenVars;
//     to: gsap.TweenVars;
//     height: number;
//   }>({
//     from: {},
//     to: {},
//     height: 80,
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
//         height: 64,
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
//         height: 80,
//       };
//     });

//     return () => mm.revert();
//   }, []);

//   /* ---------------- ANIMATION ---------------- */

//   useGSAP(() => {
//     const { from, to, height } = navConfig.current;

//     gsap
//       .timeline({ delay: 1.2 })
//       .fromTo(navRef.current, from, {
//         ...to,
//         duration: 0.5,
//         ease: "power1.inOut",
//       })
//       .to(navbarContainerRef.current, { height })
//       .to(navbarLogoContainerRef.current, { autoAlpha: 1 });
//   }, []);

//   /* ---------------- INTERACTION ---------------- */

//   const handleCategoryClick = (category: string) => {
//     setSelectedCategory(selectedCategory === category ? null : category);
//   };

//   /* ---------------- RENDER ---------------- */

//   return (
//     <div
//       ref={navbarContainerRef}
//       className="fixed top-0 w-full h-full z-99 select-none"
//     >
//       <div
//         ref={navbarLogoContainerRef}
//         className="absolute top-0 left-0 w-full opacity-0 bg-background pt-8 pb-4 flex flex-col gap-5 h-16 lg:h-20"
//       >
//         <div className="uppercase text-sm mx-auto inline-flex items-center justify-center gap-20 max-lg:gap-12 max-md:hidden">
//           {categories.map((category, index) => (
//             <div
//               key={index}
//               onClick={() => handleCategoryClick(category)}
//               className={`cursor-pointer transition-colors duration-200 ${
//                 selectedCategory === category
//                   ? "text-black font-semibold"
//                   : "text-neutral-600 hover:text-black"
//               }`}
//             >
//               {category}
//             </div>
//           ))}
//         </div>
//       </div>

//       <h1 ref={navRef} className="absolute text-4xl max-lg:text-2xl font-bold">
//         LOGO
//       </h1>

//       {/* Hamburger menu */}
//       <div className="fixed top-0 right-0 w-20 h-16 flex items-end md:hidden">
//         <div className="mb-1.5 cursor-pointer">
//           <FontAwesomeIcon icon={faBars} size="xl" />
//         </div>
//         <div
//           ref={hamburgerMenuDimmedBgRef}
//           className="fixed top-16 bottom-0 w-full right-0 bg-black/10"
//         />
//         <div
//           ref={hamburgerMenuLinksContainerRef}
//           className="fixed right-0 bottom-0 top-16 w-100 bg-background flex flex-col gap-12 items-center py-10"
//         >
//           {categories.map((category, index) => (
//             <div
//               key={index}
//               onClick={() => handleCategoryClick(category)}
//               className={`text-lg cursor-pointer transition-colors duration-200 ${
//                 selectedCategory === category
//                   ? "text-black font-semibold"
//                   : "text-neutral-600 hover:text-black"
//               }`}
//             >
//               {category}
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Navbar;

// -------------------------------------- NEW -----------------------------------

"use client";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useRef, useState } from "react";
import { useArticles } from "@/context/ArticlesContext";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faXmark } from "@fortawesome/free-solid-svg-icons";

const Navbar = () => {
  const navbarContainerRef = useRef<HTMLDivElement>(null);
  const navbarLogoContainerRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLHeadingElement>(null);
  const hamburgerMenuDimmedBgRef = useRef<HTMLDivElement>(null);
  const hamburgerMenuLinksContainerRef = useRef<HTMLDivElement>(null);
  const hamburgerIconRef = useRef<HTMLDivElement>(null);

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const { categories, selectedCategory, setSelectedCategory } = useArticles();

  /* ---------------- RESPONSIVE CONFIG ---------------- */

  const navConfig = useRef<{
    from: gsap.TweenVars;
    to: gsap.TweenVars;
    height: number;
  }>({
    from: {},
    to: {},
    height: 80,
  });

  /* ---------------- MATCH MEDIA ---------------- */

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

  /* ---------------- ANIMATION ---------------- */

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

  /* ---------------- HAMBURGER MENU ANIMATION ---------------- */

  useGSAP(() => {
    // Set initial state - menu hidden
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
      // Opening animation
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
          "<"
        )
        .to(
          hamburgerMenuLinksContainerRef.current,
          {
            x: "0%",
            duration: 0.4,
            ease: "power2.out",
          },
          "<0.1"
        );
    } else {
      // Closing animation
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
          "<"
        )
        .to(
          hamburgerMenuDimmedBgRef.current,
          {
            autoAlpha: 0,
            pointerEvents: "none",
            duration: 0.3,
          },
          "<0.1"
        );
    }

    setIsMenuOpen(!isMenuOpen);
  };

  /* ---------------- INTERACTION ---------------- */

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(selectedCategory === category ? null : category);
    // Close menu on mobile after selection
    if (isMenuOpen) {
      toggleMenu();
    }
  };

  /* ---------------- RENDER ---------------- */

  return (
    <div
      ref={navbarContainerRef}
      className="fixed top-0 w-full h-full z-99 select-none"
    >
      <div
        ref={navbarLogoContainerRef}
        className="absolute top-0 left-0 w-full opacity-0 bg-background pt-8 pb-4 flex flex-col gap-5 h-16 lg:h-20"
      >
        <div className="uppercase text-sm mx-auto inline-flex items-center justify-center gap-20 max-lg:gap-12 max-md:hidden">
          {categories.map((category, index) => (
            <div
              key={index}
              onClick={() => handleCategoryClick(category)}
              className={`cursor-pointer transition-colors duration-200 ${
                selectedCategory === category
                  ? "text-black font-semibold"
                  : "text-neutral-600 hover:text-black"
              }`}
            >
              {category}
            </div>
          ))}
        </div>
      </div>

      <h1 ref={navRef} className="absolute text-4xl max-lg:text-2xl font-bold">
        LOGO
      </h1>

      {/* Hamburger menu */}
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
        className="fixed right-0 bottom-0 top-16 w-80 bg-background flex flex-col gap-8 items-center py-10 md:hidden shadow-lg"
      >
        {categories.map((category, index) => (
          <div
            key={index}
            onClick={() => handleCategoryClick(category)}
            className={`text-lg cursor-pointer transition-colors duration-200 ${
              selectedCategory === category
                ? "text-black font-semibold"
                : "text-neutral-600 hover:text-black"
            }`}
          >
            {category}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Navbar;
