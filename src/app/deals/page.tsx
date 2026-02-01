'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface Deal {
  _id: string;
  title: string;
  description: string;
  partnerName: string;
  category: string;
  isLocked: boolean;
  eligibilityText: string;
}

export default function DealsPage() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchDeals();
  }, [category, search]);

  const fetchDeals = async () => {
    try {
      const params = new URLSearchParams();
      if (category) params.append('category', category);
      if (search) params.append('search', search);

      const response = await fetch(`/api/deals?${params}`);
      const data = await response.json();

      if (response.ok && data.deals) {
        setDeals(data.deals);
      } else {
        console.error('Failed to fetch deals:', data.error);
        setDeals([]);
      }
    } catch (error) {
      console.error('Failed to fetch deals:', error);
      setDeals([]);
    } finally {
      setLoading(false);
    }
  };

  const categories = ['tools', 'services', 'marketing', 'finance'];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Available Deals</h1>
          <p className="text-gray-600">Discover exclusive offers for startups</p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8 bg-white p-6 rounded-lg shadow-sm"
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search deals..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            <div>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </motion.div>

        {/* Deals Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {deals.map((deal, index) => (
            <motion.div
              key={deal._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow ${
                deal.isLocked ? 'border-2 border-yellow-200' : ''
              }`}
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {deal.title}
                    </h3>
                    <p className="text-sm text-gray-500">{deal.partnerName}</p>
                  </div>
                  {deal.isLocked && (
                    <div className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">
                      Locked
                    </div>
                  )}
                </div>

                <p className="text-gray-600 mb-4 line-clamp-3">
                  {deal.description}
                </p>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500 capitalize">
                    {deal.category}
                  </span>
                  <Link
                    href={`/deals/${deal._id}`}
                    className="text-indigo-600 hover:text-indigo-800 font-medium"
                  >
                    View Details →
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {deals.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <p className="text-gray-500">No deals found matching your criteria.</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
