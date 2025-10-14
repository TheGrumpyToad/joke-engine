# 🔑 Grok API Key Setup Guide

## Quick Setup

To enable AI-powered roast generation, you need a Groq API key:

### Step 1: Get Your API Key
1. Go to [Groq Console](https://console.groq.com/)
2. Sign up for a free account (no credit card required)
3. Create a new API key
4. Copy your API key

### Step 2: Add to Environment
1. Open `.env.local` file in your project root
2. Replace `your_groq_api_key_here` with your actual API key:
   ```env
   GROQ_API_KEY=gsk_your_actual_api_key_here
   ```

### Step 3: Restart Server
```bash
# Stop the current server (Ctrl+C)
# Then restart:
npm run dev
```

## What You Get With Groq API

✅ **Custom Roast Prompts** - Type specific requests like "roast someone who's always late"
✅ **Varied Content** - AI generates unique roasts every time
✅ **Better Quality** - More creative and funny than static content
✅ **Unlimited Generation** - No limits on how many roasts you can create

## Without API Key

The app still works with 15+ pre-written roasts, but you won't get:
- Custom prompt responses
- AI-generated variations
- Dynamic content based on your input

## Troubleshooting

**Q: API not working?**
A: Check that your API key is correct and restart the server

**Q: Getting fallback content?**
A: This means the API call failed - check your internet connection and API key

**Q: Rate limited?**
A: Groq has generous free limits, but if you hit them, wait a moment and try again

---

**Ready to roast with AI? Get your Groq API key and start generating custom burns! 🔥**
