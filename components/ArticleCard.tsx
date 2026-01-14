// "use client";

// import Image from "next/image";
// import "./ArticleCard.css";
// import { useRef, useState } from "react";
// import gsap from "gsap";
// import { Flip } from "gsap/all";
// import { Article, Media, Category, ArticleAuthor } from "@/payload-types";
// import { RichText } from "./RichText";

// gsap.registerPlugin(Flip);

// /* ---------------- CONSTANTS ---------------- */
// const COLLAPSED = { width: 680, height: 440 };
// const EXPANDED = { outerWidth: 23000, height: 1100, innerWidth: 1400 };

// /* ---------------- SINGLE CARD ---------------- */

// const SingleCard = ({ article }: { article: Article }) => {
//   const mainRef = useRef<HTMLDivElement>(null);
//   const overflowRef = useRef<HTMLDivElement>(null);
//   const outerRef = useRef<HTMLDivElement>(null);
//   const innerRef = useRef<HTMLDivElement>(null);
//   const textRef = useRef<HTMLDivElement>(null);

//   const [isExpandedState, setIsExpandedState] = useState(false);
//   const isExpanded = useRef(false);
//   const isAnimating = useRef(false);

//   const coverImage = article.coverImage as Media;
//   const author = article.author as ArticleAuthor;
//   const category = article.category as Category;

//   const toggleAnimation = () => {
//     if (isAnimating.current) return;
//     const main = mainRef.current;
//     const overflow = overflowRef.current;
//     const outer = outerRef.current;
//     const inner = innerRef.current;
//     const text = textRef.current;

//     if (!main || !outer || !inner || !text) return;

//     isAnimating.current = true;

//     const state = Flip.getState([main, overflow, outer]);
//     const tl = gsap.timeline({
//       defaults: { ease: "power3.inOut" },
//       onComplete: () => {
//         isExpanded.current = !isExpanded.current;
//         setIsExpandedState(isExpanded.current);
//         isAnimating.current = false;
//       },
//     });

//     if (!isExpanded.current) {
//       gsap.set(outer, { width: EXPANDED.outerWidth, height: EXPANDED.height });
//       gsap.set(main, { height: EXPANDED.height });
//       gsap.set(overflow, { width: "60vw" });

//       Flip.from(state, { duration: 1.5, zIndex: 51 });

//       tl.to(
//         inner,
//         { width: EXPANDED.innerWidth, height: EXPANDED.height, duration: 1.6 },
//         0
//       )
//         .set(text, { display: "flex" })
//         .to(text, { autoAlpha: 1, duration: 0.4 });
//     } else {
//       tl.to(text, { autoAlpha: 0, duration: 0.2 }).set(text, {
//         display: "none",
//       });
//       tl.to(inner, { width: COLLAPSED.width, height: COLLAPSED.height }, 0);
//       gsap.set(outer, { width: "", height: "" });
//       gsap.set(main, { height: "" });
//       Flip.from(state, { duration: 1.5, zIndex: 51 });
//     }
//   };

//   const handleScrollZoneClickRight = (e: React.MouseEvent) => {
//     e.stopPropagation();
//     if (overflowRef.current)
//       overflowRef.current.scrollBy({ left: -500, behavior: "smooth" });
//   };
//   const handleScrollZoneClickLeft = (e: React.MouseEvent) => {
//     e.stopPropagation();
//     if (overflowRef.current)
//       overflowRef.current.scrollBy({ left: 500, behavior: "smooth" });
//   };

//   return (
//     <article
//       ref={mainRef}
//       onClick={toggleAnimation}
//       className="relative select-none w-170 h-110 z-50 will-change-transform"
//     >
//       {/* Article Info Label */}
//       <div className="absolute top-0 -left-85 w-70 flex items-end pointer-events-none">
//         <div className="flex flex-col w-70 items-end">
//           <div className="w-12 h-12 bg-black mb-3" />
//           <h3 className="text-2xl font-medium text-gray-800 text-end">
//             {article.title}
//           </h3>
//           <span className="text-neutral-600">{author?.name}</span>
//           <span className="text-neutral-600 uppercase font-semibold">
//             {category?.category}
//           </span>
//         </div>
//       </div>

