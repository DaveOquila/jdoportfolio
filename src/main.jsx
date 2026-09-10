import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "./index.css";

import App from "./App.jsx";
import About from "./About.jsx";
import Portfolio from "./Portfolio.jsx";
import Contact from "./Contact.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
    <About />
    <Portfolio />
    <Contact />
  </StrictMode>
);