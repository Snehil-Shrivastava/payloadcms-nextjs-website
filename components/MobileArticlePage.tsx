import { Article, ArticleAuthor, Category, Media } from "@/payload-types";
import { faClock } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import { RenderLexicalContent } from "./RichTextRenderer";

const MobileArticlePage = ({ article }: { article: Article }) => {
  const coverImage = article?.coverImage as Media;
  const author = article?.author as ArticleAuthor;
  const category = article?.category as Category;
  const readTime = article?.readTimeInMins;

  return (
    <div className="h-full w-full pt-16">
      <div className="h-full w-full pt-5 px-5">
        <h1 className="text-2xl font-medium mb-5">{article?.title}</h1>
        <div className="relative h-75 mb-5 ">
          {coverImage?.url && (
            <Image
              src={coverImage.url}
              alt={article.title}
              // width={400}
              // height={180}
              className="object-cover"
              fill
            />
          )}
        </div>
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
          {/* {article?.content && <RichText data={article?.content} />} */}

          <RenderLexicalContent
            nodes={article?.content?.root?.children || []}
          />
        </div>
      </div>
    </div>
  );
};

export default MobileArticlePage;
