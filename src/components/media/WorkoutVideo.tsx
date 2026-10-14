import { SITE_IMAGES } from "@/lib/site-images";
import { SITE_VIDEO } from "@/lib/site-media";

type Props = {
  dark?: boolean;
  title?: string;
  lead?: string;
};

export function WorkoutVideo({
  dark = false,
  title = "Training in action",
  lead = "A glimpse of purposeful strength work, and the same focus and structure clients bring to their own programs.",
}: Props) {
  const bg = dark ? "bg-power-black text-clean-white" : "bg-clean-white text-power-black";
  const leadColor = dark ? "text-soft-silver" : "text-power-black/75";

  return (
    <section className={`${bg} py-16 md:py-24`}>
      <div className="mx-auto max-w-5xl px-4 md:px-8">
        <p className="font-display text-xs tracking-[0.4em] text-hot-fuchsia">TRAINING</p>
        <h2 className="mt-4 font-display text-3xl uppercase tracking-tight md:text-4xl">{title}</h2>
        <p className={`mt-4 max-w-2xl text-base leading-relaxed md:text-lg ${leadColor}`}>{lead}</p>
        <div className="mt-10 overflow-hidden border border-hot-fuchsia/30 bg-power-black shadow-lg">
          <video
            className="aspect-video w-full object-cover"
            controls
            playsInline
            preload="metadata"
            poster={SITE_IMAGES.gymMatDumbbell}
          >
            <source src={SITE_VIDEO.workout} type="video/mp4" />
            Your browser does not support embedded video. You can{" "}
            <a href={SITE_VIDEO.workout} className="text-hot-fuchsia underline">
              download the clip
            </a>
            .
          </video>
        </div>
      </div>
    </section>
  );
}
