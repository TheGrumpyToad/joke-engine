'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ArrowLeft, 
  Zap, 
  Laugh, 
  Brain, 
  BookOpen, 
  AlertTriangle,
  RefreshCw,
  Eye,
  EyeOff
} from 'lucide-react'

interface ComedyGeneratorProps {
  onBack: () => void
  adultContentVerified: boolean
}

export default function ComedyGenerator({ onBack, adultContentVerified }: ComedyGeneratorProps) {
  const [activeCategory, setActiveCategory] = useState('roasts')
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [showAnswer, setShowAnswer] = useState(false)
  const [currentRiddle, setCurrentRiddle] = useState<{question: string, answer: string} | null>(null)

  const categories = [
    { id: 'roasts', name: 'Roasts', icon: Zap, color: 'from-red-500 to-orange-500', emoji: '🔥' },
    { id: 'puns', name: 'Puns', icon: Laugh, color: 'from-yellow-500 to-green-500', emoji: '😄' },
    { id: 'riddles', name: 'Riddles', icon: Brain, color: 'from-blue-500 to-purple-500', emoji: '🤔' },
    { id: 'stories', name: 'Stories', icon: BookOpen, color: 'from-green-500 to-teal-500', emoji: '📚' },
    { id: 'adult', name: 'Adult Humor', icon: AlertTriangle, color: 'from-pink-500 to-red-500', emoji: '🔞', adult: true }
  ]

  const generateContent = async (category: string) => {
    setLoading(true)
    setContent('')
    setShowAnswer(false)
    setCurrentRiddle(null)

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          category: category,
          prompt: getPromptForCategory(category)
        })
      })
      
      const data = await response.json()
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to generate content')
      }
      
      if (category === 'riddles') {
        // Parse riddle format
        const parts = data.content.split('ANSWER:')
        if (parts.length === 2) {
          const riddleData = {
            question: parts[0].replace('RIDDLE:', '').trim(),
            answer: parts[1].trim()
          }
          setCurrentRiddle(riddleData)
          setContent(riddleData.question)
        } else {
          // Fallback to local content if format is wrong
          const fallbackRiddle = getFallbackRiddle()
          setCurrentRiddle(fallbackRiddle)
          setContent(fallbackRiddle.question)
        }
      } else {
        setContent(data.content)
      }
    } catch (error) {
      console.error('Error generating content:', error)
      // Fallback to local content
      if (category === 'riddles') {
        const fallbackRiddle = getFallbackRiddle()
        setCurrentRiddle(fallbackRiddle)
        setContent(fallbackRiddle.question)
      } else {
        const fallbackContent = getFallbackContent(category)
        setContent(fallbackContent)
      }
    } finally {
      setLoading(false)
    }
  }

  const getPromptForCategory = (category: string): string => {
    const prompts = {
      roasts: "Generate a playful roast that is funny but not mean-spirited.",
      puns: "Generate a clever pun that plays on words.",
      riddles: "Generate a riddle with its answer. Format as 'RIDDLE: [question]' followed by 'ANSWER: [answer]'.",
      stories: "Generate a funny story that is 2-3 paragraphs long.",
      adult: "Generate adult-themed humor that is explicit and crude."
    }
    
    return prompts[category as keyof typeof prompts] || "Generate funny content."
  }

  const getFallbackContent = (category: string): string => {
    const contentMap = {
      roasts: [
        "You're so slow, you make sloths look like Olympic sprinters!",
        "Meet the Dessert Destroyer - you've single-handedly bankrupted every ice cream shop in a 50-mile radius!",
        "Your fashion sense is so bad, even scarecrows dress better than you.",
        "Lionel Pepsi over here thinks he's the CEO of soda companies, but really you're just the guy who puts ice in everything.",
        "You're so lazy, you'd rather starve than get up to eat."
      ],
      puns: [
        "I'm reading a book about anti-gravity. It's impossible to put down!",
        "Why don't scientists trust atoms? Because they make up everything!",
        "I told my wife she was drawing her eyebrows too high. She looked surprised.",
        "Why don't eggs tell jokes? They'd crack each other up!",
        "What do you call a fake noodle? An impasta!"
      ],
      stories: [
        "A man walks into a bar and orders a beer. The bartender says, 'That'll be $5.' The man pays and starts drinking. After a few minutes, he says to the bartender, 'You know, I've been coming here for years, and I've never seen you before.' The bartender replies, 'Well, I've been here for 20 years!' The man says, 'Really? Then why haven't I seen you?' The bartender says, 'Because I've been working the night shift!'",
        "A penguin walks into a bar and asks the bartender, 'Have you seen my brother?' The bartender says, 'I don't know, what does he look like?' The penguin says, 'He's wearing a tuxedo.' The bartender says, 'That doesn't help, all penguins look the same.' The penguin says, 'No, he's the one with the bow tie!'"
      ],
      adult: [
        "Why don't scientists trust atoms? Because they make up everything... just like my ex-girlfriend's orgasms.",
        "What's the difference between a joke and a dick? Your mom can take a joke.",
        "I told my wife she was drawing her eyebrows too high. She looked surprised... and then disappointed when I couldn't perform."
      ]
    }

    const categoryContent = contentMap[category as keyof typeof contentMap]
    if (Array.isArray(categoryContent)) {
      const randomIndex = Math.floor(Math.random() * categoryContent.length)
      return categoryContent[randomIndex]
    }
    
    return "Sorry, there was an error generating content. Please try again."
  }

  const getFallbackRiddle = (): { question: string, answer: string } => {
    const riddles = [
      { question: "What has keys but no locks, space but no room, and you can enter but not go inside?", answer: "A keyboard" },
      { question: "I'm tall when I'm young and short when I'm old. What am I?", answer: "A candle" },
      { question: "What has a head, a tail, but no body?", answer: "A coin" },
      { question: "What gets wetter as it dries?", answer: "A towel" },
      { question: "What has hands but can't clap?", answer: "A clock" }
    ]
    
    const randomIndex = Math.floor(Math.random() * riddles.length)
    return riddles[randomIndex]
  }

  const revealAnswer = () => {
    setShowAnswer(true)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-900 via-secondary-900 to-primary-800 overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-black/20 backdrop-blur-md border-b border-white/10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button 
              onClick={onBack}
              className="btn-secondary flex items-center gap-2"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Home
            </button>
            
            <h1 className="text-2xl font-bold text-white">Comedy Generator</h1>
            
            <div className="w-32" /> {/* Spacer for centering */}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 pb-16">
        {/* Category Navigation */}
        <div className="flex flex-wrap gap-4 mb-8 justify-center">
          {categories.map((category) => {
            if (category.adult && !adultContentVerified) return null
            
            return (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-full transition-all duration-300 ${
                  activeCategory === category.id
                    ? 'bg-white text-black font-bold'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                <category.icon className="w-5 h-5" />
                {category.emoji} {category.name}
              </button>
            )
          })}
        </div>

        {/* Content Area */}
        <div className="max-w-4xl mx-auto">
          {/* Category Header */}
          <motion.div 
            key={activeCategory}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <div className={`w-20 h-20 rounded-2xl bg-gradient-to-r ${
              categories.find(c => c.id === activeCategory)?.color
            } flex items-center justify-center mx-auto mb-4`}>
              {React.createElement(categories.find(c => c.id === activeCategory)?.icon || Zap, {
                className: "w-10 h-10 text-white"
              })}
            </div>
            
            <h2 className="text-4xl font-bold text-white mb-2">
              {categories.find(c => c.id === activeCategory)?.emoji} {categories.find(c => c.id === activeCategory)?.name}
            </h2>
            
            <p className="text-white/70 text-lg">
              {activeCategory === 'roasts' && 'Get ready for some playful burns!'}
              {activeCategory === 'puns' && 'Ready for some wordplay?'}
              {activeCategory === 'riddles' && 'Think you\'re smart? Try solving this!'}
              {activeCategory === 'stories' && 'Settle in for a funny story!'}
              {activeCategory === 'adult' && 'You\'ve been warned! Adult humor ahead.'}
            </p>
          </motion.div>

          {/* Generate Button */}
          <div className="text-center mb-8">
            <button
              onClick={() => generateContent(activeCategory)}
              disabled={loading}
              className="btn-primary text-lg px-8 py-4 flex items-center gap-2 mx-auto disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <RefreshCw className="w-5 h-5" />
                  Generate {categories.find(c => c.id === activeCategory)?.name}
                </>
              )}
            </button>
          </div>

          {/* Content Display */}
          <AnimatePresence mode="wait">
            <motion.div
              key={content}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="card min-h-[200px] max-h-[70vh] overflow-y-auto flex items-center justify-center"
            >
              {loading ? (
                <div className="text-center">
                  <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                  <p className="text-white/70">Generating your {categories.find(c => c.id === activeCategory)?.name.toLowerCase()}...</p>
                </div>
              ) : content ? (
                <div className="text-center">
                  <p className="text-xl text-white leading-relaxed mb-6">
                    {content}
                  </p>
                  
                  {activeCategory === 'riddles' && currentRiddle && (
                    <div className="mt-6">
                      <button
                        onClick={revealAnswer}
                        className="btn-secondary flex items-center gap-2 mx-auto"
                      >
                        {showAnswer ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        {showAnswer ? 'Hide Answer' : 'Reveal Answer'}
                      </button>
                      
                      {showAnswer && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-4 p-4 bg-green-500/20 border border-green-500/30 rounded-xl"
                        >
                          <p className="text-green-300 font-semibold">
                            Answer: {currentRiddle.answer}
                          </p>
                        </motion.div>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center text-white/50">
                  <p className="text-lg">Click the generate button to get started!</p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
