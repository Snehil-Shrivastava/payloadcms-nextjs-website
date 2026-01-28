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
      <div className="hidden lg:block h-full w-full">
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

      <div className="lg:hidden h-full w-full">
        <MobileArticlePage article={currentArticle} />
      </div>
    </>
  );
}
