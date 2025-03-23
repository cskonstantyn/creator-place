'use client';

import React from 'react';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';

interface DiscountDeal {
  id: string;
  title: string;
  description: string;
  discount_code: string;
  discount_amount: number;
  expiry_date: string;
  brand_name: string;
  image_url: string;
}

export default function DiscountDeals() {
  const [deals, setDeals] = useState<DiscountDeal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDeals() {
      try {
        const { data, error } = await supabase
          .from('discount_deals')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          throw error;
        }

        setDeals(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch deals');
      } finally {
        setLoading(false);
      }
    }

    fetchDeals();
  }, []);

  if (loading) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-64 bg-gray-200 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 className="text-3xl font-bold text-gray-900 mb-8">Latest Discount Deals</h2>
      {deals.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No deals available at the moment.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {deals.map((deal) => (
            <div
              key={deal.id}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              <div className="relative h-48">
                <img
                  src={deal.image_url || '/placeholder-deal.jpg'}
                  alt={deal.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full">
                  {deal.discount_amount}% OFF
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{deal.title}</h3>
                <p className="text-gray-600 mb-4">{deal.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">{deal.brand_name}</span>
                  <div className="bg-gray-100 px-3 py-1 rounded">
                    <code className="text-sm font-mono">{deal.discount_code}</code>
                  </div>
                </div>
                {deal.expiry_date && (
                  <p className="mt-4 text-sm text-gray-500">
                    Expires: {new Date(deal.expiry_date).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
