import React from "react";
import newsData from "../data/news.json";
import Image from "next/image";

type NewsItem = {
  title: string;
  url: string;
  image: string;
  category: string;
  date: string;
};

export default function NewsFeed() {
  const items = newsData as NewsItem[];
  const loop = [...items, ...items];

  const getLocalImage = (item: NewsItem) => {
    const t = `${item.title} ${item.category}`.toLowerCase();
    if (t.includes("polygon")) return "/images/polygon.jpg";
    if (t.includes("nectr") || t.includes("stake")) return "/images/nectr.jpg";
    if (t.includes("bee") || t.includes("pollinator") || t.includes("global"))
      return "/images/global.jpg";
    if (t.includes("blockchain")) return "/images/blockchain.jpg";
    return "/images/blockchain.jpg";
  };

  return (
    <section className="my-16 overflow-hidden py-6">
      <h2 className="text-2xl font-bold mb-4 text-center">Latest News</h2>
      <div className="marquee w-full">
        <div className="marquee__track">
          {loop.map((item, i) => (
            <a
              key={i}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-shrink-0 w-64 mx-4 bg-dark-900 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
            >
              <Image
                src={getLocalImage(item)}
                alt={item.title}
                width={256}
                height={128}
                className="w-full h-32 object-cover"
              />
              <div className="p-3">
                <span className="text-xs text-yellow-400">{item.category}</span>
                <h3 className="font-semibold text-sm mt-1">{item.title}</h3>
                <p className="text-[10px] text-gray-400">
                  {new Date(item.date).toLocaleDateString()}
                </p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
