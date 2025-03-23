import DiscountDeals from '@/components/deals/DiscountDeals';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-gray-900">Creator Deals</h1>
        </div>
      </header>
      
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <DiscountDeals />
      </div>
    </main>
  );
}