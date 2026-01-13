"use client";

import Image from "next/image";
import "@/components/ArticleCard.css";

import { useRef, useState } from "react";
import gsap from "gsap";
import { Flip } from "gsap/all";
import { useArticles } from "@/context/ArticlesContext";

import dog from "@/public/dog-placeholder.jpg";
import { Article } from "@/context/ArticlesContext";

gsap.registerPlugin(Flip);

/* ---------------- CONSTANTS ---------------- */

const COLLAPSED = {
  width: 680,
  height: 440,
};

const EXPANDED = {
  outerWidth: 23000,
  height: 1100,
  innerWidth: 1400,
};

/* ---------------- SINGLE CARD ---------------- */

const SingleCard = ({
  article,
  strapiURL,
}: {
  article: Article;
  strapiURL: string;
}) => {
  const mainRef = useRef<HTMLDivElement>(null);
  const overflowRef = useRef<HTMLDivElement>(null);
  const outerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  const [isExpandedState, setIsExpandedState] = useState(false);
  const isExpanded = useRef(false);
  const isAnimating = useRef(false);

  const toggleAnimation = () => {
    // ... (Keep existing animation logic exactly the same) ...
    if (isAnimating.current) return;

    const main = mainRef.current;
    const overflow = overflowRef.current;
    const outer = outerRef.current;
    const inner = innerRef.current;
    const text = textRef.current;

    if (!main || !outer || !inner || !text) return;

    isAnimating.current = true;

    const state = Flip.getState([main, overflow, outer]);
    const tl = gsap.timeline({
      defaults: { ease: "power3.inOut" },
      onComplete: () => {
        isExpanded.current = !isExpanded.current;
        setIsExpandedState(isExpanded.current);
        isAnimating.current = false;
      },
    });

    if (!isExpanded.current) {
      // EXPAND
      gsap.set(outer, { width: EXPANDED.outerWidth, height: EXPANDED.height });
      gsap.set(main, { height: EXPANDED.height });
      gsap.set(overflow, { width: "60vw" });

      Flip.from(state, { duration: 1.5, zIndex: 51 });

      tl.to(
        inner,
        { width: EXPANDED.innerWidth, height: EXPANDED.height, duration: 1.6 },
        0
      )
        .set(text, { display: "flex" })
        .to(text, { autoAlpha: 1, duration: 0.4 });
    } else {
      // COLLAPSE
      tl.to(text, { autoAlpha: 0, duration: 0.2 }).set(text, {
        display: "none",
      });
      tl.to(inner, { width: COLLAPSED.width, height: COLLAPSED.height }, 0);
      gsap.set(outer, { width: "", height: "" });
      gsap.set(main, { height: "" });
      Flip.from(state, { duration: 1.5, zIndex: 51 });
    }
  };

  const handleScrollZoneClickRight = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (overflowRef.current) {
      overflowRef.current.scrollBy({ left: -500, behavior: "smooth" });
    }
  };
  const handleScrollZoneClickLeft = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (overflowRef.current) {
      overflowRef.current.scrollBy({ left: 500, behavior: "smooth" });
    }
  };

  return (
    <article
      ref={mainRef}
      onClick={toggleAnimation}
      className="relative select-none w-170 h-110 z-50 will-change-transform"
    >
      {/* Article Info Label */}
      <div className="absolute top-0 -left-85 w-70 flex items-end pointer-events-none">
        <div className="flex flex-col w-70 items-end">
          <div className="w-12 h-12 bg-black mb-3" />
          <h3 className="text-2xl font-medium text-gray-800 text-end">
            {article.title}
          </h3>
          <span className="text-neutral-600">{article.author.name}</span>
          <span className="text-neutral-600 uppercase font-semibold">
            {article.category.name}
          </span>
        </div>
      </div>

      <div className="relative w-[60vw]">
        <div
          ref={overflowRef}
          className="h-full overflow-x-auto overflow-y-hidden horizontal-scroll no-scrollbar relative"
        >
          <div ref={outerRef} className="relative left-0">
            <div className="relative cursor-pointer w-full h-full flex gap-20">
              <div
                ref={innerRef}
                className="w-170 h-110 shrink-0 overflow-hidden"
              >
                <Image
                  src={strapiURL + article.cover.url}
                  alt={article.title}
                  width={COLLAPSED.width}
                  height={COLLAPSED.height}
                  priority
                  className="w-full h-full object-cover"
                />
              </div>
              <div ref={textRef} className="opacity-0 hidden gap-20 flex-1">
                <p>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit...
                </p>
                <div>
                  <Image src={dog} alt="dog-placeholder" />
                </div>
              </div>
            </div>
          </div>
        </div>
        {isExpandedState && (
          <div
            onClick={handleScrollZoneClickLeft}
            className="absolute right-0 top-0 bottom-0 w-55 z-50 cursor-e-resize flex items-center justify-end pr-8 group"
          >
            <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity font-bold text-3xl">
              →
            </span>
          </div>
        )}
        {isExpandedState && (
          <div
            onClick={handleScrollZoneClickRight}
            className="absolute left-0 top-0 bottom-0 w-55 z-50 cursor-e-resize flex items-center justify-end pr-8 group"
          >
            <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity font-bold text-3xl">
              ←
            </span>
          </div>
        )}
      </div>
    </article>
  );
};

const ArticleCardPage = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);

  const { filteredArticles, strapiURL } = useArticles();
  return (
    <>
      <div ref={wrapperRef} id="smooth-wrapper" className="min-h-screen">
        <div ref={contentRef} id="smooth-content" className="p-6">
          <div className="w-full mx-auto py-20">
            <div
              ref={containerRef}
              className="grid grid-cols-1 gap-8 w-170 place-items-end relative left-1/2 -translate-x-1/2"
            >
              {filteredArticles.map((article) => (
                <SingleCard
                  key={article.id}
                  article={article}
                  strapiURL={strapiURL}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ArticleCardPage;
