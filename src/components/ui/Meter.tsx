export function Meter({ label, value }: { label: string; value: number }) {
  return (
    <label className="meter">
      <span>
        {label} <strong>{value}</strong>
      </span>
      <progress value={value} max={100} />
    </label>
  );
}
