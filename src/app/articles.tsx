"use client";

import React from "react";
import ArticleCard from "@/components/article-card";

const ARTICLES = [
  {
    img: "/image/blogs/blog-1.png",
    title: "Understanding Global Economic Trends",
    desc: "An in-depth analysis of current economic patterns and what they mean for the future of international markets and trade.",
  },
  {
    img: "/image/blogs/blog-2.png",
    title: "The Art of Storytelling in Modern Fiction",
    desc: "Explore how contemporary authors are reshaping narrative structures and pushing the boundaries of traditional storytelling.",
  },
  {
    img: "/image/blogs/blog-3.png",
    title: "Climate Change: The Latest Research",
    desc: "Scientists share groundbreaking findings about climate patterns and what communities can do to prepare for the future.",
  },
];

export function Articles() {
  return (
    <section className="container mx-auto px-8 py-20">
      <h1 className="mx-auto w-full text-[30px] lg:text-[48px] font-bold leading-[45px] lg:leading-[60px] lg:max-w-2xl">
        Other articles.
      </h1>

      <p className="my-2 w-full font-normal !text-gray-500 lg:w-5/12">
        Discover more articles covering news, fiction, and everything in between. Stay updated with our latest content.
      </p>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {ARTICLES.map((props, idx) => (
          <ArticleCard key={idx} {...props} />
        ))}
      </div>
    </section>
  );
}
export default Articles;
