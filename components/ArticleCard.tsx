"use client";

import Image from "next/image";
import "./ArticleCard.css";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { Flip } from "gsap/all";
import { Article, Media, Category, ArticleAuthor } from "@/payload-types";
gsap.registerPlugin(Flip);

/* ---------------- CONSTANTS ---------------- */
const COLLAPSED = { width: 680, height: 440 };

/* ---------------- SINGLE CARD ---------------- */
const SingleCard = ({ article }: { article: Article }) => {
  const mainRef = useRef<HTMLDivElement>(null);
  const overflowRef = useRef<HTMLDivElement>(null);
  const articleRef = useRef<HTMLDivElement>(null);
  const imageCardRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  const isExpanded = useRef(false);
  const isAnimating = useRef(false);
  const [isExpandedState, setIsExpandedState] = useState(false);

  const expandedConfig = useRef<{
    main: gsap.TweenVars;
    article: gsap.TweenVars;
    imageCard: gsap.TweenVars;
    scrollAmount: number;
  }>({
    main: {},
    article: {},
    imageCard: {},
    scrollAmount: 800,
  });

  useEffect(() => {
    const mm = gsap.matchMedia();

    mm.add("(min-width: 2240px)", () => {
      expandedConfig.current = {
        main: { height: "85vh", width: "85%", marginRight: 0 },
        article: { width: "23000px" },
        imageCard: { width: "47vw" },
        scrollAmount: 800,
      };
    });

    mm.add("(min-width: 1920px) and (max-width: 2240px)", () => {
      expandedConfig.current = {
        main: { height: "85vh", width: "85%", marginRight: 0 },
        article: { width: "23000px" },
        imageCard: { width: "52vw" },
        scrollAmount: 800,
      };
    });

    mm.add("(min-width: 1536px) and (max-width: 1920px)", () => {
      expandedConfig.current = {
        main: { height: "85vh", width: "80%", marginRight: 0 },
        article: { width: "23000px" },
        imageCard: { width: "60vw" },
        scrollAmount: 800,
      };
    });

    mm.add("(min-width: 1440px) and (max-width: 1536px)", () => {
      expandedConfig.current = {
        main: { height: "85vh", width: "80%", marginRight: 0 },
        article: { width: "23000px" },
        imageCard: { width: "65vw" },
        scrollAmount: 800,
      };
    });

    mm.add("(min-width: 1280px) and (max-width: 1440px)", () => {
      expandedConfig.current = {
        main: { height: "85vh", width: "80%", marginRight: 0 },
        article: { width: "23000px" },
        imageCard: { width: "65vw" },
        scrollAmount: 800,
      };
    });

    mm.add("(min-width: 1024px) and (max-width: 1280px)", () => {
      expandedConfig.current = {
        main: { height: "450px", width: "80%", marginRight: 0 },
        article: { width: "23000px" },
        imageCard: { width: "65vw" },
        scrollAmount: 500,
      };
    });

    return () => mm.revert();
  }, []);

  const toggleAnimationNew = () => {
    if (isAnimating.current) return;

    const main = mainRef.current;
    const article = articleRef.current;
    const imageCard = imageCardRef.current;
    const text = textRef.current;
    const overflow = overflowRef.current;

    if (!main || !article || !imageCard) return;

    if (isExpanded.current && overflow && overflow.scrollLeft > 0) {
      isAnimating.current = true; // Lock interactions

      // Animate the scroll back to 0 first
      gsap.to(overflow, {
        scrollLeft: 0,
        duration: 0.6, // Adjust speed of scroll back
        ease: "power2.inOut",
        onComplete: () => {
          isAnimating.current = false; // Unlock
          // Recursively call this function.
          // Since scrollLeft is now 0, it will skip this if-block and proceed to Collapse logic below.
          toggleAnimationNew();
        },
      });
      return; // Stop execution here, wait for scroll to finish
    }

    isAnimating.current = true;

    const state = Flip.getState([main, article, imageCard]);

    isExpanded.current = !isExpanded.current;

    const tl = gsap.timeline({
      onComplete: () => {
        isAnimating.current = false;
        setIsExpandedState(isExpanded.current);
      },
    });

    if (isExpanded.current) {
      const config = expandedConfig.current;

      // Expand
      gsap.set(main, config.main);
      gsap.set(article, config.article);
      gsap.set(imageCard, config.imageCard);

      tl.set(text, { display: "flex" }).to(text, {
        autoAlpha: 1,
        duration: 0.4,
      });
    } else {
      // Collapse
      tl.to(text, { autoAlpha: 0, duration: 0.2 }).set(text, {
        display: "none",
      });

      gsap.set(main, { clearProps: "all" });
      gsap.set(article, { clearProps: "all" });
      gsap.set(imageCard, { clearProps: "all" });
      if (overflow) gsap.set(overflow, { scrollLeft: 0 });
    }

    Flip.from(state, {
      duration: 1.2,
      zIndex: 51,
      ease: "power2.inOut",
    });
  };

  const scrollByAmount = (direction: 1 | -1, e: React.MouseEvent) => {
    e.stopPropagation();

    const overflow = overflowRef.current;
    if (!overflow) return;

    gsap.to(overflow, {
      scrollLeft:
        overflow.scrollLeft + expandedConfig.current.scrollAmount * direction,
      duration: 0.8,
      ease: "power2.out",
    });
  };

  // const handleScrollZoneClickLeft = (e: React.MouseEvent) => {
  //   e.stopPropagation();

  //   const overflow = overflowRef.current;
  //   if (!overflow) return;

  //   const scrollAmount = 800; // Adjust this value for how far to scroll

  //   gsap.to(overflow, {
  //     scrollLeft: overflow.scrollLeft + scrollAmount,
  //     duration: 0.8,
  //     ease: "power2.out",
  //   });
  // };

  // const handleScrollZoneClickRight = (e: React.MouseEvent) => {
  //   e.stopPropagation();

  //   const overflow = overflowRef.current;
  //   if (!overflow) return;

  //   const scrollAmount = 800; // Adjust this value for how far to scroll

  //   gsap.to(overflow, {
  //     scrollLeft: overflow.scrollLeft - scrollAmount,
  //     duration: 0.8,
  //     ease: "power2.out",
  //   });
  // };

  const coverImage = article.coverImage as Media;
  const author = article.author as ArticleAuthor;
  const category = article.category as Category;

  return (
    <article
      onClick={toggleAnimationNew}
      ref={mainRef}
      className="select-none w-170 lg:max-xl:w-120 h-100 lg:max-xl:h-80 ml-auto mr-auto relative mb-8"
    >
      <div className="absolute top-0 -left-[13.4vw] 1440p:max-2xl:-left-[19vw] xl:max-1440p:-left-[18vw] lg:max-xl:-left-[18vw] w-[11vw] 1440p:max-2xl:w-[16vw] xl:max-1440p:w-[15vw] lg:max-xl:w-[15vw] flex items-end pointer-events-none">
        <div className="flex flex-col w-70 items-end">
          <div className="w-12 h-12 bg-black mb-3" />
          <h3 className="text-2xl font-medium text-gray-800 text-end">
            {article.title}
          </h3>
          <span className="text-neutral-600">{author?.name}</span>
          <span className="text-neutral-600 uppercase font-semibold">
            {category?.category}
          </span>
        </div>
      </div>
      <div
        ref={overflowRef}
        className="w-full h-full overflow-x-auto scrollbar-hide"
      >
        <div ref={articleRef} className="w-full h-full relative flex gap-15">
          <div ref={imageCardRef} className="h-full w-full shrink-0">
            {coverImage?.url && (
              <Image
                src={coverImage.url}
                alt={article.title}
                width={COLLAPSED.width}
                height={COLLAPSED.height}
                priority
                className="w-full h-full object-cover"
              />
            )}
          </div>

          {/* This is the method i found works best to display the content in the manner i want. */}
          <div ref={textRef} className="opacity-0 hidden gap-10 shrink-0">
            {article.content.root.children.map((articleContent, index) => (
              <div key={index} className="w-180 max-xl:w-120">
                {/* @ts-expect-error random */}
                {articleContent.children.map((text, i) => (
                  <div key={i}>{text.text}</div>
                ))}
              </div>
            ))}
            <div className="w-180"></div>
          </div>
        </div>

        {isExpandedState && (
          <div
            onClick={(e) => scrollByAmount(1, e)}
            className="absolute right-0 top-0 bottom-0 w-55 z-50 cursor-e-resize flex items-center justify-center group hover:bg-black/10"
          >
            <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity font-bold text-3xl">
              →
            </span>
          </div>
        )}
        {isExpandedState && (
          <div
            onClick={(e) => scrollByAmount(-1, e)}
            className="absolute left-0 top-0 bottom-0 w-55 z-50 cursor-w-resize flex items-center justify-center group hover:bg-black/10"
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

/* ---------------- LIST ---------------- */

const ArticleCard = ({ articles }: { articles: Article[] }) => {
  return articles.map((article) => (
    <SingleCard key={article.id} article={article} />
  ));
};

export default ArticleCard;