//       <div className="relative w-[60vw]">
//         <div
//           ref={overflowRef}
//           className="h-full overflow-x-auto overflow-y-hidden horizontal-scroll no-scrollbar relative"
//         >
//           <div ref={outerRef} className="relative left-0">
//             <div className="relative cursor-pointer w-full h-full flex gap-20">
//               <div
//                 ref={innerRef}
//                 className="w-170 h-110 shrink-0 overflow-hidden"
//               >
//                 {coverImage?.url && (
//                   <Image
//                     src={coverImage.url}
//                     alt={article.title}
//                     width={COLLAPSED.width}
//                     height={COLLAPSED.height}
//                     priority
//                     className="w-full h-full object-cover"
//                   />
//                 )}
//               </div>
//               <div ref={textRef} className="opacity-0 hidden gap-20 flex-1">
//                 <div className="w-180">
//                   <RichText data={article.content} />
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {isExpandedState && (
//           <div
//             onClick={handleScrollZoneClickLeft}
//             className="absolute right-0 top-0 bottom-0 w-55 z-50 cursor-e-resize flex items-center justify-end pr-8 group"
//           >
//             <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity font-bold text-3xl">
//               →
//             </span>
//           </div>
//         )}
//         {isExpandedState && (
//           <div
//             onClick={handleScrollZoneClickRight}
//             className="absolute left-0 top-0 bottom-0 w-55 z-50 cursor-e-resize flex items-center justify-end pr-8 group"
//           >
//             <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity font-bold text-3xl">
//               ←
//             </span>
//           </div>
//         )}
//       </div>
//     </article>
//   );
// };

// /* ---------------- LIST ---------------- */

// const ArticleCard = ({ articles }: { articles: Article[] }) => {
//   return articles.map((article) => (
//     <SingleCard key={article.id} article={article} />
//   ));
// };

// export default ArticleCard;

// --------------------------- CHANGING ANIMATION -----------------------------

"use client";

import Image from "next/image";
import "./ArticleCard.css";
import { useRef, useState } from "react";
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

  const [isExpandedState, setIsExpandedState] = useState(false);

  const isExpanded = useRef(false);
  const expansionState = useRef(0);
  const isAnimating = useRef(false);

  const coverImage = article.coverImage as Media;
  const author = article.author as ArticleAuthor;
  const category = article.category as Category;

  const toggleAnimationNew = () => {
    if (isAnimating.current) return;

    const main = mainRef.current;
    const article = articleRef.current;
    const imageCard = imageCardRef.current;
    const text = textRef.current;

    isAnimating.current = true;

    const state = Flip.getState([main, article, imageCard]);

    // Cycle through 4 states: 0 (collapsed), 1 (first expansion), 2 (second expansion), 3 (back to first)
    if (!expansionState.current) {
      expansionState.current = 0;
    }

    expansionState.current = (expansionState.current + 1) % 4;

    const tl = gsap.timeline({
      onComplete: () => {
        isAnimating.current = false;
        // Update isExpanded state based on whether we're in an expanded state or not
        isExpanded.current = expansionState.current !== 0;
        setIsExpandedState(isExpanded.current);
      },
    });

    switch (expansionState.current) {
      case 0: // Collapsed (original state)
        tl.to(text, { autoAlpha: 0, duration: 0.2 }).set(text, {
          display: "none",
        });

        gsap.set(main, { height: "", width: "", marginRight: "" });
        gsap.set(article, { width: "", scrollLeft: 0 }); // Reset scroll position
        gsap.set(imageCard, { width: "" });
        break;

      case 1: // First expansion
        gsap.set(main, { height: "800px", width: "80%", marginRight: 0 });
        gsap.set(article, { width: "23000px" });
        gsap.set(imageCard, { width: "1000px" });

        tl.set(text, { display: "flex" }).to(text, {
          autoAlpha: 1,
          duration: 0.4,
        });
        break;

      case 2: // Second expansion (further expanded)
        gsap.set(main, { height: "1100px", width: "85%", marginRight: 0 });
        gsap.set(imageCard, { width: "1200px" });
        break;

      case 3: // Back to first expansion
        gsap.set(main, { height: "800px", width: "80%", marginRight: 0 });
        gsap.set(article, { width: "23000px" });
        gsap.set(imageCard, { width: "1000px" });
        break;
    }

    Flip.from(state, {
      duration: 1.2,
      zIndex: 51,
      ease: "power2.inOut",
    });
  };

  const handleScrollZoneClickLeft = (e: React.MouseEvent) => {
    e.stopPropagation();

    const overflow = overflowRef.current;
    if (!overflow) return;

    const scrollAmount = 800; // Adjust this value for how far to scroll

    gsap.to(overflow, {
      scrollLeft: overflow.scrollLeft + scrollAmount,
      duration: 0.8,
      ease: "power2.out",
    });
  };

  const handleScrollZoneClickRight = (e: React.MouseEvent) => {
    e.stopPropagation();

    const overflow = overflowRef.current;
    if (!overflow) return;

    const scrollAmount = 800; // Adjust this value for how far to scroll

    gsap.to(overflow, {
      scrollLeft: overflow.scrollLeft - scrollAmount,
      duration: 0.8,
      ease: "power2.out",
    });
  };

  return (
    <article
      onClick={toggleAnimationNew}
      ref={mainRef}
      className="select-none w-170 h-100 ml-auto mr-auto relative"
    >
      <div className="absolute top-0 -left-85 w-70 flex items-end pointer-events-none">
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
              <div key={index} className="w-180">
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
            className="absolute left-0 top-0 bottom-0 w-55 z-50 cursor-w-resize flex items-center justify-start pl-8 group"
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
