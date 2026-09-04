import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LEGAL_DOCS, LEGAL_SLUGS } from "@/lib/legal-content";

export function generateStaticParams() {
  return LEGAL_SLUGS.map((doc) => ({ doc }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ doc: string }>;
}): Promise<Metadata> {
  const { doc } = await params;
  const d = LEGAL_DOCS[doc];
  return { title: d?.title ?? "Legal" };
}

export default async function LegalPage({
  params,
}: {
  params: Promise<{ doc: string }>;
}) {
  const { doc } = await params;
  const d = LEGAL_DOCS[doc];
  if (!d) notFound();

  return (
    <div className="mx-auto max-w-[820px] px-4 py-12 md:px-6 md:py-16">
      <span className="eyebrow inline-block">
        Legal
      </span>
      <h1 className="mt-3 text-stage text-ink">{d.title}</h1>
      <p className="mt-2 text-sm font-semibold text-ink-muted">Last updated: {d.updated}</p>
      <p className="mt-6 text-base leading-relaxed text-ink-muted">{d.intro}</p>

      <div className="mt-8 flex flex-col gap-7">
        {d.sections.map((s) => (
          <section key={s.heading}>
            <h2 className="text-xl text-ink">{s.heading}</h2>
            {s.body.map((block, i) => {
              if (typeof block === "string") {
                return (
                  <p key={i} className="mt-2 text-[15px] leading-relaxed text-ink-muted">
                    {block}
                  </p>
                );
              }
              if ("subheading" in block) {
                return (
                  <h3 key={i} className="mt-4 text-base font-bold text-ink">
                    {block.subheading}
                  </h3>
                );
              }
              return (
                <ul key={i} className="mt-2 flex list-disc flex-col gap-1.5 pl-5 text-[15px] leading-relaxed text-ink-muted">
                  {block.list.map((li, j) => (
                    <li key={j}>{li}</li>
                  ))}
                </ul>
              );
            })}
          </section>
        ))}
      </div>
    </div>
  );
}
