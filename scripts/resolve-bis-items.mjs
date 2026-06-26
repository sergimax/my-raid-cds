import names from "../src/data/wotlk-item-names.json" with { type: "json" };

const nameToId = new Map(
  Object.entries(names).map(([id, name]) => [name.toLowerCase(), Number(id)]),
);

const items = [
  "Sanctified Scourgelord Helmet",
  "Sanctified Scourgelord Shoulderplates",
  "Sanctified Scourgelord Battleplate",
  "Sanctified Scourgelord Gauntlets",
  "Scourge Reaver's Legplates",
  "Penumbra Pendant",
  "Winding Sheet",
  "Umbrage Armbands",
  "Coldwraith Links",
  "Apocalypse's Advance",
  "Ashen Band of Endless Might",
  "Might of Blight",
  "Deathbringer's Will",
  "Sharpened Twilight Scale",
  "Shadowmourne",
  "Sigil of the Hanged Man",
  "Sigil of Virulence",
];

for (const itemName of items) {
  console.log(nameToId.get(itemName.toLowerCase()) ?? "MISSING", itemName);
}
