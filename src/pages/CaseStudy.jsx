import { Children } from "react";
import { useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import { getCase } from "../lib/cases.js";
import { getEmbed } from "../lib/embeds.js";
import Tooltip from "../components/Tooltip.jsx";
import PillButton from "../components/PillButton.jsx";
import Carousel from "../components/Carousel.jsx";
import "./CaseStudy.css";

const VIDEO_EXTENSIONS = ["mp4", "webm", "mov"];
const EMBED_PREFIX = "embed/";

function isVideo(src) {
  const extension = src?.split(".").pop()?.toLowerCase();
  return VIDEO_EXTENSIONS.includes(extension);
}

function CaseMedia({ src, alt, wide, assets }) {
  const figureClassName = `case-study__figure${wide ? " case-study__figure--wide" : ""}`;

  if (src?.startsWith(EMBED_PREFIX)) {
    const Embed = getEmbed(src.slice(EMBED_PREFIX.length));
    if (Embed) {
      return (
        <figure className={figureClassName}>
          <Embed />
          {alt && <figcaption className="case-study__caption">{alt}</figcaption>}
        </figure>
      );
    }
  }

  const resolved = assets[src] ?? assets[src?.split("/").pop()];

  if (!resolved) {
    return (
      <div className="case-study__image case-study__image--placeholder">
        {alt}
      </div>
    );
  }

  return (
    <figure className={figureClassName}>
      {isVideo(resolved) ? (
        <video
          className="case-study__image"
          src={resolved}
          autoPlay
          muted
          loop
          playsInline
        />
      ) : (
        <img className="case-study__image" src={resolved} alt={alt ?? ""} />
      )}
      {alt && <figcaption className="case-study__caption">{alt}</figcaption>}
    </figure>
  );
}

const STYLE_TAG_HEADING = {
  title: "#",
  h2: "###",
};

function applyStyleTags(markdown) {
  return markdown
    .split("\n")
    .map((line) => {
      const match = line.match(/^\{(title|h2|p)\}\s*(.*)$/);
      if (!match) return line;
      const [, role, text] = match;
      const heading = STYLE_TAG_HEADING[role];
      return heading ? `${heading} ${text}` : text;
    })
    .join("\n");
}

const WIDE_TAG_LINE_RE = /^[ \t]*\{wide\}[ \t]*$/;
const IMAGE_LINE_RE = /^!\[([^\]]*)\]\(([^)]+)\)$/;

function markWideImages(markdown) {
  const lines = markdown.split("\n");
  const result = [];
  let pendingWide = false;

  for (const line of lines) {
    if (WIDE_TAG_LINE_RE.test(line)) {
      pendingWide = true;
      continue;
    }
    if (pendingWide && line.trim() === "") {
      result.push(line);
      continue;
    }
    const imageMatch = line.match(IMAGE_LINE_RE);
    if (pendingWide && imageMatch) {
      const [, alt, src] = imageMatch;
      result.push(`![${alt}](${src} "wide")`);
      pendingWide = false;
      continue;
    }
    pendingWide = false;
    result.push(line);
  }

  return result.join("\n");
}

const CAROUSEL_START_RE = /^[ \t]*\{carousel\}[ \t]*$/;
const CAROUSEL_END_RE = /^[ \t]*\{\/carousel\}[ \t]*$/;

function markCarousels(markdown) {
  const lines = markdown.split("\n");
  const result = [];
  let collecting = false;
  let images = [];

  for (const line of lines) {
    if (CAROUSEL_START_RE.test(line)) {
      collecting = true;
      images = [];
      continue;
    }
    if (CAROUSEL_END_RE.test(line)) {
      collecting = false;
      const data = encodeURIComponent(JSON.stringify(images));
      result.push(`<case-carousel data-images="${data}"></case-carousel>`);
      continue;
    }
    if (collecting) {
      const imageMatch = line.match(IMAGE_LINE_RE);
      if (imageMatch) {
        const [, alt, src] = imageMatch;
        images.push({ alt, src });
      }
      continue;
    }
    result.push(line);
  }

  return result.join("\n");
}

const SECTION_HEADING_RE = /^### /;

