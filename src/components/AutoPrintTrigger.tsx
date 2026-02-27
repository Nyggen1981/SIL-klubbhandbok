'use client';

import { useEffect } from 'react';

export default function AutoPrintTrigger({ autoPrint }: { autoPrint: boolean }) {
  useEffect(() => {
    if (autoPrint) {
      window.print();
    }
  }, [autoPrint]);
  return null;
}
