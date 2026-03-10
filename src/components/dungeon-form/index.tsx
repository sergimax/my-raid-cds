import { useId } from "react";
import { DungeonMode, DungeonSizes, type DungeonRecord } from "../../types/dungeons.ts";
import type { DungeonFormProps } from "./types";
import "./styles.css";

export function DungeonForm({ onSubmit }: DungeonFormProps) {
  const id = useId();
  const nameId = `${id}-name`;
  const sizeId = `${id}-size`;
  const itemLevelId = `${id}-item-level`;
  const modeId = `${id}-mode`;

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
      : [];

    onSubmit({ name, size, itemLevel, mode });
    form.reset();
  };

  return (
    <form className="dungeon-form" onSubmit={handleSubmit}>
      <label htmlFor={nameId}>
        Name
        <input
          id={nameId}
          name="dungeonName"
          type="text"
          placeholder="Dungeon name"
          required
        />
      </label>
      <label htmlFor={sizeId}>
        Size
        <select id={sizeId} name="dungeonSize" required>
          {DungeonSizes.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </label>
      <label htmlFor={itemLevelId}>
        Item level
        <input
          id={itemLevelId}
          name="itemLevel"
          type="text"
          placeholder="200, 213 or 200"
        />
      </label>
      <label htmlFor={modeId}>
        Mode
        <select id={modeId} name="dungeonMode">
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
