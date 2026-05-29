"use client";

import { useState } from "react";
import { Pin, Star } from "lucide-react";
import type { Entry, EntryFormData, ItemProfile } from "@/types";
import { createEmptyItemProfile } from "@/lib/item-profile";
import { ITEM_CATEGORY_LABELS, ITEM_CATEGORIES, ITEM_STATUS_LABELS, ITEM_STATUSES } from "@/types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ImagePicker } from "@/components/ImagePicker";
import { GalleryEditor } from "@/components/GalleryEditor";
import { RichTextEditor } from "@/components/RichTextEditor";
import { TagInput } from "@/components/TagInput";
import { RelatedEntryPicker } from "@/components/RelatedEntryPicker";
import { EntryRefSelect } from "@/components/EntryRefSelect";

interface ItemEditorProps {
  form: EntryFormData;
  setForm: React.Dispatch<React.SetStateAction<EntryFormData>>;
  entry: Entry | null;
  projectEntries: Entry[];
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="font-serif text-sm font-semibold text-foreground/90">{children}</h3>
  );
}

export function ItemEditor({ form, setForm, entry, projectEntries }: ItemEditorProps) {
  const [inlineInsert, setInlineInsert] = useState<((url: string, alt?: string) => void) | null>(null);
  const [inlineAlt, setInlineAlt] = useState("");

  const profile = form.itemProfile ?? createEmptyItemProfile();

  const setProfile = (patch: Partial<ItemProfile>) => {
    setForm((prev) => ({
      ...prev,
      itemProfile: { ...(prev.itemProfile ?? createEmptyItemProfile()), ...patch },
    }));
  };

  const updateAltMap = (src: string, alt: string) => {
    setForm((prev) => ({
      ...prev,
      imageAltMap: { ...prev.imageAltMap, [src]: alt },
    }));
  };

  return (
    <>
      <section className="space-y-4 rounded-xl border border-border/70 bg-card/30 p-4">
        <SectionTitle>基础信息</SectionTitle>
        <div className="space-y-2">
          <Label htmlFor="item-name">物品名称</Label>
          <Input
            id="item-name"
            placeholder="如：残响护符"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="item-summary">一句话摘要</Label>
          <Textarea
            id="item-summary"
            placeholder="用一句话介绍这个物品"
            value={form.summary}
            onChange={(e) => setForm({ ...form, summary: e.target.value })}
            rows={2}
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label htmlFor="item-category">物品类型</Label>
            <select
              id="item-category"
              value={profile.itemCategory}
              onChange={(e) => setProfile({ itemCategory: e.target.value as ItemProfile["itemCategory"] })}
              className="flex h-9 w-full rounded-lg border border-input bg-card px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {(["", ...ITEM_CATEGORIES] as const).map((c) => (
                <option key={c} value={c}>
                  {ITEM_CATEGORY_LABELS[c]}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="item-status">当前状态</Label>
            <select
              id="item-status"
              value={profile.status}
              onChange={(e) => setProfile({ status: e.target.value as ItemProfile["status"] })}
              className="flex h-9 w-full rounded-lg border border-input bg-card px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {(["", ...ITEM_STATUSES] as const).map((s) => (
                <option key={s} value={s}>
                  {ITEM_STATUS_LABELS[s]}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      <section className="space-y-4 rounded-xl border border-border/70 bg-card/30 p-4">
        <SectionTitle>归属与位置</SectionTitle>
        <EntryRefSelect
          label="当前持有者"
          value={profile.ownerCharacterId}
          entries={projectEntries}
          filterType="character"
          onChange={(ownerCharacterId) => setProfile({ ownerCharacterId })}
        />
        <EntryRefSelect
          label="当前所在地"
          value={profile.currentLocationId}
          entries={projectEntries}
          filterType="location"
          onChange={(currentLocationId) => setProfile({ currentLocationId })}
        />
        <EntryRefSelect
          label="制造 / 所属组织"
          value={profile.creatorFactionId}
          entries={projectEntries}
          filterType="faction"
          onChange={(creatorFactionId) => setProfile({ creatorFactionId })}
        />
      </section>

      <section className="space-y-4 rounded-xl border border-border/70 bg-card/30 p-4">
        <SectionTitle>外观与功能</SectionTitle>
        <div className="space-y-2">
          <Label htmlFor="item-appearance">外观描述</Label>
          <Textarea
            id="item-appearance"
            placeholder="该物品的外形、颜色、尺寸、独特标识等"
            value={profile.appearance}
            onChange={(e) => setProfile({ appearance: e.target.value })}
            rows={3}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="item-function">功能 / 用途</Label>
          <Textarea
            id="item-function"
            placeholder="该物品的主要功能、使用方式与效果"
            value={profile.function}
            onChange={(e) => setProfile({ function: e.target.value })}
            rows={3}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="item-materials">材质 / 构造</Label>
          <Textarea
            id="item-materials"
            placeholder="该物品的材质构成、制作工艺或特殊构造"
            value={profile.materials}
            onChange={(e) => setProfile({ materials: e.target.value })}
            rows={3}
          />
        </div>
      </section>

      <section className="space-y-4 rounded-xl border border-border/70 bg-card/30 p-4">
        <SectionTitle>来源与历史</SectionTitle>
        <div className="space-y-2">
          <Label htmlFor="item-origin">来源 / 出处</Label>
          <Textarea
            id="item-origin"
            placeholder="该物品的起源、创造者或获得方式"
            value={profile.origin}
            onChange={(e) => setProfile({ origin: e.target.value })}
            rows={3}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="item-history">历史沿革</Label>
          <Textarea
            id="item-history"
            placeholder="该物品的历史流转、重大事件与传承脉络"
            value={profile.history}
            onChange={(e) => setProfile({ history: e.target.value })}
            rows={4}
          />
        </div>
      </section>

      <section className="space-y-4 rounded-xl border border-border/70 bg-card/30 p-4">
        <SectionTitle>限制与备注</SectionTitle>
        <div className="space-y-2">
          <Label htmlFor="item-limitations">限制 / 副作用</Label>
          <Textarea
            id="item-limitations"
            placeholder="该物品的使用限制、代价、副作用或冷却条件"
            value={profile.limitations}
            onChange={(e) => setProfile({ limitations: e.target.value })}
            rows={3}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="item-creator-notes">创作备注</Label>
          <Textarea
            id="item-creator-notes"
            placeholder="关于该物品的创作想法、灵感来源或待定设定"
            value={profile.creatorNotes}
            onChange={(e) => setProfile({ creatorNotes: e.target.value })}
            rows={3}
          />
        </div>
      </section>

      <section className="space-y-4 rounded-xl border border-border/70 bg-card/30 p-4">
        <SectionTitle>视觉资产</SectionTitle>
        <ImagePicker
          label="封面图"
          value={form.coverImage}
          alt={form.imageAltMap?.[form.coverImage] || ""}
          onChange={(src) => setForm({ ...form, coverImage: src })}
          onAltChange={(alt) => form.coverImage && updateAltMap(form.coverImage, alt)}
          onRemove={() => setForm({ ...form, coverImage: "" })}
        />
        <GalleryEditor
          images={form.galleryImages}
          imageAltMap={form.imageAltMap}
          onChange={(galleryImages, imageAltMap) =>
            setForm({ ...form, galleryImages, imageAltMap })
          }
        />
      </section>

      <section className="space-y-4 rounded-xl border border-border/70 bg-card/30 p-4">
        <SectionTitle>附加笔记</SectionTitle>
        <p className="text-xs text-muted-foreground">
          可选：使用富文本记录更多物品细节与补充设定。
        </p>
        <RichTextEditor
          value={form.content}
          onChange={(content) => setForm({ ...form, content })}
          onInsertImage={(insert) => {
            setInlineAlt("");
            setInlineInsert(() => insert);
          }}
        />
      </section>

      <TagInput tags={form.tags} onChange={(tags) => setForm({ ...form, tags })} />

      <RelatedEntryPicker
        entries={projectEntries}
        selectedIds={form.relatedEntryIds}
        currentEntryId={entry?.id}
        onChange={(relatedEntryIds) => setForm({ ...form, relatedEntryIds })}
      />

      <div className="flex gap-4">
        <label className="flex cursor-pointer items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.isFavorite}
            onChange={(e) => setForm({ ...form, isFavorite: e.target.checked })}
            className="rounded border-input"
          />
          <Star className="h-3.5 w-3.5" />
          收藏
        </label>
        <label className="flex cursor-pointer items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.isPinned}
            onChange={(e) => setForm({ ...form, isPinned: e.target.checked })}
            className="rounded border-input"
          />
          <Pin className="h-3.5 w-3.5" />
          置顶
        </label>
      </div>

      <Dialog open={!!inlineInsert} onOpenChange={(open) => !open && setInlineInsert(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>插入正文图片</DialogTitle>
            <DialogDescription>图片将插入到附加笔记当前光标位置</DialogDescription>
          </DialogHeader>
          <ImagePicker
            label="正文插图"
            value=""
            alt={inlineAlt}
            onChange={(src) => {
              inlineInsert?.(src, inlineAlt || "设定插图");
              setInlineInsert(null);
            }}
            onAltChange={setInlineAlt}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
