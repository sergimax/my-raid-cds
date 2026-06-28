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
    filterByDungeonName: "Filter by dungeon name",
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
      "Filter dungeons with the table search, then copy lines below — one per matching raid listing characters still without CD (toggle off). Check which specs to include for each character.",
    noCharacters: "Add a character to build a status summary.",
    exportText: "Export text",
    includeSpecAria: "Include {{spec}} for {{name}}",
    includeCharacterAria: "Include {{name}} in export",
    textareaAria: "Characters without CD per dungeon, for copy",
    noDungeonsFilter: "No dungeons match the current filter.",
    selectCharacter: "Select at least one character.",
    allHaveCd: "All selected characters have CD on matching dungeons.",
  },
  gearHint: {
    bisMissing: "{{count}} BiS slot(s) missing targets",
    raidLootUpgrades: "Up to {{count}} slot(s) may have higher-ilvl raid loot",
    belowIlvl: "Up to {{count}} of {{total}} items may be below ilvl {{ilvl}}",
    ilvlEquipableOnly:
      "Equipable for your class/spec; ilvl loot filtered by spec-relevant stats.",
    moreSlots: "+{{count}} more",
    slotArrow: "{{slot}} → {{item}}",
    bisBossLoot: "BiS loot in this raid",
  },
  tierSet: {
    tokensFromRaid: "{{count}} tier set token(s) from this raid",
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
