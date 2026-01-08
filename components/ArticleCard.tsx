"use client";

import Image from "next/image";
import { useState } from "react";
import "./ArticleCard.css";

export interface Article {
  id: string;
  title: string;
  content: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  cover: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  author: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  category: any;
  publishedAt: Date;
}

const SingleCard = ({
  article,
  strapiURL,
}: {
  article: Article;
  strapiURL: string;
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <article
      className={`bg-background relative select-none ${
        isExpanded ? "articleCardContainerEnlarged" : "articleCardContainer"
      }`}
      onClick={handleToggle}
    >
      <div className={`relative cursor-pointer w-full h-full max-w-275`}>
        <Image
          className="object-cover transition-all duration-500 ease-in-out select-none"
          src={strapiURL + article.cover.url}
          alt={article.title}
          fill
          priority
        />
        <div className="flex flex-col w-70 items-end absolute top-0 -left-85">
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
    </article>
  );
};

const ArticleCard = ({
  articles,
  strapiURL,
}: {
  articles: Article[];
  strapiURL: string;
}) => {
  return (
    <>
      {articles.map((article) => (
        <SingleCard key={article.id} article={article} strapiURL={strapiURL} />
      ))}
    </>
  );
};

export default ArticleCard;
