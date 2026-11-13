import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
// Inter 4, self-hosted (one variable file per script) with the weight and
// optical size axes: large text gets the tighter display design
// automatically, as in Figma. The latin file is preloaded from index.html by
// vite.config.js
import "@fontsource-variable/inter/opsz.css";
import "./styles/tokens.css";
import "./styles/global.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
