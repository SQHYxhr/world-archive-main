import type { ItemProfile } from "@/types";
import { ITEM_CATEGORIES, ITEM_STATUSES } from "@/types";

export function createEmptyItemProfile(): ItemProfile {
  return {
    itemCategory: "",
    status: "",
    ownerCharacterId: "",
    currentLocationId: "",
    creatorFactionId: "",
    origin: "",
    appearance: "",
    function: "",
    materials: "",
    history: "",
    limitations: "",
    creatorNotes: "",
  };
}

export function normalizeItemProfile(raw: unknown): ItemProfile {
  const empty = createEmptyItemProfile();
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return empty;

  const obj = raw as Record<string, unknown>;
  const cat = typeof obj.itemCategory === "string" ? obj.itemCategory : "";

  return {
    itemCategory:
      ITEM_CATEGORIES.includes(cat as (typeof ITEM_CATEGORIES)[number]) || cat === ""
        ? (cat as ItemProfile["itemCategory"])
        : ("" as ItemProfile["itemCategory"]),
    status:
      typeof obj.status === "string" &&
      (ITEM_STATUSES.includes(obj.status as (typeof ITEM_STATUSES)[number]) ||
        obj.status === "")
        ? (obj.status as ItemProfile["status"])
        : ("" as ItemProfile["status"]),
    ownerCharacterId:
      typeof obj.ownerCharacterId === "string" ? obj.ownerCharacterId : "",
    currentLocationId:
      typeof obj.currentLocationId === "string" ? obj.currentLocationId : "",
    creatorFactionId:
      typeof obj.creatorFactionId === "string" ? obj.creatorFactionId : "",
    origin: typeof obj.origin === "string" ? obj.origin : "",
    appearance: typeof obj.appearance === "string" ? obj.appearance : "",
    function: typeof obj.function === "string" ? obj.function : "",
    materials: typeof obj.materials === "string" ? obj.materials : "",
    history: typeof obj.history === "string" ? obj.history : "",
    limitations: typeof obj.limitations === "string" ? obj.limitations : "",
    creatorNotes: typeof obj.creatorNotes === "string" ? obj.creatorNotes : "",
  };
}
