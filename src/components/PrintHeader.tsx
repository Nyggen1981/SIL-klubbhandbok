'use client';

export default function PrintHeader({ basePath = '' }: { basePath?: string }) {
  return (
    <div className="print-header hidden print:!block" aria-hidden>
      <div className="px-4 flex items-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`${basePath}/images/Logo.png`}
          alt="Sauda IL"
          className="h-10 w-auto object-contain"
          onError={(e) => {
            e.currentTarget.style.display = 'none';
            e.currentTarget.nextElementSibling?.classList.remove('hidden');
          }}
        />
        <span className="hidden font-semibold text-sauda-dark">Sauda IL</span>
      </div>
    </div>
  );
}
