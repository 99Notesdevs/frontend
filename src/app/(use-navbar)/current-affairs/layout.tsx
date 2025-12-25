'use client';

import { ReactNode } from 'react';
import CurrentAffairsLayout from '@/components/CurrentAffairs/CurrentAffairsLayout';

export default function CurrentAffairsPageLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <CurrentAffairsLayout >
      {children}
    </CurrentAffairsLayout>
  );
}
