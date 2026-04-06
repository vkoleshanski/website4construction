import { useEffect } from "react";
import { useSiteContent } from "@/hooks/use-site-content";

interface SeoHeadProps {
  title: string;
  description: string;
  keywords: string;
  path: string;
  image?: string;
  noIndex?: boolean;
}

const setMetaTag = (selector: string, attribute: "name" | "property", key: string, value: string) => {
  let tag = document.head.querySelector(selector) as HTMLMetaElement | null;

  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute(attribute, key);
    document.head.appendChild(tag);
  }

  tag.setAttribute("content", value);
};

const setLinkTag = (rel: string, href: string) => {
  let tag = document.head.querySelector(`link[rel='${rel}']`) as HTMLLinkElement | null;

  if (!tag) {
    tag = document.createElement("link");
    tag.rel = rel;
    document.head.appendChild(tag);
  }

  tag.href = href;
};

const SeoHead = ({ title, description, keywords, path, image, noIndex = false }: SeoHeadProps) => {
  const {
    content: { seo },
  } = useSiteContent();

  useEffect(() => {
    const baseUrl = seo.siteUrl.replace(/\/$/, "");
    const canonicalPath = path.startsWith("/") ? path : `/${path}`;
    const canonicalUrl = `${baseUrl}${canonicalPath}`;
    const imageUrl = image || seo.defaultImage;

    document.title = title;

    setMetaTag("meta[name='description']", "name", "description", description);
    setMetaTag("meta[name='keywords']", "name", "keywords", keywords);
    setMetaTag(
      "meta[name='robots']",
      "name",
      "robots",
      noIndex ? "noindex,nofollow" : "index,follow,max-image-preview:large",
    );

    setMetaTag("meta[property='og:type']", "property", "og:type", "website");
    setMetaTag("meta[property='og:title']", "property", "og:title", title);
    setMetaTag("meta[property='og:description']", "property", "og:description", description);
    setMetaTag("meta[property='og:url']", "property", "og:url", canonicalUrl);
    setMetaTag("meta[property='og:image']", "property", "og:image", imageUrl);
    setMetaTag("meta[property='og:site_name']", "property", "og:site_name", seo.siteName);
    setMetaTag("meta[property='og:locale']", "property", "og:locale", "bg_BG");

    setMetaTag("meta[name='twitter:card']", "name", "twitter:card", "summary_large_image");
    setMetaTag("meta[name='twitter:title']", "name", "twitter:title", title);
    setMetaTag("meta[name='twitter:description']", "name", "twitter:description", description);
    setMetaTag("meta[name='twitter:image']", "name", "twitter:image", imageUrl);

    setLinkTag("canonical", canonicalUrl);
  }, [description, image, keywords, noIndex, path, seo.defaultImage, seo.siteName, seo.siteUrl, title]);

  return null;
};

export default SeoHead;
