'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, RefreshCw, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Head from 'next/head'

export default function RoastsPage() {
  const [content, setContent] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const generateRoasts = async () => {
    setLoading(true)
    try {
      const response = await fetch('/.netlify/functions/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          category: 'roasts',
          prompt: 'Generate 5 varied roasts with silly names and creative comparisons'
        })
      })

      const data = await response.json()
      if (data.success) {
        setContent(data.content)
      } else {
        throw new Error(data.error || 'Failed to generate roasts')
      }
    } catch (error) {
      console.error('Error generating roasts:', error)
      // Fallback content
      setContent(`1. You're so slow, you make sloths look like Olympic sprinters!
2. Meet the Dessert Destroyer - you've single-handedly bankrupted every ice cream shop in a 50-mile radius!
3. Your fashion sense is so bad, even scarecrows dress better than you.
4. Lionel Pepsi over here thinks he's the CEO of soda companies, but really you're just the guy who puts ice in everything.
5. You're so lazy, you'd rather starve than get up to eat.`)
    } finally {
      setLoading(false)
    }
  }

  const clearContent = () => {
    setContent('')
  }

  return (
    <>
      <Head>
        <title>Roast Generator - AI Comedy Roasts | Joke Engine</title>
        <meta name="description" content="Generate hilarious AI-powered roasts instantly. Free roast generator creating witty burns, playful insults, and comedy roasts for entertainment." />
        <meta name="keywords" content="roast generator, AI roasts, comedy roasts, witty burns, playful insults, roast jokes, comedy generator" />
        <meta property="og:title" content="Roast Generator - AI Comedy Roasts | Joke Engine" />
        <meta property="og:description" content="Generate hilarious AI-powered roasts instantly. Free roast generator creating witty burns and playful insults." />
        <meta property="og:url" content="https://joke-engine.com/roasts" />
        <meta name="twitter:title" content="Roast Generator - AI Comedy Roasts" />
        <meta name="twitter:description" content="Generate hilarious AI-powered roasts instantly. Free roast generator creating witty burns and playful insults." />
      </Head>
      <div className="min-h-screen bg-gradient-to-br from-red-900 via-orange-900 to-yellow-800 overflow-y-auto">
      {/* Fixed Header - Always Visible */}
      <div className="sticky top-0 z-50 bg-black/30 backdrop-blur-md border-b border-white/10">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <button 
              onClick={() => router.push('/')}
              className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-300"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </button>
            
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              🔥 Roasts Generator
            </h1>
            
            <button 
              onClick={() => router.push('/')}
              className="bg-red-500/20 hover:bg-red-500/30 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-300"
            >
              <X className="w-4 h-4" />
              Exit
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Compact Title Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-red-500 to-orange-500 flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🔥</span>
          </div>
          
          <h2 className="text-3xl font-bold text-white mb-2">
            🔥 ROASTS INCOMING 🔥
          </h2>
          
          <p className="text-white/70 text-lg max-w-xl mx-auto">
            Get ready for some playful burns! Click below to generate 5 fresh roasts.
          </p>
        </motion.div>

        {/* Generate Button */}
        <div className="text-center mb-8">
          <button
            onClick={generateRoasts}
            disabled={loading}
            className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white font-bold py-3 px-8 rounded-full text-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3 mx-auto"
          >
            {loading ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                Generating Roasts...
              </>
            ) : (
              <>
                <RefreshCw className="w-5 h-5" />
                Generate Roasts 🔥
              </>
            )}
          </button>
        </div>

        {/* Compact Content Display */}
        <AnimatePresence mode="wait">
          <motion.div
            key={content}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="max-w-3xl mx-auto"
          >
            {loading ? (
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 text-center">
                <div className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-white/70 text-lg">Crafting your roasts...</p>
              </div>
            ) : content ? (
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-white">Your Fresh Roasts:</h3>
                  <button
                    onClick={clearContent}
                    className="bg-white/10 hover:bg-white/20 text-white px-3 py-1 rounded-lg flex items-center gap-2 text-sm transition-all duration-300"
                  >
                    <X className="w-3 h-3" />
                    Clear
                  </button>
                </div>
                
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {content.split('\n').map((roast, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-all duration-300"
                    >
                      <p className="text-white text-base leading-relaxed">
                        {roast.trim()}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 text-center">
                <div className="text-4xl mb-4">🎭</div>
                <p className="text-white/70 text-lg">Click the generate button to get started!</p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
      </div>
    </>
  )
}