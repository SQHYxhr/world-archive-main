"use client";

import { UserPlus } from "lucide-react";
import type { CharacterRelation, Entry } from "@/types";
import { Button } from "@/components/ui/button";
import { CharacterRelationCard } from "@/components/CharacterRelationCard";

interface CharacterRelationListProps {
  relations: CharacterRelation[];
  currentCharacterId: string;
  allCharacterEntries: Entry[];
  onAdd: () => void;
  onEdit: (relationId: string) => void;
  onDelete: (relationId: string) => void;
  onNavigate: (entryId: string) => void;
}

export function CharacterRelationList({
  relations,
  currentCharacterId,
  allCharacterEntries,
  onAdd,
  onEdit,
  onDelete,
  onNavigate,
}: CharacterRelationListProps) {
  return (
    <section className="rounded-xl border border-border/70 bg-card/40 p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          角色关系
        </h3>
        <Button size="sm" variant="outline" className="gap-1.5 h-7 text-xs" onClick={onAdd}>
          <UserPlus className="h-3 w-3" />
          添加关系
        </Button>
      </div>

      {relations.length === 0 ? (
        <p className="py-4 text-center text-sm text-muted-foreground">暂无关系记录</p>
      ) : (
        <div className="space-y-2">
          {relations.map((relation) => {
            const targetId =
              relation.fromCharacterId === currentCharacterId
                ? relation.toCharacterId
                : relation.fromCharacterId;
            const targetEntry = allCharacterEntries.find((e) => e.id === targetId) ?? null;

            return (
              <CharacterRelationCard
                key={relation.id}
                relation={relation}
                currentCharacterId={currentCharacterId}
                targetEntry={targetEntry}
                showActions
                onEdit={() => onEdit(relation.id)}
                onDelete={() => onDelete(relation.id)}
                onNavigate={onNavigate}
              />
            );
          })}
        </div>
      )}
    </section>
  );
}
