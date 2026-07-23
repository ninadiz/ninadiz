import PillButton from "./PillButton.jsx";
import "./TimelineItem.css";

const VIDEO_EXTENSIONS = ["mp4", "webm", "mov"];

function isVideo(src) {
  const extension = src?.split(".").pop()?.toLowerCase();
  return VIDEO_EXTENSIONS.includes(extension);
}

export default function TimelineItem({ item, isLast }) {
  return (
    <div className="timeline-item">
      <div className="timeline-item__date">{item.date}</div>
      <div className="timeline-item__rail">
        <span className="timeline-item__dot" />
        {!isLast && <span className="timeline-item__line" />}
      </div>
      <div className="timeline-item__content">
        <h2
          className="timeline-item__title"
          dangerouslySetInnerHTML={{ __html: item.title }}
        />
        {item.subheader && (
          <p className="timeline-item__subheader">{item.subheader}</p>
        )}
        {item.image && isVideo(item.image) && (
          <video
            className="timeline-item__image"
            src={item.image}
            autoPlay
            muted
            loop
            playsInline
          />
        )}
        {item.image && !isVideo(item.image) && (
          <img
            className="timeline-item__image"
            src={item.image}
            alt={item.imageDescription ?? ""}
          />
        )}
        {item.imageDescription && (
          <p className="timeline-item__image-description">
            {item.imageDescription}
          </p>
        )}
        {(item.buttonPrimary?.label || item.buttonSecondary?.label) && (
          <div className="timeline-item__links">
            {item.buttonPrimary?.label && (
              <PillButton
                href={item.buttonPrimary.href}
                variant="fill"
                newTab={item.buttonPrimary.newTab}
              >
                {item.buttonPrimary.label}
              </PillButton>
            )}
            {item.buttonSecondary?.label && (
              <PillButton
                href={item.buttonSecondary.href}
                variant="stroke"
                newTab={item.buttonSecondary.newTab}
              >
                {item.buttonSecondary.label}
              </PillButton>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
