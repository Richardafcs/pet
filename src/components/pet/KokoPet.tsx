import { useEffect, useState } from "react";
import type { PetState } from "../../types/domain";

type KokoPetProps = {
  visualState: PetState["visualState"];
  energy: number;
  onInteract?: () => void;
};

type KokoMode =
  | "idle"
  | "happy"
  | "sad"
  | "bored"
  | "ill"
  | "energetic"
  | "waiting";

const modeCopy: Record<KokoMode, string> = {
  idle: "Koko is calm",
  happy: "Koko is happy and waving",
  sad: "Koko is feeling sad",
  bored: "Koko is bored and thinking",
  ill: "Koko is feeling ill and needs care",
  energetic: "Koko is full of energy",
  waiting: "Koko is waiting for a food rescue",
};

function getMode(visualState: PetState["visualState"], energy: number): KokoMode {
  if (visualState === "sick") return "ill";
  if (visualState === "sad") return "sad";
  if (visualState === "tired") return "bored";
  if (visualState === "hungry") return "waiting";
  if (visualState === "happy" && energy >= 82) return "energetic";
  if (visualState === "happy") return "happy";
  return "idle";
}

export function KokoPet({ visualState, energy, onInteract }: KokoPetProps) {
  const [isInteracting, setIsInteracting] = useState(false);
  const mode = getMode(visualState, energy);
  const activeMode = isInteracting ? "happy" : mode;

  useEffect(() => {
    if (!isInteracting) return;
    const timer = window.setTimeout(() => setIsInteracting(false), 1800);
    return () => window.clearTimeout(timer);
  }, [isInteracting]);

  function handleInteract() {
    setIsInteracting(true);
    onInteract?.();
  }

  return (
    <span
      className={`koko-pet koko-pet-${activeMode}`}
      role="img"
      aria-label={modeCopy[activeMode]}
      onClick={handleInteract}
    >
      <span className="koko-sprite" aria-hidden="true" />
      <span className="koko-spark" aria-hidden="true" />
    </span>
  );
}
