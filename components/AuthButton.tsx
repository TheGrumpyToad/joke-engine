'use client';

import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

// Function to generate random emoji
const getRandomEmoji = () => {
  const emojis = ['😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂', '🙂', '🙃', '😉', '😊', '😇', '🥰', '😍', '🤩', '😘', '😗', '😚', '😙', '😋', '😛', '😜', '🤪', '😝', '🤑', '🤗', '🤭', '🤫', '🤔', '🤐', '🤨', '😐', '😑', '😶', '😏', '😒', '🙄', '😬', '🤥', '😌', '😔', '😪', '🤤', '😴', '😷', '🤒', '🤕', '🤢', '🤮', '🤧', '🥵', '🥶', '🥴', '😵', '🤯', '🤠', '🥳', '😎', '🤓', '🧐', '😕', '😟', '🙁', '☹️', '😮', '😯', '😲', '😳', '🥺', '😦', '😧', '😨', '😰', '😥', '😢', '😭', '😱', '😖', '😣', '😞', '😓', '😩', '😫', '🥱', '😤', '😡', '😠', '🤬', '😈', '👿', '💀', '☠️', '💩', '🤡', '👹', '👺', '👻', '👽', '👾', '🤖', '😺', '😸', '😹', '😻', '😼', '😽', '🙀', '😿', '😾'];
  return emojis[Math.floor(Math.random() * emojis.length)];
};

export const AuthButton = () => {
  const { user, signInWithGoogle, logout } = useAuth();
  const [userEmoji, setUserEmoji] = useState('😀');
  const [username, setUsername] = useState('');

  // Generate random emoji when user signs in
  useEffect(() => {
    if (user) {
      setUserEmoji(getRandomEmoji());
      // Extract username from email or use display name
      const emailUsername = user.email?.split('@')[0] || '';
      setUsername(user.displayName || emailUsername || 'User');
    }
  }, [user]);

  if (user) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3 p-3 bg-gradient-to-r from-slate-800/80 to-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-xl shadow-lg"
      >
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-sm shadow-md">
          {userEmoji}
        </div>
        <div className="flex items-center gap-3">
          <div>
            <p className="text-white font-medium text-sm">
              {username}
            </p>
            <p className="text-green-400 text-xs flex items-center gap-1">
              <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
              Signed in
            </p>
          </div>
          <motion.button 
            onClick={logout}
            className="px-3 py-1.5 bg-slate-700/80 hover:bg-slate-600/80 text-slate-300 hover:text-white rounded-lg text-xs font-medium transition-all duration-200 flex items-center gap-2 backdrop-blur-sm border border-slate-600/50 hover:border-slate-500/50"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Sign Out
          </motion.button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full"
    >
      <motion.button 
        onClick={signInWithGoogle}
        className="w-full px-8 py-4 bg-white hover:bg-gray-50 text-gray-900 rounded-2xl font-semibold transition-all duration-300 flex items-center justify-center gap-4 shadow-xl hover:shadow-2xl border border-gray-200 hover:border-gray-300 group"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {/* Google Icon */}
        <svg className="w-6 h-6 group-hover:scale-110 transition-transform duration-200" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
        
        <span className="text-lg">Continue with Google</span>
        
        {/* Arrow Icon */}
        <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
        </svg>
      </motion.button>
      
      <div className="mt-4 text-center">
        <p className="text-slate-400 text-sm">
          Quick, secure, and free
        </p>
        <p className="text-slate-500 text-xs mt-1">
          No passwords required • Your data stays private
        </p>
      </div>
    </motion.div>
  );
};
