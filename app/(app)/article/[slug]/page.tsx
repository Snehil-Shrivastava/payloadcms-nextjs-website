import { getArticleFromSlug } from "@/lib/fetcher";

type PageProps = {
  params: {
    slug: string;
  };
};

const Page = async ({ params }: PageProps) => {
  // ignore 'await' has no effect on the type of this expression. this only works with await.
  const { slug } = await params;

  const article = await getArticleFromSlug(slug);

  return (
    <div className="h-full w-full flex items-center justify-center">
      <div>
        <h1 className="text-3xl font-semibold">{article?.title}</h1>
      </div>
    </div>
  );
};

export default Page;
