"use client";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useRef } from "react";
import { useArticles } from "@/context/ArticlesContext";

const Navbar = () => {
  const navbarContainerRef = useRef<HTMLDivElement>(null);
  const navbarLogoContainerRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLHeadingElement>(null);

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

  /* ---------------- INTERACTION ---------------- */

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(selectedCategory === category ? null : category);
  };

  /* ---------------- RENDER ---------------- */

  return (
    <div
      ref={navbarContainerRef}
      className="fixed top-0 w-full h-full z-99 select-none"
    >
      <div
        ref={navbarLogoContainerRef}
        className="absolute top-0 left-0 w-full opacity-0 bg-background pt-8 pb-4 flex flex-col gap-5"
      >
        <div className="uppercase text-sm mx-auto inline-flex items-center justify-center gap-20 max-lg:gap-12">
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
    </div>
  );
};

export default Navbar;
