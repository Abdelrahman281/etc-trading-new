'use client';

export function RetryButton({ label }: { label: string }) {
  return (
    <button
      onClick={() => window.location.reload()}
      className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-600"
    >
      {label}
    </button>
  );
}
