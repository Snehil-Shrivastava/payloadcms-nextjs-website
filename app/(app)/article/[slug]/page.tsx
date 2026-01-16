import { RichText } from "@/components/RichText";
import { getArticleFromSlug } from "@/lib/fetcher";
import { ArticleAuthor, Category, Media } from "@/payload-types";
import { faClock } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";

type PageProps = {
  params: {
    slug: string;
  };
};

const Page = async ({ params }: PageProps) => {
  // ignore 'await' has no effect on the type of this expression. this only works with await.
  const { slug } = await params;

  const article = await getArticleFromSlug(slug);

  const coverImage = article?.coverImage as Media;
  const author = article?.author as ArticleAuthor;
  const category = article?.category as Category;
  const readTime = article?.readTimeInMins;

  return (
    <div className="h-full w-full pt-16">
      <div className="h-full w-full pt-5 px-5">
        <h1 className="text-2xl font-medium mb-5">{article?.title}</h1>
        <Image
          src={coverImage.url as string}
          alt={slug}
          width={400}
          height={180}
          className="mb-5"
        />
        <div className="flex items-center gap-5">
          <div className="w-10 h-10 bg-black rounded-full" />
          <div className="flex flex-col text-neutral-600">
            <span>{author?.name}</span>
            <span className="uppercase font-semibold text-sm">
              {category?.category}
            </span>
          </div>
          <div className="text-neutral-600 text-sm ml-auto">
            <div className="flex items-center gap-1.5">
              <FontAwesomeIcon icon={faClock} />
              <span>{readTime} mins</span>
            </div>
          </div>
        </div>
        <div className="mt-5 pb-20">
          {article?.content && <RichText data={article?.content} />}
        </div>
      </div>
    </div>
  );
};

export default Page;
