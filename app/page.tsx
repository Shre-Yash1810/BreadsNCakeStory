import { Suspense } from 'react';
import HomeClient from '@/components/HomeClient';

export const dynamic = 'force-dynamic';

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FAF7F2]" />}>
      <HomeClient />
    </Suspense>
  );
}
