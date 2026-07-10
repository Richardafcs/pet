import { CalendarDays, PawPrint, RotateCcw } from "lucide-react";
import type { View } from "../../app/types";

type TopbarProps = {
  view: View;
  today: string;
  onNavigate: (view: View) => void;
  onNextDay: () => void;
  onResetToday: () => void;
};

export function Topbar({
  view,
  today,
  onNavigate,
  onNextDay,
  onResetToday,
}: TopbarProps) {
  return (
    <header className="topbar">
      <div className="brand">
        <PawPrint aria-hidden="true" />
        <div>
          <strong>pet</strong>
          <span>Waste-less kitchen companion</span>
        </div>
      </div>
      <div className="date-controls" aria-label="Demo date controls">
        <span>
          <CalendarDays aria-hidden="true" /> {today}
        </span>
        <button onClick={onNextDay}>Next day</button>
        <button className="icon-button" onClick={onResetToday} title="Reset to real today">
          <RotateCcw aria-hidden="true" />
        </button>
      </div>
      <nav aria-label="Main navigation">
        <button className={view === "dashboard" ? "active" : ""} onClick={() => onNavigate("dashboard")}>
          Dashboard
        </button>
        <button className={view === "add" ? "active" : ""} onClick={() => onNavigate("add")}>
          Add
        </button>
        <button className={view === "inventory" ? "active" : ""} onClick={() => onNavigate("inventory")}>
          Inventory
        </button>
        <button className={view === "impact" ? "active" : ""} onClick={() => onNavigate("impact")}>
          Impact
        </button>
      </nav>
    </header>
  );
}
