export type EntryType =
  | "character"
  | "location"
  | "faction"
  | "item"
  | "species"
  | "event"
  | "lore"
  | "note";

/** 角色专属结构化档案（仅 character 类型使用，其他类型可忽略） */
export interface CharacterProfile {
  displayName: string;
  aliases: string[];
  pronouns: string;
  ageText: string;
  gender: string;
  identity: string;
  factionId: string;
  locationId: string;
  speciesId: string;
  appearance: string;
  personality: string;
  abilities: string;
  goals: string;
  background: string;
  trivia: string;
  statusText: string;
  quote: string;
}

/** 角色关系类型预设 */
export const RELATION_TYPES = [
  "friend",
  "family",
  "lover",
  "enemy",
  "mentor",
  "student",
  "ally",
  "rival",
  "colleague",
  "superior",
  "subordinate",
  "unknown",
] as const;

export type RelationType = (typeof RELATION_TYPES)[number];

export const RELATION_TYPE_LABELS: Record<RelationType, string> = {
  friend: "朋友",
  family: "家人",
  lover: "恋人",
  enemy: "敌人",
  mentor: "导师",
  student: "学生",
  ally: "盟友",
  rival: "对手",
  colleague: "同事",
  superior: "上司",
  subordinate: "下属",
  unknown: "未知",
};

export type RelationDirection = "directed" | "mutual";
export type RelationStatus = "current" | "past" | "ambiguous";

export interface CharacterRelation {
  id: string;
  projectId: string;
  fromCharacterId: string;
  toCharacterId: string;
  relationType: RelationType;
  customLabel: string;
  direction: RelationDirection;
  status: RelationStatus;
  note: string;
  createdAt: string;
  updatedAt: string;
}

export const LOCATION_CATEGORIES = [
  "city",
  "academy",
  "building",
  "country",
  "region",
  "ruin",
  "realm",
  "natural",
  "other",
] as const;

export type LocationCategory = "" | (typeof LOCATION_CATEGORIES)[number];

export const LOCATION_CATEGORY_LABELS: Record<LocationCategory, string> = {
  "": "未选择",
  city: "城市",
  academy: "学院",
  building: "建筑",
  country: "国家",
  region: "区域",
  ruin: "遗迹",
  realm: "秘境",
  natural: "自然区域",
  other: "其他",
};

export const LOCATION_STATUSES = [
  "active",
  "abandoned",
  "destroyed",
  "sealed",
  "lost",
  "unknown",
] as const;

export type LocationStatus = "" | (typeof LOCATION_STATUSES)[number];

export const LOCATION_STATUS_LABELS: Record<LocationStatus, string> = {
  "": "未选择",
  active: "正常",
  abandoned: "废弃",
  destroyed: "毁灭",
  sealed: "封锁 / 封印",
  lost: "失落",
  unknown: "未知",
};

export interface LocationProfile {
  locationCategory: LocationCategory;
  status: LocationStatus;
  parentLocationId: string;
  governingFactionId: string;
  environment: string;
  landmarks: string;
  history: string;
  access: string;
  creatorNotes: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface Entry {
  id: string;
  projectId: string;
  type: EntryType;
  title: string;
  summary: string;
  content: string;
  coverImage: string;
  galleryImages: string[];
  imageAltMap?: Record<string, string>;
  createdAt: string;
  updatedAt: string;
  isFavorite: boolean;
  isPinned: boolean;
  tags: string[];
  relatedEntryIds: string[];
  /** 角色结构化档案；仅 type === "character" 时有效 */
  characterProfile?: CharacterProfile;
  /** 地点结构化档案；仅 type === "location" 时有效 */
  locationProfile?: LocationProfile;
}

export interface AppData {
  projects: Project[];
  entries: Entry[];
  characterRelations: CharacterRelation[];
}

export const ENTRY_TYPES: EntryType[] = [
  "character",
  "location",
  "faction",
  "item",
  "species",
  "event",
  "lore",
  "note",
];

export const ENTRY_TYPE_LABELS: Record<EntryType, string> = {
  character: "角色",
  location: "地点",
  faction: "组织",
  item: "物品",
  species: "种族",
  event: "事件",
  lore: "世界观",
  note: "笔记",
};

export const ENTRY_TYPE_ICONS: Record<EntryType, string> = {
  character: "👤",
  location: "📍",
  faction: "⚔️",
  item: "💎",
  species: "🌿",
  event: "📜",
  lore: "🌍",
  note: "📝",
};

export type EntryFormData = Pick<
  Entry,
  | "type"
  | "title"
  | "summary"
  | "content"
  | "coverImage"
  | "galleryImages"
  | "imageAltMap"
  | "isFavorite"
  | "isPinned"
  | "tags"
  | "relatedEntryIds"
  | "characterProfile"
  | "locationProfile"
>;

export type ProjectFormData = Pick<Project, "name" | "description">;

export const ENTRY_IMAGE_FIELDS = {
  coverImage: "",
  galleryImages: [] as string[],
  imageAltMap: {} as Record<string, string>,
};