function splitIntoSections(markdown) {
  const lines = markdown.split("\n");
  const preambleLines = [];
  const sections = [];
  let current = null;

  for (const line of lines) {
    if (SECTION_HEADING_RE.test(line)) {
      if (current) sections.push(current.join("\n"));
      current = [line];
    } else if (current) {
      current.push(line);
    } else {
      preambleLines.push(line);
    }
  }
  if (current) sections.push(current.join("\n"));

  return { preamble: preambleLines.join("\n"), sections };
}

export default function CaseStudy() {
  const { caseName } = useParams();
  const caseData = getCase(caseName);

  if (!caseData) {
    return (
      <main className="case-study">
        <p>Case not found.</p>
      </main>
    );
  }

  const renderImage = ({ src, alt, title }) => (
    <CaseMedia src={src} alt={alt} wide={title === "wide"} assets={caseData.assets} />
  );

  const renderLink = ({ href, title, children }) => {
    if (title === "button") {
      const resolved =
        caseData.assets[href] ?? caseData.assets[href?.split("/").pop()] ?? href;
      return (
        <PillButton href={resolved} variant="stroke" download>
          {children}
        </PillButton>
      );
    }
    return title ? (
      <Tooltip explanation={title}>{children}</Tooltip>
    ) : (
      <a
        className="case-study__link"
        href={href}
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
      </a>
    );
  };

  const renderCarousel = ({ "data-images": dataImages }) => {
    if (!dataImages) return null;
    let images;
    try {
      images = JSON.parse(decodeURIComponent(dataImages));
    } catch {
      return null;
    }
    return <Carousel images={images} assets={caseData.assets} />;
  };

  const markdownComponents = {
    h1: ({ children }) => <h1 className="case-study__title">{children}</h1>,
    h3: ({ children }) => <h3 className="case-study__h2">{children}</h3>,
    p: ({ children }) => {
      const only = Children.toArray(children);
      if (only.length === 1 && only[0]?.type === renderImage) {
        return only[0];
      }
      if (
        only.length === 1 &&
        only[0]?.type === renderLink &&
        only[0]?.props?.title === "button"
      ) {
        return only[0];
      }
      if (only.length === 1 && only[0]?.type === renderCarousel) {
        return only[0];
      }
      return <p className="case-study__p">{children}</p>;
    },
    ul: ({ children }) => <ul className="case-study__ul">{children}</ul>,
    ol: ({ children }) => <ol className="case-study__ol">{children}</ol>,
    li: ({ children }) => (
      <li>
        <span className="case-study__li-content">{children}</span>
      </li>
    ),
    img: renderImage,
    a: renderLink,
    "case-carousel": renderCarousel,
  };

  const descriptionComponents = {
    p: ({ children }) => (
      <p className="case-study__description">{children}</p>
    ),
    a: renderLink,
  };

  const content = markWideImages(markCarousels(applyStyleTags(caseData.content)));
  const { preamble, sections } = splitIntoSections(content);
  const clientLogoSrc =
    caseData.assets[caseData.clientLogo] ??
    caseData.assets[caseData.clientLogo?.split("/").pop()];

  return (
    <main className="case-study">
      <article className="case-study__article">
        <div className="case-study__header">
          <div className="case-study__heading">
            <h1 className="case-study__title">{caseData.title}</h1>
            {caseData.tags.length > 0 && (
              <ul className="case-study__tags">
                {caseData.tags.map((tag) => (
                  <li key={tag}>{tag}</li>
                ))}
              </ul>
            )}
          </div>
          {clientLogoSrc && caseData.clientDescription && (
            <div className="case-study__client">
              <img
                className="case-study__client-logo"
                src={clientLogoSrc}
                alt={caseData.client}
              />
              <p className="case-study__client-description">
                {caseData.clientDescription}
              </p>
            </div>
          )}
          {caseData.description && (
            <ReactMarkdown
              rehypePlugins={[rehypeRaw]}
              components={descriptionComponents}
            >
              {caseData.description}
            </ReactMarkdown>
          )}
        </div>
        <div className="case-study__body">
          {preamble.trim() && (
            <ReactMarkdown rehypePlugins={[rehypeRaw]} components={markdownComponents}>
              {preamble}
            </ReactMarkdown>
          )}
          {sections.map((section, index) => (
            <div className="case-study__section" key={index}>
              <ReactMarkdown rehypePlugins={[rehypeRaw]} components={markdownComponents}>
                {section}
              </ReactMarkdown>
            </div>
          ))}
        </div>
      </article>
    </main>
  );
}
