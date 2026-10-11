import { useState } from "react";
import { SunIcon, MoonIcon } from "./Icons.jsx";

const KEY = "taskflow_theme";

export default function ThemeToggle() {
  const [theme, setTheme] = useState(
    () => document.documentElement.getAttribute("data-theme") || "light"
  );

  const toggle = () => {
    const next = theme === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem(KEY, next);
    } catch {
      /* storage can be blocked; the theme still applies for this visit */
    }
    setTheme(next);
  };

  const label = theme === "dark" ? "Switch to light mode" : "Switch to dark mode";

  return (
    <button type="button" className="icon-btn" onClick={toggle} aria-label={label} title={label}>
      {theme === "dark" ? <SunIcon /> : <MoonIcon />}
    </button>
  );
}
