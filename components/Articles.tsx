"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import ArticleCard from "@/components/ArticleCard";
import { useArticles } from "@/context/ArticlesContext";
// import ArticleCardPage from "@/app/(app)/articles/page";

gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

const Article = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const scrollTimeout = useRef<NodeJS.Timeout | null>(null);

  // const { filteredArticles, strapiURL } = useArticles();
  const { filteredArticles } = useArticles();

  useEffect(() => {
    const smoother = ScrollSmoother.create({
      wrapper: "#smooth-wrapper",
      content: "#smooth-content",
      smooth: 1.7,
      // effects: true,
    });

    const handleScroll = () => {
      if (containerRef.current) {
        gsap.to(containerRef.current, {
          scale: 0.9,
          duration: 1.5,
          ease: "power2.out",
        });

        if (scrollTimeout.current) {
          clearTimeout(scrollTimeout.current);
        }

        scrollTimeout.current = setTimeout(() => {
          if (containerRef.current) {
            gsap.to(containerRef.current, {
              scale: 1,
              duration: 1.5,
              ease: "power2.out",
            });
          }
        }, 150);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }
      if (smoother) {
        smoother.kill();
      }
    };
  }, []);

  return (
    <div ref={wrapperRef} id="smooth-wrapper" className="min-h-screen">
      <div ref={contentRef} id="smooth-content" className="p-6">
        <div className="w-full mx-auto py-20">
          {/* <div
            ref={containerRef}
            className="grid grid-cols-1 gap-8 origin-center will-change-transform w-full mx-auto place-items-center"
          >
            <ArticleCard articles={filteredArticles} />
          </div> */}
          {/* <div
            ref={containerRef}
            className="grid grid-cols-1 gap-8 auto-rows-min"
          > */}
          <div ref={containerRef}>
            <ArticleCard articles={filteredArticles} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Article;
