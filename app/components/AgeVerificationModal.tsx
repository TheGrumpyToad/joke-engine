'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { AlertTriangle, Check, X } from 'lucide-react'

interface AgeVerificationModalProps {
  onClose: () => void
  onVerify: () => void
}

export default function AgeVerificationModal({ onClose, onVerify }: AgeVerificationModalProps) {
  const [age, setAge] = useState('')
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [error, setError] = useState('')

  const handleVerify = () => {
    const ageNum = parseInt(age)
    
    if (!age) {
      setError('Please enter your age')
      return
    }
    
    if (ageNum < 18) {
      setError('You must be 18 or older to access adult content')
      return
    }
    
    if (!termsAccepted) {
      setError('You must agree to the terms and conditions')
      return
    }
    
    setError('')
    onVerify()
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 max-w-md w-full"
      >
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-red-500/20 border border-red-500/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-8 h-8 text-red-400" />
          </div>
          
          <h2 className="text-2xl font-bold text-white mb-2">
            🔞 Adult Content Verification
          </h2>
          
          <p className="text-white/70">
            To access adult humor content, please verify your age and agree to our terms.
          </p>
        </div>

        {/* Age Input */}
        <div className="mb-6">
          <label className="block text-white font-semibold mb-2">
            Enter your age:
          </label>
          <input
            type="number"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            placeholder="18+"
            min="18"
            max="120"
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-primary-500 focus:bg-white/20 transition-all duration-300"
          />
        </div>

        {/* Terms Checkbox */}
        <div className="mb-6">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
              className="mt-1 w-5 h-5 text-primary-500 bg-white/10 border border-white/20 rounded focus:ring-primary-500 focus:ring-2"
            />
            <span className="text-white/80 text-sm leading-relaxed">
              I agree that I am 18+ years old and understand this content may contain adult humor, 
              sexual references, and explicit language. I consent to viewing such content.
            </span>
          </label>
        </div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-xl"
          >
            <p className="text-red-300 text-sm">{error}</p>
          </motion.div>
        )}

        {/* Warning Banner */}
        <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-xl">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-red-300 font-semibold text-sm mb-1">
                Content Warning
              </p>
              <p className="text-red-300/80 text-xs leading-relaxed">
                This section contains explicit humor, sexual references, and adult language. 
                Only proceed if you are 18+ and comfortable with such content.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            onClick={onClose}
            className="flex-1 btn-secondary flex items-center justify-center gap-2"
          >
            <X className="w-5 h-5" />
            Cancel
          </button>
          
          <button
            onClick={handleVerify}
            className="flex-1 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg shadow-red-500/25 flex items-center justify-center gap-2"
          >
            <Check className="w-5 h-5" />
            Verify & Continue
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}
