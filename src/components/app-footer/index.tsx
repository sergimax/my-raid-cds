import "./styles.css";

export function AppFooter() {
  return (
    <footer
      className="app-footer"
      aria-label={`Version ${__APP_VERSION__} by sergimax via cursor`}
    >
      <span className="app-footer-line">
        version{" "}
        <span className="app-footer-version">{__APP_VERSION__}</span>
        {" "}
        by{" "}
        <a
          href="https://github.com/sergimax"
          target="_blank"
          rel="noopener noreferrer"
        >
          sergimax
        </a>
        {" "}
        via{" "}
        <a
          href="https://cursor.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          cursor
        </a>
      </span>
    </footer>
  );
}
