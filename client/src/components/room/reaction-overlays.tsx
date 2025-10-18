import { type ReactionOverlay } from "@shared/schema";
import { useEffect, useState } from "react";

interface ReactionOverlaysProps {
  reactions: ReactionOverlay[];
}

export function ReactionOverlays({ reactions }: ReactionOverlaysProps) {
  return (
    <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
      {reactions.map((reaction) => (
        <FloatingReaction key={reaction.id} reaction={reaction} />
      ))}
    </div>
  );
}

function FloatingReaction({ reaction }: { reaction: ReactionOverlay }) {
  const [position] = useState({
    left: Math.random() * 80 + 10, // 10-90%
    bottom: -10
  });

  return (
    <div
      className="absolute text-6xl animate-float-up"
      style={{
        left: `${position.left}%`,
        bottom: `${position.bottom}%`,
        animation: 'float-up 3s ease-out forwards'
      }}
    >
      <style>{`
        @keyframes float-up {
          0% {
            transform: translateY(0) scale(0);
            opacity: 0;
          }
          20% {
            opacity: 1;
            transform: scale(1);
          }
          100% {
            transform: translateY(-100vh) scale(1.5);
            opacity: 0;
          }
        }
      `}</style>
      {reaction.emoji}
    </div>
  );
}
