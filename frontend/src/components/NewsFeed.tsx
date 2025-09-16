import React from "react";
import newsData from "../data/news.json";

export default function NewsFeed() {
  return (
    <section className="my-16 overflow-hidden bg-dark-800 py-6">
      <h2 className="text-2xl font-bold mb-4 text-center">Latest News</h2>
      <div className="relative w-full overflow-hidden">
        <div className="flex animate-marquee">
          {newsData.concat(newsData).map((item, i) => (
            <a
              key={i}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-shrink-0 w-64 mx-4 bg-dark-900 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
            >
              <img
                src={item.image}
                alt={item.title}
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
