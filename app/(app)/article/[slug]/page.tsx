// import { RichText } from "@/components/RichText";
// import { getArticleFromSlug } from "@/lib/fetcher";
// import { ArticleAuthor, Category, Media } from "@/payload-types";
// import { faClock } from "@fortawesome/free-regular-svg-icons";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import Image from "next/image";

// type PageProps = {
//   params: {
//     slug: string;
//   };
// };

// const Page = async ({ params }: PageProps) => {
//   // ignore 'await' has no effect on the type of this expression. this only works with await.
//   const { slug } = await params;

//   const article = await getArticleFromSlug(slug);

//   const coverImage = article?.coverImage as Media;
//   const author = article?.author as ArticleAuthor;
//   const category = article?.category as Category;
//   const readTime = article?.readTimeInMins;

//   return (
//     <div className="h-full w-full pt-16">
//       <div className="h-full w-full pt-5 px-5">
//         <h1 className="text-2xl font-medium mb-5">{article?.title}</h1>
//         <div className="relative h-75 mb-5 ">
//           <Image
//             src={coverImage.url as string}
//             alt={slug}
//             // width={400}
//             // height={180}
//             className="object-cover"
//             fill
//           />
//         </div>
//         <div className="flex items-center gap-5">
//           <div className="w-10 h-10 bg-black rounded-full" />
//           <div className="flex flex-col text-neutral-600">
//             <span>{author?.name}</span>
//             <span className="uppercase font-semibold text-sm">
//               {category?.category}
//             </span>
//           </div>
//           <div className="text-neutral-600 text-sm ml-auto">
//             <div className="flex items-center gap-1.5">
//               <FontAwesomeIcon icon={faClock} />
//               <span>{readTime} mins</span>
//             </div>
//           </div>
//         </div>
//         <div className="mt-5 pb-20">
//           {article?.content && <RichText data={article?.content} />}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Page;

// ----------------------------------------------------------------------------------------------------------

import { getArticleFromSlug, getArticles, getCategories } from "@/lib/fetcher";
import { ArticlesProvider } from "@/context/ArticlesContext";
import Navbar from "@/components/Navbar";
import Articles from "@/components/Articles";
import MobileArticlePage from "@/components/MobileArticlePage"; // Import the component we just made

// 1. Generate Static Params for SEO (Optional but recommended)
export async function generateStaticParams() {
  const articles = await getArticles();
  return articles.map((article) => ({
    slug: article.slug,
  }));
}

type PageProps = {
  params: {
    slug: string;
  };
};

export default async function Page({ params }: PageProps) {
  const { slug } = await params;

  // 2. Fetch ALL data needed for both views in parallel
  const [currentArticle, allArticles, categories] = await Promise.all([
    getArticleFromSlug(slug), // Needed for Mobile View
    getArticles(), // Needed for Desktop List Background
    getCategories(), // Needed for Navbar
  ]);

  if (!currentArticle)
    return (
      <div className="h-full w-full flex items-center justify-center text-2xl font-semibold tracking-wide">
        Article not found
      </div>
    );

  return (
    <>
      <div className="hidden md:block h-full w-full">
        {/* 
            We initialize the provider with 'initialSlug'. 
            This tells the Desktop Layout to immediately expand 
            the card matching this slug without animation.
        */}
        <ArticlesProvider
          initialArticles={allArticles}
          initialCategories={categories}
          initialSlug={slug}
        >
          <Navbar />
          <Articles />
        </ArticlesProvider>
      </div>

      <div className="md:hidden h-full w-full">
        <MobileArticlePage article={currentArticle} />
      </div>
    </>
  );
}
