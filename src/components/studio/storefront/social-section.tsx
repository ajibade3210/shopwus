import { APP_CONFIG, SOCIAL_PREFIX_MAP } from "@/constants";
import type { SocialChannel, StudioSocialSectionProps } from "@/types";
import { getSocialChannelStyle } from "./social-badge";

function resolveChannelUrl(channel: SocialChannel): string {
  if (channel.url?.startsWith("http")) return channel.url;
  const handle = channel.handle?.trim() || "";
  if (!handle) return "#";
  if (handle.startsWith("http://") || handle.startsWith("https://")) return handle;
  if (channel.type === "whatsapp") {
    const cleanNumber = handle.replace(/\D/g, "");
    const defaultPhone = APP_CONFIG.defaultStudioPhone.replace(/\D/g, "");
    return `https://wa.me/${cleanNumber || defaultPhone}`;
  }
  const prefix = SOCIAL_PREFIX_MAP[channel.type] || "";
  const cleanPrefix = prefix.replace(/^https?:\/\//i, "");
  return `https://${cleanPrefix}${handle.replace(/^@/, "")}`;
}

export function StudioSocialSection({ profile, textColor }: StudioSocialSectionProps) {
  const activeChannels = profile.socialChannels?.filter(c => c.connected) || [];

  if (activeChannels.length === 0) {
    return null;
  }

  return (
    <section id="social" className="scroll-mt-24">
      <div className="mb-6">
        <h2 style={{ color: textColor }} className="font-serif text-2xl sm:text-3xl font-normal">
          Social Channels
        </h2>
      </div>

      <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-2">
        {activeChannels.map(channel => {
          const style = getSocialChannelStyle(channel.type);
          const channelUrl = resolveChannelUrl(channel);
          return (
            <a
              key={channel.id}
              href={channelUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                backgroundColor: style.bg,
                borderColor: style.border,
                color: style.color,
              }}
              className="w-13 h-13 sm:w-15 sm:h-15 rounded-2xl border flex items-center justify-center hover:scale-110 transition-all duration-200 shadow-2xs hover:shadow-md [&_svg]:w-5.5 [&_svg]:h-5.5 sm:[&_svg]:w-6.5 sm:[&_svg]:h-6.5"
              title={channel.label || channel.type}
              aria-label={channel.label || channel.type}
            >
              {style.icon}
            </a>
          );
        })}
      </div>
    </section>
  );
}
