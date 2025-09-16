import { Icon } from "@iconify/react";

export default function CommunitySection() {
  return (
    <div className="glass rounded-glass p-6 mb-12">
      <h2 className="text-3xl font-cyber text-center mb-6">
        Community & Updates
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-dark-800 rounded-lg p-4">
          <a
            className="twitter-timeline"
            data-theme="dark"
            data-chrome="noheader nofooter noborders transparent"
            data-height="520"
            href="https://twitter.com/yourhandle"
          >
            Tweets by @yourhandle
          </a>
        </div>

        <div className="bg-dark-800 rounded-lg p-6 flex flex-col items-center justify-center gap-4">
          <p className="text-cyber-300 text-center">
            Join our community and get the latest updates
          </p>
          <div className="flex items-center gap-6">
            <a
              href="https://twitter.com/yourhandle"
              target="_blank"
              rel="noreferrer"
              aria-label="X"
              className="transition-transform hover:scale-110 hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.6)]"
              title="Follow on X"
            >
              <Icon
                icon="simple-icons:x"
                width={36}
                height={36}
                color="#ffffff"
              />
            </a>
            <a
              href="https://t.me/yourTelegram"
              target="_blank"
              rel="noreferrer"
              aria-label="Telegram"
              className="transition-transform hover:scale-110 hover:drop-shadow-[0_0_10px_rgba(0,170,255,0.7)]"
              title="Join Telegram"
            >
              <Icon
                icon="simple-icons:telegram"
                width={36}
                height={36}
                color="#ffffff"
              />
            </a>
            <a
              href="https://discord.gg/yourInvite"
              target="_blank"
              rel="noreferrer"
              aria-label="Discord"
              className="transition-transform hover:scale-110 hover:drop-shadow-[0_0_10px_rgba(114,137,218,0.7)]"
              title="Join Discord"
            >
              <Icon
                icon="simple-icons:discord"
                width={36}
                height={36}
                color="#ffffff"
              />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
