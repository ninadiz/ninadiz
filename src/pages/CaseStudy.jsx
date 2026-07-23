import { useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { getCase } from "../lib/cases.js";
import "./CaseStudy.css";

function CaseImage({ src, alt, assets }) {
  const resolved = assets[src] ?? assets[src?.split("/").pop()];

  if (resolved) {
    return <img className="case-study__image" src={resolved} alt={alt} />;
  }

  return (
    <div className="case-study__image case-study__image--placeholder">
      {alt}
    </div>
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

  return (
    <main className="case-study">
      <ReactMarkdown
        components={{
          h1: (props) => <h1 className="case-study__h1" {...props} />,
          h2: (props) => <h2 className="case-study__h2" {...props} />,
          h3: (props) => <h3 className="case-study__h3" {...props} />,
          h4: (props) => <h4 className="case-study__h4" {...props} />,
          p: (props) => <p className="case-study__p" {...props} />,
          ul: (props) => <ul className="case-study__ul" {...props} />,
          img: ({ src, alt }) => (
            <CaseImage src={src} alt={alt} assets={caseData.assets} />
          ),
        }}
      >
        {caseData.markdown}
      </ReactMarkdown>
    </main>
  );
}
