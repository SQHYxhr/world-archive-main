"use client";

import { useState } from "react";
import { Pin, Star } from "lucide-react";
import type { Entry, EntryFormData, FactionProfile } from "@/types";
import { createEmptyFactionProfile } from "@/lib/faction-profile";
import { FACTION_CATEGORY_LABELS, FACTION_CATEGORIES, FACTION_STATUS_LABELS, FACTION_STATUSES } from "@/types";
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

interface FactionEditorProps {
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

export function FactionEditor({ form, setForm, entry, projectEntries }: FactionEditorProps) {
  const [inlineInsert, setInlineInsert] = useState<((url: string, alt?: string) => void) | null>(null);
  const [inlineAlt, setInlineAlt] = useState("");

  const profile = form.factionProfile ?? createEmptyFactionProfile();

  const setProfile = (patch: Partial<FactionProfile>) => {
    setForm((prev) => ({
      ...prev,
      factionProfile: { ...(prev.factionProfile ?? createEmptyFactionProfile()), ...patch },
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
          <Label htmlFor="faction-name">组织名称</Label>
          <Input
            id="faction-name"
            placeholder="如：银翼骑士团"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="faction-summary">一句话摘要</Label>
          <Textarea
            id="faction-summary"
            placeholder="用一句话介绍这个组织"
            value={form.summary}
            onChange={(e) => setForm({ ...form, summary: e.target.value })}
            rows={2}
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label htmlFor="faction-category">组织类型</Label>
            <select
              id="faction-category"
              value={profile.factionCategory}
              onChange={(e) => setProfile({ factionCategory: e.target.value as FactionProfile["factionCategory"] })}
              className="flex h-9 w-full rounded-lg border border-input bg-card px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {(["", ...FACTION_CATEGORIES] as const).map((c) => (
                <option key={c} value={c}>
                  {FACTION_CATEGORY_LABELS[c]}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="faction-status">当前状态</Label>
            <select
              id="faction-status"
              value={profile.status}
              onChange={(e) => setProfile({ status: e.target.value as FactionProfile["status"] })}
              className="flex h-9 w-full rounded-lg border border-input bg-card px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {(["", ...FACTION_STATUSES] as const).map((s) => (
                <option key={s} value={s}>
                  {FACTION_STATUS_LABELS[s]}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      <section className="space-y-4 rounded-xl border border-border/70 bg-card/30 p-4">
        <SectionTitle>层级与据点</SectionTitle>
        <EntryRefSelect
          label="上级组织"
          value={profile.parentFactionId}
          entries={projectEntries}
          filterType="faction"
          excludeId={entry?.id}
          onChange={(parentFactionId) => setProfile({ parentFactionId })}
        />
        <EntryRefSelect
          label="总部地点"
          value={profile.headquartersLocationId}
          entries={projectEntries}
          filterType="location"
          onChange={(headquartersLocationId) => setProfile({ headquartersLocationId })}
        />
      </section>

      <section className="space-y-4 rounded-xl border border-border/70 bg-card/30 p-4">
        <SectionTitle>理念与结构</SectionTitle>
        <div className="space-y-2">
          <Label htmlFor="faction-ideology">理念 / 目标</Label>
          <Textarea
            id="faction-ideology"
            placeholder="该组织的核心理念、信仰体系或主要目标"
            value={profile.ideology}
            onChange={(e) => setProfile({ ideology: e.target.value })}
            rows={3}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="faction-structure">组织结构</Label>
          <Textarea
            id="faction-structure"
            placeholder="该组织的内部架构、层级关系、领导体系与运作方式"
            value={profile.structure}
            onChange={(e) => setProfile({ structure: e.target.value })}
            rows={3}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="faction-influence">影响力 / 势力范围</Label>
          <Textarea
            id="faction-influence"
            placeholder="该组织的影响范围、控制区域、政治或经济实力"
            value={profile.influence}
            onChange={(e) => setProfile({ influence: e.target.value })}
            rows={3}
          />
        </div>
      </section>

      <section className="space-y-4 rounded-xl border border-border/70 bg-card/30 p-4">
        <SectionTitle>历史与备注</SectionTitle>
        <div className="space-y-2">
          <Label htmlFor="faction-history">历史沿革</Label>
          <Textarea
            id="faction-history"
            placeholder="该组织的创立背景、重大事件与发展脉络"
            value={profile.history}
            onChange={(e) => setProfile({ history: e.target.value })}
            rows={4}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="faction-creator-notes">创作备注</Label>
          <Textarea
            id="faction-creator-notes"
            placeholder="关于该组织的创作想法、灵感来源或待定设定"
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
          可选：使用富文本记录更多组织细节与补充设定。
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
