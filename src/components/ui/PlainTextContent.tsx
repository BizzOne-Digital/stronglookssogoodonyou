import { splitAdminParagraphs } from "@/lib/admin-text";

type Props = {
  text: string;
  className?: string;
  paragraphClassName?: string;
};

/** Renders admin copy as simple paragraphs (no raw HTML on the page). */
export function PlainTextContent({
  text,
  className,
  paragraphClassName = "mb-4 last:mb-0",
}: Props) {
  const paragraphs = splitAdminParagraphs(text);
  if (paragraphs.length === 0) return null;

  return (
    <div className={className}>
      {paragraphs.map((block, i) => (
        <p key={i} className={paragraphClassName}>
          {block.split("\n").map((line, j, lines) => (
            <span key={j}>
              {line}
              {j < lines.length - 1 ? <br /> : null}
            </span>
          ))}
        </p>
      ))}
    </div>
  );
}
