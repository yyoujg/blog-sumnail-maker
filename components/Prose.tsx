export function Prose({ className = '', children }: { className?: string; children: React.ReactNode }) {
  return <div className={`max-w-3xl ${className}`}>{children}</div>;
}
