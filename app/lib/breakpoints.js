// The site has one breakpoint: 760px and below is the mobile layout. CSS
// cannot read this file or custom properties inside @media, so every
// `@media (max-width: 760px)` repeats the number: keep them in sync.
export const MOBILE_MAX_WIDTH = 760;

export const MOBILE_QUERY = `(max-width: ${MOBILE_MAX_WIDTH}px)`;
