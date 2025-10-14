'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Trophy, TrendingUp, Clock, Calendar, User, Mail } from 'lucide-react';
import { UserStats } from '@/lib/userQuestions';

interface UserDetailModalProps {
  user: UserStats;
  onClose: () => void;
}

export const UserDetailModal = ({ user, onClose }: UserDetailModalProps) => {
  const totalGenerations = user.totalGenerations || 0;
  const roastsGenerated = user.roastsGenerated || 0;
  const punsGenerated = user.punsGenerated || 0;
  const riddlesGenerated = user.riddlesGenerated || 0;
  const storiesGenerated = user.storiesGenerated || 0;
  const totalWordsGenerated = user.totalWordsGenerated || 0;
  const averageResponseTime = user.averageResponseTime || 0;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="bg-slate-800/90 backdrop-blur-xl border border-slate-600/50 rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-2xl font-bold text-white">
                {user.userName?.[0]?.toUpperCase() || user.userEmail?.[0]?.toUpperCase() || 'U'}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <User className="w-6 h-6" />
                  {user.userName || user.userEmail?.split('@')[0] || 'Anonymous User'}
                </h2>
                {user.userEmail && (
                  <p className="text-slate-400 flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    {user.userEmail}
                  </p>
                )}
              </div>
            </div>
            <button
              onClick={onClose}
              className="bg-white/10 hover:bg-white/20 text-white p-2 rounded-lg transition-all duration-300"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-slate-700/50 rounded-xl p-4 text-center">
              <div className="flex items-center justify-center gap-1 text-blue-400 font-bold text-2xl mb-2">
                <Trophy className="w-5 h-5" />
                {totalGenerations}
              </div>
              <div className="text-slate-400 text-sm">Total Generations</div>
            </div>
            
            <div className="bg-slate-700/50 rounded-xl p-4 text-center">
              <div className="flex items-center justify-center gap-1 text-green-400 font-bold text-2xl mb-2">
                <TrendingUp className="w-5 h-5" />
                {totalWordsGenerated.toLocaleString()}
              </div>
              <div className="text-slate-400 text-sm">Words Generated</div>
            </div>

            <div className="bg-slate-700/50 rounded-xl p-4 text-center">
              <div className="flex items-center justify-center gap-1 text-yellow-400 font-bold text-2xl mb-2">
                <Clock className="w-5 h-5" />
                {averageResponseTime > 0 ? `${Math.round(averageResponseTime / 1000)}s` : 'N/A'}
              </div>
              <div className="text-slate-400 text-sm">Avg Response Time</div>
            </div>

            <div className="bg-slate-700/50 rounded-xl p-4 text-center">
              <div className="flex items-center justify-center gap-1 text-purple-400 font-bold text-2xl mb-2">
                <Calendar className="w-5 h-5" />
                {user.createdAt ? new Date(user.createdAt.seconds * 1000).toLocaleDateString() : 'N/A'}
              </div>
              <div className="text-slate-400 text-sm">Joined</div>
            </div>
          </div>

          {/* Category Breakdown */}
          <div className="mb-6">
            <h3 className="text-white font-semibold text-lg mb-4">Content Breakdown</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
                <div className="text-red-400 font-bold text-xl mb-1">🔥 {roastsGenerated}</div>
                <div className="text-slate-400 text-sm">Roasts Generated</div>
                <div className="w-full bg-slate-700 rounded-full h-2 mt-2">
                  <div 
                    className="bg-red-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${totalGenerations > 0 ? (roastsGenerated / totalGenerations) * 100 : 0}%` }}
                  />
                </div>
              </div>

              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4">
                <div className="text-yellow-400 font-bold text-xl mb-1">😄 {punsGenerated}</div>
                <div className="text-slate-400 text-sm">Puns Generated</div>
                <div className="w-full bg-slate-700 rounded-full h-2 mt-2">
                  <div 
                    className="bg-yellow-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${totalGenerations > 0 ? (punsGenerated / totalGenerations) * 100 : 0}%` }}
                  />
                </div>
              </div>

              <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-4">
                <div className="text-purple-400 font-bold text-xl mb-1">🤔 {riddlesGenerated}</div>
                <div className="text-slate-400 text-sm">Riddles Generated</div>
                <div className="w-full bg-slate-700 rounded-full h-2 mt-2">
                  <div 
                    className="bg-purple-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${totalGenerations > 0 ? (riddlesGenerated / totalGenerations) * 100 : 0}%` }}
                  />
                </div>
              </div>

              <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4">
                <div className="text-green-400 font-bold text-xl mb-1">📚 {storiesGenerated}</div>
                <div className="text-slate-400 text-sm">Stories Generated</div>
                <div className="w-full bg-slate-700 rounded-full h-2 mt-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${totalGenerations > 0 ? (storiesGenerated / totalGenerations) * 100 : 0}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Activity Info */}
          <div className="bg-slate-700/30 rounded-xl p-4">
            <h3 className="text-white font-semibold text-lg mb-3">Activity Information</h3>
            <div className="space-y-2 text-sm">
              {user.lastActive && (
                <div className="flex justify-between">
                  <span className="text-slate-400">Last Active:</span>
                  <span className="text-white">
                    {new Date(user.lastActive.seconds * 1000).toLocaleString()}
                  </span>
                </div>
              )}
              {user.createdAt && (
                <div className="flex justify-between">
                  <span className="text-slate-400">Account Created:</span>
                  <span className="text-white">
                    {new Date(user.createdAt.seconds * 1000).toLocaleDateString()}
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-slate-400">User ID:</span>
                <span className="text-white font-mono text-xs">{user.userId}</span>
              </div>
            </div>
          </div>

          {/* Close Button */}
          <div className="mt-6 text-center">
            <button
              onClick={onClose}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-2 px-6 rounded-lg transition-all duration-300"
            >
              Close
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
