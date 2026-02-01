'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
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

export default function DealDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [deal, setDeal] = useState<Deal | null>(null);
  const [loading, setLoading] = useState(true);
  const [claiming, setClaiming] = useState(false);
  const [canClaim, setCanClaim] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (params.id) {
      fetchDeal();
    }
  }, [params.id]);

  const fetchDeal = async () => {
    try {
      const response = await fetch(`/api/deals/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setDeal(data.deal);
        setCanClaim(data.canClaim);
      } else {
        router.push('/deals');
      }
    } catch (error) {
      console.error('Failed to fetch deal:', error);
      router.push('/deals');
    } finally {
      setLoading(false);
    }
  };

  const handleClaim = async () => {
    setClaiming(true);
    setError('');

    try {
      const response = await fetch('/api/claims', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ dealId: params.id }),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Deal claimed successfully! Check your dashboard for status.');
        router.push('/dashboard');
      } else {
        setError(data.error || 'Failed to claim deal');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setClaiming(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!deal) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Deal not found</h1>
          <Link
            href="/deals"
            className="text-indigo-600 hover:text-indigo-800"
          >
            ← Back to deals
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          {/* Back button */}
          <Link
            href="/deals"
            className="inline-flex items-center text-indigo-600 hover:text-indigo-800 mb-6"
          >
            ← Back to deals
          </Link>

          {/* Deal header */}
          <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {deal.title}
                </h1>
                <p className="text-lg text-gray-600">{deal.partnerName}</p>
              </div>
              {deal.isLocked && (
                <div className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full text-sm font-medium">
                  Verification Required
                </div>
              )}
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Deal Details
                </h2>
                <p className="text-gray-700 mb-6 leading-relaxed">
                  {deal.description}
                </p>

                <div className="space-y-3">
                  <div>
                    <span className="font-medium text-gray-900">Category:</span>
                    <span className="ml-2 capitalize text-gray-600">
                      {deal.category}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-900">Eligibility:</span>
                    <p className="mt-1 text-gray-600">{deal.eligibilityText}</p>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Claim This Deal
                </h2>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
                    {error}
                  </div>
                )}

                {canClaim ? (
                  <button
                    onClick={handleClaim}
                    disabled={claiming}
                    className="w-full bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {claiming ? 'Claiming...' : 'Claim This Deal'}
                  </button>
                ) : (
                  <div className="bg-gray-50 border border-gray-200 px-6 py-4 rounded-lg">
                    <p className="text-gray-600 mb-3">
                      {deal.isLocked
                        ? 'This deal requires verification. Please verify your account in the dashboard.'
                        : 'You need to be logged in to claim this deal.'
                      }
                    </p>
                    {deal.isLocked ? (
                      <Link
                        href="/dashboard"
                        className="text-indigo-600 hover:text-indigo-800 font-medium"
                      >
                        Go to Dashboard →
                      </Link>
                    ) : (
                      <Link
                        href="/auth/login"
                        className="text-indigo-600 hover:text-indigo-800 font-medium"
                      >
                        Sign In →
                      </Link>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
