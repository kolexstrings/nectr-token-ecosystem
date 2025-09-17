"use client";
import { Icon } from "@iconify/react";
import { useEffect, useRef } from "react";

export default function CommunitySection() {
  const twContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mountTimeline = () => {
      const tw = (window as any)?.twttr;
      const target = twContainerRef.current;
      if (!target) return;
      const tryCreate = () => {
        if (!tw || !tw.widgets) return;
        target.innerHTML = "";
        tw.widgets
          .createTimeline(
            { sourceType: "profile", screenName: "KoladeOlukoya" },
            target,
            {
              theme: "dark",
              chrome: "noheader nofooter noborders transparent",
              height: 520,
              width: "100%",
            }
          )
          .catch(() => {});
      };
      if (tw?.ready) {
        tw.ready(() => tryCreate());
      } else {
        tryCreate();
      }
    };

    if ((window as any)?.twttr) {
      mountTimeline();
    } else {
      // Fallback loader if the script hasn't been attached yet
      const id = "twitter-wjs";
      if (!document.getElementById(id)) {
        const s = document.createElement("script");
        s.id = id;
        s.src = "https://platform.twitter.com/widgets.js";
        s.async = true;
        s.onload = () => {
          const tw = (window as any)?.twttr;
          if (tw?.ready) tw.ready(() => mountTimeline());
          else mountTimeline();
        };
        document.body.appendChild(s);
      }
    }
    const id = "twitter-wjs";
    // No cleanup needed; widget tears down with DOM
  }, []);

  return (
    <div className="glass rounded-glass p-6 mb-12">
      <h2 className="text-3xl font-cyber text-center mb-6">
        Community & Updates
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Twitter/X Feed */}
        <div className="bg-dark-800 rounded-lg p-4" ref={twContainerRef} />

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
