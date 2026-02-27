'use client';

export default function PdfHeleButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="rounded bg-sauda-primary px-4 py-2 text-sm font-medium text-white hover:bg-sauda-mid print:hidden"
    >
      Last ned hele håndboken som PDF
    </button>
  );
}
