import { DungeonMode, DungeonSizes, type DungeonRecord } from "../../types/dungeons.ts";
import type { DungeonFormProps } from "./types";
import "./styles.css";

export function DungeonForm({ onSubmit }: DungeonFormProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const name = (formData.get("dungeonName") as string)?.trim();
    const size = Number(formData.get("dungeonSize")) as DungeonRecord["size"];
    const itemLevelStr = (formData.get("itemLevel") as string)?.trim();
    const mode = formData.get("dungeonMode") === "Heroic" ? DungeonMode.HEROIC : DungeonMode.NORMAL;

    if (!name) return;
    if (!DungeonSizes.includes(size)) return;

    const itemLevel = itemLevelStr
      ? itemLevelStr.split(/[\s,]+/).map(Number).filter(Number.isFinite)
      : [200];

    onSubmit({ name, size, itemLevel, mode });
    form.reset();
  };

  return (
    <form className="dungeon-form" onSubmit={handleSubmit}>
      <label>
        Name
        <input
          name="dungeonName"
          type="text"
          placeholder="Dungeon name"
          required
        />
      </label>
      <label>
        Size
        <select name="dungeonSize" required>
          {DungeonSizes.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </label>
      <label>
        Item level
        <input
          name="itemLevel"
          type="text"
          placeholder="200, 213 or 200"
        />
      </label>
      <label>
        Mode
        <select name="dungeonMode">
          <option value={DungeonMode.NORMAL}>Normal</option>
          <option value={DungeonMode.HEROIC}>Heroic</option>
        </select>
      </label>
      <button type="submit" className="add-dungeon-btn">
        Add dungeon
      </button>
    </form>
  );
}
