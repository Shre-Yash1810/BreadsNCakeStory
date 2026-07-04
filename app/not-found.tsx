import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#FAF7F2] flex flex-col items-center justify-center p-4 text-center font-sans">
      <h2 className="heading-luxury text-3xl font-bold text-[#2E1C1A] mb-2">Sweet Page Not Found</h2>
      <p className="text-sm text-[#3E2723] mb-6">The dessert page you are looking for has been moved or eaten.</p>
      <Link
        href="/"
        className="bg-gold-gradient text-white px-6 py-2.5 rounded-xl font-bold shadow-md"
      >
        Go Back to storefront
      </Link>
    </div>
  );
}
