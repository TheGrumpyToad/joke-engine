'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getAllUserStats, UserStats } from '@/lib/userQuestions';
import { UserDetailModal } from './UserDetailModal';
import { ArrowLeft, Users, Trophy, TrendingUp } from 'lucide-react';
import { useRouter } from 'next/navigation';

export const UserList = () => {
  const [users, setUsers] = useState<UserStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<UserStats | null>(null);
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const userStats = await getAllUserStats();
        setUsers(userStats);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleUserClick = (user: UserStats) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedUser(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white/70 text-lg">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-40">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5"></div>
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px'
        }}></div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="sticky top-0 z-50 bg-black/30 backdrop-blur-md border-b border-white/10">
          <div className="container mx-auto px-6 py-4 max-w-6xl">
            <div className="flex items-center justify-between">
              <button 
                onClick={() => router.push('/')}
                className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-300"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Home
              </button>
              
              <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                <Users className="w-6 h-6" />
                User Leaderboard
              </h1>
              
              <div className="text-slate-400 text-sm">
                {users.length} users
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="container mx-auto px-6 py-8 max-w-6xl">
          {users.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16"
            >
              <div className="text-6xl mb-4">👥</div>
              <h2 className="text-2xl font-bold text-white mb-2">No Users Yet</h2>
              <p className="text-slate-400">Users will appear here once they start generating content!</p>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              {users.map((user, index) => (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => handleUserClick(user)}
                  className="bg-slate-800/50 backdrop-blur-sm border border-slate-600/50 rounded-2xl p-6 cursor-pointer hover:bg-slate-700/50 hover:border-slate-500/50 transition-all duration-300 group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {/* Rank Badge */}
                      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-white font-bold text-lg">
                        {index + 1}
                      </div>
                      
                      {/* User Info */}
                      <div>
                        <h3 className="text-white font-semibold text-lg group-hover:text-purple-300 transition-colors">
                          {user.userName || user.userEmail?.split('@')[0] || 'Anonymous User'}
                        </h3>
                        {user.userEmail && (
                          <p className="text-slate-400 text-sm">{user.userEmail}</p>
                        )}
                      </div>
                    </div>

                    {/* Stats Preview */}
                    <div className="flex items-center gap-6">
                      <div className="text-center">
                        <div className="flex items-center gap-1 text-blue-400 font-bold">
                          <Trophy className="w-4 h-4" />
                          {user.totalGenerations}
                        </div>
                        <div className="text-slate-400 text-xs">Total</div>
                      </div>
                      
                      <div className="text-center">
                        <div className="flex items-center gap-1 text-green-400 font-bold">
                          <TrendingUp className="w-4 h-4" />
                          {user.totalWordsGenerated.toLocaleString()}
                        </div>
                        <div className="text-slate-400 text-xs">Words</div>
                      </div>

                      {user.lastActive && (
                        <div className="text-center">
                          <div className="text-slate-300 text-sm">
                            {new Date(user.lastActive.seconds * 1000).toLocaleDateString()}
                          </div>
                          <div className="text-slate-400 text-xs">Last Active</div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Category Breakdown */}
                  <div className="mt-4 pt-4 border-t border-slate-600/50">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-4">
                        <span className="text-red-400">🔥 {user.roastsGenerated} roasts</span>
                        <span className="text-yellow-400">😄 {user.punsGenerated} puns</span>
                        <span className="text-purple-400">🤔 {user.riddlesGenerated} riddles</span>
                        <span className="text-green-400">📚 {user.storiesGenerated} stories</span>
                      </div>
                      <div className="text-slate-400">
                        Click to view full stats →
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </div>

      {/* User Detail Modal */}
      <AnimatePresence>
        {showModal && selectedUser && (
          <UserDetailModal
            user={selectedUser}
            onClose={closeModal}
          />
        )}
      </AnimatePresence>
    </div>
  );
};
