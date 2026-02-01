'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Claim {
  _id: string;
  dealId: {
    _id: string;
    title: string;
    description: string;
    partnerName: string;
    category: string;
    eligibilityText: string;
  };
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  isVerified: boolean;
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [claims, setClaims] = useState<Claim[]>([]);
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(false);

  useEffect(() => {
    checkAuth();
    fetchClaims();
  }, []);

  const checkAuth = async () => {
    try {
      // This would typically check for auth token, but for simplicity we'll assume logged in
      // In a real app, you'd verify the token here
      const response = await fetch('/api/auth/me'); // You'd need to implement this endpoint
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      } else {
        router.push('/auth/login');
      }
    } catch (error) {
      router.push('/auth/login');
    }
  };

  const fetchClaims = async () => {
    try {
      const response = await fetch('/api/claims/user');
      if (response.ok) {
        const data = await response.json();
        setClaims(data.claims);
      }
    } catch (error) {
      console.error('Failed to fetch claims:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    setVerifying(true);
    try {
      // In a real app, this would trigger actual verification
      // For demo purposes, we'll just toggle the state
      const response = await fetch('/api/auth/verify', {
        method: 'POST',
      });

      if (response.ok) {
        setUser(prev => prev ? { ...prev, isVerified: true } : null);
      }
    } catch (error) {
      console.error('Verification failed:', error);
    } finally {
      setVerifying(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex items-center justify-between"
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600">Welcome back, {user.name}!</p>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Logout
          </button>
        </motion.div>

        {/* Profile Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-lg shadow-sm p-6 mb-8"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Profile</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Name</p>
              <p className="font-medium">{user.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-medium">{user.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Verification Status</p>
              <div className="flex items-center gap-2">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    user.isVerified
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {user.isVerified ? 'Verified' : 'Unverified'}
                </span>
                {!user.isVerified && (
                  <button
                    onClick={handleVerify}
                    disabled={verifying}
                    className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                  >
                    {verifying ? 'Verifying...' : 'Verify Me'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Claims Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-lg shadow-sm p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">My Claims</h2>
            <Link
              href="/deals"
              className="text-indigo-600 hover:text-indigo-800 font-medium"
            >
              Browse More Deals →
            </Link>
          </div>

          {claims.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">You haven't claimed any deals yet.</p>
              <Link
                href="/deals"
                className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
              >
                Explore Deals
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {claims.map((claim) => (
                <div
                  key={claim._id}
                  className="p-6 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {claim.dealId.title}
                        </h3>
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full capitalize">
                          {claim.dealId.category}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        by <span className="font-medium">{claim.dealId.partnerName}</span>
                      </p>
                      <p className="text-sm text-gray-700 mb-3 line-clamp-2">
                        {claim.dealId.description}
                      </p>
                      <div className="text-xs text-gray-500 space-y-1">
                        <p>
                          <span className="font-medium">Eligibility:</span> {claim.dealId.eligibilityText}
                        </p>
                        <p>
                          Claimed on {new Date(claim.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="ml-4 flex flex-col items-end gap-2">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          claim.status === 'approved'
                            ? 'bg-green-100 text-green-800'
                            : claim.status === 'rejected'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {claim.status.charAt(0).toUpperCase() + claim.status.slice(1)}
                      </span>
                      <Link
                        href={`/deals/${claim.dealId._id}`}
                        className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                      >
                        View Details →
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
