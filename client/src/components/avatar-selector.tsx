import { AVATAR_OPTIONS, type AvatarId } from "@shared/schema";
import { AVATARS } from "@/lib/avatars";
import { cn } from "@/lib/utils";

interface AvatarSelectorProps {
  selected: AvatarId;
  onSelect: (avatar: AvatarId) => void;
}

export function AvatarSelector({ selected, onSelect }: AvatarSelectorProps) {
  return (
    <div className="grid grid-cols-4 gap-3">
      {AVATAR_OPTIONS.map((avatarId) => (
        <button
          key={avatarId}
          type="button"
          onClick={() => onSelect(avatarId)}
          data-testid={`button-avatar-${avatarId}`}
          className={cn(
            "relative aspect-square rounded-full overflow-hidden transition-all",
            "hover-elevate active-elevate-2",
            selected === avatarId
              ? "ring-4 ring-primary shadow-lg scale-105"
              : "ring-2 ring-border hover:ring-primary/50"
          )}
        >
          <img
            src={AVATARS[avatarId]}
            alt={`Avatar ${avatarId}`}
            className="w-full h-full object-cover"
          />
        </button>
      ))}
    </div>
  );
}
