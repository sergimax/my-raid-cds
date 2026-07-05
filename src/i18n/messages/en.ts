export const enMessages = {
  common: {
    cancel: "Cancel",
    save: "Save",
    close: "Close",
    delete: "Delete",
    remove: "Remove",
    none: "None",
    name: "Name",
    class: "Class",
    spec: "Spec",
    size: "Size",
    mode: "Mode",
    searchPlaceholder: "Search…",
  },
  header: {
    appTitle: "My Raid CDs",
    themeLight: "Switch to light mode",
    themeDark: "Switch to dark mode",
    localeTooltipEn:
      "Interface language: English. Click for Russian. Item tooltips use Cavern of Time.",
    localeTooltipRu:
      "Interface language: Russian. Click for English. Item tooltips use WoWRoad.",
    localeAria: "Interface language {{locale}}. Switch to {{nextLocale}}.",
    versionAria: "Version {{version}}",
    authorHint: "by sergimax via cursor",
  },
  intro: {
    body:
      "Add characters and dungeons, then mark cooldown usage per cell. Data is saved automatically in your browser. When the dungeon list is empty, use",
    addFromTemplate: "Add from template",
    bodySuffix: "to load WotLK raids (Russian names).",
  },
  toolbar: {
    actionsAria: "Tracker actions",
    addFromTemplate: "Add from template",
    addCharacter: "Add character",
    addDungeon: "Add dungeon",
    bisLists: "BiS lists",
    export: "Export",
    resetAllToggles: "Reset all toggles",
  },
  table: {
    dungeonName: "Dungeon name",
    type: "Type",
    itemLevel: "Item level",
    complete: "Complete",
    rowActions: "Row actions",
    filterByDungeonName:
      "Filter by raid name, name+size, or name+size+mode — e.g. ICC, Uld10, or ToC25H",
    dungeonSearchPlaceholder: "ICC, Uld10, ToC25H ...",
    emptyNoDungeons: "Add a dungeon or use Add from template to get started.",
    emptyNoSearchMatches: "No dungeons match your search.",
    ariaNoDungeons: "Raid cooldown tracker, no dungeons",
    ariaNoSearchMatches: "Raid cooldown tracker, no dungeons match search",
    ariaDefault: "Raid cooldown tracker by dungeon and character",
    editDungeon: "Edit details for {{name}}",
    deleteDungeon: "Delete dungeon: {{name}}",
    editCharacter: "Edit details for {{name}}",
    resetCharacterToggles: "Reset toggles for {{name}}",
    removeCharacter: "Remove character {{name}}",
    toggleAria: "{{character}} — {{dungeon}}",
    difficultyNormal: "N",
    difficultyHeroic: "H ☠️",
    heroicSkullIcon: "☠️",
    emptyIlvl: "—",
  },
  characterForm: {
    title: "New character",
    addCharacter: "Add character",
    closeAria: "Close add character panel",
    main: "Main",
    off: "Off",
    gearScore: "Gear score",
    gearScoreHelper: "Character GearScore",
  },
  dungeonForm: {
    title: "New dungeon",
    addDungeon: "Add dungeon",
    closeAria: "Close add dungeon panel",
    shortName: "Short name",
    shortNameHelper:
      "Optional abbreviation shown in compact table view. Leave blank to use a default for known raids.",
    itemLevels: "Item levels",
    itemLevelsHelper:
      "One or more values, separated by / or comma (e.g. 200 or 200 / 213).",
    difficulty: "Difficulty",
    badge: "Badge",
  },
  difficulty: {
    normal: "Normal",
    heroic: "Heroic",
  },
  characterEdit: {
    title: "Edit character details",
    importGear: "Import gear from addon WowSimsExporter (export /wse export)",
    mainSpecGear: "Main spec gear",
    offSpecGear: "Off spec gear",
    storedGear: "Stored gear",
    avgIlvl: " · avg ilvl {{ilvl}}",
    unknownItemIds: "{{count}} item id(s) not in the ilvl database",
    wseJson: "WowSimsExporter JSON",
    wsePlaceholder: "Paste output from /wse export",
    wseHelper:
      "Imports equipped items (item ids, enchants, gems)",
    importButton: "Import gear",
    clearGearButton: "Clear gear",
    importedSummary: "Imported {{summary}}.",
    importedSpec: "Spec: {{spec}}.",
    suggestImportGear:
      "Gear score changed — re-import gear from WowSimsExporter (/wse export) so upgrade hints stay accurate.",
    suggestUpdateGearScore:
      "Gear changed — update the gear score field so exports and filters reflect your current setup.",
  },
  dungeonEdit: {
    title: "Edit dungeon details",
  },
  deleteDialog: {
    removeCharacterTitle: "Remove character?",
    removeCharacterMessage:
      'Remove "{{name}}" and all cooldown toggles for this character? This cannot be undone.',
    deleteDungeonTitle: "Delete dungeon?",
    deleteDungeonMessage:
      'Delete "{{name}}" and all cooldown toggles for this dungeon? This cannot be undone.',
  },
  bisPanel: {
    title: "BiS lists",
    layoutHint:
      "Choose class & spec on the left. Items in the center. Lists & save on the right. The active list will be used for upgrade hints in the table.",
    helpTooltip:
      "Preset best-in-slot targets per spec. Save custom lists with a name; saving again with the same name updates that list. Upgrade hints use the selected list for each character's main and off spec.",
    classAndSpec: "Class & spec",
    items: "Items",
    lists: "Lists",
    builtinReadOnly:
      "Built-in list (read-only). Save under a custom name to create an editable copy.",
    editHint:
      "Hover item names for tooltips. Edit a slot, then confirm with ✓ or cancel with ✕.",
    createCustomListHint:
      "No built-in BiS list for {{class}} {{spec}}. Add items below and save under a custom name.",
    listName: "List name",
    listNamePlaceholder: "Custom list name",
    saveList: "Save list",
    localListsOnly: "This spec uses only local lists.",
    itemSearchPlaceholder: "Name, id, or #id",
    confirmHelper: "Confirm with ✓ or cancel with ✕",
    cancelEditing: "Cancel editing",
    confirmItem: "Confirm item for this slot",
    editSlot: "Edit this slot",
    cancelEditingAria: "Cancel editing {{slot}} item",
    confirmItemAria: "Confirm {{slot}} item",
    editSlotAria: "Edit {{slot}} item",
    closeAria: "Close BiS lists panel",
    confirmAllSlots: "Confirm all edited slots before saving the list.",
    fixItemErrors: "Fix item errors before saving.",
    presetDefault: "Default",
  },
  exportPanel: {
    title: "Export",
    closeAria: "Close export panel",
    instructions:
      "Narrow to one raid (table search), pick the specs you want, and filter by role and GS. If a line appears below, copy it and send it to the raid leader in a private message.",
    noCharacters: "Add a character to build a status summary.",
    exportLinesTitle: "Ready to sign up",
    exportLinesHelper:
      "One line per raid with characters still missing CD. Filter the table to a single raid, then copy the matching line.",
    exportLinesHelperSingle:
      "Characters you can offer for this raid. Copy the line and paste it in a PM to the raid leader.",
    copyLine: "Copy for PM",
    copyLineAria: "Copy signup line for {{raid}}",
    copied: "Copied",
    dungeonFilterTitle: "Filter by raid",
    dungeonFilterHelper:
      "Uses the dungeon search field in the table header. Export includes one line per matching raid row.",
    dungeonFilterSearchEmpty: "Table search: (none) — all raids included",
    dungeonFilterSearchActive: "Table search: {{query}}",
    dungeonFilterMatchCount: "{{count}} of {{total}} raid(s) in export",
    dungeonFilterNoMatches: "No raids match the current table search.",
    gearScoreFilterTitle: "Filter by gear score",
    characterSpecsFilterTitle: "Filter by character specs",
    characterSpecsFilterHelper:
      "Choose which specs to include per character in export lines.",
    minGearScoreEnable: "Minimum GS filter",
    minGearScoreEnableAria: "Enable minimum gear score filter for export",
    minGearScoreHelper:
      "When enabled, specs below the selected GS are disabled and omitted from export lines.",
    minGearScoreSliderValue: "≥ {{value}}k GS",
    minGearScoreAria: "Minimum gear score for export lines",
    roleFilterLabel: "Filter by role",
    roleFilterTitle: "Filter by role",
    roleFilterHelper:
      "Unchecked roles disable matching spec checkboxes and omit them from export lines.",
    roleTank: "Tank",
    roleHealer: "Healer",
    roleMeleeDps: "Melee DPS",
    roleRangedDps: "Ranged DPS",
    roleTankAria: "Include tank specs in export",
    roleHealerAria: "Include healer specs in export",
    roleMeleeDpsAria: "Include melee DPS specs in export",
    roleRangedDpsAria: "Include ranged DPS specs in export",
    includeSpecAria: "Include {{spec}} for {{name}}",
    includeCharacterAria: "Include {{name}} in export",
    noDungeonsFilter: "No dungeons match the current filter.",
    selectCharacter: "Select at least one character.",
    allHaveCd: "All selected characters have CD on matching dungeons.",
  },
  gearHint: {
    kindLabelBis: "BiS",
    kindLabelUpgrades: "Upgrades",
    legendBisMeaning: "missing BiS targets from selected list",
    legendUpgradesMeaning: "stat-filtered ilvl upgrades",
    legendDismissAria: "Dismiss gear hint legend",
    bisMissing: "{{count}} missing BiS slot(s)",
    bisVariantMissing: "{{count}} normal variant(s)",
    raidLootUpgrades: "Up to {{count}} ilvl upgrade(s)",
    belowIlvl: "Up to {{count}} of {{total}} items below ilvl {{ilvl}}",
    bisBossLoot: "BiS loot in this raid",
    bisVariantBossLoot: "BiS normal variants in this raid",
    ilvlBossLoot: "Other possible upgrades in this raid",
  },
  tierSet: {
    tokensFromRaid: "Tier set tokens in this raid",
    tokenColumn: "Token",
    countColumn: "Qty",
    slotsColumn: "Slots",
  },
  storedGear: {
    ilvlUnknown: "ilvl ?",
    ilvl: "ilvl {{ilvl}}",
    itemCount: "{{count}} items",
    avgIlvl: "avg ilvl {{ilvl}}",
    unknownIds: "{{count}} unknown item id(s)",
  },
  validation: {
    characterNameRequired: "Enter a name and choose a class.",
    characterNameTooLong:
      "Character name must be at most {{max}} characters.",
    characterDuplicate:
      "A character with this name and class already exists.",
    gearScoreRange:
      "{{specLabel}} gear score must be a whole number from {{min}} to {{max}}.",
    gearScoreNeedsSpec:
      "Choose a {{specLabel}} specialization to attach a gear score.",
    invalidMainSpec: "Choose a valid main specialization for this class.",
    invalidOffSpec: "Choose a valid off specialization for this class.",
    specsMustDiffer: "Main and off specialization must be different.",
    mainSpecLabel: "Main spec",
    offSpecLabel: "Off spec",
    dungeonNameRequired: "Enter a dungeon name.",
    shortNameTooLong: "Short name must be at most {{max}} characters.",
    invalidEmblem: "Choose a valid emblem badge.",
    itemLevelRequired:
      "Enter at least one item level (e.g. 200 or range like 200 / 213).",
    bisListNameRequired: "List name is required",
    bisListNameBuiltin: "Use a custom name (not a built-in list name)",
    bisUnknownItem: "Unknown item: {{name}}",
    bisUnknownItemId: "Unknown item id: {{id}}",
    bisWrongSlot: '"{{item}}" belongs in {{expectedSlots}}, not {{slot}}',
    wsePasteRequired: "Paste WowSimsExporter JSON to import gear.",
    wseInvalidJson: "Invalid JSON. Copy the full export from /wse export.",
    wseNotObject: "Export must be a JSON object.",
    wseNoItems: "No equipped items found in the export.",
    wseClassMismatch:
      "Export class is {{exportClass}}, but this character is {{expected}}.",
    wseSpecMismatch:
      'Could not match export spec "{{spec}}" for {{class}}.',
  },
  storage: {
    corrupted:
      "Saved data was corrupted and has been reset. Your previous tracker data could not be loaded.",
    quotaExceeded: "Storage quota exceeded. Please free up space.",
    saveFailed: "Failed to save data. Please try again.",
  },
} as const;

/** Same nested keys as `enMessages`; leaf values are any locale string. */
type DeepStringMap<T> = T extends string ? string : { [K in keyof T]: DeepStringMap<T[K]> };

export type Messages = DeepStringMap<typeof enMessages>;
