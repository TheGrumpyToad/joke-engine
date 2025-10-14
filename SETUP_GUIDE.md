# 🎭 Comedy Hub - Complete Setup Guide

## 🚀 Quick Start (Automated)

### Option 1: Automated Setup
```bash
# Make setup script executable and run it
chmod +x setup.sh
./setup.sh
```

### Option 2: Manual Setup
```bash
# Install dependencies
npm install

# Create environment file
cp env.example .env.local

# Edit .env.local with your API key
# Then start development server
npm run dev
```

## 📋 Prerequisites

- **Node.js 18+** - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)
- **Groq API Key** (optional) - [Get here](https://console.groq.com/)

## 🔧 Step-by-Step Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
Create `.env.local` file:
```env
# Required for AI content generation
GROQ_API_KEY=your_groq_api_key_here

# Optional settings
GROQ_API_URL=https://api.groq.com/openai/v1/chat/completions
GROQ_MODEL=llama-3.1-70b-versatile
NEXT_PUBLIC_APP_NAME=Comedy Hub
NEXT_PUBLIC_APP_VERSION=1.0.0
```

### 3. Get Groq API Key (Optional)
1. Visit [Groq Console](https://console.groq.com/)
2. Sign up for free account
3. Create new API key
4. Copy key to `.env.local`

### 4. Start Development Server
```bash
npm run dev
```

### 5. Open Browser
Navigate to: [http://localhost:3000](http://localhost:3000)

## 🎯 What You'll See

### Landing Page
- **Hero Section** with animated title
- **Feature Cards** for each comedy category
- **Call-to-Action** buttons
- **Modern Design** with glassmorphism effects

### Comedy Generator
- **Category Navigation** (Roasts, Puns, Riddles, Stories, Adult)
- **One-Click Generation** with loading animations
- **Interactive Elements** (answer reveals for riddles)
- **Responsive Design** for all devices

### Adult Content
- **Age Verification** modal (18+ only)
- **Terms Agreement** required
- **Content Warnings** prominently displayed

## 🛠️ Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## 🎨 Features

### ✅ Working Features
- **Modern UI** with Tailwind CSS
- **Smooth Animations** with Framer Motion
- **Responsive Design** for all devices
- **Age Verification** for adult content
- **API Integration** with Groq
- **Fallback Content** when API unavailable
- **Error Handling** with user feedback

### 🔄 API Integration
- **Real AI Content** via Groq API
- **Fallback System** for offline use
- **Rate Limiting** protection
- **Error Recovery** with graceful degradation

## 🐛 Troubleshooting

### Common Issues

**Q: npm install fails**
A: 
- Check Node.js version (18+ required)
- Clear npm cache: `npm cache clean --force`
- Delete node_modules and package-lock.json, then reinstall

**Q: Development server won't start**
A:
- Check if port 3000 is available
- Try different port: `npm run dev -- -p 3001`
- Check for syntax errors in files

**Q: API not working**
A:
- Verify `.env.local` exists with correct API key
- Check browser console for errors
- Ensure API key is valid at Groq Console
- Restart development server after adding API key

**Q: Styling issues**
A:
- Check Tailwind CSS is properly configured
- Verify `globals.css` is imported in layout
- Clear browser cache

**Q: Build errors**
A:
- Check TypeScript errors: `npm run lint`
- Verify all imports are correct
- Check for missing dependencies

## 📁 Project Structure

```
comedy-hub/
├── app/
│   ├── api/
│   │   └── generate/
│   │       └── route.ts          # API endpoint
│   ├── components/
│   │   ├── AgeVerificationModal.tsx
│   │   └── ComedyGenerator.tsx
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Home page
├── public/                       # Static assets
├── .env.example                  # Environment template
├── .gitignore                    # Git ignore rules
├── next.config.js                # Next.js config
├── package.json                  # Dependencies
├── postcss.config.js             # PostCSS config
├── setup.sh                      # Setup script
├── tailwind.config.js            # Tailwind config
└── tsconfig.json                 # TypeScript config
```

## 🚀 Deployment

### Vercel (Recommended)
1. Push code to GitHub
2. Connect to Vercel
3. Add environment variables
4. Deploy automatically

### Other Platforms
- **Netlify**: Build and deploy `out` folder
- **Railway**: Connect GitHub repo
- **Heroku**: Use Next.js buildpack

## 🎉 Success!

If everything is working correctly, you should see:
- ✅ Beautiful landing page with animations
- ✅ Working comedy generator with all categories
- ✅ Age verification for adult content
- ✅ AI-generated content (with API key)
- ✅ Fallback content (without API key)

## 📞 Support

If you encounter issues:
1. Check this setup guide
2. Review browser console for errors
3. Verify all dependencies are installed
4. Check environment variables are correct

Happy coding! 🎭
