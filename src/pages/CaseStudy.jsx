import { Children } from "react";
import { useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { getCase } from "../lib/cases.js";
import { getEmbed } from "../lib/embeds.js";
import PillButton from "../components/PillButton.jsx";
import "./CaseStudy.css";

const VIDEO_EXTENSIONS = ["mp4", "webm", "mov"];
const EMBED_PREFIX = "embed/";

function isVideo(src) {
  const extension = src?.split(".").pop()?.toLowerCase();
  return VIDEO_EXTENSIONS.includes(extension);
}

function CaseMedia({ src, alt, assets }) {
  if (src?.startsWith(EMBED_PREFIX)) {
    const Embed = getEmbed(src.slice(EMBED_PREFIX.length));
    if (Embed) {
      return (
        <figure className="case-study__figure">
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
    <figure className="case-study__figure">
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
  h2: "##",
  eyebrow: "###",
};

function applyStyleTags(markdown) {
  return markdown
    .split("\n")
    .map((line) => {
      const match = line.match(/^\{(title|h2|eyebrow|p)\}\s*(.*)$/);
      if (!match) return line;
      const [, role, text] = match;
      const heading = STYLE_TAG_HEADING[role];
      return heading ? `${heading} ${text}` : text;
    })
    .join("\n");
}

function splitIntoSections(markdown) {
  return markdown
    .split(/\n[ \t]*---[ \t]*\n/)
    .map((section) => section.trim())
    .filter(Boolean);
}

const WIDE_TAG_RE = /^[ \t]*\{wide\}[ \t]*$\n?/m;
const NO_BG_TAG_RE = /^[ \t]*\{no-bg\}[ \t]*$\n?/m;

function extractFlags(section) {
  const wide = WIDE_TAG_RE.test(section);
  const noBg = NO_BG_TAG_RE.test(section);
  const content = section
    .replace(WIDE_TAG_RE, "")
    .replace(NO_BG_TAG_RE, "")
    .trim();
  return { wide, noBg, content };
}

function BackButton() {
  return (
    <PillButton href="/" variant="fill" showArrow={false}>
      ← Back to Timeline
    </PillButton>
  );
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

  const renderImage = ({ src, alt }) => (
    <CaseMedia src={src} alt={alt} assets={caseData.assets} />
  );

  const markdownComponents = {
    h1: (props) => <h1 className="case-study__title" {...props} />,
    h2: (props) => <h2 className="case-study__h2" {...props} />,
    h3: (props) => <h3 className="case-study__eyebrow" {...props} />,
    p: ({ children }) => {
      const only = Children.toArray(children);
      if (only.length === 1 && only[0]?.type === renderImage) {
        return only[0];
      }
      return <p className="case-study__p">{children}</p>;
    },
    ul: (props) => <ul className="case-study__ul" {...props} />,
    ol: (props) => <ol className="case-study__ol" {...props} />,
    img: renderImage,
  };

  const sections = splitIntoSections(applyStyleTags(caseData.content));

  return (
    <main className="case-study">
      <div className="case-study__stack">
        <BackButton />
        <div className="case-study__cards">
          <div className="case-study__card">
            <h1 className="case-study__title">{caseData.title}</h1>
            {caseData.tags.length > 0 && (
              <ul className="case-study__tags">
                {caseData.tags.map((tag) => (
                  <li key={tag}>{tag}</li>
                ))}
              </ul>
            )}
          </div>
          {sections.map((section, i) => {
            const { wide, noBg, content } = extractFlags(section);
            return (
              <div
                className={`case-study__card${wide ? " case-study__card--wide" : ""}${noBg ? " case-study__card--no-bg" : ""}`}
                key={i}
              >
                <ReactMarkdown components={markdownComponents}>
                  {content}
                </ReactMarkdown>
              </div>
            );
          })}
        </div>
        <BackButton />
      </div>
    </main>
  );
}
