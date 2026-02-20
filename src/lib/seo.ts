import { useEffect } from "react";

type SeoOptions = {
  title?: string;
  description?: string;
};

const DEFAULT_TITLE = "SkyStat";
const DEFAULT_DESCRIPTION = "SkyStat provides airport weather statistics and sample report pages.";

function ensureDescriptionTag() {
  let tag = document.querySelector('meta[name="description"]');
  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute("name", "description");
    document.head.appendChild(tag);
  }
  return tag;
}

export function setSeo(options: SeoOptions = {}) {
  const title = options.title ? `${options.title} | ${DEFAULT_TITLE}` : DEFAULT_TITLE;
  const description = options.description ?? DEFAULT_DESCRIPTION;

  document.title = title;
  ensureDescriptionTag().setAttribute("content", description);
}

export function useSeo(options: SeoOptions = {}) {
  const { title, description } = options;

  useEffect(() => {
    setSeo({ title, description });
  }, [title, description]);
}
