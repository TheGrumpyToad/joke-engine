'use client';

import { useAuth } from '@/contexts/AuthContext';
import { getUserStats } from '@/lib/userQuestions';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface UserStats {
  id?: string;
  userId: string;
  totalGenerations: number;
  roastsGenerated: number;
  punsGenerated: number;
  riddlesGenerated: number;
  storiesGenerated: number;
  totalWordsGenerated: number;
  averageResponseTime: number;
  lastActive: any;
  createdAt: any;
}

export const UserStats = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      if (user) {
        try {
          const userStats = await getUserStats(user.uid);
          setStats(userStats);
        } catch (error) {
          console.error('Error fetching user stats:', error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user]);

  if (!user || loading) {
    return null;
  }

  if (!stats) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-slate-800/50 backdrop-blur-sm border border-slate-600/50 rounded-2xl p-6 mb-8"
      >
        <h3 className="text-white font-semibold text-lg mb-4">Your Stats</h3>
        <p className="text-slate-400">No generations yet. Start creating to see your stats!</p>
      </motion.div>
    );
  }

  const totalGenerations = stats.totalGenerations || 0;
  const roastsGenerated = stats.roastsGenerated || 0;
  const punsGenerated = stats.punsGenerated || 0;
  const riddlesGenerated = stats.riddlesGenerated || 0;
  const storiesGenerated = stats.storiesGenerated || 0;
  const totalWordsGenerated = stats.totalWordsGenerated || 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-slate-800/50 backdrop-blur-sm border border-slate-600/50 rounded-2xl p-6 mb-8"
    >
      <h3 className="text-white font-semibold text-lg mb-6">Your Comedy Stats</h3>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-400">{totalGenerations}</div>
          <div className="text-slate-400 text-sm">Total Generations</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-red-400">{roastsGenerated}</div>
          <div className="text-slate-400 text-sm">Roasts</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-yellow-400">{punsGenerated}</div>
          <div className="text-slate-400 text-sm">Puns</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-400">{riddlesGenerated}</div>
          <div className="text-slate-400 text-sm">Riddles</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-green-400">{storiesGenerated}</div>
          <div className="text-slate-400 text-sm">Stories</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-pink-400">{totalWordsGenerated.toLocaleString()}</div>
          <div className="text-slate-400 text-sm">Words Generated</div>
        </div>
      </div>

      {stats.lastActive && (
        <div className="mt-4 pt-4 border-t border-slate-600/50">
          <p className="text-slate-400 text-sm text-center">
            Last active: {new Date(stats.lastActive.seconds * 1000).toLocaleDateString()}
          </p>
        </div>
      )}
    </motion.div>
  );
};
