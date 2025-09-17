"use client";
import { Icon } from "@iconify/react";
import dynamic from "next/dynamic";

const TwitterTimeline = dynamic(
  () => import("react-twitter-embed").then((m) => m.TwitterTimelineEmbed),
  {
    ssr: false,
    loading: () => (
      <div
        aria-busy="true"
        className="bg-dark-900/40 rounded-lg w-full"
        style={{ height: 520 }}
      />
    ),
  }
);

export default function CommunitySection() {
  return (
    <div className="glass rounded-glass p-6 mb-12">
      <h2 className="text-3xl font-cyber text-center mb-6">
        Community & Updates
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Twitter/X Feed */}
        <div className="bg-dark-800 rounded-lg p-4">
          <TwitterTimeline
            sourceType="url"
            url="https://twitter.com/KoladeOlukoya/status/1938650520685564231"
            theme="dark"
            noHeader
            noFooter
            noBorders
            options={{ height: 520, width: "100%" }}
          />
        </div>

        {/* Social Links */}
        <div className="bg-dark-800 rounded-lg p-6 flex flex-col items-center justify-center gap-4">
          <p className="text-cyber-300 text-center">
            Join our community and get the latest updates
          </p>
          <div className="flex items-center gap-6">
            <a
              href="https://twitter.com/KoladeOlukoya"
              target="_blank"
              rel="noreferrer"
              aria-label="X"
              title="Follow on X"
              className="transition-transform hover:scale-110 hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.6)]"
            >
              <Icon icon="simple-icons:x" width={36} height={36} color="#fff" />
            </a>
            <a
              href="https://t.me/yourTelegram"
              target="_blank"
              rel="noreferrer"
              aria-label="Telegram"
              title="Join Telegram"
              className="transition-transform hover:scale-110 hover:drop-shadow-[0_0_10px_rgba(0,170,255,0.7)]"
            >
              <Icon
                icon="simple-icons:telegram"
                width={36}
                height={36}
                color="#fff"
              />
            </a>
            <a
              href="https://discord.gg/yourInvite"
              target="_blank"
              rel="noreferrer"
              aria-label="Discord"
              title="Join Discord"
              className="transition-transform hover:scale-110 hover:drop-shadow-[0_0_10px_rgba(114,137,218,0.7)]"
            >
              <Icon
                icon="simple-icons:discord"
                width={36}
                height={36}
                color="#fff"
              />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
