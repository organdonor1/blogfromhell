"use client";

import React from "react";
import {
  Button,
  Typography,
  Tabs,
  TabsHeader,
  Tab,
} from "@material-tailwind/react";
import { ArrowSmallDownIcon } from "@heroicons/react/24/solid";
import BlogPostCard from "@/components/blog-post-card";


const POSTS = [
  {
    img: `/image/blogs/blog2.svg`,
    category: "News",
    tag: "Breaking",
    title: "Major Policy Changes Announced This Week",
    desc: "Significant policy updates that will affect millions of people across the country. Experts weigh in on the implications and what to expect in the coming months.",
    date: "10 September 2022",
    author: {
      img: `/image/avatar1.jpg`,
      name: "Ryan Samuel",
    },
  },
  {
    img: `/image/blogs/blog6.svg`,
    category: "Fiction",
    tag: "Short Story",
    title: "The Midnight Library",
    desc: "In a small town where time seems to stand still, a mysterious library appears only at midnight. Those who enter discover books that tell stories of lives they never lived.",
    date: "12 September 2022",
    author: {
      img: `/image/blogs/blog2.svg`,
      name: "Nora Hazel",
    },
  },
  {
    img: `/image/blogs/blog3.svg`,
    category: "News",
    tag: "Technology",
    title: "Revolutionary Tech Breakthrough Announced",
    desc: "Scientists have made a groundbreaking discovery that could change the way we interact with technology. Industry leaders are calling it a game-changer.",
    date: "16 September 2022",
    author: {
      img: `/image/avatar2.jpg`,
      name: "Otto Gonzalez",
    },
  },
  {
    img: `/image/blogs/blog4.svg`,
    category: "Fiction",
    tag: "Fantasy",
    title: "The Last Guardian of the Realm",
    desc: "In a world where magic has been fading for centuries, a young guardian discovers an ancient power that could restore balance—or destroy everything.",
    date: "18 September 2022",
    author: {
      img: `/image/avatar3.jpg`,
      name: "Ryan Samuel",
    },
  },
  {
    img: `/image/blogs/blog5.svg`,
    category: "News",
    tag: "Science",
    title: "New Discovery in Space Exploration",
    desc: "Astronomers have identified a potentially habitable planet in a nearby star system. This could be the most significant finding in decades of space research.",
    date: "20 September 2022",
    author: {
      img: `/image/avatar3.jpg`,
      name: "Ryan Samuel",
    },
  },
  {
    img: `/image/blogs/blog6.svg`,
    category: "Fiction",
    tag: "Mystery",
    title: "The Vanishing Hour",
    desc: "Every day at exactly 3:47 PM, someone disappears from the small coastal town. Detective Morgan is determined to find the pattern before it's too late.",
    date: "22 September 2022",
    author: {
      img: `/image/avatar2.jpg`,
      name: "Nora Hazel",
    },
  },
];

export function Posts() {
  const [activeTab, setActiveTab] = React.useState("all");

  const filteredPosts = React.useMemo(() => {
    if (activeTab === "all") return POSTS;
    return POSTS.filter((post) => post.category.toLowerCase() === activeTab);
  }, [activeTab]);

  return (
    <section id="posts" className="grid min-h-screen place-items-center p-8">
      <Tabs value={activeTab} className="mx-auto max-w-7xl w-full mb-16">
        <div className="w-full flex mb-8 flex-col items-center">
          <TabsHeader 
            className="h-10 !w-12/12 md:w-[50rem] border border-white/25 bg-opacity-90"
            indicatorProps={{
              className: "bg-gray-900 shadow-none",
            }}
          >
            <Tab 
              value="all"
              onClick={() => setActiveTab("all")}
              className={activeTab === "all" ? "text-gray-900" : ""}
            >
              All
            </Tab>
            <Tab 
              value="news"
              onClick={() => setActiveTab("news")}
              className={activeTab === "news" ? "text-gray-900" : ""}
            >
              News
            </Tab>
            <Tab 
              value="fiction"
              onClick={() => setActiveTab("fiction")}
              className={activeTab === "fiction" ? "text-gray-900" : ""}
            >
              Fiction
            </Tab>
          </TabsHeader>
        </div>
      </Tabs>
      <Typography variant="h6" className="mb-2">
        Latest Blog Posts
      </Typography>
      <Typography variant="h1" className="mb-2">
        {activeTab === "all" ? "All Posts" : activeTab === "news" ? "News" : "Fiction"}
      </Typography>
      <Typography
        variant="lead"
        color="gray"
        className="max-w-3xl mb-36 text-center text-gray-500"
      >
        {activeTab === "all" 
          ? "Explore our latest news articles and captivating fiction stories."
          : activeTab === "news"
          ? "Stay informed with the latest news, updates, and breaking stories from around the world."
          : "Immerse yourself in our collection of fiction stories, from mystery to fantasy and beyond."}
      </Typography>
      <div className="container my-auto grid grid-cols-1 gap-x-8 gap-y-16 items-start lg:grid-cols-3">
        {filteredPosts.map(({ img, tag, title, desc, date, author }) => (
          <BlogPostCard
            key={title}
            img={img}
            tag={tag}
            title={title}
            desc={desc}
            date={date}
            author={{
              img: author.img,
              name: author.name,
            }}
          />
        ))}
      </div>
      <Button
        variant="text"
        size="lg"
        color="gray"
        className="flex items-center gap-2 mt-24"
      >
        <ArrowSmallDownIcon className="h-5 w-5 font-bold text-gray-900" />
        VIEW MORE
      </Button>
    </section>
  );
}

export default Posts;
