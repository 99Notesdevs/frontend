'use client';

import dynamic from 'next/dynamic';

const Content = dynamic(
  () => import('@/components/Blogs/Content'),
  { 
    ssr: false,
    loading: () => <div>Loading content...</div>
  }
);

export default function ClientContent({input}: {input: string}) {
  return <Content input={input} />;
}