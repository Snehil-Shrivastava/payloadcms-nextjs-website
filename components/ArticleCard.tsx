"use client";

import Image from "next/image";
import "./ArticleCard.css";
import { useEffect, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { Flip } from "gsap/all";
import { Article, Media, Category, ArticleAuthor } from "@/payload-types";
import { useWindowSize } from "@/lib/useWindowSize";
import Link from "next/link";
import { useArticles } from "@/context/ArticlesContext";
import { RenderContentAsColumns } from "./RichTextRenderer";

gsap.registerPlugin(Flip);

/* ---------------- CONSTANTS ---------------- */
const COLLAPSED = { width: 680, height: 440 };

/* ---------------- SINGLE CARD ---------------- */
const SingleCard = ({ article }: { article: Article }) => {
  const mainRef = useRef<HTMLDivElement>(null);
  const overflowRef = useRef<HTMLDivElement>(null);
  const overflowLinkRef = useRef<HTMLAnchorElement>(null);
  const articleRef = useRef<HTMLDivElement>(null);
  const imageCardRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  const isAnimating = useRef(false);

  const { activeSlug, toggleArticle } = useArticles();
  const { width } = useWindowSize();

  const isActive = activeSlug === article.slug;

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

    mm.add("(min-width: 1024px) and (max-width: 1279px)", () => {
      expandedConfig.current = {
        main: { height: "450px", width: "80%", marginRight: 0 },
        article: { width: "23000px" },
        imageCard: { width: "65vw" },
        scrollAmount: 500,
      };
    });

    return () => mm.revert();
  }, []);

  useLayoutEffect(() => {
    if (width < 1024) return;

    const main = mainRef.current;
    const articleEl = articleRef.current;
    const imageCard = imageCardRef.current;
    const text = textRef.current;

    if (!main || !articleEl || !imageCard) return;

    const state = Flip.getState([main, articleEl, imageCard]);

    if (isActive) {
      const config = expandedConfig.current;
      gsap.set(main, config.main);
      gsap.set(articleEl, config.article);
      gsap.set(imageCard, config.imageCard);

      if (text) {
        gsap.set(text, { display: "flex", autoAlpha: 1 });
      }
    } else {
      gsap.set(main, { clearProps: "all" });
      gsap.set(articleEl, { clearProps: "all" });
      gsap.set(imageCard, { clearProps: "all" });

      if (text) {
        gsap.set(text, { display: "none", autoAlpha: 0 });
      }

      if (overflowRef.current) overflowRef.current.scrollLeft = 0;
    }

    Flip.from(state, {
      duration: 1.2,
      zIndex: 51,
      ease: "power2.inOut",
      onStart: () => {
        isAnimating.current = true;
      },
      onComplete: () => {
        isAnimating.current = false;
      },
    });
  }, [isActive, width]);

  const handleCardClick = () => {
    if (width < 1024) return;
    if (isAnimating.current) return;

    if (isActive && overflowRef.current && overflowRef.current.scrollLeft > 0) {
      isAnimating.current = true;
      gsap.to(overflowRef.current, {
        scrollLeft: 0,
        duration: 0.6,
        ease: "power2.inOut",
        onComplete: () => {
          isAnimating.current = false;
          toggleArticle(article.slug);
        },
      });
      return;
    }

    toggleArticle(article.slug);
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

  const coverImage = article.coverImage as Media;
  const author = article.author as ArticleAuthor;
  const category = article.category as Category;

  // Extract content from Lexical
  const contentBlocks = article?.content?.root?.children || [];

  return (
    <article
      onClick={handleCardClick}
      ref={mainRef}
      className="select-none w-170 lg:max-xl:w-120 max-lg:w-[90%] h-100 lg:max-xl:h-80 max-lg:h-auto ml-auto mr-auto relative mb-8 max-lg:mb-12"
    >
      <div className="absolute max-lg:static top-0 -left-85 1440p:max-2xl:-left-[19vw] xl:max-1440p:-left-[20vw] lg:max-xl:-left-[21vw] w-auto 1440p:max-2xl:w-[16vw] xl:max-1440p:w-[17vw] lg:max-xl:w-[18vw] max-lg:w-full max-lg:mb-5 flex items-end pointer-events-none">
        <div className="flex flex-col w-70 max-lg:w-full items-end max-lg:items-start lg:max-xl:gap-2 xl:max-1440p:gap-2">
          <div className="w-12 h-12 bg-black mb-3" />
          <h3 className="text-2xl lg:max-xl:text-lg xl:max-1440p:text-xl 1440p:max-2xl:text-xl font-medium text-gray-800 text-end max-md:text-start">
            {article.title}
          </h3>
          <span className="text-neutral-600 lg:max-xl:text-sm xl:max-1440p:text-base  1440p:max-2xl:text-base">
            {author?.name}
          </span>
          <span className="text-neutral-600 uppercase font-semibold lg:max-xl:text-sm xl:max-1440p:text-base  1440p:max-2xl:text-base">
            {category?.category}
          </span>
        </div>
      </div>

      {width >= 1024 ? (
        <div
          ref={overflowRef}
          className="w-full h-full max-lg:h-auto overflow-x-auto scrollbar-hide"
        >
          <div
            ref={articleRef}
            className="w-full h-full relative flex gap-15 max-lg:gap-10"
          >
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

            <div ref={textRef} className="opacity-0 hidden gap-10 shrink-0">
              <RenderContentAsColumns contentBlocks={contentBlocks} />
            </div>
          </div>

          {isActive && (
            <>
              <div
                onClick={(e) => scrollByAmount(1, e)}
                className="absolute right-0 lg:top-0 lg:bottom-0 max-lg:bottom-[10] w-55 max-lg:h-112.5 z-50 cursor-e-resize flex items-center justify-center group hover:bg-black/10 horizontal-scroll-btn"
              >
                <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity font-bold text-3xl">
                  →
                </span>
              </div>
              <div
                onClick={(e) => scrollByAmount(-1, e)}
                className="absolute left-0 lg:top-0 lg:bottom-0 max-lg:bottom-[10] w-55 max-lg:h-112.5 z-50 cursor-w-resize flex items-center justify-center group hover:bg-black/10 horizontal-scroll-btn"
              >
                <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity font-bold text-3xl">
                  ←
                </span>
              </div>
            </>
          )}
        </div>
      ) : (
        <Link
          ref={overflowLinkRef}
          className="w-full h-full max-lg:h-auto overflow-x-auto scrollbar-hide"
          href={`/article/${article.slug}`}
        >
          <div
            ref={articleRef}
            className="w-full h-full relative flex gap-15 max-lg:gap-10"
          >
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
          </div>
        </Link>
      )}
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
