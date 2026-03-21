import { useEffect, useId, useRef, useState } from "react";
import { DungeonList } from "../../data/dungeons.ts";
import { DungeonMode, DungeonSizes, type Dungeon, type DungeonRecord } from "../../types/dungeons.ts";
import type { DungeonFormProps } from "./types";
import "./styles.css";

function itemLevelsEqual(a: number[], b: number[]): boolean {
  if (a.length !== b.length) return false;
  return a.every((v, i) => v === b[i]);
}

function dungeonMatchesRow(a: Dungeon, row: DungeonRecord): boolean {
  return (
    a.name === row.name &&
    a.size === row.size &&
    a.mode === row.mode &&
    itemLevelsEqual(a.itemLevel, row.itemLevel)
  );
}

function isPresetInTable(preset: Dungeon, dungeons: DungeonRecord[]): boolean {
  return dungeons.some((d) => dungeonMatchesRow(preset, d));
}

function formatPresetLabel(d: Dungeon): string {
  const ilvl = d.itemLevel.join("/");
  return `${d.name} · ${d.size} · ${d.mode} · ${ilvl}`;
}

function applyDungeonToForm(form: HTMLFormElement, d: Dungeon): void {
  const nameInput = form.elements.namedItem("dungeonName") as HTMLInputElement | null;
  const sizeSelect = form.elements.namedItem("dungeonSize") as HTMLSelectElement | null;
  const itemLevelInput = form.elements.namedItem("itemLevel") as HTMLInputElement | null;
  const modeSelect = form.elements.namedItem("dungeonMode") as HTMLSelectElement | null;
  if (nameInput) nameInput.value = d.name;
  if (sizeSelect) sizeSelect.value = String(d.size);
  if (itemLevelInput) itemLevelInput.value = d.itemLevel.join(", ");
  if (modeSelect) modeSelect.value = d.mode;
}

export function DungeonForm({ onSubmit, existingDungeons }: DungeonFormProps) {
  const id = useId();
  const formRef = useRef<HTMLFormElement>(null);
  const [presetIndex, setPresetIndex] = useState("");
  const presetId = `${id}-preset`;
  const nameId = `${id}-name`;
  const sizeId = `${id}-size`;
  const itemLevelId = `${id}-item-level`;
  const modeId = `${id}-mode`;

  const availablePresetIndices = DungeonList.map((d, i) => ({ d, i })).filter(
    ({ d }) => !isPresetInTable(d, existingDungeons)
  );

  // Preset options omit rows already in the table. If the user had a non-empty
  // selection and that preset is no longer listed (e.g. "Add from template" or
  // the same dungeon added elsewhere), clear state so the <select> does not
  // keep a value that no longer exists as an <option>.
  useEffect(() => {
    if (presetIndex === "") return;
    const idx = Number(presetIndex);
    const preset = DungeonList[idx];
    if (!preset || isPresetInTable(preset, existingDungeons)) {
      setPresetIndex("");
    }
  }, [existingDungeons, presetIndex]);

  const handlePresetChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const indexStr = e.target.value;
    setPresetIndex(indexStr);
    if (indexStr === "" || !formRef.current) return;
    const idx = Number(indexStr);
    const d = DungeonList[idx];
    if (!d) return;
    applyDungeonToForm(formRef.current, d);
  };

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
    setPresetIndex("");
  };

  return (
    <form ref={formRef} className="dungeon-form" onSubmit={handleSubmit}>
      <label className="dungeon-form-preset-label" htmlFor={presetId}>
        Preset
        <select
          id={presetId}
          name="presetIndex"
          value={presetIndex}
          onChange={handlePresetChange}
        >
          <option value="">Custom (manual)</option>
          {availablePresetIndices.map(({ d, i }) => (
            <option key={i} value={String(i)}>
              {formatPresetLabel(d)}
            </option>
          ))}
        </select>
      </label>
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
