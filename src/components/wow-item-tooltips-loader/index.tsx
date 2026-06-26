import { useEffect } from "react";
import {
  COT_TOOLTIP_SCRIPT_ID,
  COT_TOOLTIP_SCRIPT_URL,
  WOWROAD_TOOLTIP_CONFIG_SCRIPT_ID,
  WOWROAD_TOOLTIP_SCRIPT_ID,
  WOWROAD_TOOLTIP_SCRIPT_URL,
} from "../../constants/item-tooltips.ts";

function appendScript(id: string, src: string): void {
  if (document.getElementById(id)) {
    return;
  }

  const script = document.createElement("script");
  script.id = id;
  script.src = src;
  script.async = true;
  document.head.appendChild(script);
}

function appendInlineScript(id: string, content: string): void {
  if (document.getElementById(id)) {
    return;
  }

  const script = document.createElement("script");
  script.id = id;
  script.textContent = content;
  document.head.appendChild(script);
}

/** Loads third-party tooltip scripts once (EN + RU providers; links pick the active one). */
export function WowItemTooltipsLoader() {
  useEffect(() => {
    appendInlineScript(
      WOWROAD_TOOLTIP_CONFIG_SCRIPT_ID,
      'var wowroad_tooltips = { "colorlinks": true, "iconizelinks": false, "renamelinks": false };',
    );
    appendScript(WOWROAD_TOOLTIP_SCRIPT_ID, WOWROAD_TOOLTIP_SCRIPT_URL);
    appendScript(COT_TOOLTIP_SCRIPT_ID, COT_TOOLTIP_SCRIPT_URL);
  }, []);

  return null;
}
