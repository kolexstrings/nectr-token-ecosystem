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
  // Duplicate once to create a seamless loop
  const loop = [...items, ...items];

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
                src={item.image}
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
