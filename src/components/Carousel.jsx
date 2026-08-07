import { useState } from "react";
import "./Carousel.css";

function resolveSrc(src, assets) {
  return assets[src] ?? assets[src?.split("/").pop()];
}

export default function Carousel({ images, assets }) {
  const [index, setIndex] = useState(0);

  if (!images || images.length === 0) return null;

  const goTo = (next) => setIndex((next + images.length) % images.length);

  const current = images[index];
  const resolved = resolveSrc(current.src, assets);

  return (
    <div className="carousel">
      <div className="carousel__viewport">
        {resolved ? (
          <img className="carousel__image" src={resolved} alt={current.alt ?? ""} />
        ) : (
          <div className="carousel__image carousel__image--placeholder">
            {current.alt}
          </div>
        )}
        {images.length > 1 && (
          <>
            <button
              type="button"
              className="carousel__nav carousel__nav--prev"
              aria-label="Previous slide"
              onClick={() => goTo(index - 1)}
            >
              <svg viewBox="0 0 24 24" fill="none">
                <polyline points="15 4 7 12 15 20" />
              </svg>
            </button>
            <button
              type="button"
              className="carousel__nav carousel__nav--next"
              aria-label="Next slide"
              onClick={() => goTo(index + 1)}
            >
              <svg viewBox="0 0 24 24" fill="none">
                <polyline points="9 4 17 12 9 20" />
              </svg>
            </button>
          </>
        )}
      </div>
      {current.alt && <p className="carousel__caption">{current.alt}</p>}
      {images.length > 1 && (
        <div className="carousel__dots">
          {images.map((image, i) => (
            <button
              key={image.src + i}
              type="button"
              className={`carousel__dot${i === index ? " carousel__dot--active" : ""}`}
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => goTo(i)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
