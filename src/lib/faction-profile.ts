import type { Entry, FactionProfile } from "@/types";
import { FACTION_CATEGORIES, FACTION_STATUSES } from "@/types";

export function createEmptyFactionProfile(): FactionProfile {
  return {
    factionCategory: "",
    status: "",
    parentFactionId: "",
    headquartersLocationId: "",
    ideology: "",
    structure: "",
    influence: "",
    history: "",
    creatorNotes: "",
  };
}

export function normalizeFactionProfile(raw: unknown): FactionProfile {
  const empty = createEmptyFactionProfile();
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return empty;

  const obj = raw as Record<string, unknown>;
  const cat = typeof obj.factionCategory === "string" ? obj.factionCategory : "";

  return {
    factionCategory:
      FACTION_CATEGORIES.includes(cat as (typeof FACTION_CATEGORIES)[number]) || cat === ""
        ? (cat as FactionProfile["factionCategory"])
        : ("" as FactionProfile["factionCategory"]),
    status:
      typeof obj.status === "string" &&
      (FACTION_STATUSES.includes(obj.status as (typeof FACTION_STATUSES)[number]) ||
        obj.status === "")
        ? (obj.status as FactionProfile["status"])
        : ("" as FactionProfile["status"]),
    parentFactionId:
      typeof obj.parentFactionId === "string" ? obj.parentFactionId : "",
    headquartersLocationId:
      typeof obj.headquartersLocationId === "string" ? obj.headquartersLocationId : "",
    ideology: typeof obj.ideology === "string" ? obj.ideology : "",
    structure: typeof obj.structure === "string" ? obj.structure : "",
    influence: typeof obj.influence === "string" ? obj.influence : "",
    history: typeof obj.history === "string" ? obj.history : "",
    creatorNotes: typeof obj.creatorNotes === "string" ? obj.creatorNotes : "",
  };
}

export function wouldCreateFactionCycle(
  entries: Entry[],
  currentFactionId: string,
  parentFactionId: string,
): boolean {
  if (!parentFactionId) return false;
  if (parentFactionId === currentFactionId) return true;

  const visited = new Set<string>();
  let cursor: string | undefined = parentFactionId;

  while (cursor) {
    if (cursor === currentFactionId) return true;
    if (visited.has(cursor)) return true;
    visited.add(cursor);

    const parent = entries.find((e) => e.id === cursor);
    cursor = parent?.factionProfile?.parentFactionId || undefined;
  }

  return false;
}
